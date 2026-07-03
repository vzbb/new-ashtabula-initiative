# License Wizard — Technical Specification (SPEC)
**Date:** February 19, 2026  
**Status:** 🟢 Phase 3 Complete — Ready for Build  
**Project:** license-wizard (P1 Civic Tool)

---

## 1. Product Overview

### 1.1 Mission
A free, interactive wizard that helps Ashtabula business owners identify exactly which licenses and permits they need across federal, state, county, and city levels — with direct links to forms, fee estimates, and renewal reminders.

### 1.2 Tagline
> "Know what you need before you start."

### 1.3 Target Users
| Persona | Use Case |
|---------|----------|
| **Maria** (Restaurant Owner) | First-time business owner needing food service licenses |
| **James** (Contractor) | Understanding multi-jurisdiction contractor requirements |
| **Sarah** (Home-Based) | Verifying home occupation compliance |
| **David** (Expanding Retail) | Quick renewal tracking and amendment guidance |

---

## 2. User Flow & Wizard Steps

### 2.1 Step-by-Step Wizard Flow

```
STEP 1: Welcome
├── Headline: "What licenses does your Ashtabula business need?"
├── Subtext: "Answer 5 quick questions for a personalized checklist"
└── CTA: "Start"

STEP 2: Business Type
├── Question: "What type of business are you starting?"
├── Options (single-select):
│   ├── 🍽️ Restaurant / Food Service
│   ├── 🏪 Retail Store
│   ├── 🔨 Construction / Contracting
│   ├── 🏠 Home-Based Business
│   ├── 💼 Professional Services
│   ├── 🚚 Transportation / Trucking
│   ├── 🍺 Bar / Brewery / Distillery
│   ├── 🔫 Gun Shop / Firearms
│   └── 🌾 Agriculture / Farming
└── CTA: "Continue"

STEP 3: Location Type
├── Question: "Where will you operate?"
├── Options (single-select):
│   ├── 🏢 Commercial Location (storefront, office, warehouse)
│   ├── 🏠 Home-Based (residential address)
│   ├── 🚐 Mobile / Food Truck
│   └── 🌐 Online Only (no physical location)
└── CTA: "Continue"

STEP 4: Business Activities
├── Question: "What will your business do?"
├── Options (multi-select, context-aware):
│   ├── Sell products / merchandise
│   ├── Serve food or beverages
│   ├── Sell alcohol
│   ├── Perform construction work
│   ├── Have employees
│   ├── Use commercial vehicles
│   └── Provide professional services
└── CTA: "Continue"

STEP 5: Entity Type
├── Question: "What type of business entity?"
├── Options (single-select):
│   ├── LLC (Limited Liability Company)
│   ├── Corporation (S-Corp or C-Corp)
│   ├── Sole Proprietorship
│   └── Partnership
└── CTA: "Get My Checklist"

STEP 6: Results Page
├── Personalized Checklist (grouped by level)
│   ├── Federal Requirements (if applicable)
│   ├── Ohio State Requirements
│   ├── Ashtabula County Requirements
│   └── City of Ashtabula Requirements
├── Action Items:
│   ├── Download/Print checklist
│   ├── Email results to myself
│   ├── Add renewal reminders to calendar
│   └── Start over
└── Disclaimer: Requirements may change — verify with authorities
```

### 2.2 Results Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Your Business License Checklist                            │
│  Based on: Restaurant | Commercial | LLC                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ▶ FEDERAL                                                  │
│    ☐ EIN (Tax ID) — Free — [Apply at IRS]                   │
│    ☐ TTB Permit (if selling alcohol) — [Learn more]         │
│                                                             │
│  ▶ OHIO STATE                                               │
│    ☐ LLC Registration — $99 — [Form 533A PDF]               │
│    ☐ Vendor's License — $25 — [Ohio Business Gateway]       │
│    ☐ Workers' Comp — Payroll-based — [BWC Website]          │
│                                                             │
│  ▶ ASHTABULA COUNTY                                         │
│    ☐ County Vendor License — $50 — [Application PDF]        │
│    ☐ Food Service License — Varies — [Contact 440-576-6010] │
│                                                             │
│  ▶ CITY OF ASHTABULA                                        │
│    ☐ Zoning Permit — Varies — [Email PCD]                   │
│    ☐ Sign Permit — Varies — [Email PCD]                     │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  [📥 Download PDF]  [📧 Email Me]  [📅 Add Reminders]       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Technical Architecture

