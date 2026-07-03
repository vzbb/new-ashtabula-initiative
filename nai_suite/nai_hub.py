#!/usr/bin/env python3
from __future__ import annotations

import json
import mimetypes
import subprocess
import threading
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

ROOT = Path(__file__).resolve().parent.parent
SCREENSHOT_DIR = ROOT / "sitemap_screenshots"

BASE_COMMANDS: dict[str, list[str]] = {
    "scan": ["./nai", "scan"],
    "deploy": ["./nai", "deploy"],
    "routes": ["./nai", "routes"],
    "screenshots_local": ["./nai", "screenshots"],
    "screenshots_live": ["./nai", "screenshots", "--live"],
    "analyze_screenshots": ["./nai", "analyze-screenshots"],
    "browse_live": ["./nai", "browse"],
    "progress": ["./nai", "progress"],
    "sitemap_validate": ["./nai", "sitemap-validate"],
    "sitemap_render": ["./nai", "sitemap-render-md"],
    "tooling": ["./nai", "tooling"],
}

STATE: dict[str, object] = {
    "running": False,
    "command": None,
    "command_line": None,
    "log": "",
    "returncode": None,
}


def safe_git(args: list[str]) -> str:
    try:
        result = subprocess.run(
            ["git", *args],
            cwd=ROOT,
            text=True,
            capture_output=True,
            check=False,
        )
    except Exception:
        return ""
    if result.returncode != 0:
        return ""
    return result.stdout


def repo_telemetry() -> dict[str, object]:
    root_entries = sorted(ROOT.iterdir(), key=lambda path: path.stat().st_mtime, reverse=True)
    root_files = [path for path in root_entries if path.is_file()]
    noisy_names = {".git", "__pycache__"}
    visible_root_entries = [path for path in root_entries if path.name not in noisy_names]
    websites_dirs = [
        path for path in (ROOT / "websites").iterdir()
        if path.is_dir()
    ] if (ROOT / "websites").exists() else []
    try:
        from nai_suite.sitemap_data import load_public_slugs
        from nai_suite.siteflow import site_dir_for_slug

        canonical_mvp_dirs = {
            site_dir_for_slug(slug).name
            for slug in load_public_slugs()
        }
    except Exception:
        canonical_mvp_dirs = set()
    markdown_files = [path for path in root_files if path.suffix.lower() == ".md"]

    status_lines = [
        line for line in safe_git(["status", "--porcelain"]).splitlines()
        if line.strip()
    ]
    diff_lines = safe_git(["diff", "--numstat"]).splitlines()
    added = 0
    deleted = 0
    for line in diff_lines:
        parts = line.split("\t", 2)
        if len(parts) < 2:
            continue
        try:
            added += int(parts[0]) if parts[0].isdigit() else 0
            deleted += int(parts[1]) if parts[1].isdigit() else 0
        except ValueError:
            continue

    recent_root = []
    for path in visible_root_entries[:8]:
        try:
            stat = path.stat()
        except OSError:
            continue
        recent_root.append(
            {
                "name": path.name,
                "kind": "dir" if path.is_dir() else "file",
                "mtime": int(stat.st_mtime),
                "size": stat.st_size if path.is_file() else None,
            }
        )

    recent_markdown = []
    for path in markdown_files[:6]:
        try:
            stat = path.stat()
        except OSError:
            continue
        recent_markdown.append(
            {
                "name": path.name,
                "mtime": int(stat.st_mtime),
            }
        )

    return {
        "root_file_count": len(root_files),
        "websites_dir_count": len(websites_dirs),
        "mvp_dir_count": len(canonical_mvp_dirs) if canonical_mvp_dirs else len(websites_dirs),
        "root_markdown_count": len(markdown_files),
        "changed_paths": len(status_lines),
        "added_lines": added,
        "deleted_lines": deleted,
        "recent_root": recent_root,
        "recent_markdown": recent_markdown,
    }


def append_log(text: str) -> None:
    STATE["log"] = (str(STATE["log"]) + text)[-200_000:]


def is_true(value: object) -> bool:
    if isinstance(value, bool):
        return value
    if value is None:
        return False
    return str(value).strip().lower() not in {"", "0", "false", "none", "off"}


def clean_text(value: object) -> str:
    return str(value).strip() if value is not None else ""


def as_int(value: object) -> int | None:
    text = clean_text(value)
    if not text:
        return None
    try:
        return int(float(text))
    except ValueError:
        return None


def as_float(value: object) -> float | None:
    text = clean_text(value)
    if not text:
        return None
    try:
        return float(text)
    except ValueError:
        return None


def split_slugs(value: object) -> list[str]:
    text = clean_text(value)
    if not text:
        return []
    raw = text.replace("\n", ",").replace(";", ",")
    return [part.strip() for part in raw.split(",") if part.strip()]


