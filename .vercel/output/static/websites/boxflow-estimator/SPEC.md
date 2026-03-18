# Phase 3: Technical Specification — BoxFlow Estimator

**Project:** BoxFlow Estimator  
**New Ashtabula Initiative**  
**Date:** February 19, 2026**  
**Status:** ✅ Specification Complete

---

## 1. Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  React App   │  │  WASM/TS     │  │  Local Storage       │  │
│  │  (Vite)      │  │  Bin Packing │  │  (Cached data)       │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FIREBASE PLATFORM                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Authentication│  │  Firestore   │  │  Cloud Functions     │  │
│  │  (Firebase Auth)│ │  (Database)  │  │  (Server-side logic) │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │  Hosting     │  │  Analytics   │                             │
│  │  (CDN/SSL)   │  │  (Usage)     │                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

### Component Breakdown

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend Framework** | React 18+ | UI components, state management |
| **Build Tool** | Vite 5+ | Fast dev server, optimized builds |
| **Styling** | Tailwind CSS 3+ | Utility-first styling |
| **Language** | TypeScript 5+ | Type safety, better DX |
| **State Management** | Zustand | Simple global state |
| **Auth** | Firebase Auth | Google/email authentication |
| **Database** | Firestore | User data, box catalogs, history |
| **Hosting** | Firebase Hosting | Global CDN, SSL, custom domain |
| **Functions** | Firebase Functions | API endpoints, complex calculations |
| **Analytics** | Firebase Analytics | Usage tracking |

### Data Flow

```
User Input → Validation → Bin Packing Algorithm → Results Display
                 │                                    │
                 ▼                                    ▼
           Save to Firestore                    Log Analytics
```

---

## 2. Features & User Stories

### Core Features (MVP)

#### F1: Product Input
**User Story:** As a warehouse worker, I want to enter product dimensions so the system knows what I'm packing.

**Requirements:**
- Input: Length, Width, Height (inches)
- Input: Weight (pounds)
- Input: Quantity
- Validation: Positive numbers, reasonable ranges
- Support for multiple products in one order

**Acceptance Criteria:**
- [ ] Can add 1-20 products per calculation
- [ ] Visual feedback on invalid inputs
- [ ] Auto-save draft to localStorage

---

#### F2: Box Catalog Management
**User Story:** As an operations manager, I want to define my available box sizes so recommendations use what I actually have.

**Requirements:**
- CRUD operations on box sizes
- Fields: Name, Length, Width, Height, Cost
- Default catalog for common sizes
- Import from CSV

**Acceptance Criteria:**
- [ ] Can add/edit/delete box sizes
- [ ] Can set a box as "favorite" (prioritized)
- [ ] Import/export functionality

---

#### F3: Bin Packing Algorithm
**User Story:** As a shipper, I want to know the optimal box for my products so I minimize shipping costs.

**Requirements:**
- 3D bin packing with rotation support
- Handle multiple items per box
- Consider fragility/this-side-up constraints
- Calculate packing efficiency percentage
- Suggest void fill amount

**Algorithm Spec:**
```typescript
interface PackingRequest {
  products: Product[];
  availableBoxes: Box[];
  constraints?: Constraint[];
}

interface PackingResult {
  recommendedBox: Box;
  alternativeBoxes: Box[];
  efficiency: number; // 0-100%
  voidFillVolume: number; // cubic inches
  orientation: Rotation[];
}
```

**Acceptance Criteria:**
- [ ] Calculates within 500ms for up to 10 items
- [ ] Accuracy: 95%+ vs. manual calculation
- [ ] Provides 2-3 alternative recommendations

---

#### F4: Cost Calculator
**User Story:** As a business owner, I want to see estimated shipping costs so I can compare options.

**Requirements:**
- Input: Origin ZIP, Destination ZIP
- Calculate dimensional weight
- Compare against actual weight
- Show carrier options (USPS, UPS, FedEx rates)
- Estimate materials cost

