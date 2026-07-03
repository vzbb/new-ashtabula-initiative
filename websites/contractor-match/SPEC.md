# Contractor Match — Build Specification v1.0
**AI-powered contractor discovery and quote management platform for Ashtabula County.**

**Document Version:** 1.0  
**Date:** 2026-02-17  
**Status:** Ready for Phase 1 Implementation  
**Estimated Build Time:** 6-8 hours (Phase 1), 4-6 hours (Phase 2)  
**Prerequisites:** Phase 1 Research Complete ✅

---

## 1. Product Overview

### 1.1 Mission
Connect Ashtabula County homeowners with verified, local contractors through an AI-powered matching engine that prioritizes trust, transparency, and community accountability.

### 1.2 Target Users
| User Type | Needs | Pain Points |
|-----------|-------|-------------|
| **Homeowners** | Find reliable contractors, compare quotes, track projects | Can't verify licenses, afraid of scams, no quote comparison |
| **Contractors** | Qualified leads, payment protection, reputation building | Expensive lead services, tire-kickers, payment disputes |
| **City of Ashtabula** | Economic development, permit compliance, resident satisfaction | No visibility into contractor activity, resident complaints |

### 1.3 Key Differentiators
1. **Municipal Partnership Badge** — City endorsement no competitor has
2. **Level 2 Verification** — License, insurance, background check documentation
3. **AI Project Classification** — Smart intake wizard categorizes projects automatically
4. **Quote Comparison** — Side-by-side contractor bids with standardized breakdowns
5. **Community Accountability** — Three-strike policy for contractors, moderated reviews

---

## 2. Core Features

### 2.1 Feature Matrix (MVP vs Full)

| Feature | MVP (Phase 1) | Full Build | Notes |
|---------|---------------|------------|-------|
| **Homeowner Project Intake** | ✅ AI wizard (8 categories) | ✅ + Photo upload, voice description | 8 project types cover 80% of needs |
| **Contractor Matching** | ✅ Rule-based scoring | ✅ + ML match scoring | Rule-based sufficient for MVP |
| **Quote Comparison** | ✅ Manual entry display | ✅ + Standardized line items | Side-by-side view in MVP |
| **In-App Messaging** | ✅ Basic chat | ✅ + SMS fallback | Socket.io for real-time |
| **Review System** | ✅ Post-project reviews | ✅ + Photo evidence | Moderated to prevent bombing |
| **Verification Badges** | ✅ Level 2 (document upload) | ✅ + Level 3 (API verification) | Manual review for MVP |
| **Payment/Escrow** | ❌ Direct payment | ✅ Stripe Connect escrow | Phase 2 addition |
| **E-Sign Contracts** | ❌ External contracts | ✅ DocuSign integration | Phase 2 addition |
| **Service Area Maps** | ✅ Zip code based | ✅ + Mapbox polygon areas | Radius + manual zones |
| **SMS Notifications** | ✅ Twilio integration | ✅ + Push notifications | Critical for contractor response |

### 2.2 Project Intake Wizard (8 Categories)

**Step 1: Project Category Selection**
```
┌─────────────────────────────────────────────────────────┐
│  What type of project do you need help with?            │
├─────────────────────────────────────────────────────────┤
│  🏠 Renovation    🔧 Repair      🎨 Painting            │
│  🚿 Plumbing      ⚡ Electrical  ❄️ HVAC                │
│  🌳 Landscaping   🏗️ New Build   ❓ Not Sure            │
└─────────────────────────────────────────────────────────┘
```

**Step 2: Conditional Questions (per category)**

| Category | Questions | License Required? |
|----------|-----------|-------------------|
| Renovation | Room, square footage, budget range, timeline | Depends (structural = yes) |
| Repair | Urgency (emergency/standard), description, photos | Depends |
| Painting | Interior/exterior, rooms, square footage | No |
| Plumbing | Type (leak/install/repair), fixture, emergency? | Yes (state licensed) |
| Electrical | Type (outlet/panel/lighting), amperage | Yes (state licensed) |
| HVAC | Type (heat/AC/ventilation), system age | Yes (state licensed) |
| Landscaping | Type (lawn/hardscape/tree), property size | No |
| New Build | Project type, budget, timeline, permits? | Yes (general contractor) |

