#!/usr/bin/env python3
from __future__ import annotations

import re
from collections import OrderedDict
from pathlib import Path

from nai_suite.sitemap_data import load_public_routes

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "landing-page" / "all-mvps.html"

def escape(value: object) -> str:
    text = str(value or "")
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def clean_category_label(value: object) -> str:
    text = str(value or "Uncategorized").strip()
    return re.sub(r"\s*\(\d+\s+sites?\)\s*$", "", text).strip()


def build_html(routes: list[dict[str, object]]) -> str:
    routes = sorted(routes, key=lambda route: int(route.get("index") or 10_000))
    by_category: OrderedDict[str, list[dict[str, object]]] = OrderedDict()
    for route in routes:
        by_category.setdefault(clean_category_label(route.get("category")), []).append(route)

    sections = []
    for category, items in by_category.items():
        cards = []
        for route in items:
            slug = str(route.get("slug") or "").strip()
            site = escape(route.get("site"))
            target = escape(route.get("target"))
            description = escape(route.get("description"))
            idx = escape(route.get("index"))
            cards.append(
                f"""
                <a href="/{slug}/" class="mvp-card">
                  <div class="card-top">
                    <div class="card-meta">
                      <span class="index-tag">#{idx}</span>
                      <span class="route-tag">/{slug}/</span>
                    </div>
                    <h3>{site}</h3>
                    <p>{description}</p>
                  </div>
                  <div class="card-bottom">
                    <span class="target-label">Target</span>
                    <strong>{target}</strong>
                  </div>
                </a>
                """.strip()
            )
        sections.append(
            f"""
            <section class="category-section">
              <div class="category-header">
                <h2>{escape(category)}</h2>
                <span class="category-count">{len(items)}</span>
              </div>
              <div class="mvp-grid">
                {''.join(cards)}
              </div>
            </section>
            """.strip()
        )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NAI MVP Index</title>
  <meta name="description" content="Hidden index of canonically tracked NAI MVPs. Generated from SITEMAP.json.">
  <style>
    :root {{
      --bg: #050505;
      --panel: #101010;
      --panel-2: #171717;
      --text: #f5f7fa;
      --muted: #a8b0bc;
      --border: rgba(107, 155, 255, 0.18);
      --accent: #77a4ff;
      --accent-soft: rgba(119, 164, 255, 0.12);
      --shadow: 0 24px 60px rgba(0,0,0,.28);
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: "Inter", "Segoe UI", sans-serif;
      background:
        radial-gradient(circle at top right, rgba(119,164,255,.12), transparent 22%),
        radial-gradient(circle at top left, rgba(255,255,255,.04), transparent 18%),
        var(--bg);
      color: var(--text);
    }}
    .wrap {{
      max-width: 1480px;
      margin: 0 auto;
      padding: 24px;
    }}
    .hero {{
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 16px;
      padding: 18px 20px;
      border: 1px solid var(--border);
      border-radius: 18px;
      background: linear-gradient(180deg, rgba(23,23,23,.96), rgba(16,16,16,.98));
      box-shadow: var(--shadow);
      margin-bottom: 18px;
    }}
    .hero h1 {{
      margin: 0 0 6px;
      font-size: clamp(28px, 5vw, 44px);
      letter-spacing: -0.05em;
      line-height: 1;
    }}
    .hero p {{
      margin: 0;
      color: var(--muted);
      max-width: 800px;
      line-height: 1.5;
    }}
    .hero-meta {{
      display: grid;
      gap: 8px;
      justify-items: end;
    }}
    .meta-pill {{
      padding: 7px 11px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: rgba(255,255,255,.03);
      color: var(--muted);
      font-size: 12px;
      white-space: nowrap;
    }}
    .main {{
      display: grid;
      gap: 18px;
    }}
    .category-section {{
      display: grid;
      gap: 10px;
    }}
    .category-header {{
      display: flex;
      align-items: center;
      gap: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(255,255,255,.08);
    }}
    .category-header h2 {{
      margin: 0;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: .12em;
      color: var(--muted);
    }}
    .category-count {{
      padding: 4px 9px;
      border-radius: 999px;
      background: var(--accent-soft);
      border: 1px solid var(--border);
      color: var(--accent);
      font-size: 11px;
      font-weight: 700;
    }}
    .mvp-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 10px;
      align-items: stretch;
    }}
    .mvp-card {{
      min-height: 168px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 14px;
      padding: 16px;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,.06);
      background: linear-gradient(180deg, var(--panel-2), var(--panel));
      text-decoration: none;
      color: inherit;
      transition: transform .18s ease, border-color .18s ease, background .18s ease;
    }}
    .mvp-card:hover {{
      transform: translateY(-2px);
      border-color: var(--accent);
      background: linear-gradient(180deg, #1b1b1b, #111111);
    }}
    .route-tag {{
      display: inline-flex;
      width: fit-content;
      padding: 4px 8px;
      border-radius: 999px;
      background: rgba(119,164,255,.11);
      border: 1px solid rgba(119,164,255,.18);
      color: var(--accent);
      font-size: 11px;
      font-weight: 700;
      font-family: "SFMono-Regular", Consolas, monospace;
    }}
    .index-tag {{
      display: inline-flex;
      width: fit-content;
      padding: 4px 8px;
      border-radius: 999px;
      background: rgba(255,255,255,.05);
      border: 1px solid rgba(255,255,255,.08);
      color: var(--muted);
      font-size: 11px;
      font-weight: 700;
      font-family: "SFMono-Regular", Consolas, monospace;
    }}
    .card-meta {{
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }}
    .mvp-card h3 {{
      margin: 10px 0 8px;
      font-size: 20px;
      letter-spacing: -0.03em;
      line-height: 1.1;
    }}
    .mvp-card p {{
      margin: 0;
      color: var(--muted);
      font-size: 14px;
      line-height: 1.45;
    }}
    .card-bottom {{
      display: grid;
      gap: 4px;
    }}
    .target-label {{
      color: var(--muted);
      font-size: 10px;
      letter-spacing: .14em;
      text-transform: uppercase;
    }}
    .card-bottom strong {{
      font-size: 14px;
      line-height: 1.35;
    }}
    @media (max-width: 900px) {{
      .hero {{
        grid-template-columns: 1fr;
        align-items: start;
        display: grid;
      }}
      .hero-meta {{
        justify-items: start;
      }}
    }}
  </style>
</head>
<body>
  <div class="wrap">
    <section class="hero">
      <div>
        <h1>NAI MVP Index</h1>
        <p>Hidden route inventory generated from the canonical sitemap. This page is for internal orientation, quick browsing, and portfolio oversight.</p>
      </div>
      <div class="hero-meta">
        <span class="meta-pill">{len(routes)} canonical MVP routes</span>
        <span class="meta-pill">Generated from SITEMAP.json</span>
      </div>
    </section>
    <main class="main">
      {''.join(sections)}
    </main>
  </div>
</body>
</html>
"""


def main() -> int:
    routes = load_public_routes()
    OUTPUT.write_text(build_html(routes))
    print(f"Wrote {OUTPUT}")
    print(f"Routes rendered: {len(routes)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
