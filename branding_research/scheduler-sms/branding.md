# scheduler-sms — Brand Guide Specification

## Target Vertical
Any appointment-based business in Ashtabula County: HVAC contractors, salons, auto repair shops, medical/dental clinics. The SMS reminder layer is a companion to the base scheduler — not a replacement.

## Official Sources
- Source code: `websites/scheduler-sms/src/App.jsx`, `websites/scheduler-sms/src/App.css`
- No lead research JSON exists yet (buyer intelligence drawn from scheduler.json + live source analysis)
- Brand insights: `branding_research/brand_insights.md`

## Local Assets
- `branding_research/scheduler-sms/assets/` — directory created, no assets yet

---

## 1. Color Palette

### Core Palette

| Token | CSS Variable | Hex | Usage |
|-------|-------------|-----|-------|
| Primary | `--primary` | `#8b5cf6` | Accent text, trust icons, focus rings, brand tagline, links |
| Primary Dark | `--primary-dark` | `#7c3aed` | Heading text, brand name, feature headers, footer attribution |
| Primary Light | `--primary-light` | `#a78bfa` | Hover states, secondary decorative fills |
| Text | `--text` | `#0f172a` | Body text, form inputs text |
| Text Light | `--text-light` | `#64748b` | Supporting copy, sub-text, form labels |
| Silver | `--silver` | `#e2e8f0` | Card borders, input borders, section dividers |
| Silver Light | `--silver-light` | `#f1f5f9` | Input-card background gradient start, subtle fills |
| White | `--white` | `#ffffff` | Card backgrounds, text on accent |

### Success / Feedback Palette

| Token | CSS Variable | Hex | Usage |
|-------|-------------|-----|-------|
| Success | `--success` | `#10b981` | Success result pages, checkmark icon, result heading |
| Success Bg | `--success-bg` | `#d1fae5` | Success result card gradient background |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| Default shadow | `0 4px 24px rgba(0, 0, 0, 0.08)` | Brand header, feature cards |
| Large shadow | `0 8px 32px rgba(0, 0, 0, 0.12)` | Hero card, form card, result card |
| CTA shadow | `0 4px 16px rgba(139, 92, 246, 0.35)` | Primary button |
| CTA hover shadow | `0 8px 24px rgba(139, 92, 246, 0.45)` | Primary button hover |
| Feature hover shadow | `0 12px 32px rgba(0, 0, 0, 0.12)` | Feature card hover state |

### Backgrounds

**Page background**:
```css
background: linear-gradient(135deg, #faf5ff 0%, var(--white) 100%);
```

**Hero / form card**:
```css
background: var(--white);
box-shadow: 0 8px 32px var(--shadow-lg);
border: 1px solid var(--silver);
```

**Input card (right panel)**:
```css
background: linear-gradient(135deg, var(--silver-light) 0%, var(--white) 100%);
border: 2px solid var(--silver);
```

**Info box (sample message)**:
```css
background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
border: 1px solid #e9d5ff;
```

**Feature card bottom border** (default → hover):
```css
border-bottom: 3px solid var(--silver);
/* hover */
border-bottom-color: var(--primary);
```

**Success card**:
```css
background: linear-gradient(135deg, var(--success-bg) 0%, var(--white) 100%);
border-color: var(--success);
```

---

## 2. Typography

### Primary Font Stack

```css
body {
  font-family: 'Inter', system-ui, sans-serif;
}
```

Already loaded in the source CSS — use Inter as the design system font, falling back to native system fonts.

### Type Scale

| Role | Element / Class | Size | Weight | Line Height | Letter Spacing | Transform |
|------|----------------|------|--------|-------------|----------------|-----------|
| Brand Name | `.brand-name` | `1.6rem` | **700** | 1.2 | `-0.5px` | none |
| Brand Tagline | `.brand-tagline` | `0.75rem` | 500 | 1.4 | `1.5px` | uppercase |
| Page Heading | `h1` | `clamp(1.6rem, 4vw, 2.25rem)` | **700** | 1.2 | normal | none |
| Section Heading | `.card-header h2` | `1.25rem` | **700** | 1.3 | normal | none |
| Feature H3 | `.feature h3` | `1rem` | **700** | 1.4 | normal | none |
| Input Card H3 | `.input-card h3` | `1.1rem` | **700** | 1.3 | normal | none |
| Body Text | `p`, `.sub`, `.feature p` | `0.9rem — 1.05rem` | 400 | 1.6 | normal | none |
| Eyebrow | `.eyebrow` | `0.7rem` | **700** | 1.4 | `2px` | uppercase |
| Label | `label span` | `0.8rem` | **700** | 1.4 | `0.5px` | uppercase |
| Pill Tag | `.pill` | `0.7rem` | **700** | 1.4 | `1px` | uppercase |
| Trust Item | `.trust-item` | `0.85rem` | 500 | 1.4 | normal | none |
| Footer | `.footer p` | `0.9rem` | 400 | 1.6 | normal | none |
| Footer strong | `.footer p:first-child` | `0.9rem` | **700** | 1.6 | normal | none |
| Info text | `.info-box p` | `0.9rem` | 400 (italic) | 1.6 | normal | none |

