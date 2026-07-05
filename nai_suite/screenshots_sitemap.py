from __future__ import annotations

import argparse
import os
import json
import sys
import shutil
import tempfile
import threading
from dataclasses import dataclass
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from html import escape
from pathlib import Path

from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
from playwright.sync_api import sync_playwright

from nai_suite.siteflow import detect_asset_aliases, find_best_build_root, site_dir_for_slug
from nai_suite.sitemap_data import load_public_urls

SITEMAP_FILE = Path("SITEMAP.json")
OUTPUT_DIR = Path("sitemap_screenshots")
SNAPSHOT_ROOT = OUTPUT_DIR.parent / f".{OUTPUT_DIR.name}_snapshot"
SNAPSHOT_PREVIOUS = SNAPSHOT_ROOT / "previous"
BASE_TITLE = "New Ashtabula Initiative | Full-Scale Infrastructure Modernization"
NAI_HOSTS = (
    "https://new-ashtabula-initiative.com",
    "https://newashtabula.com",
)


@dataclass
class ShotResult:
    url: str
    slug: str
    screenshot_path: Path
    title: str
    body_chars: int
    warnings: list[str]
    source: str


def load_analysis_report() -> dict[str, object] | None:
    report_path = OUTPUT_DIR / "visual_analysis_report.json"
    if not report_path.exists():
        return None
    try:
        return json.loads(report_path.read_text())
    except json.JSONDecodeError:
        return None


def reset_output_dir(output_dir: Path) -> None:
    if output_dir.exists():
        for child in sorted(output_dir.iterdir(), key=lambda p: p.name, reverse=True):
            if child.is_dir() and not child.is_symlink():
                shutil.rmtree(child)
            else:
                child.unlink()
    output_dir.mkdir(parents=True, exist_ok=True)


def clear_selected_slug_artifacts(output_dir: Path, selected_slugs: set[str]) -> None:
    if not output_dir.exists():
        output_dir.mkdir(parents=True, exist_ok=True)
        return

    for image_path in sorted(output_dir.glob("[0-9][0-9][0-9]_*.png")):
        slug = image_path.stem.split("_", 1)[1] if "_" in image_path.stem else ""
        if slug not in selected_slugs:
            continue
        meta_path = output_dir / f"{image_path.stem}.txt"
        image_path.unlink(missing_ok=True)
        meta_path.unlink(missing_ok=True)


def load_meta(meta_path: Path) -> dict[str, object]:
    data: dict[str, object] = {
        "url": "",
        "title": "",
        "body_chars": 0,
        "screenshot": "",
        "source": "",
        "warnings": [],
    }
    if not meta_path.exists():
        return data
    for line in meta_path.read_text().splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip()
        if key == "body_chars":
            try:
                data[key] = int(value)
            except ValueError:
                data[key] = 0
        elif key == "warnings":
            data[key] = [item.strip() for item in value.split(",") if item.strip() and item.strip() != "none"]
        else:
            data[key] = value
    return data


def load_existing_results(output_dir: Path) -> list[ShotResult]:
    results: list[ShotResult] = []
    seen_slugs: set[str] = set()
    for image_path in sorted(output_dir.glob("[0-9][0-9][0-9]_*.png")):
        if "_" not in image_path.stem:
            continue
        slug = image_path.stem.split("_", 1)[1]
        if slug in seen_slugs:
            continue
        seen_slugs.add(slug)
        meta_path = output_dir / f"{image_path.stem}.txt"
        meta = load_meta(meta_path)
        results.append(
            ShotResult(
                url=str(meta.get("url", "")),
                slug=slug,
                screenshot_path=image_path,
                title=str(meta.get("title", "")),
                body_chars=int(meta.get("body_chars", 0) or 0),
                warnings=list(meta.get("warnings", [])),
                source=str(meta.get("source", "")),
            )
        )
    return results


def backup_output_dir(output_dir: Path) -> None:
    if not output_dir.exists():
        return
    SNAPSHOT_ROOT.mkdir(parents=True, exist_ok=True)
    if SNAPSHOT_PREVIOUS.exists():
        shutil.rmtree(SNAPSHOT_PREVIOUS)
    print(f"Saving rolling screenshots snapshot to {SNAPSHOT_PREVIOUS}")
    shutil.copytree(output_dir, SNAPSHOT_PREVIOUS, symlinks=True)


