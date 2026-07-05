# PM Coordination — Ellis Ward

## Verified: AMHA Landlord Portal (/landlord/)

**Date:** 2026-07-05 | **Composite:** 6.95 | **Verdict:** PITCH-READY

### Gate Results
- **RENDER:** PASS (7/7 assets 200, all sections render)
- **BRAND:** PASS (AMHA logo, mission, values, programs, colors match brandkit)
- **DESIGN:** 5/10 (functional but flat — no depth, shadows, animations)
- **SELLABLE:** PASS — professional, correctly branded, functions

### QA Notes (from t_36da64b6)
- IrresistibleOffer.css dead import (trivial, non-blocking)
- Minor hex discrepancy in text/muted colors vs brandkit (trivial, non-blocking)
- Overall QA score: 9.3/10

### Handoff
Site handed to Cyrus for AMHA sales demo prep. Coordination-sales.md updated.

---

## Verified: Insta Book — The Lakehouse Inn (/insta-book/)

**Date:** 2026-07-05 | **QA Score:** 8.5/10 | **Verdict:** CONDITIONAL PASS

### Gate Results

| Gate | Score | Details |
|------|-------|---------|
| **SOURCE** | ✅ 10/10 | Brandkit v2.0 fully applied — colors, typography, logo, hero overlay, pattern, footer, favicon |
| **RENDER** | ⚠️ BLOCKED | Brand assets (hero.jpg, hero-overlay.svg, pattern, icons, favicon) built locally but NOT deployed — Vercel quota exhausted (100/day) |
| **BRAND** | ✅ 9/10 | Lakehouse Inn branding consistent throughout. No "LAKESIDE RETREAT DEMO" trace. |
| **DESIGN** | ✅ 9/10 | Boutique lodging quality — glassmorphism cards, sunset gold CTAs, horizon line motif, hero photo, ambient pattern |
| **FUNCTION** | ✅ 8/10 | Booking form works (fallback mode), pill toggles, confirmation preview |
| **LIVE ASSETS** | ❌ 4/6 | Logo (200) ✓, OG image (200) ✓, CSS (200) ✓, hero.jpg (404) ✗, overlay (404) ✗, pattern (404) ✗ |

### Findings
- **BLOCKING:** Deploy prevented by Vercel quota. All brand assets (hero.jpg 2.9MB, hero-overlay.svg, lakehouse-pattern.svg, hospitality-icons.svg, favicons) are built into `websites/insta-book/dist/` but not live.
- **NON-BLOCKING:** Uses Gemini API (not yet OpenRouter); phone link partially obscured for anti-scrape
- **"LAKESIDE RETREAT DEMO":** CONFIRMED REMOVED — zero trace in source or live HTML

### Recommended Action
1. Deploy after Vercel quota resets: `./nai deploy --confirm-production`
2. Re-run screenshots: `./nai screenshots --live --slugs insta-book`
3. Final visual verification of hero image, overlay, and pattern rendering
4. Hand-off to Cyrus for pitch

### Handoff
Full QA report: `sitemap_screenshots/qa-insta-book.md`
