# Virtual Concierge — Phase 1 Research
## Ashtabula County Virtual Concierge for Hotels & B&Bs

**Date:** February 19, 2026  
**Status:** Phase 1 Research  
**Next:** Phase 2 Resource Procurement

---

## 1. Problem Statement

### The Pain Point
Hotels and B&Bs in Ashtabula County lack a modern, digital concierge solution. Guests currently rely on:
- Front desk staff (limited hours, especially at B&Bs)
- Printed brochures (outdated, incomplete, easily lost)
- Generic Google searches (miss local gems, no curation)
- Word of mouth (inconsistent information)

### Impact
- **Guest frustration:** Can't find local recommendations quickly
- **Missed revenue:** Hotels miss commission opportunities from local business referrals
- **Staff burden:** Front desk spends significant time answering repetitive questions
- **Lost tourism dollars:** Guests default to chain restaurants instead of local gems

---

## 2. Market Analysis

### Target Market Size
**Ashtabula County Hospitality Landscape:**
- **Hotels/Motels:** 25-35 properties (chains + independents)
  - Holiday Inn Express, Hampton Inn, Quality Inn (Geneva/Ashtabula)
  - Independents: The Lodge at Geneva-on-the-Lake, various motels
- **B&Bs/Inns:** 15-25 properties
  - High concentration in Geneva-on-the-Lake area
  - Wine country tourism drives demand
- **Vacation Rentals:** 100+ Airbnb/VRBO properties
  - Growing segment, no front desk support

**Annual Visitor Volume:**
- Geneva-on-the-Lake: ~500,000 visitors/year (peak summer)
- Ashtabula County tourism: ~2M visitor days/year
- Average stay: 2-3 nights

### Local Stakeholders

**Primary Users (Hotels/B&Bs):**
| Property | Type | Location | Notes |
|----------|------|----------|-------|
| The Lodge at Geneva-on-the-Lake | Resort | Geneva-on-the-Lake | 120+ rooms, wedding venue |
| Hampton Inn Ashtabula | Hotel | Ashtabula | Business + leisure travelers |
| Holiday Inn Express | Hotel | Geneva | Chain, consistent demand |
| Quality Inn | Hotel | Ashtabula | Budget travelers |
| Eagle Cliff Inn | B&B | Geneva-on-the-Lake | Historic, wine tourists |
| Lakehouse Inn | B&B | Geneva-on-the-Lake | Winery + spa attached |
| Various Airbnb hosts | Rentals | County-wide | No staff, high need |

**Partners (Local Businesses to Feature):**
| Category | Examples | Commission Potential |
|----------|----------|---------------------|
| Wineries | Ferrante, Laurello, M Cellars, Debonne | 10-15% on tastings/tours |
| Restaurants | Crosswinds, Horizons, Old Firehouse | Referral fees |
| Activities | Adventure 585, Geneva State Park | Booking commissions |
| Services | Local spas, fishing charters | 10-20% commissions |

---

## 3. Competitor Analysis

### National Competitors

| Competitor | Model | Strengths | Weaknesses | Local Gap |
|------------|-------|-----------|------------|-----------|
| **Alice** (Actabl) | Hotel SaaS ($3-5/room/mo) | AI-powered, integrations | Expensive, generic recommendations | No Ashtabula curation |
| **Volara** | Voice AI for hotels | Voice concierge, smart room | High setup cost, impersonal | No local expertise |
| **Duve** | Guest app platform | Mobile check-in, upsells | Generic, no local knowledge | Limited small hotel support |
| **Crave** | Guest messaging | SMS/WhatsApp concierge | Reactive only, no proactive | No curation engine |

### Local/Regional Solutions
- **None identified** — No dedicated digital concierge for Ashtabula County
- Individual hotels may use:
  - Printed rack cards (outdated quickly)
  - Basic websites with limited local info
  - Staff knowledge (inconsistent, staff turnover)

### Gap Analysis
**✓ Opportunity Confirmed:**
- No dedicated Ashtabula-focused virtual concierge exists
- National solutions are too expensive for small hotels/B&Bs
- Generic platforms lack local curation and relationships
- B&Bs and vacation rentals have zero solution (no front desk)

---

## 4. User Personas

### Persona 1: "Traveling Tina" (Hotel Guest)
- **Demographics:** 35-55, suburban Chicago/Pittsburgh/Cleveland
- **Visiting:** Wine country weekend getaway
- **Tech comfort:** High (uses apps for everything)
- **Pain points:**
  - Arrived at 10pm, front desk closed
  - Doesn't know which wineries are open Sunday
  - Wants local restaurant recs, not chains
- **Needs:** Quick access to curated local info, mobile-friendly

