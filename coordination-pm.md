# Product Management — Coordination Log

**Created:** July 4, 2026 — by Harriet (Chief of Staff)
**Owner:** Ellis (nai-pm)
**Status:** ACTIVE — Queue validated and triaged per visual inspection (2026-07-04)

---

## 1. MASTER REPAIR QUEUE — JULY 2026 (Ellis-Validated)

Synthesized from `gemini-audit-report.md` (2026-07-04) and `visual_analysis_report.json` (76 sites analyzed). Priorities validated by visual inspection of screenshots. **Bold annotations = Ellis PM override.**

### TIER 1 — CRITICAL: Security + Hardcoded Keys

| # | Slug | Issue | Action | Gemini Audit Ref |
|---|------|-------|--------|------------------|
| 1 | **invest-ashtabula** | Hardcoded `AIzaSy...pH1A` key in dist build | Remove key, regenerate, migrate to OpenRouter | §2.3, §7 |
| 2 | **rental-availability** | Was hardcoded key in dist (now redacted); direct Gemini calls | Migrate to OpenRouter, verify key removed | §2.7, §7 |

**Ellis note:** These are SECURITY issues — real liability if deployed as-is. Invest-ashtabula dist has a live key visible in minified JS. Rental-availability was redacted by OpenClaw but still makes direct Gemini calls. Top priority.

### TIER 2 — HIGH: Direct Gemini REST API Calls

**Note:** Tier 2 items are ordered by urgency based on visual inspection. Items marked with ⚠️ have VISIBLE errors on the live site.

| # | Slug | Issue | Action | Ellis Urgency |
|---|------|-------|--------|---------------|
| 3 | **mytrip-planner-export** ⚠️ | Direct Gemini config in compiled dist. **Visible error on live site:** 'Gemini API key not configured' shown to users. | Locate source, migrate to shared client | **HIGHEST** — site is broken to visitors |
| 4 | **adaptive-reuse-planner** | Direct `generativelanguage.googleapis.com` fetch in App.jsx | Replace with `shared/api-client.js` OpenRouter call | HIGH — design=7, brand=6, functional but unbranded |
| 5 | **cashflow-tracker** | Direct Gemini fetch via `uh()` function | Replace with shared OpenRouter client | HIGH |
| 6 | **blueprint-analyzer** ⚠️ | Direct Gemini in App.jsx lines 4, 57. **Design is poor** (4/10 — overwhelmed by dark blue background, low contrast, left-constrained layout) | Replace with shared OpenRouter client + **branding/design pass needed** | HIGH — worst-looking site in portfolio |
| 7 | **plating-tracker** | Direct Gemini in App.jsx lines 4, 57 | Replace with shared OpenRouter client | HIGH — brand=4, needs identity |
| 8 | **permit-whisperer** | Standalone JS — no Vite/React SPA, direct Gemini | **See Triage Decision §5** — recommendation: do NOT refactor, swap Gemini → OpenRouter in-place | MEDIUM (site looks excellent — design=9, brand=9) |

### TIER 2B — HIGH: ENHANCEMENT Sites — Gemini-Dependent with Graceful Degradation

**Note:** All 19 sites below actively use Gemini for AI content generation but have fallbacks or degrade gracefully. Broken Gemini shows an inline error but the page remains usable. Migration needed, but lower urgency than Tier 2 sites with visible errors.

Sites marked with 🛡️ have **explicit code fallbacks** (hardcoded templates that activate when API is unavailable) — safest migration candidates.

