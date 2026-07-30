---
description: Close an NAI session cleanly — confirm state, report what moved, what is in flight, and the exact next command
allowed-tools: Bash(./nai pipeline validate), Bash(./nai pipeline status), Bash(git status:*), Read, Grep, Glob
---

Produce the session handoff. First confirm canonical truth:

```bash
./nai pipeline validate
./nai pipeline status
git status --short | head -40
```

Then report:

1. **State** — revision, site records, active assignments, blockers, quarantined.
2. **What moved this session** — per asset: gate before → transition → gate after,
   with the evidence path recorded in state.
3. **In flight** — assignment ids with no accepted transition yet, and what each
   is waiting on.
4. **Awaiting the user** — blockers, authorization requests (deployment, Pitch
   handoff to Hermes, scope changes), each with the precise decision needed.
5. **Untracked/dirty work worth preserving** — anything in the worktree that looks
   like a separate effort, so the next session does not disturb it.
6. **Exact next command** — the single `./nai ...` command the next session should
   run first.

Do not summarize state as if your report were canonical: `NAI_STATE.json` is the
truth and `CHIEF_OF_STAFF.md` is its generated view. Change nothing in this
command.
