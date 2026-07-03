# Design Document: Saybrook Major Final Polish Pass (2026 Tier)

**Status**: Approved
**Date**: 2026-03-28
**Topic Slug**: saybrook-final-polish
**Design Depth**: quick
**Task Complexity**: medium

---

## 1. Problem Statement

The current Saybrook interactive terminal requires a high-fidelity aesthetic leap to meet the standards of a premium "2026 municipal service." While functionally sound, the UI lacks physical depth, kinetic shadows, and the sophisticated glassmorphism expected of a modern workstation. Additionally, a disruptive interaction bug (automatic drawer opening) and an unpolished administrative view (Trustee Queue) with "demo" language must be resolved to ensure the product is absolute pitch-ready.

## 2. Requirements

### Visual (2026 Tier)
- **Spatial Glassmorphism**: Multi-layered blurs and saturation on all shells (Sidebar, Chat, Drawer).
- **Physical Depth**: Ultra-thin (0.5px) "glass-edge" borders and kinetic shadows.
- **Interaction Pods**: Re-style chat bubbles into floating pods with internal depth.
- **Terminal Overhaul**: Restyle `TrusteeQueue.jsx` into a high-end management terminal.

### Functional Fixes
- **Drawer Logic**: Remove `setDrawerOpen(true)` from the success path in `ChatAssistant.jsx` to ensure the drawer only opens on user intent.
- **Copy Audit**: Scrub all "draft," "demo," and "unofficial" language from the Trustee Portal.

## 3. Approach (Selected: Spatial Terminal)

We will execute a comprehensive styling pass across the entire Saybrook project:

1. **Theme Refinement (`index.css`)**: Update tokens for deeper blurs and sophisticated shadow tiers.
2. **Visual Logic Overhaul (`App.css`)**: Implement spatial stacking and kinetic gradients.
3. **Component Polish**:
    - **`ChatAssistant.jsx`**: Remove the auto-open bug and polish message pods.
    - **`TrusteeQueue.jsx`**: Apply the new glass tokens and official, authoritative copy.
    - **`IntakeDrawer.jsx`**: Enhance the slide-over transition and backdrop fidelity.

### Decision Matrix (Visual Language)

| Criterion | Weight | Approach: Spatial Glass | Approach: Bento Minimal |
|-----------|--------|-------------------------|-------------------------|
| "2026" Fidelity | 40% | 5: Ultra-modern depth. | 3: Current trend standard. |
| Civic Authority | 30% | 5: Premium workstation. | 4: Organized tool. |
| Visual Polish | 30% | 5: High-fidelity finish. | 4: Clean finish. |
| **Weighted Total** | | **5.0** | **3.5** |

## 6. Risk Assessment

- **Paint Performance**: Heavy use of `backdrop-filter` can impact older hardware. *Mitigation*: Use optimized blur radii and avoid excessive nesting of glass layers.
- **Visual Contrast**: Glassmorphism can sometimes muddy text clarity. *Mitigation*: Use high-contrast Forest Green and Ink overlays behind text content within pods.

## 7. Success Criteria

- UI feels like a physical, floating terminal with distinct spatial depth.
- `IntakeDrawer` remains closed until the user clicks "Submit for Official Review."
- Trustee Portal uses 100% authoritative language and matches the workstation aesthetic.
- `npm run build` and `npm run lint` are clean.
