# The Claude Code Orchestration Layer

What this directory adds, and why each piece exists. Nothing here replaces
canonical NAI protocol: `.agents/skills/nai-mvp-orchestrator/SKILL.md` and
`.agents/skills/nai-mvp-worker/SKILL.md` remain the authority, `TO_CLAUDE.md` the
operating manual, and `./nai` the only control surface. This layer is *harness
wiring* — it makes Claude Code behave like a disciplined NAI orchestrator by
default instead of relying on a human pasting rules each session.

## Contents

| Path | Role |
| --- | --- |
| `../CLAUDE.md` | Always-loaded contract: non-negotiables, canonical truths, the loop, gate evidence bars, shared-API and n8n boundaries |
| `skills/nai-orchestration-session/SKILL.md` | How to run a long-horizon session here: bootstrap → select → assign → delegate → review → transition → handoff |
| `skills/nai-mvp-orchestrator`, `skills/nai-mvp-worker` | Symlinks to the canonical `.agents/skills/` protocols so Claude Code skill discovery finds them without a divergent copy |
| `agents/nai-research-worker.md` | Research gate: cited buyer research at `lead_research_json/<route-slug>.json`, never a placeholder |
| `agents/nai-brandkit-worker.md` | Brandkit gate: buyer-specific decisions, asset provenance, valid JSON |
| `agents/nai-implementation-worker.md` | Implementation gate: source-only change plus focused build/screenshot evidence |
| `agents/nai-verification-worker.md` | Verification gate: independent, read-only w.r.t. product source, both-sides evidence |
| `agents/nai-diagnostician.md` | Read-only triage; writes nothing, runs no mutating command |
| `agents/nai-shared-maintenance.md` | Orchestrator-owned shared scope (`shared/`, `nai_suite/`, landing, tooling) with consumer builds |
| `commands/nai-bootstrap.md` | Session start: validate state, report the real next eligible work |
| `commands/nai-assign.md` | Create one durable assignment and delegate it to the gate's subagent |
| `commands/nai-review.md` | Independently review a handoff, then apply exactly one transition |
| `commands/nai-cycle.md` | One full cycle across independent assets, in parallel, with a ledger |
| `commands/nai-diagnose.md` | Bounded read-only triage through the diagnostician |
| `commands/nai-handoff.md` | Clean session close: what moved, what's in flight, exact next command |
| `settings.recommended.json` | Proposed permission ruleset — **not active**, see below |
| `install-nai-claude-layer.sh` | Idempotently creates the skill symlinks |

## Design decisions

**No Pitch agent exists, deliberately.** Hermes owns the Pitch gate. There is no
subagent to assign, so the cheapest path is also the compliant one. Claude may
report that verification made Pitch eligible; eligibility is not authorization.

**No deploy agent exists, deliberately.** Deployment is a user-authorized
orchestrator action (`./nai deploy --confirm-production`). Workers never deploy.

**One agent per gate, not one agent per site.** Gates carry the evidence bar and
the read/write boundary; sites do not. The packet from
`./nai pipeline context --assignment <id>` supplies the site-specific detail, so
adding a site never requires a new agent.

**Agents restate boundaries the packet already carries.** Redundant on purpose:
policy is the only write isolation NAI has, and the filesystem is broader than the
policy. An agent definition is enforced by the harness at spawn time (tool
allowlists), while the packet is enforced by the model's compliance. Both.

**The diagnostician exists to protect the orchestrator's context and the tree.**
Noisy investigation (which slug maps where, why a route is blank, whether an old
report still holds) burns context and tempts drive-by fixes. It returns findings
only and has no `Write`/`Edit` tools at all.

**Skills are symlinks, not copies.** `.agents/skills/` stays canonical; a copy
would drift and there would be two contradicting contracts.

## Permissions: `settings.recommended.json`