### Color-Code Rules

| Context | Value |
|---------|-------|
| H1, brand name, feature H3, input card H3, footer strong | `var(--primary-dark)` — `#7c3aed` |
| Eyebrow, brand tagline, trust-item SVG, hover bottom-border | `var(--primary)` — `#8b5cf6` |
| Body text, hero sub, feature p, labels, quote text, footer | `var(--text-light)` — `#64748b` |

---

## 3. Spacing Guidelines

### Base Unit: `8px` — `16px` — `20px` — `24px` — `32px` — `40px`

| Element | Property | Value |
|---------|----------|-------|
| Page padding | `padding` | `24px` (desktop) → `20px` → `16px` (mobile) |
| Container max-width | `max-width` | `850px` |
| Header margin-bottom | `margin-bottom` | `32px` |
| Main content gap | `gap` | `24px` |
| Section gap | `gap` | `24px` |
| Card padding | `padding` | `32px` (form, result), `40px` (hero), `28px` (input-card, feature) |
| Brand padding | `padding` | `16px 28px` |
| Brand logo size | `width/height` | `56px` (desktop) → `48px` (mobile) |
| Form gap | `gap` | `20px` (between rows) |
| Two-col grid gap | `gap` | `16px` |
| Label → input gap | `gap` | `8px` |
| Input padding | `padding` | `14px 16px` |
| Button padding | `padding` | `16px 32px` (primary), `12px 24px` (secondary) |
| Footer margin-top | `margin-top` | `48px` |
| Footer padding | `padding` | `32px` |
| Trust items gap | `gap` | `24px` |
| Features grid gap | `gap` | `20px` |
| Feature card padding | `padding` | `28px 20px` |

### Border-Radius Scale

| Element | Radius | Context |
|---------|--------|---------|
| Brand header container | `12px` | `.brand` |
| Hero card | `16px` | `.hero-card` |
| Form card | `16px` | `.form-card` |
| Result card | `16px` | `.result-card` |
| Input card | `12px` | `.input-card` |
| Feature card | `12px` | `.feature` |
| Input fields | `8px` | `input, textarea, select` |
| Buttons | `8px` | `.primary, .secondary` |
| Info box | `8px` | `.info-box` |
| Pill tag | `4px` | `.pill` (intentionally sharp) |
| Success icon | `50%` | `.success-icon` |

---

## 4. UI Card Patterns

### A. Hero Card (`.hero-card`)
The primary value proposition container. Two-column grid on desktop, stacked on mobile.

```css
.hero-card {
  background: var(--white);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px var(--shadow-lg);
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 40px;
  align-items: start;
  border: 1px solid var(--silver);
}

@media (max-width: 900px) {
  .hero-card { grid-template-columns: 1fr; padding: 28px; }
}
```

**Left column**: Eyebrow + H1 + sub text + trust badges + (reserved for booking form)
**Right column**: Input card (`.input-card`) — need-help section with support info

### B. Form Card (`.form-card`)
The main interaction surface for configuring reminders.

```css
.form-card {
  background: var(--white);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 32px var(--shadow-lg);
  border: 1px solid var(--silver);
}
```

**Internal layout:**
- `.card-header` — flex row, title H2 left + `.pill` tag right
- `form` — flex column, `20px` gap
- `.form-row` — flex column, `8px` gap (label → input)
- `.form-row.two-col` — 2-column grid, `16px` gap (date+time, name+phone, timing+type)

### C. Result Card / Success (`.result-card.success`)
Post-submission confirmation view. Centered layout.

```css
.result-card.success {
  text-align: center;
  background: linear-gradient(135deg, var(--success-bg) 0%, var(--white) 100%);
  border-color: var(--success);
}
```

- Large green success icon circle (`64px`, `50%` radius)
- H2 in green, body in text-light, primary button below

### D. Feature Cards (`.features` grid)
3-column grid of service feature highlights.

```css
.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.feature {
  background: var(--white);
  border-radius: 12px;
  padding: 28px 20px;
  text-align: center;
  box-shadow: 0 4px 20px var(--shadow);
  border-bottom: 3px solid var(--silver);
  transition: all 0.3s ease;
}

.feature:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px var(--shadow-lg);
  border-bottom-color: var(--primary);
}
```

