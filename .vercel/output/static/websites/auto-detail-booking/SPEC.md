# SPEC.md — Auto Detail Booking

**MVP:** auto-detail-booking  
**Version:** 1.0  
**Date:** 2026-02-18  
**Status:** Ready for implementation

---

## 1. Overview

### Purpose
A simple, affordable online booking system for auto detailing businesses in Ashtabula and similar small towns. Enables customers to book services 24/7 while helping detailers manage appointments and payments.

### Target Users
- **Primary:** Auto detail business owners (mobile and shop-based)
- **Secondary:** Vehicle owners seeking detailing services

### Success Criteria
- 5-minute setup for business owners
- <3 clicks to book for customers
- Payment collection at time of booking
- Automatic confirmations via SMS/email

---

## 2. Architecture

### Tech Stack
| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + Tailwind CSS |
| State | React Context + useReducer |
| Routing | React Router v6 |
| Payments | Stripe Elements |
| Calendar | date-fns + react-datepicker |
| Icons | Lucide React |
| Build | Vite |

### Data Model
```typescript
// Business Profile
interface Business {
  id: string;
  name: string;
  slug: string;
  type: 'mobile' | 'shop';
  phone: string;
  email: string;
  address?: string;
  serviceArea?: string[]; // for mobile
  hours: BusinessHours;
  services: Service[];
  stripeAccountId?: string;
}

// Service Package
interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  basePrice: number;
  priceModifiers: PriceModifier[];
}

// Price Modifier (vehicle size, add-ons)
interface PriceModifier {
  id: string;
  name: string;
  type: 'vehicle_size' | 'addon';
  priceAdjustment: number;
}

// Appointment
interface Appointment {
  id: string;
  businessId: string;
  customer: Customer;
  service: Service;
  modifiers: PriceModifier[];
  datetime: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
}

// Customer
interface Customer {
  name: string;
  phone: string;
  email: string;
  vehicle: Vehicle;
}

// Vehicle
interface Vehicle {
  make: string;
  model: string;
  year: number;
  size: 'compact' | 'midsize' | 'fullsize';
  color?: string;
}
```

---

## 3. Features

### MVP (Phase 1)
- [ ] Business profile setup wizard
- [ ] Service package configuration
- [ ] Public booking page (by business slug)
- [ ] Date/time slot selection
- [ ] Vehicle info collection
- [ ] Stripe payment integration
- [ ] Booking confirmation screen
- [ ] Basic admin dashboard

### Phase 2
- [ ] SMS/email notifications
- [ ] Calendar sync (Google/Outlook)
- [ ] Reschedule/cancel flow
- [ ] Customer management
- [ ] Analytics dashboard

### Phase 3
- [ ] Route optimization (mobile)
- [ ] Before/after photo gallery
- [ ] Review collection
- [ ] Multi-staff support
- [ ] Subscription/membership plans

---

## 4. User Flows

### Customer Booking Flow
```
1. Visit /book/:businessSlug
2. Select service package
3. Select vehicle size (affects price)
4. Select add-ons (optional)
5. Choose date → see available time slots
6. Select time slot
7. Enter vehicle details
8. Enter contact info
9. Review & pay (Stripe)
10. Confirmation page + email/SMS
```

### Business Owner Setup Flow
```
1. Visit /setup
2. Enter business details (name, type, contact)
3. Set operating hours
4. Configure service packages
5. Connect Stripe account
6. Get custom booking link
7. Optional: embed code for existing website
```

### Admin Dashboard Flow
```
1. Login → Dashboard overview
2. Today's appointments
3. Upcoming calendar
4. Customer list
5. Service settings
6. Payout/billing view
```

---

## 5. UI Components

### Pages
| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | LandingPage | Marketing + business signup CTA |
| `/setup` | SetupWizard | Business onboarding |
| `/book/:slug` | BookingPage | Customer booking flow |
| `/admin` | AdminDashboard | Business management |
| `/admin/calendar` | CalendarView | Appointment management |
| `/admin/customers` | CustomerList | Customer management |
| `/admin/settings` | SettingsPage | Business configuration |

### Shared Components
- `ServiceCard` — Display service package
- `TimeSlotPicker` — Available time selection
- `VehicleForm` — Vehicle info input
- `PaymentForm` — Stripe payment
- `BookingSummary` — Review before payment
- `ConfirmationView` — Post-booking success

---

## 6. API Endpoints (Future Backend)

```
GET    /api/businesses/:slug          # Public business info
POST   /api/appointments              # Create booking
GET    /api/appointments/:id          # Get booking details
PATCH  /api/appointments/:id/cancel   # Cancel booking
POST   /api/availability              # Check available slots

# Admin (authenticated)
GET    /api/admin/appointments        # List appointments
PATCH  /api/admin/appointments/:id    # Update appointment
GET    /api/admin/customers           # List customers
GET    /api/admin/payouts             # Payment history
```

---

## 7. Implementation Phases

### Week 1: Core Booking Flow
- Business profile data structure
- Service configuration UI
- Public booking page shell
- Date/time selection

### Week 2: Payments & Confirmation
- Stripe integration
- Payment form
- Booking confirmation
- Basic admin view

### Week 3: Polish & Notifications
- Email confirmations (SendGrid)
- SMS reminders (Twilio)
- UI polish
- Mobile responsiveness

### Week 4: Launch Prep
- Testing
- Documentation
- Sample business setup
- Deployment

---

## 8. Open Questions

1. Should we support multi-day ceramic coating bookings?
2. Deposit vs full payment at booking?
3. Gratuity/tipping integration?
4. Photo upload for damage assessment?
5. Integration with existing shop management software?