| # | Slug | Issue | Action | Ellis Urgency |
|---|------|-------|--------|---------------|
| 9 | **parking** | Gemini generates AI parking suggestions; breaks with inline error | Migrate to shared OpenRouter client | MEDIUM |
| 10 | **license** | Gemini generates license guides; breaks with inline error | Migrate to shared OpenRouter client | MEDIUM |
| 11 | **portfolio** | Gemini generates case-study copy for PIPE! Creative | Migrate to shared OpenRouter client | MEDIUM |
| 12 | **concierge** | Gemini powers concierge recommendations | Migrate to shared OpenRouter client | MEDIUM |
| 13 | **boat-storage** 🛡️ | Gemini generates waitlist confirmations; hardcoded fallback templates exist (lines 15-22) | Migrate to shared OpenRouter client | LOW — fallback is solid |
| 14 | **ride-ready** 🛡️ | Gemini generates senior ride confirmations; sampleSummary fallback (lines 72-76) | Migrate to shared OpenRouter client | LOW — fallback is solid |
| 15 | **snow-plow** 🛡️ | Gemini generates route status updates; DEMO_FALLBACKS exist (lines 119-135) | Migrate to shared OpenRouter client | LOW — fallback is solid |
| 16 | **plating-pro** | Gemini generates plating status messages for Lake City Plating | Migrate to shared OpenRouter client | MEDIUM |
| 17 | **resource** | Gemini finds community resources for Circles initiative | Migrate to shared OpenRouter client | MEDIUM |
| 18 | **resource-pro** | Gemini finds neighborhood resources for G.O. Community Development | Migrate to shared OpenRouter client | MEDIUM |
| 19 | **parts** | Gemini generates parts availability responses | Migrate to shared OpenRouter client | MEDIUM |
| 20 | **compassionate** | Gemini generates end-of-life planning summaries for Ducro Funeral Services | Migrate to shared OpenRouter client | MEDIUM |
| 21 | **historian** | Gemini generates local history snippets about Ashtabula County | Migrate to shared OpenRouter client | MEDIUM |
| 22 | **volunteer** 🛡️ | Gemini generates volunteer confirmations for RSVP/Axess; buildConfirmation fallback (lines 43-53) | Migrate to shared OpenRouter client | LOW — fallback is solid |
| 23 | **ai-docent-pro** 🛡️ | Gemini generates museum audio narration for ACHS; fallbackNarration exists (lines 21-27) | Migrate to shared OpenRouter client | LOW — fallback is solid |
| 24 | **charter** 🛡️ | Gemini generates trip plans for Compensator Lake Erie Fishing Charters; buildFallbackPlan (lines 118-121) | Migrate to shared OpenRouter client | LOW — fallback is solid |
| 25 | **historian-pro** 🛡️ | Gemini generates first-person historical narration; fallbackNarration function (lines 124-129) | Migrate to shared OpenRouter client | LOW — fallback is solid |
| 26 | **sommelier** 🛡️ | Gemini generates wine pairing recommendations for Ferrante Winery; buildFallbackPairing (lines 120-130) | Migrate to shared OpenRouter client | LOW — fallback is solid |
| 27 | **pet-match** 🛡️ | Gemini generates adoption guidance summaries for ACAPL; buildFallbackSummary (lines 166-171) | Migrate to shared OpenRouter client | LOW — fallback is solid |

**Ellis note:** All 19 sites are ENHANCEMENT-class (not CORE). None block core functionality if Gemini is down — the page renders fully without it. The 🛡️ sites are the safest to migrate first since they have verified fallback code that activates on API failure. The non-shield sites show inline errors but the page remains navigable. Batch-migrate the 🛡️ group as a single operation: swap endpoint, test fallback, done.

**VESTIGIAL — Not Added to Queue:** `parts-request` and `scheduler-sms` were confirmed to have zero Gemini code (plain forms only). No migration needed — removed from Gemini audit scope.

---

### TIER 3 — MEDIUM: Gemini SDK in Dependencies (Verify Active Use)

| # | Slug | SDK | Action | Ellis Note |
|---|------|-----|--------|------------|
| 28 | **site-ops-pro** | `@google/genai` ^1.29.0 + `GEMINI_API_KEY` in vite.config | CONFIRMED ACTIVE — migrate | Design=8, Brand=9. Don't break this — it's a pitch anchor candidate. |
| 29 | **civic-insight-engine** | `@google/genai` ^1.43.0 | Verify source usage, migrate if active | Design=9, Brand=9. Pitch anchor. Handle carefully. |
| 30 | **saybrook-zoning** | `@google/generative-ai` ^0.24.1 | Verify source usage, migrate if active | Design=7, Brand=9 but **functionally empty** (no active chat). Needs functional fix. |
| 31 | **zoning-clerk** | `@google/generative-ai` ^0.24.1 | Verify source usage, migrate if active | Design=9, Brand=9. Pitch anchor candidate. |

