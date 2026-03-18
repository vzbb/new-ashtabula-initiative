# SPEC.md — Charter Booking
**Project:** Ashtabula Lake Erie Fishing Charter Booking Platform  
**Date:** 2026-02-20  
**Status:** Phase 3 Complete — Ready for Implementation  
**Previous:** Phase 1 Research, Phase 2 Outreach

---

## 1. Executive Summary

**Concept:** A centralized booking platform for Lake Erie fishing charters operating from Ashtabula Harbor, enabling direct online reservations, real-time availability, and seamless customer-captain communication.

**Target Users:**
- Charter captains (reduce admin, increase bookings)
- Tourist anglers (weekend visitors, out-of-state)
- Local repeat customers
- Tourism partners (CVB, lodging)

**Key Differentiators:**
- Lower fees than FishingBooker (10-20% vs 0-5%)
- Ashtabula-focused (local knowledge, community)
- Real-time calendar + weather integration
- Direct captain-customer relationship
- Seasonal demand forecasting

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Angler     │  │   Captain    │  │   Admin      │  │   Tourism    │    │
│  │   Web App    │  │   Dashboard  │  │   Panel      │  │   Portal     │    │
│  │   (React)    │  │   (React)    │  │   (React)    │  │   (React)    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER (Node.js/Express)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Trips     │ │  Calendar   │ │  Bookings   │ │   Captains  │           │
│  │   API       │ │    API      │ │    API      │ │    API      │           │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                           │
│  │  Weather    │ │  Payments   │ │   Notify    │                           │
│  │  (NOAA)     │ │  (Stripe)   │ │  (SMS/Email)│                           │
│  └─────────────┘ └─────────────┘ └─────────────┘                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │   PostgreSQL     │  │     Redis        │  │    Firebase      │          │
│  │   (Primary DB)   │  │  (Sessions)      │  │   (Storage)      │          │
│  │   - Trips        │  │  - Calendar      │  │   - Boat photos  │          │
│  │   - Bookings     │  │    locks         │  │   - Catch photos │          │
│  │   - Captains     │  │  - Weather cache │  │                  │          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Frontend** | React 18 + Vite | Modern, mobile-first |
| **State** | Zustand | Simple state management |
| **Styling** | Tailwind CSS | Rapid UI development |
| **Backend** | Node.js + Express | Mature, captain-friendly |
| **Database** | PostgreSQL 15 | ACID for bookings, full-text search |
| **Cache** | Redis | Calendar locks, weather cache |
| **Storage** | Firebase Storage | Boat photos, catch galleries |
| **Payments** | Stripe Connect | Split payments to captains |
| **SMS** | Twilio | Booking confirmations |
| **Hosting** | Railway/Render | Simple deployment |

---

## 4. Data Models

### Captain
```typescript
interface Captain {
  id: string;
  user_id: string;
  
  // Profile
  business_name: string;                   // "Wrek-N-Eyes Charters"
  captain_name: string;
  bio: string;
  uscg_license_number?: string;
  years_experience: number;
  
  // Contact
  phone: string;
  email: string;
  website?: string;
  
  // Location
  home_port: {
    name: string;                          // "Ashtabula Harbor"
    marina: string;
    lat: number;
    lng: number;
  };
  
  // Boats
  boats: Boat[];
  
  // Specialization
  target_species: string[];                // ["Walleye", "Perch", "Steelhead"]
  trip_types: string[];                    // ["Full Day", "Half Day", "Evening"]
  
  // Photos
  photos: {
    boat: string[];
    catches: string[];
    captain: string;
  };
  
  // Reviews
  rating_average: number;
  review_count: number;
  
  is_verified: boolean;
  is_active: boolean;
  created_at: Date;
}

interface Boat {
  id: string;
  name: string;
  type: string;                            // "Sport Fisher", "Center Console"
  length_feet: number;
  passenger_capacity: number;
  amenities: string[];                     // ["Bathroom", "Cabin", "Fish Finder"]
}
```

### Trip (Availability)
```typescript
interface Trip {
  id: string;
  captain_id: string;
  boat_id: string;
  
  // Schedule
  date: string;                            // YYYY-MM-DD
  start_time: string;                      // HH:MM (24h)
  end_time: string;
  duration_hours: number;
  
  // Type
  trip_type: 'full_day' | 'half_day_am' | 'half_day_pm' | 'evening';
  target_species: string[];
  
  // Capacity
  max_anglers: number;
  spots_available: number;
  spots_booked: number;
  
  // Pricing
  pricing: {
    base_price: number;                    // Total for trip
    price_per_person?: number;             // If splitting
    deposit_required: number;              // Typically 20-30%
  };
  
  // Status
  status: 'available' | 'pending' | 'booked' | 'cancelled' | 'completed';
  
  // Description
  description?: string;
  included: string[];                      // ["Tackle", "Bait", "Cleaning"]
  bring_your_own: string[];                // ["Food", "Drinks", "License"]
  
  created_at: Date;
  updated_at: Date;
}
```

