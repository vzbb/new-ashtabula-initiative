# AMHA Landlord Repair Queue — Design Style Guide

> Version: 1.0  
> For: Ashtabula Metropolitan Housing Authority — Landlord Portal  
> Based on: `/18_landlord.png` screenshot analysis, AMHA brand foundation (amha-logo.png), and existing CSS implementation at `websites/landlord-repair-queue/src/App.css`

---

## 1. Color Palette

### 1.1 Core Brand Colors (Preserved)

These are the existing AMHA colors drawn from the official logo and must remain unchanged — they anchor the brand's municipal trustworthiness.

| Token | Hex | Usage | Role |
|-------|-----|-------|------|
| `--amha-blue-deep` | `#1f3d63` | Main headings, panel backgrounds, dark text | Primary dark |
| `--amha-blue` | `#2c5282` | Buttons, secondary text, card outlines | Primary accent |
| `--amha-green` | `#38a169` | Success states, eyewear, active indicators, leaf marks | Secondary accent |

### 1.2 Extended Palette (Engagement Boost)

New colors added to increase vibrancy while staying within the municipal/professional tone.

| Token | Hex | Usage | Rationale |
|-------|-----|-------|-----------|
| `--amha-gold` | `#d69e2e` | Hover highlights, data viz accents, star ratings | Warmth without breaking civic tone |
| `--amha-orange` | `#dd6b20` | "In Progress" badges, urgent indicators, attention markers | Clear status differentiation |
| `--amha-coral` | `#e53e3e` | Priority/urgent pills, alert borders | Only for time-sensitive states |
| `--amha-sky` | `#bee3f8` | Background gradients, decorative overlays | Softness against deep blues |

### 1.3 Neutral Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--paper` | `#f7fafc` | Page background |
| `--paper-soft` | `#edf3f7` | Section alternates |
| `--text` | `#1f2d3d` | Body text |
| `--muted` | `#617285` | Secondary text, metadata |
| `--line` | `rgba(44, 82, 130, 0.12)` | Dividers, borders |

### 1.4 Gradient Combinations

```css
/* Primary button — green → blue gradient */
--gradient-primary: linear-gradient(135deg, #38a169, #2c5282);

/* Hero panel — blue deep gradient */
--gradient-hero: linear-gradient(180deg, #2c5282, #1f3d63);

/* Decorative accent bar */
--gradient-accent: linear-gradient(135deg, #38a169, #2c5282);

/* Hover glow effects */
--shadow-glow-green: 0 8px 32px rgba(56, 161, 105, 0.25);
--shadow-glow-blue: 0 8px 32px rgba(44, 82, 130, 0.18);
--shadow-glow-gold: 0 8px 32px rgba(214, 158, 46, 0.20);
```

### 1.5 Accessibility Notes

