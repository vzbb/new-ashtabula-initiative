# Clone Program Protocol

This document defines the safest repeatable workflow for expanding the NAI portfolio through controlled white-label cloning.

The goal is not to spray out duplicates. The goal is to turn a strong parent MVP into a clean, target-specific child MVP without destabilizing the repo.

It is also meant to be a durable restart document. If work pauses and later resumes, this file should explain:

- why the clone program exists
- what changed in the repo to make it realistic
- which parent MVPs are the best candidates
- what the exact implementation path should be
- what has already been decided versus what is still open

## Current Status Snapshot

This protocol was drafted after the repo crossed an important threshold:

- the main MVP portfolio has been materially improved and is no longer mostly broken shells
- the canonical route layer now lives in `SITEMAP.json`
- the hidden MVP index can now be generated from canonical data
- the production deploy path has successfully built and deployed the full current canonical set

At the time of writing:
- canonical route count: `74`
- canonical hidden MVP index generator exists via `./nai render-all-mvps`
- the next major scale opportunity is **clone expansion**, not raw greenfield MVP invention

This file is meant to be the handoff point for that next phase.

## Why This Exists Now

Earlier in the week, the repo was still brittle enough that aggressively adding new MVPs would have been risky. A sloppy clone could have cascaded into route drift, broken deploys, stale docs, or visual QA confusion.

That is no longer the situation.

The repo is now in a meaningfully different state:

- the main portfolio has been materially improved through a successful swarm sprint
- the production deploy path has already proven it can ship the current canonical portfolio cleanly
- `SITEMAP.json` is now the canonical machine-readable route map
- `SITEMAP.md` is now the rendered human-readable reference
- the hidden all-MVP landing-page index is now generated from canonical data
- scan/build/deploy checks are significantly more trustworthy than they were a few days earlier

This does **not** mean the repo is magically self-healing.
It does mean that MVP `#75` can now be treated as a structured engineering workflow instead of an act of faith.

## What Was Accomplished Before This Protocol

This protocol is built on top of a very strong first-phase sprint and several important workflow stabilizations.

### Sprint outcome

The portfolio is no longer mostly weak shells. A large wave of MVPs received real buyer-specific, brand-aware, build-verified improvement.

Important later-wave MVPs that were materially improved:

- `ai-docent-pro`
- `pocket-historian-pro`
- `pocket-sommelier-pro`
- `ashtabula-fence`
- `thomas-fence`
- `snow-plow-tracker`
- `event-permit-express`

Broader set of previously improved MVPs includes:

- `terra-vantage`
- `roofquote`
- `site-ops-pro`
- `parcelvisor`
- `wedding-lead-form`
- `charter-booking`
- `rental`
- `civic-insight`
- `boxflow`
- `ride-ready`
- `pet-match`
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
- `trumbull-locker`

Not every MVP is perfect. That is not the point.
The point is that there is now a substantial pool of strong parents worth cloning from.

### Canonical and tooling improvements

The clone program only makes sense because the repo also gained some important structural safety rails:

- canonical route truth was moved into `SITEMAP.json`
- rendered human route reference now lives in `SITEMAP.md`
- stale routes `ai-docent` and `insta-book-stripe` were retired from the live canonical set
- hidden `landing-page/all-mvps.html` can now be generated from canonical data
- Vite base-path checks were corrected so scan results are less misleading
- the NAI hub and internal suite were reorganized enough to reduce confusion about what is core versus incidental

## Clone Program Thesis

The next phase should not be framed as "invent another 74 MVPs."

It should be framed as:

1. identify high-quality parent MVPs
2. choose strong new target buyers
3. generate child MVPs through a controlled protocol
4. validate them quickly
5. scale the clone program only after the protocol proves itself

That keeps the expansion strategic instead of chaotic.

## Core Principle

The next expansion phase should be a **controlled clone program**, not a fresh round of ad hoc MVP creation.

That means:
- choose clone-worthy parents deliberately
- choose the new buyer before touching code
- create the canonical entry first
- clone only through a standardized workflow
- validate locally before deployment

