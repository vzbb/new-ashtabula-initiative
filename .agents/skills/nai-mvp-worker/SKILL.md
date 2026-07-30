---
name: nai-mvp-worker
description: Complete exactly one bounded New Ashtabula Initiative pipeline assignment from an orchestrator-generated context packet in any agent harness. Use when a developer, researcher, creative worker, verifier, or pitch-preparation worker is assigned one MVP gate and must follow explicit read/write boundaries, use the documented `./nai` commands, produce checkable evidence, and escalate without changing canonical state, deploying, or contacting prospects.
---

# NAI MVP Worker

Treat the assignment packet as the complete work order. Work on one asset, one
gate, and one attempt. Do not browse the portfolio for additional context.

## Require a Valid Assignment

Before acting, require a packet produced by:

```bash
./nai pipeline context --assignment <assignment-id>
```

Confirm it names the assignment ID, asset, explicit gate, objective, deliverables,
source directory, acceptance checklist, read allowlist, write allowlist, checks,
and escalation format. A worker audit ID may be absent. If required fields are
missing or contradictory, stop and report the defect to the orchestrator. Do not
repair `NAI_STATE.json` yourself.

## Boundaries

- Read only packet-listed paths and canonical documents it explicitly names.
- Write only packet-listed paths.
- Treat the boundaries as protocol rules even when the filesystem permits more.
- Never edit `NAI_STATE.json`, `SITEMAP.json`, generated route data, tooling,
  landing, shared code, or another site unless the packet explicitly grants it.
- Never pass, fail, reset, or reassign the gate.
- Never deploy, publish, send outreach, or contact another worker.
- Preserve unrelated dirty worktree changes.

n8n is a shared service, not an implied worker capability. Use a packet-listed
webhook contract like any other API. Do not inspect, create, activate, or modify
n8n Data Tables or workflows unless the packet explicitly grants n8n
administration and names the exact workflow or table boundary. Escalate missing
endpoints or schema changes to the orchestrator.

If required work crosses a boundary, escalate rather than widening scope.
The user may clarify active work through the current harness. Follow a
clarification only when it remains inside the packet's asset, gate,
deliverables, and boundaries. Return the final handoff to the orchestrator. If
the clarification changes scope, acknowledge it and ask the orchestrator for a
replacement assignment packet.

## Execute the Gate

1. Read only the prerequisite evidence listed in the packet.
2. Read the gate-specific reference:

   - research or brandkit: [research-brand.md](references/research-brand.md)
   - implementation: [implementation.md](references/implementation.md)
   - verification: [verification.md](references/verification.md)
   - pitch: [pitch.md](references/pitch.md)
   - landing work: follow the packet literally and escalate canonical changes

   For an implementation/dev assignment involving AI, multimodal input,
   generated images, or generated speech, also read
   [shared-openrouter-api.md](references/shared-openrouter-api.md). When the
   packet explicitly lists a repository `SHARED_OPENROUTER_API.md`, read that
   file too and treat it as the current contract; the bundled reference is the
   portable baseline. Never infer endpoint fields or expose a provider key in
   browser code.

3. Make the smallest change that satisfies every acceptance checkbox.
4. Run every command listed under `Required checks`.
5. Add a concise handoff to the permitted gate coordination file.
6. Return evidence to the orchestrator; do not claim the gate passed.

Use `./nai` rather than internal scripts. For detailed command semantics, read
`NAI_AGENT_GUIDE.md` only when the packet permits it or the orchestrator attaches it.

For a research assignment, create the packet-listed canonical file only when it
contains completed, cited work. Never create an empty placeholder, use a buyer or
source-directory alias as the filename, or omit the matching top-level `slug`.
An absent file honestly represents unfinished research.

## Evidence Handoff

Return this structure:

```text
Assignment: <id>
Asset / gate: <slug> / <gate>
Changed files: <paths or none>
Checks: <command -> result>
Evidence: <repo-relative paths>
Risks: <none or exact unresolved risk>
Recommended transition: review for pass | fail | block | reset
```

Evidence must be repo-relative, exist, and match the assigned asset. Historical
evidence marked `needs_revalidation` is input, not proof of current success.

## Escalate

Use the packet format and include:

```text
Assignment: <id>
Failing check: <exact checklist item or command>
Error: <exact concise error>
Evidence: <path or none>
Recommended next action: <specific action for the orchestrator>
```

Do not improvise around missing credentials, buyer facts, shared imports,
deployment authority, external writes, or unavailable source assets.

## Completion

Stop when all gate work and checks are complete and the evidence handoff is
ready. The orchestrator—not the worker—decides the state transition.
