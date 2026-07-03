# SPEC.md — Instant Dirt Quote
**Project:** Instant Aggregate Material Quoting Platform  
**Date:** 2026-02-20  
**Status:** Phase 3 Complete — Technical Specification Ready for Implementation  
**Previous:** Phase 1 Research, Phase 2 Outreach

---

## 1. Product Definition

### 1.1 Problem Statement
Contractors and homeowners in Ashtabula County wait 2-3 days for aggregate material quotes. Phone-only processes waste time, create bidding delays, and cause lost jobs. Local suppliers field repetitive calls for basic pricing while missing after-hours opportunities.

### 1.2 Solution
Instant Dirt Quote provides real-time aggregate material pricing with transparent delivery costs. Users enter project details, select materials, and receive instant quotes from vetted local suppliers.

### 1.3 Target Users
| Segment | Needs | Volume |
|---------|-------|--------|
| **Excavation Contractors** | Fast quotes for bidding, volume pricing, reliable delivery | Primary B2B |
| **Landscapers** | Multiple material types, scheduled delivery, job costing | Secondary B2B |
| **Homeowners (DIY)** | Simple calculator, transparent pricing, small orders | B2C |
| **Property Managers** | Recurring orders, multiple properties, invoicing | Niche B2B |

### 1.4 Success Metrics
- **Month 1:** 3 suppliers onboarded, 50 quotes generated
- **Month 3:** 5 suppliers, 300 quotes, 50 completed orders
- **Month 6:** 8 suppliers, 1,000 quotes, 200 orders, $40K GMV

---

## 2. Core Features

### 2.1 P0 — MVP (Must Have)
| Feature | Description | User Value |
|---------|-------------|------------|
| **Material Calculator** | Convert project dimensions (sq ft × depth) to tons/cubic yards | Eliminates manual math errors |
| **Multi-Supplier Quotes** | Display prices from 2+ suppliers side-by-side | Price comparison in seconds |
| **Delivery Cost Estimator** | Distance-based delivery fees by zone | No surprise costs |
| **Instant Quote Display** | Real-time pricing without callbacks | 24/7 availability |
| **Basic Booking Request** | Form submission to supplier with project details | Streamlined ordering |
| **Mobile-First UI** | Optimized for job site use on phones | Field accessibility |

### 2.2 P1 — Post-MVP (Should Have)
| Feature | Description | Business Value |
|---------|-------------|----------------|
| **User Accounts** | Save projects, order history, favorites | Retention + repeat usage |
| **Supplier Dashboard** | Manage pricing, view leads, update availability | Supplier stickiness |
| **Payment Integration** | Secure checkout with Stripe | Faster conversion |
| **SMS Notifications** | Quote confirmations, delivery updates | User engagement |
| **Volume Pricing Tiers** | Automatic discounts at thresholds | B2B loyalty |
| **Order Tracking** | Real-time delivery status | Customer satisfaction |

### 2.3 P2 — Future (Nice to Have)
| Feature | Description |
|---------|-------------|
| **AI Project Estimator** | Photo-based material estimation |
| **Multi-Stop Delivery** | Route optimization for contractors |
| **Inventory Integration** | Real-time stock levels from suppliers |
| **Subscription Plans** | Priority pricing for regular customers |
| **White-Label Version** | License to other rural counties |

---

## 3. Technical Architecture

### 3.1 Tech Stack
| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | Next.js 14 (App Router) + TypeScript | SEO, SSR, type safety |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid UI, accessibility |
| **Backend** | Supabase (PostgreSQL + Auth + Edge Functions) | Managed backend, real-time |
| **Maps** | Mapbox GL JS | Delivery zone visualization |
| **Payments** | Stripe (Phase 1: booking only, Phase 2: payments) | Industry standard |
| **SMS** | Twilio (Phase 1 deferred) | Notifications |
| **Hosting** | Vercel | Edge deployment, Next.js native |
| **Analytics** | Plausible or Vercel Analytics | Privacy-compliant |

