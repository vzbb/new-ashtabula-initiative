---
description: Create one durable NAI assignment for a slug's current eligible gate and delegate it to the matching subagent
argument-hint: <slug> [gate] [objective notes]
allowed-tools: Bash(./nai pipeline:*), Bash(./nai scan:*), Read, Grep, Glob, Skill, Agent
---

Load the `nai-orchestration-session` skill, then assign work for: **$ARGUMENTS**

1. Resolve the canonical slug and its **current eligible gate** from
   `./nai pipeline status` and `SITEMAP.json` / `./nai scan`. If the user named a
   gate that is not the current eligible gate, say so and stop — do not skip
   prerequisites. If the gate is `pitch`, stop: Hermes owns Pitch.
2. Confirm there is no conflicting active assignment, and that prerequisite
   evidence for the gate actually exists and is real (not a placeholder).
3. Create exactly one assignment with a specific, durable objective and concrete
   deliverables:

   ```bash
   ./nai pipeline assign --asset <slug> --gate <gate> \
     --objective "<...>" --deliverable "<...>" [--deliverable "<...>"] \
     [--shared-read <path>]
   ```

   Add `--shared-read` only for genuinely needed shared contracts (read-only).
4. Print the packet with `./nai pipeline context --assignment <id>`.
5. Delegate it to the gate-matching subagent (`nai-research-worker`,
   `nai-brandkit-worker`, `nai-implementation-worker`, `nai-verification-worker`)
   with the standard framing plus the literal packet.
6. Report the assignment id, asset, gate, subagent, and what you will check when
   its handoff arrives. Do not pass the gate here.