### 3.1 Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | React 18 + Vite | Existing scaffold, fast dev, modern |
| **Styling** | Tailwind CSS | Utility-first, responsive |
| **State** | React Context + useReducer | Simple state, no Redux needed |
| **Storage** | localStorage | User's answers persist across sessions |
| **PDF Gen** | jsPDF + html2canvas | Client-side PDF generation |
| **Email** | mailto: links + Formspree fallback | No backend required |
| **Calendar** | .ics file generation | Universal calendar import |
| **Analytics** | Plausible or SimpleAnalytics | Privacy-friendly |

### 3.2 Data Models

```typescript
// Business Profile (user inputs)
interface BusinessProfile {
  id: string;                    // UUID for localStorage
  businessType: BusinessType;    // enum
  locationType: LocationType;    // enum
  activities: Activity[];        // multi-select
  entityType: EntityType;        // enum
  createdAt: Date;
}

type BusinessType = 
  | 'restaurant' | 'retail' | 'contractor' | 'home-based'
  | 'professional' | 'transportation' | 'alcohol' | 'firearms' | 'agriculture';

type LocationType = 'commercial' | 'home' | 'mobile' | 'online';

type Activity = 
  | 'sell-products' | 'serve-food' | 'sell-alcohol' | 'construction'
  | 'employees' | 'commercial-vehicles' | 'professional-services';

type EntityType = 'llc' | 'corporation' | 'sole-proprietorship' | 'partnership';

// License Requirement (master data)
interface LicenseRequirement {
  id: string;
  name: string;
  description: string;
  level: 'federal' | 'state' | 'county' | 'city';
  authority: string;
  authorityContact: {
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    hours?: string;
  };
  cost: {
    amount: number | null;       // null for variable fees
    type: 'fixed' | 'variable' | 'free';
    notes?: string;
  };
  formUrl?: string;              // PDF or online form
  isRenewable: boolean;
  renewalPeriod?: 'annual' | 'biennial' | 'one-time';
  renewalCost?: number;
  processingTime?: string;       // e.g., "1-2 weeks"
  prerequisites: string[];       // IDs of required prior licenses
  applicableTo: {
    businessTypes: BusinessType[];
    locationTypes: LocationType[];
    activities: Activity[];      // Match ANY of these
    entityTypes: EntityType[];
  };
  tags: string[];                // For filtering/grouping
}

// Checklist Result (computed)
interface ChecklistResult {
  profile: BusinessProfile;
  requirements: LicenseRequirement[];
  totalFixedCost: number;        // Sum of known fixed costs
  estimatedVariableCost: string; // "Varies" or range
  generatedAt: Date;
}
```

### 3.3 Application State

```typescript
interface AppState {
  // Wizard state
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  profile: Partial<BusinessProfile>;
  
  // Results state
  result: ChecklistResult | null;
  
  // UI state
  expandedSections: string[];    // Which accordion sections are open
  checkedItems: string[];        // User-checked items (persisted)
  
  // History
  previousProfiles: BusinessProfile[]; // For "start over" comparison
}
```

---

## 4. Core Logic: Requirement Engine

### 4.1 Matching Algorithm

