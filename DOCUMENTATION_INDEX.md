# NAI Documentation Index

This is the context allowlist for routine NAI work. If a Markdown file is not
listed here or explicitly named by an assignment packet, treat it as historical
context and do not load it by default.

## Canonical active documents

| Document | Purpose |
| --- | --- |
| `README.md` | Fast repository and command orientation |
| `WORKFLOW.md` | Pipeline gates, sequencing, recovery, build, and deploy workflow |
| `NAI_AGENT_GUIDE.md` | Agent command reference, examples, screenshot semantics, and failure interpretation |
| `HARRIET_NAI_OPERATIONS_BRIEF.md` | Optional Harriet/Hermes deployment guide for the portable orchestration protocol |
| `TO_CLAUDE.md` | Claude Code operating manual for immediate pipeline orchestration, worker delegation, shared APIs, and n8n access |
| `CLAUDE.md` | Always-loaded Claude Code orchestrator contract distilled from `TO_CLAUDE.md` |
| `.claude/ORCHESTRATION_LAYER.md` | Claude Code harness wiring: session skill, gate subagents, `/nai-*` commands, and permission ruleset |
| `.agents/skills/nai-mvp-orchestrator/SKILL.md` | Harness-agnostic orchestration and state-authority contract |
| `.agents/skills/nai-mvp-worker/SKILL.md` | Portable bounded worker contract with gate-specific references |
| `SITEMAP.json` | Canonical public route data |
| `SITEMAP.md` | Generated human-readable route reference |
| `NAI_STATE.json` | Canonical operational state |
| `CHIEF_OF_STAFF.md` | Generated portfolio dashboard for the active orchestrator |
| `NAI_TOOLCHAIN.json` / `NAI_TOOLCHAIN.md` | Tool classification when present |
| `SHARED_OPENROUTER_API.md` | Shared text, vision, image-generation, and speech endpoint contract |
| `n8n/*.md` named by an assignment | Shared-service endpoint and workflow contracts; not loaded portfolio-wide by default |
| `lead_research_json/<slug>.json` | Completed, cited buyer research keyed by canonical route slug; missing means unfinished |

## Gate coordination logs

| Gate scope | Log |
| --- | --- |
| Research, brandkit, creative/design | `coordination-creative.md` |
| Implementation/development | `coordination-dev.md` |
| Verification/analysis/QA | `coordination-pm.md` |
| Pitch/sales/marketing preparation | `coordination-sales.md` |

Gate logs are evidence and handoff surfaces, not canonical pipeline state.
Contradictory historical claims never advance a gate automatically.

## Quarantined by default

- `archive/**`
- generated screenshot, assessment, batch-report, and pitch history
- unindexed Markdown under individual MVP directories
- `coordination.md` and `coordination2.md`

These files remain preserved and may be explicitly attached as evidence. This
pass does not mass-move or delete historical documentation.