### Persona 2: "Business Bob" (Business Traveler)
- **Demographics:** 40-60, sales/consulting
- **Visiting:** Working with local business, 1-2 nights
- **Tech comfort:** Moderate-High
- **Pain points:**
  - Limited time for research
  - Needs reliable, quick dining options
  - Doesn't know local area at all
- **Needs:** Fast recommendations, reliable hours/info

### Persona 3: "B&B Owner Barbara"
- **Demographics:** 50-65, B&B owner/operator
- **Role:** Owner of 6-room B&B
- **Tech comfort:** Low-Moderate
- **Pain points:**
  - Can't staff front desk 24/7
  - Tired of answering same questions
  - Wants to monetize recommendations
- **Needs:** Easy setup, automated answers, revenue share

### Persona 4: "Vacation Rental Victor" (Airbnb Host)
- **Demographics:** 35-50, remote worker/investor
- **Role:** Manages 3 Airbnb properties
- **Tech comfort:** High
- **Pain points:**
  - No on-site staff at all
  - Guests message constantly with questions
  - Wants to provide premium experience
- **Needs:** Shareable digital guide, reduces messaging

---

## 5. Solution Concept

### Core Concept
**"A white-label virtual concierge that makes every hotel and B&B in Ashtabula feel like a full-service resort."**

### Key Features

**For Guests:**
1. **Curated Local Guide** — AI-powered recommendations based on preferences
2. **Ask Anything** — Natural language Q&A about local area
3. **Book Experiences** — Direct booking for wineries, restaurants, activities
4. **Personalized Itinerary** — Builds custom plans based on stay dates/interests
5. **Mobile-First** — No app download required, works on any device

**For Hotels/B&Bs:**
1. **White-Label Branding** — Matches property's look/feel
2. **Revenue Dashboard** — Tracks referral commissions
3. **Easy Updates** — Property-specific info (WiFi, check-out, etc.)
4. **Analytics** — See what guests ask about most
5. **Staff Time Savings** — Reduces repetitive questions

### Differentiation

| Feature | Virtual Concierge | Generic Apps | Printed Materials |
|---------|-------------------|--------------|-------------------|
| Always available | ✓ | ✓ | ✓ |
| Local curation | ✓ Deep Ashtabula knowledge | ✗ Generic | ✗ Limited space |
| AI-powered Q&A | ✓ | ✓ | ✗ |
| Revenue share | ✓ 10-20% commissions | ✗ | ✗ |
| Easy updates | ✓ Real-time | ✓ | ✗ Expensive reprints |
| Mobile-optimized | ✓ | ✓ | ✗ |
| Affordable for small properties | ✓ Free tier | ✗ $$$ | ✓ |

---

## 6. Tech Stack Options

### Option A: Next.js + Supabase (Recommended)
**Best for:** Full control, custom AI integration
- **Frontend:** Next.js 14 (App Router), Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **AI:** OpenAI GPT-4 + embeddings (local knowledge base)
- **Vector Store:** Pinecone (for similarity search)
- **Auth:** Supabase Auth (hotel staff login)
- **Hosting:** Vercel
- **Cost:** ~$50-100/mo (scaling with usage)

### Option B: No-Code + AI Integration
**Best for:** Speed to market, less maintenance
- **Platform:** Bubble or Webflow
- **AI:** OpenAI API integration
- **Database:** Airtable or Bubble DB
- **Cost:** ~$50-150/mo
- **Pros:** Faster build, easier for non-technical updates
- **Cons:** Less flexibility, vendor lock-in

### Recommended: Option A
**Rationale:**
- Custom knowledge base for Ashtabula-specific info
- Better performance for AI responses
- More control over commission tracking
- Scalable for multiple properties

---

## 7. Revenue Model

### Tiered Pricing

| Tier | Price | Features | Target |
|------|-------|----------|--------|
| **Free** | $0 | Basic guide, 10 FAQ answers, standard branding | B&Bs, small rentals |
| **Pro** | $49/mo | AI concierge, custom branding, analytics | Small hotels (10-50 rooms) |
| **Business** | $149/mo | Revenue sharing, priority support, API access | Hotels (50+ rooms) |
| **Enterprise** | Custom | White-label app, custom integrations | Resort chains |

### Commission Structure
- **Winery tastings/tours:** 10-15%
- **Restaurant reservations:** 5-10%
- **Activity bookings:** 15-20%
- **Spa services:** 10-15%

**Example Economics (Pro tier hotel, 50 rooms, 60% occupancy):**
- Monthly subscription: $49
- Average 30 guest interactions/day
- 20% convert to booking = 6 bookings/day
- Average commission $5 = $30/day = $900/month
- **Net to hotel: $851/month**

---

## 8. Implementation Roadmap

### Phase 1: MVP (Weeks 1-4)
- [ ] Build basic Q&A interface with OpenAI
- [ ] Load Ashtabula knowledge base (50+ POIs)
- [ ] Simple property branding (logo, colors)
- [ ] Mobile-responsive design
- [ ] Deploy for 1 pilot property