**Acceptance Criteria:**
- [ ] DIM weight calculation using carrier divisors
- [ ] Zone-based rate estimation
- [ ] Cost breakdown (base rate + fuel + residential)

---

#### F5: Packing Instructions
**User Story:** As a new employee, I want visual packing guidance so I pack correctly without supervision.

**Requirements:**
- Step-by-step packing guide
- Visual diagram of item placement
- Void fill recommendations
- Fragile handling notes

**Acceptance Criteria:**
- [ ] Printable packing sheet
- [ ] Visual representation of box layout
- [ ] Mobile-friendly for warehouse use

---

### Secondary Features (Post-MVP)

| Feature | Priority | Description |
|---------|----------|-------------|
| **History/Analytics** | P1 | Track calculations, show savings over time |
| **Multi-box Orders** | P1 | Split large orders across multiple boxes |
| **Barcode Scanning** | P2 | Scan product SKUs to auto-populate dimensions |
| **API Integrations** | P2 | Shopify, WooCommerce, ShipStation |
| **Team Management** | P2 | Multi-user accounts with permissions |
| **Packing Station Mode** | P3 | Kiosk-style interface for warehouse floor |
| **Custom Rules** | P3 | "Always use X box for Y product" |

---

## 3. UI/UX Specifications

### Design System

**Color Palette:**
```css
--primary: #2563eb;      /* Blue - trust, reliability */
--primary-dark: #1d4ed8; /* Darker blue */
--success: #10b981;      /* Green - savings, good */
--warning: #f59e0b;      /* Amber - attention needed */
--danger: #ef4444;       /* Red - errors, fragile */
--neutral-900: #111827;  /* Text */
--neutral-100: #f3f4f6;  /* Backgrounds */
```

**Typography:**
- Font: Inter (system fallback)
- Headings: 600 weight
- Body: 400 weight
- Monospace: JetBrains Mono (for numbers)

**Spacing Scale:**
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

### Page Structure

```
┌────────────────────────────────────────────┐
│  Header (Logo | Navigation | User Menu)    │
├────────────────────────────────────────────┤
│                                            │
│  Main Content Area                         │
│  (Dynamic based on route)                  │
│                                            │
├────────────────────────────────────────────┤
│  Footer (Links | Support | © Info)         │
└────────────────────────────────────────────┘
```

### Key Screens

#### Screen 1: Dashboard
```
┌─────────────────────────────────────────────────────┐
│  Welcome back, [Name]                    [New Calc] │
├─────────────────────────────────────────────────────┤
│  Quick Stats (Last 30 Days)                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ Calcs    │ │ Est Saved│ │ Avg Eff. │            │
│  │   47     │ │  $342    │ │   87%    │            │
│  └──────────┘ └──────────┘ └──────────┘            │
│                                                     │
│  Recent Calculations              [View All]        │
│  ┌─────────────────────────────────────────┐        │
│  │ Wine Case (6 bottles) → 12×9×6 box      │        │
│  │ Custom Order #234 → 14×12×8 box         │        │
│  │ ...                                     │        │
│  └─────────────────────────────────────────┘        │
│                                                     │
│  [+ New Calculation]  [Manage Boxes]  [Settings]    │
└─────────────────────────────────────────────────────┘
```

#### Screen 2: Calculator
```
┌─────────────────────────────────────────────────────┐
│  Box Calculator                           [History] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  STEP 1: Add Products                               │
│  ┌─────────────────────────────────────────────┐    │
│  │ Product 1                                   │    │
│  │ Name: [Wine Bottle         ]                │    │
│  │ L: [3]  W: [3]  H: [12]  Wt: [3]  Qty: [6]  │    │
│  │ [Fragile ☑] [This Side Up ☑]                │    │
│  └─────────────────────────────────────────────┘    │
│  [+ Add Another Product]                            │
│                                                     │
│  STEP 2: Select Destination                         │
│  From: [44004____]  To: [_______]  [Calculate]      │
│                                                     │
│  ─────────────────────────────────────────────      │
│                                                     │
│  RESULTS:                                           │
│  ┌─────────────────────────────────────────────┐    │
│  │ ⭐ RECOMMENDED: 12×9×6 Standard Wine Box    │    │
│  │     Efficiency: 91%  |  Est. Cost: $12.50   │    │
│  │     [View Packing Guide]  [Use This Box]    │    │
│  └─────────────────────────────────────────────┘    │
│  Alternatives: [14×12×8] [10×8×6]                   │
└─────────────────────────────────────────────────────┘
```