**Step 3: Location & Contact**
- Address (for service area matching)
- Preferred contact method (call/text/email)
- Best time to reach
- Budget range (optional but recommended)

**Step 4: AI Summary & Confirmation**
- Generated project summary
- Suggested contractor count ("3-5 contractors available")
- Estimated timeline for quotes

### 2.3 Contractor Verification System

**Three-Tier Verification:**

| Tier | Requirements | Badge | Display Priority |
|------|--------------|-------|------------------|
| **Level 1: Basic** | Email, phone, profile complete | 🟡 Basic | Standard |
| **Level 2: Verified** | + License doc, insurance COI, background check | 🟢 Verified | Boosted +25% |
| **Level 3: City Partner** | + City endorsement, permit history | 🔵 City Partner | Boosted +50%, "Featured" |

**Document Upload Requirements (Level 2):**
- Ohio OCILB license (for regulated trades) OR
- Business registration (for handyman tier)
- Certificate of Insurance (COI) — $500K minimum GL
- Background check (GoodHire/Checkr) — within 6 months

**Review Process:**
- Automated: Document format validation, expiration date check
- Manual: Quarterly spot-check by platform admin (15 min/review)
- Escalation: Contractor can request expedited review ($25 fee)

### 2.4 Matching Algorithm (MVP Rule-Based)

**Scoring Formula:**
```
Match Score = (Category Match × 40) + 
              (Location Proximity × 25) + 
              (Availability × 20) + 
              (Verification Tier × 15)
```

**Category Match:**
- Exact match: 100 points
- Related match (e.g., HVAC contractor for ventilation): 70 points
- General contractor for specialty: 50 points

**Location Proximity:**
- Same zip code: 100 points
- Adjacent zip: 75 points
- Within 15 miles: 50 points
- Outside range: 0 points

**Availability:**
- Available this week: 100 points
- Available within 2 weeks: 75 points
- Available within month: 50 points
- Busy: 0 points

**Verification Tier:**
- Level 3 (City Partner): 100 points
- Level 2 (Verified): 75 points
- Level 1 (Basic): 50 points

---

## 3. Technical Architecture

### 3.1 Stack

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Frontend** | Next.js 14+ (App Router) | SEO, performance, familiar |
| **Styling** | Tailwind CSS + shadcn/ui | Consistent with P0 tools |
| **Backend** | Next.js API Routes + Server Actions | Simpler than separate backend |
| **Database** | Supabase (PostgreSQL) | Auth included, realtime, free tier generous |
| **File Storage** | Supabase Storage | COI uploads, project photos |
| **Auth** | Supabase Auth | Magic link + OAuth (Google) |
| **Maps** | Mapbox GL JS | Service area visualization |
| **SMS** | Twilio | Contractor notifications |
| **Email** | Resend | Transactional emails |
| **Payments** | Stripe Connect (Phase 2) | Escrow, contractor payouts |
| **E-Sign** | DocuSign eSignature (Phase 2) | Contract execution |
| **Hosting** | Vercel | Edge network, preview deploys |
| **Monitoring** | Plausible Analytics | Privacy-first tracking |

### 3.2 Database Schema

**Core Tables:**

