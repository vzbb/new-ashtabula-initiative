---
description: Independently review a returned NAI worker handoff and apply exactly one pipeline transition
argument-hint: <assignment-id> [worker handoff or notes]
allowed-tools: Bash(./nai pipeline:*), Bash(git diff:*), Bash(git status:*), Bash(python3 -m json.tool:*), Read, Grep, Glob, Skill
---

Load the `nai-orchestration-session` skill, then review: **$ARGUMENTS**

1. Regenerate the packet (`./nai pipeline context --assignment <id>`) and re-read
   the acceptance checklist and required checks.
2. Verify the work yourself — the worker's recommendation is input, not a
   decision:
   - read the actual patch (`git diff -- <source-dir>`) and confirm it is
     source-only and inside the write allowlist;
   - open every evidence path the handoff names and confirm it concerns this slug;
   - parse any JSON deliverable and confirm the canonical filename and top-level
     `slug`;
   - confirm each required check was actually run, with its real result.
3. Reject on sight: "done" with no evidence, a green build offered as
   verification, a screenshot offered as proof of an interaction, placeholder or
   uncited research, evidence for a different slug, or edits outside the
   allowlist.
4. Apply exactly one transition, using the smallest recovery that fits
   (`pass` / `fail` / `retry` / `reassign` / `block` / `reset` / `quarantine`),
   with a precise reason and evidence paths.
5. Confirm with `./nai pipeline validate && ./nai pipeline status`, then report:
   what moved, the new gate, evidence recorded, and the next eligible work. If the
   asset now sits at Pitch, report eligibility and stop — Hermes owns Pitch.