```typescript
function getRequirements(profile: BusinessProfile): LicenseRequirement[] {
  return LICENSE_DATABASE.filter(req => {
    // Must match business type
    if (!req.applicableTo.businessTypes.includes(profile.businessType)) {
      return false;
    }
    
    // Must match location type
    if (!req.applicableTo.locationTypes.includes(profile.locationType)) {
      return false;
    }
    
    // Must match at least one activity (if specified)
    if (req.applicableTo.activities.length > 0) {
      const hasMatchingActivity = req.applicableTo.activities.some(
        act => profile.activities.includes(act)
      );
      if (!hasMatchingActivity) return false;
    }
    
    // Must match entity type
    if (!req.applicableTo.entityTypes.includes(profile.entityType)) {
      return false;
    }
    
    return true;
  });
}
```

### 4.2 License Database Structure

```typescript
// Simplified example entries
const LICENSE_DATABASE: LicenseRequirement[] = [
  {
    id: 'ein-federal',
    name: 'EIN (Employer Identification Number)',
    description: 'Tax ID for businesses with employees or LLCs/Corps',
    level: 'federal',
    authority: 'IRS',
    authorityContact: {
      website: 'https://www.irs.gov/ein'
    },
    cost: { type: 'free', amount: 0 },
    isRenewable: false,
    formUrl: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online',
    applicableTo: {
      businessTypes: ['restaurant', 'retail', 'contractor', 'professional', 'transportation', 'alcohol', 'firearms', 'agriculture'],
      locationTypes: ['commercial', 'home', 'mobile', 'online'],
      activities: ['employees'],
      entityTypes: ['llc', 'corporation', 'partnership']
    },
    tags: ['tax', 'required']
  },
  {
    id: 'ohio-llc-registration',
    name: 'Ohio LLC Registration',
    description: 'Register LLC with Ohio Secretary of State',
    level: 'state',
    authority: 'Ohio Secretary of State',
    authorityContact: {
      phone: '614-466-3910',
      email: 'business@sos.state.oh.us',
      website: 'https://www.ohiosos.gov/businesses/',
      address: '180 E Broad St, Columbus, OH'
    },
    cost: { type: 'fixed', amount: 99 },
    isRenewable: false,
    formUrl: 'https://www.ohiosos.gov/globalassets/business/forms/533a.pdf',
    processingTime: '3-5 business days',
    applicableTo: {
      businessTypes: ['restaurant', 'retail', 'contractor', 'home-based', 'professional', 'transportation', 'alcohol', 'firearms', 'agriculture'],
      locationTypes: ['commercial', 'home', 'mobile', 'online'],
      activities: [],
      entityTypes: ['llc']
    },
    tags: ['entity', 'required']
  },
  // ... additional entries
];
```

---

## 5. UI/UX Specifications

### 5.1 Design System

| Element | Specification |
|---------|--------------|
| **Primary Color** | `#1e40af` (Blue-800) — trust, government |
| **Secondary Color** | `#059669` (Green-600) — success, action |
| **Accent Color** | `#d97706` (Amber-600) — warnings, variable costs |
| **Background** | `#f8fafc` (Slate-50) — clean, readable |
| **Font** | Inter (Google Fonts) — modern, accessible |
| **Border Radius** | 8px — friendly but professional |
| **Max Width** | 640px — comfortable reading |

### 5.2 Component Specifications

#### Wizard Step Card
```
┌──────────────────────────────────────┐
│  Step X of 5                         │
│                                      │
│  [Icon]                              │
│  Question Title                      │
│  Optional subtitle                   │
│                                      │
│  ○ Option 1                          │
│  ○ Option 2                          │
│  ○ Option 3                          │
│                                      │
│  [← Back]        [Continue →]        │
└──────────────────────────────────────┘
```

#### Requirement Card (Results)
```
┌──────────────────────────────────────┐
│  ☐  Requirement Name                 │
│      Description text...             │
│                                      │
│      💰 Cost: $99 (fixed)            │
│      🏛️ Authority: Ohio SOS          │
│      ⏱️ Processing: 3-5 days         │
│                                      │
│      [Download Form] [Apply Online]  │
│      📞 614-466-3910                 │
└──────────────────────────────────────┘
```

### 5.3 Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| Mobile (<640px) | Full-width cards, stacked buttons |
| Tablet (640-1024px) | Centered content, max-w-xl |
| Desktop (>1024px) | Sidebar ad/promo space optional |