### 3.2 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │   Web App    │  │  Mobile PWA  │  │  Supplier    │               │
│  │  (Next.js)   │  │  (Responsive)│  │  Dashboard   │               │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘               │
└─────────┼─────────────────┼─────────────────┼───────────────────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────────┐
│                      API LAYER (Supabase Edge)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │ Quote Engine │  │   Booking    │  │  Supplier    │               │
│  │   (Calc)     │  │    API       │  │   API        │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────────┐
│                      DATA LAYER (Supabase)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │  PostgreSQL  │  │    Auth      │  │   Storage    │               │
│  │   (Quotes)   │  │   (JWT)      │  │  (Docs/Img)  │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Database Schema

### 4.1 Core Tables

```sql
-- Suppliers (aggregate companies)
create table suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  logo_url text,
  contact_email text not null,
  contact_phone text,
  address text not null,
  delivery_radius_miles int default 25,
  min_order_tons decimal(4,1) default 1.0,
  business_hours jsonb,
  is_active boolean default true,
  is_verified boolean default false,
  stripe_account_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Materials catalog (standardized across suppliers)
create table materials (
  id uuid primary key default gen_random_uuid(),
  category material_category not null, -- enum: gravel, topsoil, sand, mulch, stone, fill_dirt
  name text not null,
  description text,
  unit material_unit not null, -- enum: ton, cubic_yard
  typical_density_tons_per_cy decimal(3,2), -- for conversion calculations
  default_depth_inches int,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Supplier-specific pricing
create table supplier_materials (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid references suppliers(id) on delete cascade,
  material_id uuid references materials(id) on delete cascade,
  base_price_per_unit decimal(6,2) not null,
  price_valid_from date not null,
  price_valid_until date,
  volume_tier_1_qty decimal(4,1), -- tons/cy threshold
  volume_tier_1_price decimal(6,2),
  volume_tier_2_qty decimal(4,1),
  volume_tier_2_price decimal(6,2),
  is_available boolean default true,
  unique(supplier_id, material_id, price_valid_from)
);

-- Delivery zones and pricing
create table delivery_zones (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid references suppliers(id) on delete cascade,
  name text not null, -- e.g., "Ashtabula City", "County-Wide"
  geometry jsonb, -- GeoJSON polygon for map visualization
  base_delivery_fee decimal(5,2) default 0,
  per_mile_fee decimal(3,2) default 0,
  min_delivery_fee decimal(5,2) default 50.00,
  estimated_delivery_days int default 3,
  is_active boolean default true
);

-- Quote requests (generated instantly)
create table quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  session_id text, -- for anonymous users
  project_name text,
  delivery_address text not null,
  delivery_lat decimal(10,8),
  delivery_lng decimal(11,8),
  material_id uuid references materials(id),
  quantity_requested decimal(6,2) not null,
  unit material_unit not null,
  project_type project_type, -- enum: driveway, patio, landscaping, foundation, drainage, other
  notes text,
  status quote_status default 'generated', -- generated, requested, confirmed, delivered, cancelled
  created_at timestamptz default now(),
  expires_at timestamptz default now() + interval '7 days'
);

-- Quote line items (one per supplier offering)
create table quote_line_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid references quotes(id) on delete cascade,
  supplier_id uuid references suppliers(id),
  supplier_material_id uuid references supplier_materials(id),
  quantity decimal(6,2) not null,
  unit_price decimal(6,2) not null,
  material_subtotal decimal(8,2) not null,
  delivery_fee decimal(6,2) not null,
  tax_amount decimal(6,2) default 0,
  total_price decimal(8,2) not null,
  estimated_delivery_date date,
  is_selected boolean default false -- user selected this option
);

-- Bookings (converted quotes)
create table bookings (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid references quotes(id),
  line_item_id uuid references quote_line_items(id),
  user_id uuid references auth.users(id),
  supplier_id uuid references suppliers(id),
  status booking_status default 'pending', -- pending, confirmed, scheduled, delivered, completed, cancelled
  requested_delivery_date date,
  confirmed_delivery_date date,
  special_instructions text,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  stripe_payment_intent_id text,
  payment_status payment_status default 'pending',
  total_paid decimal(8,2),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enum definitions
create type material_category as enum ('gravel', 'topsoil', 'sand', 'mulch', 'stone', 'fill_dirt', 'crushed_concrete');
create type material_unit as enum ('ton', 'cubic_yard');
create type project_type as enum ('driveway', 'patio', 'landscaping', 'foundation', 'drainage', 'erosion_control', 'other');
create type quote_status as enum ('generated', 'requested', 'confirmed', 'expired', 'cancelled');
create type booking_status as enum ('pending', 'confirmed', 'scheduled', 'in_transit', 'delivered', 'completed', 'cancelled');
create type payment_status as enum ('pending', 'authorized', 'captured', 'refunded', 'failed');
```

