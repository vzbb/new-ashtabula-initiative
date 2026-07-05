# QA Report: Insta Book / The Lakehouse Inn

**Date:** 2026-07-05 01:25 UTC  
**Tester:** Ellis (PM / QA Lead)  
**Status:** CONDITIONAL PASS — deploy blocked by Vercel quota  
**QA Score:** 8.5/10

---

## Gate Results

### 1. VERIFY — Live Site Inspection

| Check | Result | Notes |
|-------|--------|-------|
| HTTP 200 (live) | ✅ PASS | Page serves from Vercel |
| Title tag | ✅ PASS | "The Lakehouse Inn — Geneva-on-the-Lake, Ohio" |
| "LAKESIDE RETREAT DEMO" overlay | ✅ PASS | **Removed** — no trace in source or live HTML |
| OG meta | ✅ PASS | Proper og:title, og:description, og:image |
| HTML structure | ✅ PASS | Valid, modern |

### 2. ASSET VERIFICATION — Live vs Local

| Asset | Live | Local Build | Verdict |
|-------|------|-------------|---------|
| `/insta-book/assets/lakehouse-logo.svg` | ✅ 200 OK | ✅ Present | **PASS** |
| `/insta-book/assets/lakehouse-og.jpg` | ✅ 200 OK | ✅ Present | **PASS** |
| `/insta-book/assets/index-CeNfcTrb.js` (live) | ✅ 200 OK | — | **PASS** |
| `/insta-book/assets/hero.jpg` | ❌ **404** | ✅ Present (2.9MB) | **BLOCKED — not deployed** |
| `/insta-book/assets/hero-overlay.svg` | ❌ **404** | ✅ Present | **BLOCKED — not deployed** |
| `/insta-book/assets/lakehouse-pattern.svg` | ❌ **404** | ✅ Present | **BLOCKED — not deployed** |
| `/insta-book/assets/hospitality-icons.svg` | ❌ **404** | ✅ Present | **BLOCKED — not deployed** |
| `/insta-book/favicon.png` | ❌ **404** | ✅ Present | **BLOCKED — not deployed** |

**Live CSS does NOT contain hero.jpg or lakehouse-pattern references** — confirming the old build is still deployed.

### 3. SOURCE CODE REVIEW — Brandkit v2.0 Compliance

| Component | Status | Details |
|-----------|--------|---------|
| **Logo** | ✅ 10/10 | `lakehouse-logo.svg` — proper brand lockup with deep navy, lake blue, sunset gold |
| **Color Palette** | ✅ 10/10 | deep-navy: #1B2A4A, lake-blue: #2E6F95, sunset-gold: #E8A87C, warm-white: #FFF8F0, harvest-gold: #C4964A, vineyard-green: #5B7B5A, sandy-beige: #D4C5A9, blush: #E8B4B4 |
| **Typography** | ✅ 10/10 | Playfair Display (headings), Inter (body/UI), Cormorant Garamond (accent/italic) — all imported from Google Fonts |
| **Hero Section** | ✅ 9/10 | hero-bg with lakehouse photo, hero-overlay with gradient (bottom-up navy + gold glow + vignette). Not live yet. |
| **Photography** | ✅ 9/10 | hero.jpg (2.9MB, real lakefront photo). Beautiful. Not live yet. |
| **Background Pattern** | ✅ 10/10 | `lakehouse-pattern.svg` — subtle wave lines + sunset glow at 4% opacity |
| **Horizon Motif** | ✅ 10/10 | `.horizon-line--sun` with sunset gold gradient + circle accent; `.horizon-line` with lake-blue gradient |
| **Booking Card** | ✅ 8/10 | Glassmorphism card (rgba(255,253,248,0.92), backdrop-filter, elevated shadow). Pills with deep navy active state. |
| **CTA Button** | ✅ 9/10 | Sunset gold → harvest gold gradient, deep navy text, shadow on hover |
| **Footer** | ✅ 10/10 | Deep navy background, sunset gold brand name (Cormorant Garamond), proper contact — "The Lakehouse Inn" / Geneva-on-the-Lake, Ohio / (440) 466-8668 / inquiries@thelakehouseinn.com |
| **Favicon** | ✅ 9/10 | Multi-size setup (16, 32, 48, 192px + apple-touch-icon). Not live due to deploy block. |
| **Responsive** | ✅ 8/10 | Breakpoints at 960px and 720px. Content grid collapses to single column. Brand row stacks vertically on mobile. |
| **OG Image** | ✅ 10/10 | lakehouse-og.jpg (1.1MB) — live and serving |

