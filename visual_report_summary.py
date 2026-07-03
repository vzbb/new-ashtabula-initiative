#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path
from collections import Counter
from typing import Any


DEFAULT_REPORT = Path("sitemap_screenshots/visual_analysis_report.json")


def load_report(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text())


def get_items(report: dict[str, Any]) -> list[dict[str, Any]]:
    items = report.get("items", [])
    return [item for item in items if isinstance(item, dict)]


def overall(item: dict[str, Any]) -> dict[str, Any]:
    return item.get("overall_assessment", {}) if isinstance(item.get("overall_assessment", {}), dict) else {}


def layout(item: dict[str, Any]) -> dict[str, Any]:
    return item.get("layout_analysis", {}) if isinstance(item.get("layout_analysis", {}), dict) else {}


def brand(item: dict[str, Any]) -> dict[str, Any]:
    return item.get("branding_analysis", {}) if isinstance(item.get("branding_analysis", {}), dict) else {}


def branding_status(item: dict[str, Any]) -> str:
    br = brand(item)
    status = str(br.get("branding_status") or "").strip()
    if status:
        return status
    presence = str(br.get("brand_presence") or "").strip()
    if presence == "strong":
        return "branded"
    if presence in {"weak", "almost_none"}:
        return "unbranded"
    return "partial"


def target_entity(item: dict[str, Any]) -> str:
    br = brand(item)
    entity = str(br.get("target_brand_entity") or "").strip()
    return entity


def target_status(item: dict[str, Any]) -> str:
    br = brand(item)
    target_status_value = str(br.get("target_brand_status") or "").strip()
    status = branding_status(item)
    entity = target_entity(item)
    if target_status_value == "specific" and entity:
        return "clear_cut"
    if target_status_value == "needs_research" or bool(br.get("research_needed")):
        return "needs_target_definition"
    return "needs_buyer_mapping"


def target_reason(item: dict[str, Any]) -> str:
    br = brand(item)
    target_status_value = str(br.get("target_brand_status") or "").strip()
    status = branding_status(item)
    entity = target_entity(item)
    if target_status_value == "specific" and entity:
        return f"Target buyer is explicitly named as {entity}."
    if bool(br.get("research_needed")) or target_status_value == "needs_research" or status == "unbranded":
        prompt = str(br.get("research_prompt") or "").strip()
        return prompt or "Buyer identity is not yet clearly expressed, so target research is needed."
    if status == "partial":
        return "The product has some branding signals, but the buyer/entity is not fully explicit yet."
    return "The product looks viable, but the buyer positioning is not yet explicit."


def orchestration(item: dict[str, Any]) -> dict[str, Any]:
    return item.get("orchestration_notes", {}) if isinstance(item.get("orchestration_notes", {}), dict) else {}


def first_issue(item: dict[str, Any]) -> str:
    issues = item.get("issues", [])
    if isinstance(issues, list) and issues:
        issue = issues[0] if isinstance(issues[0], dict) else {}
        return str(issue.get("issue", ""))
    return ""


def first_fix(item: dict[str, Any]) -> str:
    fixes = item.get("quick_fixes", [])
    if isinstance(fixes, list) and fixes:
        fix = fixes[0] if isinstance(fixes[0], dict) else {}
        return str(fix.get("action", ""))
    return ""


def row(item: dict[str, Any]) -> tuple:
    oa = overall(item)
    br = brand(item)
    return (
        oa.get("design_score_10", 0),
        oa.get("branding_score_10", 0),
        item.get("slug", ""),
        oa.get("status", ""),
        br.get("brand_presence", ""),
        oa.get("white_label_fit_10", 0),
    )


def target_row(item: dict[str, Any]) -> tuple:
    oa = overall(item)
    return (
        target_status(item),
        branding_status(item),
        -oa.get("design_score_10", 0),
        -oa.get("branding_score_10", 0),
        item.get("slug", ""),
    )