## Clone-Worthy Parent Criteria

A site is only a valid parent if all of the following are true:

1. The core product flow is already strong.
2. The build/deploy path is clean.
3. The branding can be swapped without rewriting the whole app.
4. The target mapping is clear enough that we know what is parent-specific versus buyer-specific.
5. Research or the canonical target ledger already suggests secondary / clone candidates.

## Strong Initial Parent Candidates

These are the best current first-wave parents for controlled cloning:

- `terra-vantage`
- `site-ops-pro`
- `roofquote`
- `hvac`
- `aidflow`
- `resource-pro`
- `farm-stand`

Use extra caution with the fence family:
- `fence-quote` can produce future clone candidates
- `ashtabula-fence` and `thomas-fence` are already dedicated MVPs and should stay separate

## Parent Selection Notes

### `terra-vantage`

Best overall first parent.

Why:
- strong flow
- explicit secondary-candidate logic already exists
- brandkit already anticipates reuse
- easy to imagine multiple excavation / site-work / field-estimating buyers

### `roofquote`

One of the cleanest white-label business models in the repo.

Why:
- quote flow is naturally reusable
- buyer-specific differentiation is largely brand, service area, trust language, and offer framing
- research already supports white-label potential

### `hvac`

Strong candidate because the operational pattern generalizes well to similar local HVAC buyers.

Why:
- scheduling and service funnel structure are already usable
- buyer pool is large enough to justify clones
- current target mapping logic already contemplates alternates

### `site-ops-pro`

Very good parent, slightly less obvious than `terra-vantage`.

Why:
- strong operational product shape
- buyer logic already suggests alternates
- clone value is real, but care is needed to keep buyer-specific framing credible

### `resource-pro`

Strong candidate for the "same body, different local operator" class of clone.

Why:
- shared operational pattern
- differentiation likely depends more on brand, trust, and service context than deep product architecture

### `fence-quote`

Good quote-engine parent, but it must be kept conceptually separate from already-dedicated fence apps.

Rule:
- clone from `fence-quote` as a quote-engine parent
- do not collapse or confuse it with `ashtabula-fence` or `thomas-fence`

## Ranked Parent Pool

This is the stronger ranked view, based on current repo state, research, brandkits, and buildability.

### Tier 1

1. `terra-vantage`
- clearest overall parent
- explicit secondary candidates already exist in research
- brandkit already anticipates white-label reuse
- clean build and route behavior

2. `roofquote`
- naturally reusable quote flow
- high white-label potential explicitly supported by research
- buyer-specific layer is mostly branding + service area, not architecture

3. `hvac`
- reusable service/scheduler core
- strong local buyer pool
- primary/secondary candidate structure already exists

4. `fence-quote`
- strong reusable quote core
- but must stay separate from dedicated fence MVPs already in the repo

5. `site-ops-pro`
- strong candidate with good alternate-buyer logic
- slightly less explicitly “clone-program-ready” than `terra-vantage`

### Tier 2

6. `eligibility`
7. `resource-pro`
8. `boat-storage`

### Lower-confidence but viable later

9. `parcelvisor`
10. `event-permit`
11. `auto-detail`

## Best Immediate Cohort

If the clone program started today, the safest first cohort would be:

- `terra-vantage`
- `roofquote`
- `hvac`
- `fence-quote`
- `site-ops-pro`
- `resource-pro`

That is the highest-confidence parent pool currently visible in the repo.

## Required Inputs Before Creating MVP #75+

Do not clone until all of the following exist or are intentionally stubbed:

1. Chosen parent slug
2. New child slug
3. New child site/folder name
4. Chosen primary target buyer
5. Description/category for the new route
6. Lead research file or research stub
7. Brandkit file or brandkit stub
8. Asset lane plan, even if it starts with placeholders

No target, no clone.

## Upstream Artifact Expectations

The clone program depends on the upstream research pipeline being treated as a first-class prerequisite, not an afterthought.

Every child clone should eventually have:

- `lead_research_json/<slug>.json`
- `brandkits/<slug>.json`
- `branding_research/<slug>/branding.md`
- asset procurement staged or planned

The faster research, brandkit generation, and asset procurement become, the more the clone program becomes a target-selection and branding operation rather than a product-invention operation.

That is the leverage.

## Command Goal

The repo should eventually support a first-class command:

`./nai clone-mvp`

This command should make MVP `#75` a supported operation rather than a ceremony.

It should not attempt to do full branding automatically.
Its job is to:
- create the canonical child record
- create the cloned source app safely
- stub the upstream artifacts
- validate that the new child is structurally healthy

## Canonical-First Workflow

The machine-readable route map comes first.

1. Validate `SITEMAP.json`
2. Add the new child entry to `SITEMAP.json`
3. Add or update the target ledger entry if needed
4. Run:
   - `./nai sitemap-validate`
   - `./nai sitemap-render-md`
5. Only then create the cloned site folder

This keeps the canonical layer explicit and reviewable before any source duplication happens.

## Exact `./nai clone-mvp` Contract

### Required inputs

- `--parent-slug`
- `--new-slug`
- `--site-name`
- `--target`
- `--description`
- `--category`

### Optional inputs

- `--new-folder`
- `--primary-target-ledger-name`
- `--secondary-targets`
- `--notes`
- `--research-from`
- `--brandkit-from`
- `--no-build`
- `--no-routes`
- `--dry-run`
- `--force`

### Example

```bash
./nai clone-mvp \
  --parent-slug terra-vantage \
  --new-slug severino-plus \
  --site-name "Severino Plus" \
  --target "Severino Construction" \
  --description "Advanced excavation bid planner" \
  --category "🔧 Local Services" \
  --dry-run
```

## Preflight Validations

Before any file writes happen, the command should prove:

1. The current canonical sitemap is valid.
2. The parent slug exists in `SITEMAP.json`.
3. The parent resolves to a real folder in `websites/`.
4. The parent is buildable.
5. The new slug is unique.
6. The new URL would be unique.
7. The target folder does not already exist.
8. The parent is not already in a broken scan state unless `--force`.

If current canonical state is invalid, abort immediately.

## Naming and Identity Rules

Before creating a clone, settle these identifiers up front:

- public route slug
- human site name
- folder name
- canonical target buyer name
- category

Do not allow these to drift independently unless there is a very good reason.

The first version of `./nai clone-mvp` should prefer explicitness over convenience.
It is better to require the caller to state the identifiers than to guess wrong.

## Folder + Source Workflow

After the canonical entry exists:

1. Copy the parent folder into `websites/<new-site-name>/`
2. Update:
   - package name
   - visible app title
   - route slug references
   - Vite `base`
   - favicon / OG / metadata paths
   - target-specific copy
   - target-specific assets
3. Remove any parent-specific hardcoded identity that should not carry forward

## High-Risk Copy-Forward Mistakes

These are the easiest ways to create a broken or embarrassing clone:

- carrying forward the parent favicon or OG image
- leaving parent buyer names in metadata or hero copy
- leaving the parent route slug in `vite.config.*`
- keeping parent-specific trust badges or testimonials
- retaining old map coordinates, addresses, service areas, or phone numbers
- carrying forward asset paths that point at the old slug or old public directory

The clone workflow should explicitly check for these.

## Inside-the-Clone Rewrite Pass

Immediately after copying, patch the new child in-place:

- `package.json` name if present
- visible title and metadata
- Vite `base`
- hardcoded slug/path strings
- favicon / OG / asset references tied to the old slug
- obvious parent buyer names in hero/footer/meta text
- any parent-only route references

This should be a narrow structural pass, not full rebranding.

## Required Artifact Creation

Every clone should become a first-class citizen in the existing artifact pipeline.

Create:
- `lead_research_json/<slug>.json`
- `brandkits/<slug>.json`
- `branding_research/<slug>/branding.md`
- `branding_research/<slug>/...` assets as they become available