```sql
-- Homeowners (uses Supabase Auth, extended profile)
create table homeowner_profiles (
  id uuid references auth.users primary key,
  full_name text not null,
  phone text,
  address text,
  zip_code text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Contractors (dual role with auth.users)
create table contractors (
  id uuid references auth.users primary key,
  business_name text not null,
  contact_name text not null,
  phone text not null,
  email text not null,
  license_number text,
  license_type text[], -- ['electrical', 'plumbing', 'hvac', 'general']
  insurance_expires date,
  background_check_date date,
  verification_level int default 1, -- 1, 2, 3
  service_zip_codes text[],
  service_radius_miles int default 15,
  specialties text[], -- matched to project categories
  availability_status text default 'available', -- available, busy, away
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Document uploads for verification
create table contractor_documents (
  id uuid primary key default gen_random_uuid(),
  contractor_id uuid references contractors(id),
  document_type text, -- 'license', 'insurance', 'background_check'
  file_path text not null,
  status text default 'pending', -- pending, approved, rejected
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz default now()
);

-- Projects (homeowner requests)
create table projects (
  id uuid primary key default gen_random_uuid(),
  homeowner_id uuid references homeowner_profiles(id),
  category text not null,
  subcategory text,
  description text not null,
  address text not null,
  zip_code text not null,
  budget_min int,
  budget_max int,
  urgency text default 'standard', -- emergency, urgent, standard, flexible
  preferred_contact text default 'any', -- call, text, email
  status text default 'open', -- open, quoting, awarded, in_progress, completed, cancelled
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Quotes from contractors
create table quotes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id),
  contractor_id uuid references contractors(id),
  amount int not null,
  description text,
  line_items jsonb, -- [{"item": "Labor", "cost": 500}, ...]
  estimated_days int,
  status text default 'pending', -- pending, accepted, declined, expired
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- Reviews (post-project)
create table reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id),
  contractor_id uuid references contractors(id),
  homeowner_id uuid references homeowner_profiles(id),
  rating int check (rating >= 1 and rating <= 5),
  content text,
  would_recommend boolean,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- Messages between homeowners and contractors
create table messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id),
  sender_id uuid references auth.users(id),
  recipient_id uuid references auth.users(id),
  content text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);
```

### 3.3 Project Structure

```
my-app/
├── app/
│   ├── (home)/                    # Marketing pages
│   │   ├── page.tsx               # Landing with wizard CTA
│   │   ├── layout.tsx
│   │   └── contractors/           # Public contractor directory
│   │       └── page.tsx
│   ├── dashboard/                 # Authenticated app
│   │   ├── homeowner/
│   │   │   ├── projects/
│   │   │   │   ├── new/           # Wizard (8 categories)
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── [id]/n         # Project detail + quotes
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx       # Project list
│   │   │   └── layout.tsx
│   │   ├── contractor/
│   │   │   ├── leads/             # Available projects
│   │   │   │   └── page.tsx
│   │   │   ├── quotes/            # My quotes
│   │   │   │   └── page.tsx
│   │   │   ├── verification/      # Upload docs
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   └── layout.tsx             # Shared dashboard shell
│   ├── api/
│   │   ├── projects/route.ts      # CRUD for projects
│   │   ├── quotes/route.ts        # CRUD for quotes
│   │   ├── match/route.ts         # Matching algorithm
│   │   ├── messages/route.ts      # Chat API
│   │   └── webhooks/
│   │       └── twilio/route.ts    # SMS webhooks
│   └── layout.tsx
├── components/
│   ├── wizard/                    # Project intake wizard
│   │   ├── category-select.tsx
│   │   ├── question-flow.tsx
│   │   └── summary.tsx
│   ├── matching/                  # Contractor display
│   │   ├── contractor-card.tsx
│   │   └── quote-comparison.tsx
│   ├── chat/
│   │   └── message-thread.tsx
│   └── verification/
│       └── document-uploader.tsx
├── lib/
│   ├── supabase/                  # Client + server clients
│   ├── matching/                  # Scoring algorithm
│   └── validations/               # Zod schemas
└── types/
    └── database.ts                # Generated Supabase types
```

---

## 4. UI/UX Specifications

### 4.1 Design System

