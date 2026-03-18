# Permit Whisperer — Build Specification v1.0
**Project:** permit-whisperer (Unified Permitting Guide)  
**Type:** Informational MVP with Wizard Interface  
**Target:** City of Ashtabula + Ashtabula County residents  
**Date:** 2026-02-17  
**Status:** Ready for Implementation

---

## 1. Product Overview

### Problem Statement
Residents struggle to understand:
- Which permits are required for their project
- The two-stage workflow (City Zoning → County Building)
- Associated costs and timelines
- Required documentation
- Where to submit applications

### Solution
An interactive web tool that:
1. **Determines permit requirements** via project wizard
2. **Estimates costs** using official fee schedules
3. **Explains the two-stage workflow** with clear sequencing
4. **Provides document checklists** tailored to project type
5. **Links to official resources** (CitizenServe portal, forms)

### Success Metrics
- User completes wizard without staff intervention
- Accurate permit determination (validated by City/County staff)
- Reduced inquiry calls to PCD and County Building

---

## 2. User Flows

### Primary Flow: Project Wizard
```
Landing Page
    ↓
"What are you building?" (Project Type Selection)
    ↓
Project-Specific Questions (3-5 questions)
    ↓
Permit Requirements Result
    ├─ Required Permits (City/County/Both)
    ├─ Estimated Fees
    ├─ Required Documents
    ├─ Timeline Expectations
    └─ Next Steps (links + contact info)
```

### Secondary Flows
- **Fee Calculator** — Direct access to fee estimation
- **Document Library** — Browse all forms by jurisdiction
- **FAQ** — Common questions with official answers
- **Contact** — Direct links to PCD and County Building

---

## 3. Feature Specifications

### 3.1 Project Wizard

**Entry Points:**
- Hero section CTA: "Find Your Permits"
- Quick links: "Building a deck?", "Installing a pool?", etc.

**Step 1: Project Category**
| Category | Examples | Permits Typically Required |
|----------|----------|---------------------------|
| Outdoor Structures | Deck, patio, pergola | Zoning (City), Building (County if attached) |
| Storage Buildings | Shed, garage, barn | Zoning (City if >200 sq ft), Building (County) |
| Pools | In-ground, above-ground | Zoning (City), Building (County) |
| Fences | Privacy, decorative | Zoning (City only) |
| Home Additions | Room addition, bump-out | Zoning (City), Building (County) |
| Interior Work | Basement finish, remodel | Building (County only) |
| Trade Work | Electrical, plumbing, HVAC | Trade Permit (County only) |
| Demolition | Structure removal | Zoning (City), Demolition (County) |

