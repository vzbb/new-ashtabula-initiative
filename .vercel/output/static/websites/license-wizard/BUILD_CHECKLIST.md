# License Wizard — Build Checklist
**Project:** license-wizard (P1 Civic Tool)  
**Phase:** 4 — Implementation  
**Date:** February 19, 2026  
**Status:** 🟢 Ready for Development

---

## Pre-Flight Checklist

- [ ] Review SPEC.md completely
- [ ] Confirm tech stack availability (React 18, Vite, Tailwind)
- [ ] Set up development environment
- [ ] Create feature branch: `git checkout -b build/license-wizard`

---

## Week 1: Core Foundation

### Day 1-2: Project Setup & Types

**Step 1.1: Install Dependencies**
```bash
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/license-wizard
npm install jspdf html2canvas file-saver uuid
npm install -D @types/uuid vitest
```

**Step 1.2: Create Type Definitions**
```bash
mkdir -p src/types src/data src/hooks src/utils src/components/Wizard src/components/Results src/components/UI
```

Create `src/types/index.ts`:
```typescript
// Business Profile (user inputs)
export interface BusinessProfile {
  id: string;
  businessType: BusinessType;
  locationType: LocationType;
  activities: Activity[];
  entityType: EntityType;
  createdAt: Date;
}

export type BusinessType = 
  | 'restaurant' | 'retail' | 'contractor' | 'home-based'
  | 'professional' | 'transportation' | 'alcohol' | 'firearms' | 'agriculture';

export type LocationType = 'commercial' | 'home' | 'mobile' | 'online';

export type Activity = 
  | 'sell-products' | 'serve-food' | 'sell-alcohol' | 'construction'
  | 'employees' | 'commercial-vehicles' | 'professional-services';

export type EntityType = 'llc' | 'corporation' | 'sole-proprietorship' | 'partnership';

export type LicenseLevel = 'federal' | 'state' | 'county' | 'city';

export interface LicenseRequirement {
  id: string;
  name: string;
  description: string;
  level: LicenseLevel;
  authority: string;
  authorityContact: {
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    hours?: string;
  };
  cost: {
    amount: number | null;
    type: 'fixed' | 'variable' | 'free';
    notes?: string;
  };
  formUrl?: string;
  isRenewable: boolean;
  renewalPeriod?: 'annual' | 'biennial' | 'one-time';
  renewalCost?: number;
  processingTime?: string;
  prerequisites: string[];
  applicableTo: {
    businessTypes: BusinessType[];
    locationTypes: LocationType[];
    activities: Activity[];
    entityTypes: EntityType[];
  };
  tags: string[];
}

export interface ChecklistResult {
  profile: BusinessProfile;
  requirements: LicenseRequirement[];
  totalFixedCost: number;
  estimatedVariableCost: string;
  generatedAt: Date;
}

export interface AppState {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  profile: Partial<BusinessProfile>;
  result: ChecklistResult | null;
  expandedSections: LicenseLevel[];
  checkedItems: string[];
  previousProfiles: BusinessProfile[];
}
```

**Verification:** Run `npm run dev` — should start without TypeScript errors.

---

### Day 3-4: License Database

**Step 2.1: Create Master License Database**

Create `src/data/licenses.ts` with initial 15-20 entries covering:
- Federal: EIN, TTB (alcohol), ATF (firearms)
- State: LLC/Corp registration, Vendor's license, Workers' Comp, Unemployment
- County: County vendor license, Food service license, Health permits
- City: Zoning permit, Sign permit, Home occupation

**Step 2.2: Create Matching Engine**

Create `src/utils/matcher.ts`:
```typescript
import { BusinessProfile, LicenseRequirement, ChecklistResult } from '../types';
import { LICENSE_DATABASE } from '../data/licenses';

export function getRequirements(profile: BusinessProfile): LicenseRequirement[] {
  return LICENSE_DATABASE.filter(req => {
    if (!req.applicableTo.businessTypes.includes(profile.businessType)) return false;
    if (!req.applicableTo.locationTypes.includes(profile.locationType)) return false;
    if (req.applicableTo.activities.length > 0) {
      const hasMatch = req.applicableTo.activities.some(act => 
        profile.activities.includes(act)
      );
      if (!hasMatch) return false;
    }
    if (!req.applicableTo.entityTypes.includes(profile.entityType)) return false;
    return true;
  });
}

export function generateChecklist(profile: BusinessProfile): ChecklistResult {
  const requirements = getRequirements(profile);
  const fixedCosts = requirements
    .filter(r => r.cost.type === 'fixed' && r.cost.amount !== null)
    .reduce((sum, r) => sum + (r.cost.amount || 0), 0);
  
  const hasVariable = requirements.some(r => r.cost.type === 'variable');
  
  return {
    profile,
    requirements,
    totalFixedCost: fixedCosts,
    estimatedVariableCost: hasVariable ? "Varies — contact authority" : "All fixed costs known",
    generatedAt: new Date()
  };
}
```