### 4.2 Indexes for Performance
```sql
-- Fast quote lookups
CREATE INDEX idx_quotes_user ON quotes(user_id, created_at desc);
CREATE INDEX idx_quotes_session ON quotes(session_id, created_at desc);
CREATE INDEX idx_quotes_status ON quotes(status, expires_at);

-- Supplier availability queries
CREATE INDEX idx_supplier_materials_lookup ON supplier_materials(supplier_id, material_id, is_available, price_valid_from desc);

-- Geographic queries (for delivery zone matching)
CREATE INDEX idx_quotes_location ON quotes using gist (point(delivery_lng, delivery_lat));

-- Booking management
CREATE INDEX idx_bookings_supplier ON bookings(supplier_id, status, requested_delivery_date);
CREATE INDEX idx_bookings_user ON bookings(user_id, created_at desc);
```

---

## 5. API Specifications

### 5.1 Quote Engine Endpoints

**POST /api/quotes/calculate**
```typescript
// Request
{
  deliveryAddress: string;
  deliveryZip: string;
  materialId: string;
  projectType: ProjectType;
  dimensions: {
    areaSqFt: number;
    depthInches: number;
  } | {
    quantity: number;
    unit: 'ton' | 'cubic_yard';
  };
  notes?: string;
}

// Response
{
  quoteId: string;
  expiresAt: string;
  lineItems: Array<{
    supplierId: string;
    supplierName: string;
    supplierLogo?: string;
    materialName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    materialSubtotal: number;
    deliveryFee: number;
    tax: number;
    total: number;
    estimatedDelivery: string;
    distance: number; // miles from supplier
  }>;
}
```

**GET /api/materials**
```typescript
// Response
{
  materials: Array<{
    id: string;
    category: string;
    name: string;
    description: string;
    unit: string;
    typicalDensity?: number;
    imageUrl?: string;
  }>;
  categories: string[];
}
```

**GET /api/materials/:id/calculator-info**
```typescript
// Response
{
  id: string;
  name: string;
  unit: string;
  typicalDensity: number;
  defaultDepth: number;
  coverageSqFtPerUnit: number; // e.g., 1 ton covers ~100 sq ft at 2"
  projectTypes: string[];
}
```

### 5.2 Booking Endpoints

**POST /api/bookings**
```typescript
// Request
{
  quoteId: string;
  lineItemId: string;
  requestedDeliveryDate: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  specialInstructions?: string;
}

// Response
{
  bookingId: string;
  status: 'pending' | 'payment_required';
  paymentIntent?: string; // Stripe client secret if payment required
  supplierContact: {
    name: string;
    phone: string;
    email: string;
  };
}
```

### 5.3 Supplier Dashboard Endpoints (P1)

**GET /api/supplier/leads**
**PATCH /api/supplier/bookings/:id**
**POST /api/supplier/pricing**

---

## 6. UI/UX Specifications

### 6.1 Page Structure
```
/                           → Landing page with calculator CTA
/calculate                  → Main quote calculator (3-step wizard)
  ├── Step 1: Project Type + Location
  ├── Step 2: Material + Dimensions
  └── Step 3: Results (supplier comparison)
/materials                  → Material catalog with educational content
/suppliers                  → Supplier directory with ratings
/booking/:id                → Booking confirmation + tracking
/account                    → Saved projects, order history (P1)
/supplier/dashboard         → Supplier admin panel (P1)
```

