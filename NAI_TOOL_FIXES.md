# NAI Tool Suite Fixes - Blank Page Prevention

## Problem Identified

The blank page issues were caused by **mismatched vite.config.js base paths**:
- Sites built with `base: '/folder-name/'` but served at `/route-name/`
- Assets (JS/CSS) requested at wrong URLs → 404 errors → blank pages

## Root Cause

1. **Folder naming vs route naming**: Sites like `zoning-clerk` folder mapped to `/zoning/` route
2. **vite.config.js base property**: Was set to folder name (`/zoning-clerk/`) instead of route (`/zoning/`)
3. **vercel.json routing**: Served site at `/zoning/` but assets referenced `/zoning-clerk/assets/`

## Tool Suite Improvements

### 1. Added `check_vite_base_matches_route()` to `siteflow.py`

```python
def check_vite_base_matches_route(slug: str, site_dir: Path) -> tuple[bool, str, str]:
    """
    Check if vite.config.js base matches the expected route.
    Returns: (is_valid, current_base, expected_base)
    """
```

### 2. Enhanced `./nai scan` Command

Now detects and reports base path mismatches:

```bash
$ ./nai scan

eligibility -> eligibility-screener (exists) ⚠️  base mismatch: ./ should be /eligibility/
  packages: .
  build: dist
  dist: yes
  api-client shim: ok

======================================================================
⚠️  WARNING: 49 site(s) have vite.config.js base path mismatches!
This causes blank pages because assets are requested from wrong URLs.

Run './nai fix-bases' to automatically fix all mismatches.
```

### 3. New `./nai fix-bases` Command

Automatically fixes all vite.config.js base paths:

```bash
$ ./nai fix-bases

✅ Fixed blueprint: /blueprint-analyzer/ → /blueprint/
✅ Fixed boxflow: /boxflow-estimator/ → /boxflow/
✅ Fixed cashflow: /cashflow-tracker/ → /cashflow/
...
✅ Fixed 49 vite.config.js base path(s)

Next steps:
  1. Run './nai build' to rebuild all sites
  2. Run './nai deploy --confirm-production' to deploy to production
```

## Sites Fixed

### Urgent Priority (ClickUp)
- ✅ BoxFlow Estimator - base: `/boxflow/`
- ✅ CashFlow Tracker - base: `/cashflow/`  
- ✅ Blueprint Analyzer - base: `/blueprint/`
- ✅ Zoning Clerk - base: `/zoning/`

### High Priority
- ✅ Plating Tracker Pro - base: `/plating-pro/`
- ✅ Rental Availability - base: `/rental/`
- ✅ Curbside Pickup - base: `/curbside/`
- ✅ Snow Plow Tracker - base: `/snow-plow/`

### Base Path Corrections (49 total)
All sites now have vite.config.js base paths matching their vercel.json routes.

## Prevention

The `./nai scan` command now exits with code 1 if mismatches are detected, making it easy to catch issues in CI/CD:

```bash
./nai scan || echo "Base path mismatches found!"
```

## Workflow Recommendations

1. **After creating a new site**: Run `./nai scan` to verify base paths
2. **Before deployment**: Run `./nai scan` to catch issues early
3. **When fixing blank pages**: 
   ```bash
   ./nai scan          # Check for mismatches
   ./nai fix-bases     # Fix any issues
   ./nai build         # Rebuild all sites
   ./nai deploy --confirm-production        # Deploy to production
   ```
