# Harvest Alert — Phase 1 Research
**Date:** 2026-02-18  
**Status:** Phase 1 Complete → Ready for Phase 2 (Resource Procurement)  
**File:** `websites/harvest-alert/PHASE1-RESEARCH.md`

---

## Problem Statement

Ashtabula County farmers and gardeners lack a simple, affordable way to notify customers when specific crops are ready for harvest. Currently, farmers rely on:
- **Facebook posts** (algorithm throttles reach, not all customers use Facebook)
- **Email newsletters** (low open rates, time-consuming to create)
- **Manual phone calls/texts** (scales poorly, tedious)
- **Signs at farm stands** (only reaches people who drive by)
- **Word of mouth** (unreliable, slow)

**Result:** Farmers miss sales opportunities, customers miss peak freshness windows, and both groups waste time on inefficient communication.

---

## Market Opportunity

### Ashtabula County Agriculture Context
- **Ashtabula Farmers Market:** Sundays June-October, 10am-2pm, Bridge Street Harbor (5,400+ Facebook followers)
- **U-Pick Operations:** Multiple farms offering strawberries, blueberries, apples, pumpkins
- **Local Food Network:** Active community with OSU Extension support and published Local Food Guide
- **CSA Programs:** Peters Creek Farm, Covered Bridge Gardens, and others serving the county

### Target Users

**Primary: Small-Scale Farmers/Growers**
- 2-20 acres, direct-to-consumer sales
- U-pick operations, farm stands, CSA coordinators
- Tech comfort: Low to medium (use Facebook, basic email)

**Secondary: Gardeners & Homesteaders**
- Surplus produce to sell/give away
- Neighborhood networks, community gardens

**Tertiary: Customers/Subscribers**
- Local food enthusiasts
- Families seeking U-pick experiences
- CSA members wanting real-time updates

---

## Competitor Analysis

### Direct Competitors (Harvest Notification Focus)

| Tool | Pricing | Strengths | Weaknesses | Ashtabula Fit |
|------|---------|-----------|------------|---------------|
| **Farmish App** | Free listings | Simple mobile app, local focus | National platform, no Ashtabula presence | Low — no local adoption |
| **FarmersMarketHaul** | Free | Deal/restock notifications | Limited availability data | Low — not focused on harvest timing |
| **Soko Farmers Market App** | Free | Live notifications, producer updates | National scope, requires vendor adoption | Low — no Ashtabula integration |

### Indirect Competitors (Farm Management with Notification Features)

| Tool | Pricing | Notification Capability |
|------|---------|------------------------|
| **Barn2Door** | $99+/mo + setup | Full farm management, customer notifications built-in |
| **Local Line** | $29-79/mo | SMS/email alerts for CSA members |
| **Locally Grown** | Transaction fees | Push notifications for orders |
| **Farmbrite** | $19-79/mo | Harvest planning module |

### Key Insight
**All existing solutions are either:**
1. **Too expensive** for small farms (Barn2Door, Local Line)
2. **Too complex** (full farm management suites)
3. **Not focused on harvest timing** (market apps)
4. **National platforms** without Ashtabula presence

---

## Market Gap Analysis

### What's Missing
1. **FREE or ultra-low-cost** harvest alert tool (<$10/mo)
2. **Simple SMS/email** without app download required
3. **Ashtabula-specific** with local crop knowledge
4. **Weather integration** to predict harvest readiness
5. **One-click broadcasts** from mobile phone

### Differentiation Strategy
- **Free tier:** SMS/email to 50 subscribers, unlimited crops
- **Ashtabula crop database:** Pre-loaded harvest windows for common crops (strawberries: June, sweet corn: July-Aug, apples: Sept-Oct)
- **Weather-based predictions:** "Strawberries expected ready in 5-7 days based on GDD"
- **No app required:** Farmers use simple web dashboard, customers get SMS/email
- **Local branding:** "Harvest Alert — Powered by Ashtabula Local Food Network"

---

## Technical Feasibility

### Core Features (MVP)
1. **Farmer Dashboard**
   - Add/manage crop availability
   - One-click "Send Alert" to subscribers
   - Subscriber list management

2. **Customer Subscription**
   - SMS or email signup by crop type
   - ZIP code preference for nearby farms
   - Opt-out anytime

3. **Weather Integration**
   - Growing Degree Day (GDD) calculator
   - Harvest prediction estimates
   - Frost alerts

### Tech Stack Options
| Component | Option A | Option B |
|-----------|----------|----------|
| Frontend | React + Vercel | Next.js + Firebase |
| Backend | Firebase Functions | Supabase Edge |
| Database | Firestore | Supabase PG |
| SMS | Twilio | MessageBird |
| Email | Resend | SendGrid |
| Weather | OpenWeatherMap | NOAA API |
| Hosting | Firebase | Vercel |

**Estimated MVP Cost:** $0-25/month (Twilio SMS credits, Firebase Spark free tier)

---

## User Personas

### Persona 1: "U-Pick Patty"
- **Role:** 3rd generation strawberry farmer, 8-acre operation
- **Goal:** Notify 200+ regulars when strawberries peak
- **Pain:** Facebook only reaches 10% of followers; phone tree takes 2 hours
- **Tech:** iPhone, Facebook, basic email
- **Quote:** *"I just want to send one text that goes to everyone who asked about strawberries."*

### Persona 2: "CSA Chris"
- **Role:** CSA coordinator, 40 member families
- **Goal:** Weekly harvest updates, surplus crop alerts
- **Pain:** Email newsletters take 45 min to write; low open rates
- **Tech:** Google Sheets, Mailchimp
- **Quote:** *"Members want to know 'what's in the box' before pickup."*

