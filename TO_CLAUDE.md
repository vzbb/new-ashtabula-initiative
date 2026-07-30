# To Claude: New Ashtabula Initiative Operating Manual

This is the practical briefing for Claude Code entering
`/root/new-ashtabula-initiative`. It is written so Claude can safely become the
active orchestrator, create bounded worker assignments, review their evidence,
and operate the shared backend without inventing a second control system.

The short version:

- work from the repository root;
- use `./nai` as the supported control surface;
- treat `SITEMAP.json` and `NAI_STATE.json` as different canonical truths;
- use the repository's two NAI skills for orchestrator and worker behavior;
- delegate one asset and one gate per worker;
- workers never pass themselves, deploy, or gain shared-service authority by
  implication;
- preserve the very dirty working tree;
- **leave the Pitch gate alone for now**;
- use the shared OpenRouter proxy and documented n8n webhooks instead of putting
  credentials in an MVP.

## 1. Read This First

Read the following in order. Do not begin by recursively reading every Markdown
file in the repository.

1. [Repository README](README.md) — fast shape and command orientation.
2. [Documentation index](DOCUMENTATION_INDEX.md) — the active context allowlist.
3. [Main workflow](WORKFLOW.md) — gates, state, recovery, builds, routes, and
   releases.
4. [NAI agent guide](NAI_AGENT_GUIDE.md) — exact `./nai` commands and evidence
   semantics.
5. [NAI orchestrator skill](.agents/skills/nai-mvp-orchestrator/SKILL.md) — the
   canonical authority contract for Claude's main session.
6. [NAI worker skill](.agents/skills/nai-mvp-worker/SKILL.md) — the canonical
   contract for each Claude subagent.
7. [Shared OpenRouter API](SHARED_OPENROUTER_API.md) — text, vision, image, and
   speech contracts.
8. [Toolchain registry](NAI_TOOLCHAIN.md) — supported versus legacy scripts.
9. [Harriet operations brief](HARRIET_NAI_OPERATIONS_BRIEF.md) — useful prior
   operator guidance, with the Pitch exception in this document taking
   precedence.

`AGENTS.md` currently contains no additional instructions. If it becomes
nonempty later, treat it as repository-level guidance and reconcile it with the
canonical documents above before operating.

Useful gate references:

- [Research and brandkit](.agents/skills/nai-mvp-worker/references/research-brand.md)
- [Implementation](.agents/skills/nai-mvp-worker/references/implementation.md)
- [Verification](.agents/skills/nai-mvp-worker/references/verification.md)
- [Acceptance and recovery](.agents/skills/nai-mvp-orchestrator/references/acceptance-and-recovery.md)
- [Delegation prompts](.agents/skills/nai-mvp-orchestrator/references/delegation.md)

Historical files under `archive/`, old batch reports, screenshots, assessments,
and unindexed site-level notes are not default context. Load one only when an
assignment or diagnosis explicitly requires it.

## 2. Safe Bootstrap

Start every orchestrator session with:

```bash
cd /root/new-ashtabula-initiative
git status --short
./nai pipeline validate
./nai pipeline status
./nai scan
./nai tooling
```

At the time this guide was written, pipeline validation reported revision 60,
75 public site records, no active assignments, no blockers, and no quarantined
assets. That is a snapshot, not a promise. Trust the current command output.

Interpret the commands this way:

- `git status --short`: protects user and other-agent work. This checkout is
  routinely very dirty.
- `pipeline validate`: validates canonical state and every research artifact
  that currently exists. Missing research is allowed; fake placeholders are
  not.
- `pipeline status`: shows gates, assignments, blockers, quarantine, and next
  eligible work.
- `scan`: resolves public slugs to actual source directories and build roots.
- `tooling`: identifies core, support, and legacy scripts.

Do not mass-reset, mass-restore, or mass-stage the repository. Never run a broad
`git checkout`, `git reset --hard`, blanket formatter, or generated-file cleanup.
Existing modifications and deletions may belong to another active effort.

