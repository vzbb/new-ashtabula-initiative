# License Wizard — Phase 4 Build Checklist
**Date:** February 20, 2026  
**Status:** 🟢 Ready for Implementation  
**Estimated Time:** 6-8 hours (single developer)  
**Project:** license-wizard (P1 Civic Tool)

---

## Pre-Build Checklist

- [ ] Review SPEC.md for feature completeness
- [ ] Confirm tech stack decision (React + Vite + Tailwind)
- [ ] Verify all license requirement data sources
- [ ] Set up development environment
- [ ] Create project repository/branch

---

## Phase 1: Project Initialization (30 min)

### 1.1 Create Project Structure
```bash
# Create project directory
mkdir -p ~/projects/ashtabula/license-wizard
cd ~/projects/ashtabula/license-wizard

# Initialize with Vite + React + TypeScript
npm create vite@latest . -- --template react-ts

# Install core dependencies
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install UI and utility libraries
npm install lucide-react jsPDF
npm install -D @types/node
```

### 1.2 Configure Tailwind CSS
**File:** `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        }
      }
    },
  },
  plugins: [],
}
```

**File:** `src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900 antialiased;
  }
}

@layer components {
  .wizard-container {
    @apply max-w-2xl mx-auto px-4 py-8;
  }
  
  .step-indicator {
    @apply flex items-center justify-center mb-8;
  }
  
  .step-dot {
    @apply w-3 h-3 rounded-full mx-1 transition-colors duration-200;
  }
  
  .step-dot.active {
    @apply bg-primary-600;
  }
  
  .step-dot.completed {
    @apply bg-accent-500;
  }
  
  .step-dot.pending {
    @apply bg-gray-300;
  }
  
  .option-card {
    @apply border-2 border-gray-200 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-primary-400 hover:shadow-md;
  }
  
  .option-card.selected {
    @apply border-primary-600 bg-primary-50 shadow-md;
  }
  
  .btn-primary {
    @apply bg-primary-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
  }
  
  .btn-secondary {
    @apply bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors;
  }
}
```

### 1.3 Update TypeScript Config
**File:** `tsconfig.json` (add to existing)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 1.4 Project File Structure
```
src/
├── components/
│   ├── Wizard/
│   │   ├── WelcomeStep.tsx
│   │   ├── BusinessTypeStep.tsx
│   │   ├── LocationStep.tsx
│   │   ├── ActivitiesStep.tsx
│   │   ├── EntityStep.tsx
│   │   └── ResultsStep.tsx
│   ├── ui/
│   │   ├── StepIndicator.tsx
│   │   ├── OptionCard.tsx
│   │   └── LicenseCard.tsx
│   └── Layout/
│       └── Header.tsx
├── data/
│   ├── licenseDatabase.ts
│   ├── businessTypes.ts
│   └── requirements.ts
├── hooks/
│   └── useWizard.ts
├── types/
│   └── wizard.ts
├── utils/
│   ├── pdfGenerator.ts
│   └── emailBuilder.ts
├── App.tsx
└── main.tsx
```

---

## Phase 2: Core Types & Data (45 min)

### 2.1 Type Definitions
**File:** `src/types/wizard.ts`
```typescript
export type BusinessType = 
  | 'restaurant' 
  | 'retail' 
  | 'contractor' 
  | 'home-based'
  | 'professional'
  | 'transportation'
  | 'alcohol'
  | 'firearms'
  | 'agriculture';

export type LocationType = 
  | 'commercial' 
  | 'home-based' 
  | 'mobile' 
  | 'online';

export type ActivityType = 
  | 'sell-products'
  | 'serve-food'
  | 'sell-alcohol'
  | 'construction'
  | 'employees'
  | 'commercial-vehicles'
  | 'professional-services';

export type EntityType = 
  | 'llc' 
  | 'corporation' 
  | 'sole-proprietorship' 
  | 'partnership';

export interface BusinessProfile {
  businessType: BusinessType | null;
  locationType: LocationType | null;
  activities: ActivityType[];
  entityType: EntityType | null;
}

export interface LicenseRequirement {
  id: string;
  name: string;
  description: string;
  jurisdiction: 'federal' | 'state' | 'county' | 'city';
  category: string;
  cost: {
    min: number;
    max: number;
    notes?: string;
  };
  timeline: string;
  renewalPeriod: string;
  formUrl?: string;
  contactInfo: {
    phone?: string;
    email?: string;
    office?: string;
  };
  prerequisites?: string[];
  appliesTo: {
    businessTypes?: BusinessType[];
    locationTypes?: LocationType[];
    activities?: ActivityType[];
    entityTypes?: EntityType[];
  };
}

export type WizardStep = 
  | 'welcome' 
  | 'business-type' 
  | 'location' 
  | 'activities' 
  | 'entity' 
  | 'results';
```

