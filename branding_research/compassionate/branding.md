# Branding — Ducro Funeral Services / Compassionate Planner

## Business Profile
- **Business:** Ducro Funeral Services & Crematory
- **Website:** ducro.com
- **Address:** 4524 Elm Ave, Ashtabula, OH 44004
- **Phone:** (440) 992-2191
- **Established:** 1853 (170+ years serving Ashtabula County)
- **Additional Locations:** Pierpont, North Kingsville (Greenlawn Memory Gardens)
- **Tagline:** "Serving Ashtabula County families for 170+ years"

## Visual Identity

### Color Palette (NAI Compassionate Planner)
| Token | Hex | Usage |
|-------|-----|-------|
| Sage (Navy) | `#22314f` | Primary dark, backgrounds, feature icons |
| Sage Dark | `#15253d` | Button hover, deeper accents |
| Rose (Gold) | `#c7a45a` | Primary accent, CTAs, gold trim |
| Rose Dark | `#7a5a1d` | CTA hover, text highlights |
| Cream | `#f7f3ea` | Page background, subtle contrast |
| Warm Gray | `#2f3f59` | Body text, footer bg |
| White | `#ffffff` | Cards, overlays |

### Typography
- **Headings:** Crimson Pro (serif) — weight 600, elegant traditional feel matching Ducro's heritage
- **Body:** Inter (sans-serif) — weights 400/500, clean and readable
- **Logo treatment:** "Ducro Funeral Services" in Crimson Pro serif, "Legacy Link" in uppercase sans-serif with letter-spacing

### Voice & Tone
- **Compassionate** — gentle, understanding, never pushy
- **Dignified** — respectful of grief, honoring the deceased
- **Clear** — straightforward information, no jargon
- **Local** — grounded in Ashtabula County, referencing local landmarks and community

### Taglines & Copy
- Primary: "Plan with dignity, peace, and clarity."
- Eyebrow: "Compassionate planning support"
- Subtitle: "Guiding Ashtabula County families through end-of-life arrangements with a gentle, step-by-step approach. Remove the burden of guesswork for those you love."
- Footer: "Serving Ashtabula County Families for 130+ Years"
- Sub-brand: "Legacy Link" (the digital planning tool)

## Brand Narrative
Ducro Funeral Services has been a pillar of Ashtabula County since 1853. The "Legacy Link" digital planning tool extends their tradition of compassionate service into the digital age — helping families document wishes, reduce stress during crisis, and ensure that personal preferences are honored. The brand bridges old-world dignity with modern convenience.

## Asset Inventory

### Photography Assets
| File | Size | Description | Usage |
|------|------|-------------|-------|
| `hero.webp` | 120KB (1920x853) | Lake Erie shoreline at golden hour — peaceful water, wooden bench, autumn tree | Hero background section (step 0) |
| `hero-1280.webp` | 106KB (1280x720) | Same scene, smaller | Mobile/tablet fallback |
| `chapel.webp` | 76KB (1920x853) | Warm funeral home chapel interior — wooden pews, floral arrangements, tree of life emblem | Optional secondary hero / about section |
| `chapel-1280.webp` | 66KB (1280x720) | Same scene, smaller | Mobile/tablet fallback |
| `favicon.ico` | 5.4KB (16x16 + 32x32) | Ducro logo as favicon | Browser tab icon |

### Pattern Assets
| File | Size | Description | Usage |
|------|------|-------------|-------|
| `assets/pattern-warm.webp` | 4.4KB (800x800) | Subtle warm gold/cream watercolor pattern | Feature card background overlay (12% opacity) |
| `assets/pattern-navy.webp` | 9.5KB (800x800) | Subtle navy/gold abstract organic pattern | Available for alternate card backgrounds |

### Logo Assets (Existing)
| File | Size | Description |
|------|------|-------------|
| `ducro-logo.png` | 61KB (422x237) | Ducro silver metallic plaque-style logo |

### Site Implementation
- **Code references:** `App.jsx` uses `import.meta.env.BASE_URL` for all asset paths
- **Hero image:** Rendered as `<img>` inside `.hero-image-overlay` overlay div with gradient overlay on top
- **Pattern:** Rendered as `.feature-pattern-overlay` div with CSS `background-image` set via inline style
- **Image optimization:** All images in WebP format, sized for 1920px+ displays

## Design Decisions
1. **Lake Erie shore hero** chosen over chapel interior for the main hero because it conveys peace and tranquility without being morbid or directly funeral-related. It grounds the site in Ashtabula's natural landscape.
2. **Gradient overlay** (navy-to-cream) ensures text readability while preserving the emotional quality of the photograph.
3. **Feature card patterns** at 12% opacity are barely perceptible — they add visual richness without distracting from content.
4. **Ducro's own brand** on their live site uses a family lifestyle photo approach, so a nature scene aligns with that philosophy of celebrating life.
