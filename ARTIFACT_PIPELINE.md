# Artifact Pipeline

This document defines the canonical order of data, research, branding, implementation, and verification for the New Ashtabula Initiative.

Use it when you are:
- starting a new MVP
- refining an existing MVP
- preparing a white-label / clone pass
- coordinating multiple agents across research, branding, and implementation

## Canonical Order

```text
SITEMAP.md
  -> lead_research_json/<slug>.json
  -> email_prospects/<slug>_emails.json
  -> brandkits/<slug>.json
  -> branding_research/<slug>/branding.md
  -> branding_research/assets/*
  -> websites/<site-name>/
  -> build / deploy
  -> sitemap_screenshots/
  -> visual_analysis_report.json
  -> feedback into research / brandkit
```

The order matters:
- `SITEMAP.md` tells you which MVP exists, what its current target is, and whether it is a primary or clone candidate.
- `lead_research_json/` answers who the MVP should be for.
- `email_prospects/` answers who to contact and how.
- `brandkits/` translates the target decision into visual direction.
- `branding_research/` stores the actual assets and brand notes used to implement that direction.
- `websites/<site-name>/` is the implementation layer.
- `sitemap_screenshots/` and `visual_analysis_report.json` are the verification layer.

## File Roles

### `SITEMAP.md`
The human-readable ledger for the whole project.

It should answer:
- what sites exist
- what their routes are
- who the primary target is
- which targets are clone / white-label candidates
- which sites are already dedicated MVPs and should not be reused as clone candidates for another MVP

### `lead_research_json/<slug>.json`
The target research file for a single MVP.

It should answer:
- who the best lead is
- why that lead fits
- what the branding quality currently looks like
- whether the MVP is generic, partial, or already branded
- whether the site is a good white-label candidate later

Canonical keys commonly include:
- `mvp`
- `run_timestamp_utc`
- `visual_analysis_report_path`
- `summary`
- `leads`
- `branding_quality_assessment`
- `site_improvements`
- `aesthetics_and_layout_notes`
- `whitelabel_potential`
- `action_next`
- `sources`

### `email_prospects/<slug>_emails.json`
The contact / outreach file for a single MVP.

It should answer:
- who to contact
- what email addresses exist
- what phone numbers exist
- what outreach angle to use
- what order to contact prospects in

This file is useful for scaling outreach, but it is not the canonical target decision by itself.

### `brandkits/<slug>.json`
The implementation-ready brand direction file.

It should answer:
- which buyer the site is branded for
- what the visual direction should be
- what the color palette should be
- what the typography should feel like
- what implementation recommendations matter most

Canonical keys commonly include:
- `mvp`
- `generated_at`
- `based_on_research`
- `research_sources`
- `target_buyer_1`
- `target_buyer_2`
- `actual_brand_research`
- `brandkit_for_mvp`
- `implementation_recommendations`

### `branding_research/<slug>/branding.md`
The asset and reference layer for a specific MVP.

This is where the agent should look for:
- logo files
- favicon files
- wordmarks
- brand notes
- visual references
- target-specific implementation hints

Current examples already live here for:
- `compassionate-planner`
- `rennick-market`
- `trumbull-locker`

The top-level `branding_research/manifest.json` maps slug -> brand -> tool name -> asset path and should stay in sync with the assets in that directory.

### `websites/<site-name>/`
The implementation layer.

This is the only layer that should contain the actual MVP source changes:
- `src/`
- `index.html`
- site-local metadata
- site-local assets

If the issue is shared across multiple MVPs, move it into shared helpers or shared guidance instead of copy-pasting it into many sites.

### `sitemap_screenshots/` and `visual_analysis_report.json`
The verification layer.

These files answer:
- did the site actually render correctly?
- does the branding read correctly in the browser?
- does the current implementation still match the target map?

The screenshot gallery should be treated as the current visual truth, not as a design archive.

## Dependency Rules

1. Do not implement a site before the target is known.
2. Do not generate a brandkit before the lead research exists or the target is confidently chosen.
3. Do not choose a clone candidate from a site that already has its own dedicated MVP unless the target map explicitly allows it.
4. Do not treat any external task tracker as canonical metadata.
5. Do not rename a slug unless the route is actually broken.
6. Do not use generated output as source of truth.
7. If the visual analysis and the research disagree, update the artifact that is stale rather than inventing a new target.

## Generation Sequence for a New MVP

1. Confirm the slug in `SITEMAP.md`.
2. Check whether the MVP already has a settled primary target.
3. Refresh or create `lead_research_json/<slug>.json`.
4. Refresh or create `email_prospects/<slug>_emails.json`.
5. Refresh or create `brandkits/<slug>.json`.
6. Populate `branding_research/<slug>/branding.md` and store assets.
7. Implement the site in `websites/<site-name>/`.
8. Build and deploy.
9. Run `./nai screenshots --live`.
10. Run `./nai analyze-screenshots`.
11. If the screenshots disagree with the chosen target or branding, update the stale artifact and repeat.

## Current Practical State

The repo is now in the stage where:
- the target map is largely stabilized
- the research JSON layer exists for many MVPs
- the brandkit layer exists for many MVPs
- the asset layer is still being populated and is the last major implementation input for the remaining branding sprint

That means the next parallel sprint can operate cleanly if agents follow the chain above in order.