## 3. The Canonical Truths

Keep these separate:

| Question | Canonical source |
| --- | --- |
| What public routes exist and which source/build do they map to? | [SITEMAP.json](SITEMAP.json) |
| What gate, assignment, blocker, evidence, and attempt does an asset have? | [NAI_STATE.json](NAI_STATE.json) |
| What is the readable pipeline dashboard? | [CHIEF_OF_STAFF.md](CHIEF_OF_STAFF.md), generated from state |
| Which tools are supported? | [NAI_TOOLCHAIN.json](NAI_TOOLCHAIN.json), rendered as [NAI_TOOLCHAIN.md](NAI_TOOLCHAIN.md) |
| What does the shared AI backend accept? | [SHARED_OPENROUTER_API.md](SHARED_OPENROUTER_API.md) |

Rules:

- Never edit `NAI_STATE.json`, `CHIEF_OF_STAFF.md`, `SITEMAP.md`,
  `NAI_TOOLCHAIN.md`, or `vercel.json` by hand.
- Use `./nai pipeline ...` for state.
- Edit `SITEMAP.json`, then use `./nai sitemap-validate`,
  `./nai sitemap-render-md`, and `./nai routes` for approved route changes.
- `pipeline_priority.json`, chat messages, coordination logs, old reports, and
  kanban-like artifacts are advisory or historical. They do not pass gates.
- A public slug is not necessarily the directory name. Use `./nai scan` or the
  assignment packet. For example, `scheduler-sms` maps to
  `websites/service-scheduler-sms`.

## 4. Gates and the Pitch Stop

The site pipeline is:

```text
research -> brandkit -> implementation -> verification -> pitch
```

The landing page has its own pipeline:

```text
inventory -> design -> implementation -> verification -> release
```

### Important: do not orchestrate Pitch

**Leave the Pitch gate alone for now.**

NAI has a dedicated team of Hermes agents that takes over at Pitch. Claude may:

- observe that verification made Pitch eligible;
- report that fact to the user or Hermes operator;
- preserve existing Pitch evidence.

Claude must not:

- assign a Pitch worker;
- produce or rewrite pitch/outreach packages as routine continuation;
- pass, fail, reset, or otherwise advance Pitch without a new explicit user
  instruction overriding this note;
- send outreach or contact prospects.

Stop after accepted verification and hand the asset off to the Hermes team.
Eligibility is not authorization.

## 5. How the Two NAI Skills Map to Claude Code

The skills are harness-independent protocol, even though they live under
`.agents/skills/`.

### Main Claude session: `nai-mvp-orchestrator`

Claude's primary session should follow
[the orchestrator skill](.agents/skills/nai-mvp-orchestrator/SKILL.md).

The orchestrator alone:

- chooses the current eligible gate;
- creates and persists assignments;
- owns canonical pipeline transitions;
- reviews worker evidence;
- chooses pass, fail, retry, reassign, block, reset, or quarantine;
- owns `SITEMAP.json`, shared code, tooling, landing, and maintenance windows;
- authorizes production deployment;
- administers shared n8n infrastructure when explicitly needed.

The orchestrator must not accept “done” as evidence and must not infer a pass
from an old report or successful build.

### Claude subagent: `nai-mvp-worker`

Every worker should follow
[the worker skill](.agents/skills/nai-mvp-worker/SKILL.md).

A worker:

- receives one generated assignment packet;
- works on one asset, one gate, one attempt;
- reads and writes only packet-listed paths;
- performs every packet-listed check;
- returns changed files, results, evidence, risks, and a recommended transition;
- never edits canonical state;
- never accepts itself;
- never deploys;
- never contacts prospects or another worker;
- never broadens n8n or shared-code access on its own.

These are policy boundaries even when Claude Code's filesystem permissions are
broader.

### Making the skills visible to Claude

Claude can read the skill sources directly from the links above. If local Claude
Code skill discovery requires `.claude/skills`, create links rather than
maintaining divergent copies:

```bash
mkdir -p .claude/skills
ln -s ../../.agents/skills/nai-mvp-orchestrator .claude/skills/nai-mvp-orchestrator
ln -s ../../.agents/skills/nai-mvp-worker .claude/skills/nai-mvp-worker
```

If Claude Code already discovers `.agents/skills`, do not duplicate them.
Regardless of discovery mechanics, the `.agents/skills` versions are canonical.

## 6. The Orchestration Loop

### A. Select work

Use the user's stated priority, then current pipeline status. Do not invent a
gate from the wording of a request or the name of a worker.

```bash
./nai pipeline validate
./nai pipeline status
```

Confirm:

- the canonical slug;
- its current eligible gate;
- no conflicting assignment;
- required prerequisite evidence;
- whether the requested work touches shared code, routing, deployment, or n8n.

### B. Create one durable assignment

```bash
./nai pipeline assign \
  --asset <canonical-slug> \
  --gate <current-eligible-gate> \
  --worker <optional-claude-task-id> \
  --objective "<specific durable objective>" \
  --deliverable "<required artifact or outcome>" \
  --deliverable "<second required artifact or outcome>"
```

The command writes the assignment into canonical state and prints the bounded
packet. The optional worker ID is audit metadata only. It does not grant tools,
permissions, or select a role.

Use `--shared-read` when an implementation legitimately needs a shared contract:

```bash
./nai pipeline assign \
  --asset <slug> \
  --gate implementation \
  --objective "Implement the packet-defined multimodal workflow through the shared API" \
  --deliverable "Focused source implementation and build evidence" \
  --shared-read SHARED_OPENROUTER_API.md \
  --shared-read shared/api-client.js
```

Do not grant write access to shared infrastructure merely because an MVP imports
it. Shared changes are a separate orchestrator-owned maintenance scope.

### C. Delegate through Claude's native subagent system

Give the worker exactly this framing plus the printed packet:

```text
Use the nai-mvp-worker skill to complete this single NAI assignment.

Follow the context packet exactly. Work on one asset, one gate, and one attempt.
Do not inspect other sites, modify canonical state, alter shared infrastructure
outside the allowlist, deploy, publish, send outreach, or contact another
worker. Return the required structured handoff to the orchestrator.

<paste output from ./nai pipeline context --assignment ASSIGNMENT_ID>
```

Regenerate a packet at any time with:

```bash
./nai pipeline context --assignment <assignment-id>
```

The packet—not Claude's conversation history—is the durable work order.

### D. Parallelism

Parallelize independent assets only. For one asset, keep gates sequential.

Good:

- worker A researches site A;
- worker B implements already-approved site B;
- worker C independently verifies already-built site C.

Bad:

- two write-heavy workers editing one MVP;
- a UI worker and API worker modifying the same files without explicit partition;
- implementation and verification running concurrently on the same changing
  build;
- any worker touching `shared/`, `nai_suite/`, state, routes, or landing without
  an explicit maintenance assignment.

Use cheap workers for bounded, well-specified tasks. Spend stronger reasoning on
orchestration decisions, cross-cutting backend changes, ambiguous failures, and
evidence review.

### E. Require the worker handoff

```text
Assignment: <id>
Asset / gate: <slug> / <gate>
Changed files: <paths or none>
Checks: <command -> result>
Evidence: <repo-relative paths>
Risks: <none or exact unresolved risk>
Recommended transition: review for pass | fail | block | reset
```

A blocker report must name the exact failed check, exact error, evidence path,
and recommended orchestrator action.

### F. Review and decide

Inspect the actual patch and evidence. Then select one transition:

```bash
./nai pipeline pass --assignment <id> \
  --evidence <repo-relative-path>

./nai pipeline fail --assignment <id> \
  --reason "<precise failure>" \
  --evidence <diagnostic-path>

./nai pipeline retry --asset <slug>

./nai pipeline reassign --asset <slug> \
  --gate <same-current-gate> \
  --worker <new-task-id> \
  --reason "<reason>"

./nai pipeline block --asset <slug> --reason "<external dependency>"
./nai pipeline unblock --asset <slug>
./nai pipeline reset --asset <slug> --gate <earliest-invalid-gate>
./nai pipeline quarantine --asset <slug> --reason "<reason>"
```

