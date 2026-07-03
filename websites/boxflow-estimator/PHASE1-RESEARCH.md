# Phase 1: Research — BoxFlow Estimator

**Project:** BoxFlow Estimator  
**New Ashtabula Initiative**  
**Date:** February 19, 2026  
**Status:** ✅ Complete

---

## 1. Problem Statement

### What Problem Does BoxFlow Estimator Solve?

Small-to-mid businesses in Ashtabula County waste **15-25%** of their shipping budget on:

1. **Oversized packaging** — Using boxes too large for products, paying dimensional weight (DIM) fees
2. **Inefficient packing decisions** — Staff guessing which box size to use without optimization
3. **Material waste** — Excess void fill, bubble wrap, and air pillows
4. **Time inefficiency** — Manual trial-and-error packing processes

### The Math Problem

When shipping carriers calculate cost, they use:
```
Billable Weight = MAX(Actual Weight, Dimensional Weight)
Dimensional Weight = (Length × Width × Height) / DIM Divisor
```

For UPS/FedEx: DIM Divisor = 139

**Example:** A 2 lb product in a 12×10×8 box:
- Actual weight: 2 lbs
- Dimensional weight: (12×10×8)/139 = **6.9 lbs** → billed as **7 lbs**
- Cost difference: ~$4-8 per package depending on zone

For a business shipping 100 packages/week: **$20,800-$41,600/year** in avoidable costs.

---

## 2. Local Market Analysis

### Ashtabula County Business Landscape

Ashtabula County, Ohio has a diverse industrial base with significant shipping needs:

#### Key Industries with Shipping Requirements:

| Industry | Businesses | Shipping Volume | Packaging Needs |
|----------|------------|-----------------|-----------------|
| **Wineries** | 20+ (Grand River Valley) | 500-5,000 cases/yr | Glass bottle protection, custom inserts |
| **Composite Manufacturing** | 15+ companies | B2B freight | Custom protective packaging |
| **Chemical/Resin Producers** | 8+ facilities | Bulk + samples | Hazmat compliance, foam inserts |
| **Metal/Machinery** | 12+ fabricators | Heavy parts | Industrial protective packaging |
| **Paper/Packaging** | 3+ facilities | B2B wholesale | Volume shipping |
| **Agricultural Products** | Farms, food producers | Direct-to-consumer | Cold chain, protective |

#### Notable Local Businesses (Verified):

**Wineries/Shipping:**
- Debonné Vineyards (Madison, OH) — Ships statewide, free shipping on 4+ bottles
- Laurello Vineyards (Geneva, OH) — Wine club shipments
- Happyland Winery (Madison, OH) — Direct-to-consumer focus
- Ferrante Winery & Ristorante — Restaurant + shipping
- M Cellars — Boutique winery
- South River Vineyard — Historic church venue

**Manufacturers:**
- Ashtabula Rubber Company — Industrial rubber products
- Creative Millwork of Ohio — Custom millwork, ships nationwide
- Fenton Manufacturing — Metal fabrication
- Chromaflo Technologies — Chemical/pigments
- Gabriel Performance Products — Epoxy additives
- Northeast Box Company — Local packaging supplier
- Mohawk Fine Paper — Paper products

**Agricultural:**
- Various dairy farms with direct-to-consumer cheese/butter
- Aloterra (Miscanthus grass products)
- Orchard and produce farms with CSA boxes

### Market Size Estimate

**Target Market (SMBs shipping products):**
- Estimated 150-200 businesses in Ashtabula County with regular shipping needs
- Average shipping spend: $2,000-$15,000/month per business
- Total addressable market (TAM): $3.6M-$36M annually in shipping spend
- Serviceable obtainable market (SOM): 20-40 businesses in Year 1

### Shipping Pain Points (Local Context)

1. **Wineries:** Need to optimize mixed-case shipments (6-packs, 12-packs) to minimize breakage and DIM weight
2. **Manufacturers:** Ship odd-shaped parts that don't fit standard boxes
3. **Food Producers:** Need right-sized insulated packaging for perishables
4. **Small Retailers:** Can't afford enterprise packing solutions like Packsize

---

## 3. Competitor Analysis

### Enterprise Solutions (Overkill for SMBs)

| Competitor | Pricing | Features | SMB Fit |
|------------|---------|----------|---------|
| **Packsize** | $50K-$200K+ | On-demand box machines, full automation | ❌ Too expensive |
| **ShipHawk** | Custom/Enterprise | Cartonization, TMS integration | ❌ Complex setup |
| **Optioryx** | €500+/month | 3D cartonization, AI optimization | ❌ Pricey for small ops |
| **ShipWise** | $299+/month | Cartonization rules, WMS | ⚠️ Mid-market only |

### SMB-Friendly Alternatives

| Competitor | Pricing | Pros | Cons |
|------------|---------|------|------|
| **ShipStation** | $9-$229/mo | Rate shopping, labels | No box optimization |
| **Ordoro** | $59-$999/mo | Inventory + shipping | Basic packing logic |
| **Pirate Ship** | Free (pay postage only) | Simple UI, cubic rates | No optimization |
| **Packify.ai** | $29/mo | Box recommendations | Limited local focus |
| **Excel/manual** | Free | Everyone uses it | Error-prone, slow |

