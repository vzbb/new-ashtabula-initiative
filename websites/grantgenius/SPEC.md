# GrantGenius — Specification Document

## Overview

**Tagline:** AI-powered local grant intelligence for Ashtabula businesses and nonprofits

**Problem:** Small businesses and nonprofits in Ashtabula County struggle to discover relevant funding opportunities. Existing tools (Instrumentl at $95-195/mo) are expensive and nonprofit-focused. No solution serves small businesses in rural counties with local + federal + foundation grants in one place.

**Solution:** A focused grant discovery and intelligence tool that combines:
- Local EDO grant feeds (Growth Partnership, Ashtabula Foundation)
- Federal grant APIs (Grants.gov, USAspending)
- AI-powered eligibility matching
- Simple, affordable pricing ($29/mo or freemium)

---

## Target Users

| Persona | Role | Primary Need | Secondary Need |
|---------|------|--------------|----------------|
| Small Business Owner | Restaurant, retail, manufacturing | Working capital grants | Expansion funding |
| Nonprofit ED | 501(c)(3) organizations | Program grants | Operating support |
| Aspiring Entrepreneur | Pre-revenue, startup | Seed funding | Technical assistance |
| Economic Developer | ACDI/Growth Partnership | Portfolio tracking | Pipeline visibility |

---

## Core Features

### 1. Grant Discovery Feed
- **Unified feed:** Federal + state + local + foundation grants
- **Filtering:** By type (business, nonprofit, R&D), amount, deadline, sector
- **Search:** Full-text with AI-powered semantic matching
- **Save/Watchlist:** Star grants for later review

### 2. Eligibility Pre-Screener
- **5-question wizard:** Entity type, use case, timeline, location, amount needed
- **Match score:** Percentage fit for each grant
- **Missing requirements:** Clear list of what else is needed to qualify
- **Alternatives:** Suggested grants if primary doesn't fit

### 3. Deadline Dashboard
- **Calendar view:** Visual timeline of upcoming deadlines
- **Auto-reminders:** Email/SMS at 30, 14, 7, 1 days before deadline
- **Status tracking:** Saved → Drafting → Submitted → Awarded → Declined
- **Team collaboration:** Multi-user workspaces for nonprofits

### 4. Grant Detail Pages
- **Executive summary:** What, who, how much, when
- **Requirements checklist:** Eligibility criteria with yes/no indicators
- **Application guide:** Step-by-step breakdown
- **Similar awards:** Past recipients in Ashtabula/similar counties
- **Contact info:** Program officer details

### 5. Ashtabula-Specific Section
- **Growth Partnership grants:** JobsOhio, local incentives
- **Ashtabula Foundation:** Annual grant cycles, priorities
- **County programs:** Microgrants, facade improvements
- **Success stories:** Local businesses who won grants

---

## Data Sources

| Source | Type | Method | Frequency |
|--------|------|--------|-----------|
| Grants.gov API | Federal grants | REST API | Daily sync |
| USAspending.gov | Award data | REST API | Weekly sync |
| Growth Partnership | Local grants | RSS/scrape + manual | Real-time |
| Ashtabula Foundation | Foundation grants | Email digest + manual | Monthly |
| JobsOhio | State incentives | API/manual | Weekly |
| SBA | Federal programs | API/manual | Weekly |

---

## Technical Architecture

### Stack
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **UI Components:** shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **AI:** OpenAI GPT-4o-mini (matching, summaries)
- **Search:** Algolia or Meilisearch (grant search)
- **Email:** Resend
- **SMS:** Twilio (optional)
- **Scheduling:** Inngest or Trigger.dev (deadline reminders)

### Database Schema (Core Tables)

```sql
-- Grants master table
grants (
  id uuid primary key,
  title text not null,
  description text,
  source_type enum('federal', 'state', 'local', 'foundation'),
  source_name text, -- e.g., "Grants.gov", "Ashtabula Foundation"
  external_id text unique, -- Grants.gov tracking number
  funding_min integer,
  funding_max integer,
  deadline date,
  open_date date,
  eligibility_requirements jsonb,
  application_url text,
  contact_email text,
  contact_phone text,
  match_score_formula jsonb,
  status enum('active', 'closed', 'upcoming'),
  created_at timestamp,
  updated_at timestamp
);

-- User profiles
profiles (
  id uuid primary key references auth.users,
  entity_type enum('business', 'nonprofit', 'individual'),
  business_name text,
  industry text,
  employee_count integer,
  location_zip text,
  naics_code text,
  created_at timestamp
);

-- Saved grants (watchlist)
saved_grants (
  id uuid primary key,
  user_id uuid references profiles,
  grant_id uuid references grants,
  status enum('saved', 'drafting', 'submitted', 'awarded', 'declined'),
  match_score integer,
  notes text,
  reminder_days integer[],
  created_at timestamp
);

-- Eligibility responses
eligibility_checks (
  id uuid primary key,
  user_id uuid references profiles,
  grant_id uuid references grants,
  responses jsonb, -- questionnaire answers
  eligibility_score integer, -- 0-100
  missing_requirements text[],
  created_at timestamp
);
```