### 4. UI/UX ANALYSIS

| Aspect | Score | Notes |
|--------|-------|-------|
| **Boutique lodging feel** | 9/10 | Warm color palette, lake photography, Playfair serif headings, glassmorphism cards. Elevates above generic booking forms. |
| **Layout clarity** | 9/10 | Two-column content grid (form + preview). Logical reading order. |
| **Visual polish** | 8/10 | Smooth hover transitions on pills/CTA, focus states, consistent spacing. Scrollbar and font loading could be smoother. |
| **API readiness** | 7/10 | Uses Gemini 2.0 Flash (shared API client) — not yet migrated to OpenRouter. Works in offline/fallback mode without key. |

### 5. FUNCTIONAL TESTING

| Feature | Status | Notes |
|---------|--------|-------|
| Guest name input | ✅ PASS | Editable, prefilled "Megan" |
| Date picker | ✅ PASS | Functional |
| Night count pills (1-5) | ✅ PASS | Active state toggles correctly |
| Stay type pills | ✅ PASS | Inn room, Lakeview suite, Two-bedroom cottage |
| Add-on toggles | ✅ PASS | Breakfast basket, Crosswinds dinner, Spa, Winery tasting, Covered bridge guide |
| Generate confirmation | ✅ PASS | Works in fallback mode (no API key = local confirmation). API key configured = Gemini call. |
| Confirmation preview | ✅ PASS | pre block with fallback text. Empty state when not generated. |

---

## Findings Summary

### Blocking Issues

1. **Deploy blocked** — Vercel free tier quota exhausted (100 deploys/day). The entire brandkit v2.0 refresh (hero image, overlay, pattern, hospitality icons, favicons) is built locally but NOT live. Live site is serving stale pre-brandkit code.

2. **hero.jpg → 404** — The hero lakefront photo is the most important visual upgrade. Cannot verify rendering live. Local build confirms it's present at 2.9MB in dist/assets/.

### Non-Blocking Notes

3. **API client still Gemini** — Uses VITE_GEMINI_API_KEY. Tagged "openrouter-migrated" in parent task metadata but shared/api-client.js still calls Gemini 2.0 Flash. Migration would need to touch the shared client.

4. **Phone number obscured** — "(440) 466-8668" uses `44****8668` in the href tel link (line 271 of App.jsx) — this shows as "(440) 466-8668" in text but the link is obscured. Likely intentional for anti-scrape but worth flagging.

5. **Screenshot capture** — The live screenshot is truncated (64KB cap). The local build cannot be screenshotted without a deployed URL or a local screenshot pipeline. Recommend re-screenshoting after deploy.

---

## Verdict

**CONDITIONAL PASS — 8.5/10**

The source code is brandkit v2.0 compliant. Every visual element — colors, typography, logo, photography, patterns, footer, responsive breakpoints — matches the Lakehouse Inn brand spec. The "LAKESIDE RETREAT DEMO" overlay is completely removed. The booking form is functional with proper fallback behavior.

**Condition:** Cannot final greenlight until the Vercel deploy quota resets and the site is redeployed. After deploy, verify:
- hero.jpg renders in the hero section
- hero-overlay.svg provides proper gradient
- lakehouse-pattern.svg appears as ambient background texture
- hospitality-icons.svg loads
- favicon.ico works across browsers
- Re-capture full-page screenshot for visual confirmation

**Recommended deploy window:** Immediately after midnight UTC when Vercel quota resets.

**Pre-deploy checklist:**
```
./nai build --slugs insta-book    # already done
./nai routes                      # if SITEMAP changed
./nai deploy --confirm-production # after quota reset
./nai screenshots --live --slugs insta-book
./nai analyze-screenshots --slugs insta-book
```
