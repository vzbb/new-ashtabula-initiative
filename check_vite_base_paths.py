#!/usr/bin/env python3
"""
Check that all vite.config.js base paths are compatible with route-prefixed deploys.

Valid values are either:
- "./" for relative assets
- "/<slug>/" for route-scoped absolute assets
"""
from __future__ import annotations

import sys
from pathlib import Path

from nai_suite.siteflow import (
    check_vite_base_matches_route,
    load_public_slugs,
    site_dir_for_slug,
    site_name_for_slug,
)

ROOT = Path(__file__).resolve().parent

def check_all_sites():
    slugs = load_public_slugs()
    mismatches = []
    
    for slug in slugs:
        site_dir = site_dir_for_slug(slug)
        if not site_dir.exists():
            continue

        base_ok, current_base, expected_base = check_vite_base_matches_route(slug, site_dir)
        if not base_ok:
            mismatches.append({
                "slug": slug,
                "folder": site_name_for_slug(slug),
                "current_base": current_base,
                "expected_base": expected_base
            })
    
    if mismatches:
        print("❌ VITE BASE PATH MISMATCHES FOUND:")
        print("=" * 70)
        for m in mismatches:
            print(f"\nSite: {m['slug']} (folder: {m['folder']})")
            print(f"  Current base:  {m['current_base']}")
            print(f"  Should be:     {m['expected_base']}")
            print(f"  Fix: Use './' or '{m['expected_base'].split(' or ')[-1]}' in vite.config.*")
        print(f"\nTotal mismatches: {len(mismatches)}")
        return 1
    else:
        print("✅ All vite.config.js base paths are compatible with their deploy routes!")
        return 0

if __name__ == "__main__":
    sys.exit(check_all_sites())