def print_section(title: str, items: list[dict[str, Any]], limit: int) -> None:
    print(f"\n## {title} ({len(items)})")
    for item in items[:limit]:
        oa = overall(item)
        br = brand(item)
        lay = layout(item)
        orch = orchestration(item)
        print(
            f"- {item.get('slug',''):<28} "
            f"design={oa.get('design_score_10','?')} "
            f"brand={oa.get('branding_score_10','?')} "
            f"clarity={oa.get('clarity_score_10','?')} "
            f"wl={oa.get('white_label_fit_10','?')} "
            f"presence={br.get('brand_presence','?')} "
            f"center={lay.get('center_alignment','?')} "
            f"status={oa.get('status','?')}"
        )
        if first_issue(item):
            print(f"  issue: {first_issue(item)}")
        if first_fix(item):
            print(f"  fix:   {first_fix(item)}")
        if orch.get("needs_branding_pass") or orch.get("needs_layout_pass") or orch.get("needs_content_pass"):
            print(
                f"  passes: branding={orch.get('needs_branding_pass')} "
                f"layout={orch.get('needs_layout_pass')} content={orch.get('needs_content_pass')}"
            )


def print_target_section(items: list[dict[str, Any]], limit: int) -> None:
    print(f"\n## Target / buyer mapping ({len(items)})")
    for item in items[:limit]:
        oa = overall(item)
        br = brand(item)
        print(
            f"- {item.get('slug',''):<28} "
            f"target={target_status(item)} "
            f"branding={branding_status(item)} "
            f"buyer={target_entity(item) or 'unassigned'} "
            f"design={oa.get('design_score_10','?')} "
            f"brand={br.get('brand_presence','?')} "
            f"status={oa.get('status','?')}"
        )
        print(f"  note: {target_reason(item)}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Quickly triage the visual analysis JSON report.")
    parser.add_argument("report", nargs="?", default=str(DEFAULT_REPORT), help="path to visual_analysis_report.json")
    parser.add_argument("--limit", type=int, default=12, help="how many rows to show per section")
    parser.add_argument("--design-below", type=float, default=5.0, help="design score threshold for the hard-fix bucket")
    parser.add_argument(
        "--bucket",
        choices=["hard_fix", "polish", "branded_ready", "generic_or_underbranded"],
        default=None,
        help="optional bucket to export or print as the primary focus",
    )
    parser.add_argument(
        "--emit-slugs-file",
        type=Path,
        default=None,
        help="write the chosen bucket's slugs to a newline-delimited file",
    )
    parser.add_argument(
        "--brand",
        nargs="*",
        default=["weak", "almost_none"],
        help="brand_presence values to treat as generic / underbranded",
    )
    parser.add_argument("--json", action="store_true", help="emit the bucketed results as JSON instead of text")
    args = parser.parse_args()

    report = load_report(Path(args.report))
    items = get_items(report)

    hard_fix = sorted((item for item in items if overall(item).get("design_score_10", 0) < args.design_below), key=row)
    polish = sorted(
        (item for item in items if args.design_below <= overall(item).get("design_score_10", 0) < 7),
        key=row,
    )
    branded = sorted(
        (
            item
            for item in items
            if branding_status(item) == "branded" and overall(item).get("design_score_10", 0) >= 7
        ),
        key=lambda item: (-overall(item).get("design_score_10", 0), -overall(item).get("branding_score_10", 0), item.get("slug", "")),
    )
    generic = sorted((item for item in items if branding_status(item) in {"partial", "unbranded"}), key=row)
    target_clear = sorted((item for item in items if target_status(item) == "clear_cut"), key=lambda item: (item.get("slug", "")))
    target_needs = sorted((item for item in items if target_status(item) != "clear_cut"), key=target_row)
    research_needed = sorted((item for item in items if bool(brand(item).get("research_needed"))), key=target_row)
    buckets = {
        "hard_fix": hard_fix,
        "polish": polish,
        "branded_ready": branded,
        "generic_or_underbranded": generic,
    }

    if args.emit_slugs_file is not None:
        chosen = buckets[args.bucket] if args.bucket else hard_fix
        args.emit_slugs_file.write_text("\n".join(item.get("slug", "") for item in chosen if item.get("slug")))

    summary = report.get("summary", {})
    print(f"Report: {args.report}")
    print(f"Sites: {len(items)}")
    print(f"Design avg: {round(sum(overall(item).get('design_score_10', 0) for item in items) / max(len(items), 1), 2)}")
    print(f"Brand avg: {round(sum(overall(item).get('branding_score_10', 0) for item in items) / max(len(items), 1), 2)}")
    print(f"Hard-fix (<{args.design_below}): {len(hard_fix)}")
    print(f"Polish (5-6): {len(polish)}")
    print(f"Branded-ready: {len(branded)}")
    print(f"Generic/underbranded: {len(generic)}")
    print(f"Branding branded: {sum(1 for item in items if branding_status(item) == 'branded')}")
    print(f"Branding partial: {sum(1 for item in items if branding_status(item) == 'partial')}")
    print(f"Branding unbranded: {sum(1 for item in items if branding_status(item) == 'unbranded')}")
    print(f"Target clear-cut: {len(target_clear)}")
    print(f"Target mapping needed: {len(target_needs)}")
    print(f"Research needed: {len(research_needed)}")
    if summary:
        print(f"Shell-like: {summary.get('shell_like_count', 0)}")
        print(f"Needs branding pass: {summary.get('needs_branding_pass_count', 0)}")
        print(f"Needs layout pass: {summary.get('needs_layout_pass_count', 0)}")
        print(f"Needs content pass: {summary.get('needs_content_pass_count', 0)}")
        print(f"Research needed (summary): {summary.get('research_needed_count', 0)}")

    if args.json:
        payload = {
            "report": str(args.report),
            "counts": {
                "sites": len(items),
                "hard_fix": len(hard_fix),
                "polish": len(polish),
                "branded_ready": len(branded),
                "generic_or_underbranded": len(generic),
                "branding_branded": sum(1 for item in items if branding_status(item) == "branded"),
                "branding_partial": sum(1 for item in items if branding_status(item) == "partial"),
                "branding_unbranded": sum(1 for item in items if branding_status(item) == "unbranded"),
            },
            "hard_fix": [item.get("slug") for item in hard_fix],
            "polish": [item.get("slug") for item in polish],
            "branded_ready": [item.get("slug") for item in branded],
            "generic_or_underbranded": [item.get("slug") for item in generic],
            "target_clear_cut": [item.get("slug") for item in target_clear],
            "target_mapping_needed": [item.get("slug") for item in target_needs],
            "research_needed": [item.get("slug") for item in research_needed],
            "branding_status_counts": dict(Counter(branding_status(item) for item in items).most_common()),
            "target_labels": {item.get("slug"): target_entity(item) for item in items if target_entity(item)},
            "target_status_counts": dict(Counter(target_status(item) for item in items).most_common()),
        }
        print(json.dumps(payload, indent=2))
        return 0

    if args.bucket:
        title_map = {
            "hard_fix": f"Hard fix bucket (design < {args.design_below})",
            "polish": "Polish bucket (design 5-6)",
            "branded_ready": "Branded-ready bucket",
            "generic_or_underbranded": "Generic / underbranded bucket",
        }
        print_section(title_map[args.bucket], buckets[args.bucket], args.limit)
    else:
        print_section(f"Hard fix bucket (design < {args.design_below})", hard_fix, args.limit)
        print_section("Polish bucket (design 5-6)", polish, args.limit)
        print_section("Branded-ready bucket", branded, args.limit)
        print_section("Generic / underbranded bucket", generic, args.limit)
        print_target_section(target_needs, args.limit)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
