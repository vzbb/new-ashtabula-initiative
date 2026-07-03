# Phase 1 Research: Instant Dirt Quote

**Date:** 2026-02-19  
**Status:** 🟡 Phase 1 Complete  
**MVP Category:** Construction / Contractor Tools  

---

## 1. Problem Statement

### The Pain Point

Contractors, landscapers, and homeowners in Ashtabula County face significant friction when sourcing bulk aggregate materials (gravel, topsoil, fill dirt, sand, crushed concrete). The current process involves:

1. **Multiple phone calls** to different suppliers for pricing
2. **Unclear delivery costs** until after quote request
3. **Manual calculations** for material quantities (tons vs cubic yards vs truckloads)
4. **No price transparency** - different suppliers have wildly different rates
5. **Scheduling headaches** - coordinating delivery windows between multiple vendors
6. **Quality uncertainty** - not knowing what grade of material will arrive

### Market Context

Ashtabula County has active residential construction, agricultural operations, and waterfront properties requiring:
- Driveway construction and resurfacing
- Landscaping and grading projects
- Drainage and erosion control
- Foundation and building pad preparation
- Farm road maintenance

The county's mix of rural properties and shoreline homes creates consistent demand for bulk materials year-round.

---

## 2. Market Analysis

### Local Suppliers Identified

**Primary Aggregates Suppliers:**
1. **Bull Moose Aggregates & Trucking LLC** (Rome, OH)
   - Serves: Lake, Geauga, Ashtabula, Trumbull Counties
   - Delivery: $40-$100 depending on distance (10+ miles = $100)
   - Services: Heavy hauling, construction materials

2. **Simak Trucking & Excavating, Inc.** (North Kingsville, OH)
   - Full-service excavation + material supply
   - Pickup or delivery options
   - Can source materials not in stock

3. **Hello Gravel** (National platform with local coverage)
   - "Uber for gravel" model
   - Free local delivery via dump truck
   - 2-4 business day delivery
   - Online ordering + calculator tools

4. **Gravel Monkey** (National platform)
   - $50 off first order with coupon
   - Phone support available
   - Volume discounts for large orders
   - **Note:** Mixed customer reviews (Reddit complaints about bait-and-switch)

5. **Gravelshop.com** (Regional coverage)
   - Online ordering for Ashtabula County
   - Sand, gravel, topsoil delivery

6. **Valley City Supply** (Ashtabula, OH)
   - Outdoor living + building stone supplier
   - Local pickup available

7. **Ashtabula Sand & Gravel Company**
   - Local heritage supplier
   - Works with Hello Gravel network

### Regional Excavation Contractors (Potential B2B Users)

- **Dunn Excavation** (Mentor) - serves Ashtabula County
- **DSL Excavating, LLC** - foundations, driveways, site work
- **BDB Rentals Excavation and Fabrication**
- **Moisio Excavating**
- **Alfadel's Trucking**
- **Geauga County Excavating Inc.** - commercial/residential earthwork
- **Northeast Ohio Excavating** - driveways, parking lots

---

## 3. Competitor Analysis

### National Platforms

| Competitor | Model | Strengths | Weaknesses |
|------------|-------|-----------|------------|
| **Hello Gravel** | Marketplace + delivery | Free delivery, online calculator, wide coverage | Quality control varies by local supplier, customer service issues |
| **Gravel Monkey** | Aggregator + delivery | First-time discounts, phone support | Reputation issues (Reddit complaints), bait-and-switch allegations |
| **Gravelshop** | Regional online store | Clear pricing, established presence | Limited to specific regions, no real-time delivery tracking |

### Local Competitors

| Supplier | Type | Digital Presence | Quote Process |
|----------|------|------------------|---------------|
| Bull Moose | Local hauler | Basic website | Phone/email |
| Simak Trucking | Excavation + supply | Website | Phone only |
| Valley City | Retail yard | Website + social | Phone/in-person |

### Gap Identified

**No local, instant-quote platform exists for Ashtabula County specifically.**

Existing solutions either:
- Require phone calls (local suppliers)
- Are national platforms with variable local coverage (Hello Gravel)
- Have reputation issues (Gravel Monkey)
- Don't provide instant pricing transparency

---

## 4. User Personas

### Persona 1: Contractor Carl
- **Profile:** Excavation contractor with 3-5 crew members
- **Pain Points:** Needs fast quotes to bid jobs, hates waiting for callbacks, wants volume pricing
- **Usage Pattern:** Weekly orders, multiple material types per job
- **Decision Criteria:** Price, reliability, delivery speed
- **Tech Comfort:** Moderate - uses phone mostly, would use web app if it saves time

