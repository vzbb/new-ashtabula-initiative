# Session Handbook

This file captures the current working truth for the New Ashtabula Initiative repo so future agents can pick up the project quickly and work at full depth without re-deriving the basics.

## Current Truth

- `SITEMAP.json` currently defines 74 public routes.
- 74 of those routes are currently backed by source folders and build output.
- the canonical route map has been scrubbed of retired ghost entries that no longer have source folders.
- `SITEMAP.json` is the canonical route source of truth.
- `SITEMAP.md` is the rendered human-readable route reference.
- `./nai` is the workflow entrypoint for scan, routes, deploy, screenshots, browse, and analysis tasks.
- `lead_research_json/` contains the research JSON files for lead, buyer, and brand decisions.
- `brandkits/` contains JSON brandkit files derived from the research.
- `sitemap_screenshots/visual_analysis_report.json` is the current visual QA source for product quality and branding status.

## Sprint Outcome

Today's sprint materially advanced a large batch of MVPs and completed a strong flagship wave.

Flagship wave completed:
- `ai-docent-pro`
- `pocket-historian-pro`
- `pocket-sommelier-pro`
- `ashtabula-fence`
- `thomas-fence`
- `snow-plow-tracker`
- `event-permit-express`

Other MVPs that were materially improved earlier in the same sprint run include:
- `roofquote`
- `fence-quote`
- `site-ops-pro`
- `parcelvisor`
- `wedding-lead-form`
- `charter`
- `rental`
- `civic-insight`
- `boxflow`
- `ride-ready`
- `pet-match`
- `permit-whisperer`
- `aidflow-navigator`
- `boat-storage-waitlist`
- `marina-slip-waitlist`
- `hvac`
- `truck-wash`
- `policy-pal`
- `aidflow`
- `auto-detail`
- `curbside`
- `eligibility`
- `grocer`
- `harbor`
- `landlord`
- `lawn`
- `notary`
- `scheduler`
- `dirt-quote`
- `portfolio`
- `zoning`
- `volunteer`
- `rennick-market`
- `terra-vantage`
- `trumbull-locker`

Known parked item:
- `insta-book`

Next phase:
- batch build/deploy
- live verification
- canonical doc cleanup

Known canonical drift:
- fence mapping language in `SITEMAP.md` still needs tightening so the early table matches the later target ledger

## How To Work On A Site

1. Start with `README.md`, `AGENTS.md`, `MONOREPO_PROTOCOL.md`, `WORKFLOW.md`, `SITEMAP.json`, and `SITEMAP.md`.
2. Check the current research and brandkit JSON for the target slug.
3. Make the smallest source change in `websites/<site-name>/`.
4. Build the site and verify it in the browser.
5. If the route map changed, run `./nai routes`.
6. If the change is ready to publish, run `./nai deploy`.
7. If the change is visual or branding-related, re-run `./nai screenshots` or `./nai analyze-screenshots` as needed.

## Canonical Mapping Rule

Each MVP should have a simple, explicit mapping from slug to target entity.

Use this chain of truth:

`SITEMAP.json` -> rendered `SITEMAP.md` -> `lead_research_json/<slug>.json` -> `brandkits/<slug>.json` -> `websites/<site-name>/`

For the full artifact dependency graph, generation order, and asset layer guidance, see [ARTIFACT_PIPELINE.md](ARTIFACT_PIPELINE.md).

If the target entity is already concrete, keep the slug unchanged and brand the site for that entity.
If the target is still unclear, mark it as needing research instead of inventing a buyer.
Use one primary target per narrow private MVP unless the research explicitly supports a clone/white-label phase.
Municipal, county, and other shared-body projects may reuse the same primary target when that is the correct buyer.

## High-Priority Known Targets

- `compassionate-planner` -> Ducro Funeral Services, with Legacy Link as the tool name
- `terra-vantage` -> Severino Construction, with Terra Vantage as the proprietary tool name and with later white-label / clone candidates intentionally left open
- `site-ops-pro` -> Brobst Earthworks, LTD, with Wilkinson as the later white-label / clone candidate
- `fence-quote` -> Miller's Integrity Construction LLC, with only distinct third-party fence buyers as future clone candidates (not Ashtabula Fence Co. or Thomas Fence Co., since those already have their own MVPs)
- `farm-stand` -> Ashtabula Farmers Market, with Harbor Gardens / 2140 Farm Market as secondary candidates

## Practical Rules

- Treat product quality and buyer-specific branding as equal goals.
- Use the research JSON to choose the target.
- Use the brandkit JSON to drive colors, typography, and visual identity.
- Prefer email prospect data for outreach planning because it scales better than phone-first workflows.
- When a lead has no strong personal business-domain website of its own, treat it as a potentially higher-conversion sales candidate.
- Brobst Earthworks is a valid relationship lead, but never the default center of the target map.
- Keep slugs stable unless there is a routing problem.
- Do not overcomplicate the process with extra manual metadata if the research and brandkit files already answer the question.

## What To Avoid

- Do not edit generated `dist/` output by hand.
- Do not invent a target entity when the research says the answer is unresolved.
- Do not spread one shared fix across many apps when a shared helper is the right place.