### 6.2 Quote Calculator Flow

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: PROJECT BASICS                                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  What are you working on?                              │  │
│  │  [Driveway] [Patio] [Landscaping] [Foundation] [Other] │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Delivery Address                                      │  │
│  │  [_______________________] [Find My Location]          │  │
│  └───────────────────────────────────────────────────────┘  │
│                                    [Continue →]              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: MATERIAL & QUANTITY                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Select Material  [Dropdown: Gravel #57 ▼]            │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Calculate by:  (○) Area & Depth  (○) Known Quantity  │  │
│  │                                                         │  │
│  │  Area: [____] sq ft    Depth: [__] inches              │  │
│  │  ≈ 12.5 tons needed                                    │  │
│  └───────────────────────────────────────────────────────┘  │
│                                    [Continue →]              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: YOUR QUOTES                                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  🏆 Bull Moose Aggregates    $847 total               │  │
│  │     $32/ton × 12.5 tons + $75 delivery               │  │
│  │     Delivery: 3-5 days   [Select This Quote]          │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │  Simak Trucking              $925 total               │  │
│  │     $38/ton × 12.5 tons + $50 delivery               │  │
│  │     Delivery: 2-4 days   [Select This Quote]          │  │
│  └───────────────────────────────────────────────────────┘  │
│  [Save for Later]  [Email These Quotes]  [Start Over]       │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 Design System

**Colors**
```css
--color-primary: #2563eb;      /* Blue 600 - trust/professional */
--color-primary-dark: #1d4ed8; /* Blue 700 - buttons */
--color-accent: #16a34a;       /* Green 600 - success/actions */
--color-accent-light: #22c55e; /* Green 500 - highlights */
--color-warning: #ca8a04;      /* Yellow 600 - caution */
--color-danger: #dc2626;       /* Red 600 - errors */
--color-gray-50: #f9fafb;      /* Backgrounds */
--color-gray-900: #111827;     /* Text */
```

**Typography**
- Headings: Inter, 600-700 weight
- Body: Inter, 400 weight
- Monospace: JetBrains Mono (for pricing/totals)

**Components**
- Cards: rounded-xl, shadow-sm, hover:shadow-md
- Buttons: rounded-lg, font-medium, transition-all
- Inputs: rounded-lg, border-gray-300, focus:ring-2 focus:ring-primary

---

## 7. Material Calculator Logic

### 7.1 Conversion Formulas
```typescript
// Area + Depth → Cubic Yards
const cubicYards = (areaSqFt * depthInches) / 12 / 27;

// Cubic Yards → Tons (material-dependent)
const tons = cubicYards * materialDensity;

// Common Densities (tons per cubic yard)
const DENSITIES = {
  gravel: 1.4,
  limestone_57: 1.35,
  limestone_411: 1.4,
  pea_gravel: 1.2,
  topsoil: 1.1,
  sand: 1.35,
  fill_dirt: 1.2,
  mulch: 0.4,
  stone_riprap: 1.6,
};

// Add 10% compaction/waste buffer for loose materials
const orderQuantity = calculatedQuantity * 1.1;
```

### 7.2 Delivery Fee Calculation
```typescript
function calculateDeliveryFee(
  supplierLocation: LatLng,
  deliveryAddress: string,
  zones: DeliveryZone[],
  quantityTons: number
): number {
  // Geocode delivery address
  const deliveryPoint = geocode(deliveryAddress);
  
  // Check zone membership
  for (const zone of zones) {
    if (pointInPolygon(deliveryPoint, zone.geometry)) {
      return Math.max(
        zone.baseDeliveryFee,
        zone.minDeliveryFee
      );
    }
  }
  
  // Fallback: distance-based calculation
  const distance = haversine(supplierLocation, deliveryPoint);
  const mileageFee = distance * zone.perMileFee;
  return Math.max(mileageFee, zone.minDeliveryFee);
}
```

---

## 8. Implementation Phases

### 8.1 Phase 1: MVP (Weeks 1-2)
**Goal:** Working calculator with static supplier data

**Week 1: Foundation**
- [ ] Initialize Next.js project with shadcn/ui
- [ ] Set up Supabase project with schema
- [ ] Create material database with 10 common materials
- [ ] Build 3-step calculator UI
- [ ] Implement unit conversion logic

**Week 2: Quotes + Suppliers**
- [ ] Seed 2-3 suppliers with pricing data
- [ ] Build quote generation API
- [ ] Create quote comparison UI
- [ ] Implement basic booking form
- [ ] Deploy to Vercel

**Deliverable:** Functional MVP at instant-dirt-quote.vercel.app

### 8.2 Phase 2: Supplier Onboarding (Weeks 3-4)
**Goal:** Live suppliers with dynamic pricing

- [ ] Build supplier dashboard (view leads, update pricing)
- [ ] Email notification system (Resend)
- [ ] Supplier verification workflow
- [ ] Map visualization with delivery zones
- [ ] Quote expiration handling

**Deliverable:** Supplier portal + 3 live suppliers

### 8.3 Phase 3: Payments + Polish (Weeks 5-6)
**Goal:** End-to-end booking with payments

- [ ] Stripe Connect integration for suppliers
- [ ] Payment capture at booking
- [ ] User accounts (Supabase Auth)
- [ ] SMS notifications (Twilio)
- [ ] Order tracking dashboard

**Deliverable:** Production-ready platform

### 8.4 Phase 4: Scale (Weeks 7-8)
**Goal:** Growth features

- [ ] Volume pricing tiers
- [ ] Review/rating system
- [ ] Recurring order subscriptions
- [ ] Analytics dashboard
- [ ] SEO content (material guides)

---

## 9. Security & Compliance

### 9.1 Data Protection
- All PII encrypted at rest (AES-256)
- TLS 1.3 for all connections
- Supabase RLS policies enforce row-level access
- No credit card data stored (Stripe handles all payment data)

### 9.2 Access Control
```sql
-- Users can only see their own quotes
CREATE POLICY "Users view own quotes" ON quotes
  FOR SELECT USING (auth.uid() = user_id);

-- Suppliers can only see bookings for their company
CREATE POLICY "Suppliers view own bookings" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM supplier_users 
      WHERE user_id = auth.uid() 
      AND supplier_id = bookings.supplier_id
    )
  );
```

### 9.3 Disclaimers
- Display "Estimates only — final pricing confirmed by supplier"
- Liability waiver for DIY project advice
- Clear delivery timeline estimates (not guarantees)

---

## 10. Open Questions / Decisions Needed

| Question | Impact | Recommendation |
|----------|--------|----------------|
| **1. Initial supplier commitment?** | MVP scope | Confirm 2-3 suppliers from Phase 2 outreach before building |
| **2. Payment timing?** | Cash flow | Pay on delivery vs. pay at booking — default to pay at booking |
| **3. Delivery coordination?** | UX complexity | Supplier handles logistics vs. platform-managed — start with supplier |
| **4. Geographic expansion?** | Architecture | Build for Ashtabula only initially, design zones for future expansion |
| **5. Contractor verification?** | B2B trust | Optional contractor profiles with license verification — Phase 2 |

---

## 11. Success Metrics & Analytics

### 11.1 North Star Metric
**Weekly Quote Volume** — target 50 quotes/week by month 3

### 11.2 Funnel Tracking
```
Landing Page → Calculator Start → Quote Generated → Booking Requested → Confirmed Order
     100%            60%              40%                15%                10%
```

### 11.3 Events to Track
- `calculator_started`
- `quote_generated` (with material type, value)
- `supplier_selected`
- `booking_initiated`
- `booking_confirmed` (with revenue)
- `supplier_pricing_updated`

---

## 12. Rollback Plan

**If supplier acquisition fails:**
1. Pivot to lead-generation model (referrals only, no booking)
2. Reduce scope to calculator + contact forms
3. Pause development, focus on Phase 2 outreach

**If adoption is low:**
1. Add free tier with delayed supplier response (24hr vs. instant)
2. Partner with single anchor supplier for exclusive launch
3. Consider B2B-only focus (contractors) before homeowner marketing

---

**Document Status:** Phase 3 Complete  
**Total Specification:** ~8.5KB technical documentation  
**Next Step:** Phase 4 Build Checklist OR execute Phase 2 supplier outreach  
**Estimated Build Time:** 6-8 weeks (2 developers part-time)  
**MVP Cost Estimate:** $50-100/month (Supabase Pro + Vercel + Twilio)