### Booking
```typescript
interface Booking {
  id: string;                              // Short code: CH-ABC123
  trip_id: string;
  captain_id: string;
  
  // Customer
  customer: {
    name: string;
    email: string;
    phone: string;
    experience_level: 'beginner' | 'intermediate' | 'experienced';
    special_requests?: string;
  };
  
  // Party
  party_size: number;
  party_details: {
    adults: number;
    children: number;                      // If captain allows
    children_ages?: number[];
  };
  
  // Payment
  payment: {
    total_amount: number;
    deposit_amount: number;
    balance_due: number;
    stripe_payment_intent_id: string;
    deposit_paid: boolean;
    balance_paid: boolean;
  };
  
  // Status workflow
  status: 'pending_deposit' | 'deposit_paid' | 'balance_due' | 'paid_in_full' | 'cancelled' | 'completed' | 'refunded';
  
  // Timeline
  booked_at: Date;
  deposit_paid_at?: Date;
  balance_paid_at?: Date;
  cancelled_at?: Date;
  
  // Post-trip
  review?: Review;
  catch_report?: CatchReport;
  
  created_at: Date;
  updated_at: Date;
}

interface Review {
  rating: 1-5;
  title: string;
  body: string;
  would_recommend: boolean;
  created_at: Date;
}

interface CatchReport {
  species_caught: {
    species: string;
    count: number;
    total_weight_lbs?: number;
  }[];
  photos: string[];
  notes: string;
}
```

### Calendar Sync
```typescript
interface CalendarSync {
  id: string;
  captain_id: string;
  
  // External calendar
  provider: 'google' | 'outlook' | 'apple';
  external_calendar_id: string;
  
  // Sync settings
  sync_direction: 'bidirectional' | 'to_platform' | 'from_platform';
  sync_frequency: 'realtime' | 'hourly' | 'daily';
  
  // State
  last_sync_at?: Date;
  last_sync_status: 'success' | 'error';
  last_sync_error?: string;
  
  is_active: boolean;
}
```

---

## 5. API Endpoints

### Public API (Anglers)
```
GET  /api/v1/captains                    # List captains (filterable)
GET  /api/v1/captains/:id                # Captain profile
GET  /api/v1/trips                       # Available trips (date range)
GET  /api/v1/trips/:id                   # Trip details

POST /api/v1/bookings                    # Create booking
GET  /api/v1/bookings/:id                # Check booking status
PUT  /api/v1/bookings/:id/cancel         # Cancel booking
```

### Captain Dashboard API
```
GET  /api/v1/captain/trips               # Manage trips
POST /api/v1/captain/trips
PUT  /api/v1/captain/trips/:id
DELETE /api/v1/captain/trips/:id

GET  /api/v1/captain/bookings            # View bookings
PUT  /api/v1/captain/bookings/:id/confirm
PUT  /api/v1/captain/bookings/:id/cancel

GET  /api/v1/captain/calendar            # Calendar view
POST /api/v1/captain/calendar/sync       # Sync external calendar

GET  /api/v1/captain/reviews             # Reviews
PUT  /api/v1/captain/profile             # Update profile
GET  /api/v1/captain/stats               # Dashboard stats
```

### Webhooks
```
POST /webhooks/stripe                    # Payment events
POST /webhooks/twilio                    # SMS delivery
```

---

## 6. Frontend Component Hierarchy

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Calendar.tsx
│   │   └── Rating.tsx
│   │
│   ├── angler/
│   │   ├── CaptainCard.tsx            # Search result card
│   │   ├── CaptainProfile.tsx         # Full profile
│   │   ├── TripSearch.tsx             # Date/species filters
│   │   ├── TripList.tsx               # Available trips
│   │   ├── TripDetail.tsx             # Booking page
│   │   ├── BookingForm.tsx            # Customer info
│   │   ├── PaymentForm.tsx            # Stripe checkout
│   │   └── BookingConfirmation.tsx
│   │
│   ├── captain/
│   │   ├── TripCalendar.tsx           # Full calendar view
│   │   ├── TripForm.tsx               # Create/edit trip
│   │   ├── BookingQueue.tsx           # Incoming bookings
│   │   ├── BookingDetail.tsx          # Manage booking
│   │   ├── ProfileEditor.tsx
│   │   ├── BoatManager.tsx
│   │   └── StatsDashboard.tsx
│   │
│   └── shared/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── WeatherWidget.tsx          # NOAA conditions
│
├── pages/
│   ├── angler/
│   │   ├── Home.tsx
│   │   ├── Search.tsx
│   │   ├── Captain.tsx
│   │   ├── Trip.tsx
│   │   ├── Book.tsx
│   │   └── Confirmation.tsx
│   │
│   └── captain/
│       ├── Login.tsx
│       ├── Dashboard.tsx
│       ├── Calendar.tsx
│       ├── Trips.tsx
│       ├── Bookings.tsx
│       └── Profile.tsx
│
└── lib/
    ├── api.ts
    ├── stripe.ts
    └── weather.ts
