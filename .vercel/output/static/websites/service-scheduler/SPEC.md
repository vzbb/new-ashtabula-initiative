# service-scheduler — Technical Specification

**Project:** Service Scheduler — Appointment Booking Platform for Ashtabula Service Businesses  
**Date:** February 20, 2026  
**Status:** Phase 3 Complete — Ready for Implementation  
**Author:** Rondell (Noirsys AI)  
**Version:** 1.0

---

## 1. System Architecture

### 1.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Customer   │  │   Business   │  │    Admin     │  │   Public     │   │
│  │   Booking    │  │   Dashboard  │  │   Portal     │  │   Booking    │   │
│  │     UI       │  │      UI      │  │      UI      │  │     Page     │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
└─────────┼────────────────┼────────────────┼────────────────┼─────────────┘
          │                │                │                │
          └────────────────┴────────────────┴────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   React + Vite      │
                    │   Tailwind CSS      │
                    │   React Query       │
                    └──────────┬──────────┘
                               │ HTTPS/JSON
┌──────────────────────────────▼─────────────────────────────────────────────┐
│                           API LAYER (Node.js/Express)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Booking    │  │  Business    │  │  Calendar    │  │  Notification│   │
│  │    API       │  │    API       │  │  Sync API    │  │     API      │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
└─────────┼────────────────┼────────────────┼────────────────┼─────────────┘
          │                │                │                │
          └────────────────┴────────────────┴────────────────┘
                               │
┌──────────────────────────────┼─────────────────────────────────────────────┐
│                      SERVICE LAYER (Firebase Functions)                      │
│  ┌──────────────┐  ┌────────┴──────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Availability │  │   Booking     │  │  Reminder    │  │   Business   │   │
│  │   Engine     │  │   Engine      │  │   Service    │  │   Profile    │   │
│  └──────┬───────┘  └──────┬────────┘  └──────┬───────┘  └──────┬───────┘   │
└─────────┼────────────────┼───────────────────┼────────────────┼─────────────┘
          │                │                   │                │
          └────────────────┴───────────────────┴────────────────┘
                               │
┌──────────────────────────────┼─────────────────────────────────────────────┐
│                          DATA LAYER                                          │
│  ┌──────────────┐  ┌────────┴──────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Firestore   │  │    Redis      │  │ Cloud Storage│  │  Google      │   │
│  │  (Primary)   │  │   (Cache)     │  │  (Images)    │  │  Calendar    │   │
│  └──────────────┘  └───────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + Vite | Fast, modern UI framework |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS |
| **State** | React Query + Zustand | Server state + client state |
| **Backend** | Firebase Functions | Serverless API endpoints |
| **Auth** | Firebase Auth | Phone + Email/Password |
| **Database** | Firestore | Primary document store |
| **Cache** | Redis (Upstash) | Session cache, rate limiting |
| **Storage** | Firebase Storage | Business logos, service images |
| **SMS** | Twilio | Booking confirmations, reminders |
| **Email** | SendGrid | Transactional emails |
| **Calendar** | Google Calendar API | Sync availability |
| **Payments** | Stripe (future) | Premium tier upgrades |
| **Hosting** | Firebase Hosting | Global CDN, SSL |

### 1.3 Design Principles

1. **Mobile-First:** 70%+ of bookings happen on mobile
2. **Zero-Config Default:** Works out of the box with sensible defaults
3. **Progressive Enhancement:** Core features work without complex setup
4. **Offline-Resilient:** Queue actions when connectivity is poor
5. **Accessibility:** WCAG 2.1 AA compliance minimum

---

## 2. Data Models

### 2.1 Business Profile