**Step 2: Project Details** (Conditional)
- Deck: Height above grade? (>30" requires permits)
- Shed: Square footage? (>200 sq ft requires permits)
- Pool: In-ground or above-ground? Safety enclosure planned?
- Fence: Height? Location (front yard vs side/rear)?
- Addition: Square footage? Stories?

**Step 3: Location Context**
- Historic District? (Triggers HARB review)
- HOA community? (Requires HOA approval letter)
- Near waterfront/wetlands? (Additional approvals)

**Result Page Components:**
1. **Permit Badge** — Clear visual: ✅ Required, ⚠️ Maybe, ❌ Not Required
2. **Two-Stage Workflow Card** — Visual timeline showing City → County sequence
3. **Fee Estimate** — Range based on project value (if applicable)
4. **Document Checklist** — Checkboxes with download links
5. **Timeline** — Expected review periods
6. **Action Buttons** — "Start City Application", "Visit County Portal", "Email PCD"

### 3.2 Fee Calculator

**Input:** Project type + estimated value
**Output:**
- City Zoning Permit fee (1% of project value)
- County Building Permit fee (varies by type)
- Additional fees (inspections, plan review)
- Total estimated cost

**Formula (City):**
```
Zoning Permit = project_value × 0.01
Minimum fee = $50 (fences) to $150 (pools)
```

**Formula (County):**
```
Residential Building = varies by scope (simplified table)
Trade Permits = flat fees (electrical: ~$75, plumbing: ~$50, HVAC: ~$100)
```

### 3.3 Document Library

**Organization:**
```
├── City of Ashtabula
│   ├── Zoning Permit Application
│   ├── Pool Permit Application
│   ├── Fence Permit Application
│   ├── Deck Permit Application
│   ├── Historic District Review Application
│   └── Sign Permit Application
└── Ashtabula County
    ├── Residential Building Permit
    ├── Residential Alteration Permit
    ├── Demolition Permit
    ├── Electrical Permit
    ├── Plumbing Permit
    └── HVAC Permit
```

**Per-Document Display:**
- Form name + description
- When required (project types)
- Where to submit (office address, online link)
- Download link (if available) or "Visit Office" instruction

### 3.4 FAQ Section

**Categories:**
- General Process
- City Zoning Permits
- County Building Permits
- Fees & Payments
- Inspections

**Sample Questions:**
- Do I need a permit for a shed?
- What's the difference between zoning and building permits?
- How long does the permit process take?
- Can I apply online?
- What happens if I start without a permit?

---

## 4. Technical Architecture

### 4.1 Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State:** React useState/useContext (no external state needed)
- **Deployment:** Vercel
- **Analytics:** Vercel Analytics (optional)

### 4.2 Page Structure
```
app/
├── page.tsx                    # Landing + Hero + Quick Links
├── wizard/
│   └── page.tsx               # Multi-step wizard interface
├── calculator/
│   └── page.tsx               # Fee calculator
├── documents/
│   └── page.tsx               # Document library
├── faq/
│   └── page.tsx               # FAQ page
├── contact/
│   └── page.tsx               # Contact information
└── layout.tsx                  # Root layout with navigation

components/
├── wizard/
│   ├── ProjectSelector.tsx     # Category selection grid
│   ├── QuestionFlow.tsx        # Dynamic question components
│   ├── ResultCard.tsx          # Permit requirements display
│   └── WorkflowTimeline.tsx    # City → County visual
├── fee-calculator/
│   ├── FeeForm.tsx             # Input form
│   └── FeeBreakdown.tsx        # Results display
├── documents/
│   └── DocumentCard.tsx        # Individual form display
├── ui/                         # shadcn components
└── shared/
    ├── Header.tsx
    ├── Footer.tsx
    └── Navigation.tsx

lib/
├── wizard-logic.ts             # Permit determination rules
├── fee-data.ts                 # Fee schedules
├── document-data.ts            # Form metadata
└── utils.ts

public/
└── documents/                  # Downloadable PDFs (if available)
```

### 4.3 Data Models

**Project Type:**
```typescript
interface ProjectType {
  id: string;
  category: 'outdoor' | 'storage' | 'pool' | 'fence' | 'addition' | 'interior' | 'trade' | 'demolition';
  name: string;
  description: string;
  icon: string;
  requiresCityPermit: boolean | 'conditional';
  requiresCountyPermit: boolean | 'conditional';
  conditionalLogic?: ConditionalRule[];
}

interface ConditionalRule {
  field: string;
  operator: 'gt' | 'lt' | 'eq' | 'in';
  value: any;
  result: boolean;
  explanation: string;
}
```

**Permit Result:**
```typescript
interface PermitResult {
  projectType: string;
  cityPermit: {
    required: boolean;
    type?: string;
    fee?: FeeEstimate;
    timeline?: string;
  };
  countyPermit: {
    required: boolean;
    type?: string;
    fee?: FeeEstimate;
    timeline?: string;
  };
  documents: RequiredDocument[];
  specialRequirements: string[];
}
```

**Required Document:**
```typescript
interface RequiredDocument {
  name: string;
  jurisdiction: 'city' | 'county' | 'both';
  required: boolean;
  description: string;
  downloadUrl?: string;
  submitLocation: string;
}
```

---

## 5. UI/UX Design

### 5.1 Visual Design System
- **Primary:** Blue (#2563EB) — trust, government
- **Secondary:** Green (#10B981) — success, permits approved
- **Accent:** Orange (#F59E0B) — warnings, conditionals
- **Neutral:** Slate grays for text and backgrounds
- **Typography:** Inter or system-ui stack

### 5.2 Key Screens

**Landing Page:**
- Hero with search/wizard CTA
- Quick category cards (8 project types)
- "How It Works" 3-step visual
- Trust indicators (City/County logos - pending approval)

**Wizard Interface:**
- Progress indicator (Step 1 of 3)
- Large touch-friendly buttons
- Clear question text with help tooltips
- Conditional fields appear dynamically

**Results Page:**
- Prominent permit status badges
- Visual workflow timeline
- Expandable sections for details
- Print-friendly view
- "Start Over" and "Save Results" buttons

### 5.3 Mobile Considerations
- Bottom sheet for wizard questions
- Stacked timeline (vertical) on mobile
- Touch-optimized buttons (min 44px)
- Collapsible sections for long results

---

## 6. Content Requirements

### 6.1 Wizard Logic Rules

**Shed Logic:**
```
IF sq_ft > 200 AND height > 10ft:
    City Permit = REQUIRED
    County Permit = CONDITIONAL (if habitable/electrical)
ELSE:
    City Permit = NOT REQUIRED
    County Permit = NOT REQUIRED
```

**Deck Logic:**
```
IF height > 30 inches OR attached to dwelling:
    City Permit = REQUIRED
    County Permit = REQUIRED
ELSE:
    City Permit = NOT REQUIRED
    County Permit = NOT REQUIRED
```

**Fence Logic:**
```
IF height > 6ft OR in front yard:
    City Permit = REQUIRED
ELSE:
    City Permit = NOT REQUIRED
County Permit = NEVER REQUIRED
```

**Pool Logic:**
```
City Permit = ALWAYS REQUIRED
County Permit = ALWAYS REQUIRED
IF historic_district:
    ADD Historic District Review
```

### 6.2 Fee Data
- City: 1% of project value (residential)
- County: Use simplified table based on project type
- Trade permits: Flat fees

### 6.3 Timeline Data
- City PCD: Up to 1 week
- County Building: Up to 30 days (plan review)
- Historic District: Additional 14 days

### 6.4 Contact Information
```
City of Ashtabula PCD:
- Address: 4717 Main Ave, Ashtabula, OH 44004
- Phone: (440) 992-7112
- Email: PCD@cityofashtabula.com
- Hours: Mon-Fri 8:30 AM - 4:30 PM

Ashtabula County Building:
- Address: 25 W Jefferson St, Jefferson, OH 44047
- Phone: (440) 576-3737
- Portal: https://www.citizenserve.com/ashtabula
- Hours: Mon-Fri 8:00 AM - 4:30 PM
```

---

## 7. Development Phases

### Phase 1: Foundation (4-6 hours)
- [ ] Next.js + Tailwind + shadcn setup
- [ ] Page routing and navigation
- [ ] Landing page design
- [ ] Static content pages (FAQ, Contact)

### Phase 2: Wizard Core (6-8 hours)
- [ ] Project type selection UI
- [ ] Question flow logic
- [ ] Conditional field display
- [ ] Result page layout
- [ ] Workflow timeline component

### Phase 3: Logic & Data (4-6 hours)
- [ ] Wizard determination rules
- [ ] Fee calculator implementation
- [ ] Document checklist generation
- [ ] Content population (all text)

### Phase 4: Polish (3-4 hours)
- [ ] Mobile responsiveness
- [ ] Print-friendly styles
- [ ] Error states and validation
- [ ] Analytics integration
- [ ] SEO meta tags

**Total Estimate:** 17-24 hours

---

## 8. Testing & Validation

### Test Cases
| Scenario | Expected Result |
|----------|----------------|
| 8x10 shed (80 sq ft) | No permits required |
| 12x20 shed (240 sq ft) | City Zoning Permit required |
| Deck 24" high, detached | No permits required |
| Deck 36" high, attached | City + County permits required |
| Pool in Historic District | City + County + HARB review |
| Fence 4ft, backyard | No permit required |
| Fence 7ft, front yard | City Zoning Permit required |
| Kitchen remodel | County Building Permit only |

### Validation Checklist
- [ ] All 18 project types from fee schedule covered
- [ ] Conditional logic matches official rules
- [ ] Fee estimates within 10% of actual
- [ ] All contact information accurate
- [ ] Mobile testing on iOS and Android
- [ ] Print preview looks correct

---

## 9. Deployment & Launch

### Pre-Launch
- [ ] Stakeholder review (City PCD, County Building)
- [ ] Content accuracy verification
- [ ] Analytics dashboard setup
- [ ] Domain configuration (subdomain of ashtabulatools.com)

### Launch
- [ ] Deploy to Vercel production
- [ ] Submit to City PCD for feedback
- [ ] Submit to County Building for feedback
- [ ] Share with local contractors for testing

### Post-Launch
- [ ] Monitor analytics (completion rates, common paths)
- [ ] Collect user feedback
- [ ] Iterate on wizard logic based on staff input
- [ ] Add CitizenServe deep links if API becomes available

---

## 10. Open Questions & Blockers

### Pending External Input
1. **CitizenServe API:** Can we deep-link to specific permit types?
2. **Form Downloads:** Can we host PDFs or link to official sources?
3. **Logo Usage:** Permission to use City/County logos?
4. **Accuracy Review:** Will PCD/County staff validate logic?

### Technical Decisions
1. **Print to PDF:** Client-side generation or browser print?
2. **Save Results:** LocalStorage or email-to-self?
3. **Analytics:** Vercel only or add Google Analytics?

---

## 11. Appendix

### A. Data Sources
- `PHASE1-RESEARCH.md` — Stakeholder research
- `FEE-SCHEDULE.md` — Complete fee documentation
- `FORMS-INVENTORY.md` — Form availability and requirements
- City of Ashtabula Zoning Resolution Part 11
- Ashtabula County Building Department fee schedules
- CitizenServe portal documentation

### B. Related Projects
- `zoning-clerk` — RAG-based zoning Q&A (complementary)
- `invest-ashtabula` — Economic development portal
- `contractor-match` — Contractor discovery platform

### C. Future Enhancements (Post-MVP)
- CitizenServe API integration for status checking
- Document upload for pre-application review
- Contractor referral links
- Permit status tracking
- Multi-language support (Spanish)
