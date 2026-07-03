# Design Document: Saybrook Zoning Clerk UI Redesign

**Status**: Approved
**Date**: 2026-03-28
**Topic Slug**: saybrook-ui-redesign
**Design Depth**: standard
**Task Complexity**: medium

---

## 1. Problem Statement

The current Saybrook Zoning Clerk frontend lacks the visual authority and functional clarity of a pitch-ready civic service. The chatbot—the primary value-add—is visually subordinate to brochure-like content. Hierarchy is muddy, contrast is inconsistent, and the overall design feels like a prototype. To transform this into a professional "digital service desk," we must re-center the chat canvas as the hero, move supporting content into an authoritative sidebar, and streamline the intake process into a modern slide-over drawer.

## 2. Requirements

### Functional
- **Hero Chat Canvas**: The chatbot must be the primary interactive hero, occupying the main canvas area.
- **Authoritative Sidebar**: A persistent sidebar for the Township Seal, live RAG status, and workstation guide.
- **Slide-Over Intake Desk**: Streamlined request handoff moved to a contextual slide-over drawer.
- **Quick Prompts Integration**: Re-style quick prompts as tool-entry points in the sidebar or empty chat state.

### Non-Functional
- **High-Contrast Civic Aesthetic**: Use the Saybrook Forest/Cream palette with stark, professional contrast.
- **Responsive Command Center**: Layout must collapse gracefully while maintaining interactive focus.
- **Clean Civic Copy**: Remove all "draft," "demo," or apologetic framing from visible UI.

## 3. Approach (Selected: The Civic Workstation)

We will refactor `App.jsx` into a three-zone "Digital Desk":

1. **Sidebar (Authoritative Zone)**: A `saybrook-forest` sidebar housing branding and live service status indicators. — *Establishes official workstation feel.*
2. **Main Canvas (Interaction Zone)**: A high-contrast `saybrook-cream` canvas for the full-height `ChatAssistant` with a bottom-anchored composer. — *Maximizes interactive hero space.*
3. **Slide-Over Intake Drawer**: A new sub-component overlaying the chat history for formal handoff. — *Preserves cited context during final submission.*
4. **Design System Unification**: Map core CSS variables into the Tailwind v4 `@theme` block in `index.css`. — *Preserves visual craft while gaining modern layout speed.*

### Decision Matrix

| Criterion | Weight | Approach 1: Civic Workstation | Approach 2: Integrated Hub |
|-----------|--------|--------------------------------|----------------------------|
| "Hero" Chat Focus | 30% | 5: Chat is the undisputed canvas. | 4: Chat is prominent but part of a grid. |
| Official Feel | 25% | 5: Mimics professional tools. | 4: Feels like a modern dashboard. |
| Pitch-Readiness | 20% | 5: High-contrast, clean hierarchy. | 5: Modular and modern. |
| Weighted Total | | **4.8** | **4.3** |

## 6. Risk Assessment

- **Mobile Usability**: Complex layout might crowd small screens. *Mitigation*: Implement a "Mobile Shell" that collapses sidebar to a top status bar.
- **Context Loss**: Drawer might disconnect users from conversation. *Mitigation*: Use glassmorphic backdrop to maintain visual continuity.
- **State Stability**: Overlay drawer increases component complexity. *Mitigation*: Decouple `IntakeDrawer` functional logic from the main chat render path.

## 7. Success Criteria

- Chatbot occupies >70% of horizontal screen space on desktop.
- Interaction path (Ask -> Cite -> Handoff) is visually distinct and signposted.
- "Saybrook" Forest/Cream theme is unified across CSS and Tailwind utility classes.
- Zero "draft/demo" copy remains in the primary public-facing UI.
