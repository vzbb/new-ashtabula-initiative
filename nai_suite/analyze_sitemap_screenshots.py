from __future__ import annotations

import argparse
import base64
import json
import os
import shutil
import sys
import textwrap
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from nai_suite.sitemap_data import load_public_urls

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_IMAGE_DIR = ROOT / "sitemap_screenshots"
DEFAULT_OUTPUT = DEFAULT_IMAGE_DIR / "visual_analysis_report.json"
ARCHIVE_ROOT = ROOT / ".sitemap_screenshots_analysis_archive"
DEFAULT_MODEL = "google/gemini-2.5-flash-lite"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
HTTP_REFERER = "https://new-ashtabula-initiative.com"


@dataclass
class ScreenshotItem:
    slug: str
    image_path: Path
    meta_path: Path
    url: str
    title: str
    body_chars: int
    source: str
    warnings: list[str]


def load_dotenv_if_needed() -> None:
    if os.environ.get("OPENROUTER_API_KEY"):
        return
    for name in (".env", ".env.local", ".env.production", ".env.vercel"):
        path = ROOT / name
        if not path.exists():
            continue
        for raw_line in path.read_text().splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip("'").strip('"')
            if key == "OPENROUTER_API_KEY" and value and key not in os.environ:
                os.environ[key] = value
        if os.environ.get("OPENROUTER_API_KEY"):
            return


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Analyze sitemap screenshots with OpenRouter Gemini")
    parser.add_argument("--image-dir", type=Path, default=DEFAULT_IMAGE_DIR)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--model", default=DEFAULT_MODEL)
    parser.add_argument("--quality", choices=["fast", "deep"], default="fast")
    parser.add_argument("--slugs", nargs="*", default=None)
    parser.add_argument("--slugs-file", type=Path, default=None)
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument("--temperature", type=float, default=0.2)
    parser.add_argument("--max-tokens", type=int, default=1200)
    parser.add_argument("--sleep", type=float, default=0.0)
    parser.add_argument("--focus", action="store_true")
    parser.add_argument("--branding-only", action="store_true")
    parser.add_argument("--verify-targets", action=argparse.BooleanOptionalAction, default=True)
    return parser.parse_args()


def slug_from_image_name(name: str) -> str | None:
    stem = Path(name).stem
    if "_" not in stem:
        return None
    slug = stem.split("_", 1)[1]
    if slug.endswith(".txt"):
        slug = Path(slug).stem
    return slug or None


def load_selected_slugs(args: argparse.Namespace) -> set[str] | None:
    slugs: set[str] = set()
    if args.slugs:
        slugs.update(args.slugs)
    if args.slugs_file and args.slugs_file.exists():
        slugs.update(
            line.strip()
            for line in args.slugs_file.read_text().splitlines()
            if line.strip()
        )
    return slugs or None