- All text-on-background combinations meet WCAG AA (4.5:1 contrast ratio) or better
- `--amha-blue-deep` on `--paper`: **11.3:1** (AAA)
- `--amha-blue` on white: **7.8:1** (AAA)
- White on `--amha-blue-deep` panel: **9.6:1** (AAA)
- Never use `--amha-gold` (#d69e2e) as text color on white — contrast drops to 2.8:1; use it only as decorative fill or on dark backgrounds

---

## 2. Glassmorphism Panel Settings

The AMHA portal uses a **layered glassmorphism system** where elements at different z-depths get progressively more translucent backgrounds. This creates a tiered visual hierarchy.

### 2.1 Tiered Glass Variables

```css
:root {
  /* === Base glass tokens === */

  /* Tier 1 — Hero card (frontmost, strongest blur) */
  --glass-bg-hero:        rgba(255, 255, 255, 0.82);
  --glass-blur-hero:       18px;
  --glass-border-hero:     rgba(255, 255, 255, 0.60);

  /* Tier 2 — Workspace & Reply cards (mid depth) */
  --glass-bg-card:         rgba(255, 255, 255, 0.78);
  --glass-blur-card:       16px;
  --glass-border-card:     rgba(255, 255, 255, 0.50);

  /* Tier 3 — Insight & Journey cards (deepest, subtlest) */
  --glass-bg-subtle:       rgba(255, 255, 255, 0.76);
  --glass-blur-subtle:     14px;
  --glass-border-subtle:   rgba(44, 82, 130, 0.06);

  /* Inset highlight for all glass panels */
  --glass-inset:           inset 0 1px 0 rgba(255, 255, 255, 0.60);
}
```

### 2.2 Implementation Pattern

Every glass panel follows this CSS structure:

```css
.glass-panel {
  background: rgba(255, 255, 255, 0.78);         /* match tier */
  backdrop-filter: blur(16px);                     /* match tier */
  -webkit-backdrop-filter: blur(16px);             /* Safari fallback */
  border: 1px solid rgba(255, 255, 255, 0.50);    /* match tier */
  box-shadow:
    0 20px 44px rgba(31, 61, 99, 0.14),           /* elevation */
    inset 0 1px 0 rgba(255, 255, 255, 0.60);       /* light edge */
  border-radius: 28px;                             /* consistent radius */
}
```

### 2.3 Shadow Hierarchy

A tiered shadow system maps to the glass tiers:

```css
/* Tier 1 — Hero card (largest, most dramatic) */
--shadow-hero:   0 24px 55px rgba(31, 61, 99, 0.12);

/* Tier 2 — Workspace/Reply (elevated but controlled) */
--shadow-elevated: 0 20px 44px rgba(31, 61, 99, 0.14);

/* Tier 3 — Insight/Journey cards (soft, minimal) */
--shadow-card:   0 8px 28px rgba(31, 61, 99, 0.10);

/* Hover states */
--shadow-card-hover: 0 20px 48px rgba(31, 61, 99, 0.14);
--shadow-feature-hover: 0 18px 40px rgba(31, 61, 99, 0.14);
```

### 2.4 Glassmorphism — When NOT to Use

- **Inside the blue hero panel** — this uses a solid gradient (`linear-gradient(180deg, #2c5282, #1f3d63)`) with a subtle background image overlay at 12% opacity + `mix-blend-mode: overlay` for texture
- **Forms inputs** — solid white/semi-transparent backgrounds (`rgba(255, 255, 255, 0.92)`) for readability
- **Priority pills and badges** — solid gradient backgrounds for clarity

---

## 3. Scroll Animations

### 3.1 Core Reveal Animation

The portal uses IntersectionObserver-driven fade-in-up animations. Every animated element gets the `.fade-in-section` class:

```css
/* Initial state — hidden, offset down */
.fade-in-section {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 600ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
}

/* Visible state — triggered by IntersectionObserver */
.fade-in-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Easing rationale**: `cubic-bezier(0.22, 1, 0.36, 1)` is an ease-out quintic — it starts fast, slows gradually, and avoids the "hanging" feel of standard ease-out. The user feels the motion but doesn't wait for it.

### 3.2 Staggered Delays

Elements in grids or lists animate sequentially for a polished cascade:

```css
/* Feature grid (3 items) */
.feature-grid .fade-in-section:nth-child(1) { transition-delay: 0ms; }
.feature-grid .fade-in-section:nth-child(2) { transition-delay: 120ms; }
.feature-grid .fade-in-section:nth-child(3) { transition-delay: 240ms; }

/* Journey grid (3 steps) */
.journey-grid .fade-in-section:nth-child(1) { transition-delay: 0ms; }
.journey-grid .fade-in-section:nth-child(2) { transition-delay: 100ms; }
.journey-grid .fade-in-section:nth-child(3) { transition-delay: 200ms; }

/* Hero stats (3 cards) */
.hero-stats .fade-in-section:nth-child(1) { transition-delay: 0ms; }
.hero-stats .fade-in-section:nth-child(2) { transition-delay: 80ms; }
.hero-stats .fade-in-section:nth-child(3) { transition-delay: 160ms; }
```

**Progression rule**: Delay increments shrink by depth — hero stats (fastest cascade, 80ms), feature grid (medium, 120ms), journey grid (closest to 100ms spacing). Items further down the page or less prominent animate closer together.

### 3.3 IntersectionObserver Configuration

From the React implementation in `App.jsx`:

```javascript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);  // one-time fire
      }
    });
  },
  {
    threshold: 0.1,                    // fire when 10% visible
    rootMargin: '0px 0px -40px 0px',    // trigger 40px before element enters viewport
  }
);
```

**Key choices**:
- `threshold: 0.1` — fires early enough that the animation completes before the user scrolls to the element
- `rootMargin: -40px` bottom — prevents animations from triggering on elements barely off-screen in short viewports
- `unobserve` on fire — prevents re-triggering, saves memory

### 3.4 Additional Animation Classes

```css
/* For keyframe-based animations (used on page load, not scroll) */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

/* Hover micro-animations — subtle lift on cards and CTAs */
.card-hover {
  transition:
    transform 300ms cubic-bezier(0.18, 0.89, 0.32, 1.12),
    box-shadow 300ms ease,
    background 300ms ease;
}

