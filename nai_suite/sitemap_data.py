from __future__ import annotations

import json
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITEMAP_MD_PATH = ROOT / "SITEMAP.md"
SITEMAP_JSON_PATH = ROOT / "SITEMAP.json"
BASE_URL = "https://new-ashtabula-initiative.vercel.app"
ROUTE_URL_RE = re.compile(r"\[/([a-z0-9-]+)/\]\((https://new-ashtabula-initiative\.vercel\.app/[^)]+)\)")


def _normalize_markdown_text(text: str) -> str:
    if "\\n" in text and "\n" not in text:
        return text.replace("\\n", "\n")
    return text


def _parse_table_cells(line: str) -> list[str]:
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def _parse_site_row(line: str, category: str | None) -> dict[str, object] | None:
    if "https://new-ashtabula-initiative.vercel.app/" not in line:
        return None

    cells = _parse_table_cells(line)
    if len(cells) < 5:
        return None

    match = ROUTE_URL_RE.search(cells[2])
    if match is None:
        return None

    slug, url = match.groups()
    entry: dict[str, object] = {
        "index": int(cells[0]) if cells[0].isdigit() else None,
        "site": cells[1],
        "slug": slug,
        "url": url,
        "target": cells[3],
        "description": cells[4],
    }
    if category:
        entry["category"] = category
    return entry


def _parse_target_ledger(lines: list[str], start_index: int) -> list[dict[str, str]]:
    entries: list[dict[str, str]] = []
    for line in lines[start_index:]:
        if not line.startswith("|"):
            if entries:
                break
            continue
        cells = _parse_table_cells(line)
        if len(cells) != 5 or cells[0] == "Site" or cells[0].startswith("---"):
            continue
        entries.append(
            {
                "site": cells[0],
                "route": cells[1],
                "primary_target": cells[2],
                "secondary_targets": cells[3],
                "notes": cells[4],
            }
        )
    return entries


def parse_sitemap_markdown(path: Path = SITEMAP_MD_PATH) -> dict[str, object]:
    text = _normalize_markdown_text(path.read_text())
    lines = text.splitlines()

    routes: list[dict[str, object]] = []
    category: str | None = None
    target_ledger: list[dict[str, str]] = []

    for index, line in enumerate(lines):
        if line.startswith("### "):
            category = line.removeprefix("### ").strip()
            continue

        if line.startswith("## 🎯 Canonical Target Map"):
            target_ledger = _parse_target_ledger(lines, index + 1)
            continue

        row = _parse_site_row(line, category)
        if row is not None:
            routes.append(row)

    return {
        "schema_version": 1,
        "generated_from": path.name,
        "base_url": BASE_URL,
        "route_count": len(routes),
        "routes": routes,
        "target_ledger": target_ledger,
    }


def validate_sitemap_data(data: dict[str, object]) -> list[str]:
    errors: list[str] = []
    routes = data.get("routes")
    if not isinstance(routes, list):
        return ["`routes` must be a list"]

    slugs: set[str] = set()
    urls: set[str] = set()

    for index, route in enumerate(routes, start=1):
        if not isinstance(route, dict):
            errors.append(f"route #{index} is not an object")
            continue

        slug = str(route.get("slug", "")).strip()
        site = str(route.get("site", "")).strip()
        url = str(route.get("url", "")).strip()
        target = str(route.get("target", "")).strip()

        if not slug:
            errors.append(f"route #{index} missing slug")
        if not site:
            errors.append(f"route `{slug or index}` missing site name")
        if not target:
            errors.append(f"route `{slug or index}` missing target")
        expected_url = f"{BASE_URL}/{slug}/"
        if slug and url != expected_url:
            errors.append(f"route `{slug}` has url `{url}` but expected `{expected_url}`")
        if slug in slugs:
            errors.append(f"duplicate slug `{slug}`")
        if url in urls:
            errors.append(f"duplicate url `{url}`")
        slugs.add(slug)
        urls.add(url)

    expected_count = data.get("route_count")
    if expected_count != len(routes):
        errors.append(f"`route_count` is `{expected_count}` but actual routes = `{len(routes)}`")

    ledger = data.get("target_ledger")
    if ledger is not None and not isinstance(ledger, list):
        errors.append("`target_ledger` must be a list when present")

    return errors


def load_sitemap_data() -> dict[str, object]:
    if not SITEMAP_JSON_PATH.exists():
        raise FileNotFoundError(
            "SITEMAP.json is missing. Bootstrap it once with `./nai sitemap-import-md`."
        )

    data = json.loads(SITEMAP_JSON_PATH.read_text())
    errors = validate_sitemap_data(data)
    if errors:
        joined = "\n".join(f"- {error}" for error in errors)
        raise ValueError(f"SITEMAP.json is invalid:\n{joined}")
    return data


