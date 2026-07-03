# Pocket Sommelier — Phase 1 Research Document

**Project:** pocket-sommelier  
**Date:** 2026-02-19  
**Researcher:** Rondell (Noirsys AI)  
**Status:** Phase 1 Complete → Ready for Phase 2 (Resource Procurement)

---

## 1. Problem Statement

### The Core Problem
Restaurant diners in Ashtabula County's thriving wine country face a paradox: 30+ local wineries produce award-winning wines, yet diners struggle to make informed pairing decisions when visiting winery restaurants and local dining establishments. Current solutions fall short:

- **Static paper menus** offer limited wine descriptions with no pairing guidance
- **Generic wine apps** (Vivino, Delectable) lack Ashtabula-specific wine databases
- **No QR-based tools** exist for this region's unique wine + food ecosystem
- **Staff knowledge varies** — busy servers can't provide detailed pairing advice during peak hours

### Impact
- Diners choose suboptimal pairings → less satisfaction, lower check averages
- Local wines go undiscovered → missed revenue for wineries
- Restaurants miss upsell opportunities → lower wine program profitability

---

## 2. Market Landscape

### Ashtabula Wine Economy
| Metric | Value |
|--------|-------|
| Wineries in county | 30+ |
| Wine trail visitors annually | ~500,000+ |
| Wine tourism economic impact | $50M+ (estimated) |
| Key wine region | Grand River Valley AVA |
| Major wine events | Wine N Bloom (April/May), Grape Jamboree (September) |

### Key Wineries with Restaurant Operations
| Winery | Location | Restaurant | Seating |
|--------|----------|------------|---------|
| Ferrante Winery & Ristorante | Geneva | Full-service Italian | 200+ |
| Grand River Cellars | Madison | Winery restaurant | 100+ |
| Laurello Vineyards | Geneva | Light fare/events | 50+ |
| Fitzgerald's Wine Bar | Ashtabula Harbor | Wine bar + small plates | 40+ |

### Restaurants with Strong Wine Programs
- **Bascule** (Geneva-on-the-Lake) — craft cocktails, seasonal menu, wine focus
- **The Lakehouse Inn** (Geneva) — fine dining, local wine emphasis
- **Bridge Street restaurants** (Ashtabula Harbor) — emerging dining scene

---

## 3. Competitor Analysis

### Direct Competitors (Wine Apps)

| Competitor | Price | Strengths | Weaknesses | Ashtabula Coverage |
|------------|-------|-----------|------------|-------------------|
| **Vivino** | Free/$50yr | 15M+ wines, ratings, scanning | Generic pairings, no local focus | Poor — limited Ohio wines |
| **Delectable** | Free | Professional tasting notes | No food pairing focus | Very poor |
| **Hello Vino** | Free | Food pairing focused | Limited wine database | Poor |
| **Wine Spectator** | $49/yr | Expert reviews | Expensive, elite focus | Minimal |

### Indirect Competitors (QR Menu Solutions)

| Competitor | Price | Features | Gap |
|------------|-------|----------|-----|
| **MenuTiger** | $39/mo | QR menus, basic wine notes | No AI pairing, not Ashtabula-focused |
| **Supercode** | Custom | QR generation | No wine intelligence |
| **My Wine Guide** | Unknown | Sommelier service | Enterprise pricing, not local |

### Key Insight
**No competitor combines:**
1. Ashtabula-specific wine database
2. AI-powered food pairing
3. QR-code restaurant integration
4. Free/accessible pricing

---

## 4. User Personas

### Persona 1: Weekend Wine Tourist "Sarah"
- **Demographics:** 35-55, suburban Cleveland/Pittsburgh, $75K+ income
- **Goals:** Discover local wines, pair with dinner, share experiences
- **Pain points:** Overwhelmed by 30+ wineries, unsure what pairs with meal
- **Tech comfort:** High — uses apps regularly
- **Quote:** *"I want to try the local wine but don't know which one goes with my pasta."