### 2.2 License Database
**File:** `src/data/licenseDatabase.ts`
```typescript
import { LicenseRequirement } from '../types/wizard';

export const licenseDatabase: LicenseRequirement[] = [
  // FEDERAL
  {
    id: 'fed-ein',
    name: 'EIN (Employer Identification Number)',
    description: 'Federal tax ID required for all businesses with employees or corporations/LLCs',
    jurisdiction: 'federal',
    category: 'Tax Registration',
    cost: { min: 0, max: 0, notes: 'Free from IRS' },
    timeline: 'Immediate (online)',
    renewalPeriod: 'None',
    formUrl: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online',
    contactInfo: {
      phone: '1-800-829-4933',
      office: 'IRS Business & Specialty Tax Line'
    },
    appliesTo: {
      entityTypes: ['llc', 'corporation', 'partnership']
    }
  },
  {
    id: 'fed-ttb',
    name: 'TTB Permit (Alcohol & Tobacco Tax and Trade Bureau)',
    description: 'Required for manufacturing, importing, or selling alcohol at wholesale',
    jurisdiction: 'federal',
    category: 'Alcohol License',
    cost: { min: 0, max: 3500, notes: 'Varies by permit type' },
    timeline: '60-120 days',
    renewalPeriod: 'Annual',
    formUrl: 'https://www.ttb.gov/permits/permits-online',
    contactInfo: {
      phone: '1-877-882-3277',
      office: 'TTB National Revenue Center'
    },
    appliesTo: {
      activities: ['sell-alcohol']
    }
  },
  {
    id: 'fed-firearms',
    name: 'FFL (Federal Firearms License)',
    description: 'Required to manufacture or sell firearms and ammunition',
    jurisdiction: 'federal',
    category: 'Firearms License',
    cost: { min: 30, max: 3000, notes: 'Type 1 (dealer) = $200 for 3 years' },
    timeline: '60 days',
    renewalPeriod: '3 years',
    formUrl: 'https://www.atf.gov/firearms/apply-license',
    contactInfo: {
      phone: '1-800-800-3855',
      office: 'ATF Federal Firearms Licensing Center'
    },
    appliesTo: {
      businessTypes: ['firearms']
    }
  },
  {
    id: 'fed-dot',
    name: 'USDOT Number',
    description: 'Required for commercial vehicles operating interstate or over 10,000 lbs',
    jurisdiction: 'federal',
    category: 'Transportation',
    cost: { min: 0, max: 0, notes: 'Free registration' },
    timeline: 'Immediate',
    renewalPeriod: 'Biennial',
    formUrl: 'https://www.fmcsa.dot.gov/registration',
    contactInfo: {
      phone: '1-800-832-5660',
      office: 'FMCSA Registration'
    },
    appliesTo: {
      activities: ['commercial-vehicles'],
      businessTypes: ['transportation']
    }
  },
  
  // OHIO STATE
  {
    id: 'oh-sos',
    name: 'Ohio Secretary of State Business Registration',
    description: 'Register LLC, Corporation, or Partnership with Ohio',
    jurisdiction: 'state',
    category: 'Entity Registration',
    cost: { min: 99, max: 125, notes: 'LLC = $99, Corp = $125' },
    timeline: '3-7 business days',
    renewalPeriod: 'None (file Statement of Continued Existence every 5 years for Corps)',
    formUrl: 'https://businesssearch.ohiosos.gov/',
    contactInfo: {
      phone: '1-877-767-3453',
      office: 'Ohio Secretary of State Business Services'
    },
    appliesTo: {
      entityTypes: ['llc', 'corporation', 'partnership']
    }
  },
  {
    id: 'oh-vendor',
    name: 'Ohio Vendor\'s License',
    description: 'Required to sell tangible personal property in Ohio',
    jurisdiction: 'state',
    category: 'Sales Tax',
    cost: { min: 25, max: 25 },
    timeline: 'Immediate (online)',
    renewalPeriod: 'None',
    formUrl: 'https://tax.ohio.gov/business/obligations/sales-and-use/vendors-license',
    contactInfo: {
      phone: '1-888-405-4039',
      office: 'Ohio Department of Taxation'
    },
    appliesTo: {
      activities: ['sell-products', 'serve-food']
    }
  },
  {
    id: 'oh-workers-comp',
    name: 'Ohio Workers\' Compensation Coverage',
    description: 'Required for employers with 1+ employees',
    jurisdiction: 'state',
    category: 'Insurance',
    cost: { min: 0, max: 0, notes: 'Premium based on payroll/industry' },
    timeline: 'Immediate',
    renewalPeriod: 'Annual',
    formUrl: 'https://www.bwc.ohio.gov/employer/default.asp',
    contactInfo: {
      phone: '1-800-644-6292',
      office: 'Ohio BWC Employer Services'
    },
    appliesTo: {
      activities: ['employees']
    }
  },
  {
    id: 'oh-unemployment',
    name: 'Ohio Unemployment Compensation Account',
    description: 'Required for employers paying $150+ per quarter or 1+ employees in 20 weeks',
    jurisdiction: 'state',
    category: 'Tax Registration',
    cost: { min: 0, max: 0, notes: 'Contribution based on experience rating' },
    timeline: 'Immediate',
    renewalPeriod: 'Quarterly reporting',
    formUrl: 'https://jfs.ohio.gov/ouc/employer/registration.stm',
    contactInfo: {
      phone: '1-614-466-2317',
      office: 'Ohio Department of Job and Family Services'
    },
    appliesTo: {
      activities: ['employees']
    }
  },
  {
    id: 'oh-food-service',
    name: 'Ohio Food Service License',
    description: 'Required for all food service operations (restaurants, catering, food trucks)',
    jurisdiction: 'state',
    category: 'Health Permit',
    cost: { min: 100, max: 500, notes: 'Based on risk level and seating' },
    timeline: '14-30 days (after inspection)',
    renewalPeriod: 'Annual',
    contactInfo: {
      phone: '440-576-6010',
      office: 'Ashtabula County Health District'
    },
    prerequisites: ['Food Safety Certification'],
    appliesTo: {
      activities: ['serve-food']
    }
  },
  
  // ASHTABULA COUNTY
  {
    id: 'acbldg-commercial',
    name: 'Ashtabula County Building Permit (Commercial)',
    description: 'Required for new construction, additions, or major renovations to commercial buildings',
    jurisdiction: 'county',
    category: 'Building Permit',
    cost: { min: 100, max: 2000, notes: 'Based on project value' },
    timeline: '5-15 business days',
    renewalPeriod: 'Per project',
    contactInfo: {
      phone: '440-576-3737',
      office: 'Ashtabula County Building Department'
    },
    appliesTo: {
      locationTypes: ['commercial']
    }
  },
  {
    id: 'acbldg-home-occupation',
    name: 'Ashtabula County Home Occupation Permit',
    description: 'Required for home-based businesses in unincorporated areas',
    jurisdiction: 'county',
    category: 'Zoning Permit',
    cost: { min: 50, max: 100 },
    timeline: '5-10 business days',
    renewalPeriod: 'Annual',
    contactInfo: {
      phone: '440-576-9090',
      office: 'Ashtabula County Planning & Zoning'
    },
    appliesTo: {
      locationTypes: ['home-based']
    }
  },
  
  // CITY OF ASHTABULA
  {
    id: 'city-zoning',
    name: 'City of Ashtabula Zoning Permit',
    description: 'Required for new business locations, signage, and use changes',
    jurisdiction: 'city',
    category: 'Zoning Permit',
    cost: { min: 50, max: 200 },
    timeline: '10-14 business days',
    renewalPeriod: 'One-time per location',
    contactInfo: {
      phone: '440-992-7112',
      office: 'City of Ashtabula Planning & Zoning'
    },
    appliesTo: {
      locationTypes: ['commercial', 'home-based']
    }
  },
  {
    id: 'city-sign',
    name: 'City of Ashtabula Sign Permit',
    description: 'Required for all exterior business signage',
    jurisdiction: 'city',
    category: 'Sign Permit',
    cost: { min: 25, max: 150, notes: 'Based on sign type and size' },
    timeline: '5-10 business days',
    renewalPeriod: 'One-time per sign',
    contactInfo: {
      phone: '440-992-7112',
      office: 'City of Ashtabula Planning & Zoning'
    },
    appliesTo: {
      locationTypes: ['commercial']
    }
  },
  {
    id: 'city-home-occupation',
    name: 'City of Ashtabula Home Occupation Permit',
    description: 'Required for home-based businesses within city limits',
    jurisdiction: 'city',
    category: 'Zoning Permit',
    cost: { min: 50, max: 75 },
    timeline: '7-10 business days',
    renewalPeriod: 'Annual',
    contactInfo: {
      phone: '440-992-7112',
      email: 'PCD@cityofashtabula.com',
      office: 'City of Ashtabula Planning & Zoning'
    },
    appliesTo: {
      locationTypes: ['home-based']
    }
  }
];

// Helper function to filter requirements
export function getRequirementsForProfile(profile: {
  businessType: string | null;
  locationType: string | null;
  activities: string[];
  entityType: string | null;
}): LicenseRequirement[] {
  return licenseDatabase.filter(req => {
    // Check if requirement applies to this profile
    const applies = req.appliesTo;
    
    if (applies.businessTypes && profile.businessType && 
        !applies.businessTypes.includes(profile.businessType as any)) {
      return false;
    }
    
    if (applies.locationTypes && profile.locationType && 
        !applies.locationTypes.includes(profile.locationType as any)) {
      return false;
    }
    
    if (applies.activities && profile.activities.length > 0) {
      const hasMatchingActivity = applies.activities.some(act => 
        profile.activities.includes(act)
      );
      if (!hasMatchingActivity) return false;
    }
    
    if (applies.entityTypes && profile.entityType && 
        !applies.entityTypes.includes(profile.entityType as any)) {
      return false;
    }
    
    return true;
  });
}
```