Use the smallest recovery:

- `fail`: this attempt is unacceptable; earlier passes remain.
- `retry`: same gate and scope, another attempt.
- `reassign`: new worker or clean handoff.
- `block`: real missing fact, credential, authorization, or external asset.
- `reset`: an earlier accepted premise became invalid; downstream gates must be
  revalidated.
- `quarantine`: routine retries would waste work or the asset/template is unsafe.

After transitions:

```bash
./nai pipeline validate
./nai pipeline status
```

`CHIEF_OF_STAFF.md` should reflect the generated state transition.

## 7. Gate-Specific Evidence

### Research

Completed research belongs at:

```text
lead_research_json/<canonical-route-slug>.json
```

It must be a nonempty JSON object with:

- a top-level `slug` matching the canonical route slug;
- the assigned buyer/target;
- substantive current research;
- nonempty sources or citations.

Do not create placeholders. Missing honestly means unfinished.

### Brandkit

Require buyer-specific decisions, usable assets or asset provenance, valid
brandkit JSON, and nonempty notes. Do not accept a renamed generic template as a
brandkit.

### Implementation

Workers change source, not `dist/`, `.vercel/`, or `node_modules/`.

Focused loop:

```bash
./nai build --slugs <slug>
./nai screenshots --slugs <slug>
```

Implementation evidence includes:

- focused build success;
- correct Vite public base and route behavior;
- no leaked parent identity;
- primary interaction behavior;
- any packet-specific checks.

A build is not verification.

### Verification

Verification is independent and read-only with respect to product source unless
the orchestrator creates a separate implementation assignment.

```bash
./nai build --slugs <slug>
./nai screenshots --slugs <slug>
./nai analyze-screenshots --slugs <slug>
```

Verify the actual story:

- validation and error states;
- primary user action;
- responsive layout;
- console errors;
- failed network requests;
- factual and buyer-specific quality;
- API request and rendered response for AI features.

A screenshot alone does not prove an interaction. A direct API call alone does
not prove browser integration. Capture both sides.

After accepted verification, stop. The Hermes team owns Pitch.

## 8. Repository Structure and Build Quirks

Important paths:

| Path | Meaning |
| --- | --- |
| `websites/` | MVP source directories |
| `landing-page/` | independent portfolio landing product |
| `branding_research/` | buyer and brand research, notes, and assets |
| `brandkits/` | structured brandkit artifacts |
| `lead_research_json/` | canonical completed research by route slug |
| `shared/` | browser-facing shared modules |
| `nai_suite/` | internal implementation of the `./nai` control surface |
| `n8n/` | workflow artifacts and public endpoint contracts, never secrets |
| `.agents/skills/` | canonical orchestrator and worker protocols |
| `sitemap_screenshots/` | screenshot evidence, often generated/dirty |

Operational quirks:

- There are many independently built Vite apps, not one conventional monorepo
  application.
- Public slug, package name, and folder name may differ.
- Route/base failures often present as a blank page or the landing page shell.
- `./nai build --slugs <slug>` is the safe focused build.
- `./nai screenshots` without `--live` captures a temporary local preview tree.
  Metadata says `source: preview:<build-root>`.
- `./nai screenshots --live` is production evidence and requires production to
  have been intentionally moved.
- `networkidle timeout` often indicates a hanging API or asset request; it is
  not automatically a visual failure.
- `body_chars: 0` usually means render failure.
- Do not assume a recovered `dist/` is current. Build source.
- Do not use legacy bulk fixers unless a diagnosed assignment explicitly calls
  for one.

## 9. Shared OpenRouter Backend

Read [SHARED_OPENROUTER_API.md](SHARED_OPENROUTER_API.md) and the implementation
reference before touching an AI MVP.

Architecture:

```text
MVP browser
  -> shared/api-client.js
  -> same-origin /api/ai | /api/image | /api/speech
  -> nai_suite/openrouter_proxy_function.js
  -> OpenRouter
```

The provider key remains server-side as `OPENROUTER_API_KEY`.

### Browser client

[shared/api-client.js](shared/api-client.js) exports:

- `callOpenRouterAPI(prompt, options)` — text/chat;
- `callVisionAPI(prompt, image, options)` — multipart-style vision content from
  a `File`, `Blob`, HTTPS URL, or data URL;
- `generateImage(prompt, options)` — purpose-neutral image generation;
- `generateSpeech(text, options)` — audio `Blob`;
- response-text and error helpers.

Do not add `VITE_OPENROUTER_API_KEY`, direct provider calls, or a site-specific
secret-bearing proxy.

### `POST /api/ai`

Supports text and vision through OpenRouter-style `messages` or Gemini-style
`contents`. It also supports strict `response_format` JSON schema and optional
reasoning controls.

Important behavior:

- no small default completion cap is imposed;
- omit `maxTokens` unless the product genuinely needs a cap;
- prefer strict JSON schema over loose JSON object mode for structured UI;
- `year` and other display-only historical labels should remain strings when
  their content is not mathematically processed;
- supported embedded image types are PNG, JPEG, WEBP, and GIF;
- remote images must use HTTPS.

### `POST /api/image`

This is deliberately purpose-neutral. An MVP selects an authorized image model
and prompt. The endpoint is not “the historical portrait endpoint.”

Supported options include model, `n`, resolution, aspect ratio, size, quality,
output format, background, compression, seed, input references, and provider
configuration.

The response exposes base64, MIME type, and ready-to-render data URLs.

### `POST /api/speech`

Input includes model, text, voice, response format, and optional speed.

Current important implementation detail:

- `/api/ai` and `/api/image` are packaged as Edge functions;
- `/api/speech` is packaged as a Node function with a 120-second duration because
  long Gemini TTS generation exceeded the Edge runtime's roughly 25-second
  ceiling;
- Gemini TTS returns PCM; the proxy wraps PCM as a browser-playable WAV when
  requested;
- long narration should remain one coherent TTS performance. Do not split it
  into independently generated sentence chunks merely to beat a timeout; voice,
  accent, and performance continuity degrade;
- provider latency can be substantial and may not produce an early first byte.
  Use an authored loading/prologue experience rather than pretending transport
  streaming will eliminate model-side generation time.

The packaging logic lives in `./nai`'s Vercel-output preparation and
[nai_suite/openrouter_proxy_function.js](nai_suite/openrouter_proxy_function.js).
Never patch `.vercel/output` as the source of truth.

### Model policy

MVPs may select any syntactically valid OpenRouter model compatible with the
capability unless deployment environment variables restrict the catalog:

- `OPENROUTER_CHAT_MODELS`
- `OPENROUTER_IMAGE_MODELS`
- `OPENROUTER_SPEECH_MODELS`

If an implementation assignment discovers a missing shared capability, stop and
escalate. Do not bypass the proxy from browser code.

## 10. n8n Layer

n8n is shared persistence and workflow infrastructure. It is not canonical
pipeline state.

Current documented examples:

- [Sommelier Table API](n8n/SOMMELIER_TABLE_API.md)
- [Saybrook request intake](n8n/SAYBROOK_ZONING_REQUEST_FLOW.md)
- [Saybrook query flow](n8n/SAYBROOK_ZONING_INGEST.md)
- [Saybrook trustee queue](n8n/SAYBROOK_ZONING_TRUSTEE_REQUESTS.md)

Normal MVP worker behavior:

- consume the packet-listed webhook as an ordinary API;
- follow the documented request and response schema;
- never receive n8n credentials;
- escalate schema or workflow changes.

The browser should call public webhook contracts, never n8n's management API.
Credentials do not belong under `n8n/`, in browser environment variables, or in
worker packets.

### Giving Claude Code the same elevated n8n capability

