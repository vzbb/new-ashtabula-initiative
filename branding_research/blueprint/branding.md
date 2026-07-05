# Ashtabula County Building Department — Brand Identity

## Brand Overview

**Organization:** Ashtabula County Building Department
**Jurisdiction:** Ashtabula County, Ohio
**Website:** https://www.ashtabulacounty.us/181/Building
**Certification:** Ohio Board of Building Standards

The Building Department is the official county authority responsible for the enforcement of Ohio Building Codes, ensuring the health, safety, and welfare of Ashtabula County residents through plan review, inspections, and professional consultation.

## Brand Voice & Tone

### Voice Principles
- **Authoritative** — Speak as the official county authority. We enforce Ohio Building Code.
- **Service-oriented** — We exist to help builders, contractors, and residents build safely and legally.
- **Clear & Direct** — No ambiguity. Building codes are precise, so our communication is precise.
- **Professional** — Government/municipal tone. Respectful, competent, trustworthy.

### Tone by Context
| Context | Tone | Example |
|---------|------|---------|
| Hero / Landing | Welcoming + authoritative | "Welcome to the Ashtabula County Building Department — serving builders and residents since [year]." |
| Feature descriptions | Clear, benefit-focused | "Upload blueprints for faster, more efficient plan review. Reduce the current 30-day review cycle." |
| CTAs | Direct, action-oriented | "Submit Your Blueprint" / "Start Your Plan Review" |
| Error/empty states | Helpful, not technical | "Analysis will appear here. Enter your project details to begin." |
| Footer | Official, formal | "Enforcing Ohio Building Codes for the health, safety, and welfare of our residents." |

### Do/Don't
| ✅ Do | ❌ Don't |
|-------|----------|
| Use "Ashtabula County Building Department" on first reference | Call it "Blueprint Analyzer" |
| Reference Ohio Building Code standards | Use "Gemini-powered" or "AI-driven" language |
| Sound like a government service | Sound like a startup or tech product |
| Use "plan review", "inspections", "permits" | Use "risk intelligence", "spot risks" |
| Keep text clean and professional | Use dark mode, glowing orbs, glass morphism |

## Brand Narrative

The Ashtabula County Building Department has served the county's building community for decades, ensuring every structure meets Ohio's rigorous building codes. Our mission: protect the health, safety, and welfare of Ashtabula County residents through professional plan review, thorough inspections, and expert code consultation.

Now, we're bringing that same commitment to service into the digital age. Our new Digital Blueprint Management platform streamlines the plan review process — making it faster, more transparent, and easier than ever for builders and contractors to get their projects approved.

Built on the same standards that have guided Ohio construction for generations, but delivered with the speed and convenience today's builders expect.

## Official Tagline

> Digital Blueprints. Faster Reviews. Better Buildings.

## Value Propositions

### Streamlined Plan Review
Upload digital blueprints for faster, more efficient plan review. Reduce the current 30-day review cycle with online submission, real-time status tracking, and electronic markup capabilities.

### Ohio Building Code Compliant
All reviews conducted in accordance with Ohio Building Code standards, certified by the Ohio Board of Building Standards. Every plan receives the same rigorous, professional review our department is known for.

### Integrated with Citizenserve
Seamlessly connects to the existing Ashtabula County Online Customer Portal for permits, inspections, and payments. One unified system for all your building needs.

## Key Services
- Plan review services for residential and non-residential projects
- Building inspections at all stages of construction
- Distribution of building code information
- Professional consultation for builders, architects, and homeowners

## Official Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Primary (Navy) | `#1B4F72` | Header bg, primary buttons, headings, footer bg |
| Primary Dark | `#0D324D` | Button hover, active states |
| Accent (Blue) | `#2980B9` | Links, secondary buttons, input focus |
| Accent Light | `#5DADE2` | Hover states, highlights |
| Gold | `#d4af37` | CTAs, accent badges, decorative elements |
| Gold Light | `#e5c158` | Gold hover states |
| Background | `#F8F9FA` | Page background (light, clean) |
| Card BG | `#FFFFFF` | Cards, panels, containers |
| Text | `#2C3E50` | Body text, readability |
| Text Muted | `#5D6D7E` | Secondary text, metadata |

