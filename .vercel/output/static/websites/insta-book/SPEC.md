# SPEC.md — Insta-Book
**Date:** February 19, 2026
**Version:** 1.0 — MVP Specification
**Project:** insta-book

---

## 1. Product Overview

### One-Line Description
"Calendly for Ashtabula" — a dead-simple booking widget that lets local service businesses accept appointments 24/7 without the phone tag.

### Target User
**Primary:** Small service business owners (1-5 staff) in Ashtabula County:
- Salons, barbershops, nail techs
- Massage therapists, wellness providers
- Pet groomers, dog trainers
- Tutors, consultants
- Home service providers

**Secondary:** Their customers who want instant booking without calling

### Core Value Proposition
"Never lose a customer to phone tag again. Free booking widget, paid SMS reminders that cut no-shows by 30%."

---

## 2. Feature Specification

### P0 — MVP (Must Have for Launch)

| Feature | Description | User Value |
|---------|-------------|------------|
| **Booking Widget** | Embeddable iframe/widget for any website | Customers book without calling |
| **Availability Rules** | Set working hours, buffer time, max advance booking | Owner controls schedule |
| **Service Types** | Define multiple services (duration, price, description) | Flexibility for different offerings |
| **Customer Form** | Name, phone, email, notes | Capture essential info |
| **Confirmation Emails** | Automated email to customer and business | Professional confirmation |
| **Basic Dashboard** | View upcoming appointments, mark complete/cancel | Simple management |
| **Free Tier Limit** | 10 bookings/month | Risk-free trial |

### P1 — Post-Launch (Next 30 Days)

| Feature | Description |
|---------|-------------|
| **SMS Reminders** | 24hr + 1hr automated reminders | Reduces no-shows 30%+ |
| **Google Calendar Sync** | Two-way sync | Fits existing workflow |
| **Payments/Deposits** | Stripe integration for pre-payment | Reduce no-shows, secure revenue |
| **Rescheduling** | Customer self-service reschedule | Reduces friction |
| **Facebook Integration** | "Book Now" button on FB page | Meet customers where they are |

### P2 — Future

| Feature | Description |
|---------|-------------|
| **Team Scheduling** | Multiple staff, individual calendars | Salons with multiple chairs |
| **Recurring Appointments** | Weekly/monthly repeats | Retainers, tutoring |
| **Waitlist** | Fill cancelled slots automatically | Maximize utilization |
| **Reviews/Ratings** | Post-appointment feedback | Social proof |
| **Analytics** | Booking trends, no-show rates | Business insights |
| **Mobile App** | iOS/Android for business owners | On-the-go management |

---

## 3. Technical Architecture

### Stack
| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | React 19 + Vite + Tailwind CSS | Fast, consistent with other projects |
| **Backend** | Firebase (Firestore, Auth, Functions) | Serverless, real-time, free tier |
| **Auth** | Firebase Auth (email/password, Google) | Secure, familiar |
| **Calendar** | date-fns + custom components | Lightweight, full control |
| **SMS** | Twilio API | Reliable, affordable |
| **Email** | Resend or SendGrid | Transactional emails |
| **Payments** | Stripe Connect | Industry standard |
| **Widget** | Vanilla JS embed script | Works on any website |

### Data Model

```typescript
// Business
interface Business {
  id: string;
  ownerId: string;
  name: string;
  slug: string; // unique URL identifier
  category: 'salon' | 'wellness' | 'pet' | 'consulting' | 'home' | 'other';
  address?: string;
  phone?: string;
  email: string;
  logoUrl?: string;
  timezone: string;
  settings: {
    bufferMinutes: number;
    minAdvanceHours: number;
    maxAdvanceDays: number;
  };
  plan: 'free' | 'pro' | 'business';
  bookingCount: number; // for free tier limit
  createdAt: Timestamp;
}

// Service
interface Service {
  id: string;
  businessId: string;
  name: string;
  durationMinutes: number;
  price?: number;
  description?: string;
  color: string;
  isActive: boolean;
  bufferAfterMinutes: number;
}

// Availability Rule
interface AvailabilityRule {
  id: string;
  businessId: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  startTime: string; // "HH:mm" format
  endTime: string;
  isActive: boolean;
}

// Appointment
interface Appointment {
  id: string;
  businessId: string;
  serviceId: string;
  serviceName: string; // denormalized for display
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNotes?: string;
  startTime: Timestamp;
  endTime: Timestamp;
  status: 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  paymentAmount?: number;
  reminderSent24h: boolean;
  reminderSent1h: boolean;
  createdAt: Timestamp;
}

// Blocked Time (lunch breaks, time off)
interface BlockedTime {
  id: string;
  businessId: string;
  startTime: Timestamp;
  endTime: Timestamp;
  reason?: string;
}
```