#### Screen 3: Box Management
```
┌─────────────────────────────────────────────────────┐
│  My Box Catalog                         [+ Add Box] │
├─────────────────────────────────────────────────────┤
│  Filter: [All ▼]  Search: [__________]              │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ ⭐ | Wine Box 6-Bottle | 12×9×6 | $2.50     │    │
│  │    [Edit] [Duplicate] [Delete]              │    │
│  ├─────────────────────────────────────────────┤    │
│  │    | Standard Mailer | 10×8×6 | $1.25       │    │
│  │    [Edit] [Duplicate] [Delete]              │    │
│  ├─────────────────────────────────────────────┤    │
│  │ ...                                         │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  [Import CSV]  [Export CSV]  [Reset to Defaults]    │
└─────────────────────────────────────────────────────┘
```

### Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Single column, stacked inputs |
| Tablet | 640-1024px | 2-column where appropriate |
| Desktop | > 1024px | Full layout, side-by-side panels |

---

## 4. Database Schema

### Firestore Collections

```
users/{userId}
├── email: string
├── displayName: string
├── businessName: string
├── subscription: 'free' | 'pro' | 'team'
├── createdAt: timestamp
└── settings: {
    defaultUnits: 'imperial' | 'metric',
    defaultOrigin: string (ZIP),
    currency: 'USD'
}

users/{userId}/boxes/{boxId}
├── name: string
├── length: number (inches)
├── width: number
├── height: number
├── cost: number (dollars)
├── isFavorite: boolean
├── category: string
└── createdAt: timestamp

users/{userId}/products/{productId}
├── sku: string
├── name: string
├── length: number
├── width: number
├── height: number
├── weight: number
├── isFragile: boolean
└── thisSideUp: boolean

users/{userId}/calculations/{calcId}
├── products: Product[]
├── recommendedBox: Box
├── alternatives: Box[]
├── efficiency: number
├── estimatedCost: CostBreakdown
├── originZip: string
├── destZip: string
├── createdAt: timestamp
└── usedBox: Box | null (filled when confirmed)

users/{userId}/stats/{monthlyId}
├── month: string (YYYY-MM)
├── calculationCount: number
├── estimatedSavings: number
├── avgEfficiency: number
└── totalPackages: number
```

### Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid == userId;
      
      match /boxes/{boxId} {
        allow read, write: if request.auth != null && 
                            request.auth.uid == userId;
      }
      
      match /calculations/{calcId} {
        allow read, write: if request.auth != null && 
                            request.auth.uid == userId;
      }
    }
  }
}
```

---

## 5. Implementation Phases

### Phase 1: Foundation (Hours 1-2)
- [ ] Initialize Vite + React + TypeScript project
- [ ] Configure Tailwind CSS
- [ ] Set up Firebase project
- [ ] Configure Firebase Auth
- [ ] Create base layout components
- [ ] Set up routing (React Router)

**Deliverable:** Working scaffold with auth

### Phase 2: Core Algorithm (Hours 3-4)
- [ ] Implement 3D bin packing algorithm
- [ ] Create box recommendation logic
- [ ] Add dimensional weight calculator
- [ ] Unit tests for algorithm

**Deliverable:** Algorithm module with tests

### Phase 3: UI Implementation (Hours 5-7)
- [ ] Calculator input form
- [ ] Results display component
- [ ] Box catalog management
- [ ] Packing guide visualization
- [ ] Dashboard with stats

**Deliverable:** Functional UI connected to algorithm

### Phase 4: Firebase Integration (Hours 8-9)
- [ ] Connect auth to UI
- [ ] Implement Firestore data layer
- [ ] Add calculation history
- [ ] Save/retrieve box catalogs
- [ ] Analytics logging

**Deliverable:** Full-stack MVP

### Phase 5: Polish & Deploy (Hours 9-10)
- [ ] Mobile responsiveness
- [ ] Error handling
- [ ] Loading states
- [ ] Deploy to Firebase Hosting
- [ ] Smoke testing

**Deliverable:** Live MVP at custom domain

---

## 6. Cost Estimates

### Development Costs

| Item | Cost | Notes |
|------|------|-------|
| **Developer time** | $0 | DIY (MVP build) |
| **Firebase Spark** | $0 | Free tier: 50K reads/day, 20K writes/day |
| **Domain** | $12/year | boxflow.io or similar |
| **Total Year 1** | **$12** | |

### Scaling Costs (Post-MVP)

| Tier | Users | Estimated Monthly Cost |
|------|-------|------------------------|
| **Blaze (pay-as-you-go)** | < 100 | $5-15/month |
| **Growth** | 100-1,000 | $25-75/month |
| **Scale** | 1,000+ | $100+/month |

### Revenue Required to Cover Costs

At $49/month subscription:
- Break-even: 1 paying customer covers Firebase costs
- Profitable: 2+ customers = positive ROI

---

## 7. API Specifications

### Internal API (TypeScript Functions)

```typescript
// Core packing function
async function calculateOptimalBox(
  products: Product[],
  availableBoxes: Box[],
  constraints?: PackingConstraints
): Promise<PackingResult>;

// Cost estimation
async function estimateShippingCost(
  box: Box,
  originZip: string,
  destZip: string,
  carrier?: Carrier
): Promise<ShippingEstimate>;

// Analytics
async function logCalculation(
  userId: string,
  calculation: Calculation
): Promise<void>;
```

### External API Integrations (Future)

| Service | Endpoint | Purpose |
|---------|----------|---------|
| **USPS** | api.usps.com | Rate calculation |
| **UPS** | onlinetools.ups.com | Rate + tracking |
| **FedEx** | apis.fedex.com | Rate calculation |
| **ShipStation** | ssapi.shipstation.com | Order sync |
| **EasyPost** | api.easypost.com | Unified carrier API |

---

## 8. Testing Strategy

### Unit Tests

```typescript
describe('Bin Packing Algorithm', () => {
  it('should find optimal box for single item', () => {
    const products = [{ l: 6, w: 4, h: 3, weight: 2 }];
    const boxes = [
      { name: 'Small', l: 8, w: 6, h: 4 },
      { name: 'Medium', l: 12, w: 10, h: 8 }
    ];
    const result = calculateBox(products, boxes);
    expect(result.recommendedBox.name).toBe('Small');
  });
  
  it('should handle multiple items', () => { /* ... */ });
  it('should respect fragility constraints', () => { /* ... */ });
  it('should calculate efficiency correctly', () => { /* ... */ });
});
```

### E2E Tests (Playwright)

```typescript
test('user can calculate and save box recommendation', async () => {
  await page.goto('/');
  await page.fill('[name="length"]', '6');
  await page.fill('[name="width"]', '4');
  await page.fill('[name="height"]', '3');
  await page.click('[data-testid="calculate"]');
  await expect(page.locator('[data-testid="result"]')).toBeVisible();
});
```

### Manual Testing Checklist

See BUILD_CHECKLIST.md for full testing protocol.

---

## 9. Security Considerations

| Concern | Mitigation |
|---------|------------|
| **Data privacy** | No PII stored except email; business data isolated per user |
| **Rate limiting** | Firebase built-in limits; implement client-side debouncing |
| **Input validation** | Zod schema validation on all inputs |
| **Auth security** | Firebase Auth handles OAuth, MFA available |
| **Data backup** | Firestore automated backups on paid plan |

---

*Technical specification prepared by: Noirsys AI*  
*For: New Ashtabula Initiative — BoxFlow Estimator Project*
