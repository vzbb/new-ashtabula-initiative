# SPEC.md — Harvest Alert
**Project:** Harvest Alert — Crop Readiness Notification System  
**Version:** 1.0  
**Date:** February 18, 2026  
**Status:** Ready for Implementation  

---

## 1. Product Overview

### One-Sentence Description
A lightweight notification system that connects Ashtabula County farms with customers via SMS/email alerts when specific crops are ready for harvest.

### Problem Statement
Farmers lose revenue to missed harvest windows and repetitive customer inquiries. Customers miss short-season crops due to unreliable information channels. There is no lightweight tool designed specifically for "harvest timing" communication.

### Solution
A mobile-first web application where farmers update crop status in seconds, and customers receive instant alerts for the crops they care about.

### Target Users
- **Primary:** Small-scale vegetable farmers (5-20 acres) in Ashtabula County
- **Secondary:** U-pick customers, CSA subscribers, local restaurants

---

## 2. Success Metrics

### Launch Metrics (Month 1-3)
| Metric | Target | Measurement |
|--------|--------|-------------|
| Farmers onboarded | 3-5 | Active crop updates |
| Customer subscribers | 200-500 | Verified phone/email |
| Alert open rate | >50% | SMS read receipts |
| Farmer update time | <5 min | In-app tracking |

### Growth Metrics (Month 6-12)
| Metric | Target | Measurement |
|--------|--------|-------------|
| Active farms | 20-50 | Weekly updates |
| Total subscribers | 2,000-5,000 | Cumulative |
| Monthly recurring revenue | $500-1,000 | Paid tiers |
| Customer satisfaction | >4.0/5 | Monthly survey |

---

## 3. Technology Stack

### Core Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        Vercel Edge                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Next.js App │  │  API Routes  │  │  Serverless  │        │
│  │   (React)    │  │  (tRPC/REST) │  │   Functions  │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │  Supabase   │ │   Twilio    │ │  Open-Meteo │
    │ (Postgres + │ │    (SMS)    │ │  (Weather)  │
    │    Auth)    │ │             │ │             │
    └─────────────┘ └─────────────┘ └─────────────┘
```

### Technology Choices

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | Next.js 14 (App Router) | Server components, API routes, optimal for Vercel |
| **Language** | TypeScript | Type safety, developer experience |
| **Styling** | Tailwind CSS | Rapid UI development, consistent design system |
| **Components** | shadcn/ui | Accessible, customizable, modern aesthetic |
| **Database** | Supabase PostgreSQL | Managed Postgres, realtime, auth included |
| **ORM** | Prisma | Type-safe database queries, migrations |
| **Auth** | Supabase Auth | Magic link + phone OTP, social providers |
| **SMS** | Twilio | Reliable, good docs, pay-as-you-go |
| **Email** | Resend | Modern API, generous free tier |
| **Weather** | Open-Meteo | Free, no key needed, GDD calculations |
| **Maps** | Leaflet | Open source, no API key needed |
| **Hosting** | Vercel | Edge network, zero-config deployments |
| **Monitoring** | Sentry | Error tracking, performance monitoring |

---

## 4. Database Schema

### Core Tables

```sql
-- Farms (tenants)
create table farms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null, -- URL-friendly name
  description text,
  address text,
  location point, -- lat/lng for map
  phone text,
  email text,
  website text,
  logo_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  plan_tier text default 'free', -- free, grower, cooperative
  stripe_customer_id text,
  stripe_subscription_id text
);