def parse_sitemap() -> list[str]:
    return load_public_urls()


def build_slug_index_map(urls: list[str]) -> dict[str, int]:
    return {slug_from_url(url): index for index, url in enumerate(urls, start=1)}


def slug_from_url(url: str) -> str:
    slug = url.rstrip("/").split("/")[-1]
    return slug or "home"


def make_preview_tree(build_root: Path, public_slug: str) -> tempfile.TemporaryDirectory:
    tempdir = tempfile.TemporaryDirectory(prefix=f"nai-preview-{public_slug}-")
    temp_root = Path(tempdir.name)

    def link(name: str, target: Path) -> None:
        dest = temp_root / name
        if dest.exists():
            return
        dest.symlink_to(target, target_is_directory=target.is_dir())

    for entry in build_root.iterdir():
        link(entry.name, entry)

    if public_slug and public_slug != "home":
        link(public_slug, build_root)

    for alias in detect_asset_aliases(build_root / "index.html"):
        if alias != public_slug:
            link(alias, build_root)

    return tempdir


def start_preview_server(build_root: Path, public_slug: str):
    tempdir = make_preview_tree(build_root, public_slug)

    class QuietHandler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=tempdir.name, **kwargs)

        def log_message(self, format, *args):  # noqa: A003
            return

    server = ThreadingHTTPServer(("127.0.0.1", 0), QuietHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    base_url = f"http://127.0.0.1:{server.server_port}"
    return tempdir, server, thread, base_url


def capture_page(
    page,
    page_url: str,
    output_file: Path | None,
    take_screenshot: bool = True,
    settle_ms: int = 500,
) -> ShotResult:
    warnings: list[str] = []

    page.goto(page_url, wait_until="domcontentloaded", timeout=45000)

    try:
        page.wait_for_load_state("networkidle", timeout=15000)
    except PlaywrightTimeoutError:
        warnings.append("networkidle timeout")

    try:
        page.wait_for_function(
            "() => document.body && document.body.innerText.trim().length > 0",
            timeout=15000,
        )
    except PlaywrightTimeoutError:
        warnings.append("body text not detected before timeout")

    page.wait_for_timeout(settle_ms)

    title = page.title().strip()
    body_text = page.locator("body").inner_text().strip()

    if not title:
        warnings.append("missing title")
    if title == BASE_TITLE:
        warnings.append("landing page fallback")
    if len(body_text) < 25:
        warnings.append(f"short body text ({len(body_text)} chars)")

    if take_screenshot and output_file is not None:
        page.screenshot(path=str(output_file), full_page=True)

    return ShotResult(
        url=page_url,
        slug=slug_from_url(page_url),
        screenshot_path=output_file or Path(""),
        title=title,
        body_chars=len(body_text),
        warnings=warnings,
        source="preview",
    )


def capture_diagnostic(page, url: str, slug: str, output_file: Path, reason: str, site_dir: Path) -> ShotResult:
    warnings = [reason]
    html = f"""
    <html>
      <head>
        <meta charset="utf-8" />
        <title>{slug} not built</title>
        <style>
          body {{
            margin: 0;
            font-family: Arial, sans-serif;
            background: #111827;
            color: #f9fafb;
          }}
          .wrap {{
            max-width: 960px;
            margin: 0 auto;
            padding: 48px 32px;
          }}
          .card {{
            background: #1f2937;
            border: 1px solid #374151;
            border-radius: 16px;
            padding: 28px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
          }}
          .pill {{
            display: inline-block;
            padding: 6px 10px;
            border-radius: 999px;
            background: #7c2d12;
            color: #fed7aa;
            font-size: 12px;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            margin-bottom: 16px;
          }}
          code {{
            color: #93c5fd;
          }}
          ul {{
            line-height: 1.7;
          }}
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="card">
            <div class="pill">Build missing</div>
            <h1>{slug}</h1>
            <p>This site is still serving a shell or has no reusable production bundle yet.</p>
            <p><strong>Expected site dir:</strong> <code>{site_dir}</code></p>
            <p><strong>Target URL:</strong> <code>{url}</code></p>
            <p><strong>Next step:</strong> run the new <code>nai build</code> workflow so this page can be rendered from a real build artifact.</p>
          </div>
        </div>
      </body>
    </html>
    """
    page.set_content(html)
    page.wait_for_timeout(500)
    title = page.title().strip()
    body_text = page.locator("body").inner_text().strip()
    page.screenshot(path=str(output_file), full_page=True)
    warnings.append("diagnostic screenshot")
    return ShotResult(
        url=url,
        slug=slug,
        screenshot_path=output_file,
        title=title,
        body_chars=len(body_text),
        warnings=warnings,
        source="diagnostic",
    )


def _safe_str(value: object, fallback: str = "") -> str:
    if value is None:
        return fallback
    return str(value)


def _summary_chip(label: str, value: object, tone: str = "") -> str:
    tone_class = f" tone-{tone}" if tone else ""
    return f'<span class="chip{tone_class}"><span>{escape(label)}</span><strong>{escape(_safe_str(value))}</strong></span>'


def _analysis_block(item: dict[str, object] | None) -> str:
    if not item:
        return '<div class="analysis-empty">No JSON analysis available yet.</div>'

    overall = item.get("overall_assessment", {}) if isinstance(item, dict) else {}
    layout = item.get("layout_analysis", {}) if isinstance(item, dict) else {}
    branding = item.get("branding_analysis", {}) if isinstance(item, dict) else {}
    orchestration = item.get("orchestration_notes", {}) if isinstance(item, dict) else {}
    issues = item.get("issues", []) if isinstance(item, dict) else []
    quick_fixes = item.get("quick_fixes", []) if isinstance(item, dict) else []

    first_issue = ""
    if isinstance(issues, list) and issues:
        issue = issues[0] if isinstance(issues[0], dict) else {}
        first_issue = _safe_str(issue.get("issue"))

    first_fix = ""
    if isinstance(quick_fixes, list) and quick_fixes:
        fix = quick_fixes[0] if isinstance(quick_fixes[0], dict) else {}
        first_fix = _safe_str(fix.get("action"))

    return f"""
      <div class="analysis-grid">
        <div><span>Status</span><strong>{escape(_safe_str(overall.get('status')))}</strong></div>
        <div><span>Design</span><strong>{escape(_safe_str(overall.get('design_score_10')))}</strong></div>
        <div><span>Brand</span><strong>{escape(_safe_str(branding.get('brand_presence')))}</strong></div>
        <div><span>Layout</span><strong>{escape(_safe_str(layout.get('center_alignment')))}</strong></div>
        <div><span>WL fit</span><strong>{escape(_safe_str(overall.get('white_label_fit_10')))}</strong></div>
        <div><span>Fix</span><strong>{escape(first_fix or 'None')}</strong></div>
      </div>
      <details class="json-details">
        <summary>Analysis details</summary>
        <div class="detail-row"><span>First issue</span><strong>{escape(first_issue or 'None')}</strong></div>
        <div class="detail-row"><span>Needs branding</span><strong>{escape(_safe_str(orchestration.get('needs_branding_pass')))}</strong></div>
        <div class="detail-row"><span>Needs layout</span><strong>{escape(_safe_str(orchestration.get('needs_layout_pass')))}</strong></div>
        <div class="detail-row"><span>Needs content</span><strong>{escape(_safe_str(orchestration.get('needs_content_pass')))}</strong></div>
      </details>
    """


def generate_gallery_index(results: list[ShotResult]) -> None:
    report = load_analysis_report()
    report_by_slug: dict[str, dict[str, object]] = {}
    summary = {}
    if isinstance(report, dict):
        raw_items = report.get("items", [])
        if isinstance(raw_items, list):
            for item in raw_items:
                if isinstance(item, dict):
                    slug = _safe_str(item.get("slug"))
                    if slug:
                        report_by_slug[slug] = item
        raw_summary = report.get("summary", {})
        if isinstance(raw_summary, dict):
            summary = raw_summary

    cards: list[str] = []
    for result in results:
        analysis_item = report_by_slug.get(result.slug)
        warnings = ""
        if result.warnings:
            warnings = "".join(
                f'<span class="warning">{escape(w)}</span>' for w in result.warnings
            )
        status = ""
        design = ""
        brand = ""
        white_label = ""
        first_fix = ""
        if isinstance(analysis_item, dict):
            overall = analysis_item.get("overall_assessment", {})
            layout = analysis_item.get("layout_analysis", {})
            branding = analysis_item.get("branding_analysis", {})
            quick_fixes = analysis_item.get("quick_fixes", [])
            if isinstance(overall, dict):
                status = _safe_str(overall.get("status"))
                design = _safe_str(overall.get("design_score_10"))
                white_label = _safe_str(overall.get("white_label_fit_10"))
            if isinstance(branding, dict):
                brand = _safe_str(branding.get("brand_presence"))
            if isinstance(quick_fixes, list) and quick_fixes:
                fix = quick_fixes[0] if isinstance(quick_fixes[0], dict) else {}
                first_fix = _safe_str(fix.get("action"))
        cards.append(
            f"""
            <a class="card" href="{escape(result.screenshot_path.name)}" target="_blank" rel="noreferrer">
              <img src="{escape(result.screenshot_path.name)}" alt="{escape(result.slug)} screenshot" loading="lazy" />
              <div class="meta">
                <div class="headline">
                  <strong>{escape(result.slug)}</strong>
                  {f'<span class="status">{escape(status)}</span>' if status else ''}
                </div>
                <span class="title">{escape(result.title or 'Untitled')}</span>
                <div class="stats">
                  <span>{escape(result.source)} · {escape(str(result.body_chars))} chars</span>
                  {f'<span>Design {escape(design)}</span>' if design else ''}
                  {f'<span>Brand {escape(brand)}</span>' if brand else ''}
                  {f'<span>WL {escape(white_label)}</span>' if white_label else ''}
                </div>
                {f'<div class="mini-fix">{escape(first_fix)}</div>' if first_fix else ''}
                <div class="warnings">{warnings}</div>
                {_analysis_block(analysis_item)}
              </div>
            </a>
            """
        )

    html = f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>NAI Sitemap Screenshots</title>
    <style>
      :root {{
        color-scheme: dark;
        --bg: #0b1020;
        --panel: #11182b;
        --panel-2: #18213a;
        --text: #e5eefc;
        --muted: #9fb0ce;
        --accent: #8dd3ff;
        --warn: #ffd38d;
      }}
      * {{ box-sizing: border-box; }}
      body {{
        margin: 0;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        background: radial-gradient(circle at top, #152447 0, var(--bg) 45%);
        color: var(--text);
      }}
      header {{
        padding: 24px 20px 12px;
        max-width: 1440px;
        margin: 0 auto;
      }}
      h1 {{
        margin: 0 0 8px;
        font-size: clamp(1.5rem, 2.2vw, 2.4rem);
      }}
      p {{
        margin: 0;
        color: var(--muted);
        line-height: 1.45;
      }}
      .summary {{
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 14px;
      }}
      .chip {{
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        border-radius: 999px;
        background: rgba(141, 211, 255, 0.08);
        border: 1px solid rgba(141, 211, 255, 0.14);
        font-size: 12px;
      }}
      .chip strong {{
        color: var(--text);
      }}
      .chip.tone-warn {{
        background: rgba(255, 211, 141, 0.08);
        border-color: rgba(255, 211, 141, 0.16);
      }}
      .grid {{
        max-width: 1440px;
        margin: 0 auto;
        padding: 12px 16px 40px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
        gap: 10px;
      }}
      .card {{
        display: block;
        text-decoration: none;
        color: inherit;
        background: linear-gradient(180deg, var(--panel), var(--panel-2));
        border: 1px solid rgba(141, 211, 255, 0.12);
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.22);
      }}
      .card img {{
        width: 100%;
        aspect-ratio: 16 / 9;
        object-fit: cover;
        display: block;
        background: #0c1222;
      }}
      .meta {{
        padding: 10px 10px 12px;
      }}
      .headline {{
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 4px;
      }}
      .meta strong {{
        display: block;
        font-size: 0.92rem;
        line-height: 1.25;
      }}
      .title {{
        display: block;
        color: var(--muted);
        line-height: 1.35;
        font-size: 12px;
        margin-bottom: 8px;
      }}
      .status {{
        flex: 0 0 auto;
        padding: 3px 7px;
        border-radius: 999px;
        background: rgba(141, 211, 255, 0.12);
        color: var(--accent);
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }}
      .stats {{
        display: flex;
        flex-wrap: wrap;
        gap: 4px 8px;
        color: var(--muted);
        font-size: 11px;
        line-height: 1.35;
        margin-bottom: 8px;
      }}
      .stats span {{
        padding: 2px 0;
      }}
      .mini-fix {{
        font-size: 11px;
        color: #d8e8ff;
        line-height: 1.35;
        margin-bottom: 8px;
      }}
      .analysis-grid {{
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px 10px;
        font-size: 11px;
        color: var(--muted);
        margin-top: 8px;
      }}
      .analysis-grid div,
      .detail-row {{
        display: flex;
        flex-direction: column;
        gap: 2px;
      }}
      .analysis-grid span,
      .detail-row span {{
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #8ea0c5;
      }}
      .analysis-grid strong,
      .detail-row strong {{
        color: var(--text);
        font-size: 11px;
        line-height: 1.35;
      }}
      .warnings {{
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 10px;
      }}
      .warning {{
        display: inline-block;
        padding: 3px 7px;
        border-radius: 999px;
        background: rgba(255, 211, 141, 0.12);
        color: var(--warn);
        font-size: 10px;
      }}
      .json-details {{
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }}
      .json-details summary {{
        cursor: pointer;
        color: var(--accent);
        font-size: 11px;
        list-style: none;
      }}
      .json-details summary::-webkit-details-marker {{
        display: none;
      }}
      .json-details > div {{
        margin-top: 6px;
      }}
      .analysis-empty {{
        margin-top: 8px;
        font-size: 11px;
        color: var(--muted);
      }}
      footer {{
        max-width: 1440px;
        margin: 0 auto;
        padding: 0 20px 32px;
        color: var(--muted);
        font-size: 12px;
      }}
      code {{
        color: var(--accent);
      }}
    </style>
  </head>
  <body>
    <header>
      <h1>NAI Sitemap Screenshots</h1>
      <p>{len(results)} captures generated by <code>./nai screenshots</code>.</p>
      {"<div class='summary'>" if summary else ""}
      {''.join([
          _summary_chip("Issues", sum(summary.get("issue_counts_by_category", {}).values()) if isinstance(summary.get("issue_counts_by_category", {}), dict) else 0, "warn"),
          _summary_chip("Shell-like", summary.get("shell_like_count", 0)),
          _summary_chip("Brand pass", summary.get("needs_branding_pass_count", 0)),
          _summary_chip("Layout pass", summary.get("needs_layout_pass_count", 0)),
          _summary_chip("Content pass", summary.get("needs_content_pass_count", 0)),
      ]) if summary else ""}
      {"</div>" if summary else ""}
    </header>
    <main class="grid">
      {''.join(cards)}
    </main>
    <footer>
      Generated from canonical <code>{escape(str(SITEMAP_FILE))}</code>
      {"and <code>sitemap_screenshots/visual_analysis_report.json</code>." if report_by_slug else "."}
    </footer>
  </body>
</html>
"""
    (OUTPUT_DIR / "index.html").write_text(html)


def main() -> None:
    parser = argparse.ArgumentParser(description="Capture sitemap screenshots")
    parser.add_argument("--live", action="store_true", help="navigate to the live production URLs instead of local previews")
    parser.add_argument("--headed", action="store_true", help="show the browser window")
    parser.add_argument("--slugs", nargs="*", default=None, help="optional list of site slugs to capture")
    parser.add_argument(
        "--browse-only",
        action="store_true",
        help="navigate the pages without taking screenshots or generating the gallery",
    )
    parser.add_argument(
        "--linger",
        type=float,
        default=None,
        help="seconds to pause on each site before taking the screenshot",
    )
    parser.add_argument(
        "--settle-ms",
        type=int,
        default=500,
        help="milliseconds to wait after a page settles before capture",
    )
    parser.add_argument(
        "--slow-mo",
        type=int,
        default=0,
        help="delay between Playwright actions in milliseconds",
    )
    args = parser.parse_args()

    slugs_mode = args.slugs is not None
    selected_slugs = set(args.slugs or [])

    if args.live:
        backup_output_dir(OUTPUT_DIR)
    if slugs_mode:
        clear_selected_slug_artifacts(OUTPUT_DIR, selected_slugs)
    else:
        reset_output_dir(OUTPUT_DIR)
    all_urls = parse_sitemap()
    slug_index_map = build_slug_index_map(all_urls)
    urls = all_urls
    if slugs_mode:
        if not selected_slugs:
            print("No slugs provided. Exiting without changing the output directory.")
            return
        urls = [u for u in all_urls if slug_from_url(u) in selected_slugs]
        if not urls:
            print(f"No URLs matching slugs: {', '.join(args.slugs or [])}")
            return
    print(f"Found {len(urls)} URLs in {SITEMAP_FILE}")

    if not urls:
        print("No URLs found. Exiting.")
        return

    results: list[ShotResult] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=not args.headed, slow_mo=args.slow_mo)
        linger_seconds = args.linger if args.linger is not None else (1 if args.headed else 0)

        for index, url in enumerate(urls, start=1):
            slug = slug_from_url(url)
            site_dir = site_dir_for_slug(slug)
            build_root = find_best_build_root(site_dir)
            canonical_index = slug_index_map.get(slug, index)

            filename = OUTPUT_DIR / f"{canonical_index:03d}_{slug}.png"
            meta_file = OUTPUT_DIR / f"{canonical_index:03d}_{slug}.txt"

            if args.browse_only:
                print(f"Browsing ({index}/{len(urls)}): {url}")
            else:
                print(f"Processing ({index}/{len(urls)}): {url} -> {filename}")

            context = browser.new_context(viewport={"width": 1440, "height": 1600}, device_scale_factor=1)
            page = context.new_page()
            tempdir = None
            server = None

            try:
                if args.live:
                    result = capture_page(
                        page,
                        url,
                        None if args.browse_only else filename,
                        take_screenshot=not args.browse_only,
                        settle_ms=args.settle_ms,
                    )
                    result.source = "live"
                elif build_root is None:
                    result = capture_diagnostic(
                        page,
                        url,
                        slug,
                        filename,
                        "no production build found",
                        site_dir,
                    )
                else:
                    tempdir, server, thread, base_url = start_preview_server(build_root, slug)
                    preview_url = f"{base_url}/{slug}/"
                    result = capture_page(
                        page,
                        preview_url,
                        None if args.browse_only else filename,
                        take_screenshot=not args.browse_only,
                        settle_ms=args.settle_ms,
                    )
                    result.url = url
                    if result.warnings and "landing page fallback" in result.warnings:
                        result.warnings.append(f"preview root: {build_root}")
                    result.source = f"preview:{build_root.relative_to(site_dir)}"

                if linger_seconds > 0:
                    page.wait_for_timeout(int(linger_seconds * 1000))

                results.append(result)
                if not args.browse_only:
                    meta_file.write_text(
                        "\n".join(
                            [
                                f"url: {result.url}",
                                f"title: {result.title}",
                                f"body_chars: {result.body_chars}",
                                f"screenshot: {result.screenshot_path}",
                                f"source: {result.source}",
                                f"warnings: {', '.join(result.warnings) if result.warnings else 'none'}",
                            ]
                        )
                        + "\n"
                    )

                    if result.warnings:
                        print(f"  ⚠️  {', '.join(result.warnings)}")
                    print(f"  ✅ Saved {filename.name}")
                else:
                    if result.warnings:
                        print(f"  ⚠️  {', '.join(result.warnings)}")
                    print(f"  ✅ {result.title or 'loaded'}")
            except Exception as exc:
                if not args.browse_only:
                    meta_file.write_text(
                        "\n".join(
                            [
                                f"url: {url}",
                                f"title: unknown",
                                f"body_chars: 0",
                                f"screenshot: {filename}",
                                f"source: error",
                                f"warnings: capture failed: {exc}",
                            ]
                        )
                        + "\n"
                    )
                print(f"  ❌ {exc}")
            finally:
                if server is not None:
                    server.shutdown()
                    server.server_close()
                if tempdir is not None:
                    tempdir.cleanup()
                page.close()
                context.close()

        browser.close()

    warned = sum(1 for r in results if r.warnings)
    if not args.browse_only:
        gallery_results = load_existing_results(OUTPUT_DIR) if slugs_mode else results
        generate_gallery_index(gallery_results)
    print("\nDone.")
    print(f"Captured: {len(results)}/{len(urls)}")
    print(f"Warnings: {warned}")
    if not args.browse_only:
        print(f"Gallery: {OUTPUT_DIR / 'index.html'}")

    # Playwright can occasionally leave the driver process hanging at shutdown.
    # This CLI is write-only, so once the captures are finished we exit hard to
    # guarantee the parent shell regains control immediately.
    sys.stdout.flush()
    sys.stderr.flush()
    os._exit(0)


if __name__ == "__main__":
    main()