Claude cannot write `.claude/settings.json` — the permission classifier refuses
it, including under `/update-config`, because that file governs Claude's own
permissions. An agent that can widen its own authority has none. **Apply it
yourself:**

```bash
cp .claude/settings.recommended.json .claude/settings.json   # then remove the _comment key
```

The ruleset separates *supported tooling* from *manual mutation*:

- **allow** — the full `./nai pipeline` surface, including the canonical
  transitions (`assign`, `context`, `pass`, `fail`, `retry`, `reassign`, `block`,
  `unblock`, `reset`, `quarantine`), plus `scan`, `tooling`, focused
  `build --slugs` / `screenshots --slugs` / `analyze-screenshots`,
  `sitemap-validate`, and read-only git. State *is* meant to change — through the
  supported control surface, dozens of times a session, without a prompt.
- **ask** — `./nai deploy` (user-authorized per deploy), `git commit`,
  `git push`, generic `git checkout`, `git add` of specific paths, route/sitemap
  regeneration, `clone-mvp`, `fix-bases`, `render-all-mvps`, live production
  screenshots, and `rm`/`mv`.
- **deny** — every form of mass tree mutation (`git reset --hard`, `git clean`,
  `git stash`, `git restore`, `git checkout --`, `git add -A`, `git commit -a`,
  force push in any flag position, `rm -rf`), direct Edit/Write of generated or
  canonical files (`NAI_STATE.json`, `CHIEF_OF_STAFF.md`, `SITEMAP.md`,
  `NAI_TOOLCHAIN.md`, `vercel.json`, `.vercel/**`), and Read of the
  secret-bearing env files. Path rules are written project-root-relative
  (`Edit(/NAI_STATE.json)`) so they anchor to the repository root rather than
  matching a same-named file anywhere.

The distinction that matters: the deny rules block the **Edit/Write tools** on
generated files; they do not touch `./nai pipeline`, which is how those files are
legitimately regenerated. Blocking the artifact, not the pipeline.

### What these rules are, and are not

These are **workflow guardrails on Claude's built-in tools** — they make the
wrong move require a deliberate step instead of happening by reflex. They are
**not** OS-level isolation:

- `Read(/.env)` stops the Read tool. It does not stop a Bash subprocess —
  `cat .env`, `grep -r KEY .`, `python3 -c "open('.env')"`, or a build script
  that prints the environment all read the same bytes. Bash rules match command
  strings, and no practical pattern list closes that surface.
- Likewise, `Edit(/NAI_STATE.json)` stops the Edit tool, not
  `python3 -c "open('NAI_STATE.json','w')"`.

So the real protection for secrets and canonical state is the policy in
`CLAUDE.md` plus review of what Claude actually runs — the permission rules just
remove the easy accidents. Treat any command that reads or writes those paths as
requiring the same scrutiny whether or not a rule names it. Genuine isolation
would need OS-level sandboxing, which this layer deliberately does not configure.

`git stash` is denied because the stash stack is shared across worktrees and other
agents; a WIP commit on a branch is the safe alternative. Existing
`.claude/settings.local.json` (personal, untracked) is left untouched.

## Installing / verifying

The two skill symlinks are committed, so a fresh clone needs nothing. Run the
installer only to repair them (it is idempotent and refuses to overwrite a real
directory):

```bash
cd /root/new-ashtabula-initiative
bash .claude/install-nai-claude-layer.sh
claude                                     # then: /nai-bootstrap
```

Verify discovery inside a session: `/help` lists the `nai-*` commands, and the
`nai-orchestration-session`, `nai-mvp-orchestrator`, `nai-mvp-worker` skills are
available. If a piece is missing, restart the session before concluding the wiring
is wrong.

## What this layer deliberately does **not** add

No scheduler, no second state store, no kanban, no hook that mutates the repo, no
autonomous deploy, no outreach path, and no bulk fixer. `NAI_STATE.json` plus
`./nai pipeline` is the control system; this layer only helps Claude use it well.
