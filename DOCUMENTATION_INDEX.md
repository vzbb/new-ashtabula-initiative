# NAI Documentation Index

This index separates the current operating surface from restored project sediment. Prefer the active canon below. Treat unlinked reports, one-off coordination notes, and old route-count documents as archival unless a current canon document points to them.

## Active Canon

| Document | Status | Purpose |
|----------|--------|---------|
| [README.md](README.md) | Active | Project overview, quick start, and top-level navigation |
| [AGENTS.md](AGENTS.md) | Active | Agent-specific repo rules and safe write boundaries |
| [OPERATOR_RUNBOOK.md](OPERATOR_RUNBOOK.md) | Active | Safe local checks, route-change flow, screenshot flow, and production deploy gate |
| [SESSION_HANDBOOK.md](SESSION_HANDBOOK.md) | Active | Current project truth, high-priority targets, and restart context |
| [MONOREPO_PROTOCOL.md](MONOREPO_PROTOCOL.md) | Active | Short workflow rules for one-MVP changes |
| [WORKFLOW.md](WORKFLOW.md) | Active | Recovery summary and standard `./nai` workflow |
| [ARTIFACT_PIPELINE.md](ARTIFACT_PIPELINE.md) | Active | Canonical artifact chain from route data through visual QA |
| [SWARM_KICKOFF.md](SWARM_KICKOFF.md) | Active | Parallel worker roles and coordination model |
| [MEMORY_PROTOCOL.md](MEMORY_PROTOCOL.md) | Active | Durable memory rules for this repo |
| [REPO_GOVERNANCE_AND_DECOMMISSION_PLAN.md](REPO_GOVERNANCE_AND_DECOMMISSION_PLAN.md) | Active | Retirement, cleanup, and governance process |

## Canonical Data And Tooling

| Path | Status | Purpose |
|------|--------|---------|
| [SITEMAP.json](SITEMAP.json) | Canonical data | Machine-readable route source of truth for tooling and deployment |
| [SITEMAP.md](SITEMAP.md) | Rendered reference | Human-readable sitemap rendered from `SITEMAP.json` |
| [NAI_TOOLCHAIN.json](NAI_TOOLCHAIN.json) | Canonical data | Tooling registry for core/support/legacy scripts |
| [NAI_TOOLCHAIN.md](NAI_TOOLCHAIN.md) | Rendered reference | Human-readable tooling registry |
| [nai](nai) | Active tool | Main workflow entrypoint |
| [siteflow.py](siteflow.py) | Active helper | Shared site/build/routing behavior |

## Sales And Buyer Work

| Document | Status | Purpose |
|----------|--------|---------|
| [SALES_OUTREACH_BIBLE.md](SALES_OUTREACH_BIBLE.md) | Active reference | Sales templates, pricing, scripts, and objection handling |
| [LEAD_RESEARCH_REPORT.md](LEAD_RESEARCH_REPORT.md) | Reference | Broad buyer research; verify against per-slug JSON before implementation |
| [SITE_PROSPECT_MAPPING.md](SITE_PROSPECT_MAPPING.md) | Reference | Site-to-prospect mapping and personalization notes |
| [THE_CLOSER_IRRESISTIBLE_OFFERS.md](THE_CLOSER_IRRESISTIBLE_OFFERS.md) | Reference | Offer framing and sales psychology |

## Candidate Operating Docs To Promote Or Archive

These files look operationally meaningful but are not part of the current README/AGENTS transitive doc graph. Decide deliberately before treating them as canon.

| Document | Current Signal | Suggested Action |
|----------|----------------|------------------|
| [CLONE_PROGRAM_PROTOCOL.md](CLONE_PROGRAM_PROTOCOL.md) | Detailed white-label / clone workflow; matches active `./nai clone-mvp` tooling | Promote if clone expansion is active |
| `CHIEF_OF_STAFF.md` | Untracked, active-looking coordination framework | Promote only if this becomes the real coordinator board |
| `PITCH_READY_WORKFLOW.md` | Untracked, active-looking five-gate pitch checklist | Promote if sales readiness is active |
| `coordination-dev.md`, `coordination-pm.md`, `coordination-sales.md` | Untracked role handoff files | Keep only if the Chief of Staff coordination model is adopted |

## Stale Or Archival Signals

Files below contain old route counts, retired routes, ClickUp-era workflow assumptions, or one-off reports. Use them as historical evidence only.

| File / Pattern | Why It Is Not Canonical |
|----------------|-------------------------|
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | Says 77 sites live; current canonical sitemap has 75 routes |
| [PORTFOLIO.md](PORTFOLIO.md) | Says 77 websites; stale portfolio snapshot |
| [PITCH_SITES.md](PITCH_SITES.md) | References retired `/wine/` route and 77-site status |
| [SITEMAP_BUYER_MAP.md](SITEMAP_BUYER_MAP.md) | Snapshot with old 82-row / 77-core assumptions |
| [SITEMAP_NORMALIZATION_TODO.md](SITEMAP_NORMALIZATION_TODO.md) | Old normalization task for a pre-current route model |
| [PHASE1_SPRINT_STATUS.md](PHASE1_SPRINT_STATUS.md) | Older sprint note; verify before using |
| [LAST_MILE_FIXES.md](LAST_MILE_FIXES.md) | March repair log; useful history, not current queue truth |
| `NAI_QA_REPORT_*.json/csv` | Historical QA output |
| `URL_AUDIT_REPORT_*.json/csv` | Historical URL audit output |
| `NAI_FIX_REPORT_*.json/csv` | Historical fix output |
| `coordination.md`, `coordination2.md` | Older coordination notes with ClickUp-era assumptions |
| `GIT_REPO_SETUP_PENDING.md`, `GITHUB_*` | Old setup/status notes |

## Current Rule Of Thumb

If a root artifact is not referenced by the active canon and is not canonical data, assume it is stale until proven otherwise. If a stale document contains useful process, promote the surviving procedure into an active canon doc instead of making agents rediscover it from old notes.
