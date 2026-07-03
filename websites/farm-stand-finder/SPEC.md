# SPEC.md — Farm Stand Finder
**Project:** Farm Stand Finder (New Ashtabula Initiative)  
**Version:** 1.0  
**Date:** February 19, 2026  
**Status:** 🟢 SPEC COMPLETE

---

## 1. Executive Summary

Farm Stand Finder is a web-based discovery platform connecting consumers with local farms, farmers markets, and U-pick operations in Ashtabula County, Ohio. The platform emphasizes **real-time availability**, **tourist-friendly discovery**, and **farmer-simplicity**.

### Core Value Proposition
- **For Shoppers:** Never drive to a closed farm stand again
- **For Farmers:** Free marketing to tourists and locals with minimal effort
- **For Community:** Strengthen local food economy and tourism

---

## 2. Technical Architecture

### 2.1 Stack Overview

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | React 18 + Vite | Fast dev, excellent PWA support |
| **UI Framework** | Tailwind CSS + Headless UI | Rapid styling, accessible components |
| **State Management** | React Query + Zustand | Server state + client state separation |
| **Backend** | Firebase (Cloud Functions) | Serverless, real-time, low maintenance |
| **Database** | Firestore | Real-time sync, offline support |
| **Auth** | Firebase Auth | Simple, secure, social login ready |
| **Maps** | Mapbox GL JS | Better styling than Google, affordable |
| **Storage** | Firebase Storage | Images, documents |
| **Hosting** | Firebase Hosting | CDN, SSL, atomic deploys |
| **PWA** | Vite PWA Plugin | Offline functionality for rural areas |

### 2.2 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (React PWA)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Map View    │  │ List View   │  │ Farm Detail Page    │ │
│  │ (Mapbox)    │  │ (Filters)   │  │ (Hours, Products)   │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Admin Panel │  │ Farmer Dash │  │ Offline Mode        │ │
│  │ (Auth req)  │  │ (Updates)   │  │ (Service Worker)    │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   FIREBASE BACKEND                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Firestore   │  │ Cloud Func  │  │ Firebase Auth       │ │
│  │ (Real-time) │  │ (API Logic) │  │ (Users/Roles)       │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
│  ┌─────────────┐  ┌─────────────┐                          │
│  │ Storage     │  │ Analytics   │                          │
│  │ (Images)    │  │ (Usage)     │                          │
│  └─────────────┘  └─────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Data Model

```typescript
// Farm Stand Entity
interface FarmStand {
  id: string;
  name: string;
  slug: string;
  type: 'farm-stand' | 'farmers-market' | 'u-pick' | 'csa' | 'market-vendor';
  status: 'open' | 'closed' | 'seasonal-closed' | 'temporarily-closed';
  
  // Location
  address: {
    street: string;
    city: string;
    state: string; // 'OH'
    zip: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  
  // Contact
  phone?: string;
  email?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  
  // Hours
  hours: {
    monday?: { open: string; close: string; closed?: boolean };
    tuesday?: { open: string; close: string; closed?: boolean };
    wednesday?: { open: string; close: string; closed?: boolean };
    thursday?: { open: string; close: string; closed?: boolean };
    friday?: { open: string; close: string; closed?: boolean };
    saturday?: { open: string; close: string; closed?: boolean };
    sunday?: { open: string; close: string; closed?: boolean };
  };
  seasonalSchedule?: {
    startMonth: number; // 1-12
    endMonth: number;
    notes?: string;
  };
  
  // Content
  description: string;
  shortDescription: string; // 140 chars for cards
  products: Product[];
  photos: {
    main: string; // URL
    gallery: string[];
  };
  
  // Features
  paymentMethods: ('cash' | 'credit' | 'check' | 'snap' | 'wic' | 'senior-coupons')[];
  amenities: ('restrooms' | 'pet-friendly' | 'wheelchair-accessible' | 'parking' | 'playground')[];
  
  // Real-time
  currentStatus: {
    isOpenNow: boolean;
    nextOpening?: Date;
    lastUpdated: Date;
    updatedBy: string; // userId
  };
  
  // Metadata
  ownerId?: string; // Firebase user ID
  createdAt: Date;
  updatedAt: Date;
  isFeatured: boolean;
  isVerified: boolean;
  tags: string[];
}

// Product Entity
interface Product {
  id: string;
  name: string;
  category: 'produce' | 'dairy' | 'meat' | 'eggs' | 'honey' | 'baked-goods' | 'flowers' | 'plants' | 'crafts' | 'other';
  subcategory?: string;
  isSeasonal: boolean;
  monthsAvailable?: number[]; // 1-12
  isOrganic?: boolean;
  isUpick?: boolean;
  priceRange?: '$' | '$$' | '$$$';
  inStock: boolean;
  stockNote?: string; // "Picked out for today, more tomorrow"
}

// User Entity
interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'farmer' | 'visitor';
  farmIds?: string[]; // Farms this user can manage
  createdAt: Date;
  lastLogin: Date;
}
```