```typescript
interface Business {
  id: string;
  
  // Basic Info
  name: string;
  slug: string; // URL-friendly: "johns-barbershop"
  description?: string;
  category: BusinessCategory;
  
  // Contact
  phone: string;
  email?: string;
  website?: string;
  
  // Location
  address: {
    street: string;
    city: string;
    state: string; // "OH"
    zip: string;
    coordinates?: GeoPoint;
  };
  
  // Branding
  logoUrl?: string;
  primaryColor?: string; // Hex color
  
  // Settings
  settings: {
    timezone: string; // "America/New_York"
    defaultDuration: number; // minutes
    bufferTime: number; // minutes between appointments
    minNotice: number; // hours required for booking
    maxAdvance: number; // days ahead customers can book
    allowSameDay: boolean;
  };
  
  // Hours
  businessHours: {
    [key: string]: { // "monday", "tuesday", etc.
      isOpen: boolean;
      open: string; // "09:00"
      close: string; // "17:00"
      breaks: Break[];
    };
  };
  
  // Integrations
  integrations: {
    googleCalendar?: {
      connected: boolean;
      calendarId?: string;
    };
    twilioPhone?: string; // Dedicated Twilio number
  };
  
  // Metadata
  ownerId: string;
  plan: "free" | "pro"; // Pro has more features
  status: "active" | "paused" | "suspended";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

type BusinessCategory = 
  | "hair_beauty"
  | "auto_repair"
  | "home_services"
  | "health_wellness"
  | "professional"
  | "pet_services"
  | "other";

interface Break {
  start: string; // "12:00"
  end: string; // "13:00"
}
```

### 2.2 Service Definition

```typescript
interface Service {
  id: string;
  businessId: string;
  
  // Basic Info
  name: string;
  description?: string;
  
  // Duration & Buffer
  duration: number; // minutes
  bufferAfter: number; // minutes after appointment
  
  // Pricing
  price?: number; // cents (optional for quote-based)
  priceType: "fixed" | "quote" | "free";
  
  // Availability
  availability: {
    type: "business_hours" | "custom";
    customHours?: DaySchedule[];
  };
  
  // Requirements
  requirements?: string[]; // "Valid ID", "Car keys", etc.
  
  // Booking Control
  maxPerSlot: number; // 1 for individual, >1 for classes/groups
  allowOnlineBooking: boolean;
  
  // Display
  imageUrl?: string;
  order: number; // Sort order
  
  // Status
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 2.3 Appointment/Booking

```typescript
interface Appointment {
  id: string;
  businessId: string;
  serviceId: string;
  
  // Customer Info
  customer: {
    name: string;
    phone: string;
    email?: string;
    notes?: string; // "First-time customer", etc.
    customerId?: string; // If registered
  };
  
  // Appointment Details
  date: string; // "2026-03-15" (YYYY-MM-DD)
  time: string; // "14:30" (24hr format)
  duration: number; // minutes (can differ from service default)
  endTime: string; // Computed: time + duration
  
  // Status
  status: "confirmed" | "cancelled" | "completed" | "no_show";
  
  // Communication Log
  communications: Communication[];
  
  // Reminders Sent
  reminders: {
    confirmationSent: boolean;
    dayBeforeSent: boolean;
    hourBeforeSent: boolean;
  };
  
  // Source
  source: "web" | "sms" | "phone" | "walk_in";
  
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
  cancelledAt?: Timestamp;
  cancelledBy?: "customer" | "business" | "system";
  cancellationReason?: string;
}

interface Communication {
  id: string;
  type: "sms" | "email" | "call";
  direction: "inbound" | "outbound";
  content: string;
  timestamp: Timestamp;
  status: "sent" | "delivered" | "failed";
}
```

### 2.4 Availability/Time Slots

```typescript
interface TimeSlot {
  date: string; // "2026-03-15"
  time: string; // "14:00"
  duration: number;
  
  isAvailable: boolean;
  unavailableReason?: "booked" | "blocked" | "outside_hours";
  
  // If booked
  appointmentId?: string;
}

