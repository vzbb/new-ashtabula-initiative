# NAI Project Supplement for Agents

This file is **project-specific guidance only**. It does not replace or override any higher-level agent instructions, system prompts, or platform policies. It exists to keep work on the NAI monorepo consistent and low-risk.

## What This Repo Is

NAI is a monorepo with:

- one landing page
- many independent MVP websites under `websites/`
- shared helper code for routing, build normalization, and deployment
- a single canonical route source of truth in `SITEMAP.json`
- a rendered human-readable sitemap in `SITEMAP.md`
- a single workflow entrypoint in `nai`

## Core Rules

- Treat `SITEMAP.json` as the canonical source of truth for live routes.
- Treat `SITEMAP.md` as the human-readable rendered reference.
- Treat generated output (`dist/`, `.vercel/`, build artifacts) as derived, not source.
- Edit only the relevant MVP unless the issue is clearly shared across multiple sites.
- If the issue is shared, fix the shared code once instead of patching every app separately.
- Prefer source-level fixes over deploy-time workarounds.
- Treat product quality and buyer-specific branding as equal first-class goals.
- A site is not done unless it both works well and is clearly branded for a real target buyer.
- If a site can legitimately serve multiple qualified buyers, cloning and rebranding it for each buyer is acceptable.
- Do not revert or overwrite other agents’ unrelated changes.

## Where To Make Changes

- Single MVP UI or logic change:
  - edit that site under `websites/<site-name>/`
- Shared routing/build behavior:
  - edit `siteflow.py`, `update_vercel.py`, or `screenshots_sitemap.py`
- Deployment config:
  - edit `vercel.json`
- Workflow/documentation:
  - edit `nai`, `README.md`, or `WORKFLOW.md`
- MVP retirement / decommission:
  - follow [REPO_GOVERNANCE_AND_DECOMMISSION_PLAN.md](REPO_GOVERNANCE_AND_DECOMMISSION_PLAN.md)
  - remove the route, source folder, docs, screenshots, and any stale tracker references together

## One-MVP Workflow

1. Identify the route in `SITEMAP.json` or the rendered `SITEMAP.md`.
2. Map the route to the correct folder in `websites/`.
3. Read only the minimum upstream inputs needed for your task.
4. Make the smallest source change that solves the actual problem.
5. Treat settled research, brandkit, and asset artifacts as inputs unless your assignment is explicitly to revise them.
6. Escalate to the coordinator only if the upstream inputs are missing, stale, or contradictory.
7. Build or test only the affected site unless shared code changed.
8. If the route map changed, run `./nai routes`.
9. If you need a full publish, run `./nai deploy`.
10. If you need visual verification, run `./nai screenshots`.

## Build And Deploy Rules

- Use `./nai scan` to inspect site status before changing anything major.
- Use `./nai routes` to regenerate `vercel.json` after route changes.
- Use `./nai deploy` for the standard production path.
- Do not hand-edit built files to “fix” a page.
- Do not assume `node_modules/` folders are sites.
- If you need durable project memory, use [MEMORY_PROTOCOL.md](MEMORY_PROTOCOL.md)
  and the Mem0 MCP layer rather than inventing a new memory format.
- Treat `new-ashtabula-initiative` as the stable Mem0 `user_id`, and use a
  stable role-specific `agent_id` when writing or reading memory.

## Commit And Push Rules

- When a coherent change is finished and verified, commit it.
- Push after the commit so the repo stays in sync and recoverable.
- Keep commits focused: one site, one shared fix, or one workflow update when possible.
- Do not commit half-finished exploratory work unless you need a checkpoint.
- If the work affects multiple sites, mention that in the commit message.
- If you are unsure whether the change is complete, verify first rather than pushing a guess.

## Collaboration Rules

- Assume other agents may be editing adjacent sites at the same time.
- Keep your write scope narrow and explicit.
- If you encounter a conflict with another agent’s change, adapt around it instead of reverting it.
- Leave the repo in a state where the next agent can understand what changed and why.

## Good Defaults

- Reuse shared helpers when possible.
- Preserve existing site-specific behavior unless the task is explicitly a redesign.
- Keep deployment changes minimal and reversible.
- Favor clarity over cleverness.

## If Something Looks Broken

- Blank route: check `vercel.json`, the built `dist/index.html`, and the live route target.
- Missing site: check `SITEMAP.json` and the `websites/` folder name.
- Build failure: fix the source app first, then rebuild.
- Weird deploy behavior: run `./nai deploy` rather than relying on legacy helper scripts.

## References

- [README.md](README.md)
- [SESSION_HANDBOOK.md](SESSION_HANDBOOK.md)
- [MONOREPO_PROTOCOL.md](MONOREPO_PROTOCOL.md)
- [WORKFLOW.md](WORKFLOW.md)
- [SITEMAP.json](SITEMAP.json)
- [SITEMAP.md](SITEMAP.md)
- [nai](nai)
- [siteflow.py](siteflow.py)