### Persona 2: Homeowner Hannah
- **Profile:** DIY homeowner building a driveway or landscaping
- **Pain Points:** Doesn't know how much material she needs, intimidated by calling suppliers, worried about being overcharged
- **Usage Pattern:** One-time or annual projects
- **Decision Criteria:** Price transparency, ease of use, educational content
- **Tech Comfort:** High - expects mobile-friendly experience

### Persona 3: Landscaper Leo
- **Profile:** Small landscaping business owner
- **Pain Points:** Needs same-day or next-day delivery, multiple job sites, different materials per day
- **Usage Pattern:** Multiple orders per week during season
- **Decision Criteria:** Speed, flexibility, account management
- **Tech Comfort:** Moderate - would use app for scheduling

### Persona 4: Property Manager Paula
- **Profile:** Manages rental properties and commercial lots
- **Pain Points:** Needs recurring deliveries, invoice management, multiple locations
- **Usage Pattern:** Seasonal bulk orders, recurring maintenance
- **Decision Criteria:** Billing features, delivery reliability, reporting
- **Tech Comfort:** High - expects business features

---

## 5. Solution Concept

### "Instant Dirt Quote" - Ashtabula's Aggregate Calculator + Quote Platform

**Core Value Proposition:**
Get an instant, accurate quote for bulk aggregate delivery in Ashtabula County in under 60 seconds.

**Key Features:**

1. **Smart Material Calculator**
   - Project type presets (driveway, garden bed, foundation, etc.)
   - Automatic conversion: cubic yards ↔ tons ↔ truckloads
   - Visual guide for measuring irregular areas
   - Compaction factor adjustments

2. **Instant Quote Engine**
   - Real-time pricing from multiple local suppliers
   - Delivery fee calculator based on address/zone
   - Total landed cost upfront (no surprises)
   - Save and compare multiple scenarios

3. **Supplier Matching**
   - Show available suppliers for material + delivery zone
   - Ratings and reviews from local customers
   - Supplier profiles with photos of materials

4. **One-Click Ordering**
   - Account creation optional for quotes
   - Required for ordering
   - Saved addresses and payment methods
   - Order tracking via SMS/email

5. **Contractor Features**
   - Business accounts with net-30 terms
   - Multi-job management
   - Delivery scheduling calendar
   - Invoice export for accounting

---

## 6. Technical Approach

### Recommended Stack

**Frontend:**
- Next.js 14 with App Router
- Tailwind CSS for styling
- shadcn/ui components
- React Hook Form + Zod validation

**Backend:**
- Supabase (PostgreSQL + Auth + Realtime)
- Row Level Security for data protection

**Integrations:**
- Google Maps API (address validation, zone mapping, distance calculation)
- Stripe (payments, invoicing)
- Twilio (SMS notifications)
- SendGrid (email confirmations)

**Deployment:**
- Vercel (frontend)
- Supabase (backend)

### Data Model

