# Phase 2 Resource Procurement — Box Builder

**Date:** 2026-02-20  
**Project:** box-builder (AI Custom Box Estimation Tool)  
**Status:** Phase 2 Complete → Ready for Phase 3 SPEC.md

---

## 1. Stakeholder Contact Directory

### Primary Targets — Packaging Manufacturers (Ashtabula/Cleveland)

| Priority | Company | Location | Contact Strategy | Best Path |
|----------|---------|----------|------------------|-----------|
| **🔥 P1** | **Northeast Box Company** | Ashtabula, OH | Discovery call → Pilot partner | Welch Packaging (acquired) corporate office |
| **🔥 P1** | **Welch Packaging Ashtabula** | Ashtabula, OH | White-label partnership | Local branch direct outreach |
| **P2** | **Jamestown Container** | Cleveland, OH | API integration partner | Sales team via website form |
| **P2** | **Crown Packaging** | Cleveland, OH | Enterprise efficiency tool | LinkedIn sales leadership |

### Contact Acquisition Plan

**Northeast Box Company (via Welch Packaging)**
- **Parent company:** Welch Packaging ( welchpkg.com )
- **Ashtabula branch:** 440-998-2411
- **Corporate HQ:** 574-232-4124 (South Bend, IN)
- **Approach:** Request discovery call about "customer self-service quoting tools"
- **Value prop angle:** Reduce quote time, capture after-hours leads, compete with Packlane

**Welch Packaging — Ashtabula Direct**
- **Address:** 2926 E Prospect Rd, Ashtabula, OH 44004
- **Phone:** 440-998-2411
- **Hours:** Mon-Fri 7AM-4PM
- **LinkedIn targets:** Operations Manager, Sales Director (search Welch Packaging Ashtabula)
- **Approach angle:** "Helping local manufacturers compete with online platforms"

### Secondary Targets — E-commerce Sellers

| Source | How to Reach | Interview Goal |
|--------|--------------|----------------|
| **Ashtabula Etsy Sellers** | Ashtabula Art Guild, Facebook groups | Packaging pain points, shipping cost surprises |
| **Amazon FBA sellers** | Cleveland seller meetups, Facebook groups | Right-size packaging needs, current solutions |
| **Local 3PLs** | Cleveland/Akron fulfillment centers | Quote volume, current tools, integration interest |
| **CSBDC referrals** | Cleveland Small Business Development Center | Warm intros to manufacturers |

---

## 2. Outreach Email Templates

### Template A: Manufacturer Discovery (Northeast Box/Welch)

**Subject:** Quick question about custom quotes — AI tool for local manufacturers

```
Hi [Name],

I'm reaching out from a local tech initiative helping Ashtabula 
manufacturers modernize their customer experience.

I noticed Northeast Box Company has served the area for 40+ years 
— impressive legacy. I'm exploring whether an AI-powered box 
estimation tool could help local packaging companies:

• Reduce quote response time (hours → seconds)
• Capture after-hours website leads
• Compete with platforms like Packlane that target your customers

The concept: Customers enter product dimensions, get instant 
box recommendations + rough pricing, then connect with you 
for final quote.

Would you be open to a 15-minute call to share how your current 
quote process works? No sales pitch — just research to see if 
this would actually help local manufacturers.

Best,
[Your name]
[Contact info]

P.S. This would be built specifically for small-to-mid 
manufacturers, not enterprise systems like Packsize.
```

### Template B: Follow-Up After No Response (1 week)

**Subject:** Re: Quick question about custom quotes — 15 min research call?

```
Hi [Name],

Following up on my note about the AI box estimation tool for 
local manufacturers.

Even a brief "not interested" helps me understand if this is 
a real problem worth solving — or if I'm solving the wrong thing.

Still open to a quick 15-minute call if you have time this week.

Thanks,
[Your name]
```

### Template C: E-commerce Seller Interview Request

**Subject:** $5 Amazon gift card for 10-min packaging survey — local research

```
Hi [Name],

I'm researching packaging challenges for e-commerce sellers 
in the Ashtabula/Cleveland area.

Would you be willing to do a quick 10-minute phone interview 
about your current packaging process? Specifically:

• How do you currently choose box sizes for products?
• Any surprises with dimensional weight shipping costs?
• What would make packaging easier?

Happy to send a $5 Amazon gift card as thanks.

If interested, reply with a few times that work this week.

Best,
[Your name]
```

### Template D: Cleveland SBDC Partnership

**Subject:** Partnership opportunity — free tool for local manufacturers

```
Hi [SBDC Contact Name],

I'm developing an AI-powered packaging estimation tool 
specifically for small manufacturers in Northeast Ohio.

The tool would help packaging companies:
• Provide instant quotes to customers
• Reduce back-and-forth on sizing questions
• Look more professional vs. email-based quoting

Would the CSBDC be interested in:
1. Making warm intros to local packaging manufacturers?
2. Distributing this as a free resource to your clients?

Happy to discuss how this aligns with your mission to support 
local business growth.

Best,
[Your name]
```

---

## 3. Data Gathering Checklist

### Pricing Data to Acquire

| Data Point | Source | Priority | How to Get |
|------------|--------|----------|------------|
| **Box size price ranges** | Northeast Box/Welch | 🔥 Critical | Discovery call + sample quotes |
| **Material cost per sq ft** | Industry averages | High | Interview + corrugated pricing indices |
| **Labor/overhead markup %** | Manufacturer interview | Medium | Ask in discovery call |
| **Minimum order quantities** | Competitor research | High | Packlane, Arka, Packola quotes |
| **DIM weight divisors** | FedEx/UPS APIs | High | API documentation |
| **Freight class mappings** | FedEx/UPS | Medium | Developer docs |