This machine already has a safe launcher:

```text
/root/.hermes/bin/n8n-mcp-full
```

It reads the canonical `n8n-mcp` connection settings from
`/root/.codex/config.toml` at runtime and launches the stdio `n8n-mcp` package.
It does not require copying the API key into this repository.

Add it to Claude Code at project scope:

```bash
cd /root/new-ashtabula-initiative
claude mcp add --scope project n8n-full -- /root/.hermes/bin/n8n-mcp-full
claude mcp get n8n-full
claude mcp list
```

Claude may require explicit approval of the project-scoped MCP server on first
use. If configuration changes while Claude is running, restart the Claude Code
session before concluding that tools are missing.

The important distinction:

- successful MCP configuration is not proof that management tools loaded;
- verify the discovered tool surface;
- the full surface requires both `N8N_API_URL` and `N8N_API_KEY`;
- the raw n8n `/mcp-server/http` endpoint is not equivalent to the stdio
  `n8n-mcp` management surface;
- the existing Hermes setup previously discovered 24 tools through
  `n8n-full`; current counts may change with package versions, so inspect rather
  than hard-code the count.

If the launcher is unavailable in a different environment, configure the stdio
package with secret environment variables outside the repository:

```bash
claude mcp add --scope local n8n-full \
  -e N8N_API_URL=https://YOUR-N8N-HOST \
  -e N8N_API_KEY=YOUR_SECRET \
  -e MCP_MODE=stdio \
  -e LOG_LEVEL=error \
  -e DISABLE_CONSOLE_OUTPUT=true \
  -- npx -y n8n-mcp
```

Prefer the launcher on this machine so secrets remain centralized.

### Giving a worker n8n capability

Do not assume a Claude subagent automatically receives the main session's MCP
tools. Confirm Claude Code's actual subagent tool inheritance.

For ordinary implementation, do **not** grant management access. Put the webhook
contract in the assignment packet and list its documentation under allowed
reads.

For an explicit n8n administration assignment:

1. Keep the orchestrator's `n8n-full` connection active.
2. Name the exact workflow ID, table ID, endpoint, and permitted operations in
   the assignment.
3. Grant only the MCP tool(s) required by that worker if Claude's subagent
   configuration supports per-agent tool allowlists.
4. If subagents cannot reliably inherit or restrict MCP tools, keep n8n
   administration in the orchestrator session. Delegate analysis or workflow
   JSON preparation, then perform the management calls centrally.
5. Inspect before changing.
6. Preserve or record the prior workflow version.
7. Validate after changing.
8. Test the exact webhook execution.
9. Update the packet-listed contract under `n8n/` with IDs, schema, and evidence.
10. Never record credentials.

Real privilege separation must happen at a profile, gateway, or explicit tool
allowlist boundary. Merely naming a child “n8n worker” does not grant or restrict
anything.

The existing Hermes deployment uses persistent profile separation:

- elevated `n8n-full`: `default` and `nai-dev`;
- lower-privilege role profiles include `nai-creative`, `nai-pm`, and
  `nai-sales`;
- Hermes profile configuration lives under `/root/.hermes/config.yaml` and
  `/root/.hermes/profiles/<profile>/config.yaml`;
- `/root/.local/bin/nai-dev` is an example persistent profile alias.

Claude should emulate the principle, not blindly copy Hermes internals.

## 11. Shared and Canonical Maintenance Windows

Workers should not casually edit:

- `shared/`;
- `nai_suite/`;
- `nai`;
- `SITEMAP.json`;
- `NAI_STATE.json`;
- `landing-page/`;
- root deployment configuration;
- n8n workflows or tables.

When the real defect is shared:

1. Pause conflicting site assignments.
2. Create an explicit orchestrator-owned maintenance scope.
3. Identify all consumers.
4. Make the smallest shared change.
5. Run focused consumer builds.
6. Verify representative live behavior after authorized deployment.
7. Document contract changes.
8. Resume site assignments with refreshed packets if their assumptions changed.