### TIER 4 — LOW: SDK in node_modules, Possibly Unused

| # | Slug | Action | Ellis Note |
|---|------|--------|------------|
| 32 | trumbull-locker | Verify source — if unused, remove SDK from package.json | ArcGIS-only, zero AI dependency |
| 33 | thomas-fence | Verify source — if unused, remove SDK from package.json | ArcGIS-only, zero AI dependency |
| 34 | roofquote | Verify source — if unused, remove SDK from package.json | ArcGIS-only, zero AI dependency |
| 35 | terra-vantage | Verify source — if unused, remove SDK from package.json | ArcGIS-only, zero AI dependency. Best clone parent. |
| 36 | parcelvisor | Verify source — if unused, remove SDK from package.json | ArcGIS-only, zero AI dependency |
| 37 | rennick-market | Verify source — if unused, remove SDK from package.json | ArcGIS-only, zero AI dependency |
| 38 | ashtabula-fence | Verify source — if unused, remove SDK from package.json | ArcGIS-only, zero AI dependency |
| 39 | cut-custom | Verify source — if unused, remove SDK from package.json | ArcGIS-only, zero AI dependency |

**Ellis note:** All Tier 4 sites are clean ArcGIS-only MVPs with zero AI dependency. The SDK is vestigial template code. Lowest priority — can be cleaned up in batch.

### TIER 5 — VERIFY ONLY: Already Using Shared OpenRouter Client

| # | Slug | Action | Ellis Note |
|---|------|--------|------------|
| 40 | grantgenius | Confirm `callGeminiAPI` actually routes through OpenRouter | — |
| 41 | farm-stand-finder | Confirm `callGeminiAPI` actually routes through OpenRouter | — |
| 42 | hvac-tuneup | Confirm `callGeminiAPI` actually routes through OpenRouter | Design=9, Brand=10. Pitch anchor. |

---

## 2. BUILD SCRIPT CLEANUP (Post-Migration)

After each Tier 1-2 site is migrated, remove `VITE_GEMINI_API_KEY=$GEMINI_API_KEY` from its `package.json` build scripts:

| Slug | Has VITE_GEMINI_API_KEY in build |
|------|-------------------------------|
| hvac-tuneup | Yes |
| adaptive-reuse-planner | Yes |
| cashflow-tracker | Yes |
| mytrip-planner-export | Yes |
| aidflow-navigator | Yes |
| plating-tracker | Yes |
| license-wizard | Yes |
| invest-ashtabula | Yes |
| farm-stand-finder | Yes |
| blueprint-analyzer | Yes |
| instant-dirt-quote | Yes |

---

## 3. SHARED CLIENT NOTE

`shared/api-client.js` already routes through OpenRouter correctly. The `callGeminiAPI` export is an alias for `callOpenRouterAPI`. Default model: `google/gemini-2.5-flash-lite` via OpenRouter — provider-agnostic, which is the correct pattern. No change needed to shared client unless we want a non-Google default model.

---

## 4. PM RESPONSIBILITIES (From CHIEF_OF_STAFF.md §3)

- Define what "done" means for each site
- Triage all 75 sites: Ready / Needs Branding / Needs Fix / Retire
- **Maintain this priority queue for dev team** ← THIS FILE
- Verify branding against target buyer research
- Run and interpret `./nai analyze-screenshots`
- Own the artifact pipeline — ensure every layer is populated or intentionally stubbed
- Recommend site retirements (per REPO_GOVERNANCE_AND_DECOMMISSION_PLAN.md)

---

## 5. TRIAGE DECISIONS — Ellis (2026-07-04)

### 5.1 permit-whisperer — Keep as standalone JS

**Decision: DO NOT REFACTOR. Keep standalone JS architecture.**

Rationale:
- Visual analysis scores: design=9/10, brand=9/10, excellent status
- The site looks professional and works well
- A full Vite/React refactor would take days with zero visible improvement
- The only change needed: swap the Gemini fetch call in `assets/index-Bwr7_Tac.js` to route through OpenRouter