---

### Day 5-7: Wizard State Management

**Step 3.1: Create useWizard Hook**

Create `src/hooks/useWizard.ts`:
```typescript
import { useReducer, useEffect } from 'react';
import { BusinessProfile, AppState, ChecklistResult } from '../types';
import { generateChecklist } from '../utils/matcher';
import { v4 as uuidv4 } from 'uuid';

type WizardAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_PROFILE_FIELD'; field: keyof BusinessProfile; value: any }
  | { type: 'GENERATE_RESULTS' }
  | { type: 'TOGGLE_SECTION'; level: string }
  | { type: 'TOGGLE_CHECKED'; id: string }
  | { type: 'RESET_WIZARD' }
  | { type: 'LOAD_SAVED'; state: AppState };

const STORAGE_KEY = 'license-wizard-state';

const initialState: AppState = {
  currentStep: 1,
  profile: {},
  result: null,
  expandedSections: ['federal', 'state', 'county', 'city'],
  checkedItems: [],
  previousProfiles: []
};

function wizardReducer(state: AppState, action: WizardAction): AppState {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 6) as any };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) as any };
    case 'SET_PROFILE_FIELD':
      return { 
        ...state, 
        profile: { ...state.profile, [action.field]: action.value } 
      };
    case 'GENERATE_RESULTS': {
      if (!isProfileComplete(state.profile)) return state;
      const profile = { ...state.profile, id: uuidv4(), createdAt: new Date() } as BusinessProfile;
      const result = generateChecklist(profile);
      return {
        ...state,
        result,
        currentStep: 6,
        previousProfiles: [profile, ...state.previousProfiles].slice(0, 5)
      };
    }
    case 'TOGGLE_SECTION':
      return {
        ...state,
        expandedSections: state.expandedSections.includes(action.level as any)
          ? state.expandedSections.filter(s => s !== action.level)
          : [...state.expandedSections, action.level]
      };
    case 'TOGGLE_CHECKED':
      return {
        ...state,
        checkedItems: state.checkedItems.includes(action.id)
          ? state.checkedItems.filter(id => id !== action.id)
          : [...state.checkedItems, action.id]
      };
    case 'RESET_WIZARD':
      return { ...initialState, previousProfiles: state.previousProfiles };
    case 'LOAD_SAVED':
      return action.state;
    default:
      return state;
  }
}

function isProfileComplete(profile: Partial<BusinessProfile>): boolean {
  return !!(
    profile.businessType &&
    profile.locationType &&
    profile.activities &&
    profile.activities.length > 0 &&
    profile.entityType
  );
}

export function useWizard() {
  const [state, dispatch] = useReducer(wizardReducer, initialState, () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return { state, dispatch };
}
```

---

## Week 2: UI Components

### Day 8-10: Wizard Steps

**Step 4.1: Welcome Step**
```tsx
// src/components/Wizard/WelcomeStep.tsx
export function WelcomeStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold text-blue-900 mb-4">
        What licenses does your Ashtabula business need?
      </h1>
      <p className="text-gray-600 mb-8 text-lg">
        Answer 5 quick questions for a personalized checklist
      </p>
      <button
        onClick={onStart}
        className="bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
      >
        Start
      </button>
    </div>
  );
}
```

**Step 4.2: Selection Step Component**
```tsx
// src/components/Wizard/SelectionStep.tsx
interface SelectionStepProps {
  stepNumber: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  options: { value: string; label: string; icon?: string }[];
  selected: string | string[];
  multiple?: boolean;
  onSelect: (value: string | string[]) => void;
  onNext: () => void;
  onBack: () => void;
}
```

**Step 4.3: Create All 5 Steps**
- Step 1: Welcome (intro)
- Step 2: Business Type (single select: 9 options)
- Step 3: Location Type (single select: 4 options)
- Step 4: Activities (multi-select: 7 options)
- Step 5: Entity Type (single select: 4 options)

---

