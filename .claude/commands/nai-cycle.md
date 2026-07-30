---
description: Run one full NAI orchestration cycle over independent assets — assign, delegate in parallel, review, transition, report
argument-hint: [slugs or count, e.g. "hvac lawn notary" or "3 research"]
allowed-tools: Bash(./nai pipeline:*), Bash(./nai scan:*), Bash(./nai build:*), Bash(./nai screenshots:*), Bash(./nai analyze-screenshots:*), Bash(git diff:*), Bash(git status:*), Read, Grep, Glob, Skill, Agent
---

Load the `nai-orchestration-session` skill and run one complete cycle over:
**$ARGUMENTS** (if empty, pick the next eligible independent assets from
`./nai pipeline status`).

Rules for this cycle:

- Bootstrap first (`./nai pipeline validate && ./nai pipeline status`). If
  validation fails, stop and report instead of assigning.
- Only **independent assets** run in parallel — one gate, one worker, one attempt
  per asset. Never two write-heavy workers on one MVP, never implementation and
  verification on the same build, never a site worker in `shared/`, `nai_suite/`,
  state, routes, or landing.
- Create a real assignment per asset (`./nai pipeline assign`), print each packet
  (`./nai pipeline context`), and launch the gate-matching subagents in a single
  message so they run concurrently.
- Keep a ledger in your reply: assignment id → asset/gate → subagent → status.
- As each handoff returns, review the patch and evidence yourself, then apply
  exactly one transition. One asset's failure must not touch another asset.
- Stop any asset that reaches Pitch and report eligibility — Hermes owns Pitch.
- Never deploy in this cycle.

Close with `./nai pipeline validate && ./nai pipeline status` and a per-asset
report: gate before → transition → gate after, evidence path, and the next
eligible gate. List anything blocked on a user decision separately.