Do not let a site worker “just fix” the proxy, route generator, or n8n workflow
because that was convenient.

## 12. Deployment

Workers never deploy.

Focused pre-deploy validation:

```bash
./nai build --slugs <slug>
./nai screenshots --slugs <slug>
```

Production requires explicit authorization:

```bash
./nai deploy --confirm-production
```

That command:

- builds canonical source-backed sites;
- regenerates routes;
- prepares a pruned Vercel Build Output API tree;
- packages the shared API functions;
- deploys prebuilt production output.

After deployment:

```bash
./nai screenshots --live --slugs <slug>
./nai analyze-screenshots --quality deep --slugs <slug>
```

For an AI MVP, also perform the complete live user action and inspect:

- browser console;
- network status;
- provider/proxy error body;
- rendered result;
- audio/image decodability where applicable.

Do not burn a portfolio-wide production deploy to test whether a small edit
compiles. Build locally first and batch coherent release changes.

## 13. Experienced-Operator Advice

1. **Primitives first.** The assignment/state system already exists. Do not
   build an autonomous scheduler, second state database, or orchestration
   framework before using it.
2. **Policy-only isolation is intentional.** Packets and authority rules are the
   current write-isolation mechanism. Do not pretend filesystem access equals
   permission.
3. **Conservative bootstrap.** Old prose, reports, screenshots, and apparently
   functional sites do not retroactively pass gates.
4. **One gate at a time.** A narrowly successful worker is more valuable than an
   “agent team” broadly touching five layers.
5. **Exact commands beat roleplay.** Give workers canonical paths, checks,
   outputs, and escalation rules.
6. **Do not over-cap model output.** Ask for the desired content length and use a
   strict schema; avoid tiny token ceilings that truncate structured responses.
7. **Display fields can stay strings.** Do not impose numeric/date validation on
   historical labels solely displayed in the UI.
8. **Verify actual tools.** `claude mcp list` or a configured server does not
   prove the expected n8n management calls are present.
9. **Preserve immersiveness.** For long AI media generation, use a product-level
   transition experience. Do not degrade one performance into inconsistent
   chunks just to satisfy an arbitrary timeout.
10. **Inspect production truth.** A successful deploy and a screenshot are not
    enough for multimodal flows.
11. **Do not freeze the portfolio at 75.** That was a baseline, not a permanent
    cap. Approved route additions still go through canonical sitemap and clone
    workflows.
12. **Stop at Pitch.** Hermes takes it from there.

## 14. Quick Command Card

```bash
# Orient
./nai pipeline validate
./nai pipeline status
./nai scan
./nai tooling

# Assign
./nai pipeline assign --asset <slug> --gate <gate> \
  --objective "<objective>" --deliverable "<deliverable>"

# Regenerate worker packet
./nai pipeline context --assignment <id>

# Decide
./nai pipeline pass --assignment <id> --evidence <path>
./nai pipeline fail --assignment <id> --reason "<reason>" --evidence <path>
./nai pipeline retry --asset <slug>
./nai pipeline reassign --asset <slug> --gate <gate> --reason "<reason>"
./nai pipeline block --asset <slug> --reason "<reason>"
./nai pipeline reset --asset <slug> --gate <gate>
./nai pipeline quarantine --asset <slug> --reason "<reason>"

# Focused development
./nai build --slugs <slug>
./nai screenshots --slugs <slug>
./nai analyze-screenshots --slugs <slug>

# Approved route maintenance
./nai sitemap-validate
./nai sitemap-render-md
./nai routes

# Explicitly authorized production
./nai deploy --confirm-production
./nai screenshots --live --slugs <slug>

# Claude n8n management surface on this machine
claude mcp add --scope project n8n-full -- /root/.hermes/bin/n8n-mcp-full
claude mcp get n8n-full
claude mcp list
```

When in doubt, stop before widening scope. Ask the user or issue a precise
orchestrator blocker rather than improvising around canonical state, deployment,
shared APIs, n8n, credentials, or Pitch.
