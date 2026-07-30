---
description: Bootstrap an NAI orchestration session — validate canonical state and report the real next eligible work
allowed-tools: Bash(git status:*), Bash(./nai pipeline validate), Bash(./nai pipeline status), Bash(./nai scan), Bash(./nai tooling), Read, Grep, Glob, Skill
---

Load the `nai-orchestration-session` skill and perform the bootstrap.

Run, in order, and read the output rather than any document's claims:

```bash
git status --short | head -40
./nai pipeline validate
./nai pipeline status
./nai scan
./nai tooling
```

Then report concisely:

- state revision, public site records, active assignments, blockers, quarantined;
- gate distribution and anything in `needs_revalidation`;
- whether `pipeline validate` is clean, and if not, the exact error and the asset
  it concerns;
- the specific next eligible work, with the canonical slug and its current gate;
- anything in the dirty worktree that looks like another effort in progress and
  must be preserved.

Do not assign, build, deploy, or edit anything in this command. End by proposing
the single next assignment you would create, and wait for the user.
