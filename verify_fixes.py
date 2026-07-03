#!/usr/bin/env python3
"""Quick verification that previously broken sites are now working."""
import subprocess
import sys
from pathlib import Path

# Sites that were previously broken
BROKEN_SITES = [
    "zoning",           # zoning-clerk
    "blueprint",        # blueprint-analyzer  
    "boxflow",          # boxflow-estimator
    "cashflow",         # cashflow-tracker
    "plating-pro",      # plating-tracker-pro
    "rental",           # rental-availability
    "curbside",         # curbside-pickup-tracker
    "parts-request",    # parts-finder-request
    "scheduler",        # service-scheduler
    "notary",           # mobile-notary
    "truck-wash",       # truck-wash-booking
    "pet-match",        # pet-matchmaker
]

def check_live_site(slug):
    """Check if a live site returns content."""
    url = f"https://new-ashtabula-initiative.vercel.app/{slug}/"
    try:
        result = subprocess.run(
            ["curl", "-s", "--max-time", "10", url],
            capture_output=True,
            text=True
        )
        content = result.stdout
        # Check for signs of a working site
        has_html = "<html" in content.lower()
        has_body = "<body" in content.lower()
        has_script = "<script" in content.lower()
        not_blank = len(content) > 1000  # Blank pages are usually tiny
        
        return {
            "slug": slug,
            "url": url,
            "status": "✅ WORKING" if (has_html and has_body and has_script and not_blank) else "❌ STILL BLANK",
            "size": len(content),
            "has_script": has_script
        }
    except Exception as e:
        return {"slug": slug, "status": f"❌ ERROR: {e}", "size": 0}

print("=" * 70)
print("VERIFYING PREVIOUSLY BROKEN MVP SITES")
print("=" * 70)
print()

results = []
for slug in BROKEN_SITES:
    result = check_live_site(slug)
    results.append(result)
    print(f"{result['slug']:20} {result['status']:15} ({result['size']:,} bytes)")

working = sum(1 for r in results if "WORKING" in r['status'])
blank = sum(1 for r in results if "BLANK" in r['status'])

print()
print("=" * 70)
print(f"SUMMARY: {working} working, {blank} still blank out of {len(results)} sites")
print("=" * 70)

sys.exit(0 if blank == 0 else 1)
