# Insta-Book Stripe — Technical Specification
## Vacation Rental Booking Platform with Integrated Payments

**Date:** February 20, 2026  
**Version:** 1.0  
**Status:** Phase 3 Complete — Ready for Implementation  
**Previous:** Phase 1 Research ✅ | Phase 2 Resources ✅

---

## 1. Executive Summary

Insta-Book Stripe is a local-first vacation rental booking platform designed for small-scale property owners (1-10 properties) in Ashtabula County. It combines the professional booking experience of Airbnb with direct owner control and significantly lower fees (0.5% vs 17%).

**Key Differentiators:**
- Stripe-integrated deposits and balance auto-charging
- Calendar sync with Airbnb/VRBO to prevent double bookings
- Local white-glove onboarding and support
- Hosted booking pages + embeddable widgets

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Public      │  │  Owner       │  │  Admin       │  │  Booking     │    │
│  │  Booking     │  │  Dashboard   │  │  Panel       │  │  Widget      │    │
│  │  Page        │  │  (React)     │  │  (React)     │  │  (Embed)     │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER (Node.js/Express)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Auth        │  │  Properties  │  │  Bookings    │  │  Calendar    │    │
│  │  Routes      │  │  Routes      │  │  Routes      │  │  Routes      │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Stripe      │  │  Notifications│  │  iCal        │  │  Analytics   │    │
│  │  Webhooks    │  │  Routes      │  │  Routes      │  │  Routes      │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SERVICE LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Stripe      │  │  SendGrid    │  │  Twilio      │  │  Google      │    │
│  │  Connect     │  │  Email       │  │  SMS         │  │  Calendar    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Firestore (Primary Database)                                        │  │
│  │  ├── users collection                                                │  │
│  │  ├── properties collection                                           │  │
│  │  ├── bookings collection                                             │  │
│  │  ├── availability subcollections                                     │  │
│  │  └── audit_logs collection                                           │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Redis (Cache Layer)                                                 │  │
│  │  ├── availability cache (24h TTL)                                    │  │
│  │  ├── session store                                                   │  │
│  │  └── rate limiting counters                                          │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + Vite | SPA dashboard, booking UI |
| **Styling** | Tailwind CSS + Headless UI | Consistent, accessible components |
| **State** | Zustand + TanStack Query | Client state, server cache |
| **Backend** | Node.js + Express | REST API |
| **Database** | Firestore | Document store for flexibility |
| **Cache** | Redis (Upstash/Redis Cloud) | Availability queries, sessions |
| **Auth** | Firebase Auth | OAuth (Google), email/password |
| **Payments** | Stripe Connect | Connected accounts, deposits |
| **Email** | SendGrid | Transactional emails |
| **SMS** | Twilio | Booking reminders |
| **Calendar** | ical-generator + node-ical | iCal feed generation/import |
| **Hosting** | Vercel (frontend) + Railway/Render (API) | Scalable, cost-effective |
| **Storage** | Firebase Storage | Property photos |

---

## 3. Data Models

### 3.1 User (Owner)

```typescript
interface User {
  id: string;                    // Firebase Auth UID
  email: string;
  displayName: string;
  phone?: string;
  stripeAccountId?: string;      // Stripe Connect account ID
  stripeAccountStatus: 'pending' | 'active' | 'restricted' | 'rejected';
  subscription: {
    tier: 'basic' | 'pro' | 'manager';
    status: 'active' | 'trialing' | 'past_due' | 'cancelled';
    trialEndsAt?: Timestamp;
    currentPeriodEndsAt: Timestamp;
  };
  properties: string[];          // Array of property IDs
  settings: {
    timezone: string;            // Default: America/New_York
    currency: string;            // Default: USD
    notificationPreferences: {
      email: boolean;
      sms: boolean;
      bookingConfirmations: boolean;
      paymentNotifications: boolean;
    };
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 3.2 Property

```typescript
interface Property {
  id: string;
  ownerId: string;               // Reference to User
  name: string;
  slug: string;                  // URL-friendly name
  description: string;
  type: 'cottage' | 'house' | 'condo' | 'apartment' | 'room';
  location: {
    address: string;
    city: string;
    state: string;              // Default: OH
    zip: string;
    lat?: number;
    lng?: number;
  };
  photos: {
    url: string;
    caption?: string;
    order: number;
  }[];
  amenities: string[];           // ['wifi', 'kitchen', 'ac', 'parking', etc.]
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  
  // Pricing
  pricing: {
    baseRate: number;           // Nightly rate in cents
    cleaningFee: number;        // In cents
    damageDeposit: number;      // In cents (hold, not charged)
    minNights: number;          // Default: 2
    maxNights?: number;
    weeklyDiscount?: number;    // Percentage (0-100)
    monthlyDiscount?: number;   // Percentage (0-100)
    seasonalRates?: {
      startMonth: number;       // 1-12
      endMonth: number;
      rateMultiplier: number;   // e.g., 1.5 for 50% increase
      name: string;             // e.g., "Peak Summer"
    }[];
  };
  