---

## 4. User Flow

### Business Onboarding (3 minutes)
1. **Sign up** → Email/password or Google
2. **Business profile** → Name, category, timezone
3. **First service** → Name, duration, price (optional)
4. **Set hours** → Default Mon-Fri 9-5, editable
5. **Get widget** → Copy embed code

### Customer Booking Flow
1. **Visit widget** → See available services
2. **Select service** → View description, duration, price
3. **Pick date/time** → Calendar shows only available slots
4. **Enter details** → Name, phone, email, notes
5. **Confirm** → Review booking, submit
6. **Confirmation** → Email sent, calendar invite attached

### Business Management Flow
1. **Dashboard** → See today's/upcoming appointments
2. **Add appointment** → Manual booking for phone-ins
3. **Block time** → Lunch, meetings, time off
4. **Edit settings** → Hours, services, notifications
5. **View analytics** → Booking count, popular services

---

## 5. UI/UX Specification

### Widget Layout (Customer View)
```
┌─────────────────────────────────────────┐
│  [Business Logo]                        │
│  Book Your Appointment                  │
├─────────────────────────────────────────┤
│                                         │
│  Select a Service:                      │
│  ┌─────────────┐ ┌─────────────┐       │
│  │ Haircut     │ │ Color       │       │
│  │ 45 min • $35│ │ 90 min • $75│       │
│  └─────────────┘ └─────────────┘       │
│                                         │
│  Choose Date:                           │
│  [ < ] February 2026 [ > ]              │
│  Su Mo Tu We Th Fr Sa                   │
│      16 17 18 19 20 21                  │
│  22 23 24 25 26 27 28                   │
│                                         │
│  Available Times — Thu, Feb 19          │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐           │
│  │9:00│ │10:30│ │1:00│ │2:30│           │
│  └────┘ └────┘ └────┘ └────┘           │
│                                         │
├─────────────────────────────────────────┤
│  Your Info:                             │
│  Name: [________________]               │
│  Phone: [________________]              │
│  Email: [________________]              │
│  Notes: [________________] (optional)   │
│                                         │
│  [      Confirm Booking      ]          │
└─────────────────────────────────────────┘
```

### Business Dashboard
```
┌──────────────────────────────────────────────────┐
│  Insta-Book                              [≡] 👤 │
├──────────────────────────────────────────────────┤
│  🏢 Main Street Barber                           │
│  Plan: Free (7/10 bookings this month)           │
├──────────────────────────────────────────────────┤
│  Today's Appointments                            │
│  ┌────────────────────────────────────────┐     │
│  │ 9:00 AM  Haircut    John D.  ✓ Done    │     │
│  │ 10:30 AM Beard Trim Sarah M. ⏳ Upcoming│    │
│  │ 2:00 PM  Haircut    Mike R.  ⏳ Upcoming│    │
│  └────────────────────────────────────────┘     │
│  [+ Add Appointment]  [View Calendar]            │
├──────────────────────────────────────────────────┤
│  Quick Actions                                   │
│  [Edit Services] [Set Hours] [Get Widget Code]   │
│  [Upgrade to Pro →]                              │
└──────────────────────────────────────────────────┘
```