- Each feature: emoji icon (2rem) + H3 + paragraph
- Hover: lift `-4px`, shadow intensifies, bottom border turns purple

### E. Brand Header (`.brand`)
```css
.brand {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  background: var(--white);
  padding: 16px 28px;
  border-radius: 12px;
  box-shadow: 0 4px 24px var(--shadow);
  border-left: 4px solid var(--primary);
}
```

- Centered inline-block with a purple left accent border
- Contains: SVG logo (`56px`) + brand-text stack (name + tagline)

### F. Input Card (`.input-card`)
Right-panel helper card in the hero section.

```css
.input-card {
  background: linear-gradient(135deg, var(--silver-light) 0%, var(--white) 100%);
  border: 2px solid var(--silver);
  border-radius: 12px;
  padding: 28px;
  text-align: center;
}
```

### G. Info Box (`.info-box`)
Sample message preview — sits inside the form.

```css
.info-box {
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  border: 1px solid #e9d5ff;
  border-radius: 8px;
  padding: 16px;
}
```

### H. Primary Button (`.primary`)
```css
.primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: var(--white);
  border: none;
  padding: 16px 32px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.35);
}

.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(139, 92, 246, 0.45);
}
```

### I. Secondary Button (`.secondary`)
```css
.secondary {
  background: var(--white);
  color: var(--primary-dark);
  border: 2px solid var(--primary);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.secondary:hover {
  background: var(--primary);
  color: var(--white);
}
```

---

## 5. Iconography

The SMS logo icon (`.logo-icon`) is an SVG at `56px × 56px` rendering:
- Rounded chat bubble in `#8b5cf6` (purple) with `#7c3aed` stroke
- White horizontal message lines
- Speech-tail path below
- Green `#34d399` notification dot top-right (success indicator)

Supporting icons (MessageIcon, BellIcon, SmartphoneIcon) are all `18px × 18px` inline SVGs colored via parent `color: var(--primary)`.

Feature cards use emoji icons (📲, ✓, 📊) at `2rem` size — no SVG fallback needed.

---

## 6. Copy Tone Guidelines

- **Voice:** Direct, reassuring, capable. "Reduce no-shows with automated text reminders", "Set up once, we'll handle the rest"
- **Avoid:** "Powered by AI", "cutting-edge", "disruptive" — these alienate the buyer
- **Preferred:** "Reminders your customers will actually see", "Clients can confirm or cancel with a simple text reply"
- **Local:** Ashtabula County references throughout (footer: "Helping businesses reduce no-shows in Ashtabula County")

---

## 7. Brand Taglines & Value Props

| Tagline | Context |
|---------|---------|
| "Appointment Reminders" | Primary brand tagline (header) |
| "SMS Appointment Reminders" | Hero H1 |
| "Reduce no-shows with automated text and email reminders. Set up once, and we'll handle the rest." | Hero sub-text |
| "Helping businesses reduce no-shows in Ashtabula County" | Footer |
| "Track message delivery and client responses in real-time." | Features section |
| "Automated Messaging" | Eyebrow text |

---

## 8. Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| `≤900px` | Hero card → single column stack; features grid → single column; trust badges center-aligned; two-col form rows → single column |
| `≤600px` | Page padding → `16px`; all cards → `24px` padding, `12px` border-radius; brand header → compact `12px 20px`; logo → `48px`; brand name → `1.3rem` |

---

## 9. Design Token Summary (for CSS-in-JS / Design Library)

```json
{
  "colors": {
    "primary": "#8b5cf6",
    "primaryDark": "#7c3aed",
    "primaryLight": "#a78bfa",
    "text": "#0f172a",
    "textLight": "#64748b",
    "silver": "#e2e8f0",
    "silverLight": "#f1f5f9",
    "white": "#ffffff",
    "success": "#10b981",
    "successBg": "#d1fae5"
  },
  "typography": {
    "fontFamily": "'Inter', system-ui, sans-serif",
    "headingSizes": {
      "pageTitle": "clamp(1.6rem, 4vw, 2.25rem)",
      "sectionTitle": "1.25rem",
      "featureTitle": "1rem"
    },
    "labelSize": "0.8rem",
    "eyebrowSize": "0.7rem",
    "bodySize": "0.9rem"
  },
  "spacing": {
    "pagePadding": "24px",
    "cardPadding": "32px",
    "heroCardPadding": "40px",
    "formGap": "20px",
    "sectionGap": "24px",
    "borderRadiusCard": "16px",
    "borderRadiusInput": "8px",
    "borderRadiusPill": "4px"
  }
}
```

> This document is a practical reference for UI implementation. See `branding_research/brand_insights.md` for the buyer persona research behind these choices. Note: `lead_research_json/scheduler-sms.json` does not yet exist — it should be created when the SMS app receives its own dedicated buyer research pass.