def write_sitemap_json(data: dict[str, object], path: Path = SITEMAP_JSON_PATH) -> Path:
    validated = dict(data)
    validated["route_count"] = len(validated.get("routes", []))
    errors = validate_sitemap_data(validated)
    if errors:
        joined = "\n".join(f"- {error}" for error in errors)
        raise ValueError(f"Refusing to write invalid sitemap data:\n{joined}")
    path.write_text(json.dumps(validated, indent=2) + "\n")
    return path


def import_sitemap_from_markdown() -> Path:
    return write_sitemap_json(parse_sitemap_markdown())


def render_sitemap_markdown(data: dict[str, object]) -> str:
    routes = [route for route in data.get("routes", []) if isinstance(route, dict)]
    ledger = [entry for entry in data.get("target_ledger", []) if isinstance(entry, dict)]
    by_category: dict[str, list[dict[str, object]]] = defaultdict(list)
    for route in routes:
        by_category[str(route.get("category", "Uncategorized"))].append(route)

    lines: list[str] = [
        "# NAI Project Sitemap",
        "",
        "> Canonical source of truth: `SITEMAP.json`",
        ">",
        "> This file is rendered for human reading and project context.",
        "> Do not make route or target changes here directly.",
        "> Use the structured sitemap workflow instead.",
        "",
        f"- Base URL: `{BASE_URL}/`",
        f"- Public routes: `{len(routes)}`",
        f"- Target-ledger entries: `{len(ledger)}`",
        "",
        "## Structured Workflow",
        "",
        "1. Change the canonical machine-readable data in `SITEMAP.json`.",
        "2. Run `./nai sitemap-validate`.",
        "3. Run `./nai sitemap-render-md`.",
        "4. Run `./nai routes` if route data changed.",
        "",
        "## Public Route Index",
        "",
    ]

    for category, items in by_category.items():
        lines.append(f"### {category}")
        lines.append("")
        lines.append("| # | Site | Route | Buyer/Target | Description |")
        lines.append("|---|------|-------|--------------|-------------|")
        for route in items:
            lines.append(
                f"| {route.get('index', '')} | {route.get('site', '')} | "
                f"[/{route.get('slug', '')}/]({route.get('url', '')}) | "
                f"{route.get('target', '')} | {route.get('description', '')} |"
            )
        lines.append("")

    lines.extend(
        [
            "## Canonical Target Ledger",
            "",
            "Primary targets below are the canonical first choice.",
            "Secondary targets are clone / white-label candidates, not automatic promotions.",
            "",
            "| Site | Route | Primary target | Clone / secondary candidates | Notes |",
            "|------|-------|----------------|------------------------------|-------|",
        ]
    )
    for entry in ledger:
        lines.append(
            f"| {entry.get('site', '')} | {entry.get('route', '')} | {entry.get('primary_target', '')} | "
            f"{entry.get('secondary_targets', '')} | {entry.get('notes', '')} |"
        )
    lines.append("")
    return "\n".join(lines)


def write_sitemap_markdown(data: dict[str, object], path: Path = SITEMAP_MD_PATH) -> Path:
    path.write_text(render_sitemap_markdown(data) + "\n")
    return path


def render_markdown_from_json() -> Path:
    return write_sitemap_markdown(load_sitemap_data())


def load_public_routes() -> list[dict[str, object]]:
    routes = load_sitemap_data().get("routes", [])
    return [route for route in routes if isinstance(route, dict)]


def find_route_by_slug(slug: str) -> dict[str, object] | None:
    slug = slug.strip()
    for route in load_public_routes():
        if str(route.get("slug", "")).strip() == slug:
            return route
    return None


def find_target_ledger_entry(route_path: str) -> dict[str, str] | None:
    route_path = route_path.strip()
    data = load_sitemap_data()
    ledger = data.get("target_ledger", [])
    if not isinstance(ledger, list):
        return None
    for entry in ledger:
        if not isinstance(entry, dict):
            continue
        if str(entry.get("route", "")).strip() == route_path:
            return entry
    return None


def next_route_index() -> int:
    highest = 0
    for route in load_public_routes():
        index = route.get("index")
        if isinstance(index, int):
            highest = max(highest, index)
    return highest + 1


def load_public_slugs() -> list[str]:
    slugs: list[str] = []
    seen: set[str] = set()
    for route in load_public_routes():
        slug = str(route.get("slug", "")).strip()
        if slug and slug not in seen:
            seen.add(slug)
            slugs.append(slug)
    return slugs


def load_public_urls() -> list[str]:
    urls: list[str] = []
    seen: set[str] = set()
    for route in load_public_routes():
        url = str(route.get("url", "")).strip()
        if url and url not in seen:
            seen.add(url)
            urls.append(url)
    return urls
