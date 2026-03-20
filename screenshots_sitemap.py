from __future__ import annotations

import re
import tempfile
import threading
from dataclasses import dataclass
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
from playwright.sync_api import sync_playwright

from siteflow import detect_asset_aliases, find_best_build_root, site_dir_for_slug

SITEMAP_FILE = Path("SITEMAP.md")
OUTPUT_DIR = Path("sitemap_screenshots")
BASE_TITLE = "New Ashtabula Initiative | Full-Scale Infrastructure Modernization"


@dataclass
class ShotResult:
    url: str
    slug: str
    screenshot_path: Path
    title: str
    body_chars: int
    warnings: list[str]
    source: str


def parse_sitemap() -> list[str]:
    text = SITEMAP_FILE.read_text()
    pattern = re.compile(r"\((https?://[^)]+)\)")
    urls: list[str] = []
    seen: set[str] = set()
    for line in text.splitlines():
        if not line.strip().startswith("|"):
            continue
        for url in pattern.findall(line):
            if "new-ashtabula-initiative.vercel.app" not in url:
                continue
            if url not in seen:
                seen.add(url)
                urls.append(url)
    return urls


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


def capture_page(page, page_url: str, output_file: Path) -> ShotResult:
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

    page.wait_for_timeout(2000)

    title = page.title().strip()
    body_text = page.locator("body").inner_text().strip()

    if not title:
        warnings.append("missing title")
    if title == BASE_TITLE:
        warnings.append("landing page fallback")
    if len(body_text) < 25:
        warnings.append(f"short body text ({len(body_text)} chars)")

    page.screenshot(path=str(output_file), full_page=True)

    return ShotResult(
        url=page_url,
        slug=slug_from_url(page_url),
        screenshot_path=output_file,
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


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    urls = parse_sitemap()
    print(f"Found {len(urls)} URLs in {SITEMAP_FILE}")

    if not urls:
        print("No URLs found. Exiting.")
        return

    results: list[ShotResult] = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for index, url in enumerate(urls, start=1):
            slug = slug_from_url(url)
            site_dir = site_dir_for_slug(slug)
            build_root = find_best_build_root(site_dir)

            filename = OUTPUT_DIR / f"{index:03d}_{slug}.png"
            meta_file = OUTPUT_DIR / f"{index:03d}_{slug}.txt"

            print(f"Processing ({index}/{len(urls)}): {url} -> {filename}")

            context = browser.new_context(viewport={"width": 1440, "height": 1600}, device_scale_factor=1)
            page = context.new_page()
            tempdir = None
            server = None

            try:
                if build_root is None:
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
                    result = capture_page(page, preview_url, filename)
                    result.url = url
                    if result.warnings and "landing page fallback" in result.warnings:
                        result.warnings.append(f"preview root: {build_root}")
                    result.source = f"preview:{build_root.relative_to(site_dir)}"

                results.append(result)
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
            except Exception as exc:
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
    print("\nDone.")
    print(f"Captured: {len(results)}/{len(urls)}")
    print(f"Warnings: {warned}")


if __name__ == "__main__":
    main()