def load_meta(meta_path: Path) -> dict[str, Any]:
    data: dict[str, Any] = {
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


def collect_items(image_dir: Path, selected_slugs: set[str] | None) -> list[ScreenshotItem]:
    items: list[ScreenshotItem] = []
    seen_slugs: set[str] = set()
    duplicate_slugs: list[tuple[str, Path]] = []
    for image_path in sorted(image_dir.glob("[0-9][0-9][0-9]_*.png")):
        slug = slug_from_image_name(image_path.name)
        if slug is None:
            continue
        if selected_slugs is not None and slug not in selected_slugs:
            continue
        if slug in seen_slugs:
            duplicate_slugs.append((slug, image_path))
            continue
        seen_slugs.add(slug)
        meta_path = image_dir / f"{image_path.stem}.txt"
        meta = load_meta(meta_path)
        items.append(
            ScreenshotItem(
                slug=slug,
                image_path=image_path,
                meta_path=meta_path,
                url=str(meta.get("url", "")),
                title=str(meta.get("title", "")),
                body_chars=int(meta.get("body_chars", 0) or 0),
                source=str(meta.get("source", "")),
                warnings=list(meta.get("warnings", [])),
            )
        )
    if duplicate_slugs:
        skipped = ", ".join(f"{slug} ({path.name})" for slug, path in duplicate_slugs)
        print(f"⚠️  skipped duplicate screenshot file(s): {skipped}")
    return items


def openrouter_call(model: str, prompt: str, image_path: Path, temperature: float, max_tokens: int) -> str:
    load_dotenv_if_needed()
    key = os.environ.get("OPENROUTER_API_KEY")
    if not key:
        raise RuntimeError("OPENROUTER_API_KEY is not set")

    image_b64 = base64.b64encode(image_path.read_bytes()).decode("ascii")
    payload = {
        "model": model,
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{image_b64}",
                            "detail": "low",
                        },
                    },
                ],
            }
        ],
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    data = json.dumps(payload).encode("utf-8")
    req = Request(
        OPENROUTER_URL,
        method="POST",
        data=data,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {key}",
            "HTTP-Referer": HTTP_REFERER,
            "X-Title": "New Ashtabula Initiative screenshot analysis",
        },
    )
    try:
        with urlopen(req, timeout=120) as resp:
            body = resp.read().decode("utf-8")
    except HTTPError as exc:
        raise RuntimeError(f"OpenRouter API error: {exc.code} {exc.reason}") from exc
    except URLError as exc:
        raise RuntimeError(f"OpenRouter network error: {exc.reason}") from exc

    parsed = json.loads(body)
    text = parsed["choices"][0]["message"]["content"]
    if isinstance(text, list):
        text = "".join(part.get("text", "") for part in text if isinstance(part, dict))
    return str(text).strip()