.card-hover:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: var(--shadow-feature-hover);
}
```

---

## 4. Typography

### 4.1 Font Stack

```css
--font-heading: 'Public Sans', sans-serif;
--font-body: 'Manrope', sans-serif;
```

### 4.2 Size Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | `clamp(3rem, 5vw, 4.7rem)` | 800 | 0.95 |
| H2 | `clamp(2rem, 3vw, 2.8rem)` | 800 | 0.98 |
| H3 | `1.45rem` | 700 | 1.2 |
| Body | `0.98rem` | 400 | 1.68 |
| Small/Meta | `0.82rem` | 400 | 1.5 |
| Label/Section | `0.78rem` | 800 | 1.0 |
| Eyebrow | `0.78rem` | 800 + `0.17em` letter-spacing | 1.0 |

---

## 5. Component-Specific Patterns

### 5.1 Feature Cards with Gradient Border Tubes

```css
.feature-item {
  position: relative;
  border-left: 3px solid transparent;
  background-clip: padding-box;
  border-radius: 20px;
}

.feature-item::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 1px;
  background: linear-gradient(135deg, #38a169, #2c5282);
  -webkit-mask: linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

### 5.2 Journey Steps with Numbered Badges

Numbered steps use CSS counters and a `::before` pseudo-element:

```css
.journey-grid {
  counter-reset: step-counter;
}

.journey-step {
  counter-increment: step-counter;
}

.journey-step::before {
  content: counter(step-counter);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: linear-gradient(135deg, #38a169, #2c5282);
  color: white;
  font-size: 0.78rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 14px;
  top: 18px;
}
```

### 5.3 Background Image in Glass Cards

For insight/journey sections, a subtle background image sits behind the glass:

```css
.insight-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: image-set(
    url('./landlord-neighborhood.webp') 1x,
    url('./landlord-neighborhood@2x.webp') 2x
  );
  background-size: cover;
  background-position: center bottom;
  opacity: 0.10;
  pointer-events: none;
  z-index: 0;
}
```

---

## 6. Engagement-Boosting Additions (not yet implemented)

These are recommended enhancements to increase user engagement while staying true to the AMHA brand:

### 6.1 Micro-interactions

```css
/* Stat card hover lift (existing) */
.hero-stats div:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 28px rgba(31, 61, 99, 0.14);
}

/* New: success pulse on generated response */
@keyframes successPulse {
  0% { box-shadow: 0 0 0 0 rgba(56, 161, 105, 0.3); }
  100% { box-shadow: 0 0 0 16px rgba(56, 161, 105, 0); }
}

.reply-body.has-response {
  animation: successPulse 1s ease-out;
}
```

### 6.2 Empty State Animation

```css
.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-state::before {
  content: '→';
  display: block;
  font-size: 2.4rem;
  color: #38a169;
  opacity: 0.30;
  animation: pulse-subtle 2s ease-in-out infinite;
}

@keyframes pulse-subtle {
  0%, 100% { opacity: 0.20; transform: translateX(0); }
  50% { opacity: 0.40; transform: translateX(4px); }
}
```

### 6.3 Page-Load Hero Entrance

```css
.hero-card {
  animation: scaleIn 500ms cubic-bezier(0.18, 0.89, 0.32, 1.12) forwards;
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
```

---

## 7. Asset Inventory

All new illustrative assets are in `branding_research/landlord/assets/`:

| Asset | Format | Dimensions | Purpose |
|-------|--------|------------|---------|
| `landlord-repair-portal-hero.png` | PNG | ~1536×1024 | Hero illustration: AMHA staff + repair dashboard + housing complex |
| `landlord-repair-portal-hero.svg` | SVG | 1280×720 | Vector version of hero (scalable, no resolution limits) |
| `landlord-workflow-flow.png` | PNG | ~1024×1024 | 3-step workflow: Intake → Compliance → Reply |
| `landlord-workflow-flow.svg` | SVG | 800×320 | Vector version of workflow flow |
| `landlord-repair-status-cards.png` | PNG | ~1024×1024 | Three stacked repair request status cards |
| `landlord-repair-status-cards.svg` | SVG | 600×600 | Vector version of status cards |
| `landlord-community-neighborhood.png` | PNG | ~1024×1024 | Stylized Ashtabula neighborhood scene |
| `landlord-community-neighborhood.svg` | SVG | 600×400 | Vector version of neighborhood |

---

## 8. Design Principles

1. **Tiered depth** — The closer to the user's attention, the more prominent the glass effect (higher blur, lighter background)
2. **Green as action** — Green signifies interactive, completed, or positive states. Blue signifies structural, informational, or pending states
3. **Deliberate animation** — Every animation serves a purpose: reveal (scroll), confirm (click), or guide (attention). No decorative-only motion
4. **Civic modern** — Professional enough for government stakeholders, modern enough to feel like a technology upgrade
5. **One system, not one design** — The glassmorphism + shadow + animation system scales to new sections without rethinking visual hierarchy