def build_command(name: str, options: dict[str, object] | None = None) -> list[str]:
    options = options or {}
    if name in BASE_COMMANDS and not options:
        return list(BASE_COMMANDS[name])

    if name == "screenshots_custom":
        cmd = ["./nai", "screenshots"]
        if is_true(options.get("live")):
            cmd.append("--live")
        if is_true(options.get("headed")):
            cmd.append("--headed")
        if is_true(options.get("browse_only")):
            cmd.append("--browse-only")
        linger = as_float(options.get("linger"))
        settle_ms = as_int(options.get("settle_ms"))
        slow_mo = as_int(options.get("slow_mo"))
        if linger is not None:
            cmd += ["--linger", str(linger)]
        if settle_ms is not None:
            cmd += ["--settle-ms", str(settle_ms)]
        if slow_mo is not None:
            cmd += ["--slow-mo", str(slow_mo)]
        return cmd

    if name == "browse_custom":
        cmd = ["./nai", "browse"]
        linger = as_float(options.get("linger"))
        settle_ms = as_int(options.get("settle_ms"))
        slow_mo = as_int(options.get("slow_mo"))
        if linger is not None:
            cmd += ["--linger", str(linger)]
        if settle_ms is not None:
            cmd += ["--settle-ms", str(settle_ms)]
        if slow_mo is not None:
            cmd += ["--slow-mo", str(slow_mo)]
        return cmd

    if name == "analyze_custom":
        cmd = ["./nai", "analyze-screenshots"]
        image_dir = clean_text(options.get("image_dir"))
        output = clean_text(options.get("output"))
        model = clean_text(options.get("model"))
        quality = clean_text(options.get("quality"))
        slugs = split_slugs(options.get("slugs"))
        slugs_file = clean_text(options.get("slugs_file"))
        limit = as_int(options.get("limit"))
        temperature = as_float(options.get("temperature"))
        max_tokens = as_int(options.get("max_tokens"))
        sleep = as_float(options.get("sleep"))
        if image_dir:
            cmd += ["--image-dir", image_dir]
        if output:
            cmd += ["--output", output]
        if model:
            cmd += ["--model", model]
        if quality in {"fast", "deep"}:
            cmd += ["--quality", quality]
        if slugs:
            cmd += ["--slugs", *slugs]
        if slugs_file:
            cmd += ["--slugs-file", slugs_file]
        if limit is not None:
            cmd += ["--limit", str(limit)]
        if temperature is not None:
            cmd += ["--temperature", str(temperature)]
        if max_tokens is not None:
            cmd += ["--max-tokens", str(max_tokens)]
        if sleep is not None:
            cmd += ["--sleep", str(sleep)]
        cmd.append("--focus" if is_true(options.get("focus")) else "--no-focus")
        cmd.append("--branding-only" if is_true(options.get("branding_only")) else "--no-branding-only")
        cmd.append("--verify-targets" if is_true(options.get("verify_targets", True)) else "--no-verify-targets")
        return cmd

    if name == "progress_custom":
        cmd = ["./nai", "progress"]
        archive_dir = clean_text(options.get("archive_dir"))
        current_report = clean_text(options.get("current_report"))
        output = clean_text(options.get("output"))
        data_output = clean_text(options.get("data_output"))
        if archive_dir:
            cmd += ["--archive-dir", archive_dir]
        if current_report:
            cmd += ["--current-report", current_report]
        if output:
            cmd += ["--output", output]
        if data_output:
            cmd += ["--data-output", data_output]
        if is_true(options.get("open")):
            cmd.append("--open")
        return cmd

    if name in BASE_COMMANDS:
        return list(BASE_COMMANDS[name])

    raise KeyError(name)


def command_line(cmd: list[str]) -> str:
    return "$ " + " ".join(cmd)


def run_command(name: str, options: dict[str, object] | None = None) -> None:
    cmd = build_command(name, options)
    STATE["running"] = True
    STATE["command"] = name
    STATE["command_line"] = command_line(cmd)
    STATE["returncode"] = None
    STATE["log"] = f"{STATE['command_line']}\n\n"
    try:
        process = subprocess.Popen(
            cmd,
            cwd=ROOT,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
        )
        assert process.stdout is not None
        for line in process.stdout:
            append_log(line)
        process.wait()
        STATE["returncode"] = process.returncode
        append_log(f"\n[exit {process.returncode}]\n")
    except Exception as exc:  # pragma: no cover - defensive runtime guard
        STATE["returncode"] = 1
        append_log(f"\n[error] {exc}\n")
    finally:
        STATE["running"] = False


def parse_run_request(handler: BaseHTTPRequestHandler) -> tuple[str, dict[str, object]]:
    parsed = urlparse(handler.path)
    command = parse_qs(parsed.query).get("command", [""])[0]
    options: dict[str, object] = {}
    length = int(handler.headers.get("Content-Length") or 0)
    if length:
        raw = handler.rfile.read(length).decode("utf-8", "replace").strip()
        if raw:
            try:
                payload = json.loads(raw)
            except json.JSONDecodeError:
                payload = {}
            if isinstance(payload, dict):
                command = str(payload.get("command") or command)
                if isinstance(payload.get("options"), dict):
                    options = dict(payload["options"])  # type: ignore[index]
    return command, options