-- Crops (per farm)
create table crops (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references farms(id) on delete cascade,
  name text not null, -- "Sweet Corn", "Strawberries"
  category text, -- "vegetable", "fruit", "herb"
  description text,
  typical_start_month int, -- 6 = June
  typical_end_month int, -- 9 = September
  gdd_base_temp int default 50, -- Growing Degree Day base
  gdd_target int, -- GDD to maturity
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Crop Status (current state)
create type crop_status as enum ('not_ready', 'almost_ready', 'ready', 'harvesting', 'finished');

create table crop_status_updates (
  id uuid primary key default gen_random_uuid(),
  crop_id uuid references crops(id) on delete cascade,
  farm_id uuid references farms(id) on delete cascade,
  status crop_status not null,
  message text, -- Optional custom message
  predicted_ready_date date, -- AI/weather prediction
  quantity_available text, -- "Plenty", "Limited", "U-pick only"
  price_note text, -- "$6/dozen", "Market price"
  updated_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Subscribers (customers)
create table subscribers (
  id uuid primary key default gen_random_uuid(),
  phone text, -- E.164 format (+1234567890)
  email text,
  preferred_contact text default 'sms', -- sms, email, both
  zip_code text,
  created_at timestamptz default now(),
  verified_at timestamptz,
  unsubscribed_at timestamptz,
  verified boolean default false
);

-- Subscription preferences (many-to-many)
create table subscriber_preferences (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid references subscribers(id) on delete cascade,
  farm_id uuid references farms(id) on delete cascade,
  crop_id uuid references crops(id) on delete cascade, -- null = all crops from farm
  alert_types text[] default array['ready'], -- ready, almost_ready, finished
  quiet_hours_start time default '22:00',
  quiet_hours_end time default '08:00',
  created_at timestamptz default now()
);

-- Alerts sent (audit log)
create table alerts (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references farms(id),
  crop_id uuid references crops(id),
  status_update_id uuid references crop_status_updates(id),
  subscriber_id uuid references subscribers(id),
  channel text not null, -- sms, email
  content text not null,
  sent_at timestamptz default now(),
  delivered_at timestamptz,
  opened_at timestamptz,
  twilio_sid text,
  resend_id text
);

-- Weather cache (for GDD calculations)
create table weather_data (
  id uuid primary key default gen_random_uuid(),
  location point not null,
  date date not null,
  temp_max decimal,
  temp_min decimal,
  temp_avg decimal,
  gdd_accumulated decimal,
  source text default 'open-meteo',
  fetched_at timestamptz default now(),
  unique(location, date)
);

-- Users (farmers/admins)
create table users (
  id uuid references auth.users(id) primary key,
  email text,
  full_name text,
  farm_id uuid references farms(id), -- null = admin/no farm
  role text default 'farmer', -- farmer, admin, viewer
  created_at timestamptz default now()
);
```

### Indexes
```sql
-- Performance indexes
create index idx_crops_farm_id on crops(farm_id);
create index idx_crop_status_updates_farm_id on crop_status_updates(farm_id);
create index idx_crop_status_updates_crop_id on crop_status_updates(crop_id);
create index idx_subscriber_preferences_subscriber_id on subscriber_preferences(subscriber_id);
create index idx_subscriber_preferences_farm_id on subscriber_preferences(farm_id);
create index idx_alerts_farm_id on alerts(farm_id);
create index idx_alerts_subscriber_id on alerts(subscriber_id);
create index idx_alerts_sent_at on alerts(sent_at);
create index idx_weather_data_location_date on weather_data(location, date);
```

---

## 5. API Design

### Authentication
- **Magic Link** for email login
- **Phone OTP** for farmer quick login
- **Session-based** with Supabase Auth

### Core Endpoints

#### Farmer API
```typescript
// POST /api/farms - Create farm (admin only)
// GET /api/farms/[id] - Get farm details
// PATCH /api/farms/[id] - Update farm

// POST /api/farms/[id]/crops - Add crop
// GET /api/farms/[id]/crops - List crops
// PATCH /api/crops/[id] - Update crop

// POST /api/crops/[id]/status - Update crop status (triggers alerts)
// GET /api/farms/[id]/status - Get all current statuses

// GET /api/farms/[id]/subscribers - List subscribers
// GET /api/farms/[id]/analytics - Open rates, subscriber growth
```

#### Customer/Public API
```typescript
// GET /api/farms - List all active farms
// GET /api/farms/[slug] - Get farm public profile
// GET /api/farms/[slug]/status - Get public crop statuses

// POST /api/subscribe - Subscribe to alerts
// POST /api/unsubscribe - Unsubscribe
// POST /api/verify - Verify phone/email

// GET /api/nearby - Find farms near location
```

#### Webhooks
```typescript
// POST /api/webhooks/twilio - SMS delivery status
// POST /api/webhooks/resend - Email delivery status
```

---

## 6. User Interface

### Farmer Dashboard (Mobile-First)

```
┌─────────────────────────────┐
│  Harvest Alert      ≡ [👤]  │
├─────────────────────────────┤
│  Peters Creek Farm          │
│  🟢 Active • 127 subscribers│
├─────────────────────────────┤
│  QUICK UPDATE               │
│  ┌─────────────────────┐    │
│  │ Sweet Corn    [Ready▼]    │
│  │ 📝 Add note...      │    │
│  │ [Send Alert]        │    │
│  └─────────────────────┘    │
├─────────────────────────────┤
│  YOUR CROPS                 │
│  🌽 Sweet Corn       Ready  │
│  🍓 Strawberries  Not Ready │
│  🍅 Tomatoes    Almost Ready│
│  [+ Add Crop]               │
├─────────────────────────────┤
│  RECENT ALERTS              │
│  Sweet Corn → 127 sent      │
│  2 min ago • 89% opened     │
├─────────────────────────────┤
│  [📊] [⚙️] [🌾]            │
└─────────────────────────────┘
```

### Customer Signup Flow

```
┌─────────────────────────────┐
│  Get Farm Fresh Alerts 🌾   │
├─────────────────────────────┤
│  Select your favorite farms │
│  [☑️] Peters Creek Farm     │
│  [☑️] Harbor Gardens        │
│  [ ] Blueberry Hill         │
├─────────────────────────────┤
│  Pick crops to track:       │
│  [☑️] Strawberries          │
│  [☑️] Sweet Corn            │
│  [☑️] Tomatoes              │
│  [ ] Blueberries            │
├─────────────────────────────┤
│  Phone: [____________]      │
│  Email:  [____________]     │
│  Zip:    [____]             │
├─────────────────────────────┤
│  [Get Alerts]               │
│                             │
│  Unsubscribe anytime.       │
│  We never share your info.  │
└─────────────────────────────┘
```

### Key Screens

| Screen | Purpose | Priority |
|--------|---------|----------|
| **Farmer Dashboard** | Update crop status | P0 |
| **Crop Management** | Add/edit crops | P0 |
| **Subscriber List** | View/manage subscribers | P1 |
| **Analytics** | Alert performance | P1 |
| **Customer Signup** | Subscribe to alerts | P0 |
| **Farm Directory** | Discover farms | P1 |
| **Farm Public Page** | View crop statuses | P1 |

---

## 7. Feature Phases

### Phase 1: MVP (Weeks 1-4)
**Goal:** Single farm pilot with core functionality

**Features:**
- [ ] Farmer auth (magic link + phone OTP)
- [ ] Farm profile setup
- [ ] Crop CRUD (5 pre-defined crops)
- [ ] Status update (Ready/Not Ready)
- [ ] SMS alerts via Twilio
- [ ] Customer signup form
- [ ] Basic subscriber management
- [ ] Manual status updates only

**Success Criteria:**
- 1 farm actively updating
- 50+ subscribers receiving alerts
- <2 min status update time

### Phase 2: Grow (Weeks 5-8)
**Goal:** Multi-farm support with enhanced features

**Features:**
- [ ] Multiple farms (up to 5)
- [ ] Email alerts (Resend)
- [ ] Customer preferences (crop selection)
- [ ] Farm directory page
- [ ] Public farm profiles
- [ ] Alert scheduling ("ready tomorrow")
- [ ] Basic analytics (open rates)
- [ ] Quiet hours

**Success Criteria:**
- 3-5 farms onboarded
- 200+ total subscribers
- >40% alert open rate

### Phase 3: Scale (Weeks 9-12)
**Goal:** Production-ready with automation

**Features:**
- [ ] Weather integration (GDD predictions)
- [ ] Automated "almost ready" predictions
- [ ] Payment tiers (Stripe)
- [ ] Map view of farms
- [ ] Advanced analytics dashboard
- [ ] Export subscriber lists
- [ ] API for integrations
- [ ] iOS/Android PWA

**Success Criteria:**
- 10+ farms on platform
- 1,000+ subscribers
- Revenue from paid tiers

### Phase 4: Ecosystem (Future)
**Goal:** Regional expansion and advanced features

**Features:**
- [ ] Multi-county support
- [ ] Wholesale buyer features
- [ ] Inventory tracking
- [ ] Marketplace integration
- [ ] White-label option
- [ ] Farm management tools

---

## 8. Technical Constraints

### Performance Requirements
- Page load: <2 seconds (3G)
- Status update: <5 seconds
- Alert delivery: <30 seconds
- API response: <200ms (p95)

### Scalability Limits (MVP)
- Farms: 50
- Subscribers per farm: 1,000
- Concurrent updates: 10/second
- SMS rate: 100/minute (Twilio)

### Security Requirements
- Phone numbers encrypted at rest
- HTTPS only
- CSRF protection
- Rate limiting: 100 req/min per IP
- Input sanitization (XSS prevention)

---

## 9. Integration Points

### External Services
| Service | Integration | Data Flow |
|---------|-------------|-----------|
| **Twilio** | SMS send/receive | Out: alerts, In: opt-out replies |
| **Resend** | Email delivery | Out: email alerts, confirmations |
| **Open-Meteo** | Weather data | In: forecasts, GDD calculations |
| **Supabase Auth** | User management | In/Out: sessions, profiles |
| **Stripe** | Payments (P3) | In: subscriptions, Out: webhooks |
| **Sentry** | Error tracking | Out: errors, performance |

### Data Sync
- **Weather:** Daily cache refresh, GDD recalculation
- **Subscribers:** Realtime sync with preferences
- **Alerts:** Async queue for SMS/email batching

---

## 10. Deployment Architecture

### Environments
| Environment | URL | Database | Purpose |
|-------------|-----|----------|---------|
| **Production** | harvestalert.app | Supabase Prod | Live users |
| **Staging** | staging.harvestalert.app | Supabase Staging | Pre-release testing |
| **Preview** | *.vercel.app | Supabase Branch | PR previews |

### CI/CD Pipeline
```
Git Push → GitHub Actions → Tests → Build → Deploy to Vercel
                                 ↓
                         Database Migrations (Prisma)
```

### Monitoring
- **Errors:** Sentry
- **Performance:** Vercel Analytics
- **Uptime:** Upptime (GitHub Actions)
- **SMS Delivery:** Twilio Console
- **Database:** Supabase Dashboard

---

## 11. Open Questions

| Question | Impact | Status |
|----------|--------|--------|
| Harbor Gardens partnership confirmed? | Pilot launch | Pending Michael |
| Anchor farm committed? | MVP validation | Pending outreach |
| SMS opt-in compliance workflow? | Legal | Research needed |
| GDD accuracy for NE Ohio? | Feature quality | Validate with Extension |

---

*SPEC.md Complete — Ready for BUILD_CHECKLIST.md implementation planning.*
