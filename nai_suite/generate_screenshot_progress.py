#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import math
import webbrowser
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from visual_report_summary import get_items, load_report, overall, target_entity, target_status


ROOT = Path(__file__).resolve().parent.parent
ARCHIVE_DIR = ROOT / ".sitemap_screenshots_analysis_archive"
CURRENT_REPORT = ROOT / "sitemap_screenshots" / "visual_analysis_report.json"
DEFAULT_OUTPUT = ROOT / "sitemap_screenshots" / "progress.html"
DEFAULT_DATA_OUTPUT = ROOT / "sitemap_screenshots" / "progress_data.json"
METRICS = [
    ("design_score_10", "Design"),
    ("branding_score_10", "Branding"),
    ("clarity_score_10", "Clarity"),
    ("white_label_fit_10", "White-label fit"),
]
EXCLUDED_SNAPSHOT_INDEXES = {0, 2}
RETIRED_SLUGS = {"ai-docent", "insta-book-stripe"}


def parse_isoish(value: str | None) -> datetime:
    if not value:
        return datetime.fromtimestamp(0, tz=timezone.utc)
    normalized = value.replace("Z", "+00:00")
    try:
        dt = datetime.fromisoformat(normalized)
    except ValueError:
        return datetime.fromtimestamp(0, tz=timezone.utc)
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def snapshot_timestamp(path: Path, report: dict[str, Any]) -> datetime:
    generated_at = str(report.get("generated_at") or "").strip()
    if generated_at:
        return parse_isoish(generated_at)
    return datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc)


def score_value(item: dict[str, Any], key: str) -> float:
    oa = overall(item)
    value = oa.get(key, 0)
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def composite_score(item: dict[str, Any]) -> float:
    scores = [score_value(item, key) for key, _label in METRICS]
    return round(sum(scores) / len(scores), 2) if scores else 0.0


def mean(values: list[float]) -> float:
    return sum(values) / len(values) if values else 0.0


def median(values: list[float]) -> float:
    if not values:
        return 0.0
    sorted_values = sorted(values)
    mid = len(sorted_values) // 2
    if len(sorted_values) % 2:
        return float(sorted_values[mid])
    return (sorted_values[mid - 1] + sorted_values[mid]) / 2.0


def pearson(xs: list[float], ys: list[float]) -> float:
    if len(xs) != len(ys) or len(xs) < 2:
        return 0.0
    x_mean = mean(xs)
    y_mean = mean(ys)
    num = sum((x - x_mean) * (y - y_mean) for x, y in zip(xs, ys))
    den_x = sum((x - x_mean) ** 2 for x in xs)
    den_y = sum((y - y_mean) ** 2 for y in ys)
    denom = math.sqrt(den_x * den_y)
    return round(num / denom, 4) if denom else 0.0


def slope(values: list[float]) -> float:
    if len(values) < 2:
        return 0.0
    x_mean = (len(values) - 1) / 2
    y_mean = mean(values)
    denom = sum((i - x_mean) ** 2 for i in range(len(values)))
    if not denom:
        return 0.0
    num = sum((i - x_mean) * (y - y_mean) for i, y in enumerate(values))
    return round(num / denom, 4)


def volatility(values: list[float]) -> float:
    if len(values) < 2:
        return 0.0
    m = mean(values)
    return round(math.sqrt(sum((v - m) ** 2 for v in values) / len(values)), 4)


def reduce_item(item: dict[str, Any]) -> dict[str, Any]:
    return {
        "slug": str(item.get("slug") or ""),
        "overall": {
            "design_score_10": score_value(item, "design_score_10"),
            "branding_score_10": score_value(item, "branding_score_10"),
            "clarity_score_10": score_value(item, "clarity_score_10"),
            "white_label_fit_10": score_value(item, "white_label_fit_10"),
            "composite_score_10": composite_score(item),
        },
        "needs_branding_pass": bool(item.get("orchestration_notes", {}).get("needs_branding_pass")),
        "needs_layout_pass": bool(item.get("orchestration_notes", {}).get("needs_layout_pass")),
        "needs_content_pass": bool(item.get("orchestration_notes", {}).get("needs_content_pass")),
        "shell_like": bool(item.get("orchestration_notes", {}).get("shell_like")),
    }


def collect_snapshot_paths(archive_dir: Path, current_report: Path) -> list[Path]:
    paths = sorted(archive_dir.glob("*/visual_analysis_report.json"))
    if current_report.exists():
        paths.append(current_report)
    unique: dict[Path, Path] = {}
    for path in paths:
        unique[path.resolve()] = path
    return list(unique.values())


def load_snapshot(path: Path, current_report: Path) -> dict[str, Any]:
    report = load_report(path)
    items = [item for item in get_items(report) if isinstance(item, dict)]
    counts = report.get("summary", {}) if isinstance(report.get("summary", {}), dict) else {}
    ts = snapshot_timestamp(path, report)
    slug_items = {
        str(item.get("slug") or ""): reduce_item(item)
        for item in items
        if str(item.get("slug") or "").strip()
    }
    averages = {}
    for key, _label in METRICS:
        vals = [score_value(item, key) for item in items]
        averages[key] = round(sum(vals) / len(vals), 2) if vals else 0.0
    averages["composite_score_10"] = round(
        sum(
            averages[key]
            for key, _label in METRICS
        )
        / len(METRICS),
        2,
    ) if items else 0.0
    branding_counts: dict[str, int] = defaultdict(int)
    target_counts: dict[str, int] = defaultdict(int)
    for item in items:
        target_counts[str(target_status(item) or "unknown")] += 1
        brand_presence = str(item.get("branding_analysis", {}).get("brand_presence") or "").strip()
        if brand_presence == "strong":
            branding_counts["branded"] += 1
        elif brand_presence in {"weak", "almost_none"}:
            branding_counts["unbranded"] += 1
        else:
            branding_counts["partial"] += 1
    flattened_summary = {
        "branded_count": int(branding_counts.get("branded", 0)),
        "partial_count": int(branding_counts.get("partial", 0)),
        "unbranded_count": int(branding_counts.get("unbranded", 0)),
        "clear_cut_count": int(target_counts.get("clear_cut", 0)),
        "needs_target_definition_count": int(target_counts.get("needs_target_definition", 0)),
        "needs_buyer_mapping_count": int(target_counts.get("needs_buyer_mapping", 0)),
        "shell_like_count": int(counts.get("shell_like_count", 0) or 0),
        "needs_branding_pass_count": int(counts.get("needs_branding_pass_count", 0) or 0),
        "needs_layout_pass_count": int(counts.get("needs_layout_pass_count", 0) or 0),
        "needs_content_pass_count": int(counts.get("needs_content_pass_count", 0) or 0),
        "research_needed_count": int(counts.get("research_needed_count", 0) or 0),
    }
    return {
        "id": path.parent.name if path.resolve() != current_report.resolve() else "current",
        "source_path": str(path.relative_to(ROOT)),
        "generated_at": report.get("generated_at"),
        "generated_sort": ts.isoformat(),
        "item_count": report.get("item_count") or len(items),
        "summary": flattened_summary,
        "averages": averages,
        "branding_counts": dict(branding_counts),
        "target_counts": dict(target_counts),
        "items": slug_items,
    }


