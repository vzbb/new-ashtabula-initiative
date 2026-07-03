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

`SITEMAP.md` -> `lead_research_json/<slug>.json` -> `email_prospects/<slug>_emails.json` -> `brandkits/<slug>.json` -> `branding_research/<slug>/branding.md` -> `branding_research/assets/*` -> `websites/<site-name>/` -> `build/deploy` -> `sitemap_screenshots/` -> `visual_analysis_report.json`

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
- `SITEMAP.md` target-map rows
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
- verify the current public state
- check that the rendered page matches the target and brandkit
- report mismatches back to the coordinator
- stay headless unless a visible browser pass is explicitly requested

### 7. Docs Sync Worker
Scope:
- `README.md`
- `SESSION_HANDBOOK.md`
- `ARTIFACT_PIPELINE.md`
- `.gemini/GEMINI.md`
- `MONOREPO_PROTOCOL.md`

Responsibilities:
- only update docs when the workflow itself changes
- keep the canonical chain readable
- keep the docs concise and non-contradictory

## Recommended Sprint Order

1. Target / research reconciliation
2. Outreach / prospect cleanup
3. Brandkit refresh
4. Asset procurement and manifest updates
5. Site implementation
6. Build and deploy
7. Screenshot verification
8. Analysis reconciliation

This order should be followed unless the task is explicitly a pure implementation fix or a pure docs fix.

## Codex Runtime Shape

The project-level Codex config now lives in [`.codex/config.toml`](.codex/config.toml).

Current swarm settings:
- `agents.max_threads = 16`
- `agents.max_depth = 1`
- role-specific instruction layers are stored in `.codex/agents/*.toml`
- the project defaults to `gpt-5.4` for the root session and coordinator
- the bulk workers use `gpt-5.4-mini` with medium reasoning
- verification and docs use `gpt-5.4` with medium reasoning
- there is no fast-mode instruction in the project config; the goal is quality
  and consistency, not lowest-token shortcuts

That means the root coordinator can spawn specialists, but specialists do not
recurse. The swarm is intentionally coordinator-led and one layer deep.

Use that power sparingly:
- keep scopes small
- keep write sets disjoint
- avoid spawning extra workers just because the config allows it
- favor one coordinator and a few high-leverage specialists over a noisy swarm
- keep worker roles non-recursive even though the config technically supports
  deeper trees elsewhere

## Memory Layer

Mem0 is configured as the durable memory backend for the coordinator/docs path.
See [MEMORY_PROTOCOL.md](MEMORY_PROTOCOL.md) for the stable user/agent IDs and
the exact write/read rules.

The important operational rule is simple:
- repo files remain canonical
- Mem0 stores durable decisions and restart-state
- workers should not replace repo truth with freeform memory
- only the coordinator and docs roles should write to Mem0; other workers are
  read-only unless the coordinator explicitly asks for a short summary

## What A Worker Should Read First

Before editing anything, a worker should read:
- `README.md`
- `SESSION_HANDBOOK.md`
- `ARTIFACT_PIPELINE.md`
- `.gemini/GEMINI.md`
- `RESEARCH_STACK.md` if the task touches internet research or asset discovery
- `SITEMAP.md`
- the task-specific research/brandkit files

## Handoff Format

Every worker should end with:
- files changed
- what was verified
- what remains open
- any dependency it discovered

Keep handoffs short and explicit.

## Current Best Default

For the current phase, the best default is:
- use Codex workers for the file-scoped execution work
- keep the Gemini instruction layer as policy guidance only
- let the repo files carry the real operational truth
- let the coordinator traverse the full chain; let workers stay in their lane