## Typography

### Headings: Merriweather
Google Font: `Merriweather:wght@400;700;900`
- H1: 2.25rem / 36px — Hero headlines
- H2: 1.75rem / 28px — Section titles
- H3: 1.375rem / 22px — Card titles
- H4: 1.125rem / 18px — Subsection titles

### Body: Lato
Google Font: `Lato:wght@300;400;700`
- Body: 1rem / 16px
- Small: 0.875rem / 14px
- Caption: 0.75rem / 12px

## Contact Information
- **Non-residential plan review:** TMFrench@ashtabulacounty.gov
- **Residential plan review:** CAEllsworth@ashtabulacounty.us
- **Phone:** (440) 576-3737 (Ashtabula County main — verified from official county directory)
- **Address:** Ashtabula County Courthouse, 25 W. Jefferson Street, Jefferson, OH 44047

## Asset Inventory

| Asset | Path | Format | Notes |
|-------|------|--------|-------|
| Department Logo | `branding_research/blueprint/logo.svg` | SVG | Primary header logo — seal + dept name |
| Department Logo | `branding_research/blueprint/logo.png` | PNG | 1254×1254 raster fallback |
| County Seal | `branding_research/blueprint/seal-county.svg` | SVG | Full official seal for footer |
| Seal Mark | `branding_research/blueprint/seal-mark.svg` | SVG | Isolated A+courthouse icon |
| Favicon | `branding_research/blueprint/favicon.png` | PNG | 32×32 browser tab icon |
| Favicon (16px) | `branding_research/blueprint/favicon-16.png` | PNG | Small favicon variant |
| Favicon (32px) | `branding_research/blueprint/favicon-32.png` | PNG | Standard favicon variant |
| Favicon ICO | `branding_research/blueprint/favicon.ico` | ICO | Multi-size legacy favicon |
| Hero Image | `branding_research/blueprint/hero.jpg` | JPG | 1672×941 hero background |

## Implementation Checklist for Shaw

### Colors to Replace (tailwind.config.js)
- `background: "#0a0a0f"` → `"#F8F9FA"`
- `primary.DEFAULT: "#a855f7"` → `"#1B4F72"`
- `secondary.DEFAULT: "#00d4ff"` → `"#2980B9"`
- Remove `accent.cyan` and `accent.purple` — replace with accent tokens

### Fonts to Replace
- Remove `Space Grotesk` import, add `Merriweather + Lato`
- Update `fontFamily.sans` to use Lato
- Add `fontFamily.heading` for Merriweather

### Content to Update (App.jsx)
1. **Header logo:** Replace compass icon + "Blueprint Analyzer" with seal + "Ashtabula County Building Department"
2. **Hero eyebrow:** "AI Risk Analysis" → "Official Ashtabula County Building Department"
3. **Hero headline:** "Spot risks before they cost money" → "Digital Blueprints. Faster Reviews. Better Buildings."
4. **Hero subtitle:** Remove "Gemini-powered" — replace with department mission language
5. **CTA buttons:** "Generate Summary" → "Submit Your Blueprint" / "Book consult" → "Schedule a Consultation"
6. **Feature cards:** Rewrite with department-specific value props
7. **Footer:** "Local Builders • Ashtabula County, OH" → official department footer with contact info
8. **"Gemini API" badges:** Replace with "Ohio Building Code Certified" or similar

### Remove Completely
- Animated gradient orbs (`orb orb-cyan`, `orb orb-purple`)
- Glass-morphism effects (`glass-panel`, `glass-card`)
- Dark backgrounds and purple/cyan accent classes
- "Powered by Gemini 2.5 Flash" text

### Add
- County seal SVG in header (import from brand assets path)
- Contact: TMFrench@ashtabulacounty.gov, CAEllsworth@ashtabulacounty.us
- Light background with navy/gold accents throughout
- Professional padding and spacing per brandkit spacing scale
- Hero image (`hero.jpg`) as section background
- Link to official county website: ashtabulacounty.us/181/Building
