---
name: nai-mvp-orchestrator
description: Govern one New Ashtabula Initiative MVP through the canonical research, brandkit, implementation, verification, and pitch gates. Use when an explicitly authorized orchestrator in any agent harness must select work, create a bounded worker packet, delegate it, review evidence, recover a failed attempt, or authorize production verification without exposing the full portfolio to the worker.
---

# NAI MVP Orchestrator

Keep operational authority in the orchestrating agent. Delegate one gate at a time through
`./nai pipeline`; never replace `NAI_STATE.json` with chat prose, a kanban board,
or `pipeline_priority.json`.

## Start

1. Work from `/root/new-ashtabula-initiative`.
2. Read `DOCUMENTATION_INDEX.md`, `WORKFLOW.md`, and `NAI_AGENT_GUIDE.md`.
3. Run:

   ```bash
   ./nai pipeline validate
   ./nai pipeline status
   ```

4. Confirm the requested asset, current gate, and absence of a conflicting active
   assignment. Do not infer gate passes from old reports.

`pipeline validate` checks every research artifact that currently exists. Missing
`lead_research_json/<slug>.json` files are allowed and mean the route's research
is unfinished; empty, legacy-named, malformed, uncited, or internally mismatched
files are validation errors. Never create placeholders to improve coverage counts.

## Authority

Act as the pipeline orchestrator for canonical state changes. Keep these actions
in the orchestrator's thread or session:

- assign, pass, fail, retry, reassign, block, unblock, quarantine, and reset;
- changes to `NAI_STATE.json`, `SITEMAP.json`, shared code, tooling, or landing;
- production deployment and external outreach authorization.

Shared service administration follows the same boundary. The orchestrator may
inspect or provision n8n Data Tables and workflows through an available n8n
control surface when the assignment requires shared persistence. Record the
endpoint contract and workflow evidence in the repository. Do not assume that a
worker has n8n MCP access merely because the orchestrator does.

Workers may return patches and evidence. They may not accept their own gate.

## Assign One Gate

1. Select the asset's current eligible gate shown by `pipeline status`. Choose
   the gate as an orchestration decision; never infer it from objective keywords
   or a worker's name. Do not assign a later gate to skip prerequisites. Assign
   only work inside the current authorization and harness capability; leave the
   next eligible gate unassigned when it is out of scope.

2. Assign the selected gate:

   ```bash
   ./nai pipeline assign --asset <slug> \
     --gate <current-gate> \
     --objective "<specific durable objective>" \
     --deliverable "<required output>"
   ```

   Add `--worker <audit-id>` only when a stable harness, session, profile, or
   human identifier is useful for audit and exclusivity. The worker ID never
   selects the gate, permissions, checks, or coordination path.

   For research, require the durable output at
   `lead_research_json/<canonical SITEMAP slug>.json`. Website source-directory
   names, buyer names, and historical aliases never replace the route slug.

3. The command persists the assignment and prints the complete bounded packet.
   Give that packet to one worker using the current harness's native delegation
   mechanism: a sub-agent/task call, another agent session, a message,
   or direct execution after switching to the worker skill.

4. Tell the worker to use `$nai-mvp-worker` and return its structured handoff to
   this orchestrator. Transport is not operational state.

5. Run only one write-heavy worker for the asset. A recorded worker ID may hold
   only one active assignment; omit it when the harness does not expose a stable
   identity. Parallelize independent assets when boundaries do not overlap.

For an implementation that consumes n8n, put the public endpoint contract,
expected request and response fields, and a repository documentation path in the
packet. Grant n8n workflow-management access only when infrastructure work is an
explicit deliverable; otherwise workers use the endpoint as an ordinary API and
escalate workflow changes.

For an implementation that consumes shared AI capabilities, read
[shared-openrouter-api.md](references/shared-openrouter-api.md) before defining
the work order. If the repository has a current `SHARED_OPENROUTER_API.md`, read
it as the authoritative contract. Put that path and any required shared client
path in `--shared-read`; name the required text, vision, image, or speech
endpoints and models in the objective; keep shared infrastructure read-only
unless changing it is an explicit orchestrator-owned deliverable. Require the
worker to escalate contract gaps rather than bypass the proxy or expose provider
credentials.

User clarification through the active harness may refine execution inside the
packet's existing asset, gate, deliverables, and boundaries. If it changes any
of those, stop the attempt and use `reassign --objective ... --deliverable ...`
so the replacement packet remains the durable work order.

See [delegation.md](references/delegation.md) for reusable prompts.

## Review and Decide

Require the worker to return:

- assignment ID and gate;
- changed files;
- commands run and exit results;
- evidence paths;
- unresolved risks or a blocker report.

Inspect the evidence yourself. Then choose exactly one transition:

```bash
./nai pipeline pass --assignment <id> --evidence <path> [--evidence <path>]
./nai pipeline fail --assignment <id> --reason "<reason>" [--evidence <path>]
```

Passing means the gate checklist and evidence validator both succeed. A successful
build does not pass verification, and screenshot analysis does not accept itself.
For research, accept only the exact canonical filename, a matching top-level
`slug`, the assigned target, and non-empty source or citation data.

## Recover

Use the smallest recovery action:

```bash
./nai pipeline retry --asset <slug>
./nai pipeline reassign --asset <slug> --gate <current-gate> \
  --worker <optional-audit-id> --reason "<reason>"
./nai pipeline block --asset <slug> --reason "<reason>"
./nai pipeline unblock --asset <slug>
./nai pipeline reset --asset <slug> --gate <gate>
./nai pipeline quarantine --asset <slug> --reason "<reason>"
```

Resetting an earlier gate invalidates downstream passes but preserves their
evidence. A site failure must not alter unrelated sites. Read
[acceptance-and-recovery.md](references/acceptance-and-recovery.md) when choosing
between failure, reset, block, and quarantine.

## Deployment Boundary

Do not let a worker deploy. After implementation and verification evidence are
accepted, deploy only with separate production authorization:

```bash
./nai deploy --confirm-production
./nai screenshots --live --slugs <slug>
./nai analyze-screenshots --quality deep --slugs <slug>
```

For an AI feature, also exercise the live user action and confirm the production
API request, rendered response, console, and network state. Live verification
evidence may then be submitted to the appropriate gate.

## Completion

Finish only when state validates, `CHIEF_OF_STAFF.md` reflects the transition,
and the worker is no longer active or its next gate has been intentionally
assigned.
