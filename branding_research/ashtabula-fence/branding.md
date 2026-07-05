# Thomas Fence Co. — Brand Identity & Assets

## Target Buyer
**Thomas Fence Co.** — 50+ year family-owned fence contractor serving Northeast Ohio and Northwest Pennsylvania.
- **Website:** https://thomasfence.com/
- **Legal Name:** Thomas Fence Co. Inc.
- **Type:** Residential & Commercial Fence Contractor
- **Service Area:** Lake, Geauga, Ashtabula, Trumbull, Mahoning, Portage, Stark, Cuyahoga counties (OH) + northern Pennsylvania
- **Phone:** 440-998-4747 (Ashtabula) · 440-942-8548 (Lake/Geauga)
- **Social:** Facebook (thomasfence.ashtabula), X/Twitter (@ThomasFenceOhio), Instagram (thomasfencecompany)
- **CMS:** WordPress + Divi theme (v4.27.7), Yoast SEO, Google Tag Manager, Pirsch analytics

## Brand Voice
- **Tone:** Established, trustworthy, family-oriented, professional
- **Voice characteristics:** Direct, knowledgeable, no-nonsense, proud of craft
- **Key differentiators:** 50 years family-owned, no subcontractors (employees only), in-house welding/fabrication shop, fully insured and bonded
- **Established year:** 1972 (per logo) — brand has used both "40+" and "50+" years in different contexts; **use "over 40 years" as canonical** per Yoast site description

## Taglines & Positioning

**Primary tagline (from live site Yoast):**
> *"Where Our Customers and Quality have come first for over 40 years"*

**Title tag / H1:**
> "Fence Contractor Northeast Ohio — Thomas Fence Co."

**Meta description (live site):**
> "Ashtabula and nearby areas top fence company for over 50 years, we know our customers. We build both commercial fence and residential fence."

**Secondary messaging:**
- "Family-Owned & Operated Since 1972"
- "No Subcontractors — Our Employees Do the Work"
- "Design, Build & Install — Custom Gates & Fabrication In-House"
- "Serving Northeast Ohio & Northern PA for Over 50 Years"
- "Thomas Fence Co. — Built to Last"

**Positioning statement:**
The digital extension of Thomas Fence Co.'s 50-year legacy — bringing their no-subcontractor, employee-only craftsmanship to modern online scheduling and quoting across 8 Ohio counties and northern PA.

## Services Offered
- Residential fencing (wood, cedar, vinyl, aluminum, chain link)
- Commercial and industrial fencing
- Custom swing gates, cantilever gates, overhead slide gates
- Custom dog kennels
- Welding and fabrication (in-house shop)

## Color Palette

Derived from live site CSS and brand materials. The brand green `#017f01` is the canonical primary — used directly as `background-color` on the site's contact bar.

| Token | Hex | Usage |
|-------|-----|-------|
| Primary green | `#017f01` | Headers, primary brand element, contact bar backgrounds |
| Primary dark | `#14532d` | Depth, footer backgrounds, strong CTAs |
| Accent green | `#4caf50` | Buttons, interactive elements, highlights |
| Surface green | `#f3faf3` | Light tinted backgrounds, card surfaces |
| Border green | `#cfe7cf` | Borders, dividers, subtle separators |
| Background | `#ffffff` | Page backgrounds, card surfaces |
| Text | `#333333` | Body copy, descriptions |
| Header dark | `#171717` | Top contact bar band, dark chrome |

**CSS custom properties (as implemented in MVP):**
```css
--tf-primary:        #017f01
--tf-primary-dark:   #14532d
--tf-accent:         #4caf50
--tf-surface:        #f3faf3
--tf-border:         #cfe7cf
```

## Typography

| Role | Font Family | Weights | Source |
|------|-------------|---------|--------|
| **Headings** | Oswald | 200, 300, 400, 500, 600, 700 | Google Fonts |
| **Body** | Roboto | 100, 300, 400, 500, 700, 900 | Google Fonts |
| **Fallback body** | Inter | 400, 500, 600, 700 | Google Fonts (already loaded in MVP) |
| **Mono** | JetBrains Mono | 400, 500 | Google Fonts (for measurements/pricing) |

**CSS custom properties (as implemented in MVP):**
```css
--font-heading: "Oswald", ui-sans-serif, system-ui, sans-serif;
--font-sans:    "Roboto", "Inter", ui-sans-serif, system-ui, sans-serif;
--font-mono:    "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
```

**Notes:**
- Oswald/Roboto matches the live WordPress site's `et-builder-googlefonts-cached-inline` configuration
- Inter is acceptable as a Roboto fallback where load budget is tight
- Maintain Georgia/serif for any print materials or legacy brand references

## Logo Specifications

**Primary logo:** Circular badge with stylized fence picket graphic in forest green tones.