**Colors (extends shadcn/ui slate theme):**
```
Primary:    #0ea5e9 (sky-500) — Trust, professionalism
Secondary:  #22c55e (green-500) — Success, verification
Accent:     #f59e0b (amber-500) — Urgency, warnings
Danger:     #ef4444 (red-500) — Errors, cancellations
```

**Verification Badge Colors:**
- Level 1 (Basic): Gray
- Level 2 (Verified): Green
- Level 3 (City Partner): Blue with star icon

### 4.2 Key Screens

**Landing Page (Homeowner Focus):**
- Hero: "Find Verified Contractors in Ashtabula County"
- Trust bar: "City of Ashtabula Partner" + "Background Checked" + "Licensed Verified"
- CTA: Start project wizard
- Featured contractors (3 Level 3 partners)
- How it works (3 steps)
- Testimonials

**Wizard Flow:**
- Step indicator (1-4)
- Category cards (8 options with icons)
- Conditional questions with clear labels
- Budget slider with presets
- Progress animation between steps
- Summary confirmation before submit

**Contractor Dashboard:**
- Stats: Active leads, quotes sent, win rate
- Lead list with match score
- Quick quote form modal
- Message inbox
- Verification status widget

**Quote Comparison (Homeowner):**
- Side-by-side cards (up to 3)
- Amount prominently displayed
- Line item breakdown (expandable)
- Contractor verification badges
- "Accept" CTA with confirmation modal
- Message contractor link

---

## 5. Development Phases

### Phase 1: MVP (6-8 hours)

**Goal:** Working marketplace with core matching, no payments

**Step 1: Foundation (1.5 hours)**
- [ ] `npx shadcn@latest init` with Next.js template
- [ ] Install shadcn components: button, card, form, input, select, dialog, badge, avatar, tabs
- [ ] Install dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `mapbox-gl`, `twilio`, `resend`
- [ ] Set up Supabase project, run schema migrations
- [ ] Configure environment variables

**Step 2: Auth & Roles (1 hour)**
- [ ] Supabase Auth setup (magic links + Google OAuth)
- [ ] Role selection screen (homeowner vs contractor)
- [ ] Profile completion forms for both roles
- [ ] Protected route middleware

**Step 3: Project Wizard (1.5 hours)**
- [ ] 8-category selector component
- [ ] Conditional question flows (per category)
- [ ] Form state management with validation
- [ ] Project creation API route
- [ ] Success confirmation + next steps

**Step 4: Matching System (1.5 hours)**
- [ ] Rule-based matching algorithm
- [ ] Contractor lead list view
- [ ] Match score display
- [ ] Project → Contractor matching API

**Step 5: Quotes & Messaging (1.5 hours)**
- [ ] Quote submission form (contractor)
- [ ] Quote comparison view (homeowner)
- [ ] Basic messaging component
- [ ] Message notifications (in-app)

**Step 6: Polish & Deploy (1 hour)**
- [ ] Landing page with trust signals
- [ ] Plausible Analytics setup
- [ ] Vercel deployment
- [ ] Basic SEO meta tags

### Phase 2: Trust & Transactions (4-6 hours)

**Goal:** Payment escrow, e-signatures, enhanced verification

**Features:**
- [ ] Document upload for Level 2 verification
- [ ] Admin review interface for documents
- [ ] Stripe Connect onboarding for contractors
- [ ] Escrow payment flow (homeowner → platform → contractor)
- [ ] DocuSign integration for contract signing
- [ ] SMS notifications via Twilio
- [ ] Review system with moderation

### Phase 3: Scale & Intelligence (Future)

**Goal:** ML matching, mobile apps, expansion

**Features:**
- [ ] ML-based match scoring (train on conversion data)
- [ ] React Native mobile apps
- [ ] Lake County / Trumbull County expansion
- [ ] Permit status integration (if API available)
- [ ] Emergency contractor network (24hr response)

---

## 6. Testing & Validation

### 6.1 Test Scenarios