  // Booking Rules
  bookingRules: {
    checkInTime: string;        // "15:00"
    checkOutTime: string;       // "11:00"
    advanceBookingDays: number; // How far in advance (default: 365)
    bufferDays: number;         // Days between bookings
    instantBook: boolean;       // Auto-confirm or request-to-book
    cancellationPolicy: 'flexible' | 'moderate' | 'strict';
    depositPercent: number;     // 25-50%
    balanceDueDays: number;     // Days before check-in to charge balance
  };
  
  // Availability & Sync
  availability: {
    blockedDates: string[];     // ISO date strings ["2026-06-15"]
    defaultAvailability: 'available' | 'unavailable';
    externalCalendars: {
      name: string;
      url: string;
      lastSynced?: Timestamp;
    }[];
  };
  
  // Public Settings
  publicSettings: {
    isActive: boolean;
    featuredOrder?: number;
    seoTitle?: string;
    seoDescription?: string;
  };
  
  // House Rules
  houseRules: string[];
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 3.3 Booking

```typescript
interface Booking {
  id: string;
  propertyId: string;
  ownerId: string;
  
  // Guest Info
  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    adults: number;
    children: number;
    pets?: number;
    specialRequests?: string;
  };
  
  // Dates
  checkIn: string;              // ISO date "2026-07-15"
  checkOut: string;
  nights: number;
  
  // Pricing Breakdown
  pricing: {
    nightlyRate: number;        // In cents
    subtotal: number;           // nights * rate
    cleaningFee: number;
    taxes: number;              // Calculated based on location
    total: number;
    depositAmount: number;      // depositPercent of subtotal + cleaning
    balanceAmount: number;      // remainder
  };
  
  // Payment Status
  payment: {
    deposit: {
      status: 'pending' | 'held' | 'captured' | 'refunded' | 'failed';
      stripePaymentIntentId?: string;
      amount: number;
      chargedAt?: Timestamp;
    };
    balance: {
      status: 'pending' | 'scheduled' | 'charged' | 'refunded' | 'waived';
      stripePaymentIntentId?: string;
      amount: number;
      scheduledChargeAt?: Timestamp;  // checkIn - balanceDueDays
      chargedAt?: Timestamp;
    };
    damageHold: {
      status: 'pending' | 'held' | 'released';
      stripePaymentIntentId?: string;
      amount: number;
    };
  };
  
  // Booking Status
  status: 'inquiry' | 'pending_deposit' | 'deposit_paid' | 'confirmed' | 
          'balance_due' | 'completed' | 'cancelled' | 'refunded';
  
  // Cancellation
  cancellation?: {
    cancelledAt: Timestamp;
    reason?: string;
    refundAmount: number;
    cancelledBy: 'guest' | 'owner' | 'system';
  };
  
  // Communications
  communications: {
    confirmationSent: boolean;
    reminder24hSent: boolean;
    reminder1hSent: boolean;
    checkInInstructionsSent: boolean;
  };
  
  // Metadata
  source: 'direct' | 'widget' | 'airbnb_sync' | 'vrbo_sync' | 'manual';
  ipAddress?: string;
  userAgent?: string;
  notes?: string;               // Internal owner notes
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 3.4 Availability Cache (Redis)

```typescript
// Key: availability:{propertyId}:{YYYY-MM}
// Value: Bitfield representing each day (0=unavailable, 1=available)
// TTL: 24 hours

interface AvailabilityCache {
  propertyId: string;
  month: string;                // "2026-07"
  days: number[];               // [1,1,1,0,0,1,1...] 31 elements
  lastCalculated: Timestamp;
}
```

---

## 4. API Endpoints

### 4.1 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Email/password login |
| POST | `/api/auth/google` | Google OAuth |
| POST | `/api/auth/logout` | Sign out |
| GET | `/api/auth/me` | Current user profile |
| POST | `/api/auth/refresh` | Refresh JWT |

### 4.2 Properties

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/properties` | Public | List active properties (public view) |
| GET | `/api/properties/:slug` | Public | Single property details |
| GET | `/api/properties/:id/availability` | Public | Get availability calendar |
| POST | `/api/properties` | Owner | Create new property |
| PATCH | `/api/properties/:id` | Owner | Update property |
| DELETE | `/api/properties/:id` | Owner | Delete property |
| GET | `/api/owner/properties` | Owner | List owner's properties |
| POST | `/api/properties/:id/sync-calendar` | Owner | Trigger external calendar sync |
| GET | `/api/properties/:id/ical` | Public | Generate iCal feed |

### 4.3 Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/bookings/inquiry` | Public | Create booking inquiry |
| POST | `/api/bookings/calculate` | Public | Calculate pricing preview |
| POST | `/api/bookings/hold` | Public | Temporarily hold dates (15 min) |
| POST | `/api/bookings/confirm` | Public | Confirm with deposit payment |
| GET | `/api/bookings/:id` | Guest/Owner | Get booking details |
| PATCH | `/api/bookings/:id` | Owner | Update booking (notes, status) |
| POST | `/api/bookings/:id/cancel` | Guest/Owner | Cancel booking |
| GET | `/api/owner/bookings` | Owner | List owner's bookings |
| POST | `/api/bookings/:id/send-instructions` | Owner | Send check-in instructions |

### 4.4 Stripe

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/stripe/connect/onboard` | Owner | Start Connect onboarding |
| GET | `/api/stripe/connect/status` | Owner | Check account status |
| POST | `/api/stripe/create-payment-intent` | Public | Create payment intent for deposit |
| POST | `/api/stripe/webhooks` | Public | Stripe webhook handler |

### 4.5 Notifications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/notifications/test-email` | Owner | Send test email |
| GET | `/api/notifications/templates` | Owner | Get email templates |
| PATCH | `/api/notifications/templates/:id` | Owner | Update template |

---

## 5. Frontend Components

### 5.1 Public Booking Flow

```
BookingPage (/:property-slug)
├── PropertyHeader
│   ├── PhotoGallery
│   └── PropertyMeta (guests, beds, baths)
├── PropertyDescription
├── AmenitiesList
├── LocationMap
├── BookingWidget (sticky sidebar on desktop)
│   ├── DatePicker (check-in/check-out)
│   ├── GuestSelector
│   ├── PricingBreakdown
│   │   ├── NightlyRate × Nights
│   │   ├── CleaningFee
│   │   ├── Taxes
│   │   └── Total
│   ├── BookButton → /checkout
│   └── InstantBookBadge (if enabled)
└── HouseRules

CheckoutPage (/checkout/:booking-id)
├── BookingSummary
├── GuestInfoForm
├── PaymentForm (Stripe Elements)
├── CancellationPolicy
├── TermsCheckbox
└── PayDepositButton → Stripe confirmation

ConfirmationPage (/booking-confirmation/:id)
├── SuccessMessage
├── BookingDetails
├── CalendarAddButtons
└── ShareButtons
```

### 5.2 Owner Dashboard

```
DashboardLayout
├── Sidebar
│   ├── Properties
│   ├── Bookings
│   ├── Calendar
│   ├── Analytics
│   ├── Settings
│   └── Help
├── TopBar
│   ├── Notifications
│   ├── AccountMenu
│   └── SubscriptionStatus
│
├── PropertiesView
│   ├── PropertyList
│   │   └── PropertyCard (photo, stats, quick actions)
│   └── AddPropertyButton → /properties/new
│
├── PropertyEditor (/properties/:id/edit)
│   ├── StepIndicator
│   ├── Step1: BasicInfo
│   ├── Step2: Photos
│   ├── Step3: Pricing
│   ├── Step4: BookingRules
│   ├── Step5: Availability
│   └── Step6: Integrations (iCal, Stripe)
│
├── BookingsView (/bookings)
│   ├── FilterBar (date range, status, property)
│   ├── BookingsTable
│   │   └── BookingRow (guest, dates, status, actions)
│   └── BookingDetailModal
│
├── CalendarView (/calendar)
│   ├── PropertySelector
│   ├── CalendarGrid
│   │   ├── DayCell (price, status, booking count)
│   │   └── BookingOverlay
│   ├── DragToBlockDates
│   └── SyncStatusIndicator
│
└── AnalyticsView (/analytics)
    ├── DateRangePicker
    ├── KPICards (revenue, occupancy, bookings)
    ├── RevenueChart
    ├── OccupancyHeatmap
    └── UpcomingPayouts
```

### 5.3 Embeddable Widget

```html
<!-- Usage on external site -->
<div id="instabook-widget" 
     data-property-id="abc123"
     data-theme="light"
     data-primary-color="#3b82f6">
</div>
<script src="https://instabook.noIRsys.com/widget.js"></script>
```

**Widget Components:**
- Mini date picker
- Guest counter
- Price preview
- "Book Now" button → opens modal or redirects

---

## 6. Implementation Phases

### Phase 1: MVP Core (Weeks 1-4)
**Goal:** Single property booking with Stripe deposits

**Deliverables:**
- [ ] Firebase project setup + Auth
- [ ] Property data model + CRUD API
- [ ] Public booking page (React)
- [ ] Date picker with availability check
- [ ] Stripe Connect onboarding flow
- [ ] Deposit payment (Stripe Payment Intents)
- [ ] Booking confirmation email (SendGrid)
- [ ] Owner dashboard (basic)

**Tech Debt:**
- Manual availability management (no sync)
- No SMS notifications
- No balance auto-charge

---

### Phase 2: Payment Automation (Weeks 5-6)
**Goal:** Complete payment lifecycle

**Deliverables:**
- [ ] Balance auto-charge (scheduled job)
- [ ] Damage deposit hold + release
- [ ] Refund functionality
- [ ] Stripe webhook handling (payment failures)
- [ ] Payout dashboard for owners
- [ ] Failed payment retry logic

---

### Phase 3: Calendar Sync & Scale (Weeks 7-8)
**Goal:** Prevent double bookings, handle multiple properties

**Deliverables:**
- [ ] iCal feed generation
- [ ] External calendar import (Airbnb/VRBO)
- [ ] Redis availability cache
- [ ] Multi-property support
- [ ] Subscription tiers (Stripe Billing)
- [ ] Embeddable widget

---

### Phase 4: Polish & Growth (Weeks 9-10)
**Goal:** Production-ready with growth features

**Deliverables:**
- [ ] SMS notifications (Twilio)
- [ ] Check-in instructions automation
- [ ] Analytics dashboard
- [ ] Review/rating system
- [ ] Referral program
- [ ] Mobile app (PWA)

---

## 7. Security Considerations

### 7.1 Authentication
- Firebase Auth with email verification
- JWT tokens with 1-hour expiry
- Refresh token rotation
- OAuth only for Google (no Facebook)

### 7.2 Authorization
- Property ownership verification on all owner routes
- Booking access limited to guest (via email token) or owner
- Admin role separate from owner role

### 7.3 Payment Security
- Never store card data (Stripe handles everything)
- PCI compliance via Stripe Elements
- Webhook signature verification
- Idempotency keys on all payment operations

### 7.4 Data Protection
- Firestore security rules for row-level access
- Email encryption in transit (TLS)
- PII logging restrictions
- GDPR-compliant data export/deletion

---

## 8. Pricing & Billing Logic

### 8.1 Subscription Tiers

| Feature | Basic ($19/mo) | Pro ($39/mo) | Manager ($79/mo) |
|---------|----------------|--------------|------------------|
| Properties | 1 | 3 | 10 |
| Bookings/mo | Unlimited | Unlimited | Unlimited |
| Stripe Fee | 0.5% | 0.5% | 0.5% |
| SMS Reminders | ❌ | ✅ | ✅ |
| Calendar Sync | Import only | Bidirectional | Bidirectional |
| Analytics | Basic | Advanced | White-label |
| Support | Email | Priority | Dedicated |
| API Access | ❌ | ❌ | ✅ |

### 8.2 Revenue Calculation

```javascript
// Booking total calculation
function calculateBookingTotal(property, checkIn, checkOut, guests) {
  const nights = daysBetween(checkIn, checkOut);
  const seasonalMultiplier = getSeasonalRate(property, checkIn);
  const nightlyRate = property.pricing.baseRate * seasonalMultiplier;
  
  const subtotal = nightlyRate * nights;
  const cleaningFee = property.pricing.cleaningFee;
  const taxes = (subtotal + cleaningFee) * 0.08; // 8% Ashtabula tax
  
  const total = subtotal + cleaningFee + taxes;
  const depositAmount = Math.round(total * (property.bookingRules.depositPercent / 100));
  const balanceAmount = total - depositAmount;
  
  return {
    breakdown: { nightlyRate, nights, subtotal, cleaningFee, taxes },
    total,
    depositAmount,
    balanceAmount
  };
}
```

---

## 9. Monitoring & Alerting

### 9.1 Key Metrics

| Metric | Target | Alert If |
|--------|--------|----------|
| API response time | <200ms p95 | >500ms |
| Stripe webhook success | 100% | <99% |
| Booking conversion | >15% | <10% |
| Payment failure rate | <3% | >5% |
| Calendar sync lag | <5 min | >15 min |

### 9.2 Error Tracking
- Sentry for frontend errors
- Winston/Pino for API logging
- Stripe Dashboard for payment issues

### 9.3 Health Checks
```
GET /health
→ { status: 'ok', version: '1.0.0', services: { db: 'ok', stripe: 'ok' } }
```

---

## 10. Deployment Checklist

### Pre-Launch
- [ ] Stripe Connect production account
- [ ] SendGrid domain authentication
- [ ] Twilio verified sender
- [ ] Firebase production project
- [ ] Custom domain + SSL
- [ ] Terms of Service drafted
- [ ] Privacy Policy drafted
- [ ] Cookie consent banner
- [ ] Google Analytics

### Launch Day
- [ ] Deploy API to production
- [ ] Deploy frontend to production
- [ ] Run smoke tests
- [ ] Verify Stripe webhooks
- [ ] Send test booking end-to-end
- [ ] Monitor error logs

---

## 11. Appendix

### 11.1 Environment Variables

```bash
# Firebase
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_CLIENT_ID=

# SendGrid
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=bookings@instabook.noIRsys.com
SENDGRID_FROM_NAME="Insta-Book"

# Twilio
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Redis
REDIS_URL=

# App
APP_URL=https://instabook.noIRsys.com
API_URL=https://api.instabook.noIRsys.com
JWT_SECRET=
```

### 11.2 Third-Party Costs (Monthly Estimate)

| Service | Usage | Cost |
|---------|-------|------|
| Firebase | 10K auth, 1M reads | $25 |
| Vercel Pro | 2M requests | $20 |
| Railway/Render | 1GB RAM | $25 |
| Redis (Upstash) | 1GB | $10 |
| SendGrid | 10K emails | Free tier |
| Twilio | 500 SMS | $7.50 |
| Stripe | Processing | Per transaction |
| **Total Fixed** | | **~$87.50/mo** |

---

## 12. Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-20 | Initial specification after Phase 1 & 2 |

---

**Status:** ✅ Phase 3 SPEC.md Complete  
**Next Phase:** Phase 4 — Implementation (MVP Core)