### 2.4 Database Schema (Firestore)

```
/farms/{farmId}
  ├── basic info (name, address, contact)
  ├── hours (structured)
  ├── products (subcollection)
  ├── photos (references)
  └── currentStatus (real-time)

/users/{userId}
  ├── profile info
  ├── role
  └── managedFarms[]

/analytics/{date}
  └── daily metrics

/public-config
  ├── seasons
  ├── featured-farms
  └── system-status
```

---

## 3. User Stories & Acceptance Criteria

### 3.1 Visitor Stories

#### US-V1: Discover Nearby Farms
**As a** visitor to Ashtabula County  
**I want to** see farms near my current location  
**So that** I can find fresh produce without knowing farm names

**Acceptance Criteria:**
- [ ] Map shows my current location (with permission)
- [ ] Farms display as pins on map within 25-mile radius
- [ ] Pins indicate open (green) / closed (red) / seasonal (gray)
- [ ] Clicking pin shows farm card with name, hours, photo
- [ ] Works offline with cached data

#### US-V2: Filter by Product
**As a** shopper  
**I want to** filter farms by what they're selling  
**So that** I can find strawberries without calling around

**Acceptance Criteria:**
- [ ] Filter panel shows product categories
- [ ] Selecting "Strawberries" shows only farms with that product
- [ ] "In stock now" filter option available
- [ ] Multiple filters can be combined (AND logic)
- [ ] Filter state persists in URL for sharing

#### US-V3: Check Before Driving
**As a** local resident  
**I want to** see if a farm is open before I drive there  
**So that** I don't waste a trip

**Acceptance Criteria:**
- [ ] Farm detail page shows "Open Now" or "Closed" prominently
- [ ] Next opening time displayed if closed
- [ ] Last updated timestamp visible
- [ ] "Call to confirm" option for uncertain hours

#### US-V4: Plan Tourist Visit
**As a** tourist  
**I want to** see farms along my route  
**So that** I can combine farm visits with other activities

**Acceptance Criteria:**
- [ ] View can switch between map and list
- [ ] List sorted by distance from me
- [ ] Each farm card shows distance and drive time
- [ ] "Directions" button opens native maps app

#### US-V5: Save Favorites
**As a** regular customer  
**I want to** save my favorite farms  
**So that** I can quickly check their status

**Acceptance Criteria:**
- [ ] Heart/star button on farm cards
- [ ] Favorites stored in localStorage (no login required)
- [ ] "My Farms" filter shows only favorites
- [ ] Favorites exportable (share list)

### 3.2 Farmer Stories

#### US-F1: Claim Listing
**As a** farm owner  
**I want to** claim my farm's listing  
**So that** I can update my information

**Acceptance Criteria:**
- [ ] "Claim this listing" button on unclaimed farms
- [ ] Verification via phone call or document upload
- [ ] Admin approval workflow
- [ ] Owner gets edit access after approval

#### US-F2: Update Hours
**As a** farmer  
**I want to** quickly update my hours  
**So that** customers know when I'm open

**Acceptance Criteria:**
- [ ] Simple form with day-by-day hours
- [ ] "Closed today" one-click option
- [ ] "Seasonal hours" template (apply to all days)
- [ ] Changes reflect immediately on site

#### US-F3: Update Availability
**As a** U-pick operator  
**I want to** mark when a crop is picked out  
**So that** I don't disappoint visitors

**Acceptance Criteria:**
- [ ] Toggle product "in stock / out of stock"
- [ ] Optional note field ("More ready Saturday")
- [ ] Bulk update ("All berries picked out")
- [ ] SMS update option (text status to platform)

#### US-F4: Add Photos
**As a** farmer  
**I want to** add photos of my farm and products  
**So that** visitors know what to expect

**Acceptance Criteria:**
- [ ] Drag-and-drop photo upload
- [ ] Automatic resizing/compression
- [ ] Set main photo for farm card
- [ ] Gallery view on detail page

### 3.3 Admin Stories