def extract_json(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if "\n" in cleaned:
            cleaned = cleaned.split("\n", 1)[1]
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start != -1 and end != -1 and end > start:
            return json.loads(cleaned[start : end + 1])
        raise


def prompt_for_item(item: ScreenshotItem, focus: bool, branding_only: bool, verify_targets: bool) -> str:
    target_mode = "verify target entities if they are obvious from the screenshot" if verify_targets else "do not perform external target verification"
    mode = "branding-only" if branding_only else "full visual QA"
    focus_clause = "This is a narrow focused pass." if focus else "This is a general pass."
    return textwrap.dedent(
        f"""
        Analyze this screenshot for the NAI monorepo.

        Route slug: {item.slug}
        URL: {item.url}
        Title: {item.title}
        Body chars: {item.body_chars}
        Source: {item.source}
        Warnings: {", ".join(item.warnings) if item.warnings else "none"}
        Mode: {mode}
        {focus_clause}
        {target_mode}

        Return strict JSON only with this shape:
        {{
          "slug": "{item.slug}",
          "overall_assessment": "short paragraph",
          "layout_analysis": "short paragraph",
          "branding_analysis": "short paragraph",
          "aesthetic_analysis": "short paragraph",
          "issues": [
            {{
              "category": "layout|branding|content|accessibility|performance|visual|orchestration",
              "severity": "low|medium|high",
              "description": "short sentence"
            }}
          ],
          "quick_fixes": ["short bullet", "short bullet"],
          "orchestration_notes": "short paragraph",
          "capture_metadata": {{
            "url": "{item.url}",
            "title": "{item.title}",
            "body_chars": {item.body_chars},
            "source": "{item.source}",
            "warnings": {json.dumps(item.warnings)}
          }}
        }}

        Keep it concise but specific. Do not include markdown fences.
        """
    ).strip()


def summarize_items(items: list[dict[str, Any]]) -> dict[str, Any]:
    issue_counts: dict[str, int] = {}
    shell_like = 0
    brand = 0
    layout = 0
    content = 0
    for item in items:
        text = " ".join(
            [
                str(item.get("overall_assessment", "")),
                str(item.get("layout_analysis", "")),
                str(item.get("branding_analysis", "")),
                str(item.get("aesthetic_analysis", "")),
                str(item.get("orchestration_notes", "")),
                " ".join(item.get("quick_fixes", []) or []),
            ]
        ).lower()
        if "shell" in text or "placeholder" in text:
            shell_like += 1
        if "brand" in text:
            brand += 1
        if "layout" in text or "overflow" in text:
            layout += 1
        if "content" in text or "copy" in text:
            content += 1
        for issue in item.get("issues", []) or []:
            if isinstance(issue, dict):
                key = str(issue.get("category", "uncategorized"))
                issue_counts[key] = issue_counts.get(key, 0) + 1
    return {
        "issue_counts_by_category": issue_counts,
        "shell_like_count": shell_like,
        "needs_branding_pass_count": brand,
        "needs_layout_pass_count": layout,
        "needs_content_pass_count": content,
    }


def archive_report(report_path: Path, image_dir: Path) -> None:
    if not report_path.exists():
        return
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    archive_dir = ARCHIVE_ROOT / stamp
    archive_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(report_path, archive_dir / "visual_analysis_report.json")
    gallery = image_dir / "index.html"
    if gallery.exists():
        shutil.copy2(gallery, archive_dir / "index.html")
    manifest = {
        "generated_at": stamp,
        "source_report": str(report_path),
        "source_gallery": str(gallery) if gallery.exists() else None,
    }
    (archive_dir / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")


def main() -> int:
    args = parse_args()
    selected_slugs = load_selected_slugs(args)
    items = collect_items(args.image_dir, selected_slugs)
    if args.limit is not None:
        items = items[: args.limit]
    if not items:
        print("No matching screenshots found.")
        return 0

    report_items: list[dict[str, Any]] = []
    for index, item in enumerate(items, start=1):
        print(f"[{index}/{len(items)}] analyzing {item.slug}")
        prompt = prompt_for_item(item, args.focus, args.branding_only, args.verify_targets)
        try:
            response_text = openrouter_call(
                args.model,
                prompt,
                item.image_path,
                args.temperature,
                args.max_tokens,
            )
            parsed = extract_json(response_text)
            parsed.setdefault("slug", item.slug)
            parsed.setdefault("capture_metadata", {})
            parsed["capture_metadata"].update(
                {
                    "url": item.url,
                    "title": item.title,
                    "body_chars": item.body_chars,
                    "source": item.source,
                    "warnings": item.warnings,
                    "image_path": str(item.image_path),
                    "meta_path": str(item.meta_path),
                }
            )
            report_items.append(parsed)
        except Exception as exc:
            report_items.append(
                {
                    "slug": item.slug,
                    "overall_assessment": "analysis failed",
                    "layout_analysis": "",
                    "branding_analysis": "",
                    "aesthetic_analysis": "",
                    "issues": [
                        {
                            "category": "orchestration",
                            "severity": "high",
                            "description": f"analysis failed: {exc}",
                        }
                    ],
                    "quick_fixes": [],
                    "orchestration_notes": "Retry after fixing the analyzer or API configuration.",
                    "capture_metadata": {
                        "url": item.url,
                        "title": item.title,
                        "body_chars": item.body_chars,
                        "source": item.source,
                        "warnings": item.warnings,
                        "image_path": str(item.image_path),
                        "meta_path": str(item.meta_path),
                    },
                }
            )

        payload = {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "image_dir": str(args.image_dir),
            "output_file": str(args.output),
            "model": args.model,
            "quality": args.quality,
            "selected_slugs": sorted(selected_slugs) if selected_slugs else None,
            "item_count": len(report_items),
            "items": report_items,
            "summary": summarize_items(report_items),
        }
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n")

    archive_report(args.output, args.image_dir)
    print(f"Wrote {args.output}")
    print(f"Archived report to {ARCHIVE_ROOT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