Optional but useful:
- create the asset directory scaffold even if it is initially empty
- copy forward parent research/brandkit as a template only if clearly marked as a child stub

## Validation Gate Before Deployment

Before a cloned MVP is treated as real:

1. `./nai scan`
2. Build the affected site
3. Confirm `dist/` exists
4. Confirm route generation sees it
5. Confirm no base-path issue exists
6. Screenshot locally if needed

If any of those fail, the clone is not ready.

## Minimum Success Criteria For MVP #75

The first child clone should be considered a success if all of the following are true:

1. It has a valid canonical route entry.
2. It has a distinct target buyer and identity.
3. It builds cleanly.
4. It appears in generated routes correctly.
5. It deploys without harming unrelated routes.
6. It is visually and semantically recognizable as a child of a strong parent, not as a sloppy copy.

The goal of MVP `#75` is not to be perfect.
The goal is to prove that clone expansion is now a supported platform behavior.

## Canonical Write Order

Safest order:

1. Validate current canonical state
2. Validate parent and proposed child inputs
3. Copy the parent folder
4. Patch the new child’s structural identifiers
5. Create research / brandkit / branding stubs
6. Update `SITEMAP.json`
7. Validate the sitemap again
8. Render `SITEMAP.md`
9. Run `./nai routes`
10. Run local validation

That order reduces the chance of publishing a canonical route that points to nothing.

## Route + Deploy Steps

When the clone validates locally:

1. `./nai routes`
2. verify the route exists in `vercel.json`
3. `./nai deploy`
4. live verify the new route
5. include it in screenshots / analysis if appropriate

## Failure and Rollback Rules

If failure happens before canonical write:
- delete the new folder
- exit nonzero

If failure happens after canonical write but before validation passes:
- remove the new route entry from `SITEMAP.json`
- remove the new target-ledger row
- rerender `SITEMAP.md`
- delete the cloned folder
- delete any stub artifacts created for the child
- rerun `./nai routes`

If failure happens after the child builds cleanly:
- keep it only if explicitly requested as a checkpoint
- otherwise rollback fully as above

## What Not To Do

- Do not clone from weak parents.
- Do not create a clone before selecting the buyer.
- Do not hand-roll a clone outside canonical sitemap workflow.
- Do not invent folder names or slug conventions ad hoc.
- Do not let multiple workers freestyle the same child MVP.

## Dry-Run Expectations

The first implementation should support a strong `--dry-run`.

Dry-run output should show:
- resolved parent folder
- proposed child folder
- proposed route object
- proposed target-ledger row
- files that will be copied
- files that will be created
- likely slug/path rewrite targets
- exact follow-up commands

Dry-run should be trustworthy enough that it becomes the normal first step.

## Future Tooling Goal

The repo should eventually support:

`./nai clone-mvp`

Target behavior:
- takes parent slug, new slug, new site name, target, description, and category
- updates `SITEMAP.json`
- renders `SITEMAP.md`
- creates the cloned site folder
- patches package/config/base-path basics
- stubs research/brandkit files
- optionally runs scan/build

That is the point where MVP #75 stops being a ceremony and becomes a supported operation.

## Recommended First Implementation Shape

Do **not** build the full power tool first.

Safer sequence:

1. `./nai clone-mvp --dry-run`
- validates inputs
- resolves parent
- shows the exact route record to be written
- shows the exact folder that would be created
- shows the files that would be patched

2. real-write mode behind the same command
- only after dry-run output is trustworthy

3. optional research/brandkit stub helpers
- only after the structural clone path works reliably

This sequence reduces the chance of the first version becoming dangerous before it becomes useful.

## Recommended Implementation Split

Best implementation locations:

- command wiring in `nai`
- canonical helpers in `nai_suite/sitemap_data.py`
- route/build checks in `nai_suite/siteflow.py`

Likely helper additions:
- `next_route_index(...)`
- `append_route(...)`
- `append_target_ledger_entry(...)`
- clone-safe slug/path rewrite helpers

