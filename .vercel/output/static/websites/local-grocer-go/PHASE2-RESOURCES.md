# Phase 2: Resource Procurement — Local Grocer Go

**Date:** 2026-02-18  
**Status:** 🟡 In Progress  
**Previous:** Phase 1 Research Complete  
**Next:** Phase 3 SPEC.md

---

## 1. SNAP/EBT Online Purchasing — Technical Requirements

### Overview
The USDA Food and Nutrition Service (FNS) runs the **Online Purchasing Pilot** allowing SNAP recipients to purchase groceries online. As of 2024, this is available nationwide (no longer pilot-limited).

### Technical Integration Pathways

#### Option A: Full FNS Authorization (Complex)
| Requirement | Details |
|-------------|---------|
| **FNS Authorization** | Must apply as an online retailer; approval takes 6-12 months |
| **Security Standards** | PCI-DSS compliance for EBT card processing |
| **Transaction Processing** | Must integrate with eligible EBT processor (FIS, Conduent, etc.) |
| **Inventory Requirements** | SNAP-eligible items clearly identified, hot/prepared foods excluded |
| **Delivery/Pickup Rules** | SNAP benefits cannot cover delivery fees; separate payment required |

**Process:**
1. Apply at `www.fns.usda.gov/snap/online-purchasing-pilot`
2. Submit business documentation, security audit
3. Integrate with certified EBT payment processor
4. Pass FNS testing/approval

#### Option B: Partner with Existing SNAP-Authorized Retailer (Recommended)
Instead of direct FNS authorization, partner with a retailer already authorized:

| Existing Authorized Partner | Integration Approach |
|---------------------------|---------------------|
| **Sander's Market** | If they become anchor, they handle EBT; app is ordering frontend only |
| **Harbor Gardens** | Likely not authorized; focus on non-SNAP local producers |
| **Walmart/Giant Eagle** | Already have apps; no partnership value |

**Recommendation:** Defer SNAP integration to Phase 2 post-launch. Launch with credit/debit only, add SNAP later via authorized partner.

### SNAP-Eligible Item Categories (for future reference)
- ✅ Fruits, vegetables, meat, poultry, fish, dairy
- ✅ Breads, cereals, snack foods, non-alcoholic beverages
- ✅ Seeds/plants for growing food
- ❌ Hot/prepared foods, alcohol, tobacco, vitamins, medicines

---

## 2. Payment Processor Comparison

### Recommended: Stripe

| Factor | Assessment |
|--------|------------|
| **Pricing** | 2.9% + $0.30 per transaction; no monthly fee |
| **Developer Experience** | Excellent APIs, comprehensive docs, test environment |
| **Features** | Hosted checkout (Stripe Checkout), saved cards, Apple Pay, Google Pay |
| **Hold Policies** | 7-day rolling reserve for new accounts; improves with volume |
| **Integration Time** | 1-2 days for basic flow |

**Best for:** Tech-forward launch, clean APIs, scalable architecture.

### Alternative: Square

| Factor | Assessment |
|--------|------------|
| **Pricing** | 2.9% + $0.30 online; 2.6% + $0.10 in-person |
| **Ecosystem** | Strong POS integration if Sander's Market uses Square |
| **Features** | Square Online (hosted store), appointments, invoicing |
| **Hold Policies** | Similar to Stripe; can be aggressive for high-ticket items |
| **Integration Time** | 1-2 days; Square Online can be no-code |

**Best for:** If anchor partner already uses Square POS.

### Alternative: Cash on Pickup

| Factor | Assessment |
|--------|------------|
| **Pricing** | Free |
| **Risk** | No-shows, order abandonment |
| **Operations** | Requires order confirmation system |

**Recommendation:** Offer alongside card payment for senior/unbanked users.

### Decision Matrix

| Scenario | Recommended Processor |
|----------|----------------------|
| Launch fast, tech control | **Stripe** |
| Sander's uses Square POS | **Square** |
| Senior/unbanked focus | **Stripe + Cash on Pickup** |
| Lowest fees | **Cash on Pickup** (with deposit option) |

**Current Recommendation:** Start with **Stripe Checkout** for simplicity, add cash option for accessibility.

---

## 3. Stakeholder Contact Registry

### Priority 1: Anchor Partners