### Gap in the Market

**No affordable, easy-to-use box optimization tool exists for small businesses that:**
- Doesn't require $10K+ hardware investments
- Works with existing box inventory
- Provides instant recommendations without complex setup
- Is priced under $50/month
- Understands local business needs

---

## 4. User Personas

### Persona 1: "Warehouse Wendy" — Operations Manager

**Demographics:**
- Age: 35-50
- Role: Warehouse/Operations Manager
- Company: 10-50 employee manufacturer or distributor
- Location: Ashtabula, Geneva, or Conneaut

**Goals:**
- Reduce shipping costs without adding complexity
- Train seasonal/temp workers quickly on packing
- Minimize damaged goods claims

**Pain Points:**
- "We have 30 different box sizes and no one knows which to use"
- High turnover means constantly retraining packers
- Shipping costs eating into already thin margins

**Tech Comfort:** Moderate — Uses ShipStation or similar, Excel for inventory

**Quote:** *"I just want to scan a product and be told what box to grab."*

---

### Persona 2: "Winery Will" — Small Business Owner

**Demographics:**
- Age: 40-65
- Role: Owner/Operator of boutique winery
- Company: 5-20 employees, family-owned
- Location: Grand River Valley wine trail

**Goals:**
- Ship wine efficiently to club members and online orders
- Minimize breakage (expensive!) and DIM weight fees
- Compete with larger wineries on shipping costs

**Pain Points:**
- Mixed case orders (3 reds, 2 whites, 1 rosé) complicate packing
- Shipping costs deter customers from ordering
- Limited storage space for box inventory

**Tech Comfort:** Low-Moderate — Uses Shopify/Square for sales, learns tech reluctantly

**Quote:** *"Every broken bottle costs me $35 in product, replacement shipping, and customer goodwill."*

---

### Persona 3: "Maker Mary" — Artisan/E-commerce Seller

**Demographics:**
- Age: 28-45
- Role: Solopreneur or 2-3 person team
- Company: Handmade goods, specialty foods, craft products
- Location: Ashtabula County, possibly home-based

**Goals:**
- Present professional packaging to compete with Amazon
- Reduce material costs (boxes, fill, tape)
- Scale without hiring a fulfillment team

**Pain Points:**
- Spending too much on packaging materials
- Orders take too long to pack
- Inconsistent customer experience

**Tech Comfort:** High — Early adopter, uses multiple SaaS tools

**Quote:** *"I'm spending $8 to ship a $25 item. There's got to be a better way."*

---

### Persona 4: "Distributor Dan" — B2B Wholesaler

**Demographics:**
- Age: 45-60
- Role: Sales/Operations at wholesale distributor
- Company: 25-100 employees
- Location: Industrial park near I-90

**Goals:**
- Maximize pallet and truck utilization
- Quote accurate shipping to customers upfront
- Reduce freight claims

**Pain Points:**
- Freight costs volatile and hard to predict
- Customers complain about packaging damage
- LTL (Less Than Truckload) inefficiencies

**Tech Comfort:** Low — Prefers phone calls, resists new software

**Quote:** *"If I could show customers exactly how much shipping will cost before they order, I'd close more deals."*

---

## 5. Stakeholder Mapping

### Primary Users (Direct)
| Stakeholder | Interest | Influence | Engagement Strategy |
|-------------|----------|-----------|---------------------|
| Warehouse staff | High efficiency needs | Low (user only) | Simple UI, minimal training |
| Small business owners | Cost savings focus | High (decision maker) | ROI calculator, testimonials |
| Operations managers | Process improvement | High | Reporting, metrics, dashboards |

### Secondary Stakeholders (Indirect)
| Stakeholder | Interest | Engagement Strategy |
|-------------|----------|---------------------|
| End customers | Receive undamaged goods | Indirect via user success |
| Shipping carriers (UPS/FedEx) | Accurate DIM weight | Compliance, API integration |
| Box suppliers | Sell more optimized boxes | Partnership opportunities |

### Local Business Champions (Potential Early Adopters)

**Tier 1 — Ideal First Users:**
1. **Northeast Box Company** (local packaging supplier) — natural partner
2. **Debonné Vineyards** — established shipping program, tech-forward
3. **Creative Millwork of Ohio** — custom products need custom boxes
4. **Ashtabula Rubber Company** — B2B shipping, cost-conscious

**Tier 2 — Growth Targets:**
1. Boutique wineries (M Cellars, South River, etc.)
2. Food producers (cheese, maple syrup, specialty goods)
3. E-commerce sellers (Etsy/Amazon shops in county)
4. Machine shops with parts shipping

**Tier 3 — Expansion:**
1. Lake/Geauga County businesses (similar profile)
2. Cleveland-area small manufacturers
3. Regional distribution centers

---

## 6. Revenue Model Options

### Option A: SaaS Subscription (Recommended)

