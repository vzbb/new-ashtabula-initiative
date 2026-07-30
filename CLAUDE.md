# CLAUDE.md — New Ashtabula Initiative

You are the **orchestrator** of the NAI pipeline. `./nai` is the only supported
control surface. `TO_CLAUDE.md` is the full operating manual; this file is the
always-loaded contract distilled from it.

Full detail lives in:
[TO_CLAUDE.md](TO_CLAUDE.md) ·
[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) ·
[WORKFLOW.md](WORKFLOW.md) ·
[NAI_AGENT_GUIDE.md](NAI_AGENT_GUIDE.md) ·
[orchestrator skill](.agents/skills/nai-mvp-orchestrator/SKILL.md) ·
[worker skill](.agents/skills/nai-mvp-worker/SKILL.md) ·
[SHARED_OPENROUTER_API.md](SHARED_OPENROUTER_API.md)

## Non-negotiables

1. **Never hand-edit generated or canonical state.** `NAI_STATE.json`,
   `CHIEF_OF_STAFF.md`, `SITEMAP.md`, `NAI_TOOLCHAIN.md`, `vercel.json` are
   written by tools only. Use `./nai pipeline ...` for state; edit
   `SITEMAP.json` then run `./nai sitemap-validate && ./nai sitemap-render-md &&
   ./nai routes` for approved route changes.
2. **Preserve the dirty working tree.** This checkout is routinely very dirty and
   holds untracked canonical work (including `TO_CLAUDE.md` and
   `.agents/skills/`). Never run a broad `git checkout`, `git reset --hard`,
   `git clean`, `git add -A`, bare `git stash`, blanket formatter, or
   generated-file cleanup. Never delete or move existing files to "tidy up."
   Additive changes only unless the user asks otherwise.
3. **Stop at Pitch.** The Hermes team owns the Pitch gate. Report that
   verification made Pitch eligible; never assign a Pitch worker, write or
   rewrite outreach, advance/fail/reset Pitch, or contact a prospect.
   Eligibility is not authorization.
4. **Deployment is user-authorized only.** `./nai deploy --confirm-production`
   requires an explicit instruction for that deploy. Workers never deploy.
5. **Evidence, not claims.** "Done", a green build, an old report, or a working
   screenshot never passes a gate. Inspect the patch and the evidence yourself.
6. **No second control system.** Do not build a scheduler, state DB, kanban, or
   orchestration framework. `pipeline_priority.json`, coordination logs, chat
   messages, and old reports are advisory or historical.

## Canonical truths

| Question | Source |
| --- | --- |
| Public routes → source/build mapping | `SITEMAP.json` (`./nai scan` resolves real dirs) |
| Gate, assignment, blocker, evidence, attempt | `NAI_STATE.json` |
| Readable dashboard | `CHIEF_OF_STAFF.md` (generated) |
| Supported tools | `NAI_TOOLCHAIN.json` → `NAI_TOOLCHAIN.md` |
| Shared AI backend contract | `SHARED_OPENROUTER_API.md` |

A public slug is not necessarily a directory name (`scheduler-sms` →
`websites/service-scheduler-sms`). Resolve with `./nai scan` or the packet.

## Session bootstrap

Run the `nai-orchestration-session` skill, or at minimum:

```bash
git status --short
./nai pipeline validate
./nai pipeline status
./nai scan
./nai tooling
```

Trust current output over any number written in a document.

## Gates

```text
site:    research -> brandkit -> implementation -> verification -> [pitch: Hermes]
landing: inventory -> design -> implementation -> verification -> release
```

One gate per asset at a time. Parallelize **independent assets only** — never two
write-heavy workers on one MVP, never implementation and verification on the same
changing build.

## The loop

```bash
# 1. select (never infer a gate from request wording or a worker's name)
./nai pipeline status

# 2. create one durable assignment
./nai pipeline assign --asset <slug> --gate <current-eligible-gate> \
  --objective "<specific durable objective>" \
  --deliverable "<required artifact>" [--shared-read <path>]

# 3. regenerate the packet any time
./nai pipeline context --assignment <id>

# 4. delegate: paste the packet to one subagent (see below)
# 5. review the patch + evidence, then choose exactly one transition
./nai pipeline pass --assignment <id> --evidence <path>
./nai pipeline fail --assignment <id> --reason "<precise failure>" --evidence <path>
./nai pipeline retry|reassign|block|unblock|reset|quarantine ...

# 6. confirm
./nai pipeline validate && ./nai pipeline status
```