**Construction:**
- Outer circle with gradient green stroke (#228B22 → #006400)
- Inner decorative dashed ring for detail
- Six fence pickets with pointed tops across two horizontal rails — centered in the badge
- Decorative stars (flag-inspired, 15% opacity) flank the fence graphic
- **Text:** "THOMAS" (top, Georgia/serif, 42px, bold, letter-spacing 3) | "FENCE CO." (bottom, Georgia/serif, 28px, weight 600, letter-spacing 6) | "Est. 1972" (tagline, italic, letter-spacing 4)
- Bottom decorative bar accent

**Format:** SVG (vector source) + PNG (raster fallback)
**Color:** Gradient forest green (#228B22 → #006400) on white background
**Minimum size:** 120px wide (display), 32px (favicon)

## Visual Direction
- **Hero image concept:** Completed fence installation at golden hour — residential backdrop showcasing craftsmanship
- **Photography style:** Professional fence installation photos, crew at work, completed projects from the live site's gallery (Photoswipe masonry layout)
- **Local elements:** American flag (patriotism/local pride), Ohio landscape references
- **Mood keywords:** Established, trustworthy, family-owned, professional, local, craftsmanship
- **Live site image style:** Real project photos (not staged), mix of residential backyards and commercial installations, natural lighting

## Industry Terminology
Use these terms naturally in copy:
- Split rail fence, privacy fence, stockade fence
- Cantilever gate, swing gate, slide gate (their fabrication specialties)
- Chain link, woven wire
- Pressure-treated, cedar, vinyl, aluminum
- Post & rail
- Commercial, industrial, residential (they do all three)
- Permits, property lines, easements, zoning (common customer questions)

## Copy Snippets

| Context | Copy |
|---------|------|
| **Hero headline** | "40+ Years of Family-Owned Fencing. No Subcontractors. No Shortcuts." |
| **Hero subheader** | "Thomas Fence Co. serves Ashtabula and 8 counties across Northeast Ohio and northern Pennsylvania with employee-only crews and in-house fabrication." |
| **Value Prop 1** | "Built by Thomas. Every fence, gate, and kennel is installed by our own employees — never subcontracted." |
| **Value Prop 2** | "Custom fabrication from our own shop. Welded gates, cantilever slides, and dog kennels designed to your specs." |
| **Value Prop 3** | "8-county coverage. From Ashtabula to Cuyahoga, plus northern PA. We know the terrain, the codes, and the property lines." |
| **Primary CTA** | "Get Your Free Quote" |
| **Footer tagline** | "Where our customers and quality come first." |

## Local References
- Ashtabula County (headquarters/service hub — phone 440-998-4747)
- Lake/Geauga (secondary phone 440-942-8548)
- Lake Erie shoreline (regional landmark)
- Northeast Ohio (primary service region)
- Pennsylvania border counties (secondary service area)

## Asset Inventory

All brand assets located under `branding_research/ashtabula-fence/assets/`.

### Logos
| File | Format | Resolution | Path |
|------|--------|------------|------|
| Primary logo | SVG | Vector | `assets/logo-thomas-fence.svg` |
| Primary logo | PNG | ~1254×1254 | `assets/logo-thomas-fence.png` |

### Favicons
| File | Format | Size | Path |
|------|--------|------|------|
| Favicon large | PNG | 32×32 | `assets/favicon-32.png` |
| Favicon small | PNG | 16×16 | `assets/favicon-16.png` |

*Note: Live site favicon is a split-rail fence photo crop. The generated favicon uses the circular badge logo.*

### Hero Images
| File | Format | Dimensions | Path |
|------|--------|------------|------|
| Hero banner | JPG | 1536×1024 | `assets/hero-thomas-fence.jpg` |

## Brandkit Reference
The canonical brandkit JSON is at `brandkits/ashtabula-fence.json`.

## Usage Guidelines
1. **Primary green `#017f01`** is the canonical brand color — use for all primary brand elements, contact bars, and header accents. Do NOT substitute `#228B22` unless matching the specific logo gradient.
2. Logo should sit on white or light gray backgrounds — not on dark backgrounds unless an inverted version is prepared.
3. Keep the family-owned legacy as a prominent trust signal in all copy — both "over 40 years" (canonical per Yoast) and "Est. 1972" (per logo) are valid.
4. Emphasize **"no subcontractors"** — this is the key differentiator from competitors. "Every Thomas fence is built by Thomas employees."
5. Reference the in-house fabrication shop for custom gate work — this is a unique capability.
6. Always mention service area coverage (8 counties + PA) with both phone numbers when relevant.
7. Headings use Oswald (weights 400–700). Body uses Roboto (weights 300–400 for text, 500–700 for emphasis).
8. The SVG logo is the source of truth. PNG is a raster fallback for email signatures or legacy systems.
9. Hero imagery should show real residential/commercial installations — not staged stock photography. The live site uses Photoswipe galleries of actual project photos.
10. Social media icons: Facebook, X/Twitter, Instagram — link to the live site accounts.

## Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Logo SVG | Generated | `assets/logo-thomas-fence.svg` — circular badge with fence pickets |
| Logo PNG | Generated | `assets/logo-thomas-fence.png` — 1254×1254 raster fallback |
| Favicon 32px | Generated | `assets/favicon-32.png` |
| Favicon 16px | Generated | `assets/favicon-16.png` |
| Hero image | Generated | `assets/hero-thomas-fence.jpg` — 1536×1024 residential fence at golden hour |
| Brandkit JSON | Complete | `brandkits/ashtabula-fence.json` |
| CSS variables | Implemented in MVP | `websites/thomas-fence/src/index.css` — all `--tf-*` tokens |
| Typography | Implemented in MVP | Oswald (headings) + Roboto (body) via Google Fonts import |
| MVP website | Built | `websites/thomas-fence/` — live at `/thomas-fence/` route |