### 5.4 Accessibility Requirements

- WCAG 2.1 AA compliance
- All interactive elements keyboard accessible
- ARIA labels for screen readers
- Focus visible indicators
- Color contrast ratio ≥ 4.5:1
- Reduced motion support

---

## 6. Feature Specifications

### 6.1 P0 (MVP) Features

| Feature | Description | Implementation |
|---------|-------------|----------------|
| Multi-step wizard | 5-step questionnaire | React state machine |
| Dynamic results | Filtered requirements list | Matching algorithm |
| Cost calculator | Sum fixed costs, flag variable | Computed from data |
| Printable checklist | PDF generation | jsPDF |
| Email results | mailto: with formatted body | URI encoding |
| Local persistence | Save/restore wizard progress | localStorage |
| Mobile responsive | Works on all devices | Tailwind breakpoints |

### 6.2 P1 (Post-MVP) Features

| Feature | Description | Complexity |
|---------|-------------|------------|
| Calendar reminders | Generate .ics files | Low |
| Progress tracking | Check off completed items | Low |
| Renewal alerts | Email reminders (if email captured) | Medium |
| Zoning lookup | Address-based zoning check | High (needs API) |
| Form pre-fill | Auto-populate PDF forms | High (PDF manipulation) |
| Multi-language | Spanish translation | Medium |
| Analytics dashboard | Usage metrics | Low |

### 6.3 P2 (Future) Features

| Feature | Description |
|---------|-------------|
| Account system | Save multiple checklists |
| Document storage | Upload license documents |
| Renewal automation | Auto-renewal for some licenses |
| Township expansion | Cover all Ashtabula County townships |
| API for partners | SBDC/Chamber integration |

---

## 7. Integration Points

### 7.1 External Links (All P0)

| Destination | URL Pattern | Notes |
|-------------|-------------|-------|
| IRS EIN | `https://www.irs.gov/ein` | Opens new tab |
| Ohio SOS | `https://www.ohiosos.gov/businesses/` | Opens new tab |
| Ohio Business Gateway | `https://business.ohio.gov/` | Opens new tab |
| County Forms | Direct PDF URLs | Download or view |
| City PCD Email | `mailto:PCD@cityofashtabula.com` | Pre-populated subject |

### 7.2 Email Templates

**Results Email Format:**
```
Subject: Your Ashtabula Business License Checklist

Hi there,

Based on your answers, here are the licenses you may need:

FEDERAL:
- [ ] EIN (Free) — https://irs.gov/ein

STATE:
- [ ] LLC Registration ($99) — Form 533A
...

Total Fixed Costs: $X

This checklist was generated by the Ashtabula License Wizard.
Requirements may change — always verify with the issuing authority.
```

---

## 8. Security & Privacy

### 8.1 Data Handling

| Aspect | Approach |
|--------|----------|
| **Data Collection** | No PII required for core function |
| **Optional Email** | Only if user wants results emailed |
| **Storage** | 100% client-side (localStorage) |
| **Server** | Static hosting only, no backend |
| **Analytics** | Privacy-first (no cookies, anonymized) |
| **Third Parties** | No data shared with third parties |

### 8.2 Compliance

- No HIPAA (not healthcare)
- No PCI-DSS (no payments)
- Optional GDPR compliance for analytics

### 8.3 Disclaimer

Required legal disclaimer on results page:
> "This tool provides general guidance only. Licensing requirements change frequently and may vary based on specific circumstances. Always verify requirements directly with the issuing authority before starting your business."

---

## 9. Testing Strategy

### 9.1 Unit Tests