### Day 11-13: Results Page

**Step 5.1: Results Container**
```tsx
// src/components/Results/ResultsPage.tsx
interface ResultsPageProps {
  result: ChecklistResult;
  expandedSections: string[];
  checkedItems: string[];
  onToggleSection: (level: string) => void;
  onToggleChecked: (id: string) => void;
  onDownloadPDF: () => void;
  onEmailResults: () => void;
  onReset: () => void;
}
```

**Step 5.2: Requirement Card**
```tsx
// src/components/Results/RequirementCard.tsx
interface RequirementCardProps {
  requirement: LicenseRequirement;
  isChecked: boolean;
  onToggle: () => void;
}
```

**Step 5.3: Cost Summary Banner**
- Total fixed costs
- Variable cost indicator
- Processing time estimates

---

### Day 14: Export Utilities

**Step 6.1: PDF Generation**

Create `src/utils/pdf.ts`:
```typescript
import jsPDF from 'jspdf';
import { ChecklistResult } from '../types';

export function generatePDF(result: ChecklistResult): jsPDF {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Ashtabula Business License Checklist', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Generated: ${result.generatedAt.toLocaleDateString()}`, 20, 30);
  doc.text(`Business Type: ${result.profile.businessType}`, 20, 40);
  doc.text(`Location: ${result.profile.locationType}`, 20, 48);
  doc.text(`Entity: ${result.profile.entityType}`, 20, 56);
  
  // Group by level
  let y = 70;
  const levels = ['federal', 'state', 'county', 'city'] as const;
  
  for (const level of levels) {
    const reqs = result.requirements.filter(r => r.level === level);
    if (reqs.length === 0) continue;
    
    doc.setFontSize(14);
    doc.text(level.toUpperCase(), 20, y);
    y += 10;
    
    for (const req of reqs) {
      doc.setFontSize(11);
      doc.text(`☐ ${req.name}`, 25, y);
      y += 6;
      doc.setFontSize(10);
      doc.text(`   ${req.description}`, 25, y);
      y += 6;
      
      const costText = req.cost.type === 'free' 
        ? 'Free' 
        : req.cost.type === 'fixed' 
          ? `$${req.cost.amount}` 
          : 'Varies';
      doc.text(`   Cost: ${costText}`, 25, y);
      y += 10;
      
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    }
    y += 5;
  }
  
  // Footer
  doc.setFontSize(10);
  doc.text('Generated by Ashtabula License Wizard', 20, 280);
  doc.text('Requirements may change — verify with issuing authority', 20, 285);
  
  return doc;
}
```

**Step 6.2: Email Formatting**
```typescript
// src/utils/email.ts
export function generateEmailBody(result: ChecklistResult): string {
  const lines = [
    'Hi there,',
    '',
    'Based on your answers, here are the licenses you may need:',
    '',
    ...formatRequirementsForEmail(result.requirements),
    '',
    `Total Fixed Costs: $${result.totalFixedCost}`,
    '',
    '---',
    'This checklist was generated by the Ashtabula License Wizard.',
    'Requirements may change — always verify with the issuing authority.'
  ];
  return encodeURIComponent(lines.join('\n'));
}
```

---

## Week 3: Integration & Polish

### Day 15-17: Main App Integration

**Step 7.1: App.tsx Wiring**
```tsx
// src/App.tsx
import { useWizard } from './hooks/useWizard';
import { WelcomeStep } from './components/Wizard/WelcomeStep';
import { SelectionStep } from './components/Wizard/SelectionStep';
import { ResultsPage } from './components/Results/ResultsPage';