### Phase 2: Feature Complete (Weeks 5-8)
- [ ] Booking integration (wineries, restaurants)
- [ ] Commission tracking dashboard
- [ ] Multi-property support
- [ ] Analytics and reporting
- [ ] Onboard 3-5 beta properties

### Phase 3: Scale (Weeks 9-12)
- [ ] Partner with 10+ local businesses
- [ ] Itinerary builder feature
- [ ] Guest preference profiles
- [ ] Marketing to hospitality properties
- [ ] Launch public website

### Phase 4: Expansion (Months 4-6)
- [ ] Expand to Lake County (Painesville, Mentor)
- [ ] Voice integration (Alexa/Google)
- [ ] API for property management systems
- [ ] Franchising model for other regions

---

## 9. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Hotels don't see value | Medium | High | Free tier to prove ROI, pilot with 1 hotel |
| Local businesses won't pay commissions | Medium | Medium | Start with referral model, prove value first |
| AI gives wrong/outdated info | Low | High | Human oversight, feedback loop, daily monitoring |
| Competition from national players | Low | Medium | Focus on hyper-local, relationships |
| Technology adoption by B&Bs | Medium | High | Simple setup, excellent support, free tier |

---

## 10. Open Questions for Phase 2

### Stakeholder Research
1. [ ] Would The Lodge at Geneva-on-the-Lake use this? (Contact: ???)
2. [ ] What's the typical front desk question volume at Hampton Inn?
3. [ ] What commission % would Ferrante Winery accept?
4. [ ] Do B&Bs currently pay for any digital tools?
5. [ ] What prevents Airbnb hosts from recommending local businesses?

### Technical Research
6. [ ] Can we integrate with Hotelogix or other PMS systems?
7. [ ] What's the OpenAI API cost at 1000 queries/day?
8. [ ] Should we build a native app or PWA?

### Business Model
9. [ ] What's the willingness to pay for small B&Bs vs hotels?
10. [ ] Can we negotiate exclusive partnerships with wineries?

---

## 11. Success Metrics

### 90-Day Targets
- [ ] 3 pilot properties onboarded
- [ ] 500+ guest interactions
- [ ] 50+ bookings facilitated
- [ ] $500+ commissions earned
- [ ] 4.5+ star guest satisfaction

### 6-Month Targets
- [ ] 15 properties using platform
- [ ] 50+ local business partners
- [ ] $5,000+ monthly commission volume
- [ ] Expand to 2 adjacent counties

---

## 12. Next Steps (Phase 2)

### Immediate Actions
1. **Contact pilot properties**
   - [ ] The Lodge at Geneva-on-the-Lake — 440-466-7100
   - [ ] Hampton Inn Ashtabula — 440-992-8900
   - [ ] Eagle Cliff Inn — 440-466-8010

2. **Partner outreach**
   - [ ] Ferrante Winery — partnership@ferrantewinery.com
   - [ ] Laurello Winery — info@laurellowines.com
   - [ ] Crosswinds Grille — crosswinds@thelakehouseinn.com

3. **Technical setup**
   - [ ] Create OpenAI account, test API
   - [ ] Set up Supabase project
   - [ ] Build knowledge base (scrape local info)

4. **Validation**
   - [ ] Survey 10 hotel guests about current experience
   - [ ] Interview 3 B&B owners about pain points

---

## Appendix A: Local Business Inventory

### Wineries (Prioritized)
1. Ferrante Winery & Ristorante — Geneva
2. Laurello Vineyards — Geneva
3. M Cellars — Geneva
4. Debonne Vineyards — Madison
5. Grand River Cellars — Madison
6. South River Vineyard — Geneva
7. Cask 307 — Geneva
8. The Winery at Spring Hill — Geneva

### Restaurants (Prioritized)
1. Crosswinds Grille — Geneva-on-the-Lake
2. Horizons Restaurant — Geneva State Park
3. The Old Firehouse Winery — Geneva-on-the-Lake
4. Ferrante Ristorante — Geneva
5. Mama D's — Ashtabula
6. Briquettes Smokehouse — Jefferson
7. Rennick's Meat Market — Geneva

### Activities & Attractions
1. Geneva State Park — Beach, trails, lodge
2. Adventure 585 — Axe throwing, rage room
3. Ashtabula Harbor — Historic district, lifts
4. Hubbard House Underground Railroad Museum
5. Ashtabula Maritime & Surface Transportation Museum
6. Wine & Walleye Festival (annual)
7. Grape Jamboree (annual)

---

**Document Status:** Phase 1 Complete — Ready for Phase 2 Resource Procurement
**Next Deliverable:** PHASE2-RESOURCES.md (contact database, outreach templates)
