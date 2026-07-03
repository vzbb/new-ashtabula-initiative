from __future__ import annotations

import csv
import json
import re
from collections import Counter
from pathlib import Path

from nai_suite.sitemap_data import load_public_routes

ROOT = Path(__file__).resolve().parent.parent
REPORT_PATH = ROOT / "sitemap_screenshots" / "visual_analysis_report.json"
MD_OUTPUT = ROOT / "OUTREACH_READINESS_REPORT.md"
JSON_OUTPUT = ROOT / "OUTREACH_READINESS_REPORT.json"
CSV_OUTPUT = ROOT / "OUTREACH_READINESS_REPORT.csv"
BRANDKITS_DIR = ROOT / "brandkits"
RESEARCH_DIR = ROOT / "lead_research_json"
EMAILS_DIR = ROOT / "email_prospects"


def _norm(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9]+", " ", value)
    value = re.sub(r"\s+", " ", value).strip()
    return value


def _targets_align(canonical: str, observed: str) -> bool:
    a = _norm(canonical)
    b = _norm(observed)
    if not a or not b:
        return False
    return a == b or a in b or b in a


def _read_visual_items() -> dict[str, dict]:
    data = json.loads(REPORT_PATH.read_text())
    items = data.get("items", [])
    return {
        str(item.get("slug", "")).strip(): item
        for item in items
        if isinstance(item, dict) and str(item.get("slug", "")).strip()
    }


def _bucket(row: dict[str, object]) -> str:
    overall = str(row["overall_status"])
    branded = str(row["branding_status"])
    design = int(row["design_score"])
    branding = int(row["branding_score"])
    clarity = int(row["clarity_score"])
    work_remaining = int(row["branding_work_remaining"])
    artifacts = int(row["artifact_score"])
    aligned = bool(row["target_alignment"])

    if (
        overall == "excellent"
        and branded == "branded"
        and design >= 8
        and branding >= 8
        and clarity >= 8
        and work_remaining <= 2
        and artifacts >= 2
        and aligned
    ):
        return "ready_to_pitch"

    if (
        overall in {"excellent", "good"}
        and branded in {"branded", "partial"}
        and design >= 7
        and branding >= 7
        and clarity >= 7
        and work_remaining <= 4
        and artifacts >= 1
    ):
        return "promising"

    if overall == "broken":
        return "not_ready"

    return "needs_polish"


def _priority_score(row: dict[str, object]) -> float:
    base = float(row["design_score"]) + float(row["branding_score"]) + float(row["clarity_score"])
    base += float(row["artifact_score"]) * 1.5
    base -= float(row["branding_work_remaining"]) * 1.25
    if row["target_alignment"]:
        base += 2
    if row["overall_status"] == "excellent":
        base += 1
    return round(base, 2)


def build_rows() -> list[dict[str, object]]:
    visual_by_slug = _read_visual_items()
    rows: list[dict[str, object]] = []
    for route in load_public_routes():
        slug = str(route.get("slug", "")).strip()
        if not slug or slug not in visual_by_slug:
            continue
        item = visual_by_slug[slug]
        overall = item.get("overall_assessment", {}) if isinstance(item.get("overall_assessment"), dict) else {}
        branding = item.get("branding_analysis", {}) if isinstance(item.get("branding_analysis"), dict) else {}

        canonical_target = str(route.get("target", "")).strip()
        observed_target = str(branding.get("target_brand_entity", "")).strip()
        has_brandkit = (BRANDKITS_DIR / f"{slug}.json").exists()
        has_research = (RESEARCH_DIR / f"{slug}.json").exists()
        has_emails = (EMAILS_DIR / f"{slug}_emails.json").exists()
        artifact_score = sum([has_brandkit, has_research, has_emails])

        row: dict[str, object] = {
            "slug": slug,
            "site": str(route.get("site", "")).strip(),
            "route": str(route.get("url", "")).strip(),
            "category": str(route.get("category", "")).strip(),
            "canonical_target": canonical_target,
            "observed_target": observed_target,
            "target_alignment": _targets_align(canonical_target, observed_target),
            "overall_status": str(overall.get("status", "unknown")).strip(),
            "branding_status": str(branding.get("branding_status", "unknown")).strip(),
            "design_score": int(overall.get("design_score_10", 0) or 0),
            "branding_score": int(overall.get("branding_score_10", 0) or 0),
            "clarity_score": int(overall.get("clarity_score_10", 0) or 0),
            "white_label_fit": int(overall.get("white_label_fit_10", 0) or 0),
            "branding_work_remaining": int(branding.get("branding_work_remaining_10", 10) or 10),
            "branding_refinement_score": int(branding.get("branding_refinement_score_10", 0) or 0),
            "has_brandkit": has_brandkit,
            "has_research": has_research,
            "has_emails": has_emails,
            "artifact_score": artifact_score,
        }
        row["bucket"] = _bucket(row)
        row["priority_score"] = _priority_score(row)
        rows.append(row)

    bucket_rank = {"ready_to_pitch": 0, "promising": 1, "needs_polish": 2, "not_ready": 3}
    rows.sort(key=lambda r: (bucket_rank[str(r["bucket"])], -float(r["priority_score"]), str(r["slug"])))
    return rows