### 2.3 Business Type Configurations
**File:** `src/data/businessTypes.ts`
```typescript
export const businessTypeConfig = {
  restaurant: {
    label: 'Restaurant / Food Service',
    icon: '🍽️',
    defaultActivities: ['serve-food', 'sell-products'],
    description: 'Restaurants, cafes, food trucks, catering'
  },
  retail: {
    label: 'Retail Store',
    icon: '🏪',
    defaultActivities: ['sell-products'],
    description: 'Shops, boutiques, convenience stores'
  },
  contractor: {
    label: 'Construction / Contracting',
    icon: '🔨',
    defaultActivities: ['construction'],
    description: 'Builders, remodelers, trades'
  },
  'home-based': {
    label: 'Home-Based Business',
    icon: '🏠',
    defaultActivities: ['professional-services'],
    description: 'Services run from home'
  },
  professional: {
    label: 'Professional Services',
    icon: '💼',
    defaultActivities: ['professional-services'],
    description: 'Consulting, accounting, legal, healthcare'
  },
  transportation: {
    label: 'Transportation / Trucking',
    icon: '🚚',
    defaultActivities: ['commercial-vehicles'],
    description: 'Delivery, moving, logistics'
  },
  alcohol: {
    label: 'Bar / Brewery / Distillery',
    icon: '🍺',
    defaultActivities: ['serve-food', 'sell-alcohol', 'sell-products'],
    description: 'Alcohol service and production'
  },
  firearms: {
    label: 'Gun Shop / Firearms',
    icon: '🔫',
    defaultActivities: ['sell-products'],
    description: 'Firearms sales and services'
  },
  agriculture: {
    label: 'Agriculture / Farming',
    icon: '🌾',
    defaultActivities: ['sell-products'],
    description: 'Farms, nurseries, agritourism'
  }
};

export const locationTypeConfig = {
  commercial: {
    label: 'Commercial Location',
    icon: '🏢',
    description: 'Storefront, office, warehouse'
  },
  'home-based': {
    label: 'Home-Based',
    icon: '🏠',
    description: 'Residential address'
  },
  mobile: {
    label: 'Mobile / Food Truck',
    icon: '🚐',
    description: 'Vehicle-based operation'
  },
  online: {
    label: 'Online Only',
    icon: '🌐',
    description: 'No physical location'
  }
};

export const activityConfig = {
  'sell-products': {
    label: 'Sell products / merchandise',
    icon: '🛍️'
  },
  'serve-food': {
    label: 'Serve food or beverages',
    icon: '🍔'
  },
  'sell-alcohol': {
    label: 'Sell alcohol',
    icon: '🍷'
  },
  'construction': {
    label: 'Perform construction work',
    icon: '🔨'
  },
  'employees': {
    label: 'Have employees',
    icon: '👥'
  },
  'commercial-vehicles': {
    label: 'Use commercial vehicles',
    icon: '🚛'
  },
  'professional-services': {
    label: 'Provide professional services',
    icon: '💼'
  }
};

export const entityTypeConfig = {
  llc: {
    label: 'LLC (Limited Liability Company)',
    description: 'Most common for small businesses'
  },
  corporation: {
    label: 'Corporation (S-Corp or C-Corp)',
    description: 'For larger businesses or investors'
  },
  'sole-proprietorship': {
    label: 'Sole Proprietorship',
    description: 'Simplest structure, personal liability'
  },
  partnership: {
    label: 'Partnership',
    description: 'Two or more owners'
  }
};
```