### Persona 3: "Eager Emma"
- **Role:** Local food enthusiast, mother of 2
- **Goal:** Never miss strawberry season or sweet corn
- **Pain:** Follows 5 farms on Facebook, still misses posts
- **Tech:** iPhone, SMS preferred
- **Quote:** *"I just want a text when blueberries are ready. I don't check Facebook."*

### Persona 4: "Backyard Bob"
- **Role:** Retired, large vegetable garden
- **Goal:** Give away surplus to neighbors
- **Pain:** Tomatoes ripen all at once, neighbors miss the window
- **Tech:** Basic smartphone
- **Quote:** *"I grow too many zucchini. I wish I could text the neighborhood."*

---

## Stakeholder Mapping

### Primary Contacts

| Organization | Contact | Role | Interest Level |
|--------------|---------|------|----------------|
| **Ashtabula Farmers Market** | Market Manager | Vendor coordination | High — direct benefit |
| **OSU Extension Ashtabula** | Agriculture Educator | Farm support | High — aligns with mission |
| **Peters Creek Farm** | Farm Owner | U-pick/CSA operation | High — potential early adopter |
| **Covered Bridge Gardens** | Farm Owner | Large CSA (400 shares) | High — notification pain |

### Secondary Contacts

| Organization | Interest |
|--------------|----------|
| **Ashtabula County Tourism Council** | Agri-tourism promotion |
| **LocalHarvest.org** | National directory partnership |
| **Country Neighbor Food Bank** | Surplus produce alerts |

---

## Revenue Model Options

### Option A: Freemium (Recommended)
- **Free:** 50 SMS subscribers, unlimited email, 3 crops
- **Pro ($9/mo):** Unlimited SMS, unlimited crops, weather predictions
- **Farm Stand ($29/mo):** Multi-farmer, embeddable widget, priority support

### Option B: Sponsorship
- Free for all farmers
- Sponsored by Ashtabula County Tourism Council or OSU Extension
- "Brought to you by [Sponsor]" branding

### Option C: Usage-Based
- Free email alerts
- $0.02 per SMS (pass-through Twilio cost)
- Farmer pays only for messages sent

---

## Open Questions (Phase 2 Blockers)

### Critical Questions
1. **Farmer tech adoption:** Will farmers use a web dashboard, or is SMS-only input needed?
2. **Customer preference:** Do people prefer SMS (immediate) or email (less intrusive)?
3. **Privacy/GDPR:** What opt-in requirements apply for agricultural alerts?
4. **Weather accuracy:** How reliable are GDD predictions for harvest timing?
5. **Scalability:** Can we handle 500+ subscribers per farm on free tier infrastructure?

### Validation Needed
1. **Survey 10-15 local farmers** about current notification methods and pain points
2. **Survey 20+ customers** at farmers market about preferred alert method
3. **Interview OSU Extension** about crop data availability and partnership potential
4. **Test Twilio pricing** at scale (500 SMS = ~$5-7/month at volume)
5. **Validate weather API** accuracy for Ashtabula growing region

---

## Competitive Differentiation Matrix

| Feature | Harvest Alert (Proposed) | Barn2Door | Farmish | Local Line |
|---------|--------------------------|-----------|---------|------------|
| **Price** | Free-$9/mo | $99+/mo | Free | $29+/mo |
| **Setup Time** | 5 minutes | 2-4 weeks | 10 min | 1-2 weeks |
| **SMS Alerts** | ✅ | ✅ | ❌ | ✅ |
| **Weather Predictions** | ✅ | ❌ | ❌ | ❌ |
| **Ashtabula-Specific** | ✅ | ❌ | ❌ | ❌ |
| **No App Download** | ✅ | ❌ | ❌ | ❌ |
| **Multi-Farm Directory** | ✅ | ❌ | ✅ | ❌ |

---

## Recommended Next Steps (Phase 2)

1. **Stakeholder Outreach**
   - Email Ashtabula Farmers Market manager
   - Contact OSU Extension agriculture educator
   - Reach out to 3-5 U-pick farms for discovery calls

2. **User Validation**
   - Survey farmers at next market (Sunday)
   - Create simple signup form to gauge customer interest
   - Interview CSA coordinators about communication workflows

3. **Technical Validation**
   - Build SMS notification prototype with Twilio
   - Test NOAA/OpenWeatherMap API for Ashtabula GDD calculations
   - Validate Firebase/Supabase free tier limits

4. **Partnership Exploration**
   - Pitch OSU Extension on sponsorship/hosting
   - Explore LocalHarvest.org integration
   - Contact Ashtabula County Tourism Council

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Low farmer tech adoption | High | SMS-only input option, paper signup sheets at market |
| Twilio costs exceed projections | Medium | Start with email-only free tier, SMS as upgrade |
| Weather predictions inaccurate | Medium | Label predictions as "estimates," allow farmer override |
| Competitor response (Barn2Door) | Low | Focus on free tier, local relationships as moat |
| SMS deliverability issues | Medium | Use toll-free number, implement proper opt-in |

---

## Success Metrics (6-Month Targets)

- **Farmers onboarded:** 15-20 active farms
- **Customer subscribers:** 500+ total subscribers
- **Alerts sent:** 200+ harvest alerts
- **Farmer retention:** 70%+ active after 3 months
- **Revenue (if monetized):** $100-200 MRR

---

## Related Projects & Synergies

- **farm-stand-finder:** Shared farmer database, cross-promotion
- **through-the-grapevine:** Event alerts could integrate with harvest timing
- **civic-insight-engine:** OSU Extension partnership overlap
- **grantgenius:** Potential funding for "food access" angle

---

**Status:** 🔴 → 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement)

**Next Deliverable:** PHASE2-RESOURCES.md — Stakeholder contact details, survey results, technical validation