| Organization | Role | Contact Method | Status | Notes |
|--------------|------|----------------|--------|-------|
| **Sander's Market - Jefferson** | Grocery anchor | Phone: (440) 576-XXXX | ⏳ Pending | Call to request online ordering pilot partnership |
| **Harbor Gardens** | Producer hub/fulfillment | Email: HarborGardens21@gmail.com | ⏳ Pending | Partnership proposal ready (see below) |
| **Save A Lot Ashtabula** | Secondary grocer | Walk-in: 822 Lake Ave | ⏳ Pending | Locally owned; Nemenz/Kawecki families |

### Priority 2: Data & Network Partners

| Organization | Resource | Contact Method | Value |
|--------------|----------|----------------|-------|
| **Ashtabula Local Food Network** | Producer directory data | ashtabulalocalfood.wordpress.com/contact | 95+ farm contacts |
| **OSU Extension Ashtabula** | Grower network, credibility | osu.edu/extension (Ashtabula office) | Partnership legitimacy |
| **Country Neighbor** | Senior transportation | countryneighbor.org | Referral channel for seniors |

### Priority 3: Municipal/Regulatory

| Organization | Resource | Contact Method | Value |
|--------------|----------|----------------|-------|
| **Ashtabula County Health Dept** | Food handling permits | (440) 576-6010 | Compliance requirements |
| **ACDAA** | Food access programs | ashtabulacounty.org | SNAP outreach partnership |

---

## 4. Partnership Proposal Template — Harbor Gardens

**Subject:** Partnership Proposal: Local Grocer Go — Click & Collect for Ashtabula

**Email Draft:**

```
To: HarborGardens21@gmail.com
Subject: Partnership Proposal: Local Grocer Go — Click & Collect Platform

Hello Harbor Gardens Team,

I'm reaching out on behalf of a community initiative to bring simplified 
online ordering to Ashtabula County's local food ecosystem.

THE OPPORTUNITY
Independent grocers and producers in Ashtabula County have no online 
ordering presence. Rural residents drive 15+ miles for groceries. Seniors 
struggle with transportation. Meanwhile, Harbor Gardens has 50+ local 
vendors with no unified online storefront.

THE SOLUTION: LOCAL GROCER GO
A simplified Click & Collect platform focusing on:
• Staple grocery items from local grocers (eggs, dairy, bread, meat, produce)
• Local producer goods from Harbor Gardens vendors
• No-account-required ordering with SMS confirmation
• Senior-friendly, large-text design
• Pickup coordination to reduce wait times

WHY HARBOR GARDENS?
You're already the community food hub. This tool would:
✓ Drive pre-orders to your vendors
✓ Expand your reach to rural residents who can't visit during hours
✓ Position Harbor Gardens as the digital anchor for local food in Ashtabula
✓ Zero upfront cost — community-funded initiative

THE ASK
Would Harbor Gardens be willing to pilot this as a fulfillment/pickup 
location? We'd start with 3-5 vendors, simple order flow, and iterate 
based on your feedback.

NEXT STEP
I'd love to schedule a 15-minute call or visit to show you a prototype 
and discuss how this could work for your vendors.

Available: [Your availability]

Thank you for considering this. Together we can make local food more 
accessible for everyone in Ashtabula County.

Best regards,
[Name]
[Contact]
```

---

## 5. User Interview Script

### Target Participants
- 3 rural residents (10+ miles from grocery)
- 2 seniors (60+) who use Country Neighbor or struggle with transportation
- 1-2 local producers (eggs, meat, honey)

### Interview Questions — Residents

1. **Current behavior:** How do you currently get groceries? How often? What stores?
2. **Pain points:** What's the hardest part about grocery shopping for you?
3. **Online ordering:** Have you used Instacart, Walmart pickup, or Giant Eagle curbside? What did you like/dislike?
4. **Local preference:** Would you buy more from local producers if it were as easy as a grocery store?
5. **Tech comfort:** Would you use a simple website to order groceries for pickup? Would SMS confirmation help?
6. **Barriers:** What would stop you from using a local ordering service?

### Interview Questions — Seniors