---

## Phase 3: Wizard Hook & State Management (30 min)

### 3.1 Custom Hook
**File:** `src/hooks/useWizard.ts`
```typescript
import { useState, useCallback } from 'react';
import { BusinessProfile, WizardStep } from '../types/wizard';

const initialProfile: BusinessProfile = {
  businessType: null,
  locationType: null,
  activities: [],
  entityType: null
};

export function useWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('welcome');
  const [profile, setProfile] = useState<BusinessProfile>(initialProfile);
  const [history, setHistory] = useState<WizardStep[]>(['welcome']);

  const goToStep = useCallback((step: WizardStep) => {
    setHistory(prev => [...prev, step]);
    setCurrentStep(step);
  }, []);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCurrentStep(newHistory[newHistory.length - 1]);
    }
  }, [history]);

  const updateProfile = useCallback((updates: Partial<BusinessProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleActivity = useCallback((activity: string) => {
    setProfile(prev => ({
      ...prev,
      activities: prev.activities.includes(activity as any)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity as any]
    }));
  }, []);

  const reset = useCallback(() => {
    setCurrentStep('welcome');
    setProfile(initialProfile);
    setHistory(['welcome']);
  }, []);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 'business-type':
        return profile.businessType !== null;
      case 'location':
        return profile.locationType !== null;
      case 'activities':
        return profile.activities.length > 0;
      case 'entity':
        return profile.entityType !== null;
      default:
        return true;
    }
  }, [currentStep, profile]);

  return {
    currentStep,
    profile,
    history,
    goToStep,
    goBack,
    updateProfile,
    toggleActivity,
    reset,
    canProceed
  };
}
```

