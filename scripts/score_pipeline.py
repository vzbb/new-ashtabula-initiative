#!/usr/bin/env python3
"""Score all NAI MVPs and generate pipeline_priority.json.

Weights: Revenue 25%, Community 20%, Brand 15%, Design 15%, Simplicity 15%, Urgency 10%.
Design defaults to 5 and is updated by vision assessment — NOT guessed by this script.
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SITEMAP_JSON = ROOT / "SITEMAP.json"


def parse_sitemap(path: Path):
    with path.open() as f:
        data = json.load(f)

    mvps = []
    for route in data.get("routes", []):
        if not isinstance(route, dict):
            continue
        mvps.append(
            {
                "num": int(route.get("index", 0) or 0),
                "site": str(route.get("site", "")).strip(),
                "route": str(route.get("slug", "")).strip(),
                "buyer": str(route.get("target", "")).strip(),
                "desc": str(route.get("description", "")).strip(),
            }
        )

    mvps.sort(key=lambda item: item["num"])
    return mvps


def score_mvp(mvp):
    route = mvp["route"]

    # --- REVENUE (0-10): 25% ---
    high_rev = {"hvac", "roofquote", "fence-quote", "ashtabula-fence", "thomas-fence",
                "dirt-quote", "blueprint", "boxflow", "parts", "parts-request",
                "plating", "plating-pro", "site-ops-pro", "terra-vantage",
                "lawn", "snow-plow", "auto-detail", "truck-wash"}
    med_high_rev = {"scheduler", "scheduler-sms", "insta-book", "charter", "marina",
                    "landlord", "rental", "notary", "adaptive-reuse", "engineers",
                    "cut-custom", "rennick-market", "trumbull-locker", "compassionate",
                    "wedding", "boat-storage", "concierge"}
    med_rev = {"gotl", "sommelier", "sommelier-pro", "mytrip", "mytrip-export",
               "grocer", "curbside", "farm-stand", "harbor", "pet-match",
               "portfolio", "harvest", "ai-docent-pro", "historian", "historian-pro",
               "artist-commission", "volunteer", "parking", "ride-ready", "routes"}
    low_rev = {"civic-insight", "permits", "zoning", "saybrook-zoning",
               "eligibility", "eligibility-lite", "eligibility-pro",
               "license", "event-permit", "govtech", "invest",
               "aidflow", "resource", "resource-pro", "policy-pal",
               "parcelvisor", "sbdc-business-counseling", "sbdc-business-planning",
               "sbdc-educational-resources", "sbdc-learning-modules", "sbdc-support-tools"}

    if route in high_rev: revenue = 9
    elif route in med_high_rev: revenue = 7
    elif route in med_rev: revenue = 5
    elif route in low_rev: revenue = 3
    else: revenue = 4

    # --- COMMUNITY (0-10): 20% ---
    critical = {"permits", "zoning", "saybrook-zoning", "civic-insight",
                "eligibility", "eligibility-lite", "eligibility-pro",
                "license", "event-permit", "govtech", "aidflow",
                "resource", "resource-pro", "engineers", "parcelvisor"}
    high_comm = {"landlord", "rental", "invest", "ride-ready", "routes",
                 "blueprint", "compassionate", "volunteer", "pet-match",
                 "sbdc-business-counseling", "sbdc-business-planning",
                 "sbdc-educational-resources", "sbdc-learning-modules", "sbdc-support-tools"}
    med_comm = {"gotl", "mytrip", "mytrip-export", "farm-stand", "grocer",
                "curbside", "harvest", "harbor", "historian", "historian-pro",
                "ai-docent-pro", "artist-commission", "portfolio", "sommelier",
                "sommelier-pro", "concierge", "parking", "charter", "marina",
                "boat-storage", "wedding", "adaptive-reuse"}

    if route in critical: community = 9
    elif route in high_comm: community = 7
    elif route in med_comm: community = 5
    else: community = 3

    # --- BRAND (0-10): 15% ---
    known_branded = {"hvac", "landlord", "permits", "ashtabula-fence", "thomas-fence",
                     "rennick-market", "trumbull-locker", "compassionate", "roofquote",
                     "terra-vantage", "site-ops-pro", "fence-quote", "lawn", "snow-plow"}
    some_brand = {"gotl", "sommelier", "sommelier-pro", "mytrip", "mytrip-export",
                  "harbor", "marina", "charter", "insta-book", "concierge",
                  "farm-stand", "grocer", "curbside", "harvest", "historian",
                  "historian-pro", "ai-docent-pro", "artist-commission",
                  "pet-match", "volunteer", "wedding", "boat-storage",
                  "auto-detail", "truck-wash", "scheduler", "scheduler-sms",
                  "notary", "adaptive-reuse", "engineers", "dirt-quote",
                  "cut-custom", "portfolio", "parking", "ride-ready", "routes",
                  "blueprint", "boxflow", "parts", "parts-request", "plating", "plating-pro"}
    generic_br = {"civic-insight", "zoning", "saybrook-zoning",
                  "eligibility", "eligibility-lite", "eligibility-pro",
                  "license", "event-permit", "govtech", "invest",
                  "aidflow", "resource", "resource-pro", "policy-pal",
                  "parcelvisor", "sbdc-business-counseling", "sbdc-business-planning",
                  "sbdc-educational-resources", "sbdc-learning-modules", "sbdc-support-tools",
                  "rental"}

    if route in known_branded: brand = 8
    elif route in some_brand: brand = 5
    elif route in generic_br: brand = 3
    else: brand = 4

    # --- DESIGN (0-10): 15% — DEFAULT 5, updated by vision assessment ---
    design = 5

    # --- SIMPLICITY (0-10): 15% ---
    simple = {"ashtabula-fence", "thomas-fence", "rennick-market", "trumbull-locker",
              "cut-custom", "farm-stand", "notary", "parking", "portfolio",
              "wedding", "harbor", "harvest", "pet-match", "volunteer",
              "event-permit", "license", "invest", "govtech"}
    moderate = {"hvac", "roofquote", "fence-quote", "lawn", "snow-plow",
                "dirt-quote", "auto-detail", "truck-wash", "scheduler", "scheduler-sms",
                "insta-book", "charter", "marina", "boat-storage", "concierge",
                "ride-ready", "routes", "grocer", "curbside", "mytrip", "mytrip-export",
                "gotl", "sommelier", "compassionate", "policy-pal",
                "engineers", "adaptive-reuse", "rental", "landlord",
                "sbdc-business-counseling", "sbdc-business-planning",
                "sbdc-educational-resources", "sbdc-learning-modules", "sbdc-support-tools"}
    complex_r = {"civic-insight", "permits", "zoning", "saybrook-zoning",
                 "eligibility", "eligibility-lite", "eligibility-pro",
                 "blueprint", "boxflow", "parts", "parts-request",
                 "plating", "plating-pro", "aidflow", "resource", "resource-pro",
                 "parcelvisor", "site-ops-pro", "terra-vantage",
                 "historian", "historian-pro", "ai-docent-pro", "artist-commission",
                 "sommelier-pro"}

    if route in simple: simplicity = 9
    elif route in moderate: simplicity = 7
    elif route in complex_r: simplicity = 3
    else: simplicity = 5

    # --- URGENCY (0-10): 10% ---
    hi_urg = {"hvac", "permits", "zoning", "saybrook-zoning", "landlord",
              "roofquote", "eligibility", "eligibility-lite", "eligibility-pro"}
    med_urg = {"lawn", "snow-plow", "gotl", "mytrip", "mytrip-export",
               "charter", "marina", "boat-storage", "farm-stand", "harvest",
               "auto-detail", "truck-wash", "ashtabula-fence", "thomas-fence",
               "fence-quote", "dirt-quote", "insta-book", "concierge",
               "wedding", "compassionate", "scheduler", "scheduler-sms",
               "grocer", "curbside", "rennick-market", "trumbull-locker",
               "cut-custom", "volunteer", "pet-match"}

    if route in hi_urg: urgency = 8
    elif route in med_urg: urgency = 5
    else: urgency = 3

    # Composite: Revenue 25%, Community 20%, Brand 15%, Design 15%, Simplicity 15%, Urgency 10%
    composite = round(
        revenue * 0.25 +
        community * 0.20 +
        brand * 0.15 +
        design * 0.15 +
        simplicity * 0.15 +
        urgency * 0.10,
        2
    )

    return {
        **mvp,
        "scores": {
            "revenue": revenue,
            "community": community,
            "brand": brand,
            "design": design,
            "simplicity": simplicity,
            "urgency": urgency,
            "composite": composite
        },
        "state": "unscanned",
        "assessed_at": None,
        "notes": ""
    }


def main():
    mvps = parse_sitemap(SITEMAP_JSON)
    print(f"Parsed {len(mvps)} MVPs from SITEMAP.json")

    scored = [score_mvp(m) for m in mvps]
    scored.sort(key=lambda x: x["scores"]["composite"], reverse=True)

    print("\n=== TOP 25 BY COMPOSITE SCORE ===")
    for i, mvp in enumerate(scored[:25]):
        s = mvp["scores"]
        print(f"{i+1:2d}. [{s['composite']:4.1f}] {mvp['site']:30s} ({mvp['route']:20s}) "
              f"R={s['revenue']} C={s['community']} B={s['brand']} D={s['design']} S={s['simplicity']} U={s['urgency']}")

    print(f"\nScore range: {scored[-1]['scores']['composite']:.1f} – {scored[0]['scores']['composite']:.1f}")

    output = {
        "version": "2.0",
        "generated": datetime.now(timezone.utc).isoformat(),
        "total_mvps": len(scored),
        "scoring_formula": {
            "revenue_weight": 0.25,
            "community_weight": 0.20,
            "brand_weight": 0.15,
            "design_weight": 0.15,
            "simplicity_weight": 0.15,
            "urgency_weight": 0.10
        },
        "mvps": scored
    }

    outpath = "/root/new-ashtabula-initiative/pipeline_priority.json"
    with open(outpath, "w") as f:
        json.dump(output, f, indent=2)

    print(f"\nWrote {len(scored)} MVPs to {outpath}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