Potential supporting helpers later:
- `clone_parent_health(...)`
- `make_clone_stub_research(...)`
- `make_clone_stub_brandkit(...)`
- `collect_clone_rewrite_targets(...)`
- `rollback_clone(...)`

## Immediate Next Steps

1. Keep this document as the working source for the clone program.
2. Implement a `--dry-run` only version of `./nai clone-mvp`.
3. Test it against `terra-vantage`.
4. Verify the resulting child can pass scan/build without deploy.
5. Only then allow the command to write real files by default.

## Suggested First Real Experiments

If the protocol is followed, these are the strongest early experiments:

1. `terra-vantage` child for another excavation / construction / site-work buyer
2. `roofquote` child for another roofing contractor
3. `hvac` child for another HVAC service company

Those experiments should tell us quickly whether the clone program is genuinely ready for scale.

## Concrete Opportunity: Saybrook Zoning Child

One especially strong first real clone candidate emerged after this protocol was drafted:

- parent: `zoning`
- proposed child slug: `saybrook-zoning`
- proposed child site name: `Saybrook Zoning Clerk`
- proposed target: `Saybrook Township Zoning Office`

Why this matters:

- Saybrook Township was already identified in `lead_research_json/zoning.json` as a strong modernization-fit target
- a newly published, clean, digitized zoning-code PDF now exists for Saybrook
- that document is dramatically better suited for chunking, embedding, indexing, and retrieval than the older scanned/OCR-era materials
- the existing `zoning-clerk` app already contains RAG-oriented scaffolding and document-center patterns

This makes Saybrook more than a random target.
It is a high-quality test of both:

- the clone program itself
- the jurisdiction-specific retrieval / regulatory-assistant thesis

### Why clone instead of overwrite

Do not overwrite the current broad `zoning` parent.

Reasons:

- the Saybrook corpus is jurisdiction-specific
- retrieval quality improves when the code corpus is isolated to a single jurisdiction
- the buyer story becomes cleaner and more credible
- the broader county / township white-label opportunity remains intact

### Recommended handling

If used as an early experiment:

1. preserve the Saybrook PDF in a clean research/resources location
2. create or update Saybrook-specific research + brandkit inputs
3. use `./nai clone-mvp --dry-run` against `zoning`
4. only after the dry-run looks good, proceed toward real-write mode
5. treat the Saybrook code corpus as the child app's first retrieval source

This is likely one of the strongest early clone-program wins currently visible in the repo.

## Scaling Principle

The real bottleneck in the clone phase is unlikely to be coding alone.

The likely bottlenecks are:

- good target selection
- strong lead research
- credible brandkits
- asset procurement
- not overloading the repo with sloppy naming or duplicate concepts

That is good news.

It means the platform work already done on the MVPs can now be amortized across many future buyer-specific children.

## Working Assumptions

Unless explicitly revised, this protocol assumes:

- `SITEMAP.json` remains canonical
- `SITEMAP.md` remains rendered from canonical data
- routes remain subpath-based under the main Vercel project
- clone children remain first-class MVPs, not hidden throwaways
- deploy and screenshot tooling should naturally absorb future children once the canonical route exists and the site builds

## Restart Checklist

If work resumes after a pause, use this checklist:

1. Read this file first.
2. Confirm canonical route count in `SITEMAP.json`.
3. Confirm current best parent pool still looks healthy.
4. Confirm no new route/build drift has appeared.
5. Decide whether the next move is:
   - dry-run command implementation
   - parent selection refinement
   - research/brandkit sprint for future child targets
   - first child clone execution

## Current Recommendation

The best next move is still:

1. implement `./nai clone-mvp --dry-run`
2. test against `terra-vantage`
3. verify the resulting plan is structurally sound
4. only then graduate to real file writes

That keeps the clone program disciplined while still moving quickly.

## Open Questions

- Should `./nai clone-mvp` also regenerate `landing-page/all-mvps.html` automatically?
- Should the first version create only blank stubs for research/brandkits, or copy parent templates with explicit child markers?
- Should clone lineage be recorded in `SITEMAP.json` or in a separate clone registry later?
