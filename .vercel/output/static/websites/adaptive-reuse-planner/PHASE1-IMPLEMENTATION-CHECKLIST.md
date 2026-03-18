# Adaptive Reuse Planner — Phase 1 Implementation Checklist
**Phase:** Core Wizard (Building + Use Selectors)  
**Estimated Time:** 4-6 hours  
**Status:** 🟡 In Progress  

---

## Step 1: Project Setup (15 min)

```bash
# Initialize Next.js project
cd ~/projects/ashtabula/adaptive-reuse-planner
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install shadcn/ui
npx shadcn-ui@latest init

# Install components
npx shadcn-ui@latest add card button select

# Verify setup
npm run dev
```

---

## Step 2: Data Structure (30 min)

Create `src/data/building-types.ts`:
- 8 building type definitions
- Icons for each type
- Compatibility matrix (which uses work with which buildings)

Create `src/data/incentives.ts`:
- 6 incentive program definitions
- Eligibility criteria
- Value calculations

---

## Step 3: Building Type Selector (45 min)

Create `src/components/BuildingSelector.tsx`:
- Grid of 8 building type cards
- Icon + title + brief description
- Hover effects
- Selection state
- Click to proceed

---

## Step 4: Proposed Use Selector (45 min)

Create `src/components/UseSelector.tsx`:
- Dynamic options based on building type
- Compatibility filtering
- Card-based selection
- Back button to change building type

---

## Step 5: Basic Results Display (30 min)

Create `src/components/ResultsPreview.tsx`:
- Show selected building → use
- Basic compatibility indicator
- "Full Analysis" button (placeholder)

---

## Step 6: Wizard Flow (30 min)

Create `src/components/Wizard.tsx`:
- Step management (building → use → results)
- Progress indicator
- State management
- Smooth transitions

---

## Step 7: Styling (30 min)

Apply Noirsys aesthetic:
- Dark theme
- Glass-morphism cards
- Accent colors (match hero cards)
- Responsive layout

---

## Step 8: Testing (15 min)

- Test all 8 building types
- Test use filtering
- Test mobile responsive
- Test navigation flow

---

## Files to Create

```
src/
├── app/
│   ├── page.tsx              # Main entry
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── BuildingSelector.tsx  # Step 1
│   ├── UseSelector.tsx       # Step 2
│   ├── ResultsPreview.tsx    # Step 3
│   └── Wizard.tsx            # Flow controller
├── data/
│   ├── building-types.ts     # Building definitions
│   └── incentives.ts         # Incentive programs
└── lib/
    └── utils.ts              # Utilities
```

---

## Success Criteria

- [ ] User can select any of 8 building types
- [ ] Use options filter based on building type
- [ ] Smooth transitions between steps
- [ ] Dark theme matches noirsys.com
- [ ] Mobile responsive
- [ ] No console errors

---

## Current Status

- [ ] Project initialized
- [ ] Data structures created
- [ ] Building selector built
- [ ] Use selector built
- [ ] Results preview built
- [ ] Wizard flow working
- [ ] Styled
- [ ] Tested

---

**Next:** Begin Step 1 — Project initialization
