# Design Uplift Spec — Landlord Repair Queue (AMHA)

**Route:** `/landlord/`
**Buyer:** Ashtabula Metropolitan Housing Authority (AMHA)
**Current score:** 5/10 — functional but flat
**Target score:** 7+/10 — polished, modern, glassmorphism-driven
**Type:** NON-BLOCKING polish pass

---

## 1. Hero Image Recommendation

### Candidate A: AMHA Housing Community (PRIMARY — RECOMMENDED)
- **File:** `amha-housing-candidate.png` (1536×1024)
- **Content:** Well-maintained multi-family housing complex with brick/tan siding, manicured lawns, pink flowering shrubs, blue sky with clouds. Conveys dignity, community, and safe affordable housing.
- **Role:** Replace the current `hero-background.jpg` (1920×1280) as the hero section backdrop. The image has ideal depth (foreground lawn → midground buildings → sky background) for glassmorphism overlay layering.
- **Placement:** Set as hero section `::before` pseudo-element background, positioned `center bottom`, with `opacity: 0.25` for subtle texture behind the hero card.
- **Why it wins:** Directly shows AMHA's housing stock as dignified and well-maintained. Aligns with AMHA mission statement ("Clean and safe affordable housing"). The blue sky matches the AMHA blue palette.

### Candidate B: Ashtabula Railway Bridge/Underpass (ACCENT — SECONDARY)
- **File:** `ashtabula-underpass-candidate.png` (1536×1024)
- **Content:** Historic stone arch railway bridge with steel truss section, over calm water, autumn foliage (yellow/orange/red) framing. Golden hour lighting with reflections.
- **Role:** Use as a community-landmark accent in the hero panel `::before` overlay (replacing the current generic texture). Also consider for the footer background.
- **Why secondary:** Less directly about housing — better as a "community connection" symbol. The golden autumn tones add warmth but don't directly reinforce the AMHA housing mission.

### Final Decision
**Use Candidate A** as the primary hero background. **Use Candidate B** as an accent in the hero panel or footer — its warm autumn tones complement the blue/green AMHA palette as an accent color source.

---

## 2. Glassmorphism Refinements

### 2.1 Hero Card (`.hero-card`)
| Property | Current | Target | Rationale |
|----------|---------|--------|-----------|
| `background` | `rgba(255, 255, 255, 0.9)` | `rgba(255, 255, 255, 0.82)` | More transparency to show the hero image beneath |
| `backdrop-filter` | `blur(10px)` | `blur(18px)` | Stronger glass effect — frostier, more modern |
| `-webkit-backdrop-filter` | — | `blur(18px)` | Safari compatibility |
| Border | `1px solid rgba(255,255,255,0.95)` | `1px solid rgba(255,255,255,0.60)` | More visible glass edge |

**NEW CSS to add:**
```css
.hero-card {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.60);
  box-shadow: var(--shadow); /* keep existing */
}
```

### 2.2 Workspace & Reply Cards (`.workspace-card`, `.reply-card`)
| Property | Current | Target |
|----------|---------|--------|
| `background` | `rgba(255, 255, 255, 0.88)` | `rgba(255, 255, 255, 0.78)` |
| `backdrop-filter` | `blur(12px)` | `blur(16px)` |
| Border | `1px solid rgba(255,255,255,0.9)` | `1px solid rgba(255,255,255,0.50)` |

### 2.3 Insight & Journey Cards (`.insight-card`, `.journey-card`)
| Property | Current | Target |
|----------|---------|--------|
| `background` | `rgba(255, 255, 255, 0.88)` | `rgba(255, 255, 255, 0.76)` |
| `backdrop-filter` | `blur(12px)` | `blur(14px)` |
| Border | `1px solid rgba(255,255,255,0.9)` | `1px solid rgba(44, 82, 130, 0.06)` |

---

## 3. Gradient Color Stops & Placement

### 3.1 Hero Section Background (NEW — behind hero card)
Add a `::before` pseudo-element on `.page-shell` or a new hero wrapper that shows the hero image with gradient overlay:

```css
.page-shell::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(
      135deg,
      rgba(44, 82, 130, 0.25) 0%,    /* AMHA blue top-left */
      rgba(56, 161,