def percent_change(current: float, previous: float) -> float:
    if previous == current == 0:
        return 0.0
    return current - previous


def build_payload(snapshots: list[dict[str, Any]]) -> dict[str, Any]:
    all_slugs = sorted(
        {
            slug
            for snap in snapshots
            for slug in snap["items"].keys()
            if slug not in RETIRED_SLUGS
        }
    )
    slug_series: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for snap in snapshots:
        for slug in all_slugs:
            item = snap["items"].get(slug)
            if item:
                slug_series[slug].append(
                    {
                        "snapshot_id": snap["id"],
                        "generated_at": snap["generated_at"],
                        "generated_sort": snap["generated_sort"],
                        "design_score_10": item["overall"]["design_score_10"],
                        "branding_score_10": item["overall"]["branding_score_10"],
                        "clarity_score_10": item["overall"]["clarity_score_10"],
                        "white_label_fit_10": item["overall"]["white_label_fit_10"],
                        "composite_score_10": item["overall"]["composite_score_10"],
                    }
                )
    latest_vectors: dict[str, dict[str, float]] = {}
    if snapshots:
        latest_snapshot = snapshots[-1]
        for slug in all_slugs:
            latest_item = latest_snapshot["items"].get(slug)
            if not latest_item:
                continue
            latest_vectors[slug] = {
                "design_score_10": latest_item["overall"]["design_score_10"],
                "branding_score_10": latest_item["overall"]["branding_score_10"],
                "clarity_score_10": latest_item["overall"]["clarity_score_10"],
                "white_label_fit_10": latest_item["overall"]["white_label_fit_10"],
                "composite_score_10": latest_item["overall"]["composite_score_10"],
            }
    movers: list[dict[str, Any]] = []
    if snapshots:
        first = snapshots[0]
        latest = snapshots[-1]
        for slug in all_slugs:
            first_item = first["items"].get(slug)
            latest_item = latest["items"].get(slug)
            if not first_item or not latest_item:
                continue
            first_composite = first_item["overall"]["composite_score_10"]
            latest_composite = latest_item["overall"]["composite_score_10"]
            movers.append(
                {
                    "slug": slug,
                    "design_delta": round(
                        latest_item["overall"]["design_score_10"] - first_item["overall"]["design_score_10"], 2
                    ),
                    "branding_delta": round(
                        latest_item["overall"]["branding_score_10"] - first_item["overall"]["branding_score_10"], 2
                    ),
                    "clarity_delta": round(
                        latest_item["overall"]["clarity_score_10"] - first_item["overall"]["clarity_score_10"], 2
                    ),
                    "white_label_delta": round(
                        latest_item["overall"]["white_label_fit_10"] - first_item["overall"]["white_label_fit_10"], 2
                    ),
                    "composite_delta": round(latest_composite - first_composite, 2),
                    "first_composite": first_composite,
                    "latest_composite": latest_composite,
                }
            )
    movers.sort(key=lambda row: (row["composite_delta"], row["slug"]), reverse=True)
    latest_snapshot = snapshots[-1] if snapshots else {}
    latest_rankings = []
    if latest_snapshot:
        for slug in all_slugs:
            latest_item = latest_snapshot["items"].get(slug)
            first_item = snapshots[0]["items"].get(slug) if snapshots else None
            if not latest_item:
                continue
            latest_rankings.append(
                {
                    "slug": slug,
                    "composite_score_10": latest_item["overall"]["composite_score_10"],
                    "design_score_10": latest_item["overall"]["design_score_10"],
                    "branding_score_10": latest_item["overall"]["branding_score_10"],
                    "clarity_score_10": latest_item["overall"]["clarity_score_10"],
                    "white_label_fit_10": latest_item["overall"]["white_label_fit_10"],
                    "delta": round(latest_item["overall"]["composite_score_10"] - (first_item["overall"]["composite_score_10"] if first_item else latest_item["overall"]["composite_score_10"]), 2),
                }
            )
        latest_rankings.sort(key=lambda row: (row["composite_score_10"], row["delta"], row["slug"]), reverse=True)
    metric_correlations: dict[str, dict[str, float]] = {}
    metric_keys = [key for key, _label in METRICS] + ["composite_score_10"]
    for key_a in metric_keys:
        metric_correlations[key_a] = {}
        for key_b in metric_keys:
            xs: list[float] = []
            ys: list[float] = []
            for slug, vec in latest_vectors.items():
                if key_a in vec and key_b in vec:
                    xs.append(vec[key_a])
                    ys.append(vec[key_b])
            metric_correlations[key_a][key_b] = pearson(xs, ys)
    site_trends: list[dict[str, Any]] = []
    for slug in all_slugs:
        series = slug_series.get(slug, [])
        if not series:
            continue
        composite_series = [entry["composite_score_10"] for entry in series]
        design_series = [entry["design_score_10"] for entry in series]
        branding_series = [entry["branding_score_10"] for entry in series]
        clarity_series = [entry["clarity_score_10"] for entry in series]
        white_label_series = [entry["white_label_fit_10"] for entry in series]
        latest = latest_vectors.get(slug, {})
        site_trends.append(
            {
                "slug": slug,
                "snapshots": len(series),
                "latest_composite": latest.get("composite_score_10", composite_series[-1]),
                "composite_delta": round(composite_series[-1] - composite_series[0], 2),
                "composite_slope": slope(composite_series),
                "composite_volatility": volatility(composite_series),
                "design_slope": slope(design_series),
                "branding_slope": slope(branding_series),
                "clarity_slope": slope(clarity_series),
                "white_label_slope": slope(white_label_series),
                "latest_design": latest.get("design_score_10", design_series[-1]),
                "latest_branding": latest.get("branding_score_10", branding_series[-1]),
                "latest_clarity": latest.get("clarity_score_10", clarity_series[-1]),
                "latest_white_label": latest.get("white_label_fit_10", white_label_series[-1]),
            }
        )
    site_trends.sort(key=lambda row: (row["latest_composite"], row["composite_slope"], row["slug"]), reverse=True)
    latest_composites = [row["latest_composite"] for row in site_trends]
    latest_brandings = [row["latest_branding"] for row in site_trends]
    composite_median = median(latest_composites)
    branding_median = median(latest_brandings)
    quadrant_counts = {
        "high_high": 0,
        "high_low": 0,
        "low_high": 0,
        "low_low": 0,
    }
    for row in site_trends:
        high_composite = row["latest_composite"] >= composite_median
        high_branding = row["latest_branding"] >= branding_median
        if high_composite and high_branding:
            quadrant_counts["high_high"] += 1
        elif high_composite and not high_branding:
            quadrant_counts["high_low"] += 1
        elif not high_composite and high_branding:
            quadrant_counts["low_high"] += 1
        else:
            quadrant_counts["low_low"] += 1
    return {
        "metrics": [{"key": key, "label": label} for key, label in METRICS],
        "snapshots": snapshots,
        "slug_series": slug_series,
        "slugs": all_slugs,
        "movers": movers,
        "latest_rankings": latest_rankings,
        "latest_vectors": latest_vectors,
        "metric_correlations": metric_correlations,
        "site_trends": site_trends,
        "trend_medians": {
            "composite": composite_median,
            "branding": branding_median,
        },
        "quadrant_counts": quadrant_counts,
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }


def escape_json_for_html(data: dict[str, Any]) -> str:
    return json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")


def render_html(payload_json: str) -> str:
    template = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>NAI Progress Dashboard</title>
  <script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
  <style>
    :root {{
      color-scheme: dark;
      --bg: #07111d;
      --panel: rgba(10, 20, 34, 0.92);
      --panel-2: rgba(14, 26, 44, 0.92);
      --border: rgba(154, 173, 198, 0.22);
      --text: #e8eef8;
      --muted: #a7b5c8;
      --accent: #7dd3fc;
      --accent-2: #fbbf24;
      --good: #4ade80;
      --warn: #f59e0b;
      --bad: #fb7185;
      --shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      min-height: 100vh;
      background:
        radial-gradient(circle at top left, rgba(56, 189, 248, 0.12), transparent 30%),
        radial-gradient(circle at top right, rgba(251, 191, 36, 0.12), transparent 24%),
        linear-gradient(180deg, #06111b 0%, #07111d 100%);
      color: var(--text);
    }}
    .wrap {{ max-width: 1480px; margin: 0 auto; padding: 28px 20px 40px; }}
    .hero {{
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 16px;
      align-items: stretch;
      margin-bottom: 18px;
    }}
    .panel {{
      background: linear-gradient(180deg, rgba(13, 23, 39, 0.96), rgba(8, 16, 27, 0.96));
      border: 1px solid var(--border);
      border-radius: 22px;
      box-shadow: var(--shadow);
    }}
    .hero-copy, .stats, .section, .snapshot-card, .site-card, .table-card {{ padding: 18px; }}
    h1 {{ margin: 0 0 10px; font-size: clamp(28px, 4vw, 52px); line-height: 0.98; letter-spacing: -0.04em; }}
    .lede {{ margin: 0; color: var(--muted); font-size: 15px; max-width: 70ch; }}
    .meta-row, .controls, .pill-row, .stat-grid, .mini-grid, .mover-grid {{ display: flex; flex-wrap: wrap; gap: 10px; }}
    .chip {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(125, 211, 252, 0.12);
      border: 1px solid rgba(125, 211, 252, 0.25);
      color: #d9f3ff;
      font-size: 12px;
      white-space: nowrap;
    }}
    .stats {{
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }}
    .stat {{
      background: linear-gradient(180deg, rgba(15, 29, 49, 0.9), rgba(10, 20, 34, 0.9));
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 14px;
    }}
    .stat .label {{ font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }}
    .stat .value {{ font-size: 26px; font-weight: 800; margin-top: 4px; }}
    .stat .sub {{ font-size: 12px; color: var(--muted); margin-top: 4px; }}
    .section {{ margin-top: 16px; }}
    .section h2 {{ margin: 0 0 10px; font-size: 20px; letter-spacing: -0.02em; }}
    .controls {{
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }}
    .controls .group {{ display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }}
    select, button {{
      appearance: none;
      border: 1px solid var(--border);
      background: rgba(11, 20, 33, 0.95);
      color: var(--text);
      border-radius: 12px;
      padding: 10px 12px;
      font: inherit;
    }}
    button {{
      cursor: pointer;
      transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
    }}
    button:hover, select:hover {{ border-color: rgba(125, 211, 252, 0.55); }}
    button.active {{ background: rgba(125, 211, 252, 0.16); border-color: rgba(125, 211, 252, 0.6); }}
    .chart {{
      width: 100%;
      overflow: hidden;
      border-radius: 18px;
      border: 1px solid var(--border);
      background: linear-gradient(180deg, rgba(8, 16, 27, 0.98), rgba(7, 13, 23, 0.98));
    }}
    .chart-inner {{ width: 100%; height: 320px; }}
    .chart svg {{ display: block; width: 100%; height: 100%; }}
    .heatmap {{
      display: grid;
      gap: 6px;
      border-radius: 18px;
      padding: 14px;
      border: 1px solid var(--border);
      background: linear-gradient(180deg, rgba(8, 16, 27, 0.98), rgba(7, 13, 23, 0.98));
      overflow: auto;
    }}
    .heatmap-grid {{
      display: grid;
      gap: 6px;
      align-items: stretch;
      min-width: 100%;
    }}
    .heatmap-head, .heatmap-row {{
      display: grid;
      gap: 6px;
      align-items: stretch;
    }}
    .heatmap-head div, .heatmap-label, .heatmap-cell {{
      border-radius: 12px;
      padding: 10px 8px;
      font-size: 12px;
      text-align: center;
      border: 1px solid rgba(154, 173, 198, 0.12);
      background: rgba(255,255,255,0.03);
      color: var(--text);
    }}
    .heatmap-label {{
      text-align: left;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }}
    .heatmap-cell {{
      font-variant-numeric: tabular-nums;
      font-weight: 700;
    }}
    .heatmap-cell strong {{
      display: block;
      font-size: 10px;
      letter-spacing: 0.06em;
      color: rgba(255,255,255,0.78);
      text-transform: uppercase;
      margin-bottom: 3px;
    }}
    .legend {{
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 10px;
      font-size: 12px;
      color: var(--muted);
    }}
    .legend span {{ display: inline-flex; align-items: center; gap: 7px; }}
    .dot {{ width: 10px; height: 10px; border-radius: 999px; display: inline-block; }}
    .grid-2 {{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }}
    .grid-3 {{ display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }}
    .grid-4 {{ display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }}
    .snapshot-card, .site-card, .table-card {{
      background: linear-gradient(180deg, rgba(11, 20, 33, 0.96), rgba(8, 15, 25, 0.96));
      border: 1px solid var(--border);
      border-radius: 18px;
    }}
    .section-title {{ display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }}
    .section-title .sub {{ color: var(--muted); font-size: 12px; }}
    .row {{ display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }}
    .metric-pill {{
      padding: 7px 10px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.03);
      font-size: 12px;
      color: var(--muted);
    }}
    .metric-pill strong {{ color: var(--text); font-weight: 700; }}
    .badge {{
      display: inline-flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: 999px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      background: rgba(255,255,255,0.05);
      color: var(--muted);
    }}
    .badge.good {{ color: #b7ffd1; background: rgba(74, 222, 128, 0.14); }}
    .badge.warn {{ color: #ffe3a3; background: rgba(245, 158, 11, 0.16); }}
    .badge.bad {{ color: #ffd0da; background: rgba(251, 113, 133, 0.16); }}
    .snapshot-list, .site-list {{ display: grid; gap: 10px; }}
    .snapshot-item, .site-item {{
      padding: 12px 14px;
      border-radius: 14px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(154, 173, 198, 0.12);
      cursor: pointer;
    }}
    .snapshot-item.active, .site-item.active {{
      border-color: rgba(125, 211, 252, 0.55);
      background: rgba(125, 211, 252, 0.08);
    }}
    .snapshot-item .title, .site-item .title {{ display:flex; justify-content:space-between; gap: 10px; font-weight: 700; }}
    .snapshot-item .meta, .site-item .meta {{ color: var(--muted); font-size: 12px; margin-top: 4px; }}
    .progress-bar {{ height: 8px; border-radius: 999px; background: rgba(255,255,255,0.08); overflow: hidden; }}
    .progress-bar > span {{ display:block; height:100%; border-radius: inherit; }}
    .empty {{ color: var(--muted); font-size: 13px; }}
    table {{ width:100%; border-collapse: collapse; }}
    th, td {{ padding: 10px 8px; text-align: left; border-bottom: 1px solid rgba(154, 173, 198, 0.12); font-size: 13px; }}
    th {{ color: var(--muted); font-weight: 600; }}
    tr:hover td {{ background: rgba(255,255,255,0.02); }}
    .rank-row {{
      display: grid;
      grid-template-columns: 1.3fr repeat(5, minmax(0, 0.7fr));
      gap: 6px;
      align-items: stretch;
      margin-bottom: 6px;
    }}
    .rank-head div, .rank-cell {{
      border-radius: 12px;
      padding: 9px 8px;
      font-size: 12px;
      border: 1px solid rgba(154, 173, 198, 0.12);
      background: rgba(255,255,255,0.03);
    }}
    .rank-head div {{
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 10px;
    }}
    .rank-cell.score {{
      font-weight: 800;
    }}
    .footer-note {{ color: var(--muted); font-size: 12px; margin-top: 10px; }}
    @media (max-width: 1024px) {{
      .hero, .grid-2, .grid-3, .grid-4 {{ grid-template-columns: 1fr; }}
      .stats {{ grid-template-columns: repeat(2, minmax(0, 1fr)); }}
      .chart-inner {{ height: 260px; }}
    }}
    @media (max-width: 720px) {{
      .wrap {{ padding: 18px 12px 32px; }}
      .stats {{ grid-template-columns: 1fr; }}
      .controls {{ align-items: flex-start; flex-direction: column; }}
      .chart-inner {{ height: 240px; }}
    }}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hero">
      <div class="panel hero-copy">
        <div class="meta-row" id="snapshotChips"></div>
        <h1>NAI Progress Dashboard</h1>
        <p class="lede">
          A lightweight, interactive timeline for the archived visual QA reports. It reads the JSON snapshots,
          tracks changes over time, and lets you compare sites without keeping every screenshot forever.
        </p>
      </div>
      <div class="panel stats" id="heroStats"></div>
    </div>

    <div class="section panel">
      <div class="controls">
        <div class="group">
          <span class="badge good">Timeline</span>
          <span class="badge">Interactive</span>
          <span class="badge">JSON snapshots</span>
        </div>
        <div class="group">
          <select id="snapshotSelect" aria-label="Select snapshot"></select>
        </div>
      </div>
      <div class="grid-2">
        <div>
          <div class="section-title">
            <h2>Snapshot trajectory</h2>
            <div class="sub">Average scores across archived reports</div>
          </div>
          <div class="chart panel"><div class="chart-inner" id="overviewChart"></div></div>
          <div class="legend" id="overviewLegend"></div>
        </div>
        <div>
          <div class="section-title">
            <h2>Snapshot heatmap</h2>
            <div class="sub">Rows are snapshots, columns are score channels</div>
          </div>
          <div class="heatmap" id="snapshotHeatmap"></div>
        </div>
      </div>
    </div>

    <div class="section panel">
      <div class="section-title">
        <h2>Pattern map</h2>
        <div class="sub">3D state-space + correlation matrix</div>
      </div>
      <div class="grid-2">
        <div class="panel">
          <div class="controls">
            <div class="group" id="scatterControls"></div>
          </div>
          <div class="chart panel"><div class="chart-inner" id="scatterChart"></div></div>
          <div class="legend" id="scatterLegend"></div>
        </div>
        <div class="panel">
          <div class="section-title">
            <h2>Metric correlations</h2>
            <div class="sub">Latest snapshot across all sites</div>
          </div>
          <div class="heatmap" id="correlationHeatmap"></div>
          <div class="footer-note" id="patternSummary"></div>
        </div>
      </div>
    </div>

    <div class="section panel">
      <div class="section-title">
        <h2>Trend rails</h2>
        <div class="sub">3D progress trails across snapshots</div>
      </div>
      <div class="controls">
        <div class="group" id="railControls"></div>
      </div>
      <div class="chart panel"><div class="chart-inner" id="trailChart"></div></div>
      <div class="legend" id="trailLegend"></div>
    </div>

    <div class="section grid-2">
      <div class="panel table-card">
        <div class="section-title">
          <h2>Biggest movers</h2>
          <div class="sub">First report vs latest report</div>
        </div>
        <div id="moversTable"></div>
      </div>
      <div class="panel table-card">
        <div class="section-title">
          <h2>Latest ranking</h2>
          <div class="sub">Sorted by latest composite score</div>
        </div>
        <div id="rankingTable"></div>
      </div>
    </div>

    <div class="section panel">
      <div class="section-title">
        <h2>Snapshot list</h2>
        <div class="sub">Click to inspect a report</div>
      </div>
      <div class="snapshot-list" id="snapshotList"></div>
    </div>
  </div>

  <script>
    window.__NAI_PROGRESS__ = __PAYLOAD__;
  </script>
  <script>
    const DATA = window.__NAI_PROGRESS__;
    const state = {{
      snapshotIndex: Math.max(0, DATA.snapshots.length - 1),
      scatterX: "latest_composite",
      scatterY: "latest_branding",
      scatterZ: "latest_clarity",
      railMetric: "composite_score_10",
      railCount: 12,
    }};

    const METRIC_COLORS = {{
      design_score_10: "#7dd3fc",
      branding_score_10: "#fbbf24",
      clarity_score_10: "#4ade80",
      white_label_fit_10: "#c084fc",
    }};

    const METRIC_LABELS = {{
      design_score_10: "Design",
      branding_score_10: "Branding",
      clarity_score_10: "Clarity",
      white_label_fit_10: "White-label fit",
      composite_score_10: "Composite",
      composite_slope: "Composite slope",
      composite_volatility: "Composite volatility",
      latest_composite: "Latest composite",
      latest_design: "Latest design",
      latest_branding: "Latest branding",
      latest_clarity: "Latest clarity",
      latest_white_label: "Latest white-label",
      design_score_10: "Design",
      branding_score_10: "Branding",
      clarity_score_10: "Clarity",
      white_label_fit_10: "White-label fit",
    }};

    const SCATTER_FIELDS = [
      "latest_composite",
      "latest_design",
      "latest_branding",
      "latest_clarity",
      "latest_white_label",
      "composite_slope",
      "composite_volatility",
      "composite_delta",
    ];

    const RAIL_METRICS = [
      "composite_score_10",
      "design_score_10",
      "branding_score_10",
      "clarity_score_10",
      "white_label_fit_10",
    ];

    const fmt = (n) => Number.isFinite(n) ? n.toFixed(1) : "0.0";
    const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

    function currentSnapshot() {{
      return DATA.snapshots[state.snapshotIndex];
    }}

    function average(values) {{
      if (!values.length) return 0;
      return values.reduce((sum, v) => sum + v, 0) / values.length;
    }}

    function median(values) {{
      if (!values.length) return 0;
      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }}

    function scoreColor(score) {{
      const s = Math.max(0, Math.min(10, Number(score) || 0)) / 10;
      const hue = 210 - (s * 120);
      const light = 18 + (s * 18);
      return `hsl(${hue} 78% ${light}%)`;
    }}

    function renderHeroStats() {{
      const latest = currentSnapshot();
      const summary = latest.summary || {{}};
      const avgDesign = fmt(latest.averages.design_score_10 || 0);
      const avgBrand = fmt(latest.averages.branding_score_10 || 0);
      const avgClarity = fmt(latest.averages.clarity_score_10 || 0);
      const branded = summary.branded_count ?? latest.branding_counts?.branded ?? 0;
      const partial = summary.partial_count ?? latest.branding_counts?.partial ?? 0;
      const unbranded = summary.unbranded_count ?? latest.branding_counts?.unbranded ?? 0;
      const shell = summary.shell_like_count ?? 0;

      const cards = [
        ["Snapshots", DATA.snapshots.length, latest.generated_at || latest.id],
        ["Sites", latest.item_count, latest.source_path],
        ["Avg design", avgDesign, "latest snapshot"],
        ["Avg branding", avgBrand, "latest snapshot"],
        ["Branded", branded, `${partial} partial / ${unbranded} unbranded`],
        ["Shell-like", shell, "from summary"],
      ];

      document.getElementById("heroStats").innerHTML = cards.map(([label, value, sub]) => `
        <div class="stat">
          <div class="label">${label}</div>
          <div class="value">${value}</div>
          <div class="sub">${sub}</div>
        </div>
      `).join("");

      const chipWrap = document.getElementById("snapshotChips");
      chipWrap.innerHTML = DATA.snapshots.slice(-4).map((snap) => `
        <span class="chip">${esc(snap.generated_at || snap.id)} · ${snap.item_count} sites</span>
      `).join("");
    }}

    function renderSelectors() {{
      const snapshotSelect = document.getElementById("snapshotSelect");
      snapshotSelect.innerHTML = DATA.snapshots.map((snap, idx) => `
        <option value="${idx}">${esc(snap.generated_at || snap.id)} · ${snap.item_count} sites</option>
      `).join("");
      snapshotSelect.value = String(state.snapshotIndex);
      snapshotSelect.onchange = () => {{
        state.snapshotIndex = Number(snapshotSelect.value);
        renderAll();
      }};
    }}

    function renderScatterControls() {{
      const el = document.getElementById("scatterControls");
      const makeSelect = (value, key) => `
        <label class="metric-pill" style="display:flex; gap:8px; align-items:center;">
          <strong>${key}</strong>
          <select data-field="${key}">
            ${SCATTER_FIELDS.map((field) => `<option value="${field}" ${value === field ? "selected" : ""}>${METRIC_LABELS[field] || field}</option>`).join("")}
          </select>
        </label>
      `;
      el.innerHTML = makeSelect(state.scatterX, "X") + makeSelect(state.scatterY, "Y") + makeSelect(state.scatterZ, "Z");
      el.querySelectorAll("select[data-field]").forEach((select) => {{
        select.onchange = () => {{
          const field = select.dataset.field;
          state[field === "X" ? "scatterX" : field === "Y" ? "scatterY" : "scatterZ"] = select.value;
          renderScatterChart();
        }};
      }});
    }}

    function renderOverviewChart() {{
      const el = document.getElementById("overviewChart");
      const width = el.clientWidth || 1200;
      const height = 320;
      const padding = 32;
      const series = Object.keys(METRIC_LABELS).map((key) => {{
        const points = DATA.snapshots.map((snap, idx) => {{
          const value = snap.averages[key] || 0;
          return {{ x: idx, y: value }};
        }});
        return {{ key, label: METRIC_LABELS[key], color: METRIC_COLORS[key], points }};
      }});
      const maxY = 10;
      const minY = 0;
      const innerW = width - padding * 2;
      const innerH = height - padding * 2;
      const xFor = (i) => padding + (DATA.snapshots.length <= 1 ? innerW / 2 : (i / (DATA.snapshots.length - 1)) * innerW);
      const yFor = (v) => padding + (1 - (v - minY) / (maxY - minY)) * innerH;

      const gridLines = Array.from({{ length: 6 }}, (_, i) => {{
        const y = padding + (i / 5) * innerH;
        const label = fmt(maxY - (i / 5) * (maxY - minY));
        return `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="rgba(154,173,198,0.14)" stroke-width="1"/><text x="${padding - 10}" y="${y + 4}" fill="#8ea0b7" font-size="11" text-anchor="end">${label}</text>`;
      }}).join("");

      const paths = series.map((entry) => {{
        const d = entry.points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${xFor(p.x)} ${yFor(p.y)}`).join(" ");
        const circles = entry.points.map((p) => `<circle cx="${xFor(p.x)}" cy="${yFor(p.y)}" r="3.5" fill="${entry.color}"/>`).join("");
        return `
          <path d="${d}" fill="none" stroke="${entry.color}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
          ${circles}
        `;
      }}).join("");

      const xLabels = DATA.snapshots.map((snap, idx) => `
        <text x="${xFor(idx)}" y="${height - 8}" fill="#8ea0b7" font-size="11" text-anchor="middle">${esc((snap.generated_at || snap.id).slice(0, 10))}</text>
      `).join("");

      el.innerHTML = `
        <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-label="Snapshot averages chart">
          ${gridLines}
          ${paths}
          ${xLabels}
        </svg>
      `;

      document.getElementById("overviewLegend").innerHTML = series.map((entry) => `
        <span><i class="dot" style="background:${entry.color}"></i>${entry.label}</span>
      `).join("");
    }}

    function renderSnapshotDetail() {{
      const snap = currentSnapshot();
      const summary = snap.summary || {{}};
      const counts = {
        branded: summary.branded_count ?? snap.branding_counts?.branded ?? 0,
        partial: summary.partial_count ?? snap.branding_counts?.partial ?? 0,
        unbranded: summary.unbranded_count ?? snap.branding_counts?.unbranded ?? 0,
      };
      const metrics = Object.entries(snap.averages || {{}}).map(([key, value]) => `
        <span class="metric-pill"><strong>${METRIC_LABELS[key] || key}:</strong> ${fmt(value)}</span>
      `).join("");
      const chips = [
        `<span class="badge good">${esc(snap.generated_at || snap.id)}</span>`,
        `<span class="badge">Items ${snap.item_count}</span>`,
        `<span class="badge">Branded ${counts.branded ?? 0}</span>`,
        `<span class="badge">Partial ${counts.partial ?? 0}</span>`,
        `<span class="badge">Unbranded ${counts.unbranded ?? 0}</span>`,
        `<span class="badge">Shell-like ${summary.shell_like_count ?? 0}</span>`,
      ].join("");

      document.getElementById("snapshotHeatmap").innerHTML = `
        <div class="row">${chips}</div>
        <div style="margin-top:12px" class="mini-grid">${metrics}</div>
        <div style="margin-top:12px" class="grid-3">
          <div><div class="label">Needs branding pass</div><div class="value">${summary.needs_branding_pass_count ?? 0}</div></div>
          <div><div class="label">Needs layout pass</div><div class="value">${summary.needs_layout_pass_count ?? 0}</div></div>
          <div><div class="label">Needs content pass</div><div class="value">${summary.needs_content_pass_count ?? 0}</div></div>
        </div>
      `;
    }}

    function renderStateSpace3D() {{
      const el = document.getElementById("scatterChart");
      const rows = DATA.site_trends || [];
      if (!rows.length || !window.Plotly) {{
        el.innerHTML = `<div class="empty" style="padding:20px">No 3D data available.</div>`;
        return;
      }}
      const xKey = state.scatterX;
      const yKey = state.scatterY;
      const zKey = state.scatterZ;
      const xLabel = METRIC_LABELS[xKey] || xKey;
      const yLabel = METRIC_LABELS[yKey] || yKey;
      const zLabel = METRIC_LABELS[zKey] || zKey;
      const colorVals = rows.map((row) => row.latest_composite);
      const trace = {{
        type: "scatter3d",
        mode: "markers",
        x: rows.map((row) => row[xKey] ?? 0),
        y: rows.map((row) => row[yKey] ?? 0),
        z: rows.map((row) => row[zKey] ?? 0),
        text: rows.map((row) => row.slug),
        hovertemplate: "%{text}<br>" + xLabel + ": %{x:.2f}<br>" + yLabel + ": %{y:.2f}<br>" + zLabel + ": %{z:.2f}<br>Composite: %{marker.color:.2f}<extra></extra>",
        marker: {{
          size: rows.map((row) => 5 + Math.max(0, Math.min(7, row.latest_composite / 1.6))),
          color: colorVals,
          colorscale: "Turbo",
          cmin: 0,
          cmax: 10,
          opacity: 0.92,
          colorbar: {{
            title: "Composite",
          }},
        }},
        line: {{ width: 0 }},
      }};
      const layout = {{
        margin: {{ l: 0, r: 0, t: 0, b: 0 }},
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        scene: {{
          xaxis: {{ title: xLabel, gridcolor: "rgba(255,255,255,0.08)", zerolinecolor: "rgba(255,255,255,0.15)", color: "#cfe1f5" }},
          yaxis: {{ title: yLabel, gridcolor: "rgba(255,255,255,0.08)", zerolinecolor: "rgba(255,255,255,0.15)", color: "#cfe1f5" }},
          zaxis: {{ title: zLabel, gridcolor: "rgba(255,255,255,0.08)", zerolinecolor: "rgba(255,255,255,0.15)", color: "#cfe1f5" }},
          camera: {{ eye: {{ x: 1.45, y: 1.35, z: 0.95 }} }},
          bgcolor: "rgba(0,0,0,0)",
        }},
        showlegend: false,
      }};
      Plotly.react(el, [trace], layout, {{ responsive: true, displayModeBar: true }});
      document.getElementById("scatterLegend").innerHTML = `
        <span><i class="dot" style="background:${scoreColor(9)}"></i>Marker size/color = composite</span>
        <span><i class="dot" style="background:${scoreColor(6)}"></i>X: ${xLabel}</span>
        <span><i class="dot" style="background:${scoreColor(4)}"></i>Y: ${yLabel}</span>
        <span><i class="dot" style="background:${scoreColor(2)}"></i>Z: ${zLabel}</span>
      `;
    }}

    function renderMovers() {{
      const rows = DATA.movers.slice(0, 14);
      document.getElementById("moversTable").innerHTML = `
        <table>
          <thead>
            <tr>
              <th>Slug</th>
              <th>Δ composite</th>
              <th>Δ design</th>
              <th>Δ branding</th>
              <th>Δ clarity</th>
              <th>Δ white-label</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((row) => `
              <tr>
                <td>${esc(row.slug)}</td>
                <td>${row.composite_delta >= 0 ? "+" : ""}${fmt(row.composite_delta)}</td>
                <td>${row.design_delta >= 0 ? "+" : ""}${fmt(row.design_delta)}</td>
                <td>${row.branding_delta >= 0 ? "+" : ""}${fmt(row.branding_delta)}</td>
                <td>${row.clarity_delta >= 0 ? "+" : ""}${fmt(row.clarity_delta)}</td>
                <td>${row.white_label_delta >= 0 ? "+" : ""}${fmt(row.white_label_delta)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    }}

    function render3DTrendRails() {{
      const el = document.getElementById("trailChart");
      const rows = DATA.site_trends || [];
      if (!rows.length || !window.Plotly) {{
        el.innerHTML = `<div class="empty" style="padding:20px">No trend rail data available.</div>`;
        return;
      }}
      const top = [...rows].sort((a, b) => Math.abs(b.composite_delta) - Math.abs(a.composite_delta)).slice(0, state.railCount);
      const traces = [];
      top.forEach((row) => {{
        const series = DATA.slug_series[row.slug] || [];
        if (!series.length) return;
        const ys = series.map((entry) => entry[state.railMetric] ?? 0);
        const xs = series.map((_, idx) => idx);
        const zs = series.map((entry, idx) => idx);
        traces.push({{
          type: "scatter3d",
          mode: "lines+markers",
          name: row.slug,
          x: xs,
          y: ys,
          z: zs,
          line: {{ width: 4, color: scoreColor(row.latest_composite) }},
          marker: {{ size: 3, color: ys, colorscale: "Turbo", cmin: 0, cmax: 10 }},
          hovertemplate: "%{text}<br>Step %{x}<br>Score %{y:.2f}<extra></extra>",
          text: series.map(() => row.slug),
          showlegend: false,
        }});
      }});
      const layout = {{
        margin: {{ l: 0, r: 0, t: 0, b: 0 }},
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        scene: {{
          xaxis: {{ title: "Snapshot step", color: "#cfe1f5" }},
          yaxis: {{ title: METRIC_LABELS[state.railMetric] || state.railMetric, color: "#cfe1f5" }},
          zaxis: {{ title: "Trail depth", color: "#cfe1f5" }},
          camera: {{ eye: {{ x: 1.35, y: 1.2, z: 0.85 }} }},
          bgcolor: "rgba(0,0,0,0)",
        }},
        showlegend: false,
      }};
      Plotly.react(el, traces, layout, {{ responsive: true, displayModeBar: true }});
      document.getElementById("trailLegend").innerHTML = `
        <span><i class="dot" style="background:${scoreColor(9)}"></i>Top ${top.length} movers by ${METRIC_LABELS[state.railMetric] || state.railMetric}</span>
        <span><i class="dot" style="background:${scoreColor(4)}"></i>Drag to rotate</span>
        <span><i class="dot" style="background:${scoreColor(6)}"></i>Scroll to zoom</span>
      `;
    }}

    function renderHeatmap() {{
      const rows = DATA.snapshots.map((snap, idx) => {{
        const values = Object.fromEntries(Object.entries(snap.averages || {{}}));
        return {{ snap, idx, values }};
      }});
      const cols = [...DATA.metrics.map((m) => m.key), "composite_score_10"];
      const head = `
        <div class="heatmap-head" style="grid-template-columns: 220px repeat(${cols.length}, minmax(86px, 1fr));">
          <div></div>
          ${cols.map((key) => `<div>${esc((DATA.metrics.find((m) => m.key === key) || {{ label: "Composite" }}).label || "Composite")}</div>`).join("")}
        </div>
      `;
      const body = rows.map(({ snap, idx, values }) => `
        <div class="heatmap-row" style="grid-template-columns: 220px repeat(${cols.length}, minmax(86px, 1fr));">
          <div class="heatmap-label">${esc(snap.generated_at || snap.id)} · ${snap.item_count}</div>
          ${cols.map((key) => {{
            const score = values[key] || 0;
            return `<div class="heatmap-cell" style="background:${scoreColor(score)}"><strong>${esc(key === "composite_score_10" ? "Composite" : (DATA.metrics.find((m) => m.key === key) || {{ label: key }}).label)}</strong>${fmt(score)}</div>`;
          }}).join("")}
        </div>
      `).join("");
      document.getElementById("snapshotHeatmap").innerHTML = `
        <div class="row" style="margin-bottom:8px">
          <span class="badge good">Score heatmap</span>
          <span class="badge">Numeric only</span>
          <span class="badge">Snapshots ${DATA.snapshots.length}</span>
        </div>
        <div class="heatmap-grid">
          ${head}
          ${body}
        </div>
      `;
    }}

    function renderCorrelationHeatmap() {{
      const fields = Object.keys(METRIC_LABELS).filter((key) => [
        "design_score_10",
        "branding_score_10",
        "clarity_score_10",
        "white_label_fit_10",
        "composite_score_10",
      ].includes(key));
      const matrix = DATA.metric_correlations || {{}};
      const head = `
        <div class="heatmap-head" style="grid-template-columns: 130px repeat(${fields.length}, minmax(76px, 1fr));">
          <div></div>
          ${fields.map((key) => `<div>${METRIC_LABELS[key]}</div>`).join("")}
        </div>
      `;
      const body = fields.map((rowKey) => `
        <div class="heatmap-row" style="grid-template-columns: 130px repeat(${fields.length}, minmax(76px, 1fr));">
          <div class="heatmap-label">${METRIC_LABELS[rowKey]}</div>
          ${fields.map((colKey) => {{
            const value = matrix[rowKey]?.[colKey] ?? 0;
            const hue = value >= 0 ? 140 : 0;
            const light = 18 + Math.min(1, Math.abs(value)) * 18;
            return `<div class="heatmap-cell" style="background:hsl(${hue} 72% ${light}%)"><strong>${value >= 0 ? "+" : ""}${value.toFixed(2)}</strong></div>`;
          }}).join("")}
        </div>
      `).join("");
      const quadrant = DATA.quadrant_counts || {{}};
      document.getElementById("correlationHeatmap").innerHTML = `
        <div class="row" style="margin-bottom:8px">
          <span class="badge good">Metric matrix</span>
          <span class="badge">High/High ${quadrant.high_high ?? 0}</span>
          <span class="badge">High/Low ${quadrant.high_low ?? 0}</span>
          <span class="badge">Low/High ${quadrant.low_high ?? 0}</span>
          <span class="badge">Low/Low ${quadrant.low_low ?? 0}</span>
        </div>
        <div class="heatmap-grid">
          ${head}
          ${body}
        </div>
      `;
      const strongest = [];
      for (const rowKey of fields) {{
        for (const colKey of fields) {{
          if (rowKey >= colKey) continue;
          strongest.push({{
            pair: `${METRIC_LABELS[rowKey]} × ${METRIC_LABELS[colKey]}`,
            value: matrix[rowKey]?.[colKey] ?? 0,
          }});
        }}
      }}
      strongest.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
      const top = strongest.slice(0, 3).map((row) => `${row.pair}: ${row.value >= 0 ? "+" : ""}${row.value.toFixed(2)}`).join(" · ");
      document.getElementById("patternSummary").textContent = top ? `Strongest correlations: ${top}` : "";
    }}

    function renderRankingTable() {{
      const rows = DATA.latest_rankings.slice(0, 20);
      const head = `
        <div class="rank-row rank-head">
          <div>Slug</div>
          <div>Composite</div>
          <div>Design</div>
          <div>Branding</div>
          <div>Clarity</div>
          <div>White-label</div>
        </div>
      `;
      const body = rows.map((row) => `
        <div class="rank-row">
          <div class="rank-cell">${esc(row.slug)}</div>
          <div class="rank-cell score" style="background:${scoreColor(row.composite_score_10)}">${fmt(row.composite_score_10)} <span class="badge ${row.delta >= 0 ? "good" : "bad"}" style="margin-left:6px">${row.delta >= 0 ? "+" : ""}${fmt(row.delta)}</span></div>
          <div class="rank-cell">${fmt(row.design_score_10)}</div>
          <div class="rank-cell">${fmt(row.branding_score_10)}</div>
          <div class="rank-cell">${fmt(row.clarity_score_10)}</div>
          <div class="rank-cell">${fmt(row.white_label_fit_10)}</div>
        </div>
      `).join("");
      document.getElementById("rankingTable").innerHTML = head + body;
    }}

    function renderSnapshotList() {{
      const list = document.getElementById("snapshotList");
      list.innerHTML = DATA.snapshots.map((snap, idx) => {{
        const branded = snap.summary?.branded_count ?? snap.branding_counts?.branded ?? 0;
        const partial = snap.summary?.partial_count ?? snap.branding_counts?.partial ?? 0;
        const unbranded = snap.summary?.unbranded_count ?? snap.branding_counts?.unbranded ?? 0;
        const active = idx === state.snapshotIndex ? "active" : "";
        return `
          <div class="snapshot-item ${active}" data-idx="${idx}">
            <div class="title">
              <span>${esc(snap.generated_at || snap.id)}</span>
              <span>${snap.item_count}</span>
            </div>
            <div class="meta">${esc(snap.source_path)}</div>
            <div class="meta">Branded ${branded} · Partial ${partial} · Unbranded ${unbranded}</div>
          </div>
        `;
      }}).join("");
      list.querySelectorAll(".snapshot-item").forEach((node) => {{
        node.onclick = () => {{
          state.snapshotIndex = Number(node.dataset.idx);
          document.getElementById("snapshotSelect").value = String(state.snapshotIndex);
          renderAll();
        }};
      }});
    }}

    function renderAll() {{
      renderHeroStats();
      renderOverviewChart();
      renderHeatmap();
      renderScatterControls();
      renderCorrelationHeatmap();
      renderStateSpace3D();
      render3DTrendRails();
      renderMovers();
      renderRankingTable();
      renderSnapshotList();
      document.getElementById("snapshotSelect").value = String(state.snapshotIndex);
    }}

    if (!DATA.snapshots.length) {{
      document.body.innerHTML = '<div class="wrap"><div class="panel hero-copy"><h1>No snapshots found</h1><p class="lede">Run <code>./nai analyze-screenshots</code> first so the archive has JSON reports to visualize.</p></div></div>';
    }} else {{
      renderSelectors();
      renderAll();
      window.addEventListener("resize", () => {{
        renderOverviewChart();
        renderStateSpace3D();
        render3DTrendRails();
      }});
    }}
  </script>
</body>
</html>
"""
    return template.replace("{{", "{").replace("}}", "}").replace("__PAYLOAD__", payload_json)


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate an interactive dashboard from archived visual analysis JSON reports.")
    parser.add_argument("--archive-dir", type=Path, default=ARCHIVE_DIR, help="directory holding timestamped report snapshots")
    parser.add_argument("--current-report", type=Path, default=CURRENT_REPORT, help="path to the current visual_analysis_report.json")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help="path to write the HTML dashboard")
    parser.add_argument("--data-output", type=Path, default=DEFAULT_DATA_OUTPUT, help="path to write the compact JSON payload")
    parser.add_argument("--open", action="store_true", help="open the generated dashboard in the default browser")
    args = parser.parse_args()

    paths = collect_snapshot_paths(args.archive_dir, args.current_report)
    if not paths:
        raise SystemExit("No report snapshots found. Run ./nai analyze-screenshots first.")

    snapshots = [load_snapshot(path, args.current_report) for path in paths]
    snapshots.sort(key=lambda snap: parse_isoish(str(snap.get("generated_at") or snap.get("generated_sort") or "")))
    snapshots = [snap for idx, snap in enumerate(snapshots) if idx not in EXCLUDED_SNAPSHOT_INDEXES]
    payload = build_payload(snapshots)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.data_output.parent.mkdir(parents=True, exist_ok=True)
    args.data_output.write_text(json.dumps(payload, ensure_ascii=False, indent=2))
    args.output.write_text(render_html(escape_json_for_html(payload)))

    print(f"Wrote {args.output}")
    print(f"Wrote {args.data_output}")
    print(f"Snapshots loaded: {len(snapshots)}")
    print(f"Sites tracked: {len(payload['slugs'])}")

    if args.open:
        webbrowser.open(args.output.resolve().as_uri())

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