### Persona 2: Winery Restaurant Server "Mike"
- **Demographics:** 22-35, local resident, hospitality worker
- **Goals:** Provide good service, increase check averages, reduce questions
- **Pain points:** Can't memorize 50+ wines, too busy for detailed explanations
- **Tech comfort:** Medium — uses POS, basic apps
- **Quote:** *"I wish diners could look up pairings themselves so I can focus on service."

### Persona 3: Local Foodie "Jennifer"
- **Demographics:** 40-60, Ashtabula resident, restaurant regular
- **Goals:** Optimize dining experiences, discover new wines
- **Pain points:** Repeat visits feel stale without wine guidance
- **Tech comfort:** Medium-high
- **Quote:** *"I come here monthly but always order the same wine. What else should I try?"

### Persona 4: Restaurant Owner "David"
- **Demographics:** 45-60, owns winery restaurant or local bistro
- **Goals:** Increase wine sales, reduce training costs, differentiate experience
- **Pain points:** Training staff on wine is expensive and time-consuming
- **Tech comfort:** Low-medium — needs simple solutions
- **Quote:** *"I need an easy way to help customers choose wine without hiring a sommelier."

---

## 5. Stakeholder Mapping

### Primary Stakeholders
| Stakeholder | Role | Contact Priority | Value Proposition |
|-------------|------|-----------------|-------------------|
| **Ferrante Winery** | Largest winery/restaurant | HIGH | Increased wine discovery, reduced server training |
| **Grand River Cellars** | Restaurant + winery | HIGH | Enhanced dining experience, data insights |
| **Fitzgerald's Wine Bar** | Harbor wine bar | HIGH | Differentiation, customer engagement |
| **Bascule** | Fine dining | MEDIUM | Premium pairing experience |
| **Laurello Vineyards** | Boutique winery | MEDIUM | Exposure for lesser-known wines |

### Supporting Stakeholders
| Stakeholder | Role | Contact Priority |
|-------------|------|-----------------|
| **Vines & Wines Wine Trail** | Marketing collective | HIGH |
| **Visit Ashtabula County** | Tourism bureau | MEDIUM |
| **Ashtabula County Tourism Council** | Destination marketing | MEDIUM |
| **Ohio Wine Producers Association** | State org | LOW (later phase) |

---

## 6. Differentiation Strategy

### Unique Value Proposition
**"The only AI sommelier that knows Ashtabula's wines like a local"**

### Key Differentiators
1. **Hyper-local database** — All 30+ Ashtabula wineries, 200+ wines
2. **QR simplicity** — Scan table → instant pairing advice
3. **AI personalization** — "I like sweet reds and I'm having fish"
4. **Restaurant integration** — Links to current menu, not generic database
5. **Free for diners** — No app download, no registration barrier

### Competitive Moat
- Ashtabula wine data (non-trivial to collect)
- Local restaurant partnerships (relationship-based)
- "Local AI sommelier" brand positioning

---

## 7. Revenue Model Options

### Model A: Restaurant SaaS (Recommended)
| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | Basic QR, 20 wines, generic pairings |
| **Pro** | $49/mo | Unlimited wines, custom pairings, analytics |
| **Enterprise** | $149/mo | Multi-location, staff training tools, priority support |

### Model B: Winery Promotions
- Featured wine placements: $25-100/mo
- "Try this wine" recommendations: CPC model

### Model C: Consumer Freemium
- Free: Basic pairings
- Premium ($4.99/mo): History, favorites, exclusive winery offers

### Recommended Approach
Start with **Model A** (Restaurant SaaS) — aligns incentives (restaurants want to sell more wine), easier to monetize, builds local relationships.

---

## 8. Technical Feasibility

### Core Technologies
- **Frontend:** React/Vue PWA (mobile-first)
- **AI:** Gemini/OpenAI for pairing logic
- **Database:** Supabase/Firebase for wines + restaurants
- **QR:** Dynamic QR generation per restaurant/table
- **Hosting:** Vercel/Netlify (low cost)