Action for Shaw: Edit the standalone JS file to replace `generativelanguage.googleapis.com` fetch with OpenRouter-compatible call. Use the same prompt structure, just route through a different endpoint.

### 5.2 ai-docent / ai-docent-pro — Keep active

**Decision: DO NOT RETIRE.** Both sites remain in SITEMAP.json (index 50-51).
- ai-docent-pro: design=9, brand=9, excellent status
- These are high-quality sites with clear target buyer (Ashtabula County Historical Society)
- Coordination file's claim that they're "already retired from canonical routes" is INCORRECT — they're still in SITEMAP.json and deployed
- Keep them in the portfolio. Flag the coordination file for correction.

### 5.3 pocket-historian-pro / pocket-sommelier-pro — Keep active

**Decision: DO NOT RETIRE.**
- historian-pro: design=8, brand=7 — good quality
- sommelier-pro: design=9, brand=9 — excellent quality
- historian: design=7, brand=6 — needs branding pass
- sommelier: design=7, brand=6 — needs branding pass
- All four have real target buyers (Historical Society, Ferrante Winery)
- The Pro variants are good enough for pitch. Standard variants need branded theming.

### 5.4 Top 3 Pitch Candidates (Ellis-Validated 2026-07-04)

After full visual inspection + analysis report cross-reference + brand verification.  
**Full analysis:** `pitch-ready-analysis.md` in workspace.

| Rank | Slug | Design | Brand | Target Buyer | Composite Score | Why This Slot |
|------|------|--------|-------|-------------|----------------|---------------|
| **#1** | **hvac** | 9 | 10 | HAVE Heating and Cooling | 41/100 | Smallest buyer = fastest close. Seasonal urgency (summer AC). Brand=10, complete. Easiest 60-second demo. |
| **#2** | **landlord** | 9 | 10 | AMHA (Ashtabula Metro Housing Authority) | 40/100 | Highest quality site. Government buyer with budget. Universal pain point. Brand=10, complete. |
| **#3** | **permits** | 9 | 9 | City of Ashtabula | 40/100 | Most weaponized existing page (48h promise, ROI projections, social proof already embedded). 1 hour dev work to remove demo-mode banners. |

**Key insight: None of the 76 sites pass Gates 3-5 yet.** These are sales-layer additions (urgency banners, demo scripts, domain setup) that must be added per-pitch. The top 3 were selected because they have the SMALLEST remaining gap to a fully pitchable state.

**Why not Civic Insight / Zoning?** Both have brand=9 but target_brand_status=needs_research. Their buyers (County Government, Planning Dept) need procurement contact identification before they can be pitched. Fast-track once Rhodes completes buyer research.

### 5.6 Branding Priority Queue

Sites needing Rhodes (Creative/Research) to produce brandkits. Sorted by severity.

| Priority | Slug | Brand Score | Design Score | What's Missing |
|----------|------|-------------|-------------|----------------|
| **COMPLETE ✅** | pet-match | 9/10 | 9/10 | Brandkit DONE — branding.md (555 lines), logo system (SVG+PNG, horizontal+stacked+icon), favicon (ICO+PNG), hero image (1280×720). Quality-verified by Ellis. Blocked on code-level re-skin (Shaw) and API error fix (migrate from Gemini). |
| **CRITICAL** | artist-commission | 3/10 | 4/10 | Visual identity, layout constraints, color palette, form styling |
| **HIGH** | scheduler | 3/10 | 8/10 | Logo, brand colors, business identity for Blank Heating Co |
| **HIGH** | parking | 3/10 | 7/10 | Municipal identity, logo, city branding for City of Ashtabula |
| **HIGH** | parts-request | 4/10 | 7/10 | Logo, industrial brand identity for Grand River Rubber & Plastics |
| **HIGH** | plating | 4/10 | 7/10 | BRANDKIT COMPLETE (Ellis QA 2026-07-04). Gap is code implementation: logo, colors, copy, hero image. See §10 for full report. |
| **HIGH** | plating-pro | 4/10 | 7/10 | BRANDKIT COMPLETE (Ellis QA 2026-07-04). Gap is code implementation + Pro differentiation. See §10 for full report. |
| **HIGH** | engineers | 4/10 | 7/10 | Municipal engineering identity for City of Ashtabula Engineering |
| **HIGH** | scheduler-sms | 4/10 | 8/10 | Logo, brand colors for Blank Heating Co |
| **LOW** | mytrip-export | 5/10 | 6/10 | Destination branding for Visitors Bureau (will resolve with API fix) |
| **LOW** | blueprint | 5/10 | 4/10 | Full visual redesign needed — dark blue is overwhelming |