---

## Phase 4: UI Components (2.5 hours)

### 4.1 Step Indicator
**File:** `src/components/ui/StepIndicator.tsx`
```typescript
import { WizardStep } from '../../types/wizard';

const steps: WizardStep[] = ['welcome', 'business-type', 'location', 'activities', 'entity', 'results'];

interface StepIndicatorProps {
  currentStep: WizardStep;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = steps.indexOf(currentStep);
  
  return (
    <div className="step-indicator">
      {steps.map((step, index) => {
        let status: 'completed' | 'active' | 'pending' = 'pending';
        if (index < currentIndex) status = 'completed';
        else if (index === currentIndex) status = 'active';
        
        return (
          <div
            key={step}
            className={`step-dot ${status}`}
            aria-label={`Step ${index + 1}: ${step}`}
          />
        );
      })}
    </div>
  );
}
```

### 4.2 Option Card
**File:** `src/components/ui/OptionCard.tsx`
```typescript
import { ReactNode } from 'react';

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  description?: string;
  children?: ReactNode;
}

export function OptionCard({ 
  selected, 
  onClick, 
  icon, 
  label, 
  description,
  children 
}: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`option-card w-full text-left ${selected ? 'selected' : ''}`}
      role="radio"
      aria-checked={selected}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{label}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
          {children}
        </div>
        {selected && (
          <div className="text-accent-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}
```

### 4.3 License Card
**File:** `src/components/ui/LicenseCard.tsx`
```typescript
import { LicenseRequirement } from '../../types/wizard';
import { ExternalLink, Phone, Mail, DollarSign, Clock, FileText } from 'lucide-react';

interface LicenseCardProps {
  license: LicenseRequirement;
}

export function LicenseCard({ license }: LicenseCardProps) {
  const jurisdictionColors = {
    federal: 'bg-purple-100 text-purple-800',
    state: 'bg-blue-100 text-blue-800',
    county: 'bg-green-100 text-green-800',
    city: 'bg-orange-100 text-orange-800'
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${jurisdictionColors[license.jurisdiction]}`}>
            {license.jurisdiction.toUpperCase()}
          </span>
          <h3 className="font-semibold text-gray-900 mt-2">{license.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{license.description}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm mt-4">
        <div className="flex items-center gap-2 text-gray-700">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span>
            ${license.cost.min}
            {license.cost.max > license.cost.min && ` - $${license.cost.max}`}
            {license.cost.notes && <span className="text-gray-500 text-xs block">{license.cost.notes}</span>}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{license.timeline}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-700 mt-2">
        <FileText className="w-4 h-4 text-gray-400" />
        <span>Renewal: {license.renewalPeriod}</span>
      </div>
      
      {license.prerequisites && license.prerequisites.length > 0 && (
        <div className="mt-3 p-2 bg-yellow-50 rounded text-sm">
          <span className="font-medium text-yellow-800">Prerequisites:</span>
          <span className="text-yellow-700"> {license.prerequisites.join(', ')}</span>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
        {license.formUrl && (
          <a
            href={license.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800"
          >
            <ExternalLink className="w-4 h-4" />
            Apply Online
          </a>
        )}
        
        {license.contactInfo.phone && (
          <a
            href={`tel:${license.contactInfo.phone}`}
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
          >
            <Phone className="w-4 h-4" />
            {license.contactInfo.phone}
          </a>
        )}
        
        {license.contactInfo.email && (
          <a
            href={`mailto:${license.contactInfo.email}`}
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
          >
            <Mail className="w-4 h-4" />
            Email
          </a>
        )}
      </div>
      
      {license.contactInfo.office && (
        <p className="text-xs text-gray-500 mt-2">{license.contactInfo.office}</p>
      )}
    </div>
  );
}
```

### 4.4 Wizard Steps

**File:** `src/components/Wizard/WelcomeStep.tsx`
```typescript
interface WelcomeStepProps {
  onStart: () => void;
}

export function WelcomeStep({ onStart }: WelcomeStepProps) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-6">📋</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        What licenses does your Ashtabula business need?
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
        Answer 5 quick questions for a personalized checklist of federal, state, county, and city requirements.
      </p>
      
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8 text-left">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-accent-500">✓</span>
          Free personalized results
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-accent-500">✓</span>
          Direct links to forms
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-accent-500">✓</span>
          Cost estimates included
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-accent-500">✓</span>
          Save or email results
        </div>
      </div>
      
      <button onClick={onStart} className="btn-primary text-lg px-8 py-4">
        Start Now
      </button>
      
      <p className="text-xs text-gray-500 mt-6">
        Built for Ashtabula County, Ohio • Information provided as guidance only
      </p>
    </div>
  );
}
```

**File:** `src/components/Wizard/BusinessTypeStep.tsx`
```typescript
import { OptionCard } from '../ui/OptionCard';
import { businessTypeConfig } from '../../data/businessTypes';
import { BusinessType } from '../../types/wizard';

