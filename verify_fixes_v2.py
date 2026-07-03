#!/usr/bin/env python3
"""Verify fixes by checking asset accessibility."""
import subprocess
import re
import sys

BROKEN_SITES = [
    ("zoning", "zoning-clerk"),
    ("blueprint", "blueprint-analyzer"),
    ("boxflow", "boxflow-estimator"),
    ("cashflow", "cashflow-tracker"),
    ("plating-pro", "plating-tracker-pro"),
    ("rental", "rental-availability"),
    ("curbside", "curbside-pickup-tracker"),
    ("parts-request", "parts-finder-request"),
    ("scheduler", "service-scheduler"),
    ("notary", "mobile-notary"),
    ("truck-wash", "truck-wash-booking"),
    ("pet-match", "pet-matchmaker"),
]

def check_site(slug, folder):
    """Check if site's JS assets are accessible."""
    url = f"https://new-ashtabula-initiative.vercel.app/{slug}/"
    try:
        # Get the HTML
        result = subprocess.run(
            ["curl", "-s", "--max-time", "10", url],
            capture_output=True,
            text=True
        )
        html = result.stdout
        
        # Extract JS asset path
        match = re.search(r'src="(/' + slug + r'/assets/[^"]+)"', html)
        if not match:
            return {"slug": slug, "status": "❌ NO ASSET PATH", "js_size": 0}
        
        js_path = match.group(1)
        js_url = f"https://new-ashtabula-initiative.vercel.app{js_path}"
        
        # Check JS asset
        js_result = subprocess.run(
            ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code} %{size_download}", "--max-time", "10", js_url],
            capture_output=True,
            text=True
        )
        parts = js_result.stdout.strip().split()
        status_code = int(parts[0])
        js_size = int(parts[1]) if len(parts) > 1 else 0
        
        if status_code == 200 and js_size > 100000:  # JS should be >100KB
            return {"slug": slug, "status": "✅ WORKING", "js_size": js_size}
        else:
            return {"slug": slug, "status": f"⚠️  JS {status_code}", "js_size": js_size}
            
    except Exception as e:
        return {"slug": slug, "status": f"❌ ERROR: {e}", "js_size": 0}

print("=" * 70)
print("VERIFYING PREVIOUSLY BROKEN MVP SITES (Asset Accessibility)")
print("=" * 70)
print()

results = []
for slug, folder in BROKEN_SITES:
    result = check_site(slug, folder)
    results.append(result)
    size_str = f"{result['js_size']:,} bytes" if result['js_size'] > 0 else "N/A"
    print(f"{result['slug']:20} {result['status']:15} JS: {size_str}")

working = sum(1 for r in results if "WORKING" in r['status'])

print()
print("=" * 70)
print(f"SUMMARY: {working}/{len(results)} sites have accessible JS assets")
print("=" * 70)

if working == len(results):
    print("\n🎉 All sites are now LIVE and WORKING!")
    sys.exit(0)
else:
    sys.exit(1)
