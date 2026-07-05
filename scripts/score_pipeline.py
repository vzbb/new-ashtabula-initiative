#!/usr/bin/env python3
"""Score all 76 NAI MVPs and generate pipeline_priority.json."""

import json
import re
import sys

def parse_sitemap(path):
    with open(path) as f:
        content = f.read()

    pattern = r'\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|([^|]+)\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|'
    matches = re.findall(pattern, content)

    mvps = []
    for m in matches:
        num, site_name, route_cell, buyer, desc = m
        route_match = re.search(r'\[/([^/\]]+)/?\]', route_cell)
        if not route_match:
            route_match = re.search(r'/([a-zA-Z0-9_-]+)/?', route_cell)
        route = route_match.group(1) if route_match else route_cell.strip().strip('/')
        site_name = site_name.strip()
        buyer = buyer.strip()
        desc = desc.strip()

        mvps.append({
            "num": int(num),
            "site": site_name,
            "route": route,
            "buyer": buyer,
            "desc": desc
        })

    return mvps


def score_mvp(mvp):
    route = mvp["route"]

    # --- REVENUE (0-10) ---
    high_rev = {"hvac", "roofquote", "fence-quote", "ashtabula-fence", "thomas-fence",
                "dirt-quote", "blueprint", "boxflow", "parts", "parts-request",
                "plating", "plating-pro", "site-ops-pro", "terra-vantage",
                "lawn", "snow-plow", "auto-detail", "truck-wash"}
    med_high_rev = {"scheduler", "scheduler-sms", "insta-book", "charter", "marina",
                    "landlord", "rental", "notary", "adaptive-reuse", "engineers",
                    "cut-custom", "rennick-market", "trumbull-locker", "compassionate",
                    "wedding", "boat-storage", "concierge",
                    "historian", "historian-pro", "ai-docent-pro"}
    med_rev = {"gotl", "sommelier", "sommelier-pro", "mytrip", "mytrip-export",
               "grocer", "curbside", "farm-stand", "harbor", "pet-match",
               "portfolio", "harvest",
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

    # --- COMMUNITY (0-10) ---
    critical = {"permits", "zoning", "saybrook-zoning", "civic-insight",
                "eligibility", "eligibility-lite", "eligibility-pro",
                "license", "event-permit", "govtech", "aidflow",
                "resource", "resource-pro", "engineers", "parcelvisor",
                "historian", "historian-pro", "ai-docent-pro"}
    high_comm = {"landlord", "rental", "invest", "ride-ready", "routes",
                 "blueprint", "compassionate", "volunteer", "pet-match",
                 "sbdc-business-counseling", "sbdc-business-planning",
                 "sbdc-educational-resources", "sbdc-learning-modules", "sbdc-support-tools"}
    med_comm = {"gotl", "mytrip", "mytrip-export", "farm-stand", "grocer",
                "curbside", "harvest", "harbor",
                "artist-commission", "portfolio", "sommelier",
                "sommelier-pro", "concierge", "parking", "charter", "marina",
                "boat-storage", "wedding", "adaptive-reuse"}

    if route in critical: community = 9
    elif route in high_comm: community = 7
    elif route in med_comm: community = 5
    else: community = 3

    # --- BRAND (0-10) ---
    known_branded = {"hvac", "landlord", "permits", "ashtabula-fence", "thomas-fence",
                     "rennick-market", "trumbull-locker", "cut-custom", "compassionate", "roofquote",
                     "terra-vantage", "site-ops-pro", "fence-quote", "lawn", "snow-plow"}
    some_brand = {"gotl", "sommelier", "sommelier-pro", "mytrip", "mytrip-export",
                  "harbor", "marina", "charter", "insta-book", "concierge",
                  "farm-stand", "grocer", "curbside", "harvest", "historian",
                  "historian-pro", "ai-docent-pro", "artist-commission",
                  "pet-match", "volunteer", "wedding", "boat-storage",
                  "auto-detail", "truck-wash", "scheduler", "scheduler-sms",
                  "notary", "adaptive-reuse", "engineers", "dirt-quote",
                  "portfolio", "parking", "ride-ready", "routes",
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

    # --- SIMPLICITY (0-10) ---
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

    # --- URGENCY (0-10) ---
    hi_urg = {"hvac", "permits", "zoning", "saybrook-zoning", "landlord",
              "roofquote", "eligibility", "eligibility-lite", "eligibility-pro",
              "dirt-quote", "site-ops-pro", "terra-vantage",
              "rennick-market", "trumbull-locker", "cut-custom",
              "historian", "historian-pro", "ai-docent-pro"}
    med_urg = {"lawn", "snow-plow", "gotl", "mytrip", "mytrip-export",
               "charter", "marina", "boat-storage", "farm-stand", "harvest",
               "auto-detail", "truck-wash", "ashtabula-fence", "thomas-fence",
               "fence-quote", "insta-book", "concierge",
               "wedding", "compassionate", "scheduler", "scheduler-sms",
               "grocer", "curbside", "volunteer", "pet-match"}

    if route in hi_urg: urgency = 8
    elif route in med_urg: urgency = 5
    else: urgency = 3

    # --- DESIGN (0-10): visual quality — evaluated by vision cron, not guessed ---
    # Default 5 = unknown until visually assessed. Cron updates this.
    design = 5

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
    mvps = parse_sitemap("/root/new-ashtabula-initiative/SITEMAP.md")
    print(f"Parsed {len(mvps)} MVPs from SITEMAP.md")

    scored = [score_mvp(m) for m in mvps]
    scored.sort(key=lambda x: x["scores"]["composite"], reverse=True)

    print("\n=== TOP 25 BY COMPOSITE SCORE ===")
    for i, mvp in enumerate(scored[:25]):
        s = mvp["scores"]
        print(f"{i+1:2d}. [{s['composite']:4.1f}] {mvp['site']:30s} ({mvp['route']:20s}) "
              f"R={s['revenue']} C={s['community']} B={s['brand']} D={s['design']} S={s['simplicity']} U={s['urgency']}")

    print(f"\nScore range: {scored[-1]['scores']['composite']:.1f} – {scored[0]['scores']['composite']:.1f}")

    output = {
        "version": "1.0",
        "generated": "2026-07-04",
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
