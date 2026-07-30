---
name: nai-orchestration-session
description: Run a long-horizon NAI orchestration session in Claude Code — bootstrap canonical state, select the next eligible gate, create durable assignments, delegate to the gate-specific subagents, review evidence, transition state, and hand off cleanly across sessions. Use at the start of any NAI pipeline work, when resuming a session, or when asked to advance sites, batch work across assets, or report portfolio status.
---

# NAI Orchestration Session (Claude Code)

This is the Claude Code harness wrapper. The authority contract is
[`.agents/skills/nai-mvp-orchestrator/SKILL.md`](../../../.agents/skills/nai-mvp-orchestrator/SKILL.md)
and the worker contract is
[`.agents/skills/nai-mvp-worker/SKILL.md`](../../../.agents/skills/nai-mvp-worker/SKILL.md).
Those files win any conflict; `TO_CLAUDE.md` is the operating manual. This skill
only says how to run the loop *here*.

## 1. Bootstrap (every session, before any decision)

```bash
git status --short | head -40
./nai pipeline validate
./nai pipeline status
./nai scan
./nai tooling
```

Then state, in your own words: state revision, site-record count, active
assignments, blockers, quarantine, and the specific next eligible work. Never
quote a revision or count from a Markdown file — those go stale.

If `pipeline validate` fails, stop and diagnose before assigning anything. A
validation error about a research artifact means that file is empty, malformed,
misnamed, uncited, or slug-mismatched — never "improve" it with placeholder text.

## 2. Choose work

Priority order: the user's explicit instruction → an in-flight assignment that
needs review → `needs_revalidation` / failed gates the user has scoped →
`./nai pipeline status` next-eligible.

Before assigning, confirm all five:

1. the canonical slug (from `SITEMAP.json` / `./nai scan`, not a guess);
2. its current eligible gate (never inferred from request wording, a filename, or
   an agent's name);
3. no conflicting active assignment on that asset;
4. required prerequisite evidence actually exists and is real;
5. whether the work touches shared code, routes, deployment, or n8n — if so it is
   orchestrator-owned, not a site assignment.

When any of these is unclear, spawn `nai-diagnostician` (read-only) rather than
investigating in this context or guessing.

## 3. Assign

```bash
./nai pipeline assign \
  --asset <canonical-slug> \
  --gate <current-eligible-gate> \
  --objective "<specific, durable, checkable objective>" \
  --deliverable "<required artifact or outcome>" \
  --deliverable "<second required artifact or outcome>" \
  [--shared-read SHARED_OPENROUTER_API.md --shared-read shared/api-client.js]
```

Write objectives a stranger could check months later: name the buyer, the
behavior, the file, the endpoint. `--shared-read` grants **read** only; shared
writes are a separate maintenance scope. `--worker <id>` is audit metadata only —
it grants nothing and never selects the gate.

## 4. Delegate

One asset, one gate, one attempt, one worker. Map the gate to a subagent:

| Gate | Subagent |
| --- | --- |
| research | `nai-research-worker` |
| brandkit | `nai-brandkit-worker` |
| implementation | `nai-implementation-worker` |
| verification | `nai-verification-worker` |
| pitch | **none — Hermes owns Pitch. Stop.** |
| triage / mapping question | `nai-diagnostician` (read-only) |
| shared/ nai_suite/ landing/ tooling defect | `nai-shared-maintenance` (explicit scope) |

Prompt body = framing + the literal packet:

```bash
./nai pipeline context --assignment <assignment-id>
```

```text
Use the nai-mvp-worker skill to complete this single NAI assignment.

Follow the context packet exactly. Work on one asset, one gate, one attempt. Do
not inspect other sites, modify canonical state, alter shared infrastructure
outside the allowlist, deploy, publish, send outreach, or contact another worker.
Return the required structured handoff to the orchestrator.

<packet>
```

The packet — not conversation history — is the durable work order. Regenerate it
instead of paraphrasing it. If the user's clarification changes asset, gate,
deliverables, or boundaries, stop the attempt and `reassign` with a new packet.

### Parallelism

Parallelize **independent assets** only: research on A, implementation on B,
verification on C. Never two write-heavy workers on one MVP; never implementation
and verification on the same changing build; never a site worker inside `shared/`,
`nai_suite/`, state, routes, or landing. Spend cheap models on bounded work and
your own reasoning on gate decisions, ambiguous failures, and evidence review.

Launch independent workers in one message so they run concurrently, and keep a
short ledger in this session: assignment id → asset/gate → subagent → status.

## 5. Review evidence yourself

Require the handoff:

```text
Assignment / asset / gate / Changed files / Checks (command -> result) /
Evidence paths / Risks / Recommended transition
```

Then verify independently — the worker's recommendation is input, not a decision:

```bash
git status --short <source-dir>
git diff -- <source-dir>          # read the actual patch
```

- Research: correct canonical filename, matching top-level `slug`, assigned
  buyer, substantive content, real citations. Parse the JSON.
- Brandkit: buyer-specific decisions, asset provenance, valid JSON, real notes.
- Implementation: source-only diff, focused build success, correct base/route, no
  leaked parent identity, primary interaction demonstrated.
- Verification: both sides of every AI/interaction claim, error states, console
  and network results, buyer-factual quality.

Reject: "done", a green build offered as verification, a screenshot offered as
proof of interaction, an old report, or evidence for a different slug. Placeholder
research is a `fail`, never a `pass`.

## 6. Transition, then confirm

```bash
./nai pipeline pass --assignment <id> --evidence <path> [--evidence <path>]
./nai pipeline fail --assignment <id> --reason "<precise failure>" --evidence <path>
./nai pipeline retry --asset <slug>
./nai pipeline reassign --asset <slug> --gate <same-gate> --reason "<reason>"
./nai pipeline block --asset <slug> --reason "<external dependency>"
./nai pipeline unblock --asset <slug>
./nai pipeline reset --asset <slug> --gate <earliest-invalid-gate>
./nai pipeline quarantine --asset <slug> --reason "<reason>"
```

Smallest recovery that fits: `fail` (this attempt) < `retry` (same scope, new
attempt) < `reassign` (new worker/clean handoff) < `block` (real external missing
fact, credential, authorization, asset) < `reset` (an earlier accepted premise is
invalid) < `quarantine` (retries would waste work, or the asset/template is
unsafe).

After every transition:

```bash
./nai pipeline validate
./nai pipeline status
```

`CHIEF_OF_STAFF.md` is regenerated by these commands — never edit it.

## 7. The Pitch stop

When verification is accepted, Pitch becomes *eligible*. Report that to the user
or the Hermes operator and **stop**. Do not assign a Pitch worker, write or
rewrite outreach, advance/fail/reset Pitch, or contact a prospect without a new
explicit user instruction that overrides this. Preserve existing Pitch evidence.

## 8. Deployment

Only on explicit user authorization for that deploy:

```bash
./nai deploy --confirm-production
./nai screenshots --live --slugs <slug>
./nai analyze-screenshots --quality deep --slugs <slug>
```

Batch coherent release changes; never burn a portfolio-wide deploy to test whether
a small edit compiles. For AI MVPs, exercise the live user action and inspect
console, network status, proxy/provider error body, rendered result, and
image/audio decodability.

## 9. Long-horizon discipline

- **Additive by default.** The tree is intentionally very dirty and holds
  untracked canonical work. Never mass-reset, mass-restore, mass-stage, format,
  or clean. Never bare `git stash`.
- **One control system.** No scheduler, no second state store, no kanban. If
  something feels unrepresentable, that is a state or packet design question for
  the user, not a new tool.
- **Loop, don't sprint.** Per cycle: bootstrap → select → assign → delegate →
  review → transition → report. Report each completed cycle in one short block
  (asset, gate, transition, evidence path, next eligible gate) so the user can
  follow across sessions.
- **Session handoff.** End with: current revision, what moved, what is in flight
  (assignment ids), blockers awaiting a user decision, and the exact next command
  you would run. State is in `NAI_STATE.json` — never in your summary.
- **Escalate precisely.** A blocker names the exact failed check, exact error,
  evidence path, and recommended action. When in doubt, stop before widening
  scope.
