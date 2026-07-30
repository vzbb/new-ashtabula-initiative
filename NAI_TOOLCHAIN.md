# NAI Toolchain Registry

> Generated from `NAI_TOOLCHAIN.json` by `./nai tooling`. Do not edit by hand.

Use `core` tools for routine work, `support` tools only for a diagnosed need,
and `legacy` tools only when an assignment explicitly names them.

## Core

| Path | Purpose |
| --- | --- |
| `nai` | Primary route-aware operator CLI |
| `nai_suite/pipeline.py` | Canonical assignments, gates, context packets, and recovery |
| `nai_suite/sitemap_data.py` | Canonical SITEMAP.json validation and rendering |
| `nai_suite/siteflow.py` | Slug-to-source mapping, focused builds, and build-root detection |
| `nai_suite/screenshots_sitemap.py` | Local-preview and live-production browser capture |
| `nai_suite/analyze_sitemap_screenshots.py` | Visual and branding analysis over captured screenshots |
| `nai_suite/update_vercel.py` | Vercel route generation from canonical sitemap data |
| `nai_suite/generate_all_mvps_page.py` | Landing-page portfolio inventory generation |
| `nai_suite/openrouter_proxy_function.js` | Server-side OpenRouter API proxy packaged by the deploy path |
| `deploy.sh` | Thin wrapper around the guarded production deploy path |

## Support

| Path | Purpose |
| --- | --- |
| `visual_report_summary.py` | Summarize current visual-analysis results |
| `check_vite_base_paths.py` | Diagnose route-relative Vite asset paths |
| `fix_all_vite_configs.py` | Bulk Vite base repair for an explicitly approved batch |
| `fix_index_html_paths.py` | Repair diagnosed generated HTML path problems |
| `nai-deploy-check.py` | Inspect deploy readiness |
| `nai_deployment_diagnostic.py` | Diagnose deployment and environment failures |
| `nai_qa_suite.py` | Broader repository QA helper |
| `nai_site_fixer.py` | General site repair helper for scoped use |
| `tier1_verification_assistant.py` | Support evidence-driven verification passes |

## Legacy

| Path | Purpose |
| --- | --- |
| `audit_urls.py` | Older URL audit script |
| `audit_urls.sh` | Older URL audit wrapper |
| `collect_results.py` | Historical result collector |
| `find_unprocessed.py` | Historical batch discovery helper |
| `full_audit_api.py` | Superseded audit pipeline |
| `single_audit.py` | Superseded single-site audit helper |
| `verify_fixes.py` | Older fix verification pass |
| `verify_fixes_v2.py` | Second-generation older fix verifier |
| `fix_vercel_paths.sh` | Older Vercel path repair helper |
| `cycle.sh` | Historical local workflow loop |
| `commit-all-websites.sh` | Unsafe bulk commit helper; never use routinely |

See `NAI_AGENT_GUIDE.md` for commands, examples, artifacts, and safety rules.
