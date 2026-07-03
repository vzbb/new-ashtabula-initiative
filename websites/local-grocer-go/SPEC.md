# SPEC.md — Local Grocer Go
**Project:** Ashtabula Local Grocery Click & Collect Platform  
**Date:** 2026-02-20  
**Status:** Phase 3 Complete — Ready for Implementation  
**Previous:** Phase 1 Research, Phase 2 Resources

---

## 1. Executive Summary

**Concept:** A simplified Click & Collect platform connecting Ashtabula County residents with local grocery staples from independent grocers (Sander's Market, Save A Lot) and local food producers via Harbor Gardens.

**Target Users:**
- Rural residents 10+ miles from grocery stores
- Seniors needing simplified ordering
- Local-food-conscious consumers
- SNAP recipients (Phase 2)

**Key Differentiators:**
- No account required (phone + SMS confirmation)
- Local-first (prioritizes independent grocers and county producers)
- Curated staples only (reduces decision fatigue)
- Senior-friendly (large text, minimal steps)

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Customer    │  │   Store      │  │   Admin      │  │   Driver     │    │
│  │  Web App     │  │   Dashboard  │  │   Panel      │  │   App        │    │
│  │  (React)     │  │   (React)    │  │   (React)    │  │   (PWA)      │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER (Node.js/Express)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │   Orders    │ │   Stores    │ │  Inventory  │ │   Users     │           │
│  │   API       │ │    API      │ │     API     │ │   (Phone)   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                           │
│  │   Slots     │ │  Payments   │ │    SMS      │                           │
│  │   API       │ │   (Stripe)  │ │   (Twilio)  │                           │
│  └─────────────┘ └─────────────┘ └─────────────┘                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │   PostgreSQL     │  │     Redis        │  │    Firebase      │          │
│  │   (Primary DB)   │  │  (Sessions/Cache)│  │   (Auth/Storage) │          │
│  │   - Orders       │  │  - Cart TTL      │  │   - Product Img  │          │
│  │   - Stores       │  │  - Slot Locks    │  │   - User Auth    │          │
│  │   - Inventory    │  │  - Rate Limiting │  │                  │          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│  │  Stripe  │  │  Twilio  │  │  SendGrid│  │   NOAA   │                     │
│  │ Payments │  │ SMS/Voice│  │  Email   │  │ Weather  │                     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Frontend** | React 18 + Vite | Fast dev, small bundle, senior-friendly UX focus |
| **State** | Zustand | Lightweight, no boilerplate |
| **Styling** | Tailwind CSS | Rapid UI development, accessible defaults |
| **Backend** | Node.js + Express | Mature, Stripe/Twilio SDK support |
| **Database** | PostgreSQL 15 | ACID for inventory/orders, JSON support |
| **Cache** | Redis | Cart sessions, slot locking, rate limiting |
| **Auth** | Firebase Auth (phone) | SMS verification built-in |
| **Storage** | Firebase Storage | Product images, store logos |
| **Payments** | Stripe | 2.9% + $0.30, excellent APIs |
| **SMS** | Twilio | Reliable, good deliverability |
| **Hosting** | Railway/Render | Simple deploy, auto-scaling |
| **Monitoring** | Sentry + Logtail | Error tracking, log aggregation |

---

## 4. Data Models

### Store
```typescript
interface Store {
  id: string;
  name: string;                    // "Sander's Market - Jefferson"
  type: 'independent' | 'chain' | 'producer-hub';
  address: {
    street: string;
    city: string;
    zip: string;
    lat: number;
    lng: number;
  };
  phone: string;
  hours: {
    pickup: {                      // When customers can collect
      monday: { open: string; close: string } | null;
      // ... tuesday-sunday
    };
    delivery?: {                   // Future: local delivery
      monday: { open: string; close: string } | null;
    };
  };
  logo_url: string;
  description: string;
  is_active: boolean;
  fulfillment_type: 'store-staff' | 'owner-managed';
  stripe_account_id?: string;      // For express payouts
  created_at: Date;
  updated_at: Date;
}
```

### Product
```typescript
interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string;
  category: 'eggs' | 'dairy' | 'bread' | 'meat' | 'produce' | 'pantry' | 'local-specialty';
  price_cents: number;             // Store sets price
  unit: 'each' | 'lb' | 'dozen' | 'gallon' | 'pack';
  image_url: string;
  is_local: boolean;               // Highlight local producers
  is_organic: boolean;
  is_snap_eligible: boolean;       // Future: SNAP integration
  inventory_count: number | null;  // null = unlimited/tracked elsewhere
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}
```

### Order
```typescript
interface Order {
  id: string;                      // Short code: "GG-ABC123"
  store_id: string;
  customer: {
    phone: string;                 // E.164 format
    name: string;
    car_description?: string;      // "Blue Honda Accord" for pickup
  };
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked-up' | 'cancelled';
  pickup_slot: {
    date: string;                  // YYYY-MM-DD
    time_start: string;            // HH:MM (24h)
    time_end: string;
  };
  payment: {
    method: 'card' | 'cash' | 'snap';
    stripe_payment_intent_id?: string;
    subtotal_cents: number;
    tax_cents: number;
    total_cents: number;
    platform_fee_cents: number;    // 5% or flat $1.99
  };
  sms_notifications: {
    confirmed_sent: boolean;
    ready_sent: boolean;
    reminder_sent: boolean;
  };
  notes?: string;                  // Customer special requests
  cancelled_at?: Date;
  cancelled_reason?: string;
  created_at: Date;
  updated_at: Date;
}

interface OrderItem {
  product_id: string;
  product_name: string;            // Snapshot at order time
  quantity: number;
  unit_price_cents: number;        // Snapshot at order time
  subtotal_cents: number;
}
```

### Pickup Slot
```typescript
interface PickupSlot {
  id: string;
  store_id: string;
  date: string;                    // YYYY-MM-DD
  time_start: string;              // HH:MM
  time_end: string;
  capacity: number;                // Max orders per slot
  booked: number;                  // Current bookings
  is_available: boolean;           // Manual override
  cutoff_hours: number;            // Hours before slot to allow booking (default: 2)
}
```

---

## 5. API Endpoints

### Customer API
```
GET  /api/v1/stores                    # List active stores
GET  /api/v1/stores/:id                # Store details + hours
GET  /api/v1/stores/:id/products       # Available products
GET  /api/v1/stores/:id/slots          # Available pickup slots

POST /api/v1/orders                    # Create order
GET  /api/v1/orders/:id                # Get order status
PUT  /api/v1/orders/:id/cancel         # Cancel order (if allowed)
```

### Store Dashboard API
```
GET  /api/v1/store-admin/orders        # List orders (filter by status/date)
GET  /api/v1/store-admin/orders/:id    # Order details
PUT  /api/v1/store-admin/orders/:id/status  # Update status

GET  /api/v1/store-admin/products      # Manage products
POST /api/v1/store-admin/products
PUT  /api/v1/store-admin/products/:id
DELETE /api/v1/store-admin/products/:id

GET  /api/v1/store-admin/slots         # Manage pickup slots
POST /api/v1/store-admin/slots/bulk    # Generate slots for date range
PUT  /api/v1/store-admin/slots/:id
```

### Webhooks
```
POST /webhooks/stripe                  # Payment events
POST /webhooks/twilio                  # SMS delivery status
```

---

## 6. Frontend Component Hierarchy

```
src/
├── components/
│   ├── ui/                    # Reusable primitives
│   │   ├── Button.tsx         # Large, accessible buttons
│   │   ├── Input.tsx          # Phone input with formatting
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   │
│   ├── customer/              # Customer-facing
│   │   ├── StoreSelector.tsx  # Choose Sander's vs Harbor Gardens
│   │   ├── ProductGrid.tsx    # Category-filtered products
│   │   ├── CartDrawer.tsx     # Slide-out cart
│   │   ├── SlotPicker.tsx     # Calendar + time slots
│   │   ├── PhoneInput.tsx     # Intl phone with validation
│   │   ├── OrderSummary.tsx   # Checkout review
│   │   └── OrderTracker.tsx   # Status page for existing orders
│   │
│   ├── store-dashboard/       # Store management
│   │   ├── OrderQueue.tsx     # Incoming orders (Kanban)
│   │   ├── ProductManager.tsx
│   │   ├── SlotManager.tsx
│   │   └── AnalyticsView.tsx
│   │
│   └── shared/
│       ├── Header.tsx
│       └── Footer.tsx
│
├── pages/
│   ├── customer/
│   │   ├── Home.tsx           # Store selection
│   │   ├── Shop.tsx           # Browse products
│   │   ├── Cart.tsx           # Review + checkout
│   │   ├── Track.tsx          # Order lookup by phone
│   │   └── Confirmation.tsx   # Post-order success
│   │
│   └── store/
│       ├── Login.tsx
│       ├── Dashboard.tsx
│       └── Settings.tsx
│
├── hooks/
│   ├── useCart.ts
│   ├── useStore.ts
│   └── useOrder.ts
│
└── lib/
    ├── api.ts
    ├── stripe.ts
    └── sms.ts
```

---

## 7. Key User Flows

### Flow 1: Customer Order (No Account)
```
1. Visit site → See store selection (Sander's, Harbor Gardens, etc.)
2. Select store → Browse curated staples by category
3. Add items → Cart accumulates (stored in localStorage + Redis)
4. Tap cart → Review items, see subtotal
5. Checkout → Enter phone number → SMS verification code
6. Verify → Enter name + car description
7. Pick slot → Calendar shows available pickup times
8. Pay → Stripe Checkout (card) or select "Pay at pickup" (cash)
9. Confirm → SMS sent with order code (GG-ABC123) + pickup time
10. Track → Page shows real-time status (confirmed → preparing → ready)
```

### Flow 2: Store Fulfillment
```
1. Store staff logs into dashboard
2. Sees incoming orders in queue (sorted by pickup time)
3. Taps order → See items, customer info, car description
4. Gathers items → Marks "preparing" → Customer gets SMS
5. Items ready → Marks "ready" → Customer gets "ready for pickup" SMS
6. Customer arrives → Staff verifies order code → Marks "picked-up"
```

### Flow 3: Order Lookup (Returning Customer)
```
1. Customer visits /track
2. Enters phone number → SMS code verification
3. Sees all active orders with status
4. Can view details or cancel (if before cutoff)
```

---

## 8. SMS Notification Flow

| Trigger | SMS Content | Timing |
|---------|-------------|--------|
| Order Confirmed | "Your Local Grocer Go order GG-ABC123 is confirmed. Pickup: Today 4-5pm at Sander's Market. Reply STOP to cancel." | Immediate |
| Order Preparing | "Good news! We're gathering your order GG-ABC123 now. We'll text when it's ready." | Staff marks preparing |
| Order Ready | "Your order GG-ABC123 is ready! Come to Sander's Market pickup counter. We're holding it until 6pm." | Staff marks ready |
| Pickup Reminder | "Reminder: Your order GG-ABC123 is ready for pickup at Sander's Market until 6pm today." | 30 min before hold expires |
| Cancellation | "Your order GG-ABC123 has been cancelled. Refund processing (if applicable)." | On cancel |

---

## 9. Business Model & Pricing

### Revenue Model: Hybrid Fee Structure

| Plan | Monthly Fee | Per-Order Fee | Best For |
|------|-------------|---------------|----------|
| **Starter** | $0 | 5% of order | Testing, low volume |
| **Growth** | $49/mo | 2.5% | Regular use (10+ orders/week) |
| **Pro** | $99/mo | 0% | High volume (50+ orders/week) |

### Customer Fees
- **No service fee** for customer (absorbed by platform cut)
- **No markup** on products (store keeps 100% of product price)
- **Optional:** Delivery fee ($3.99) if local delivery added later

### Store Payouts
- Daily automatic transfer via Stripe Connect
- Store receives: Order total - platform fee
- Example: $50 order on Starter plan → Store gets $47.50

### Cost Estimates (Monthly)
| Item | Cost |
|------|------|
| Railway/Render hosting | $25 |
| PostgreSQL (managed) | $15 |
| Redis | $10 |
| Twilio SMS (~500 msgs) | $25 |
| Stripe fees (passed to stores) | $0 |
| Sentry/Monitoring | $15 |
| **Total Fixed** | **~$90/mo** |

---

## 10. Security Considerations

### Data Protection
- Phone numbers hashed in logs
- PCI compliance via Stripe (no card data touches our servers)
- HTTPS everywhere (Let's Encrypt)
- Rate limiting: 10 SMS verifications per phone per hour

### Order Integrity
- Inventory locks during checkout (Redis TTL 10 min)
- Idempotency keys on order creation
- Webhook signature verification (Stripe/Twilio)

### Store Access
- Email + password auth for store dashboard
- 2FA optional (TOTP)
- Role-based: owner, manager, staff

---

## 11. Implementation Phases

### Phase 1: MVP Core (Weeks 1-4)
- [ ] Customer web app (browse, cart, checkout)
- [ ] Phone verification + SMS notifications
- [ ] Single store pilot (Sander's Market)
- [ ] Basic store dashboard (orders, status updates)
- [ ] Stripe payment integration
- [ ] Order tracking page

**Success Criteria:** 10 orders processed end-to-end

### Phase 2: Multi-Store + Polish (Weeks 5-8)
- [ ] Harbor Gardens integration (producer hub)
- [ ] Store onboarding flow
- [ ] Product image upload
- [ ] Slot management UI
- [ ] Analytics dashboard (order volume, popular items)
- [ ] Customer feedback collection

**Success Criteria:** 3 stores active, 100 orders/month

### Phase 3: Scale + SNAP (Weeks 9-12)
- [ ] SNAP/EBT integration (via authorized partner)
- [ ] Delivery option (local drivers)
- [ ] Subscription boxes (weekly staples)
- [ ] iOS/Android apps (PWA wrapper)
- [ ] Marketing integrations (Facebook, Google)

**Success Criteria:** 10+ stores, 500 orders/month, SNAP live

---

## 12. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Stores won't adopt | Medium | Critical | Free pilot, no commitment, easy onboarding |
| Low customer awareness | Medium | High | Partner with CVB, local FB groups, library flyers |
| SNAP integration complexity | Medium | Medium | Defer to Phase 3, partner with authorized retailer |
| Inventory sync issues | Medium | Medium | Manual inventory entry MVP, automated later |
| Payment disputes | Low | Medium | Clear refund policy, Stripe dispute handling |
| Senior tech adoption | Medium | Medium | Phone-based support, simple UX, family assistance |

---

## 13. Next Steps

### Immediate (This Week)
1. **Confirm pilot store** — Contact Sander's Market owner
2. **Stripe account** — Apply for platform account
3. **Domain** — Register localgrocer.go or similar
4. **Twilio** — Set up phone number for SMS

### Week 1-2
1. Scaffold React + Node project
2. Build customer browse + cart flow
3. Implement phone verification
4. Create basic store dashboard

### Week 3-4
1. Stripe integration
2. SMS notification pipeline
3. Pilot testing with 5 beta customers
4. Iterate based on feedback

---

**Document Status:** Phase 3 Complete  
**Ready for:** Implementation (Phase 4)  
**Priority Integration:** Sander's Market (Jefferson) or Harbor Gardens
