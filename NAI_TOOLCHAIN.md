# NAI Toolchain

> Canonical source: `NAI_TOOLCHAIN.json`
>
> Use this file to tell which scripts are core to the NAI suite, which are support utilities, and which are legacy/one-off artifacts.

## How To Read This

- `core`: integral to the active NAI workflow or user-facing wrapper.
- `support`: useful utilities, diagnostics, or helpers, but not required for the main workflow.
- `legacy`: one-off, archival, or older scripts that should not be treated as canonical parts of the suite.

## Core

| Path | Type | Role | Notes |
|------|------|------|-------|
| `nai` | python-cli | Primary operator entrypoint for the NAI workflow. | Start here for standard workflow commands. |
| `nai_suite/nai_hub.py` | python-http-wrapper | Lightweight browser wrapper over common NAI CLI commands. | Friendly control room for scan, deploy, screenshots, sitemap validation, and related tasks. |
| `nai_suite/sitemap_data.py` | python-library | Canonical sitemap data layer. | SITEMAP.json is canonical; SITEMAP.md is rendered from it. |
| `nai_suite/siteflow.py` | python-library | Shared build, route, package, and site-resolution helpers. | Important shared plumbing; do not casually remove. |
| `nai_suite/update_vercel.py` | python-script | Regenerates vercel.json from canonical sitemap data and build roots. | Integral to deployment routing. |
| `nai_suite/screenshots_sitemap.py` | python-script | Captures local or live screenshot galleries for the sitemap routes. | Integral to visual verification. |
| `nai_suite/analyze_sitemap_screenshots.py` | python-script | Runs vision analysis over screenshot galleries and writes JSON reports. | Integral to visual QA. |
| `nai_suite/generate_screenshot_progress.py` | python-script | Builds score-oriented progress artifacts from archived screenshot analysis JSON files. | Supportive analytics layer, but part of the official suite. |
| `deploy.sh` | shell-script | Thin shell wrapper for the main deployment path. | Should stay aligned with the guarded `./nai deploy --confirm-production` path. |

## Support

| Path | Type | Role | Notes |
|------|------|------|-------|
| `visual_report_summary.py` | python-script | Quick triage summary over visual analysis output. | Useful helper, but not a hard dependency of the core NAI pipeline. |
| `check_vite_base_paths.py` | python-script | Diagnostics for Vite base path issues. | Useful for blank-page debugging. |
| `fix_all_vite_configs.py` | python-script | Bulk Vite base/path fixer. | Use deliberately; not part of normal day-to-day workflow. |
| `fix_index_html_paths.py` | python-script | Bulk HTML path fixer. | Supportive maintenance utility, not a canonical entrypoint. |
| `nai-deploy-check.py` | python-script | Deployment diagnostic helper. | Helpful for deployment investigation, but not part of the normal workflow. |
| `nai_deployment_diagnostic.py` | python-script | Deployment/environment diagnostic helper. | Helpful, but not canonical. |
| `nai_qa_suite.py` | python-script | Broader QA/audit helper. | Supportive but not on the core happy path. |
| `nai_site_fixer.py` | python-script | General repair helper for site issues. | Treat as maintenance utility. |
| `tier1_verification_assistant.py` | python-script | Verification support tool. | Not part of the standard operator workflow. |

## Legacy

| Path | Type | Role | Notes |
|------|------|------|-------|
| `audit_urls.py` | python-script | Older URL audit helper. | Legacy investigation tool; not part of the main suite. |
| `audit_urls.sh` | shell-script | Older shell wrapper for URL audits. | Legacy. |
| `collect_results.py` | python-script | One-off result collector. | Not in the active NAI workflow. |
| `find_unprocessed.py` | python-script | One-off helper for older processing batches. | Legacy. |
| `full_audit_api.py` | python-script | Older audit pipeline helper. | Legacy. |
| `single_audit.py` | python-script | One-off single-site audit helper. | Legacy. |
| `verify_fixes.py` | python-script | Older fix verification helper. | Legacy. |
| `verify_fixes_v2.py` | python-script | Second-generation older verification helper. | Legacy. |
| `fix_vercel_paths.sh` | shell-script | Older path fix helper. | Legacy. |
| `cycle.sh` | shell-script | One-off local cycle helper. | Legacy/manual. |
| `commit-all-websites.sh` | shell-script | Bulk commit helper. | Potentially risky; not part of the standard workflow. |
| `invest-ashtabula-scaffold.sh` | shell-script | One-off site scaffold helper. | Not part of the ongoing NAI suite. |
| `permit-whisperer-outreach-automation.py` | python-script | One-off outreach automation. | Not part of the core product/deploy toolchain. |
