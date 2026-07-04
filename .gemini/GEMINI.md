# Gemini CLI Guide for NAI

This file is a **project-specific supplement** for Gemini agents working in the New Ashtabula Initiative monorepo. It does not override higher-level Gemini, system, or platform instructions. Its job is to keep heavy MVP work focused, consistent, and easy to verify.

## What This Repo Is

- One landing page.
- Many independent MVPs under `websites/`.
- Shared helpers for route generation, screenshot analysis, and deployment.
- A single route source of truth in `SITEMAP.json`, with `SITEMAP.md` rendered for humans and agents.
- A single workflow entrypoint in `nai`.

## Canonical Sources

Read these first:

1. `README.md`
2. `AGENTS.md`
3. `MONOREPO_PROTOCOL.md`
4. `WORKFLOW.md`
5. `SESSION_HANDBOOK.md`
6. `SITEMAP.json`
7. rendered `SITEMAP.md`
8. `visual_report_summary.py`
9. `sitemap_screenshots/visual_analysis_report.json`
10. `lead_research_json/`
11. `brandkits/`
12. `ARTIFACT_PIPELINE.md`

The `lead_research_json/` directory contains JSON research files for lead/brand decisions on MVPs that still need target work. It is being populated over time, but it already contains enough research to move several MVPs forward now. When you need brand or buyer context, check that directory before inventing a target from scratch.

The `brandkits/` directory contains JSON brandkit files for MVPs whose target lead/brand has already been researched. These files should contain the real branding direction for the selected target, including colors, styles, and other identity cues. The brandkit is usually derived from the top one or two candidate targets in the corresponding research JSON file. Treat this directory as the practical handoff from research into implementation.

`ARTIFACT_PIPELINE.md` defines the canonical dependency chain, generation order, and where the asset layer fits into the workflow. Read it before starting a parallel sprint.

## How To Use Research And Brandkits

Use the two directories together in this order:

1. Check `lead_research_json/` to identify the strongest real-world target lead or buyer for the MVP.
2. Check `brandkits/` for the matching brand direction, if one already exists.
3. If the brandkit exists, use it to guide colors, styling, typography, and identity cues.
4. If the brandkit does not exist yet, use the research JSON to decide whether the MVP is ready for branding work or still needs more research.
5. Do not invent a buyer or brand direction when the research files already say the target is unclear.

This is the intended flow:

`visual analysis -> lead research -> brandkit -> source implementation`

Use those files before relying on memory, prior agent notes, or tracker output.

## Top Priority MVPs

Work the most urgent sites first. The current priority targets are:

- `site-ops-pro` -> **Brobst Earthworks, LTD** (with Wilkinson Paving & Excavating as the later white-label / clone candidate)
- `terra-vantage` -> **Severino Construction** (keep it open to later white-label / clone candidates; do not close off the modular path)
- `compassionate-planner` -> **Ducro Funeral Services** with **Legacy Link** as the tool name

If a target lead is already known, keep the slug unchanged and brand the page for that lead.
Do not rename routes unless the route itself is broken.

## Working Rules

- Fix one MVP at a time unless the issue is shared across multiple sites.
- Prefer source fixes in `websites/<site-name>/`.
- Put shared fixes in shared helpers, not copy-pasted into many apps.
- Treat generated output as derived, not source.
- Keep the work small, verifiable, and reversible.
- Commit a coherent unit of work when it is finished.
- Prefer email prospect files for outreach planning because email scales better than phone-first workflows.
- If a lead has no strong personal business-domain website of its own, treat it as a potentially higher-conversion sales candidate.

## What “Done” Means

A site is only done when both of these are true:

1. The product works cleanly.
2. The branding clearly matches a real target buyer.

If the brand is clear but the product is broken, it is not done.
If the product is strong but the buyer is vague, it is not done.

If one MVP can honestly serve multiple qualified buyers, you may recommend cloning and rebranding, but do not auto-clone unless the task explicitly asks for it.

## Use the Analysis Reports

Use the visual analysis tools to decide what to work on next:

- `design_score_10 < 5` usually means real UI/code repair is needed.
- `branding_status = unbranded` or `partial` means target/buyer work is still needed.
- `target_brand_status = needs_research` means the brand target is still unclear.

Use `visual_report_summary.py` to find the current deep-help queue before editing anything.

## Recommended Workflow

1. Check the site summary and current report.
2. Pick one site and one goal.
3. Make the smallest source change that actually solves the problem.
4. Build the affected site.
5. Verify it in the browser.
6. If the change is branding-related, confirm the title, hero, metadata, and visible UI all agree.
7. If the change affects routing, regenerate the route table with `./nai routes`.
8. If the change is ready to ship, use `./nai deploy --confirm-production`.

## Visual Verification

For visual work:

- Use `./nai screenshots` for the local gallery.
- Use `./nai screenshots --live` when you need the public Vercel URLs.
- Use `./nai analyze-screenshots` for the full gallery analysis.
- Use `./nai branding-pass --slugs <slug ...>` when you only need branding/target refinement for a small set.
- Use `./nai focus-analyze --slugs <slug ...>` when you want a narrow deep pass on just a few sites.

## Editing Rules

- Do not edit generated `dist/` output by hand.
- Do not treat `.vercel/` or `node_modules/` as source.
- Do not change slugs unless explicitly instructed.
- Do not rely on stale agent notes when the live screenshots or report disagree.
- Do not overcomplicate branding logic in code when the model and the screenshot already tell the truth.

## Handoff Standard

When you finish a task, leave a short handoff that says:

- what changed
- what was verified
- what still needs work

Keep the handoff specific. Future agents should be able to continue from it without re-reading the whole repo.