---

## 6. COORDINATION PROTOCOL

- **Ellis updates this file** at end of each work session
- **Dev (Shaw)** reads this file before starting work — queue is authoritative
- **Harriet (Chief of Staff)** reads before each session
- **Escalate blockers** immediately via kanban comments
- **Write conflicts:** one site per agent at a time

---

## 7. CURRENT STATE SNAPSHOT (July 4, 2026 — Ellis-Validated)

| Metric | Count |
|--------|-------|
| Total MVPs deployed | 75 |
| Build health (`./nai scan`) | 76/76 routes clean |
| Gemini migration needed (Wave 1, Tier 1-2) | 8 sites |
| **Gemini migration needed (Wave 1.5, Tier 2B)** | **19 sites** |
| SDK verification needed (Wave 1, Tier 3-4) | 12 sites |
| Already migrated (Wave 1, Tier 5) | 3 sites |
| **Total Gemini repair queue** | **42 sites** |
| Wave 2 — ENHANCEMENT (graceful degradation) | 19 sites |
| Wave 2 — VESTIGIAL (zero Gemini code, no action) | 2 sites (parts-request, scheduler-sms) |
| Sites with visible API error on live page | 2 (mytrip-export ⚠️, pet-match ⚠️) |
| Sites in excellent visual state | 40 |
| Sites in good visual state | 30 |
| Sites in mixed/poor visual state | 6 |
| Sites with critical branding gaps (brand < 5) | 9 |
| Sites at pitch anchor quality (design+brand ≥ 18) | 15+ |
| Pitch anchors selected | 5 (landlord, hvac, civic-insight, permits, zoning) |
| LAST_MILE_FIXES status | COMPLETE (36/37, 1 pending) |
| Visual polish batch | 38 sites done |
| Brandkit completions (Ellis QA) | ✅ plating, plating-pro, pet-match, parts-request |

---

## 8. NEXT ACTIONS FOR SHAW (Engineering)

Work the queue top-to-bottom:

1. **invest-ashtabula** — CRITICAL: Remove hardcoded key from dist, rebuild, migrate to OpenRouter
2. **rental-availability** — CRITICAL: Verify key fully removed, reconfirm OpenRouter route
3. **mytrip-planner-export** — HIGHEST: Fix visible API error. Locate source + migrate to shared client
4. **adaptive-reuse-planner** — HIGH: Swap direct Gemini fetch for shared api-client
5. **cashflow-tracker** — HIGH: Swap `uh()` function for shared OpenRouter client
6. **blueprint-analyzer** — HIGH: Swap to shared client + **needs design pass** after migration
7. **plating-tracker** — HIGH: Swap to shared client
8. **permit-whisperer** — MEDIUM: Edit standalone JS in place. Do NOT refactor. Just swap endpoint.

After all migrations, batch cleanup of `VITE_GEMINI_API_KEY` from package.json build scripts (see §2).

### 8.1 ⚠️ Wave 1.5 — Tier 2B: 19 ENHANCEMENT Gemini Sites (Graceful Degradation)

A corrected second audit (t_114dcd99) found **19 ENHANCEMENT Gemini sites** plus **2 VESTIGIAL** (parts-request, scheduler-sms — zero Gemini code, no migration needed). This replaces the earlier Wave 2 count of 21. Full analysis at `gemini-role-analysis.json`.

**DO NOT start Wave 1.5 until Wave 1 is complete.** Exceptions: if a Wave 1.5 site is being actively pitched, escalate to Michael.

**Batch 1 — 🛡️ Fallback-Protected (safest to migrate first):**
- boat-storage, ride-ready, snow-plow, volunteer, ai-docent-pro, charter, historian-pro, sommelier, pet-match
- All 9 have verified hardcoded fallback templates that activate on API failure
- Strategy: swap endpoint in each, test fallback activates correctly, done
- Lowest risk — can batch-process these rapidly