1. **Transportation:** How do you currently get to the grocery store?
2. **Shopping challenges:** What makes grocery shopping difficult for you?
3. **Phone vs web:** Would you prefer to call in an order or use a large-text website?
4. **Support:** Would having a phone number to call with questions make you more comfortable?
5. **Pickup:** If someone gathered your order and you just picked it up, would that help?

### Interview Questions — Producers

1. **Current sales:** Where do you currently sell? Farmers markets? Direct?
2. **Online presence:** Do you have any online ordering capability? Website? Facebook?
3. **Order management:** How do you currently track orders? Phone? Text? Memory?
4. **Inventory:** How often do you update what's available? Daily? Weekly?
5. **Interest:** Would you participate in a shared ordering platform? What would you need?

---

## 6. API & Data Resources

### External APIs (Evaluated)

| Service | API | Use Case | Status |
|---------|-----|----------|--------|
| **Stripe** | stripe.com/docs/api | Payment processing | ✅ Ready |
| **Twilio** | twilio.com/docs | SMS confirmations | ✅ Ready |
| **Google Places** | developers.google.com/maps | Store location data | ⚠️ Optional |
| **OSU Extension Food Guide** | None public | Producer directory | ❌ Manual import |
| **SNAP retailer locator** | fns.usda.gov/snap/retailerlocator | SNAP store validation | ⚠️ Future |

### Data Sources

| Source | Data | Format | Access |
|--------|------|--------|--------|
| **OSU Extension** | 95+ farm contacts | PDF guide | Manual entry |
| **Harbor Gardens** | 50+ vendor list | Unknown | Request |
| **Sander's Market** | Product catalog | None online | Manual/negotiate |

---

## 7. Technical Infrastructure Resources

### Hosting Options

| Platform | Cost | Best For |
|----------|------|----------|
| **Vercel** | Free tier | Next.js app, serverless functions |
| **Netlify** | Free tier | Static sites, forms |
| **Railway/Render** | $5-10/mo | Full-stack with database |

**Recommendation:** Start with Vercel (free) + PlanetScale (free MySQL) or Supabase (free Postgres).

### Database Schema (Draft)

```sql
-- Core tables for MVP
stores (id, name, address, phone, is_active)
products (id, store_id, name, category, price, unit, is_available)
orders (id, customer_name, customer_phone, pickup_time, status, total)
order_items (id, order_id, product_id, quantity, price_at_time)
pickup_slots (id, store_id, slot_time, capacity, reserved)
```

---

## 8. Blockers & External Actions Required

### Before SPEC.md Can Be Finalized

| Blocker | Action Required | Owner |
|---------|-----------------|-------|
| Sander's Market interest | Phone call to Jefferson location | Michael |
| Harbor Gardens partnership | Send proposal email | Michael |
| Producer workflow validation | Interview 1-2 producers | Michael |
| Senior user validation | Interview 2 seniors | Michael |
| SNAP feasibility decision | Decide: Phase 1 or Phase 2 feature | Team |

### Non-Blocking (Can Proceed)

| Item | Decision |
|------|----------|
| Payment processor | Stripe (reversible) |
| Hosting platform | Vercel (reversible) |
| SMS service | Twilio (free trial) |
| Database | Supabase (free tier) |

---

## 9. Phase 2 Completion Status

| Deliverable | Status |
|-------------|--------|
| SNAP/EBT requirements research | ✅ Complete |
| Payment processor comparison | ✅ Complete |
| Stakeholder contact registry | ✅ Complete |
| Partnership proposal template | ✅ Complete |
| User interview scripts | ✅ Complete |
| API resource inventory | ✅ Complete |
| Technical infrastructure plan | ✅ Complete |

### Next Phase Gates

To proceed to **Phase 3: SPEC.md**, the following should be answered:

1. **Has Sander's Market or Harbor Gardens expressed interest?** (Soft commitment for pilot)
2. **Have 2+ user interviews been conducted?** (Validate pain points)
3. **Is SNAP Phase 1 or Phase 2?** (Scope decision)

**If external outreach yields no response within 1 week:** Proceed with SPEC.md using Harbor Gardens as hypothetical anchor (can pivot later).

---

## Files Created/Updated

- `PHASE2-RESOURCES.md` (this file)
- `DELIVERABLES.md` — updated status to Phase 2 Complete

**Status:** 🟡 Phase 2 Resources Documented — Awaiting External Validation