### Sample Quote Scenarios (Request from Manufacturers)

1. **Small e-commerce box:** 6"×4"×3", 200# ECT, qty 100
2. **Medium shipping box:** 12"×10"×8", 200# ECT, qty 50
3. **Large product box:** 18"×14"×12", 32 ECT, qty 25
4. **Custom insert:** Divider set for fragile items

### Technical Data Sources

| Resource | URL | Use |
|----------|-----|-----|
| **DieCutTemplates API** | diecuttemplates.com | Dieline generation |
| **Corrugated Price Index** | ppi.bls.gov | Material cost tracking |
| **FedEx Rates API** | developer.fedex.com | DIM weight calculation |
| **UPS Rating API** | developer.ups.com | Shipping cost estimates |
| **ECT Rating Chart** | Packaging industry refs | Box strength specifications |

---

## 4. E-commerce Seller Interview Guide

### Goal
Validate pain points around packaging selection, shipping cost surprises, and willingness to use an AI estimator tool.

### Questions (10 minutes)

**Opening (1 min)**
- "Tell me briefly about what you sell and your typical shipping volume."

**Current Process (3 min)**
- "Walk me through how you choose box sizes for a new product."
- "Where do you currently buy packaging supplies?"
- "How do you handle packaging for oddly-shaped items?"

**Pain Points (3 min)**
- "Have you ever been surprised by shipping costs after choosing a box?"
- "How often do you 'size up' because you don't have the right box?"
- "What's the most frustrating part of packaging/shipping for you?"

**Tool Validation (2 min)**
- "If you could enter product dimensions and get an instant box recommendation + shipping estimate, would you use it?"
- "What would make you trust the recommendations?"
- "Would you prefer this as a free tool or part of a supplier's website?"

**Closing (1 min)**
- "Anything else about packaging that frustrates you?"
- "Can I follow up if we build this?"

### Recording
- Ask permission to record (for note-taking)
- Offer $5 Amazon gift card as thanks
- Capture: current tools used, annual packaging spend, biggest pain point

---

## 5. Technical Resource Assessment

### 3D Visualization Options

| Library | Pros | Cons | Recommendation |
|---------|------|------|----------------|
| **Three.js** | Full control, web-native | Learning curve | **Selected** — fits stack |
| **Babylon.js** | Game-engine features | Overkill for boxes | Alternative |
| **CSS 3D transforms** | No library | Limited interactivity | Fallback only |

### Dieline Generation

| Option | Approach | Feasibility |
|--------|----------|-------------|
| **DieCutTemplates API** | Direct integration | Medium — need API access |
| **SVG templates** | Pre-built, parametric | **Selected** — simpler MVP |
| **Custom canvas/SVG** | Build from scratch | Hard — complex geometry |

**MVP Scope Decision:**
- Start with simple RSC (Regular Slotted Container) style only
- Generate SVG dieline with parameterized dimensions
- 3D preview shows assembled box, not flat dieline

### API Integrations

| Service | Use Case | Priority | Effort |
|---------|----------|----------|--------|
| **FedEx Rates API** | Shipping estimates | High | Medium (needs account) |
| **UPS API** | Shipping estimates (backup) | Medium | Medium |
| **Stripe** | SaaS billing for manufacturers | Medium | Low (familiar) |
| **Firebase** | Auth, hosting, data | High | Low (familiar) |

---

## 6. Risk Assessment Matrix

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| **Manufacturers don't see value** | Medium | High | Start with one pilot, prove ROI with real metrics |
| **Pricing accuracy without manufacturer data** | High | High | Conservative estimates + "contact for final quote" |
| **Complex box styles beyond MVP scope** | Medium | Medium | Limit to RSC boxes only, expand later |
| **No manufacturer partners willing to pilot** | Low | Critical | Pivot to B2C affiliate model (send leads to Packlane/Arka) |
| **Shipping API costs/rate limits** | Low | Low | Cache results, implement rate limiting |
| **Competitor launches similar tool** | Low | Medium | Focus on local partnership angle, move fast |

---

## 7. Next Steps Decision Tree

```
After Phase 2 Outreach:
│
├─► If Northeast Box or Welch agrees to pilot:
│   └─► Proceed to Phase 3 SPEC.md
│       └─► Include manufacturer integration requirements
│
├─► If manufacturers decline but e-commerce sellers interested:
│   └─► Pivot to B2C affiliate model
│       └─► Partner with Packlane/Arka for referral fees
│
└─► If no interest from either side:
    └─► Deprioritize MVP
        └─► Document learnings, move to next project
```

### Go Criteria for Phase 3
- [ ] At least 1 manufacturer agrees to discovery call
- [ ] OR at least 3 e-commerce sellers confirm interview interest
- [ ] Sample pricing data for 3+ box configurations

### No-Go Criteria
- [ ] All manufacturers decline (no market demand)
- [ ] Zero e-commerce seller interest
- [ ] Pricing data acquisition fails (can't build accurate estimator)

---

## 8. Quick Reference: Key Contacts

| Company | Phone | Best Time to Call | Decision Maker |
|---------|-------|-------------------|----------------|
| Welch Packaging Ashtabula | 440-998-2411 | Tue-Thu 9AM-11AM | Branch Manager |
| Welch Corporate | 574-232-4124 | Any business hours | Partnerships team |
| Jamestown Container | Website form | — | Sales team |
| CSBDC | 216-522-4194 | Business hours | Director |

---

**Status:** ✅ Phase 2 Complete  
**Next:** Phase 3 SPEC.md (pending go/no-go decision)  
**Recommended:** Proceed to Phase 3 with conservative assumptions if manufacturers don't respond within 1 week.