| Scenario | Expected Result |
|----------|-----------------|
| Homeowner submits plumbing project | Matched with 2-4 licensed plumbers in service area |
| Contractor receives lead notification | Email + SMS notification within 5 minutes |
| Contractor submits quote | Homeowner sees quote in comparison view |
| Homeowner accepts quote | Status updates, contractor notified, messaging enabled |
| Contractor uploads expired COI | Document rejected, contractor notified |
| Unlicensed handyman registers | Routed to "handyman" tier, license not required |

### 6.2 Success Metrics

| Metric | Phase 1 Target | Phase 2 Target |
|--------|----------------|----------------|
| Homeowner signups (Month 1) | 50 | 200 |
| Contractor signups (Month 1) | 25 | 75 |
| Projects posted (Month 1) | 30 | 100 |
| Quote response rate | 60% | 75% |
| Average quotes per project | 2.5 | 3.0 |
| User satisfaction (NPS) | 30+ | 50+ |

---

## 7. Open Questions

### Blocking (Need answer before build)
1. **Monetization model for MVP?**
   - A) City-funded public service (no fees)
   - B) Contractor subscription ($50-100/mo after free period)
   - C) Lead purchase ($10-25 per quote)
   - *Recommendation: A for traction, transition to B at 50 contractors*

2. **Domain preference?**
   - A) contractors.ashtabula.city (municipal trust)
   - B) hire-ashtabula.com (marketing friendly)
   - C) ashtabulacontractors.com (SEO focused)

3. **Handyman tier included?**
   - Yes: Expands market, includes sub-$1K projects
   - No: Focus on licensed work only
   - *Recommendation: Yes, but clearly labeled "Handyman (unlicensed)"*

### Important (Affect scope)
4. **Should I draft City partnership outreach email?** (Ready in COMMUNITY-OUTREACH-PLAN.md)
5. **Emergency contractor network priority?** (24hr response for plumbing/HVAC)
6. **Background check cost coverage?** (Platform pays initially, pass to contractors later?)

---

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Low contractor signup | Medium | High | Free leads for 6 months, city partnership promotion |
| Low homeowner posting | Medium | High | Facebook/Nextdoor ads, city newsletter feature |
| Payment disputes | Low | High | Clear TOS, mediation process, no platform liability |
| Review bombing | Low | Medium | Moderated reviews, three-strike policy |
| Insurance claims | Low | High | Platform E&O insurance, contractor COI requirement |

---

## 9. Appendices

### Appendix A: Project Category → License Requirements

| Category | License Required | Trades Covered |
|----------|------------------|----------------|
| Renovation | Sometimes | Structural = GC license |
| Repair | Sometimes | Trade-specific |
| Painting | No | N/A |
| Plumbing | Yes | OCILB plumbing license |
| Electrical | Yes | OCILB electrical license |
| HVAC | Yes | OCILB HVAC license |
| Landscaping | No | N/A |
| New Build | Yes | GC + trade licenses |

### Appendix B: Zip Codes (Ashtabula County)

```
44001 (Andover)      44004 (Ashtabula)    44005 (Ashtabula)
44010 (Austinburg)   44030 (Conneaut)     44041 (Geneva)
44047 (Jefferson)    44048 (Kingsville)   44057 (Madison)
44068 (North Kingsville)  44076 (Orwell)  44077 (Painesville)
44081 (Perry)        44085 (Roaming Shores)
```

### Appendix C: OCILB License Types

- Electrical Contractor
- HVAC Contractor
- Plumbing Contractor
- Hydronics Contractor
- Refrigeration Contractor

---

**Document Complete:** Ready for Phase 1 implementation upon Michael's approval of Open Questions #1-3.

**Related Documents:**
- `PHASE1-RESEARCH.md` — Competitive analysis and validation
- `COMMUNITY-OUTREACH-PLAN.md` — Stakeholder engagement strategy
- `P0-BUILD-SCHEDULE-v0.1.md` — Cross-project build pipeline