#### US-A1: Approve Farms
**As an** admin  
**I want to** review and approve new farm listings  
**So that** data quality remains high

**Acceptance Criteria:**
- [ ] Pending approval queue
- [ ] Bulk approve/reject
- [ ] Edit before approving
- [ ] Auto-notify farmer of approval

#### US-A2: Feature Farms
**As an** admin  
**I want to** feature specific farms  
**So that** I can promote partners or seasonal highlights

**Acceptance Criteria:**
- [ ] Toggle "featured" status
- [ ] Featured farms appear at top of list
- [ ] Featured farms get special badge
- [ ] Max 3 featured at once (to maintain value)

---

## 4. Implementation Phases

### Phase 1: MVP (Weeks 1-4) — Core Discovery
**Goal:** Basic farm discovery for visitors

**Features:**
- [ ] Static farm data (seed from research)
- [ ] Map view with all farms
- [ ] List view with filtering
- [ ] Farm detail pages
- [ ] Basic "Open/Closed" status (calculated from hours)
- [ ] Mobile-responsive design
- [ ] PWA offline support

**Technical Tasks:**
- [ ] Firebase project setup
- [ ] Mapbox integration
- [ ] Firestore schema + seed data
- [ ] React app scaffolding
- [ ] Deploy to staging

**Success Criteria:**
- 15 farms in database
- Map loads in <3 seconds
- Works offline

### Phase 2: Farmer Portal (Weeks 5-8) — Self-Service
**Goal:** Farmers can manage their own listings

**Features:**
- [ ] Farmer authentication
- [ ] Claim listing workflow
- [ ] Edit hours interface
- [ ] Photo upload
- [ ] Simple availability toggle

**Technical Tasks:**
- [ ] Firebase Auth setup
- [ ] Image upload pipeline
- [ ] Admin approval workflow
- [ ] Email notifications

**Success Criteria:**
- 3+ farmers actively managing listings
- <24hr approval time

### Phase 3: Real-Time & Engagement (Weeks 9-12) — Live Updates
**Goal:** Real-time availability, user engagement

**Features:**
- [ ] Real-time "Open Now" with manual override
- [ ] Product inventory tracking
- [ ] User favorites
- [ ] Share functionality
- [ ] Analytics dashboard (admin)

**Technical Tasks:**
- [ ] Firestore real-time listeners
- [ ] Analytics pipeline
- [ ] Social sharing metadata

**Success Criteria:**
- 500 monthly active users
- 50% of farms have updated within last week

### Phase 4: Monetization & Scale (Weeks 13-16) — Revenue
**Goal:** Sustainable business model

**Features:**
- [ ] Featured listings (paid)
- [ ] Enhanced profiles (photos, story)
- [ ] Analytics for farmers
- [ ] Seasonal push notifications
- [ ] Expand to adjacent counties

**Technical Tasks:**
- [ ] Stripe integration
- [ ] Subscription management
- [ ] Push notification system

**Success Criteria:**
- 3+ paying farms
- $500 MRR (monthly recurring revenue)

---

## 5. UI/UX Specifications

### 5.1 Key Screens

#### Home/Map View
```
┌─────────────────────────────────────────┐
│  🔍 Search...    [Filter ▼]  [List ▤]  │
├─────────────────────────────────────────┤
│                                         │
│    ┌───┐                                │
│    │ 🍓│  West Orchards                 │
│    └───┘                                │
│         ┌───┐                           │
│         │ 🌽│  Szalay's                 │
│         └───┘                           │
│              ┌───┐                      │
│              │ 🍎│  Kiraly's            │
│              └───┘                      │
│                                         │
│  [📍]  [+]  [-]                         │
└─────────────────────────────────────────┘
```

#### Farm Card (List View)
```
┌─────────────────────────────────────────┐
│ ┌─────────┐  West Orchards       🟢    │
│ │  🍓     │  U-Pick Strawberries       │
│ │ (photo) │  3.2 miles away            │
│ └─────────┘  🕐 Open until 6pm         │
│              📍 3034 North Ridge Rd    │
└─────────────────────────────────────────┘
```