HTML = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>NAI Hub</title>
  <style>
    :root {
      --bg: #090909;
      --panel: rgba(20, 20, 20, .96);
      --panel-2: rgba(29, 29, 29, .96);
      --panel-3: rgba(36, 36, 36, .94);
      --text: #f3f4f6;
      --muted: #a0a8b3;
      --accent: #7fa8ff;
      --accent-2: #5d8cff;
      --danger: #ff8c8c;
      --warning: #ffc96d;
      --border: rgba(114, 152, 230, .24);
      --shadow: 0 24px 80px rgba(0,0,0,.28);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, "Segoe UI", sans-serif;
      font-size: 14px;
      background:
        radial-gradient(circle at top left, rgba(93,140,255,.14), transparent 26%),
        radial-gradient(circle at top right, rgba(255,255,255,.05), transparent 24%),
        var(--bg);
      color: var(--text);
    }
    .wrap {
      max-width: 1520px;
      margin: 0 auto;
      padding: 16px;
    }
    .hero, .panel {
      background: linear-gradient(180deg, var(--panel-2), var(--panel));
      border: 1px solid var(--border);
      border-radius: 18px;
      box-shadow: var(--shadow);
    }
    .hero {
      padding: 10px 14px;
      margin-bottom: 10px;
    }
    h1 {
      margin: 0;
      font-size: 23px;
      line-height: 1.05;
      letter-spacing: -0.05em;
    }
    .tabs, .toolbar {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      align-items: center;
    }
    .telemetry-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
      margin-top: 10px;
    }
    .metric-card {
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 8px 10px;
      background: rgba(255,255,255,.02);
      min-width: 0;
    }
    .metric-card .label {
      display: block;
      font-size: 10px;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 6px;
    }
    .metric-card .value {
      display: flex;
      gap: 8px;
      align-items: baseline;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -.03em;
      flex-wrap: wrap;
    }
    .metric-card .subvalue {
      color: var(--muted);
      font-size: 11px;
      line-height: 1.3;
      margin-top: 2px;
    }
    .delta-plus { color: var(--accent); }
    .delta-minus { color: var(--danger); }
    .delta-neutral { color: #b7c0d1; }
    .tabs { margin: 12px 0; }
    .tab {
      border-radius: 999px;
      padding: 8px 13px;
      border: 1px solid var(--border);
      background: rgba(132,182,255,.08);
      color: var(--text);
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
    }
    .tab.active {
      border-color: var(--accent-2);
      background: linear-gradient(180deg, rgba(132,182,255,.18), rgba(115,221,178,.12));
    }
    .view { display: none; }
    .view.active { display: block; }
    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1.55fr) minmax(340px, .9fr);
      gap: 12px;
      align-items: start;
    }
    .stack {
      display: grid;
      gap: 12px;
    }
    .panel { padding: 14px; }
    .panel-title {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 10px;
    }
    .panel-title h2, .panel-title h3 {
      margin: 0;
      letter-spacing: -0.02em;
    }
    .panel-title h2 { font-size: 16px; }
    .panel-title h3 { font-size: 14px; }
    .panel-title .desc {
      margin: 4px 0 0;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.4;
      max-width: 760px;
    }
    .badge {
      border-radius: 999px;
      padding: 4px 10px;
      border: 1px solid var(--border);
      color: var(--muted);
      font-size: 12px;
      white-space: nowrap;
      background: rgba(255,255,255,.03);
    }
    .badge.safe { color: var(--accent); }
    .badge.warn { color: var(--warning); }
    .badge.danger { color: var(--danger); }
    .quick-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }
    .quick-grid.tight {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    button, input, select {
      font: inherit;
    }
    button.quick, button.run {
      border: 1px solid var(--border);
      background: linear-gradient(180deg, rgba(93,140,255,.14), rgba(255,255,255,.03));
      color: var(--text);
      border-radius: 12px;
      padding: 10px 12px;
      text-align: left;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
    }
    button.quick:hover, button.run:hover { border-color: var(--accent-2); }
    button.quick:disabled, button.run:disabled { opacity: .55; cursor: not-allowed; }
    button.run {
      background: linear-gradient(180deg, rgba(93,140,255,.18), rgba(255,255,255,.04));
      font-size: 14px;
    }
    button.run.danger {
      background: linear-gradient(180deg, rgba(255,141,141,.14), rgba(255,255,255,.03));
    }
    .command-card {
      background: linear-gradient(180deg, var(--panel-3), rgba(13,24,48,.92));
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 12px;
      display: grid;
      gap: 10px;
    }
    .command-card header {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: flex-start;
    }
    .command-card .help {
      margin: 4px 0 0;
      font-size: 12px;
      line-height: 1.45;
      color: var(--muted);
    }
    .field-grid {
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .field-grid.two {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .field {
      display: grid;
      gap: 5px;
      min-width: 0;
    }
    .field label,
    .check {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .11em;
      color: var(--muted);
    }
    .field input,
    .field select {
      width: 100%;
      border: 1px solid rgba(136,181,255,.22);
      border-radius: 10px;
      padding: 8px 10px;
      background: rgba(3,10,20,.55);
      color: var(--text);
      min-width: 0;
    }
    .field input::placeholder { color: rgba(151,172,208,.5); }
    .check-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }
    .check {
      display: flex;
      gap: 8px;
      align-items: center;
      text-transform: none;
      letter-spacing: 0;
      color: var(--text);
      font-size: 12px;
    }
    .check input { accent-color: var(--accent-2); }
    .command-preview {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: center;
      border: 1px solid rgba(136,181,255,.16);
      border-radius: 12px;
      padding: 8px 10px;
      background: rgba(255,255,255,.02);
      min-width: 0;
    }
    .command-preview span {
      color: var(--muted);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .12em;
      flex: 0 0 auto;
    }
    .command-preview code {
      color: #dce7f8;
      font: 12px/1.35 "SFMono-Regular", Consolas, monospace;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
      flex: 1 1 auto;
      text-align: right;
    }
    .pill {
      border-radius: 999px;
      padding: 5px 10px;
      font-size: 13px;
      border: 1px solid var(--border);
      color: var(--muted);
      background: rgba(132,182,255,.05);
    }
    .pill.code {
      font-family: "SFMono-Regular", Consolas, monospace;
      font-size: 12px;
    }
    .statusbar .pill.code {
      flex: 1 1 480px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .pill.ok { color: var(--accent); }
    .pill.bad { color: var(--danger); }
    .pill.warn { color: var(--warning); }
    .help-line {
      margin: 0;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.45;
    }
    .sidebar {
      display: grid;
      gap: 12px;
      position: sticky;
      top: 12px;
    }
    .log-wrap {
      display: grid;
      gap: 10px;
    }
    .meta {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      align-items: center;
    }
    pre {
      margin: 0;
      min-height: 560px;
      max-height: 75vh;
      overflow: auto;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      word-break: break-word;
      user-select: text;
      border-radius: 16px;
      padding: 14px;
      background: #08101d;
      border: 1px solid #1a2d4d;
      color: #dce7f8;
      font: 11px/1.4 "SFMono-Regular", Consolas, monospace;
    }
    iframe {
      width: 100%;
      min-height: 75vh;
      border: 1px solid var(--border);
      border-radius: 18px;
      background: white;
    }
    a.link {
      color: var(--accent-2);
      text-decoration: none;
      font-weight: 600;
      font-size: 13px;
    }
    .fineprint {
      margin: 0;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.45;
    }
    .recent-list {
      display: grid;
      gap: 4px;
    }
    .recent-item {
      display: flex;
      gap: 10px;
      justify-content: space-between;
      align-items: center;
      padding: 6px 8px;
      border-radius: 10px;
      border: 1px solid rgba(136,181,255,.12);
      background: rgba(255,255,255,.02);
    }
    .recent-item strong {
      font-size: 12px;
      line-height: 1.2;
      word-break: break-word;
      min-width: 0;
    }
    .recent-item span {
      color: var(--muted);
      font-size: 11px;
      text-align: right;
      white-space: nowrap;
      flex: 0 0 auto;
    }
    details.compact {
      border: 1px solid rgba(136,181,255,.14);
      border-radius: 12px;
      background: rgba(3,10,20,.28);
      padding: 8px 10px;
    }
    details.compact summary {
      cursor: pointer;
      color: var(--text);
      font-weight: 600;
      font-size: 13px;
    }
    details.compact[open] summary {
      margin-bottom: 8px;
    }
    @media (max-width: 980px) {
      .layout { grid-template-columns: 1fr; }
      .telemetry-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .field-grid,
      .field-grid.two,
      .quick-grid,
      .quick-grid.tight { grid-template-columns: 1fr; }
      iframe, pre { min-height: 420px; }
      .sidebar { position: static; }
    }
    @media (max-width: 620px) {
      .telemetry-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <section class="hero">
      <h1>NAI Control Room</h1>
      <div class="telemetry-grid">
        <div class="metric-card" title="Tracked repo delta from the current git worktree.">
          <span class="label">Repo delta</span>
          <div class="value">
            <span id="delta-plus" class="delta-plus">+0</span>
            <span id="delta-minus" class="delta-minus">-0</span>
            <span id="delta-neutral" class="delta-neutral">0 paths</span>
          </div>
          <div id="delta-sub" class="subvalue">Waiting for repo telemetry...</div>
        </div>
        <div class="metric-card" title="Top-level files in the repo root. Useful for spotting clutter or growth.">
          <span class="label">Root files</span>
          <div class="value"><span id="root-file-count">0</span></div>
          <div class="subvalue">Files directly inside the main repo root</div>
        </div>
        <div class="metric-card" title="Count of site directories inside websites/.">
          <span class="label">MVP dirs</span>
          <div class="value"><span id="mvp-dir-count">0</span></div>
          <div class="subvalue">Canonical route-backed site folders</div>
        </div>
        <div class="metric-card" title="Markdown files directly in the root directory.">
          <span class="label">Root markdown</span>
          <div class="value"><span id="root-markdown-count">0</span></div>
          <div class="subvalue">Human-facing docs sitting in the root</div>
        </div>
      </div>
    </section>

    <div class="tabs">
      <button class="tab active" data-tab="control">Control</button>
      <button class="tab" data-tab="gallery">Live Gallery</button>
      <button class="tab" data-tab="progress">Progress</button>
    </div>

    <section id="view-control" class="view active">
      <div class="layout">
        <div class="stack">
          <section class="panel">
            <div class="panel-title">
              <div>
                <h2>Repository health</h2>
                <p class="desc">Checks and maintenance actions for the canonical sitemap, route table, and tool registry. A few of these write files, so the button labels are literal.</p>
              </div>
              <span class="badge warn">mixed</span>
            </div>
            <div class="quick-grid tight">
              <button class="quick" data-command="scan" data-lockable title="Inspect build and route state across the repo. No files are changed.">Scan build / route state</button>
              <button class="quick" data-command="sitemap_validate" data-lockable title="Validate the canonical SITEMAP.json structure and counts.">Validate sitemap JSON</button>
              <button class="quick" data-command="sitemap_render" data-lockable title="Regenerate the human-readable SITEMAP.md from canonical JSON.">Render SITEMAP.md</button>
              <button class="quick" data-command="tooling" data-lockable title="Refresh the tooling registry that classifies scripts as core, support, or legacy.">Refresh tooling registry</button>
              <button class="quick" data-command="routes" data-lockable title="Rebuild vercel.json from canonical sitemap data and run the route sync.">Regenerate routes</button>
            </div>
            <p class="fineprint">`Scan` and `Validate sitemap JSON` are read-oriented. `Render`, `Tooling`, and `Regenerate routes` intentionally update tracked files.</p>
          </section>

          <section class="panel">
            <div class="panel-title">
              <div>
                <h2>Release / production</h2>
                <p class="desc">Use this lane when the repo is already in good shape and you want to push a production build. The deploy button is intentionally guarded so it never feels accidental.</p>
              </div>
              <span class="badge danger">careful</span>
            </div>
            <div class="check-row">
              <label class="check" title="Require an explicit acknowledgement before the deploy button activates.">
                <input id="deploy-confirm" type="checkbox" data-lockable>
                I understand this runs a full production deploy
              </label>
            </div>
            <div class="quick-grid">
              <button class="run danger" id="deploy-button" data-command="deploy" data-lockable disabled title="Run the full build and deploy flow through Vercel.">Deploy production</button>
              <button class="quick" data-command="browse_live" data-lockable title="Open the live production URLs in a visible browser.">Browse live URLs</button>
            </div>
            <p class="fineprint">If you are unsure, do not deploy. Scan or browse first, then come back here when the repo is ready.</p>
          </section>

          <section class="panel">
            <div class="panel-title">
              <div>
                <h2>Visual QA</h2>
                <p class="desc">Screenshot capture, vision analysis, and the score dashboard all live here. Each form shows the exact command line and only exposes the flags that the underlying CLI actually understands.</p>
              </div>
              <span class="badge warn">operator</span>
            </div>

            <form class="command-card" data-command-form="screenshots_custom" data-lockable>
              <header>
                <div>
                  <h3>Screenshot capture</h3>
                  <p class="help">Capture local build previews by default. Flip to live only when you want production URLs. The extra flags are surfaced here so you never have to remember them.</p>
                </div>
                <span class="badge">capture</span>
              </header>
              <div class="check-row">
                <label class="check" title="Use production URLs instead of local build previews.">
                  <input type="checkbox" name="live" data-lockable>
                  live URLs
                </label>
                <label class="check" title="Show the browser window while the captures run.">
                  <input type="checkbox" name="headed" data-lockable>
                  headed browser
                </label>
                <label class="check" title="Visit pages without taking screenshots. Useful for a quick smoke test.">
                  <input type="checkbox" name="browse_only" data-lockable>
                  browse only
                </label>
              </div>
              <div class="field-grid">
                <div class="field">
                  <label title="Seconds to pause on each site before capture.">linger</label>
                  <input type="number" name="linger" min="0" step="0.1" placeholder="default" data-lockable>
                </div>
                <div class="field">
                  <label title="Extra milliseconds to wait after the page looks stable before capture. Useful for slow-loading assets or animations.">settle ms</label>
                  <input type="number" name="settle_ms" min="0" step="50" placeholder="default" data-lockable>
                </div>
                <div class="field">
                  <label title="Artificial delay between browser actions in milliseconds. Handy when you want to visibly watch the pass or avoid rushing flaky pages.">slow mo</label>
                  <input type="number" name="slow_mo" min="0" step="10" placeholder="0" data-lockable>
                </div>
              </div>
              <div class="command-preview"><span>preview</span><code data-preview-for="screenshots_custom">./nai screenshots</code></div>
              <button class="run" type="submit" data-lockable title="Run the screenshot capture with the options above.">Run screenshot capture</button>
            </form>

            <form class="command-card" data-command-form="analyze_custom" data-lockable>
              <header>
                <div>
                  <h3>Screenshot analysis</h3>
                  <p class="help">Run the vision pass that converts the screenshot gallery into structured scoring and branding data. Use focused or branding-only modes when you want a narrower read.</p>
                </div>
                <span class="badge">analyze</span>
              </header>
              <div class="field-grid two">
                <div class="field">
                  <label title="Choose the speed/quality preset when no model is specified.">quality</label>
                  <select name="quality" data-lockable>
                    <option value="fast" selected>fast</option>
                    <option value="deep">deep</option>
                  </select>
                </div>
                <div class="field">
                  <label title="Optional explicit OpenRouter model id. Leave blank to use the quality preset.">model</label>
                  <input type="text" name="model" list="model-presets" placeholder="e.g. google/gemini-2.5-pro-preview" data-lockable>
                  <datalist id="model-presets">
                    <option value="google/gemini-2.5-pro-preview"></option>
                    <option value="google/gemini-2.5-flash"></option>
                    <option value="google/gemini-2.0-flash-001"></option>
                    <option value="openai/gpt-5-mini"></option>
                    <option value="anthropic/claude-3.7-sonnet"></option>
                  </datalist>
                  <p class="help-line">Example format: <code>google/gemini-2.5-pro-preview</code> or pick from the built-in presets by typing a few letters.</p>
                </div>
              </div>
              <details class="compact">
                <summary>Advanced analysis options</summary>
                <div class="field-grid" style="margin-top:8px;">
                  <div class="field">
                    <label title="Optional comma-separated slugs to analyze.">slugs</label>
                    <input type="text" name="slugs" placeholder="e.g. hvac, roofquote" data-lockable>
                  </div>
                  <div class="field">
                    <label title="Optional newline-delimited file of slugs to analyze.">slugs file</label>
                    <input type="text" name="slugs_file" placeholder="optional path" data-lockable>
                  </div>
                  <div class="field">
                    <label title="Limit the number of screenshots analyzed, useful for testing.">limit</label>
                    <input type="number" name="limit" min="1" step="1" placeholder="optional" data-lockable>
                  </div>
                </div>
                <div class="field-grid" style="margin-top:8px;">
                  <div class="field">
                    <label title="Sampling temperature for the analysis model.">temperature</label>
                    <input type="number" name="temperature" min="0" step="0.1" placeholder="0.2" data-lockable>
                  </div>
                  <div class="field">
                    <label title="Maximum completion tokens per image.">max tokens</label>
                    <input type="number" name="max_tokens" min="1" step="1" placeholder="2200" data-lockable>
                  </div>
                  <div class="field">
                    <label title="Seconds to sleep between requests.">sleep</label>
                    <input type="number" name="sleep" min="0" step="0.1" placeholder="0" data-lockable>
                  </div>
                </div>
                <div class="field-grid two" style="margin-top:8px;">
                  <div class="field">
                    <label title="Directory containing screenshot images.">image dir</label>
                    <input type="text" name="image_dir" placeholder="sitemap_screenshots" data-lockable>
                  </div>
                  <div class="field">
                    <label title="Path to write the JSON analysis report.">output</label>
                    <input type="text" name="output" placeholder="sitemap_screenshots/visual_analysis_report.json" data-lockable>
                  </div>
                </div>
              </details>
              <div class="check-row">
                <label class="check" title="Use few-shot calibration examples for a focused subject pass.">
                  <input type="checkbox" name="focus" data-lockable>
                  focus pass
                </label>
                <label class="check" title="Only revise branding and target fields and merge them into the existing report.">
                  <input type="checkbox" name="branding_only" data-lockable>
                  branding only
                </label>
                <label class="check" title="Use web search to verify candidate target entities.">
                  <input type="checkbox" name="verify_targets" checked data-lockable>
                  verify targets
                </label>
              </div>
              <div class="command-preview"><span>preview</span><code data-preview-for="analyze_custom">./nai analyze-screenshots</code></div>
              <button class="run" type="submit" data-lockable title="Run the screenshot analysis with the options above.">Run analysis</button>
            </form>

            <form class="command-card" data-command-form="browse_custom" data-lockable>
              <header>
                <div>
                  <h3>Live browser pass</h3>
                  <p class="help">Open the live production URLs in a visible browser. This is a better fit for a quick operator review than remembering the browse flags by hand.</p>
                </div>
                <span class="badge">live</span>
              </header>
              <div class="field-grid">
                <div class="field">
                  <label title="Seconds to pause on each site before moving on.">linger</label>
                  <input type="number" name="linger" min="0" step="0.1" placeholder="default" data-lockable>
                </div>
                <div class="field">
                  <label title="Milliseconds to wait after a page settles before moving on.">settle ms</label>
                  <input type="number" name="settle_ms" min="0" step="50" placeholder="default" data-lockable>
                </div>
                <div class="field">
                  <label title="Delay between browser actions in milliseconds.">slow mo</label>
                  <input type="number" name="slow_mo" min="0" step="10" placeholder="0" data-lockable>
                </div>
              </div>
              <div class="command-preview"><span>preview</span><code data-preview-for="browse_custom">./nai browse</code></div>
              <button class="run" type="submit" data-lockable title="Run the visible live URL browser pass with the options above.">Browse live URLs</button>
            </form>

            <form class="command-card" data-command-form="progress_custom" data-lockable>
              <header>
                <div>
                  <h3>Progress dashboard</h3>
                  <p class="help">Build the score-focused progress dashboard from archived JSON reports. This is the cleanest place to see trend data without keeping every screenshot around.</p>
                </div>
                <span class="badge">trend</span>
              </header>
              <div class="field-grid two">
                <div class="field">
                  <label title="Directory holding timestamped analysis report snapshots.">archive dir</label>
                  <input type="text" name="archive_dir" placeholder=".sitemap_screenshots_analysis_archive" data-lockable>
                </div>
                <div class="field">
                  <label title="Current visual_analysis_report.json to include in the dashboard.">current report</label>
                  <input type="text" name="current_report" placeholder="sitemap_screenshots/visual_analysis_report.json" data-lockable>
                </div>
              </div>
              <div class="field-grid two">
                <div class="field">
                  <label title="Output HTML file for the dashboard.">output</label>
                  <input type="text" name="output" placeholder="sitemap_screenshots/progress.html" data-lockable>
                </div>
                <div class="field">
                  <label title="Compact JSON data payload used by the dashboard.">data output</label>
                  <input type="text" name="data_output" placeholder="sitemap_screenshots/progress_data.json" data-lockable>
                </div>
              </div>
              <div class="check-row">
                <label class="check" title="Open the generated dashboard after it is built.">
                  <input type="checkbox" name="open" data-lockable>
                  open after build
                </label>
              </div>
              <div class="command-preview"><span>preview</span><code data-preview-for="progress_custom">./nai progress</code></div>
              <button class="run" type="submit" data-lockable title="Run the dashboard build with the options above.">Build progress dashboard</button>
            </form>
          </section>
        </div>

        <aside class="sidebar">
          <section class="panel">
            <div class="panel-title">
              <div>
                <h2>Repo wire-up</h2>
                <p class="desc">A compact live glance at what changed most recently in the repo root. This is meant to help you orient before clicking anything.</p>
              </div>
            </div>
            <div class="recent-list" id="recent-root-list">
              <div class="recent-item">
                <strong>Loading recent root files...</strong>
                <span>Waiting</span>
              </div>
            </div>
            <details class="compact">
              <summary>Recent root markdown files</summary>
              <div class="recent-list" id="recent-markdown-list">
                <div class="recent-item">
                  <strong>Loading markdown activity...</strong>
                  <span>Waiting</span>
                </div>
              </div>
            </details>
          </section>

          <section class="panel log-wrap">
            <div class="panel-title">
              <div>
                <h2>Live status</h2>
                <p class="desc">This panel shows the active command, current exit state, and the raw log stream. It is intentionally plain so you can trust what it says at a glance.</p>
              </div>
            </div>
            <div class="meta">
              <span id="running" class="pill">Idle</span>
              <span id="command" class="pill">No command running</span>
              <span id="code" class="pill code">No result yet</span>
              <button class="quick" id="copy-log" type="button" style="padding:6px 10px; font-size:12px;">Copy output</button>
            </div>
            <span id="current-line" class="pill code">Waiting for a command...</span>
            <pre id="log">Waiting for a command...</pre>
          </section>
        </aside>
      </div>
    </section>

    <section id="view-gallery" class="view">
      <div class="panel">
        <div class="toolbar">
          <button class="quick" data-command="screenshots_live" data-lockable title="Refresh the gallery using live production URLs.">Refresh live screenshots</button>
          <button class="quick" data-command="analyze_screenshots" data-lockable title="Analyze the currently captured gallery and write a fresh JSON report.">Analyze current gallery</button>
          <a class="link" href="/sitemap_screenshots/index.html" target="_blank" rel="noopener noreferrer">Open gallery in new tab</a>
        </div>
        <iframe id="gallery-frame" src="/sitemap_screenshots/index.html" title="Sitemap screenshot gallery"></iframe>
      </div>
    </section>

    <section id="view-progress" class="view">
      <div class="panel">
        <div class="toolbar">
          <button class="quick" data-command="progress" data-lockable title="Rebuild the score-focused progress dashboard from the archived JSON reports.">Rebuild progress view</button>
          <a class="link" href="/sitemap_screenshots/progress.html" target="_blank" rel="noopener noreferrer">Open progress in new tab</a>
        </div>
        <iframe id="progress-frame" src="/sitemap_screenshots/progress.html" title="Progress dashboard"></iframe>
      </div>
    </section>
  </div>

  <script>
    const quickButtons = [...document.querySelectorAll("button[data-command][data-lockable]")];
    const forms = [...document.querySelectorAll("form[data-command-form]")];
    const tabs = [...document.querySelectorAll(".tab")];
    const views = [...document.querySelectorAll(".view")];
    const runningEl = document.getElementById("running");
    const commandEl = document.getElementById("command");
    const codeEl = document.getElementById("code");
    const currentLineEl = document.getElementById("current-line");
    const logEl = document.getElementById("log");
    const deltaPlusEl = document.getElementById("delta-plus");
    const deltaMinusEl = document.getElementById("delta-minus");
    const deltaNeutralEl = document.getElementById("delta-neutral");
    const deltaSubEl = document.getElementById("delta-sub");
    const rootFileCountEl = document.getElementById("root-file-count");
    const mvpDirCountEl = document.getElementById("mvp-dir-count");
    const rootMarkdownCountEl = document.getElementById("root-markdown-count");
    const recentRootListEl = document.getElementById("recent-root-list");
    const recentMarkdownListEl = document.getElementById("recent-markdown-list");
    const deployConfirm = document.getElementById("deploy-confirm");
    const deployButton = document.getElementById("deploy-button");
    const copyLogButton = document.getElementById("copy-log");

    function formatTime(epochSeconds) {
      if (!epochSeconds) return "unknown time";
      const dt = new Date(epochSeconds * 1000);
      return dt.toLocaleString();
    }

    function renderRecentItems(container, items, emptyLabel) {
      if (!container) return;
      if (!items || !items.length) {
        container.innerHTML = `<div class="recent-item"><strong>${emptyLabel}</strong><span>No items to show</span></div>`;
        return;
      }
      container.innerHTML = items.map(item => `
        <div class="recent-item">
          <strong>${item.name}</strong>
          <span>${item.kind ? item.kind + " · " : ""}${formatTime(item.mtime)}</span>
        </div>
      `).join("");
    }

    function formValue(form, name) {
      const field = form.querySelector(`[name="${name}"]`);
      if (!field) return "";
      if (field.type === "checkbox") return field.checked;
      return field.value.trim();
    }

    function previewForForm(form) {
      const command = form.dataset.commandForm;
      const parts = [];
      if (command === "screenshots_custom") {
        parts.push("./nai", "screenshots");
        if (formValue(form, "live")) parts.push("--live");
        if (formValue(form, "headed")) parts.push("--headed");
        if (formValue(form, "browse_only")) parts.push("--browse-only");
        const linger = formValue(form, "linger");
        const settleMs = formValue(form, "settle_ms");
        const slowMo = formValue(form, "slow_mo");
        if (linger) parts.push("--linger", linger);
        if (settleMs) parts.push("--settle-ms", settleMs);
        if (slowMo) parts.push("--slow-mo", slowMo);
      } else if (command === "browse_custom") {
        parts.push("./nai", "browse");
        const linger = formValue(form, "linger");
        const settleMs = formValue(form, "settle_ms");
        const slowMo = formValue(form, "slow_mo");
        if (linger) parts.push("--linger", linger);
        if (settleMs) parts.push("--settle-ms", settleMs);
        if (slowMo) parts.push("--slow-mo", slowMo);
      } else if (command === "analyze_custom") {
        parts.push("./nai", "analyze-screenshots");
        const imageDir = formValue(form, "image_dir");
        const output = formValue(form, "output");
        const model = formValue(form, "model");
        const quality = formValue(form, "quality");
        const slugs = formValue(form, "slugs");
        const slugsFile = formValue(form, "slugs_file");
        const limit = formValue(form, "limit");
        const temperature = formValue(form, "temperature");
        const maxTokens = formValue(form, "max_tokens");
        const sleep = formValue(form, "sleep");
        if (imageDir) parts.push("--image-dir", imageDir);
        if (output) parts.push("--output", output);
        if (model) parts.push("--model", model);
        if (quality) parts.push("--quality", quality);
        if (slugs) parts.push("--slugs", slugs);
        if (slugsFile) parts.push("--slugs-file", slugsFile);
        if (limit) parts.push("--limit", limit);
        if (temperature) parts.push("--temperature", temperature);
        if (maxTokens) parts.push("--max-tokens", maxTokens);
        if (sleep) parts.push("--sleep", sleep);
        parts.push(formValue(form, "focus") ? "--focus" : "--no-focus");
        parts.push(formValue(form, "branding_only") ? "--branding-only" : "--no-branding-only");
        parts.push(formValue(form, "verify_targets") ? "--verify-targets" : "--no-verify-targets");
      } else if (command === "progress_custom") {
        parts.push("./nai", "progress");
        const archiveDir = formValue(form, "archive_dir");
        const currentReport = formValue(form, "current_report");
        const output = formValue(form, "output");
        const dataOutput = formValue(form, "data_output");
        if (archiveDir) parts.push("--archive-dir", archiveDir);
        if (currentReport) parts.push("--current-report", currentReport);
        if (output) parts.push("--output", output);
        if (dataOutput) parts.push("--data-output", dataOutput);
        if (formValue(form, "open")) parts.push("--open");
      }
      return parts.join(" ");
    }

    function updatePreviews() {
      forms.forEach(form => {
        const preview = form.querySelector("[data-preview-for]");
        if (preview) preview.textContent = previewForForm(form);
      });
    }

    function serializeForm(form) {
      const payload = {};
      new FormData(form).forEach((value, key) => {
        if (payload[key] === undefined) {
          payload[key] = value;
        } else if (Array.isArray(payload[key])) {
          payload[key].push(value);
        } else {
          payload[key] = [payload[key], value];
        }
      });
      for (const el of form.querySelectorAll("input[type=checkbox]")) {
        payload[el.name] = el.checked;
      }
      return payload;
    }

    async function runCommand(command, options = {}) {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command, options }),
      });
      const data = await res.json();
      if (!data.ok) {
        alert(data.error || "Command failed to start");
      }
      refresh();
    }

    function activateTab(name) {
      tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.tab === name));
      views.forEach(view => view.classList.toggle("active", view.id === "view-" + name));
    }

    function setLockableDisabled(disabled) {
      document.querySelectorAll("[data-lockable]").forEach(el => {
        el.disabled = disabled;
      });
    }

    async function refresh() {
      const [statusRes, telemetryRes] = await Promise.all([
        fetch("/api/status"),
        fetch("/api/telemetry"),
      ]);
      const data = await statusRes.json();
      const telemetry = await telemetryRes.json();
      runningEl.textContent = data.running ? "Running" : "Idle";
      runningEl.className = "pill " + (data.running ? "ok" : "");
      commandEl.textContent = data.command || "No command running";
      currentLineEl.textContent = data.command_line || "Waiting for a command...";
      if (data.returncode === null || data.returncode === undefined) {
        codeEl.textContent = data.running ? "In progress" : "No result yet";
        codeEl.className = "pill code";
      } else if (data.returncode === 0) {
        codeEl.textContent = "Exit 0";
        codeEl.className = "pill code ok";
      } else {
        codeEl.textContent = "Exit " + data.returncode;
        codeEl.className = "pill code bad";
      }
      logEl.textContent = data.log || "Waiting for a command...";
      deltaPlusEl.textContent = `+${telemetry.added_lines || 0}`;
      deltaMinusEl.textContent = `-${telemetry.deleted_lines || 0}`;
      deltaNeutralEl.textContent = `${telemetry.changed_paths || 0} paths`;
      deltaSubEl.textContent = `${telemetry.changed_paths || 0} changed paths in the current worktree`;
      rootFileCountEl.textContent = String(telemetry.root_file_count || 0);
      mvpDirCountEl.textContent = String(telemetry.mvp_dir_count || telemetry.websites_dir_count || 0);
      rootMarkdownCountEl.textContent = String(telemetry.root_markdown_count || 0);
      renderRecentItems(recentRootListEl, telemetry.recent_root, "No recent root files");
      renderRecentItems(recentMarkdownListEl, telemetry.recent_markdown, "No recent markdown files");
      setLockableDisabled(Boolean(data.running));
      if (deployButton) {
        deployButton.disabled = Boolean(data.running) || !(deployConfirm && deployConfirm.checked);
      }
    }

    quickButtons.forEach(btn => btn.addEventListener("click", () => runCommand(btn.dataset.command)));
    forms.forEach(form => {
      form.addEventListener("submit", event => {
        event.preventDefault();
        runCommand(form.dataset.commandForm, serializeForm(form));
      });
      form.querySelectorAll("input, select").forEach(input => {
        input.addEventListener("input", updatePreviews);
        input.addEventListener("change", updatePreviews);
      });
    });
    if (deployConfirm && deployButton) {
      deployConfirm.addEventListener("change", refresh);
    }
    tabs.forEach(tab => tab.addEventListener("click", () => activateTab(tab.dataset.tab)));
    if (copyLogButton) {
      copyLogButton.addEventListener("click", async () => {
        const text = logEl.textContent || "";
        if (!text.trim()) return;
        try {
          await navigator.clipboard.writeText(text);
          copyLogButton.textContent = "Copied";
          setTimeout(() => { copyLogButton.textContent = "Copy output"; }, 1200);
        } catch (_error) {
          copyLogButton.textContent = "Copy failed";
          setTimeout(() => { copyLogButton.textContent = "Copy output"; }, 1200);
        }
      });
    }
    updatePreviews();
    refresh();
    setInterval(refresh, 1500);
  </script>