### Design System
- **Primary:** Indigo (#4F46E5) — professional, trustworthy
- **Success:** Green (#10B981) — confirmations, available slots
- **Warning:** Amber (#F59E0B) — pending, reminders
- **Danger:** Red (#EF4444) — cancellations, conflicts
- **Background:** White/Gray-50
- **Cards:** White with shadow-sm
- **Border Radius:** rounded-lg (8px)
- **Typography:** Inter font family

---

## 6. API Endpoints (Firebase Functions)

### Booking API
```typescript
// Get available slots
GET /api/businesses/{slug}/availability
Query: serviceId, date (YYYY-MM-DD)
Response: { slots: ["09:00", "09:30", "10:00", ...] }

// Create booking
POST /api/bookings
Body: {
  businessId: string;
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startTime: ISOString;
  notes?: string;
}
Response: { bookingId: string; status: 'confirmed' }

// Cancel booking
POST /api/bookings/{id}/cancel
Body: { reason?: string }
```

### Business API
```typescript
// Update availability
POST /api/businesses/{id}/availability
Body: { rules: AvailabilityRule[] }

// Update services
POST /api/businesses/{id}/services
Body: { services: Service[] }

// Block time
POST /api/businesses/{id}/blocks
Body: { startTime, endTime, reason }
```

---

## 7. Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Businesses - owner only
    match /businesses/{businessId} {
      allow read: if true; // public for booking widget
      allow write: if request.auth != null && 
                     resource.data.ownerId == request.auth.uid;
    }
    
    // Services - public read, owner write
    match /services/{serviceId} {
      allow read: if true;
      allow write: if request.auth != null &&
                     get(/databases/$(database)/documents/businesses/$(request.resource.data.businessId)).data.ownerId == request.auth.uid;
    }
    
    // Appointments - customer (email match) or business owner
    match /appointments/{appointmentId} {
      allow read: if request.auth != null && (
        resource.data.customerEmail == request.auth.token.email ||
        get(/databases/$(database)/documents/businesses/$(resource.data.businessId)).data.ownerId == request.auth.uid
      );
      allow create: if true; // anyone can book
      allow update: if request.auth != null;
    }
  }
}
```

---

## 8. Performance Targets

| Metric | Target |
|--------|--------|
| Widget load time | < 1 second |
| Booking completion | < 30 seconds |
| Dashboard load | < 2 seconds |
| Availability check | < 500ms |
| Mobile responsive | All screens |
| Lighthouse Score | > 85 |

---

## 9. Analytics & Monitoring

### Track Events
- `widget_loaded`
- `service_selected`
- `date_selected`
- `booking_initiated`
- `booking_completed`
- `booking_cancelled`
- `dashboard_viewed`
- `settings_updated`

### Key Metrics
- Conversion rate (widget load → booking)
- No-show rate (with/without SMS reminders)
- Free-to-paid conversion
- Most popular services by category
- Peak booking times

---

## 10. Pricing Tiers

| Feature | Free | Pro ($19/mo) | Business ($49/mo) |
|---------|------|--------------|-------------------|
| Bookings/month | 10 | Unlimited | Unlimited |
| Services | 3 | Unlimited | Unlimited |
| SMS Reminders | ❌ | ✅ | ✅ |
| Google Calendar | ❌ | ✅ | ✅ |
| Payments | ❌ | ✅ | ✅ |
| Team Members | 1 | 1 | Unlimited |
| Priority Support | ❌ | Email | Phone + Email |

---

## 11. Success Criteria

### Launch Success (30 days)
- 20+ businesses registered
- 100+ bookings completed
- < 10% no-show rate (with SMS)
- 3+ businesses upgrade to Pro

### 90-Day Success
- 75+ active businesses
- 1,000+ monthly bookings
- 15+ Pro subscribers
- 3+ Business tier subscribers
- 1 SBDC or chamber partnership

---

## 12. Open Questions

1. Should we offer phone support for business tier?
2. Do we build native mobile apps or PWA only?
3. Should we integrate with Square for in-person payments?
4. Do we offer a "find a provider" marketplace directory?
5. Should appointments auto-confirm or require business approval?

---

**Status:** ✅ Phase 3 Complete — Ready for Phase 4 (Build Checklist)