function App() {
  const { state, dispatch } = useWizard();
  
  const renderStep = () => {
    switch (state.currentStep) {
      case 1: return <WelcomeStep onStart={() => dispatch({ type: 'NEXT_STEP' })} />;
      case 2: return /* BusinessType step */;
      case 3: return /* LocationType step */;
      case 4: return /* Activities step */;
      case 5: return /* EntityType step */;
      case 6: return state.result && <ResultsPage /* ... */ />;
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {renderStep()}
      </div>
    </div>
  );
}
```

**Step 7.2: Progress Indicator**
- Step dots showing progress
- Current step highlighted

**Step 7.3: Navigation Footer**
- Back/Next buttons
- Save progress indicator

---

### Day 18-19: Styling & Responsive

**Step 8.1: Tailwind Configuration**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',    // Blue-800
        secondary: '#059669',  // Green-600
        accent: '#d97706',     // Amber-600
      }
    }
  }
};
```

**Step 8.2: Mobile Optimization**
- Full-width on mobile (<640px)
- Touch-friendly buttons (min 44px)
- Stacked layouts

---

### Day 20: Accessibility

**Step 9.1: ARIA Labels**
- aria-label on all interactive elements
- aria-expanded on accordions
- aria-checked on checkboxes

**Step 9.2: Keyboard Navigation**
- Tab order logical
- Enter/Space activation
- Escape to close modals

**Step 9.3: Focus Management**
- Visible focus rings
- Focus trap in modals

---

## Week 4: Testing & Deployment

### Day 21-23: Testing

**Step 10.1: Unit Tests**
```typescript
// src/utils/matcher.test.ts
import { describe, it, expect } from 'vitest';
import { getRequirements } from './matcher';

describe('Requirement Engine', () => {
  it('returns EIN for LLC with employees', () => {
    const profile = {
      businessType: 'restaurant',
      locationType: 'commercial',
      activities: ['employees'],
      entityType: 'llc',
      id: 'test',
      createdAt: new Date()
    };
    const reqs = getRequirements(profile);
    expect(reqs.some(r => r.id === 'ein-federal')).toBe(true);
  });
  
  it('returns food license for restaurant', () => {
    const profile = {
      businessType: 'restaurant',
      locationType: 'commercial',
      activities: ['serve-food'],
      entityType: 'llc',
      id: 'test',
      createdAt: new Date()
    };
    const reqs = getRequirements(profile);
    expect(reqs.some(r => r.level === 'county' && r.tags.includes('food'))).toBe(true);
  });
});
```

**Step 10.2: E2E Test Scenarios**
| Scenario | Expected |
|----------|----------|
| Restaurant → Commercial → [serve-food, employees] → LLC | Shows EIN, LLC reg, vendor license, food service, zoning |
| Home-based → Home → [sell-products] → Sole prop | Shows home occupation, vendor license |
| Complete wizard, refresh | Returns to same step with data preserved |
| Click Download PDF | PDF downloads with correct content |

---

### Day 24-25: Analytics & Monitoring

**Step 11.1: Add Plausible/SimpleAnalytics**
```html
<!-- index.html -->
<script defer data-domain="licenses.newashtabula.org" src="https://plausible.io/js/script.js"></script>
```

**Step 11.2: Event Tracking**
- Wizard completions
- PDF downloads
- Email shares
- Step drop-offs

---

### Day 26-28: Build & Deploy

**Step 12.1: Production Build**
```bash
npm run build
```

**Step 12.2: Deploy Script**
Add to cycle.sh:
```bash
echo "Deploying license-wizard..."
cd websites/license-wizard
npm run build
# Deploy dist/ to hosting
```

**Step 12.3: Pre-Launch Checklist**
- [ ] All P0 features working
- [ ] Mobile responsive verified
- [ ] PDF generation tested
- [ ] Email formatting correct
- [ ] Analytics receiving data
- [ ] Disclaimer visible
- [ ] License data accurate

---

## Post-Launch Tasks

### Immediate (Week 1)
- [ ] Monitor error rates
- [ ] Check completion rates
- [ ] Gather initial feedback

### Short Term (Month 1)
- [ ] Add missing license types
- [ ] Implement P1 features (calendar, progress tracking)
- [ ] Partner outreach (SBDC, Chamber)

### Long Term
- [ ] Township expansion
- [ ] Multi-language support
- [ ] Account system for renewal tracking

---

## File Checklist Summary

| File | Purpose | Week |
|------|---------|------|
| `src/types/index.ts` | TypeScript interfaces | 1 |
| `src/data/licenses.ts` | Master license database | 1 |
| `src/utils/matcher.ts` | Requirement matching engine | 1 |
| `src/utils/pdf.ts` | PDF generation | 2 |
| `src/utils/email.ts` | Email formatting | 2 |
| `src/hooks/useWizard.ts` | State management | 1 |
| `src/components/Wizard/*.tsx` | Wizard steps | 2 |
| `src/components/Results/*.tsx` | Results display | 2 |
| `src/App.tsx` | Main application | 3 |
| `src/utils/matcher.test.ts` | Unit tests | 4 |

---

**Estimated Timeline:** 4 weeks (20 development days)  
**Estimated Cost:** $15-30/month hosting (Cloudflare Pages free tier available)  
**Next Review:** After Week 2 checkpoint