**Batch 2 — No Fallback (inline error on Gemini failure):**
- parking, license, portfolio, concierge, plating-pro, resource, resource-pro, parts, compassionate, historian
- These show inline error messages when Gemini is down but the page remains navigable
- Migrate to shared OpenRouter client individually

**VESTIGIAL — No Action Needed:**
- parts-request, scheduler-sms — confirmed zero Gemini API code (plain forms only)
- Remove from any Gemini migration tracking; these are clean

**After Wave 1.5, remove all `VITE_GEMINI_API_KEY` env references from remaining site package.json build scripts.**

## 9. NEXT ACTIONS FOR RHODES (Creative/Research)

Work branding priority queue top-to-bottom (§5.6):

1. ~~**pet-match** — Produce brandkit for Ashtabula County Animal Protective League~~ ✅ COMPLETE (Ellis QA 2026-07-04)
2. **artist-commission** — Produce brandkit for Ashtabula Arts Center
3. **scheduler / scheduler-sms** — Produce brandkit for Blank Heating Company Inc
4. **parking** — Produce brandkit for City of Ashtabula (visitor parking)
5. ~~**parts-request** — Produce brandkit for Grand River Rubber & Plastics Co.~~ ✅ COMPLETE (from earlier pass)
6. ~~**plating / plating-pro** — Produce brandkit for Lake City Plating~~ ✅ COMPLETE (Ellis QA 2026-07-04)

Also: verify / refresh brandkits for the 5 pitch anchors (landlord, hvac, civic-insight, permits, zoning) to ensure sales-ready.

## 10. BRANDKIT QA REPORT — Plating / Plating Pro (2026-07-04)

### Asset Verification — All Pass

**plating (13 assets verified):**
- ✅ `brandkits/plating.json` — 200 lines, COMPLETE. Colors, typography, design tokens, full copy suite, logo spec, imagery direction
- ✅ `branding_research/plating/branding.md` — 255 lines. Brand story, voice/tone, copy, industry language, visual guidelines, buyer personas
- ✅ `branding_research/plating/logo.svg` — hexagonal mark (plating rack/chemistry motif) + wordmark
- ✅ `branding_research/plating/logo.png` — 1024×308 raster fallback
- ✅ `branding_research/plating/hero.jpg` — 1280×720 industrial plating facility
- ✅ `branding_research/plating/favicon.png` + 16px + 48px variants + favicon.svg
- ✅ `branding_research/plating/assets/hex-pattern.svg` — background texture
- ✅ `branding_research/plating/assets/metal-texture.svg` — dark gradient + copper accent

**plating-pro (inherits from plating + own spec):**
- ✅ `brandkits/plating-pro.json` — 70 lines, COMPLETE. Pro differentiation, green/orange accents, chart colorways, Pro messaging
- ✅ `branding_research/plating-pro/branding.md` — 274 lines. Pro story (prediction vs visibility), Quality Manager persona, audit-readiness focus
- ✅ All shared assets inherited from plating/ — logo, hero, favicons, textures all present

### Brand Quality Score: 3-4/10 → STILL 3-4/10 on Live Sites

Brandkits are complete (10/10 at the spec level) but **NONE of the brand work has been applied to the actual websites.** The sites remain generic templates.

### Critical Inconsistencies Found