---

## User Flows

### Flow 1: First-Time Discovery
1. Landing page with value prop
2. Quick eligibility wizard (5 questions)
3. Personalized grant matches
4. Save promising grants
5. Email verification + reminder setup

### Flow 2: Daily Grant Review
1. Dashboard shows new grants since last visit
2. Filter by match score > 70%
3. Review grant details
4. Update status (saved → drafting)
5. Set reminder for deadline

### Flow 3: Deadline Management
1. Calendar view of upcoming deadlines
2. Automated reminder emails
3. Checklist of materials needed
4. Direct link to application portal

---

## UI/UX Design

### Layout
- **Navigation:** Sidebar with Dashboard, Grants, Calendar, Saved, Settings
- **Dashboard:** Stats cards + new grants feed + upcoming deadlines
- **Grants List:** Card-based with match score badge, deadline countdown
- **Grant Detail:** Two-column (summary left, requirements right)

### Visual Language
- **Primary:** Emerald 600 (#059669) — growth, money, success
- **Secondary:** Slate 800 — professional, trustworthy
- **Accent:** Amber 500 — deadlines, urgency
- **Match scores:**
  - 90-100%: Green
  - 70-89%: Blue
  - 50-69%: Yellow
  - <50%: Gray

### Key Interactions
- **Match wizard:** Stepper with progress indicator
- **Grant cards:** Hover reveals quick actions (save, share)
- **Deadline countdown:** Dynamic text ("3 days left", "Due today")
- **Filters:** Inline chips, instant refresh

---

## Phased Implementation

### Phase 1: MVP (8-10 hours)
**Goal:** Core discovery + basic matching
- [ ] Project setup (Next.js + Supabase + shadcn)
- [ ] Grant database schema + seed data (10 sample grants)
- [ ] Grant listing page with filters
- [ ] Grant detail page
- [ ] Basic eligibility wizard (3 questions)
- [ ] Save/watchlist functionality
- [ ] Simple dashboard
- [ ] Deploy to Vercel

### Phase 2: Intelligence (6-8 hours)
- [ ] Grants.gov API integration
- [ ] AI matching algorithm
- [ ] Search with Algolia/Meilisearch
- [ ] Email reminders (Resend)
- [ ] Deadline calendar view
- [ ] User profiles + preferences

### Phase 3: Growth (8-10 hours)
- [ ] Growth Partnership integration
- [ ] Ashtabula Foundation feed
- [ ] Success stories section
- [ ] Team/multi-user support
- [ ] SMS reminders (Twilio)
- [ ] Analytics dashboard

### Phase 4: Monetization (4-6 hours)
- [ ] Stripe subscription integration
- [ ] Freemium tier limits
- [ ] Premium features (unlimited alerts, AI writing assistant)
- [ ] Admin panel for manual grant entry

---

## Open Questions

1. **Grants.gov API Access:** What are the terms of use for commercial applications? Is there a cost?
2. **Foundation Data:** Will Ashtabula Foundation share structured data or only PDF/email formats?
3. **User Validation:** Should we interview 3-5 local business owners before building?
4. **Pricing:** Freemium (5 free grants/month) or trial-based? What's the local willingness to pay?
5. **Competition:** Is Instrumentl actively used by any local nonprofits? What's the switch cost?

---

## Success Metrics

| Metric | Phase 1 Target | Phase 2 Target |
|--------|----------------|----------------|
| Grant database size | 50 grants | 500+ grants |
| User signups | 25 | 100 |
| Weekly active users | 10 | 50 |
| Grant saves per user | 3 | 8 |
| Match accuracy (survey) | 70% | 85% |

---

## Differentiation

| Feature | GrantGenius | Instrumentl | GrantHub |
|---------|-------------|-------------|----------|
| Price | $29/mo or free | $95-195/mo | $75/mo |
| Small business focus | ✅ Yes | ❌ No | ⚠️ Limited |
| Local Ashtabula grants | ✅ Yes | ❌ No | ❌ No |
| Rural-specific matching | ✅ Yes | ❌ No | ❌ No |
| AI eligibility screener | ✅ Yes | ✅ Yes | ❌ No |

---

## Next Steps

1. **Michael review:** Validate concept and priorities
2. **Answer open questions:** Especially Grants.gov API terms
3. **Stakeholder outreach:** Growth Partnership, Ashtabula Foundation
4. **User interviews:** 3-5 local business owners/nonprofit EDs
5. **Decision:** Build Phase 1 or pivot based on feedback