interface BusinessTypeStepProps {
  selected: BusinessType | null;
  onSelect: (type: BusinessType) => void;
}

export function BusinessTypeStep({ selected, onSelect }: BusinessTypeStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        What type of business are you starting?
      </h2>
      <p className="text-gray-600 mb-6">Select the option that best describes your business</p>
      
      <div className="grid gap-3">
        {Object.entries(businessTypeConfig).map(([key, config]) => (
          <OptionCard
            key={key}
            selected={selected === key}
            onClick={() => onSelect(key as BusinessType)}
            icon={config.icon}
            label={config.label}
            description={config.description}
          />
        ))}
      </div>
    </div>
  );
}
```

**File:** `src/components/Wizard/LocationStep.tsx`
```typescript
import { OptionCard } from '../ui/OptionCard';
import { locationTypeConfig } from '../../data/businessTypes';
import { LocationType } from '../../types/wizard';

interface LocationStepProps {
  selected: LocationType | null;
  onSelect: (type: LocationType) => void;
}

export function LocationStep({ selected, onSelect }: LocationStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Where will you operate?
      </h2>
      <p className="text-gray-600 mb-6">Your location affects which permits you need</p>
      
      <div className="grid gap-3">
        {Object.entries(locationTypeConfig).map(([key, config]) => (
          <OptionCard
            key={key}
            selected={selected === key}
            onClick={() => onSelect(key as LocationType)}
            icon={config.icon}
            label={config.label}
            description={config.description}
          />
        ))}
      </div>
    </div>
  );
}
```

**File:** `src/components/Wizard/ActivitiesStep.tsx`
```typescript
import { activityConfig } from '../../data/businessTypes';
import { ActivityType } from '../../types/wizard';

interface ActivitiesStepProps {
  selected: ActivityType[];
  onToggle: (activity: string) => void;
}