```

---

## 7. Key User Flows

### Flow 1: Angler Books Trip
```
1. Visit site → See featured captains
2. Search → Filter by date, species, party size
3. Browse captains → View profiles, ratings, boats
4. Select trip → Choose from available dates
5. Trip detail → See what's included, photos, reviews
6. Book → Enter party details
7. Payment → Pay deposit (Stripe)
8. Confirmation → Email + SMS confirmation
9. Reminder → SMS 24hrs before
10. Post-trip → Review prompt + catch report
```

### Flow 2: Captain Manages Bookings
```
1. Login to dashboard
2. View calendar → See booked vs available
3. Add trip → Set date, time, pricing, capacity
4. Sync calendar → Connect Google/Outlook
5. Receive booking → Notification email/SMS
6. Review booking → Customer profile, party size
7. Confirm → Mark confirmed
8. Day of trip → Check weather widget
9. Post-trip → Upload catch photos, request review
```

### Flow 3: Payment Flow (Stripe Connect)
```
1. Angler pays deposit (20-30%)
   - Platform fee deducted (5% or $0 with subscription)
   - Remainder held for captain
2. Balance due 48hrs before trip
3. Captain receives:
   - Deposit immediately (minus platform fee)
   - Balance 24hrs after trip completion
4. Refunds handled by platform policy
```

---

## 8. Business Model

### Captain Subscription Tiers
| Tier | Monthly Fee | Platform Fee | Features |
|------|-------------|--------------|----------|
| **Free** | $0 | 5% per booking | 5 trips/mo, basic listing |
| **Pro** | $39 | 0% | Unlimited trips, priority listing, calendar sync |
| **Captain+** | $79 | 0% | Multi-boat, analytics, API access |

### Customer Fees
- **No service fee** for anglers (absorbed by captain subscription)
- Standard credit card processing (2.9% + $0.30)

### Revenue Projections (Year 1)
| Scenario | Captains | Avg Bookings/Mo | Revenue |
|----------|----------|-----------------|---------|
| Conservative | 8 | 10 | $3,120/mo |
| Moderate | 12 | 15 | $7,020/mo |
| Optimistic | 15 | 20 | $11,700/mo |

### Cost Estimates (Monthly)
| Item | Cost |
|------|------|
| Hosting | $35 |
| Database | $20 |
| Redis | $10 |
| Twilio SMS | $30 |
| Stripe Connect | $0 (pass-through) |
| **Total** | **~$95/mo** |

---

## 9. Weather Integration

### NOAA Buoy 45005 (Lake Erie)
```typescript
interface WeatherConditions {
  timestamp: Date;
  wind_speed_kts: number;
  wind_direction: string;
  wave_height_ft: number;
  wave_period_sec: number;
  air_temp_f: number;
  water_temp_f: number;
  
  // Derived
  fishing_conditions: 'excellent' | 'good' | 'fair' | 'poor';
  cancellation_risk: 'low' | 'medium' | 'high';
}

// Display on:
// - Trip detail page (angler view)
// - Captain dashboard (trip planning)
// - Booking confirmation (set expectations)
```

### Weather Alerts
- Auto-email anglers if conditions deteriorate
- Captain can trigger "weather cancellation" with full refund
- Alternative date suggestion flow

---

## 10. Implementation Phases

### Phase 1: MVP Core (Weeks 1-4)
- [ ] Captain signup + profile creation
- [ ] Trip creation + calendar management
- [ ] Public trip search + booking
- [ ] Stripe deposit payments
- [ ] SMS/email notifications
- [ ] 3-5 pilot captains

**Success Criteria:** 10 bookings completed end-to-end

### Phase 2: Polish + Growth (Weeks 5-8)
- [ ] Reviews + ratings
- [ ] Calendar sync (Google/Outlook)
- [ ] Weather widget integration
- [ ] Catch report uploads
- [ ] CVB partnership integration

**Success Criteria:** 50 bookings, 8 captains active

### Phase 3: Scale (Weeks 9-12)
- [ ] Multi-boat support
- [ ] Advanced analytics
- [ ] Gift certificates
- [ ] Package deals (lodging + charter)
- [ ] Mobile app (PWA)

**Success Criteria:** 100+ bookings/month, 12+ captains

---

## 11. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Captains resist platform fees | Medium | High | Free tier, prove ROI with bookings |
| FishingBooker retaliation | Low | Medium | Focus on local, captains control pricing |
| Weather cancellations | High | Medium | Clear policy, easy rescheduling |
| No-show anglers | Medium | High | Deposit requirement, cancellation fees |
| Seasonal demand (April-Oct) | High | Medium | Off-season maintenance mode, early booking incentives |

---

## 12. Next Steps

### Immediate
1. **Contact Wrek-N-Eyes or Special-Eyes** — Request pilot partnership
2. **Set up Stripe Connect** — Platform + captain onboarding
3. **Scaffold project** — React + Node + Stripe
4. **Build captain profile** — MVP showcase

### Week 1
1. Captain signup flow
2. Basic trip creation
3. Public trip listing
4. Simple booking form

---

**Document Status:** Phase 3 Complete  
**Ready for:** Implementation (Phase 4)  
**Priority Pilots:** Wrek-N-Eyes Charters, Special-Eyes Charters, Lucky Strike