The **packet is the work order** — not conversation history. Smallest recovery
wins: `fail` < `retry` < `reassign` < `block` < `reset` < `quarantine`.

## Delegation

Use the gate-specific subagents in `.claude/agents/`
(`nai-research-worker`, `nai-brandkit-worker`, `nai-implementation-worker`,
`nai-verification-worker`), plus `nai-diagnostician` (read-only triage) and
`nai-shared-maintenance` (orchestrator-owned shared scope). Each wraps the
canonical `nai-mvp-worker` contract. Prompt shape:

```text
Use the nai-mvp-worker skill to complete this single NAI assignment.
Follow the context packet exactly: one asset, one gate, one attempt. Do not
inspect other sites, modify canonical state, alter shared infrastructure outside
the allowlist, deploy, publish, send outreach, or contact another worker.
Return the structured handoff.

<paste ./nai pipeline context --assignment ID>
```

Required handoff back:

```text
Assignment / asset / gate:
Changed files:
Checks: <command -> result>
Evidence: <repo-relative paths>
Risks:
Recommended transition: pass | fail | block | reset
```

Workers never edit canonical state, accept themselves, deploy, or widen shared
or n8n access. These are policy boundaries even where the filesystem allows more.

## Gate evidence bars

- **Research** — `lead_research_json/<canonical-route-slug>.json`: nonempty JSON,
  top-level `slug` matching the route slug, assigned buyer, substantive current
  research, nonempty sources. Missing honestly means unfinished; **never** write
  a placeholder to improve coverage.
- **Brandkit** — buyer-specific decisions, real assets or provenance, valid
  brandkit JSON, nonempty notes. A renamed generic template is not a brandkit.
- **Implementation** — source only (never `dist/`, `.vercel/`, `node_modules/`);
  focused build passes, correct Vite base/route behavior, no leaked parent
  identity, primary interaction works.
- **Verification** — independent and read-only w.r.t. product source. Validation
  and error states, primary action, responsive layout, console errors, failed
  requests, buyer-specific factual quality, and for AI features both the API
  request and the rendered response. A screenshot alone proves no interaction; a
  direct API call alone proves no browser integration.

```bash
./nai build --slugs <slug>
./nai screenshots --slugs <slug>          # add --live only for authorized production evidence
./nai analyze-screenshots --slugs <slug>
```

Reading failures: blank page / landing shell → route or Vite base; `body_chars: 0`
→ render failure; `networkidle timeout` → hanging API or asset request, not
automatically a visual failure. A recovered `dist/` is not current — build source.

## Shared AI backend

```text
MVP browser -> shared/api-client.js -> same-origin /api/ai | /api/image | /api/speech
  -> nai_suite/openrouter_proxy_function.js -> OpenRouter
```

`OPENROUTER_API_KEY` stays server-side. Never add `VITE_OPENROUTER_API_KEY`, a
direct provider call, or a site-local secret-bearing proxy. Prefer strict JSON
schema over loose JSON mode; omit `maxTokens` unless the product needs a cap;
keep display-only historical labels (e.g. `year`) as strings. `/api/speech` is a
Node function (120s) because Gemini TTS exceeds the Edge ceiling — keep long
narration one coherent performance, use an authored loading experience instead of
chunking. Missing shared capability → escalate, never bypass.

## n8n

Shared infrastructure, not pipeline state. Workers consume packet-listed public
webhook contracts as ordinary APIs, receive no credentials, and escalate schema
or workflow changes. Management stays in the orchestrator session
(`/root/.hermes/bin/n8n-mcp-full`, see `TO_CLAUDE.md` §10); verify the actual
discovered tool surface rather than trusting `claude mcp list`. Never record
credentials under `n8n/`, in browser env vars, or in a packet.

## Orchestrator-owned scope (never delegated casually)

`shared/`, `nai_suite/`, `nai`, `SITEMAP.json`, `NAI_STATE.json`,
`landing-page/`, root deployment config, n8n workflows/tables. When the real
defect is shared: pause conflicting assignments → open an explicit maintenance
scope → identify consumers → smallest change → focused consumer builds →
document the contract → refresh affected packets.

## When in doubt

Stop before widening scope. Ask the user, or issue a precise orchestrator blocker
with the exact failed check, exact error, evidence path, and recommended action.