export function ActivitiesStep({ selected, onToggle }: ActivitiesStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        What will your business do?
      </h2>
      <p className="text-gray-600 mb-6">Select all activities that apply (at least one)</p>
      
      <div className="grid gap-3">
        {Object.entries(activityConfig).map(([key, config]) => {
          const isSelected = selected.includes(key as ActivityType);
          return (
            <button
              key={key}
              onClick={() => onToggle(key)}
              className={`option-card w-full text-left ${isSelected ? 'selected' : ''}`}
              role="checkbox"
              aria-checked={isSelected}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{config.icon}</span>
                <span className="font-medium">{config.label}</span>
                <div className="ml-auto">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isSelected ? 'bg-accent-500 border-accent-500' : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

**File:** `src/components/Wizard/EntityStep.tsx`
```typescript
import { OptionCard } from '../ui/OptionCard';
import { entityTypeConfig } from '../../data/businessTypes';
import { EntityType } from '../../types/wizard';

interface EntityStepProps {
  selected: EntityType | null;
  onSelect: (type: EntityType) => void;
}

export function EntityStep({ selected, onSelect }: EntityStepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        What type of business entity?
      </h2>
      <p className="text-gray-600 mb-6">This affects your registration requirements</p>
      
      <div className="grid gap-3">
        {Object.entries(entityTypeConfig).map(([key, config]) => (
          <OptionCard
            key={key}
            selected={selected === key}
            onClick={() => onSelect(key as EntityType)}
            icon="🏢"
            label={config.label}
            description={config.description}
          />
        ))}
      </div>
    </div>
  );
}
```

### 4.5 PDF Generator
**File:** `src/utils/pdfGenerator.ts`
```typescript
import jsPDF from 'jspdf';
import { LicenseRequirement, BusinessProfile } from '../types/wizard';
import { businessTypeConfig, locationTypeConfig, entityTypeConfig } from '../data/businessTypes';

export function generateLicensePDF(
  requirements: LicenseRequirement[],
  profile: BusinessProfile
): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(30, 64, 175);
  doc.text('Ashtabula Business License Checklist', 20, 30);
  
  // Generated info
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45);
  
  // Profile summary
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Your Business Profile:', 20, 60);
  
  const businessTypeLabel = profile.businessType 
    ? businessTypeConfig[profile.businessType]?.label 
    : 'Not specified';
  const locationLabel = profile.locationType 
    ? locationTypeConfig[profile.locationType]?.label 
    : 'Not specified';
  const entityLabel = profile.entityType 
    ? entityTypeConfig[profile.entityType]?.label 
    : 'Not specified';
  
  doc.setFontSize(10);
  doc.text(`• Business Type: ${businessTypeLabel}`, 25, 70);
  doc.text(`• Location: ${locationLabel}`, 25, 78);
  doc.text(`• Entity: ${entityLabel}`, 25, 86);
  
  // Requirements by jurisdiction
  let yPos = 105;
  const jurisdictions = ['federal', 'state', 'county', 'city'] as const;
  
  jurisdictions.forEach(jurisdiction => {
    const jurisdictionReqs = requirements.filter(r => r.jurisdiction === jurisdiction);
    
    if (jurisdictionReqs.length > 0) {
      // Check page break
      if (yPos > 250) {
        doc.addPage();
        yPos = 30;
      }
      
      doc.setFontSize(14);
      doc.setTextColor(30, 64, 175);
      doc.text(jurisdiction.toUpperCase() + ' REQUIREMENTS', 20, yPos);
      yPos += 12;
      
      jurisdictionReqs.forEach(req => {
        // Check page break
        if (yPos > 260) {
          doc.addPage();
          yPos = 30;
        }
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(req.name, 25, yPos);
        yPos += 6;
        
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.text(req.description, 25, yPos);
        yPos += 5;
        
        doc.text(`Cost: $${req.cost.min}${req.cost.max > req.cost.min ? ` - $${req.cost.max}` : ''}`, 25, yPos);
        yPos += 5;
        
        doc.text(`Timeline: ${req.timeline}`, 25, yPos);
        yPos += 5;
        
        if (req.formUrl) {
          doc.setTextColor(37, 99, 235);
          doc.text(`Apply: ${req.formUrl}`, 25, yPos);
          doc.setTextColor(80, 80, 80);
        }
        yPos += 10;
      });
    }
  });
  
  // Disclaimer
  if (yPos > 250) {
    doc.addPage();
    yPos = 30;
  }
  
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('DISCLAIMER: This checklist is for informational purposes only.', 20, yPos);
  doc.text('Requirements change frequently. Always verify with the issuing authority.', 20, yPos + 5);
  doc.text('Built by Noirsys for the Ashtabula community.', 20, yPos + 10);
  
  return doc;
}
```

---

## Phase 5: Main App Integration (45 min)

**File:** `src/App.tsx`
```typescript
import { useWizard } from './hooks/useWizard';
import { StepIndicator } from './components/ui/StepIndicator';
import { WelcomeStep } from './components/Wizard/WelcomeStep';
import { BusinessTypeStep } from './components/Wizard/BusinessTypeStep';
import { LocationStep } from './components/Wizard/LocationStep';
import { ActivitiesStep } from './components/Wizard/ActivitiesStep';
import { EntityStep } from './components/Wizard/EntityStep';
import { ResultsStep } from './components/Wizard/ResultsStep';
import { ArrowLeft } from 'lucide-react';

function App() {
  const {
    currentStep,
    profile,
    goToStep,
    goBack,
    updateProfile,
    toggleActivity,
    reset,
    canProceed
  } = useWizard();

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeStep onStart={() => goToStep('business-type')} />;
      
      case 'business-type':
        return (
          <BusinessTypeStep
            selected={profile.businessType}
            onSelect={(type) => {
              updateProfile({ businessType: type });
              goToStep('location');
            }}
          />
        );
      
      case 'location':
        return (
          <LocationStep
            selected={profile.locationType}
            onSelect={(type) => {
              updateProfile({ locationType: type });
              goToStep('activities');
            }}
          />
        );
      
      case 'activities':
        return (
          <ActivitiesStep
            selected={profile.activities}
            onToggle={toggleActivity}
          />
        );
      
      case 'entity':
        return (
          <EntityStep
            selected={profile.entityType}
            onSelect={(type) => {
              updateProfile({ entityType: type });
              goToStep('results');
            }}
          />
        );
      
      case 'results':
        return <ResultsStep profile={profile} onReset={reset} />;
      
      default:
        return null;
    }
  };

  const showBackButton = currentStep !== 'welcome' && currentStep !== 'results';
  const showStepIndicator = currentStep !== 'welcome' && currentStep !== 'results';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary-800">
              🏛️ Ashtabula License Wizard
            </h1>
            <span className="text-xs text-gray-500">Free Civic Tool</span>
          </div>
        </div>
      </header>

      <main className="wizard-container">
        {showStepIndicator && <StepIndicator currentStep={currentStep} />}
        
        {showBackButton && (
          <button
            onClick={goBack}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
        
        {renderStep()}
        
        {currentStep === 'activities' && (
          <div className="mt-6">
            <button
              onClick={() => goToStep('entity')}
              disabled={!canProceed()}
              className="btn-primary w-full"
            >
              Continue
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 mt-12">
        <div className="max-w-2xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>Built for Ashtabula County, Ohio by Noirsys</p>
          <p className="mt-1 text-xs">
            Information provided as guidance only. Always verify with official sources.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
```

**File:** `src/components/Wizard/ResultsStep.tsx`
```typescript
import { useMemo, useState } from 'react';
import { BusinessProfile } from '../../types/wizard';
import { getRequirementsForProfile } from '../../data/licenseDatabase';
import { LicenseCard } from '../ui/LicenseCard';
import { generateLicensePDF } from '../../utils/pdfGenerator';
import { Download, Mail, RotateCcw, CheckCircle } from 'lucide-react';

interface ResultsStepProps {
  profile: BusinessProfile;
  onReset: () => void;
}

export function ResultsStep({ profile, onReset }: ResultsStepProps) {
  const [emailSent, setEmailSent] = useState(false);
  
  const requirements = useMemo(() => 
    getRequirementsForProfile(profile),
    [profile]
  );
  
  const groupedRequirements = useMemo(() => {
    const groups: Record<string, typeof requirements> = {
      federal: [],
      state: [],
      county: [],
      city: []
    };
    requirements.forEach(req => {
      groups[req.jurisdiction].push(req);
    });
    return groups;
  }, [requirements]);
  
  const totalCost = useMemo(() => {
    return requirements.reduce((sum, req) => sum + req.cost.min, 0);
  }, [requirements]);
  
  const handleDownloadPDF = () => {
    const doc = generateLicensePDF(requirements, profile);
    doc.save('ashtabula-license-checklist.pdf');
  };
  
  const handleEmailResults = () => {
    const subject = encodeURIComponent('My Ashtabula Business License Checklist');
    const body = encodeURIComponent(
      `Here is my personalized business license checklist from the Ashtabula License Wizard.\n\n` +
      `Total Requirements Found: ${requirements.length}\n` +
      `Estimated Minimum Cost: $${totalCost}\n\n` +
      `View full details: https://license-wizard.ashtabula.io`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setEmailSent(true);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900">Your License Checklist</h2>
        <p className="text-gray-600 mt-2">
          Found <strong>{requirements.length}</strong> requirements for your business
        </p>
        {totalCost > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            Estimated minimum cost: <strong>${totalCost}</strong>
          </p>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={handleDownloadPDF}
          className="btn-primary flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        
        <button
          onClick={handleEmailResults}
          className="btn-secondary flex items-center gap-2"
        >
          <Mail className="w-4 h-4" />
          {emailSent ? 'Email Opened' : 'Email Results'}
        </button>
        
        <button
          onClick={onReset}
          className="btn-secondary flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Start Over
        </button>
      </div>
      
      {/* Requirements by Jurisdiction */}
      {requirements.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <CheckCircle className="w-12 h-12 text-accent-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No specific requirements found</h3>
          <p className="text-gray-600 mt-2">
            Based on your selections, you may have minimal licensing requirements. 
            Consider consulting with the Ashtabula County Building Department to confirm.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedRequirements).map(([jurisdiction, reqs]) => {
            if (reqs.length === 0) return null;
            
            const jurisdictionLabels: Record<string, string> = {
              federal: '🇺🇸 Federal Requirements',
              state: '🏛️ Ohio State Requirements',
              county: '🏘️ Ashtabula County Requirements',
              city: '🏙️ City of Ashtabula Requirements'
            };
            
            return (
              <section key={jurisdiction}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {jurisdictionLabels[jurisdiction]}
                </h3>
                <div className="space-y-4">
                  {reqs.map(req => (
                    <LicenseCard key={req.id} license={req} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
      
      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Important:</strong> This checklist is for informational purposes only. 
          Licensing requirements change frequently and vary by specific circumstances. 
          Always verify current requirements with the appropriate issuing authority before applying.
        </p>
      </div>
    </div>
  );
}
```

---

## Phase 6: Build & Deploy (30 min)

### 6.1 Build Configuration
**File:** `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  base: './',
})
```

### 6.2 Build Commands
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 6.3 Deployment Options

**Option A: Cloudflare Pages (Recommended)**
```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy dist --project-name=ashtabula-license-wizard
```

**Option B: Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --dir=dist --prod
```

**Option C: Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

---

## Testing Checklist

### Functionality
- [ ] Welcome step displays correctly
- [ ] Business type selection works
- [ ] Location selection works
- [ ] Multi-select activities work
- [ ] Entity type selection works
- [ ] Results page shows correct licenses
- [ ] PDF download generates correctly
- [ ] Email button opens mail client
- [ ] Back navigation works
- [ ] Reset/start over works

### Responsive Design
- [ ] Mobile (320px) layout works
- [ ] Tablet (768px) layout works
- [ ] Desktop (1024px+) layout works
- [ ] Touch targets are 44px minimum

### Accessibility
- [ ] All interactive elements have focus states
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader labels present
- [ ] Keyboard navigation works

### Performance
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Bundle size < 500KB

---

## Post-Launch Tasks

- [ ] Add analytics (Plausible/Cloudflare)
- [ ] Set up uptime monitoring
- [ ] Create feedback form/link
- [ ] Announce to Ashtabula community
- [ ] Contact City PCD for endorsement
- [ ] Submit to local business directories

---

## Summary

| Phase | Time | Status |
|-------|------|--------|
| 1. Initialization | 30 min | ⬜ |
| 2. Types & Data | 45 min | ⬜ |
| 3. State Management | 30 min | ⬜ |
| 4. UI Components | 2.5 hrs | ⬜ |
| 5. App Integration | 45 min | ⬜ |
| 6. Build & Deploy | 30 min | ⬜ |
| **Total** | **~6-7 hours** | |

**Next Step:** Begin Phase 1 initialization when ready to build.