| Tier | Price | Features | Target |
|------|-------|----------|--------|
| **Starter** | $19/mo | 100 calculations/mo, basic boxes | Solopreneurs |
| **Professional** | $49/mo | Unlimited, custom boxes, analytics | SMBs |
| **Team** | $99/mo | Multi-user, API access, priority support | Growing ops |

**Pros:** Predictable revenue, easy to start, low friction
**Cons:** Churn risk, need continuous value delivery

### Option B: Pay-Per-Use

| Model | Price | Use Case |
|-------|-------|----------|
| **Per calculation** | $0.10-0.25 | Seasonal businesses |
| **Per package shipped** | $0.05 | High-volume, unpredictable usage |

**Pros:** Aligns with customer value, low barrier
**Cons:** Revenue unpredictable, harder to forecast

### Option C: Freemium + Upsell

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | 50 calculations/mo, basic features |
| **Pro** | $39/mo | Unlimited, custom boxes, support |

**Pros:** Viral growth potential, try-before-buy
**Cons:** Free user support burden, conversion challenges

### Option D: Local Partnership Model

- **Free for end users** (wineries, manufacturers)
- **Paid by local suppliers** (Northeast Box Company, packaging distributors)
- Suppliers pay $200-500/mo to have their box catalog featured

**Pros:** Solves chicken-and-egg problem, local business support
**Cons:** Requires sales effort to suppliers, lower margins

### Recommended Hybrid Model

**Primary:** SaaS Subscription (Option A) — Professional tier focus
**Secondary:** Local partnership discounts — 20% off for businesses referred by chamber of commerce
**Tertiary:** Setup/training services — $500-1,500 for on-site training (high-touch local advantage)

**Year 1 Revenue Projection (Conservative):**
- 20 customers × $40 average × 12 months = **$9,600**
- 5 setup services × $750 = **$3,750**
- **Total Year 1: $13,350**

**Year 2 Growth Target:**
- 75 customers × $45 average × 12 months = **$40,500**
- Expansion to Lake/Geauga counties

---

## 7. Technical Feasibility

### Core Algorithm Requirements

**Bin Packing Problem (3D)** — NP-hard, but solvable with heuristics for practical use

**Approach:**
1. **First Fit Decreasing (FFD)** — Fast, good enough for most use cases
2. **Guillotine cuts** — Ensure packable configurations
3. **Rotation handling** — Try all 6 orientations
4. **Fragility/constraints** — Flag orientation-sensitive items

**Complexity:** Moderate — Well-researched problem with established algorithms

### Technology Stack (Aligned with NAI Standards)

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Frontend** | React + Vite | Fast development, modern tooling |
| **Backend** | Firebase (Auth, Firestore, Functions) | Serverless, scalable, low maintenance |
| **Algorithm** | TypeScript/WASM | Client-side for speed, server for complex cases |
| **APIs** | REST/GraphQL | Integration with shipping software |
| **Hosting** | Firebase Hosting | Free tier, CDN, SSL |

### Technical Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Algorithm accuracy | Medium | High | Extensive test suite, conservative estimates |
| Performance at scale | Low | Medium | Client-side calc, Firebase scales automatically |
| API integration complexity | Medium | Medium | Start with CSV import, add APIs later |
| Browser compatibility | Low | Low | Modern browser focus, polyfills if needed |

### Development Estimate

**MVP Build Time:** 6-10 hours (as specified)
**Breakdown:**
- UI/UX: 2-3 hours
- Core algorithm: 2-3 hours
- Firebase setup & auth: 1-2 hours
- Testing & polish: 1-2 hours

**Ongoing Maintenance:** ~2 hours/month

---

## 8. Key Research Findings Summary

### ✅ Opportunities

1. **Strong local market** — 150+ businesses with shipping needs in Ashtabula County
2. **No direct competitor** serving SMBs at affordable price point
3. **Natural partnerships** with Northeast Box Company and local wineries
4. **Clear ROI story** — Save $5-10 per package = easy to justify $49/mo cost
5. **Chamber of Commerce support** — Access to business network

### ⚠️ Challenges

1. **Education required** — Many SMBs don't know they're overspending on shipping
2. **Tech adoption hesitancy** — Some local businesses prefer manual processes
3. **Seasonal variability** — Winery shipping peaks in fall, slow in winter
4. **Integration needs** — Users want Shopify, WooCommerce, ShipStation connections

### 🎯 Recommended Focus

**Initial Niche:** Wineries and artisan food producers
- High-value, fragile products (breakage costly)
- Established shipping programs
- Local concentration (Grand River Valley)
- Chamber/Wine Trail connections for marketing

**Differentiation:** Local, personal support + affordable pricing
- On-site setup assistance
- Understanding of local shipping patterns
- Community-based customer success

---

## 9. Next Steps

1. **Validate with 3-5 local businesses** — Use Phase 2 outreach templates
2. **Build MVP** — Follow Phase 4 build checklist
3. **Beta test with Northeast Box Company** — Natural partner for feedback
4. **Present to Ashtabula Growth Partnership** — Potential support/funding
5. **Launch at local business event** — Chamber meeting or wine trail event

---

*Research compiled by: Noirsys AI*  
*For: New Ashtabula Initiative — BoxFlow Estimator Project*
