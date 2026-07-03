# Mem0 Memory Protocol

This repo uses Mem0 as a durable coordination layer, but the repo files remain
the canonical source of truth.

The point of memory is to help the coordinator and docs roles remember durable
project decisions across restarts, not to replace the repo.

## Identity

Use a stable project-scoped user id:

`user_id = "new-ashtabula-initiative"`

Use stable role-scoped agent ids for memory writes and reads:

- `codex-coordinator`
- `codex-docs`
- `codex-research`
- `codex-brandkit`
- `codex-assets`
- `codex-implementation`
- `codex-verification`

## What to Store

Store only durable, decision-grade facts such as:

- canonical MVP -> target mappings
- primary vs secondary / clone candidates
- brand decisions that have already been settled
- current sprint phase
- last verified live state
- open ambiguities that need later resolution
- “do not re-decide” items that should not be reopened casually

## What Not to Store

Do not use memory for:

- raw brainstorming
- large transcripts
- temporary debugging chatter
- generated files that already live in the repo
- anything that should clearly be encoded in `SITEMAP.md`, research JSON,
  brandkits, or docs instead

## Write Policy

When a coordinator or docs worker writes memory:

1. Include `user_id="new-ashtabula-initiative"`.
2. Include a stable `agent_id` for the role.
3. Add metadata for the relevant slug(s) when possible.
4. Keep entries short, structured, and decision-oriented.
5. Mirror important durable decisions back into repo docs.

## Read Policy

Before re-deciding a target, a worker should:

1. Check the repo truth in `SITEMAP.md` and the research/brandkit files.
2. Check memory for the latest durable decision if the repo files are unclear.
3. Prefer the repo files if memory and repo disagree, then reconcile the drift.

## Role Access

- Coordinator: full read/write access
- Docs: read/write access for durable summaries of doc changes
- Research / brandkit / assets / implementation / verification: read-only unless
  the coordinator explicitly requests a short summary entry

## Restart Rule

If the shell or Codex session restarts, the next coordinator should:

1. Read this file.
2. Read `SESSION_HANDBOOK.md`.
3. Read `ARTIFACT_PIPELINE.md`.
4. Query Mem0 using the stable project `user_id`.
5. Reconstruct the current sprint state from repo + memory together.

## Coordinator Memory Examples

Good entries:

- `I am codex-coordinator for the New Ashtabula Initiative swarm. Current canonical docs: SESSION_HANDBOOK.md, ARTIFACT_PIPELINE.md, SWARM_KICKOFF.md, SITEMAP.md.`
- `Current sprint phase: target-map reconciliation and branding alignment.`
- `Model policy: root session and bulk workers use gpt-5-mini; coordinator uses gpt-5-mini at high reasoning; verification and docs use gpt-5-mini at medium reasoning.`
- `site-ops-pro -> Brobst Earthworks, LTD; Wilkinson is a later white-label candidate.`
- `terra-vantage -> Severino Construction; Simak and Mark Haynes are later clone candidates.`
- `fence-quote -> Miller's Integrity; Ashtabula Fence and Thomas Fence are separate MVPs, not clone candidates here.`

Bad entries:

- “working on branding stuff”
- “some fence lead maybe”
- “revisit later”

## Docs Role Memory Use

The docs worker should use Mem0 for short, durable summaries of repo-documented
changes, especially when a sprint updates the canonical workflow.

Good docs memories:

- `README.md now points to ARTIFACT_PIPELINE.md and SWARM_KICKOFF.md as the canonical workflow docs.`
- `SWARM_KICKOFF.md now defines the worker role split and the no-recursive-worker rule.`
- `MEMORY_PROTOCOL.md now stores the stable user_id and agent_id conventions.`

The docs worker should not dump full markdown content into memory. It should
store just enough state to help a restarted coordinator know what changed and
where the canonical doc lives.