**Core Entities:**
- `suppliers` - Local material suppliers
- `materials` - Aggregate types (gravel #57, topsoil, etc.)
- `pricing_rules` - Per-supplier pricing by zone/material
- `delivery_zones` - Geographic zones with pricing
- `quotes` - User-generated quote requests
- `orders` - Confirmed quote → order conversion

### Calculator Algorithm

```
Input:
- Project dimensions (L × W × D)
- Material type (density factor)
- Delivery address (zone lookup)

Calculation:
1. Volume = L × W × D (cubic feet)
2. Cubic Yards = Volume ÷ 27
3. Tons = Cubic Yards × Material Density
4. Trucks = Tons ÷ Truck Capacity (typically 15-20 tons)
5. Material Cost = Tons × Price per Ton
6. Delivery Cost = Base + (Miles × Rate) OR Zone flat rate
7. Total = Material + Delivery + Tax
```

---

## 7. Revenue Model Options

### Option 1: Lead Generation (Recommended for MVP)
- Free tool for users
- Charge suppliers per qualified lead
- $5-15 per quote request
- Win-win: Users get free service, suppliers get pre-qualified leads

### Option 2: Transaction Fee
- 5-10% fee on completed orders
- Users pay for convenience
- Requires full order management system

### Option 3: SaaS for Suppliers
- $99/month per supplier for premium listing
- Features: Priority placement, analytics, CRM integration
- Stable recurring revenue

### Option 4: Hybrid
- Free tier: Basic calculator + 3 supplier quotes
- Pro tier: $29/month for contractors (unlimited quotes, priority delivery, invoicing)
- Supplier tier: $49/month for enhanced profiles

**Recommended:** Start with Option 1 (lead gen), validate demand, then add Option 3 (supplier SaaS).

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Suppliers unwilling to share pricing | Medium | High | Start with public/comparable pricing, build trust over time |
| Price volatility makes quotes inaccurate | High | Medium | Add "estimate valid for 7 days" disclaimer, real-time price refresh |
| Hello Gravel expands aggressively | Medium | Medium | Focus on local relationships, faster delivery, personal service |
| Seasonal demand fluctuations | High | Low | Diversify into related services (mulch, salt in winter) |
| Delivery logistics complexity | Medium | High | Partner with existing haulers, don't own trucks initially |
| Low user adoption | Medium | High | Start with contractor relationships, word-of-mouth in trades |

---

## 9. Open Questions for Phase 2

### Supplier Research
1. Will local suppliers share wholesale pricing for the platform?
2. What's the typical markup from wholesale to retail for aggregates in Ashtabula?
3. Which suppliers have excess capacity and would welcome more leads?
4. Do any suppliers already have online ordering systems?

### User Research
5. What's the typical project size (tons) for residential vs commercial?
6. How far in advance do contractors typically order materials?
7. What's the biggest pain point: price uncertainty, quantity calculation, or scheduling?
8. Would contractors pay for a premium service with guaranteed delivery windows?

### Market Research
9. What's the total addressable market (TAM) for aggregates in Ashtabula County?
10. Are there seasonal patterns we should design around?
11. What's the average contractor's tech adoption level?

### Technical Research
12. Can we get access to supplier inventory systems via API?
13. What's the most accurate material density data for common aggregates?
14. Are there existing trucking/logistics APIs we can integrate?

---

## 10. Implementation Roadmap

### Phase 1: Validation (Weeks 1-2)
- Interview 5 local contractors
- Interview 3 material suppliers
- Validate calculator accuracy with real projects
- Define pricing zones for Ashtabula County

### Phase 2: MVP (Weeks 3-6)
- Build material calculator with 5 common materials
- Integrate Google Maps for zone-based delivery pricing
- Create simple quote form (email delivery)
- Onboard 2-3 suppliers with manual pricing updates

### Phase 3: Launch (Weeks 7-8)
- Launch with basic lead generation model
- Focus on contractor acquisition
- Gather feedback and iterate

### Phase 4: Scale (Months 3-6)
- Add more suppliers and materials
- Build contractor accounts with saved projects
- Implement automated supplier notifications
- Add reviews and ratings system

---

## 11. Success Metrics

### MVP Success Criteria
- 100+ quote requests in first month
- 5+ suppliers onboarded
- 20% quote-to-lead conversion rate
- Average quote completion time < 60 seconds
- NPS score > 50 from contractors

### 6-Month Targets
- 50+ active contractors using platform
- 10+ suppliers participating
- $10K+ monthly revenue from lead generation
- 40% repeat user rate
- Top 3 Google ranking for "Ashtabula gravel delivery"

---

## 12. Differentiation Strategy

### What Makes Us Different

1. **Local Focus:** Unlike Hello Gravel (national), we're Ashtabula-specific with local relationships
2. **Instant Quotes:** No waiting for callbacks - real pricing immediately
3. **Contractor-First:** Built by people who understand construction, not just tech
4. **Transparency:** Clear breakdown of material vs delivery costs
5. **Community:** Local customer service, local knowledge, local jobs

### Brand Positioning
**"The fastest way to get dirt delivered in Ashtabula County"**

Taglines to test:
- "Get your quote before your coffee gets cold"
- "No more phone tag, just dirt"
- "Ashtabula's aggregate experts"

---

## 13. Next Steps

### Immediate (This Week)
1. Contact Bull Moose Aggregates - schedule partnership discussion
2. Contact Simak Trucking - explore integration
3. Interview 2-3 local contractors about their current process
4. Map out delivery zones for Ashtabula County (20-mile radius zones)

### Phase 2 Preparation
1. Create supplier pitch deck (value proposition for joining platform)
2. Draft contractor survey for deeper insights
3. Research material density specifications for accurate calculator
4. Identify competitor pricing for benchmarking

---

**Document Version:** 1.0  
**Last Updated:** 2026-02-19  
**Next Review:** After 3 supplier interviews