#### Farm Detail
```
┌─────────────────────────────────────────┐
│ [Back]                    [♡ Favorite]  │
│ ┌─────────────────────────────────┐     │
│ │         (Hero Photo)            │     │
│ └─────────────────────────────────┘     │
│ West Orchards                    🟢     │
│ Family farm since 1891                  │
│ ⭐⭐⭐⭐⭐ (12 reviews)                    │
│                                         │
│ 🕐 Hours Today: 8am - 4pm               │
│ 📍 3034 North Ridge Rd, Perry Twp       │
│ ☎️ (440) XXX-XXXX                       │
│                                         │
│ [📍 Directions]  [📞 Call]  [🌐 Website] │
│                                         │
│ ── Currently Available ──               │
│ 🍓 Strawberries (U-Pick)     ✅ In Stock│
│ 🍒 Sour Cherries (U-Pick)    ✅ In Stock│
│ 🌽 Sweet Corn                ❌ Out     │
│                                         │
│ ── About ──                             │
│ Fifth generation family farm...         │
└─────────────────────────────────────────┘
```

### 5.2 Design System

**Colors:**
- Primary: `#2D5016` (Farm Green)
- Secondary: `#F5A623` (Harvest Gold)
- Success/Open: `#4CAF50`
- Error/Closed: `#F44336`
- Background: `#FAFAF8` (Warm white)

**Typography:**
- Headings: `Inter` (clean, modern)
- Body: `Inter` or system font stack
- Farm names: Slightly heavier weight for scannability

**Components:**
- Cards: Rounded corners (8px), subtle shadow
- Buttons: Pill-shaped for primary, rectangular for secondary
- Map pins: Custom farm-themed icons (barn, apple, corn)

---

## 6. Performance Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3s | Lighthouse |
| Map Load Time | < 2s | Stopwatch |
| API Response Time | < 200ms | Firebase logs |
| Offline Functionality | Core features | Manual test |
| Mobile Score | 90+ | Lighthouse |

---

## 7. Security & Privacy

### 7.1 Data Protection
- Farmer contact info only visible to logged-in farmers and admins
- Public listings show only business contact (not personal)
- No user tracking without consent
- GDPR-compliant cookie banner

### 7.2 Authentication
- Email/password for farmers
- Optional Google sign-in
- Admin role requires manual assignment

### 7.3 Content Moderation
- Photo uploads reviewed (automated + spot-check)
- Flag mechanism for inaccurate information
- Admin dashboard for moderation

---

## 8. Cost Estimates

### 8.1 Development Costs (One-Time)

| Item | Hours | Rate | Cost |
|------|-------|------|------|
| Phase 1 MVP | 40h | $0* | $0 |
| Phase 2 Portal | 30h | $0* | $0 |
| Phase 3 Real-Time | 25h | $0* | $0 |
| Phase 4 Monetization | 20h | $0* | $0 |
| **Total Development** | **115h** | | **$0** |

*Assuming internal development by Noirsys

### 8.2 Infrastructure Costs (Monthly)

| Service | Usage | Cost |
|---------|-------|------|
| Firebase Spark (Free Tier) | <10K reads/day | $0 |
| Firebase Blaze (Scale) | As needed | ~$20-50/mo |
| Mapbox | <50K loads/mo | $0 (free tier) |
| Domain | farmstandfinder.org | ~$12/year |
| **Total Monthly** | | **$0-50** |

### 8.3 Revenue Projections

| Phase | Timeline | Target MRR |
|-------|----------|------------|
| 1-2 | Months 1-4 | $0 (free only) |
| 3 | Months 5-8 | $0-100 |
| 4 | Months 9-12 | $300-500 |
| Year 2 | | $1,000+ |

---

## 9. Open Questions

1. **Should we integrate with existing platforms?** (LocalHarvest API, etc.)
2. **Do we need multi-language support?** (Spanish for farm workers)
3. **Should we support online ordering?** (Phase 2+ consideration)
4. **Integration with tourism sites?** (VisitAshtabulaCounty.com)
5. **Farmers market vendor sub-listings?** (Individual vendors within markets)

---

## 10. Appendix

### 10.1 Seed Data Format
```json
{
  "farms": [
    {
      "id": "west-orchards",
      "name": "West Orchards",
      "type": "u-pick",
      "address": {
        "street": "3034 North Ridge Road",
        "city": "Perry Township",
        "state": "OH",
        "zip": "44081",
        "coordinates": { "lat": 41.76, "lng": -81.08 }
      },
      "hours": { /* ... */ },
      "products": ["strawberries", "cherries", "peaches", "apples"]
    }
  ]
}
```

### 10.2 Third-Party Integrations
- Mapbox GL JS (maps)
- Firebase SDK (auth, database, storage)
- Google Analytics (visitor tracking)
- Sentry (error tracking) - optional

---

*SPEC Version 1.0 — Ready for development kickoff*