```typescript
// Example test cases
describe('Requirement Engine', () => {
  it('returns EIN for LLC with employees', () => {
    const profile = { entityType: 'llc', activities: ['employees'], ... };
    const reqs = getRequirements(profile);
    expect(reqs).toContainEqual(expect.objectContaining({ id: 'ein-federal' }));
  });
  
  it('returns food license for restaurant serving food', () => {
    const profile = { businessType: 'restaurant', activities: ['serve-food'], ... };
    const reqs = getRequirements(profile);
    expect(reqs).toContainEqual(expect.objectContaining({ id: 'county-food-service' }));
  });
  
  it('calculates correct fixed cost total', () => {
    const profile = { entityType: 'llc', ... };
    const result = generateChecklist(profile);
    expect(result.totalFixedCost).toBe(174); // $99 + $25 + $50
  });
});
```

### 9.2 E2E Test Scenarios

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Restaurant flow | Select restaurant → commercial → [serve-food, employees] → LLC | Shows EIN, LLC reg, vendor license, food service, zoning, sign permits |
| Home-based flow | Select home-based → home → [sell-products] → sole prop | Shows home occupation, vendor license (no entity reg) |
| Save/restore | Complete step 3, refresh | Returns to step 3 with answers preserved |
| PDF generation | Complete wizard, click Download PDF | PDF downloads with all requirements |

---

## 10. Deployment

### 10.1 Build Configuration

```javascript
// vite.config.js
export default {
  base: '/license-wizard/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  plugins: [react()]
};
```

### 10.2 Hosting Options

| Option | Cost | Best For |
|--------|------|----------|
| Cloudflare Pages | Free | Primary recommendation |
| Netlify | Free | Alternative |
| Vercel | Free | Alternative |
| GitHub Pages | Free | Simplest option |

### 10.3 Custom Domain

Recommended: `licenses.ashtabulabusiness.com` or `wizard.newashtabula.org`

---

## 11. Success Metrics

### 11.1 Usage Metrics

| Metric | Target (30 days) | Target (90 days) |
|--------|------------------|------------------|
| Wizard completions | 50 | 200 |
| Checklist downloads | 30 | 150 |
| Email shares | 20 | 100 |
| Average completion rate | >60% | >70% |

### 11.2 Business Metrics

| Metric | Measurement |
|--------|-------------|
| Support inquiries reduced | City PCD email volume |
| Time to open business | Survey follow-up |
| User satisfaction | In-app NPS (post-MVP) |
| Partner adoption | SBDC/Chamber referrals |

### 11.3 Technical Metrics

| Metric | Target |
|--------|--------|
| Page load time | <2s |
| Lighthouse score | >90 |
| Uptime | 99.9% |
| Error rate | <0.1% |

---

## 12. Open Questions

1. **City Partnership:** Can we get official endorsement from City PCD for accuracy?
2. **Fee Schedule:** Can we obtain standard fee ranges for variable city permits?
3. **Township Expansion:** Should we include Geneva, Conneaut, and townships initially?
4. **Renewal Tracking:** Do we want to capture email for renewal reminders?
5. **Analytics:** What level of usage tracking is acceptable to the city?

---

## 13. Appendix

### 13.1 File Structure

```
license-wizard/
├── public/
│   └── forms/           # Downloadable PDFs (if mirrored locally)
├── src/
│   ├── components/
│   │   ├── Wizard/      # Step components
│   │   ├── Results/     # Checklist display
│   │   └── UI/          # Shared components
│   ├── data/
│   │   └── licenses.ts  # Master license database
│   ├── hooks/
│   │   ├── useWizard.ts # Wizard state logic
│   │   └── useStorage.ts # localStorage hook
│   ├── utils/
│   │   ├── pdf.ts       # PDF generation
│   │   ├── calendar.ts  # .ics generation
│   │   └── matcher.ts   # Requirement matching
│   ├── types/
│   │   └── index.ts     # TypeScript interfaces
│   ├── App.tsx
│   └── main.tsx
├── dist/                # Build output
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

### 13.2 Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1",
    "file-saver": "^2.0.5",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0",
    "vitest": "^0.34.0"
  }
}
```

---

**Document Version:** 1.0  
**Last Updated:** February 19, 2026  
**Next Steps:** Phase 4 — Build Checklist