### Data Sources
| Data | Source | Effort |
|------|--------|--------|
| Winery list | ohio.org, visitashtabulacounty.com | Low |
| Wine details | Manual entry + winery outreach | Medium |
| Restaurant menus | Manual entry per restaurant | Medium |
| Pairing logic | AI + sommelier validation | Low-Medium |

### MVP Scope
1. 5-10 core wineries
2. 3-5 restaurant partners
3. Basic pairing AI
4. QR code generation
5. Mobile-optimized interface

---

## 9. Open Questions / Phase 2 Blockers

### Critical Questions (Must Answer Before Building)
1. **Will Ferrante/Grand River Cellars participate?** — They have the most to gain/lose
2. **Do restaurants see value in wine pairing tools?** — Need validation interviews
3. **Is AI pairing "good enough" without sommelier review?** — Quality threshold
4. **Who maintains wine inventory?** — Restaurant staff burden concern
5. **What's the actual wine sales uplift?** — ROI for restaurants unclear

### Important Questions
6. Should we include beer/cocktail pairings too? (broader appeal)
7. Are there legal/liability issues with AI wine recommendations?
8. How do we handle vintage changes and availability?
9. What's the right price point for Ashtabula market?
10. Should tourists be able to "save" wines to buy later?

---

## 10. Recommended Next Steps (Phase 2)

### Stakeholder Outreach
1. **Email Ferrante Winery** — Request meeting with restaurant manager
2. **Email Grand River Cellars** — Partnership discussion
3. **Contact Fitzgerald's Wine Bar** — Early adopter interest
4. **Reach out to Bascule** — Fine dining perspective

### Validation Activities
1. **Survey 20+ diners** at winery restaurants — Would you use a QR pairing tool?
2. **Interview 3-5 servers** — Pain points with current wine service?
3. **Interview 2-3 restaurant owners** — Willingness to pay for wine tools?

### Technical Validation
1. **Test AI pairing quality** — Sample 20 wine+food combos, sommelier review
2. **Prototype QR flow** — 1-hour mockup for user testing
3. **Validate data collection effort** — Time to catalog 50 wines

---

## 11. Success Metrics

### Phase 1 Success (Research)
- [x] Competitor analysis complete
- [x] Stakeholder map complete
- [x] 4 user personas defined
- [x] Revenue model options outlined

### Phase 2 Success (Validation)
- [ ] 3+ restaurant partner conversations
- [ ] 20+ diner surveys completed
- [ ] AI pairing quality validated
- [ ] Pricing validated with restaurant owners

### Phase 3+ Success (Build/Launch)
- [ ] 5+ restaurant partners signed
- [ ] 100+ wines in database
- [ ] 1,000+ QR scans in first month
- [ ] 15% wine sales increase (pilot restaurant)

---

## Appendix: Ashtabula Wineries (Sample)

| Winery | City | Has Restaurant | Notes |
|--------|------|----------------|-------|
| Ferrante Winery | Geneva | Yes | Largest, Italian focus |
| Grand River Cellars | Madison | Yes | Full menu |
| Laurello Vineyards | Geneva | Limited | Boutique, events |
| M Cellars | Geneva | No | Highly rated |
| South River Vineyard | Geneva | No | Scenic |
| Debonne Vineyards | Madison | No | Large estate |
| Lakehouse Inn Winery | Geneva | Yes | Farm-to-table |
| St. Joseph Vineyard | Madison | No | Historic |
| Cask 307 | Geneva | No | Modern |
| 34 Brix | Geneva | No | Small batch |

*(Full list: 30+ wineries available via ohio.org)*

---

**Document Status:** Complete  
**Next Action:** Phase 2 Stakeholder Outreach → Contact Ferrante Winery and Grand River Cellars  
**Estimated Phase 2 Duration:** 1-2 weeks
