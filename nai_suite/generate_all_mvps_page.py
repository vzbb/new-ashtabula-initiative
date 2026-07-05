from __future__ import annotations

import html
import re
from collections import OrderedDict
from datetime import datetime, timezone
from pathlib import Path

from nai_suite.sitemap_data import load_sitemap_data

ROOT = Path(__file__).resolve().parent.parent
LANDING_PAGE_DIR = ROOT / "landing-page"
OUTPUT_PATH = LANDING_PAGE_DIR / "all-mvps.html"


def _slugify_section(value: str) -> str:
    slug = value.lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    return slug.strip("-") or "section"


def _group_routes(routes: list[dict[str, object]]) -> list[tuple[str, list[dict[str, object]]]]:
    grouped: "OrderedDict[str, list[dict[str, object]]]" = OrderedDict()
    for route in routes:
        category = str(route.get("category", "Uncategorized")).strip() or "Uncategorized"
        grouped.setdefault(category, []).append(route)
    return list(grouped.items())


def _render_metrics(route_count: int, category_count: int, ledger_count: int) -> str:
    metrics = [
        ("MVPs", route_count),
        ("Categories", category_count),
        ("Target ledger entries", ledger_count),
    ]
    items = []
    for label, value in metrics:
        items.append(
            f"<li><span class=\"metric-value\">{value}</span><span class=\"metric-label\">{html.escape(label)}</span></li>"
        )
    return "\n".join(items)


def _render_route_rows(items: list[dict[str, object]]) -> str:
    rows: list[str] = []
    for route in items:
        index = html.escape(str(route.get("index", "")))
        site = html.escape(str(route.get("site", "")))
        slug = html.escape(str(route.get("slug", "")))
        url = html.escape(str(route.get("url", "")))
        target = html.escape(str(route.get("target", "")))
        description = html.escape(str(route.get("description", "")))
        rows.append(
            "<tr>"
            f"<td>{index}</td>"
            f"<td>{site}</td>"
            f"<td><a href=\"{url}\">/{slug}/</a></td>"
            f"<td>{target}</td>"
            f"<td>{description}</td>"
            "</tr>"
        )
    return "\n".join(rows)


def _render_ledger_rows(entries: list[dict[str, object]]) -> str:
    rows: list[str] = []
    for entry in entries:
        site = html.escape(str(entry.get("site", "")))
        route = html.escape(str(entry.get("route", "")))
        primary_target = html.escape(str(entry.get("primary_target", "")))
        secondary_targets = html.escape(str(entry.get("secondary_targets", "")))
        notes = html.escape(str(entry.get("notes", "")))
        rows.append(
            "<tr>"
            f"<td>{site}</td>"
            f"<td>{route}</td>"
            f"<td>{primary_target}</td>"
            f"<td>{secondary_targets}</td>"
            f"<td>{notes}</td>"
            "</tr>"
        )
    return "\n".join(rows)