// Special hours/closed days
interface SpecialHours {
  businessId: string;
  date: string;
  type: "closed" | "custom";
  customHours?: {
    open: string;
    close: string;
  };
  reason?: string; // "Holiday", "Vacation", etc.
}
```

---

## 3. API Endpoints

### 3.1 Public Booking API (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/businesses/:slug` | Get business public profile |
| GET | `/api/v1/businesses/:slug/services` | List available services |
| GET | `/api/v1/businesses/:slug/availability` | Get available time slots |
| POST | `/api/v1/bookings` | Create new booking |
| GET | `/api/v1/bookings/:id` | Get booking details (w/ token) |
| POST | `/api/v1/bookings/:id/cancel` | Cancel booking (w/ token) |

### 3.2 Business Owner API (Authenticated)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/me/business` | Get my business |
| PATCH | `/api/v1/me/business` | Update business settings |
| GET | `/api/v1/me/services` | List all services |
| POST | `/api/v1/me/services` | Create service |
| PATCH | `/api/v1/me/services/:id` | Update service |
| DELETE | `/api/v1/me/services/:id` | Delete service |
| GET | `/api/v1/me/appointments` | List appointments |
| GET | `/api/v1/me/appointments/:id` | Get appointment details |
| PATCH | `/api/v1/me/appointments/:id` | Update appointment |
| POST | `/api/v1/me/appointments/:id/confirm` | Confirm via phone/walk-in |
| POST | `/api/v1/me/appointments/:id/no-show` | Mark no-show |
| POST | `/api/v1/me/appointments/:id/complete` | Mark completed |
| POST | `/api/v1/me/appointments/:id/message` | Send message to customer |
| GET | `/api/v1/me/availability/blocked` | List blocked times |
| POST | `/api/v1/me/availability/blocked` | Block time slot |
| DELETE | `/api/v1/me/availability/blocked/:id` | Unblock time |
| GET | `/api/v1/me/special-hours` | List special hours |
| POST | `/api/v1/me/special-hours` | Add special hours |
| DELETE | `/api/v1/me/special-hours/:id` | Remove special hours |

### 3.3 Admin API (Internal)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/businesses` | List all businesses |
| GET | `/api/v1/admin/businesses/:id` | Get business details |
| POST | `/api/v1/admin/businesses/:id/suspend` | Suspend business |
| GET | `/api/v1/admin/metrics` | Platform metrics |

### 3.4 Webhooks

| Endpoint | Description |
|----------|-------------|
| POST | `/webhooks/twilio/sms` | Incoming SMS replies |
| POST | `/webhooks/twilio/status` | SMS delivery status |
| POST | `/webhooks/google/calendar` | Calendar change notifications |

---

## 4. Frontend Component Hierarchy

### 4.1 Public Booking Flow

```
BookingPage (/b/:slug)
├── BusinessHeader
│   ├── Logo
│   ├── BusinessName
│   └── ContactInfo
├── ServiceSelector
│   └── ServiceCard[]
│       ├── ServiceImage
│       ├── ServiceName
│       ├── Duration
│       └── Price
├── DatePicker
│   ├── MonthNavigator
│   └── DayGrid
├── TimeSlotPicker
│   └── TimeSlotButton[]
├── BookingForm
│   ├── CustomerNameInput
│   ├── PhoneInput
│   ├── EmailInput (optional)
│   ├── NotesTextarea
│   └── SubmitButton
└── BookingConfirmation
    ├── ConfirmationDetails
    ├── AddToCalendarButton
    └── ShareButtons
```

### 4.2 Business Dashboard

```
DashboardLayout
├── Sidebar
│   ├── BusinessLogo
│   ├── NavMenu
│   │   ├── DashboardLink
│   │   ├── CalendarLink
│   │   ├── ServicesLink
│   │   ├── CustomersLink
│   │   └── SettingsLink
│   └── UpgradePrompt (if free)
├── TopBar
│   ├── Search
│   ├── NotificationsBell
│   └── UserMenu
└── MainContent
    ├── DashboardView
    │   ├── TodayStats
    │   ├── UpcomingAppointments
    │   └── QuickActions
    ├── CalendarView
    │   ├── CalendarHeader
    │   ├── CalendarGrid
    │   └── AppointmentModal
    ├── ServicesView
    │   ├── ServiceList
    │   └── ServiceEditor
    └── SettingsView
        ├── BusinessInfoForm
        ├── HoursEditor
        ├── NotificationSettings
        └── IntegrationsPanel
```

