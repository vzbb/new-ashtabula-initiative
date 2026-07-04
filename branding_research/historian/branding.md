# Historian MVP — Brand Research Synthesis

**MVP slug:** `historian`
**Target organization:** Ashtabula County Historical Society (ACHS)
**Website:** https://ashtabulahistory.com/
**Founded:** 1838 (second oldest historical society in Ohio)
**Type:** All-volunteer organization
**Phone:** 866.533.3277
**Email:** ashcohs@gmail.com

> This document synthesizes findings from four upstream research tasks (typography, logo, imagery, colors) into a single reference for the historian MVP build. It also serves as the brand foundation for sibling ACHS-branded sites (`ai-docent-pro`, `historian-pro`).

---

## 1. Logo Assets

| File | Path (relative to project root) | Type | Dimensions | Source |
|------|--------------------------------|------|------------|--------|
| logo.png | `branding_research/historian/logo.png` | PNG (indexed color) | 1804×561 | Downloaded from official ACHS website |
| logo.svg | `branding_research/historian/logo.svg` | SVG (vector) | 1800×535 viewBox | Hand-traced reconstruction from PNG |
| logo-light.png | `branding_research/historian/logo-light.png` | PNG | Reduced | Light variant for dark backgrounds |
| bridge-logo.png | `branding_research/historian/bridge-logo.png` | PNG | 548×428 | Alternate bridge-themed button logo |

**Original source URL:** `https://ashtabulahistory.com/wp-content/uploads/2019/02/achslogo.png`

**Logo description:** Horizontal lockup with two elements:
- **Left — Icon mark:** Four vertical rectangular blocks in light blue (`#B3D7F2`), navy (`#1A124C`), terracotta (`#BC4530`), overlaid by a horizontal teal (`#36796A`) bar through their center
- **Right — Typography:** Two-line sans-serif wordmark. "ASHTABULA COUNTY" (bold, ~68pt, uppercase) above a horizontal separator bar, then "HISTORICAL SOCIETY" (regular weight, ~58pt, uppercase). Text in dark green (`#00614B`)

**Notes:** No SVG existed on the ACHS server (returned 404). The SVG was reconstructed from pixel-level analysis of the PNG. The SVG uses system fonts (Arial/Helvetica) for the wordmark — for production, Open Sans or Lato (all caps, semi-bold) would be a closer match to the original.

---

## 2. Color Palette

### Elementor Global Palette (Site-Wide Brand Colors)

These are the official ACHS brand colors, extracted from the WordPress Elementor kit CSS:

| Role | Hex | Name | Usage |
|------|-----|------|-------|
| **Primary** | `#00614B` | Deep Teal/Green | Nav background, buttons, section backgrounds, image borders, CTA backgrounds |
| **Secondary** | `#B3D6F1` | Light Sky Blue | Footer headings, icon lists, secondary brand elements |
| **Accent** | `#BB4430` | Terra Cotta/Red | Hover states, active nav, button hover, CTA hover, donate banner |
| **Gold** | `#c1b696` | Warm Beige/Gold | Theme hover accent, date markers, event booking buttons, link hovers |
| **Dark** | `#2A2A2A` | Dark Charcoal | Footer background |
| **Light text** | `#F5F5F5` | Off-White | Text on dark backgrounds (nav, footer) |
| **Body text** | `#555555` | Body Gray | Paragraph text on light backgrounds |
| **Heading text** | `#25282e` | Dark Slate | Section heading text on light backgrounds |

### Logo-Specific Colors (use only when rendering the logo or print materials)

| Hex | Name | Usage in Logo |
|-----|------|--------------|
| `#005048` | Dark Teal | Logo text, leftmost vertical block |
| `#A8D0E6` | Light Blue | Second vertical block |
| `#2A3A7C` | Dark Navy | Third vertical block (tallest) |
| `#C85A4E` | Brick Red | Fourth vertical block |
| `#2E6B5A` | Forest Green | Horizontal separator bar, background |

### Color Usage Rules

1. **Primary (`#00614B`)** is the dominant brand color — use for navigation bars, primary buttons, section backgrounds, borders, icon tinting
2. **Secondary (`#B3D6F1`)** is a light accent — use sparingly for footer headings, icon lists, airy highlight elements
3. **Accent (`#BB4430`)** is the interactive color — reserved for hover states, active navigation, secondary CTAs, urgency triggers. Avoid overuse
4. **Gold (`#c1b696`)** complements the accent for a warm heritage feel — use for date markers, event buttons, secondary hovers
5. **On dark backgrounds** (nav `#00614B`, footer `#2A2A2A`), text is always `#F5F5F5`
6. **On light backgrounds**, headings are `#25282e`, body text is `#555555`

