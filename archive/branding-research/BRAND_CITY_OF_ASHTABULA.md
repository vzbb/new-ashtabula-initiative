# City of Ashtabula Brand Personalization Report

**Date:** 2026-02-28  
**Target Buyer:** City of Ashtabula Building Department  
**Brand Identity:** Municipal Blue (#1e3a5f), White, Government Gold (#d4af37)

---

## Executive Summary

All 8 government permit and transparency sites have been successfully redesigned with the official City of Ashtabula municipal branding. Each site now features a professional government aesthetic with cohesive visual identity, official color palette, and Lake Erie coastal theming.

---

## Sites Redesigned

| # | Site Name | Type | Status |
|---|-----------|------|--------|
| 1 | **civic-insight-engine** | Government Transparency Portal | ✅ Complete |
| 2 | **permit-whisperer** | Permit Q&A Assistant | ✅ Complete |
| 3 | **zoning-clerk** | Zoning Guidance Tool | ✅ Complete |
| 4 | **eligibility-screener** | Benefits Navigator | ✅ Complete |
| 5 | **eligibility-pro** | Advanced Benefits Tool | ✅ Complete |
| 6 | **eligibility-lite** | Simplified Benefits Tool | ✅ Complete |
| 7 | **license-wizard** | Business Licensing Guide | ✅ Complete |
| 8 | **event-permit-express** | Event Permit Assistant | ✅ Complete |

---

## Brand Implementation Details

### 1. Color Palette Applied

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary | Municipal Blue | `#1e3a5f` | Headers, primary buttons, cards |
| Secondary | White | `#ffffff` | Backgrounds, text on dark |
| Accent | Government Gold | `#d4af37` | Hover states, badges, dividers |
| Text | Dark Slate | `#2c3e50` | Body text, headings |
| Background | Lake Blue | `#e8f4f8` | Subtle backgrounds, waves |

### 2. Typography

- **Headings:** Source Sans Pro (600 weight) - Official, clean
- **Body:** Open Sans (400 weight) - Readable, accessible
- **Google Fonts Import:** `https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600&family=Source+Sans+3:wght@400;600;700&display=swap`

### 3. Logo (SVG)

All sites feature the City of Ashtabula municipal shield logo:

```svg
Shield shape with:
- Blue shield background (#1e3a5f)
- White lighthouse silhouette
- Gold light beams (#d4af37)
- Lake Erie wave accents at base
- Gold border accents
```

**Logo positioning:** 50px height, top-left of header with "City of Ashtabula" text

### 4. Background Patterns

Two subtle pattern options implemented:

1. **Lake Erie Wave Pattern** (Primary)
   - Very light blue waves (#e8f4f8) on white
   - Subtle, non-distracting
   - Coastal civic identity

2. **Civic Grid Pattern** (Alternative)
   - Subtle grid with lighthouse icons
   - Gold accent lines

### 5. Layout Structure

All sites now follow consistent municipal layout:

```
┌─────────────────────────────────────────┐
│ ★ Official Banner (Gold text on dark)   │
├─────────────────────────────────────────┤
│ [Logo] City of Ashtabula    [Nav...]    │
│              Site Name                   │
├─────────────────────────────────────────┤
│                                         │
│  Hero Section with Eyebrow/Title        │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ Municipal Card (Blue header)    │    │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │    │
│  │ Form / Content                  │    │
│  │ [Blue button with gold hover]   │    │
│  └─────────────────────────────────┘    │
│                                         │
├─────────────────────────────────────────┤
│ [Seal] City of Ashtabula                │
│ Footer Links        © 2026              │
└─────────────────────────────────────────┘
```

### 6. UI Elements

**Buttons:**
- Primary: Blue background (#1e3a5f), white text
- Hover: Gold background (#d4af37), dark blue text
- Secondary: White with blue border

**Cards:**
- White background
- Blue header with gold accent border
- Subtle shadow
- 8px border radius

**Badges:**
- Gold badge for "Official" indicators
- Blue badge for department tags

**Dividers:**
- Blue-to-gold gradient
- 60px width, centered

---

## Per-Site Customization

### 1. civic-insight-engine
- **Subtitle:** Civic Insight Engine
- **Banner:** Official Transparency Portal
- **Navigation:** Dashboard, Issues, Report, Property, Budget, Admin
- **Footer:** Transparency-focused links

### 2. permit-whisperer
- **Subtitle:** Permit Whisperer
- **Banner:** Official Permit Assistance Portal
- **Features:** AI-powered permit Q&A with citations
- **Footer:** Building Department links

### 3. zoning-clerk
- **Subtitle:** Zoning Clerk
- **Banner:** Official Zoning Portal
- **Features:** Property address + project type zoning guidance
- **Footer:** Planning & Zoning Department links

### 4. eligibility-screener
- **Subtitle:** Eligibility Screener
- **Banner:** Official Benefits Navigator
- **Features:** 5-step wizard for benefits screening
- **Footer:** Social Services links

### 5. eligibility-pro
- **Subtitle:** Eligibility Pro
- **Banner:** Official Benefits Navigator
- **Features:** Enhanced benefits screening
- **Footer:** Social Services links

### 6. eligibility-lite
- **Subtitle:** Eligibility Lite
- **Banner:** Official Benefits Navigator
- **Features:** Streamlined benefits screening
- **Footer:** Social Services links

### 7. license-wizard
- **Subtitle:** License Wizard
- **Banner:** Official Licensing Portal
- **Features:** Business license step-by-step guides
- **Footer:** Business Licensing links

### 8. event-permit-express
- **Subtitle:** Event Permit Express
- **Banner:** Official Event Permit Portal
- **Features:** Event type selection, attendance slider, permit checklist
- **Footer:** Parks & Recreation links

---

## Technical Implementation

### CSS Architecture
- **File:** `city-of-ashtabula.css` (shared across all sites)
- **Size:** ~16KB uncompressed
- **Features:**
  - CSS custom properties (variables)
  - Responsive breakpoints (mobile-first)
  - Print styles
  - Accessibility focus states
  - Reduced motion support

### Component Structure
```
src/
├── App.css (city-of-ashtabula.css)
├── App.jsx (main component with logo)
└── components/
    ├── CityOfAshtabulaLogo.jsx (SVG logo)
    └── Layout.jsx (for multi-page sites)
```

### Build Status
All sites build successfully with Vite:
- No build errors
- Optimized CSS/JS bundles
- Production-ready dist folders

---

## Visual Identity Checklist

- ✅ Municipal blue (#1e3a5f) as primary color
- ✅ Government gold (#d4af37) as accent
- ✅ White backgrounds with subtle Lake Erie wave pattern
- ✅ City of Ashtabula shield logo with lighthouse
- ✅ Official banner on all sites
- ✅ Consistent header/footer structure
- ✅ Professional typography (Source Sans Pro + Open Sans)
- ✅ Centered 800px max-width container
- ✅ Blue buttons with gold hover states
- ✅ Official seal decorations
- ✅ Civic grid/wave background patterns
- ✅ Trust badges and official indicators

---

## Professional Government Aesthetic Verification

| Criteria | Status |
|----------|--------|
| Official color scheme | ✅ Municipal blue, white, gold |
| Seal/logo present | ✅ Lighthouse shield on all pages |
| Official banner | ✅ Top banner on all sites |
| Professional typography | ✅ Source Sans Pro headings |
| Clean layout | ✅ 800px centered container |
| Trust indicators | ✅ Official badges, citations |
| Accessibility | ✅ Focus states, reduced motion |
| Print-friendly | ✅ Print styles included |
| Mobile responsive | ✅ Responsive breakpoints |
| Lake Erie coastal theme | ✅ Wave patterns, lighthouse imagery |

---

## Deliverables

1. **8 Branded Websites** - All with City of Ashtabula identity
2. **Shared CSS** - `city-of-ashtabula.css` for consistency
3. **Logo Component** - Reusable SVG lighthouse logo
4. **Build Output** - Production-ready dist folders
5. **This Report** - Complete documentation

---

## Next Steps (Optional)

1. **Deploy to Vercel** - All sites ready for deployment
2. **Add Favicon** - Create official city favicon.ico
3. **Meta Tags** - Add Open Graph images for social sharing
4. **Analytics** - Add municipal analytics tracking
5. **Accessibility Audit** - Run WCAG compliance check

---

**Prepared by:** Noirsys AI  
**For:** City of Ashtabula Building Department  
**Project:** New Ashtabula Initiative — Municipal Digital Services
