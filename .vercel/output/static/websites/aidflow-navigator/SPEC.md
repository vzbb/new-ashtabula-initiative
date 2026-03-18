# AidFlow Navigator — SPEC.md
**Version:** 1.0  
**Date:** February 17, 2026  
**Status:** Draft  

---

## Overview

A web-based eligibility screening tool to help Ashtabula County residents discover and access assistance programs (SNAP, WIC, HEAP, housing, healthcare, etc.)

**Target Users:**
- Low-income families seeking assistance
- Seniors on fixed income
- Single parents
- Case workers helping clients

---

## Core Features

### 1. Quick Eligibility Screener
**Purpose:** 2-minute assessment to identify likely eligible programs

**Questions:**
1. **Household Size** (dropdown: 1-8+)
2. **Monthly Income** (range or exact)
3. **Current Benefits** (checkboxes: SNAP, Medicaid, TANF, None)
4. **Immediate Needs** (checkboxes: Food, Housing, Utilities, Healthcare, Emergency)
5. **Household Composition** (checkboxes: Pregnant, Infant, Child under 5, Senior 60+, Disabled)

**Output:**
- List of likely eligible programs
- Auto-qualification cascade (SNAP → WIC)
- Priority ranking (emergency needs first)

---

### 2. Program Detail Cards
**Purpose:** Deep dive into each program

**Per-Program Info:**
- Eligibility requirements
- Application process
- Required documentation
- Contact information
- Timeline expectations
- Waitlist status (if known)

**Programs Covered:**
- SNAP (Food stamps)
- WIC (Women, Infants, Children)
- HEAP (Energy assistance)
- PIPP (Utility payment plan)
- Medicaid
- Housing Choice Voucher (Section 8)
- Emergency shelter
- Food pantries (local listings)

---

### 3. Application Checklist Generator
**Purpose:** Personalized list of needed documents

**Based On:**
- Selected programs
- Household situation

**Output:**
- Document checklist (ID, proof of income, residency, etc.)
- Printable/downloadable PDF
- Estimated application time

---

### 4. Resource Directory
**Purpose:** Contact info for all relevant organizations

**Categories:**
- County offices (JFS, health department)
- Community Action Agency (ACCAA)
- Food pantries
- Emergency shelters
- Legal aid
- 211 helpline

**Per-Listing:**
- Name
- Phone
- Address
- Hours
- Services offered
- Walk-in vs appointment

---

### 5. Save & Share
**Purpose:** Help users remember and share results

**Features:**
- Email results to self
- Print-friendly summary
- Share with case worker
- Save to localStorage (return later)

---

## Technical Architecture

### Frontend
- **Framework:** Next.js + React
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Deployment:** Vercel

### Data
- **Static JSON:** Program definitions, eligibility rules, contacts
- **LocalStorage:** Save user progress
- **No backend required** for MVP

### Design
- Dark theme (matching noirsys.com)
- Accessible (WCAG 2.1 AA)
- Mobile-first responsive
- Simple, non-intimidating UI

---

## Eligibility Logic

### Income Thresholds (2025)

| Household Size | SNAP (130% FPL) | WIC (185% FPL) |
|----------------|-----------------|----------------|
| 1 | ~$1,600/mo | ~$2,300/mo |
| 2 | ~$2,100/mo | ~$3,100/mo |
| 3 | ~$2,700/mo | ~$3,900/mo |
| 4 | ~$3,200/mo | ~$4,600/mo |

### Auto-Qualification Rules
```
IF has_SNAP OR has_Medicaid OR has_TANF:
  eligible_for_WIC = true

IF income ≤ SNAP_limit AND household_composition matches:
  eligible_for_SNAP = true

IF has_HEAP AND has_utility_account:
  eligible_for_PIPP = true
```

### Need-Based Priorities
```
IF need = "Emergency":
  priority = ["Emergency Shelter", "211 Helpline", "Food Pantries"]

IF need = "Food":
  priority = ["SNAP", "WIC", "Food Pantries"]

IF need = "Housing":
  priority = ["Section 8", "Emergency Shelter", "ACCAA"]

IF need = "Utilities":
  priority = ["HEAP", "PIPP", "ACCAA"]
```

---

## Implementation Phases

### Phase 1: Core Screener (3-4 hours)
- Household size selector
- Income input
- Benefit checkboxes
- Basic eligibility calculation
- Results list

### Phase 2: Program Details (2-3 hours)
- Program detail cards
- Eligibility explanations
- Contact information

### Phase 3: Resources & Tools (2-3 hours)
- Application checklist generator
- Resource directory
- Save/print/share functionality

### Phase 4: Polish (2 hours)
- Mobile responsiveness
- Accessibility audit
- Styling refinement
- Error handling

**Total:** ~10-12 hours

---

## Data Sources (Public Only)

- **SNAP:** ODJFS website, Benefits.gov
- **WIC:** ACCAA website, state WIC guidelines
- **HEAP:** Ohio Development Services Agency
- **Section 8:** HUD.gov, local PHA websites
- **Medicaid:** Ohio Department of Medicaid
- **Emergency Resources:** 211 database, county websites

---

## Success Metrics

- User completes screener in < 2 minutes
- Accurate eligibility guidance
- Clear next steps provided
- Contact info accessible
- Mobile-friendly usage

---

## Constraints

- **No stakeholder contact** until noirsys.com approved
- **Public data only** for program details
- **Estimates only** for eligibility (not legal advice)
- **Privacy-first:** No data sent to servers

---

## Next Steps

1. [ ] Finalize income threshold calculations
2. [ ] Draft application checklist templates
3. [ ] Compile resource directory listings
4. [ ] Build Phase 1 prototype

---

**Status:** SPEC drafted, ready for Phase 1 implementation when approved.