### CSS Custom Properties

```css
--achs-primary:     #00614B;
--achs-secondary:   #B3D6F1;
--achs-accent:      #BB4430;
--achs-gold:        #c1b696;
--achs-dark:        #2A2A2A;
--achs-text:        #555555;
--achs-text-light:  #F5F5F5;
--achs-bg-light:    #f7f7f7;
--achs-bg-white:    #ffffff;
```

---

## 3. Typography

### Font Stack

| Context | Font | Category | Weights | Fallback |
|---------|------|----------|---------|---------|
| **Headings** (H1–H6) | Lora | Serif (slab-serif) | 400, 700 | `'Georgia', 'Times New Roman', serif` |
| **Body text** | Archivo | Sans-serif (grotesque) | 400, 500, 600, 700 | `'Helvetica Neue', 'Arial', sans-serif` |
| **Navigation** | Zilla Slab | Slab serif | 400 (at 17px) | `'Georgia', 'Times New Roman', serif` |

### Body Text Specs

- **Size:** 16px
- **Line height:** 28px (1.75)
- **Letter-spacing:** 0.2px
- **Color:** `#555555`

> **Critical:** The 1.75 line-height is essential for readability with historical/archive text content. Preserve this ratio.

### Typography Hierarchy

| Element | Font | Weight | Size | Line Height | Letter-spacing |
|---------|------|--------|------|-------------|----------------|
| H1 (page title) | Lora | 700 | 2.5rem | 1.2 | 0 |
| H2 (section) | Lora | 700 | 2rem | 1.3 | 0 |
| H3 (card) | Lora | 700 | 1.5rem | 1.3 | 0 |
| H4 (sub) | Lora | 400 | 1.25rem | 1.4 | 0 |
| Body | Archivo | 400 | 1rem | 1.75 | 0.0125rem |
| Body small | Archivo | 400 | 0.875rem | 1.6 | 0.0125rem |
| Nav / Menu | Archivo | 600 | 0.9375rem | 1.2 | 0.02rem |
| Button label | Archivo | 600 | 1rem | 1 | 0.02rem |
| Blockquote | Lora | 400 | 1.25rem | 1.5 | 0.01rem |
| Caption / Meta | Archivo | 400 | 0.8125rem | 1.5 | 0.02rem |

### Google Fonts Load

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Lora:wght@400;700&display=swap" rel="stylesheet">
```

**Total weight pairs loaded:** 6 (4 Archivo + 2 Lora) — well within reason. Use `display=swap`.

### Typography Notes

- Lora at zero letter-spacing gives headings natural authority without tracking
- No variable fonts needed — only fixed weights
- Archivo at 16px/28px with `#555555` passes WCAG AA (~5.3:1 contrast on white). For text under 14px, bump to `#444444`
- The logo wordmark font resembles **Open Sans** or **Lato** (humanist sans-serif, all caps)

---

## 4. Hero & Imagery Assets

**Location:** `branding_research/historian/assets/`

**10 images** covering 5 thematic categories, all 2000px+ wide:

| Category | Files | Count |
|----------|-------|-------|
| Maritime & Lighthouses | `ash_harbor_light.jpg`, `ash_lighthouse_historic.jpg`, `ash_lake_erie_breakers.jpg` | 3 |
| Covered Bridges | `ash_denmark_bridge.jpg`, `ash_harpersfield_bridge.jpg` | 2 |
| Underground Railroad | `ash_hubbard_house.jpg` | 1 |
| Historic Industrial | `ash_brownhoist_plant.jpg`, `ash_harbor_1906.jpg` | 2 |
| Scenic & River Views | `ash_river_scene.jpg`, `ash_conneaut_creek.jpg` | 2 |

**License mix:** 6 public domain (no attribution needed), 4 CC BY-SA (attribution required — see `assets/README.md` for exact credits).

**Recommended hero image:** `ash_harbor_1906.jpg` (5600×3598px panoramic view of Ashtabula Harbor — dramatic scale, public domain) or `ash_lighthouse_historic.jpg` (historic postcard with strong compositional anchor).

---

## 5. Brand Narrative

### Tagline (for historian MVP)
> **Preserve the Past. Discover Your Roots. Share the Story.**

