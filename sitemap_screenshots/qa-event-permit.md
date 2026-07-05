# QA Report — Event Permit Express (event-permit)
**Date:** 2026-07-05  
**Inspector:** Ellis, PM Lead  
**Build:** Clean (2.07s, 32 modules)  
**Deploy:** Blocked by Vercel daily limit — local preview verified  

---

## Verdict: ✅ PASS — GREENLIT

| Criterion | Status | Evidence |
|-----------|--------|---------|
| **Glassmorphism Hero + Photography** | ✅ PASS | Expo Center fairgrounds photo (315KB WebP) under navy gradient overlay + `backdrop-filter: blur(12px)` glass panel. Vision confirmed glassmorphism panel visible. |
| **Card Shadows & Hover-Lift** | ✅ PASS | `.municipal-card` uses `box-shadow: var(--shadow)`, hover lifts 4px with `var(--shadow-lg)`. Close-up vision confirmed "subtle but visible drop shadow." |
| **CTA Colors → Warm Amber/Gold** | ✅ PASS | Primary button: `linear-gradient(135deg, #D4AC0D, #B8860B)`. Slider accent, gold badges, card header gold border all use `#D4AC0D`. Vision confirmed "golden-yellow button." |
| **Scroll Fade-In Animations** | ✅ PASS | `IntersectionObserver` + `ScrollReveal` component on all sections. CSS: `opacity 0→1 + translateY(24px→0)`. Multiple variants (left, right, scale). No jank or overlap. |
| **Interactive Elements Functional** | ✅ PASS | Event type grid (Wedding click ✓), slider (set to 250 ✓, reads back 250), needs toggles (Alcohol ✓, Tents ✓), Generate button (produces numbered checklist ✓), Print + Contact buttons visible. |
| **Footer (Address/Contact)** | ✅ PASS | "127 N. Elm St, Jefferson, OH 44047", ashtafair@windstream.net, Brian Edelman · 440-858-6667 all present. |
| **Brandkit Alignment** | ✅ PASS | Colors: #1B4F72 / #D4AC0D / #2E86C1 match brandkit. Inter typography, 12px border-radius, glass tokens match spec. |
| **Overall Quality** | **8/10** | Professional municipal design, on target for 7-8/10. Clean layout, good spacing, no defects. |

---

## Detailed Inspection Notes

### Source Code Review
- **`App.jsx`** (519 lines): `ScrollReveal` component wrapping trust strip, event details card, results card, and features grid. `useScrollReveal` hook with `IntersectionObserver (threshold: 0.10)`. Fallback checklists for 6 event types. All interactive state managed with `useState`.
- **`index.css`** (114 lines): CSS variables for full brandkit palette — primary/secondary/accent, 5 shadow tiers, Inter typography, motion-reduce accessibility support.
- **`App.css`** (906 lines): `.hero-section::before` with `url('/hero-bg.webp')` background. `.hero-glass` with `backdrop-filter: blur(12px)` and `rgba(255,255,255,0.1)` fill. `.municipal-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }`. `.btn-primary` uses gold gradient. Scroll reveal animations on `.scroll-reveal` with 0.6s ease-out transitions.

### Asset Verification
- `public/hero-bg.webp` (315KB) — Expo Center exterior photo, properly linked as CSS background
- `branding_research/event-permit/assets/` — 4 WebP + 4 PNG source images available
- Brandkit: `brandkits/event-permit.json` — 69 lines, matches implementation

### Interactive Test Results (Playwright verified)
- Wedding event type: selected (green border ✓)
- Slider: 250 people ✓
- Alcohol Permit toggle: ON (amber border + checkmark ✓)
- Tents/Structures toggle: ON (amber border + checkmark ✓)
- Generate: produces 8-item numbered checklist ✓
- Print Checklist button: visible ✓
- Contact Fairgrounds Team button: visible ✓

---

## Recommendation

**GREENLIT for Cyrus.** This site is pitch-ready. Professional appearance, all interactive elements functional, proper Ashtabula County Fairgrounds branding throughout. Ready for deploy once Vercel daily limit resets.

### Minor polish items (non-blocking, queue for next cycle)
1. Card shadows could be slightly more pronounced — recommend `--shadow-md` as default instead of `--shadow` on `.municipal-card` (cosmetic preference)
2. The 3 AI-generated hero photography assets (grandstand, pavilion, panoramic) are available in the research directory but only expo-center-hero is deployed — could rotate or use in other sections for visual variety