</body>
</html>
"""


PROGRESS_PLACEHOLDER = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>NAI Progress Unavailable</title>
  <style>
    body {
      margin: 0;
      font-family: "Segoe UI", sans-serif;
      background: #09111f;
      color: #eef4ff;
      display: grid;
      place-items: center;
      min-height: 100vh;
    }
    .card {
      max-width: 720px;
      padding: 28px;
      border-radius: 22px;
      border: 1px solid #22385f;
      background: linear-gradient(180deg, rgba(18,34,65,.95), rgba(13,24,48,.96));
    }
    h1 { margin-top: 0; font-size: 38px; }
    p { color: #9fb4d3; line-height: 1.6; }
    code {
      background: rgba(132,182,255,.12);
      padding: 3px 8px;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Progress view not built yet</h1>
    <p>The command center is ready, but <code>sitemap_screenshots/progress.html</code> does not exist right now.</p>
    <p>Use the <strong>Build progress dashboard</strong> form in the control room, or run <code>./nai progress</code>.</p>
  </div>
</body>
</html>
"""


class Handler(BaseHTTPRequestHandler):
    def _send_json(self, payload: dict[str, object], status: int = 200) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_html(self, html: str) -> None:
        body = html.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_file(self, path: Path) -> None:
        if not path.exists() or not path.is_file():
            self.send_error(404)
            return
        body = path.read_bytes()
        content_type, _ = mimetypes.guess_type(path.name)
        self.send_response(200)
        self.send_header("Content-Type", content_type or "application/octet-stream")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format: str, *args) -> None:  # noqa: A003
        return

    def do_GET(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        if parsed.path == "/":
            self._send_html(HTML)
            return
        if parsed.path == "/api/status":
            self._send_json(STATE)
            return
        if parsed.path == "/api/telemetry":
            self._send_json(repo_telemetry())
            return
        if parsed.path.startswith("/sitemap_screenshots/"):
            rel = Path(unquote(parsed.path.lstrip("/")))
            path = ROOT / rel
            if parsed.path == "/sitemap_screenshots/progress.html" and not path.exists():
                self._send_html(PROGRESS_PLACEHOLDER)
                return
            self._send_file(path)
            return
        self.send_error(404)

    def do_POST(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        if parsed.path != "/api/run":
            self.send_error(404)
            return

        command, options = parse_run_request(self)
        if command not in set(BASE_COMMANDS) | {"screenshots_custom", "browse_custom", "analyze_custom", "progress_custom"}:
            self._send_json({"ok": False, "error": "Unknown command"}, status=400)
            return
        if bool(STATE["running"]):
            self._send_json({"ok": False, "error": "Another command is already running"}, status=409)
            return

        threading.Thread(target=run_command, args=(command, options), daemon=True).start()
        self._send_json({"ok": True})


def main() -> int:
    server = ThreadingHTTPServer(("0.0.0.0", 8031), Handler)
    url = "http://127.0.0.1:8031"
    print(f"NAI Hub running at {url} (and accessible via your LAN IP on port 8031)")
    webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