### Slogan Ideas
- "Preserving Ashtabula County's Story Since 1838"
- "Where the Past Meets the Present"
- "Your Story. Our History. Ashtabula County."
- "Ashtabula County Has a Story Worth Telling"

### Brand Voice
Scholarly but warm, knowledgeable but accessible. Think of an enthusiastic archivist who loves sharing stories with anyone who asks. Heritage-rooted, community-first, proudly local. Not academic jargon — real history for real people.

**Key themes:** Roots, Bloom, Bridge (past to present), Discover

### Value Propositions for Historian MVP
- "Digitize 185+ years of Ashtabula County heritage"
- "Connect researchers, genealogists, and history lovers with your archives"
- "Preservation doesn't stop at the museum door — bring it online"

### Value Propositions for AI Docent Pro (sibling site)
- "Extend your all-volunteer team's reach across 3 museum properties"
- "Every visitor gets a guided tour, even when no docent is available"
- "185+ years of Ashtabula County history — now accessible to everyone"

### Organization Details
- **President:** Wardrop
- **Vice President:** Wright
- **Secretary:** Sowry
- **Treasurer:** Blessing
- **Properties:** Jennie Munger Gregory Museum + 2 additional museum properties
- **Services:** On-site research library, preservation programs, membership, volunteer opportunities

---

## 6. Design Tokens & Implementation Notes

### Design Tokens
- **Spacing scale:** 4px grid (theme default)
- **Border radius:** 0px (Elementor uses square buttons throughout)
- **Button default:** `background-color: #00614B; color: #FFFFFF; border: 2px solid #e5e5e5; padding: 13px 40px;`
- **Button hover:** `background-color: #BB4430; color: #ffffff; border-color: #BB4430;`

### Implementation Notes for Developers

1. **Use Elementor global palette** for primary brand fidelity. Logo colors (`#005048`, `#A8D0E6`, `#C85A4E`) should only appear when rendering the logo itself or in print-adjacent materials.
2. **Preserve the 1.75 line-height** on body text — this is critical for readability of historical/archive content, especially for older audiences.
3. **Lora headings at 0 letter-spacing** — the font's natural width gives it authority at display sizes without needing tracking.
4. **On dark backgrounds** (nav #00614B, footer #2A2A2A), text is always `#F5F5F5` off-white.
5. **On light backgrounds**, headings use `#25282e` dark slate and body uses `#555555`.
6. **WCAG AA compliance:** Archivo at 16px/28px with `#555555` on white passes (~5.3:1). For text under 14px, darken to `#444444`.
7. **No variable fonts needed** — the site only loads 4 fixed weights of Archivo and 2 of Lora.
8. **Gold accent (#c1b696)** is baked into the theme interaction layer — complement the Elementor accent (`#BB4430`) with this for a warm heritage feel.
9. **Hero imagery:** Historical photographs (pre-1923, public domain) are always preferred over modern stock photos. The assets folder contains excellent candidates.
10. **Favicon:** Use a cropped version of the icon mark (the four colored bars) at 32×32 and 16×16.

---

## 7. Asset Inventory

| Category | Location | Files |
|----------|----------|-------|
| Brandkit JSON | `brandkits/historian.json` | 1 |
| Brand research | `branding_research/historian/branding.md` | 1 |
| Logo (PNG) | `branding_research/historian/logo.png` | 1 |
| Logo (SVG) | `branding_research/historian/logo.svg` | 1 |
| Logo (light) | `branding_research/historian/logo-light.png` | 1 |
| Bridge logo | `branding_research/historian/bridge-logo.png` | 1 |
| Hero/imagery assets | `branding_research/historian/assets/` | 10 JPG + 1 README |

---

## 8. Upstream Research Sources

This document synthesizes work from four upstream research tasks:

| Task | Topic | Key Finding |
|------|-------|-------------|
| t_05e298cc | Typography | Lora (headings) + Archivo (body) from live site CSS |
| t_0a60ecae | Logo | Official 1804×561 PNG downloaded; SVG reconstructed |
| t_ac11f547 | Imagery | 10 public-domain/freely-usable Ashtabula images |
| t_d5912529 | Colors | Elementor palette: primary #00614B, accent #BB4430 |

**Additionally:** The sibling `brandkits/achs.json` and `branding_research/achs/` directory contain the same research organized for the "achs" MVP slug. The historian variant here is the canonical synthesis for the `historian` site.

---

*Assembled 2026-07-04 for the New Ashtabula Initiative by Noirsys. Verified against live site at https://ashtabulahistory.com/.*
