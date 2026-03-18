#!/usr/bin/env python3
"""
NAI Pre-Deployment Verification Script
Validates all sites are ready for Vercel deployment
"""

import os
import json
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple

# Configuration
NAI_ROOT = Path("/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative")
VERCEL_JSON = NAI_ROOT / "vercel.json"
LANDING_PAGE = NAI_ROOT / "landing-page" / "index.html"

# Batch 1: Tier 1 Pitch Anchors
BATCH_1_SITES = [
    ("civic-insight-engine", "/civic-insight/", "Civic Insight Engine"),
    ("invest-ashtabula", "/invest/", "Invest Ashtabula"),
    ("permit-whisperer", "/permits/", "Permit Whisperer"),
    ("local-grocer-go", "/grocer/", "Local Grocer Go"),
    ("contractor-match", "/contractors/", "Contractor Match"),
]

# Batch 2: Tier 2 Supporting Cast
BATCH_2_SITES = [
    ("parts-finder", "/parts/", "Parts Finder"),
    ("plating-tracker", "/plating/", "Plating Tracker"),
    ("eligibility-screener", "/eligibility/", "Eligibility Screener"),
    ("harbor-cam-dashboard", "/harbor/", "Harbor Cam Dashboard"),
]

class Colors:
    GREEN = "\033[92m"
    RED = "\033[91m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    RESET = "\033[0m"
    BOLD = "\033[1m"

def print_header(title: str):
    print(f"\n{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BOLD}{title}{Colors.RESET}")
    print(f"{Colors.BLUE}{'='*60}{Colors.RESET}\n")

def print_check(name: str, status: bool, details: str = ""):
    icon = f"{Colors.GREEN}✅{Colors.RESET}" if status else f"{Colors.RED}❌{Colors.RESET}"
    print(f"  {icon} {name}")
    if details:
        print(f"     {Colors.YELLOW}{details}{Colors.RESET}")

def check_landing_page() -> Tuple[bool, str]:
    """Verify landing page exists and has content"""
    if not LANDING_PAGE.exists():
        return False, "Landing page not found"
    
    content = LANDING_PAGE.read_text()
    if len(content) < 100:
        return False, "Landing page content too short"
    
    # Check for key elements
    required = ["<html", "<body", "New Ashtabula", "civic-insight"]
    missing = [r for r in required if r.lower() not in content.lower()]
    
    if missing:
        return False, f"Missing: {', '.join(missing)}"
    
    return True, f"{len(content)} bytes, all key elements present"

def check_vercel_config() -> Tuple[bool, str]:
    """Verify vercel.json is valid and has routes"""
    if not VERCEL_JSON.exists():
        return False, "vercel.json not found"
    
    try:
        config = json.loads(VERCEL_JSON.read_text())
        routes = config.get("routes", [])
        
        if len(routes) < 5:
            return False, f"Only {len(routes)} routes configured"
        
        # Check for Batch 1 routes
        route_paths = [r.get("src", "") for r in routes]
        missing = []
        for _, path, name in BATCH_1_SITES:
            if not any(path in r for r in route_paths):
                missing.append(name)
        
        if missing:
            return False, f"Missing routes: {', '.join(missing)}"
        
        return True, f"{len(routes)} routes configured"
    except json.JSONDecodeError as e:
        return False, f"Invalid JSON: {e}"

def check_site_build(site_dir: str, site_name: str) -> Tuple[bool, str]:
    """Verify a site's dist folder is built and ready"""
    dist_path = NAI_ROOT / "websites" / site_dir / "dist"
    
    if not dist_path.exists():
        return False, "dist/ folder not found"
    
    # Check for index.html
    index_file = dist_path / "index.html"
    if not index_file.exists():
        return False, "index.html not found in dist/"
    
    # Check file size
    size = index_file.stat().st_size
    if size < 100:
        return False, f"index.html too small ({size} bytes)"
    
    # Check for assets folder (optional but recommended)
    assets_path = dist_path / "assets"
    has_assets = assets_path.exists()
    
    return True, f"✓ ({size} bytes{', assets/' if has_assets else ''})"

def check_batch(sites: List[Tuple[str, str, str]], batch_name: str) -> Dict:
    """Check all sites in a batch"""
    print(f"\n{Colors.BOLD}{batch_name}{Colors.RESET}")
    
    results = {
        "total": len(sites),
        "ready": 0,
        "failed": [],
        "details": []
    }
    
    for site_dir, path, name in sites:
        status, details = check_site_build(site_dir, name)
        print_check(name, status, details)
        
        if status:
            results["ready"] += 1
        else:
            results["failed"].append(name)
        
        results["details"].append({
            "name": name,
            "path": path,
            "ready": status,
            "details": details
        })
    
    return results

def generate_report(batch1: Dict, batch2: Dict) -> str:
    """Generate markdown deployment readiness report"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    total_ready = batch1["ready"] + batch2["ready"]
    total_sites = batch1["total"] + batch2["total"]
    
    report = f"""# NAI Deployment Readiness Report

**Generated:** {timestamp}
**Status:** {"🚀 READY FOR DEPLOYMENT" if total_ready == total_sites else "⚠️ ISSUES FOUND"}

## Summary

| Metric | Count |
|--------|-------|
| Total Sites Checked | {total_sites} |
| Ready for Deploy | {total_ready} |
| Blocked | {total_sites - total_ready} |

## Batch 1: Tier 1 Pitch Anchors

| Site | Status | Details |
|------|--------|---------|
"""
    
    for detail in batch1["details"]:
        status = "✅ Ready" if detail["ready"] else "❌ Blocked"
        report += f"| {detail['name']} | {status} | {detail['details']} |\n"
    
    report += f"\n**Batch 1 Status:** {batch1['ready']}/{batch1['total']} ready\n"
    
    report += """\n## Batch 2: Tier 2 Supporting Cast

| Site | Status | Details |
|------|--------|---------|
"""
    
    for detail in batch2["details"]:
        status = "✅ Ready" if detail["ready"] else "❌ Blocked"
        report += f"| {detail['name']} | {status} | {detail['details']} |\n"
    
    report += f"\n**Batch 2 Status:** {batch2['ready']}/{batch2['total']} ready\n"
    
    if batch1["failed"] or batch2["failed"]:
        report += "\n## Blocked Sites\n\n"
        for site in batch1["failed"] + batch2["failed"]:
            report += f"- {site}\n"
    
    report += f"""
## Deployment Command

```bash
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative
vercel --prod
```

## Post-Deploy Verification

After deployment, verify these URLs:

| Site | URL |
|------|-----|
"""
    for site_dir, path, name in BATCH_1_SITES + BATCH_2_SITES:
        report += f"| {name} | https://newashtabula.vercel.app{path} |\n"
    
    report += "\n---\n*Generated by nai-deploy-check.py*\n"
    
    return report

def main():
    print_header("NAI PRE-DEPLOYMENT VERIFICATION")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"NAI Root: {NAI_ROOT}")
    
    # Check infrastructure
    print(f"\n{Colors.BOLD}Infrastructure Checks{Colors.RESET}")
    
    landing_ok, landing_details = check_landing_page()
    print_check("Landing Page", landing_ok, landing_details)
    
    vercel_ok, vercel_details = check_vercel_config()
    print_check("Vercel Config", vercel_ok, vercel_details)
    
    # Check site builds
    batch1_results = check_batch(BATCH_1_SITES, "Batch 1: Tier 1 Pitch Anchors")
    batch2_results = check_batch(BATCH_2_SITES, "Batch 2: Tier 2 Supporting Cast")
    
    # Summary
    total_ready = batch1_results["ready"] + batch2_results["ready"]
    total_sites = batch1_results["total"] + batch2_results["total"]
    
    print_header("DEPLOYMENT SUMMARY")
    print(f"  Total Sites: {total_sites}")
    print(f"  Ready: {Colors.GREEN}{total_ready}{Colors.RESET}")
    print(f"  Blocked: {Colors.RED}{total_sites - total_ready}{Colors.RESET}")
    
    if landing_ok and vercel_ok and total_ready == total_sites:
        print(f"\n{Colors.GREEN}{Colors.BOLD}🚀 ALL SYSTEMS GO — READY FOR DEPLOYMENT{Colors.RESET}")
        print(f"\nRun: cd {NAI_ROOT} && vercel --prod")
    else:
        print(f"\n{Colors.RED}{Colors.BOLD}⚠️ DEPLOYMENT BLOCKED — FIX ISSUES ABOVE{Colors.RESET}")
        return 1
    
    # Generate report
    report = generate_report(batch1_results, batch2_results)
    report_path = NAI_ROOT / "DEPLOY_READINESS_REPORT.md"
    report_path.write_text(report)
    print(f"\n{Colors.BLUE}Report saved: {report_path}{Colors.RESET}")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