### 4.3 Key Components

| Component | Props | Description |
|-----------|-------|-------------|
| `TimeSlotPicker` | `slots: TimeSlot[], onSelect, selectedSlot` | Grid of available times |
| `DatePicker` | `value, onChange, minDate, maxDate, blockedDates` | Calendar with availability |
| `ServiceCard` | `service: Service, selected, onClick` | Clickable service selection |
| `AppointmentCard` | `appointment: Appointment, onConfirm, onCancel` | Appointment list item |
| `BusinessHoursEditor` | `hours, onChange` | Day-by-day hours UI |
| `NotificationPreferences` | `prefs, onChange` | SMS/email toggle settings |

---

## 5. Implementation Phases

### Phase 1: MVP Core (Weeks 1-3)

**Goal:** Basic booking flow working end-to-end

| Week | Tasks |
|------|-------|
| **Week 1** | Firebase setup, Auth (phone), Business model, Service model |
| **Week 2** | Availability engine, Public booking UI, Appointment creation |
| **Week 3** | Business dashboard, Basic calendar view, SMS confirmations |

**Deliverables:**
- Business can create profile and add services
- Customer can view public page and book
- SMS confirmation sent to customer
- Business sees booking in dashboard

### Phase 2: Business Tools (Weeks 4-5)

**Goal:** Full business owner experience

| Week | Tasks |
|------|-------|
| **Week 4** | Full calendar UI, Appointment management, Customer notes |
| **Week 5** | Blocked times, Special hours, Business settings |

**Deliverables:**
- Drag-and-drop calendar interface
- Block time off (lunch, appointments)
- Set holidays/vacation days
- Customer management view

### Phase 3: Notifications & Reminders (Week 6)

**Goal:** Reduce no-shows

| Task | Description |
|------|-------------|
| Reminder Engine | Schedule and send reminders |
| SMS Templates | Configurable message templates |
| Delivery Tracking | Track sent/delivered/failed |
| Customer Replies | Handle "CANCEL" or "CONFIRM" replies |

**Deliverables:**
- 24-hour reminder SMS
- 1-hour reminder SMS (optional)
- Customer can reply to cancel

### Phase 4: Polish & Pro Features (Weeks 7-8)

**Goal:** Professional polish, pro tier foundation

| Task | Description |
|------|-------------|
| Google Calendar Sync | Two-way sync with GCal |
| Custom Branding | Logo upload, colors, custom domain (pro) |
| Multiple Services | Categories, variations |
| Analytics Dashboard | Booking stats, popular times |
| Recurring Bookings | Weekly/monthly repeats |

**Deliverables:**
- Pro tier with premium features
- Calendar sync working
- Analytics showing insights

### Phase 5: SMS Bot Enhancement (Weeks 9-10)

**Goal:** Full-featured SMS agent per CSV requirements

| Task | Description |
|------|-------------|
| SMS Booking Flow | Book entirely via text |
| "Car Ready" Notifications | Business sends ready alerts |
| Two-way SMS | Full conversation support |
| Auto-responses | Hours, location, FAQs |

---

## 6. Security Considerations

### 6.1 Authentication

- **Phone Auth (Primary):** Firebase Phone Auth with reCAPTCHA
- **Email/Password:** Optional for business owners
- **Anonymous:** Public booking pages (no auth required)
- **Token-based:** Booking details accessed via secure token in URL

### 6.2 Authorization Rules

```javascript
// Firestore Security Rules
match /businesses/{businessId} {
  // Public read for active businesses
  allow read: if resource.data.status == "active";
  // Only owner can write
  allow write: if request.auth != null && 
                resource.data.ownerId == request.auth.uid;
}

match /appointments/{appointmentId} {
  // Customer can read their own via token
  allow read: if request.query.resource.data.customer.phone == 
                request.query.phone;
  // Business owner can read/write their appointments
  allow read, write: if request.auth != null && 
                      resource.data.businessId in 
                      getBusinessesForUser(request.auth.uid);
}
```