def _render_table(rows: list[dict[str, object]]) -> list[str]:
    lines = [
        "| MVP | Target Lead | Bucket | Scores | Artifacts |",
        "|-----|-------------|--------|--------|-----------|",
    ]
    for row in rows:
        scores = f"D{row['design_score']}/B{row['branding_score']}/C{row['clarity_score']}"
        artifacts = "".join([
            "R" if row["has_research"] else "-",
            "B" if row["has_brandkit"] else "-",
            "E" if row["has_emails"] else "-",
        ])
        lines.append(
            f"| `{row['slug']}` | {row['canonical_target']} | `{row['bucket']}` | {scores} | `{artifacts}` |"
        )
    lines.append("")
    return lines


def write_outputs() -> tuple[Path, Path, Path]:
    rows = build_rows()
    counts = Counter(str(row["bucket"]) for row in rows)

    md_lines = [
        "# Outreach Readiness Report",
        "",
        "This report is generated from the live canonical route map, the latest visual QA report, and artifact coverage in `lead_research_json/`, `brandkits/`, and `email_prospects/`.",
        "",
        "Buckets:",
        "- `ready_to_pitch`: strong live presentation, strong branding, and enough artifact coverage to aim specialized outreach now",
        "- `promising`: materially improved and targeted, but still more likely to need positioning or polish support before outreach",
        "- `needs_polish`: useful work exists, but it is not the best place to send specialized outreach first",
        "- `not_ready`: broken or too incomplete for outreach-led focus",
        "",
        "Artifact legend:",
        "- `R` = lead research JSON exists",
        "- `B` = brandkit JSON exists",
        "- `E` = email prospects file exists",
        "",
        "## Summary",
        "",
        f"- Live MVPs evaluated: `{len(rows)}`",
        f"- Ready to pitch: `{counts['ready_to_pitch']}`",
        f"- Promising: `{counts['promising']}`",
        f"- Needs polish: `{counts['needs_polish']}`",
        f"- Not ready: `{counts['not_ready']}`",
        "",
    ]

    for bucket, title in [
        ("ready_to_pitch", "Ready To Pitch"),
        ("promising", "Promising"),
        ("needs_polish", "Needs Polish"),
        ("not_ready", "Not Ready"),
    ]:
        subset = [row for row in rows if row["bucket"] == bucket]
        md_lines.append(f"## {title}")
        md_lines.append("")
        if subset:
            md_lines.extend(_render_table(subset))
        else:
            md_lines.append("_None currently._")
            md_lines.append("")

    MD_OUTPUT.write_text("\n".join(md_lines))
    JSON_OUTPUT.write_text(json.dumps({"generated_from": str(REPORT_PATH.name), "rows": rows}, indent=2) + "\n")

    with CSV_OUTPUT.open("w", newline="") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=[
                "slug",
                "site",
                "route",
                "category",
                "canonical_target",
                "observed_target",
                "target_alignment",
                "bucket",
                "overall_status",
                "branding_status",
                "design_score",
                "branding_score",
                "clarity_score",
                "white_label_fit",
                "branding_work_remaining",
                "branding_refinement_score",
                "has_research",
                "has_brandkit",
                "has_emails",
                "artifact_score",
                "priority_score",
            ],
        )
        writer.writeheader()
        writer.writerows(rows)

    return MD_OUTPUT, JSON_OUTPUT, CSV_OUTPUT


def main() -> int:
    md, js, csv_path = write_outputs()
    print(f"Wrote {md.relative_to(ROOT)}")
    print(f"Wrote {js.relative_to(ROOT)}")
    print(f"Wrote {csv_path.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
