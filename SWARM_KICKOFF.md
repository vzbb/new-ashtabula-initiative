# Codex Swarm Kickoff

This document defines how to run a structured Codex worker swarm on the New Ashtabula Initiative repo.

The point is not to make more chat output.
The point is to make safe, parallel, file-scoped progress on MVPs without fragmenting the workflow.

## Why This Exists

The repo already has:
- a canonical target map
- research JSON
- email prospect files
- brandkit JSON
- a brand asset layer
- a live build / deploy flow
- screenshot verification

That means the next bottleneck is execution quality, not missing process.

Codex workers should operate on top of the existing pipeline instead of rediscovering it.

## Operating Principles

1. One worker, one clear scope.
2. Write sets should not overlap.
3. The canonical docs are the source of truth, not chat history.
4. Keep slugs stable unless routing is broken.
5. Do not auto-clone unless the task explicitly asks for clone work.
6. Prefer the smallest source change that resolves the actual problem.
7. Reuse existing research, brandkits, and assets before inventing new ones.

## Canonical Artifact Chain

Use this exact order:

`SITEMAP.json` -> rendered `SITEMAP.md` -> `lead_research_json/<slug>.json` -> `email_prospects/<slug>_emails.json` -> `brandkits/<slug>.json` -> `branding_research/<slug>/branding.md` -> `branding_research/assets/*` -> `websites/<site-name>/` -> `build/deploy` -> `sitemap_screenshots/` -> `visual_analysis_report.json`

If a step is missing or stale, fix the stale artifact in the chain rather than skipping it.

Important: this chain is the coordinator's dependency model for the repo.
It is not a requirement that every worker traverse every step for every task.
Most workers should operate on a thin slice of the chain with settled upstream
artifacts treated as inputs.

## Search Policy

- Native Codex/OpenAI web search is the default search path for workers.
- Local SearXNG is the augmentation layer when a second search pass is useful.
- Local Crawl4AI is the deep extraction layer for full-page content, JS-heavy pages, screenshots, and structured capture.

## Worker Roles

General worker rule:
- read only the smallest upstream slice needed for your task
- do not re-open settled upstream decisions unless the coordinator assigns that
  explicitly or the inputs are clearly missing/stale/contradictory

### 1. Target / Research Worker
Scope:
- `lead_research_json/<slug>.json`
- `SITEMAP.json` and rendered `SITEMAP.md` target-map rows
- `SITE_PROSPECT_MAPPING.md` when needed

Responsibilities:
- confirm the primary target
- confirm which entities are clone / white-label candidates
- remove overlaps where a candidate already owns its own MVP
- keep reasoning short and explicit

### 2. Outreach / Prospect Worker
Scope:
- `email_prospects/<slug>_emails.json`
- related prospect exports if needed

Responsibilities:
- keep contact data clean
- keep outreach notes aligned with the canonical target
- prefer real verified contacts
- do not invent emails or phone numbers

### 3. Brandkit Worker
Scope:
- `brandkits/<slug>.json`

Responsibilities:
- translate target research into visual direction
- keep primary target first
- keep secondary / clone candidates clearly secondary
- keep the brandkit aligned with the current canonical target map

### 4. Asset Worker
Scope:
- `branding_research/<slug>/branding.md`
- `branding_research/assets/*`
- `branding_research/manifest.json`

Responsibilities:
- gather logos, favicons, wordmarks, and notes
- store assets in the repo-local asset directory
- keep the manifest in sync
- make the asset layer immediately usable by implementation workers
- stay headless unless a visible browser pass is explicitly requested

### 5. Implementation Worker
Scope:
- `websites/<site-name>/`

Responsibilities:
- implement the brand in the site
- keep the slug unchanged
- fix layout, copy, metadata, and asset paths
- avoid touching the global docs unless the issue is shared

### 6. Verification Worker
Scope:
- live build output
- `sitemap_screenshots/`
- `visual_analysis_report.json`

Responsibilities:
- verify the current public st