### 6.3 Data Protection

| Concern | Mitigation |
|---------|------------|
| Phone numbers | Encrypted at rest, masked in logs |
| PII | Minimize collection, secure storage |
| Rate limiting | 10 bookings/hour/IP, 100 SMS/day/number |
| Input validation | Strict validation on all inputs |
| HTTPS only | All traffic TLS 1.3 |

---

## 7. Pricing & Tiers

### Free Tier
- 1 business profile
- Up to 3 services
- 50 appointments/month
- Basic SMS confirmations
- Standard support

### Pro Tier ($19/month)
- Unlimited services
- Unlimited appointments
- Google Calendar sync
- Custom branding (logo, colors)
- Reminder customization
- Priority support
- Analytics dashboard

### Platform Economics
- **Cost per SMS:** ~$0.0075 (Twilio)
- **Cost per booking:** ~$0.02 (SMS + infrastructure)
- **Break-even:** Free tier subsidized by Pro conversions
- **Target conversion:** 10% free → pro

---

## 8. Deployment Checklist

### Pre-Launch

- [ ] Firebase project created
- [ ] Firestore indexes defined
- [ ] Firebase Auth configured (phone provider)
- [ ] Twilio account + phone number purchased
- [ ] SendGrid account configured
- [ ] Domain registered (ashtabulabooking.com?)
- [ ] SSL certificate (Firebase handles)
- [ ] Privacy policy drafted
- [ ] Terms of service drafted

### Launch Day

- [ ] Deploy to Firebase Hosting
- [ ] Test full booking flow end-to-end
- [ ] Verify SMS delivery
- [ ] Test business dashboard
- [ ] Check mobile responsiveness
- [ ] Submit to Google Search Console
- [ ] Create demo business account
- [ ] Write launch announcement

### Post-Launch

- [ ] Monitor error rates
- [ ] Track conversion metrics
- [ ] Collect user feedback
- [ ] Fix critical bugs
- [ ] Plan Phase 2 features

---

## 9. Cost Estimates

### Fixed Monthly Costs

| Service | Cost |
|---------|------|
| Firebase Blaze Plan | Pay-as-you-go (~$10-20) |
| Twilio Phone Number | $1.15/month |
| Twilio SMS (estimated 500/mo) | $3.75 |
| SendGrid (free tier) | $0 |
| Upstash Redis (free tier) | $0 |
| **Total Fixed** | **~$15-25/month** |

### Variable Costs (at scale)

| Metric | Cost |
|--------|------|
| Per 1,000 bookings | ~$20 (SMS + compute) |
| Storage (images) | ~$0.10/GB/month |
| Bandwidth | Firebase free tier covers initial |

### Revenue Projections

| Scenario | Pro Users | Monthly Revenue |
|----------|-----------|-----------------|
| Conservative (5% convert) | 25 | $475 |
| Moderate (10% convert) | 50 | $950 |
| Optimistic (20% convert) | 100 | $1,900 |

---

## 10. Open Questions

1. **Twilio Phone Number:** Do we need local (440) area code or toll-free?
2. **Google Calendar:** OAuth consent screen setup — who owns the app?
3. **Pricing:** Should we offer annual discount for Pro tier?
4. **Custom Domains:** Allow businesses to use their own domain? (technical complexity)
5. **SMS Volume:** Should we implement SMS pooling/shared numbers to reduce costs?

---

## 11. Next Steps

1. **Immediate:** Set up Firebase project and deploy skeleton
2. **Week 1:** Build business onboarding flow
3. **Week 2:** Implement public booking page
4. **Week 3:** Connect Twilio for SMS
5. **Week 4:** Soft launch with 3 beta businesses

---

*Document Version: 1.0*  
*Last Updated: February 20, 2026*  
*Status: Ready for implementation*
