# Coordination

This is the working coordination note for the current NAI monorepo repair effort.

## Active Handoff

- This file is the main working coordination file for my responses and planning.
- [`coordination2.md`](/home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/coordination2.md) is the input/status file from Kimi agents.
- I should read `coordination2.md` before acting, then write updates or decisions back into this file.

## Current Situation

- The live deploy is not fully healthy yet.
- Sites `68-76` are the main problem slice.
- The core symptom is that some built pages are still emitting absolute asset URLs like `/assets/...` instead of the correct site-aware output for the current deploy.
- Some sites also still need runtime fixes so they render a visible UI when the OpenRouter/Gemini key is missing in the browser.

## Working Diagnosis

- `base: './'` in Vite configs is not the root problem by itself.
- A missing `base:` entry is a real problem and should be treated as a mismatch.
- The live blank/empty pages are very likely a stale build / stale deploy issue for part of the site set, not a single universal code bug.
- The deploy must be rebuilt from the current source of truth before we trust the live URLs again.

## Coordination Rules

1. Do not have multiple agents edit the same site files at the same time.
2. Keep app fixes and ClickUp updates separate when possible.
3. Treat build output as derived, not source.
4. Verify the live site after any fix before marking it done.
5. Prefer comments or `in review` status for tasks until live verification passes.

## Suggested Ownership Split

- One agent handles the route/base/build-output mismatch for the affected 68-76 sites.
- One agent handles the blank-page runtime issues in `parcelvisor` and `roofquote`.
- One agent handles ClickUp task updates and status hygiene.
- One agent can keep scanning screenshots and updating the visual analysis report if needed.

## ClickUp State

- Do not mark the affected tasks as `done` yet.
- Use `in review` until the rebuilt live URLs are verified.
- If needed, add a short comment noting the likely root cause and that rebuild/redeploy is in progress.

## Recommended Workflow

1. Inspect the target site folder in `websites/<slug>/`.
2. Verify the Vite config and build output.
3. Fix the source only.
4. Rebuild the affected site or run the repo workflow.
5. Redeploy production.
6. Check the live URL in a browser.
7. Update ClickUp only after the live result matches expectations.

## Notes

- Keep `SITEMAP.md` as the route source of truth.
- Keep `nai` as the main workflow entrypoint.
- Keep generated output and screenshots out of source edits unless the task is specifically about generated artifacts.
- If anything in `coordination2.md` conflicts with this file, I should treat `coordination2.md` as the agent-input stream and reconcile it here.

## Current Live Truth

- I verified `terra-vantage` in Playwright and it renders a full UI, not a blank page.
- I verified `site-ops-pro` in Playwright and it renders a full UI, not a blank page.
- Both live pages currently serve working asset URLs and mount successfully.
- The remaining Kimi note about those two needing a Vite base fix is stale and should not drive new work.
- For decommissioning or retiring MVPs, use [`REPO_GOVERNANCE_AND_DECOMMISSION_PLAN.md`](REPO_GOVERNANCE_AND_DECOMMISSION_PLAN.md) as the canonical playbook.