| # | Issue | Severity | Detail |
|---|-------|----------|--------|
| 1 | **No logo on either site** | CRITICAL | Logo SVG exists at canonical path; neither site renders it. Sites use text-only `<p className="eyebrow">` instead. |
| 2 | **No brand colors implemented** | CRITICAL | Both sites use generic Tailwind colors (`#0f172a`, `#111827`). Brandkit specifies navy `#1B2A4A`, steel blue `#3B6FA0`, copper `#C87533`. None present. |
| 3 | **Same CSS for both (byte-identical)** | HIGH | `App.css` is identical in both sites. Pro should differentiate with green badge `#38A169`, orange `#DD6B20`, chart colorways, analytics card borders. |
| 4 | **No Pro differentiation** | HIGH | Same 3 feature tiles (Transparency, Less admin, Higher trust). Same footer. Same generic copy. Brandkit specifies 4 Pro features (bath chemistry, defect heat maps, yield dashboards, audit readiness) — none implemented. |
| 5 | **Template copy, not brand copy** | MEDIUM | "Real-time job updates for customers" / "Premium status updates for customers" — generic. Brandkit has: "Track every load. Certify every batch." / "Built by people who know the difference between bright tin and matte tin." / Full trust language, value props, and CTAs unused. |
| 6 | **"🧪 Gemini API" badge contradicts brand voice** | MEDIUM | Brandkit voice: "Direct, technical, no marketing fluff. Rust Belt authenticity." A "Gemini-powered" badge is generic tech-washing. Lake City Plating buyers care about microns and ASTM specs, not AI brand names. |
| 7 | **CTAs don't match brandkit** | LOW | Site CTAs: "Check Status" / "Enable SMS". Brandkit CTAs: "See it on your shop floor" / "Schedule a walkthrough" / "Get a quote for your line". |
| 8 | **No hero imagery used** | MEDIUM | `hero.jpg` (341KB, 1280×720) exists but is not used on either site. Supplementary assets (hex-pattern, metal-texture) also unused. |
| 9 | **API inconsistency** | LOW | plating uses OpenRouter; plating-pro uses direct Gemini. Different envars, different API paths. Should use same strategy. |

### What the Brandkits Got Right

- Spec completeness is excellent — every design token, copy variant, and usage rule is documented
- Pro-buyer differentiation is well-articulated (Quality Manager for Pro vs Owner for base)
- Shared asset path convention is clean (plating-pro inherits from plating/)
- Visual differentiation rules in the Pro brandkit are specific and implementable (green badge, chart colorways, card borders)
- Trust language matches the industrial/Rust Belt voice perfectly
- Voice Do/Don't tables are actionable for copywriters

### Verdict

| Site | Brandkit Status | Site Implementation | Gap |
|------|----------------|-------------------|-----|
| **plating** | ✅ COMPLETE (10/10) | ❌ 3-4/10 (generic template) | 6-7 points |
| **plating-pro** | ✅ COMPLETE (10/10) | ❌ 3-4/10 (nearly identical to base) | 6-7 points |

### Recommended Actions

**For Shaw (Engineering) — Code changes needed:**

| Priority | Action | Effort | Impact |
|----------|--------|--------|--------|
| **P1** | Add logo to both sites: render `logo.svg` in hero header, link to brandkit canonical path. | Small | High |
| **P2** | Replace generic CSS colors with brandkit palette: navy `#1B2A4A` hero bg, steel blue `#3B6FA0` buttons, copper `#C87533` CTAs. | Small | High |
| **P3** | Differentiate plating-pro CSS: green `#38A169` PRO badge, orange `#DD6B20` analytics accents, green card borders for Pro dashboard cards. | Small | Medium |
| **P4** | Replace Gemini API badges with brand-aligned trust signals (e.g., "ASTM B633 Certified" / "Real-time QC" instead of "Gemini-powered"). | Small | Medium |
| **P5** | Add hero image `branding_research/plating/hero.jpg` as background for hero sections. | Small | High |
| **P6** | Apply brandkit copy: replace generic headings with "Track every load. Certify every batch." Replace feature tiles with brandkit value prop copy. | Small | Medium |
| **P7** | Migrate plating-pro to same OpenRouter API client as plating (remove direct Gemini). | Medium | Low |
| **P8** | Add supplementary textures (hex-pattern, metal-texture) as section backgrounds. | Small | Low |

**For Rhodes — No additional brandkit work needed.**
The brandkits are complete. The gap is implementation, not specification.

**For Cyrus — Do not pitch either site until P1-P2 are resolved.** Without logo and brand colors, the sites look like generic templates rather than a product built for Lake City Plating. Currently white-label-fit is rated 9/10 — that's the problem: they're too generic. Target: branded fit 7+/10 and white-label 5/10. We want the site to feel like it belongs to Lake City Plating, not like it could be anyone's.