def render_all_mvps_page(data: dict[str, object]) -> str:
    routes = [route for route in data.get("routes", []) if isinstance(route, dict)]
    routes.sort(key=lambda route: int(route.get("index", 0) or 0))
    ledger = [entry for entry in data.get("target_ledger", []) if isinstance(entry, dict)]
    grouped_routes = _group_routes(routes)
    generated_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")

    nav_links = [
        f"<a href=\"#{_slugify_section(category)}\">{html.escape(category)} <span>{len(items)}</span></a>"
        for category, items in grouped_routes
    ]

    sections: list[str] = []
    for category, items in grouped_routes:
        section_id = _slugify_section(category)
        sections.append(
            "\n".join(
                [
                    f"<section id=\"{section_id}\">",
                    f"<h2>{html.escape(category)}</h2>",
                    f"<p class=\"section-meta\">{len(items)} route{'s' if len(items) != 1 else ''}</p>",
                    "<div class=\"table-wrap\">",
                    "<table>",
                    "<thead><tr><th>#</th><th>Site</th><th>Route</th><th>Target</th><th>Description</th></tr></thead>",
                    "<tbody>",
                    _render_route_rows(items),
                    "</tbody>",
                    "</table>",
                    "</div>",
                    "</section>",
                ]
            )
        )

    html_doc = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>All MVPs | New Ashtabula Initiative</title>
  <meta name="description" content="Canonical index of all MVP routes from SITEMAP.json.">
  <meta name="robots" content="noindex,nofollow">
  <style>
    :root {{
      color-scheme: light;
      --bg: #f7f8f6;
      --panel: #ffffff;
      --text: #18201c;
      --muted: #5c6761;
      --line: #d8ddd8;
      --accent: #1b5e4b;
      --accent-soft: #e5f0eb;
      --shadow: 0 1px 0 rgba(0, 0, 0, 0.03);
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.45;
    }}
    a {{ color: inherit; }}
    .shell {{
      width: min(1180px, calc(100% - 32px));
      margin: 0 auto;
    }}
    header {{
      padding: 28px 0 20px;
    }}
    .eyebrow {{
      margin: 0 0 8px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-size: 12px;
      color: var(--muted);
    }}
    h1 {{
      margin: 0;
      font-size: clamp(34px, 5vw, 56px);
      line-height: 1.05;
    }}
    .lede {{
      max-width: 78ch;
      margin: 14px 0 0;
      color: var(--muted);
      font-size: 16px;
    }}
    .stats {{
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin: 22px 0 18px;
      padding: 0;
    }}
    .stats li {{
      list-style: none;
      background: var(--panel);
      border: 1px solid var(--line);
      box-shadow: var(--shadow);
      border-radius: 8px;
      padding: 14px 16px;
      display: grid;
      gap: 4px;
    }}
    .metric-value {{
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 0;
    }}
    .metric-label {{
      font-size: 13px;
      color: var(--muted);
    }}
    nav {{
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 18px 0 8px;
    }}
    nav a {{
      text-decoration: none;
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid var(--line);
      background: var(--panel);
      color: var(--text);
      font-size: 13px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }}
    nav a span {{
      color: var(--muted);
      font-variant-numeric: tabular-nums;
    }}
    main {{
      padding: 10px 0 32px;
    }}
    section {{
      margin: 18px 0 26px;
    }}
    h2 {{
      margin: 0 0 4px;
      font-size: 24px;
    }}
    .section-meta {{
      margin: 0 0 10px;
      color: var(--muted);
      font-size: 13px;
    }}
    .table-wrap {{
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      overflow: auto;
      box-shadow: var(--shadow);
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
      min-width: 920px;
    }}
    th, td {{
      text-align: left;
      vertical-align: top;
      padding: 12px 14px;
      border-bottom: 1px solid var(--line);
      font-size: 14px;
    }}
    th {{
      background: #f2f5f3;
      color: var(--muted);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }}
    tbody tr:hover {{
      background: #f9fbf9;
    }}
    tbody tr:last-child td {{
      border-bottom: 0;
    }}
    footer {{
      border-top: 1px solid var(--line);
      color: var(--muted);
      font-size: 12px;
      padding: 18px 0 30px;
    }}
    .footer-grid {{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 12px;
    }}
    @media (max-width: 780px) {{
      .stats {{
        grid-template-columns: 1fr;
      }}
    }}
  </style>
</head>
<body>
  <header class="shell">
    <p class="eyebrow">Canonical MVP index</p>
    <h1>All MVPs</h1>
    <p class="lede">
      Generated from <code>SITEMAP.json</code>. This page mirrors the canonical route set,
      grouped by category and kept in route order so the deploy output stays honest.
    </p>
    <ul class="stats">
      {_render_metrics(len(routes), len(grouped_routes), len(ledger))}
    </ul>
    <nav aria-label="Route categories">
      {"".join(nav_links)}
    </nav>
  </header>
  <main class="shell">
    {"".join(sections)}
    <section id="target-ledger">
      <h2>Canonical Target Ledger</h2>
      <p class="section-meta">Primary targets stay canonical. Secondary targets are reference points, not automatic promotions.</p>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Site</th>
              <th>Route</th>
              <th>Primary target</th>
              <th>Secondary targets</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {_render_ledger_rows(ledger)}
          </tbody>
        </table>
      </div>
    </section>
  </main>
  <footer class="shell">
    <div class="footer-grid">
      <span>Source: <code>SITEMAP.json</code></span>
      <span>Generated: <time datetime="{generated_at}">{generated_at}</time></span>
    </div>
  </footer>
</body>
</html>
"""
    return html_doc


def write_all_mvps_page(path: Path = OUTPUT_PATH) -> Path:
    data = load_sitemap_data()
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(render_all_mvps_page(data) + "\n")
    return path


def main() -> None:
    path = write_all_mvps_page()
    print(f"Rendered {path.relative_to(ROOT)} from canonical SITEMAP.json")


if __name__ == "__main__":
    main()
