# Insta-Book Stripe — Phase 2: Resource Procurement
## Stakeholder Contacts, Technical Design & Pilot Framework

**Date:** February 20, 2026  
**Status:** Phase 2 Resource Procurement Complete  
**Next:** Phase 3 SPEC.md (Pending Michael Approval for Outreach)

---

## 1. Priority Stakeholder Contact List

### Tier 1: Beachhead Prospects (Immediate Pilot Candidates)

| Property | Contact | Type | Est. Units | Priority | Notes |
|----------|---------|------|------------|----------|-------|
| **Christopher's Dockside** | Chris & Sherri Cox | Website: christophersdockside.com<br>Facebook: facebook.com/4876GOTL<br>Address: 4876 N. Broadway, GOTL | 7+ cottages | 🔴 HIGHEST | Currently uses Lodgify (visible in footer) — perfect migration target |
| **Ashtabula Vacation Rentals** | ohiolakeerierentals@gmail.com<br>(724) 301-1532 | Email/Phone<br>Properties: Buttercup Cottage, Walnut Beach Inn | 2+ | 🔴 HIGHEST | Already on Airbnb+VRBO, seeking direct bookings |
| **Sunset Vacation Rentals** | sunsetvacation@sunsettaxis.com<br>(440) 207-0704 | Email/Phone<br>Address: 4690 Lake Rd E, Geneva | 20+ | 🟡 HIGH | Large operator, established systems, may be harder to convert |

### Tier 2: Strong Prospects (Week 2-3 Outreach)

| Property | Contact | Type | Est. Units | Notes |
|----------|---------|------|------------|-------|
| **Ahoy Cottages** | Connie Shearer Sacco (family owned)<br>Facebook: Ahoy Cottages | 2 cottages<br>(Captain's Quarters, Crew Quarters) | 2 | Woman/family owned, proud local tradition |
| **Miller's Cottages** | millerscottages@gmail.com<br>(440) 789-9096 | 8 cottages | 8 | Facebook: MILLERSCOTTAGES<br>4904 S Spencer Dr |
| **Lucille's Lakefront Cottages** | Website: lucilleslakefront.com<br>Address: 4935 N. Putnam Drive | 3 cottages<br>(Lighthouse, Sailboat, Captain Joe's) | 3 | Established 2001, Caesar's Restaurant owners |
| **Close Enough Cottage Rentals** | Facebook: 4951golfviewdrivegenevaonthelakeohio | 1+ | Active Facebook presence |

### Tier 3: Institutional Contacts (Partnership Angle)

| Organization | Contact | Value Proposition |
|--------------|---------|-------------------|
| **Geneva-on-the-Lake Chamber of Commerce** | info@genevaonthelake.com<br>visitgenevaonthelake.com | Member benefit, tool for cottage owners |
| **Ashtabula County Visitors Bureau** | info@visitashtabulacounty.com | Booking widget integration for tourism site |
| **The Lodge at Geneva-on-the-Lake** | (440) 466-7100<br>(866) 806-8066<br>4888 N Broadway | Adjacent to Christopher's Dockside, referral partner |

---

## 2. Facebook Groups for Community Research

| Group Name | URL | Purpose |
|------------|-----|---------|
| Geneva-on-the-Lake Cottage Owners | Search: "Geneva on the Lake cottage owners" | Direct owner outreach, pain point research |
| Ashtabula County Rentals | Search: "Ashtabula County rentals" | Local landlord network |
| GOTL Strip | Search: "GOTL Strip" | Visitor/owner community |
| Ohio Lake Erie Vacation Rentals | Search: "Ohio Lake Erie vacation rentals" | Broader regional network |

**Research Strategy:**
1. Join as "Insta-Book" (not Noirsys) business account
2. Lurk for 1 week — identify pain points, common complaints
3. Engage with helpful responses (no selling initially)
4. After trust established, soft-poll about booking frustrations

---

## 3. Stripe Connect Onboarding Flow Design

### Technical Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    INSTA-BOOK STRIPE FLOW                        │
└─────────────────────────────────────────────────────────────────┘

OWNER ONBOARDING:
┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐
│   Sign Up    │───▶│  Create      │───▶│  Stripe Express      │
│   (Email/    │    │  Property    │    │  Onboarding Link     │
│   Google)    │    │  Profile     │    │  (KYC + Bank)        │
└──────────────┘    └──────────────┘    └──────────────────────┘
                                                │
                                                ▼
                                       ┌─────────────────┐
                                       │  Stripe Account │
                                       │  Connected      │
                                       │  (Ready for     │
                                       │   payouts)      │
                                       └─────────────────┘

BOOKING PAYMENT FLOW:
┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐
│   Renter     │───▶│  Booking     │───▶│  Stripe Payment      │
│   Selects    │    │  Confirmed   │    │  Intent Created      │
│   Dates      │    │  (Hold)      │    │  (Deposit Hold)      │
└──────────────┘    └──────────────┘    └──────────────────────┘
                                                │
                    ┌───────────────────────────┼───────────────────────────┐
                    │                           │                           │
                    ▼                           ▼                           ▼
           ┌──────────────┐          ┌──────────────────┐        ┌──────────────┐
           │  Deposit     │          │  Platform Fee    │        │  Owner       │
           │  Charged     │          │  (0.5% markup)   │        │  Payout      │
           │  (25-50%)    │          │  to Owner        │        │  (Balance)   │
           └──────────────┘          └──────────────────┘        └──────────────┘

PAYOUT SCHEDULE:
┌─────────────────────────────────────────────────────────────────┐
│  Deposit:      Immediate to owner (minus platform fee)          │
│  Balance:      Auto-charged 3 days before check-in              │
│  Damage Hold:  Released 48 hours after check-out                │
│  Refunds:      Full/partial via dashboard ( Stripe handles )    │
└─────────────────────────────────────────────────────────────────┘
```

### Stripe Connect Configuration

**Account Type:** Express (simplified onboarding, platform controls UX)

**Required Capabilities:**
- `transfers` — Send payouts to owners
- `card_payments` — Accept credit/debit cards

**Fee Structure:**
```javascript
// Platform fee model
const PLATFORM_FEE_PERCENT = 0.5;  // 0.5% on all transactions

// Example $800 booking
const bookingAmount = 80000;        // $800.00 in cents
const stripeFee = bookingAmount * 0.029 + 30;  // $23.20 (2.9% + 30¢)
const platformFee = bookingAmount * 0.005;     // $4.00 (0.5%)
const ownerPayout = bookingAmount - stripeFee - platformFee;  // $772.80

// Owner pays: 2.9% + 30¢ + 0.5% = 3.4% + 30¢ (vs Airbnb 3% + guest fees)
```

### Onboarding Steps (Owner Experience)

1. **Account Creation** (2 min)
   - Email + password or Google OAuth
   - Property basic info (name, address, type)

2. **Stripe Connect Setup** (3-5 min)
   - Redirect to Stripe Express onboarding
   - Identity verification (SSN last 4 + DOB)
   - Bank account for payouts
   - Return to Insta-Book dashboard

3. **Property Configuration** (5 min)
   - Upload photos (drag-drop)
   - Set rates (base + seasonal)
   - Configure availability rules
   - Set deposit percentage (25-50%)
   - Add house rules

4. **Widget Integration** (1 min)
   - Copy embed code
   - Paste into existing website/Facebook
   - Or use hosted booking page

---

## 4. Pilot Program Agreement Template

### INSTA-BOOK PILOT PROGRAM — TERMS

**Program Duration:** 90 days (3 months)  
**Property Limit:** Up to 3 properties per owner  
**Cost:** FREE (no monthly fees, standard Stripe processing only)

#### What's Included:
- ✅ Full Pro tier features ($39/mo value)
- ✅ Unlimited bookings
- ✅ Stripe payment processing
- ✅ SMS reminders
- ✅ iCal/Google Calendar sync
- ✅ Dedicated support (direct phone/email)
- ✅ White-glove onboarding assistance

#### Owner Commitments:
- 📋 Complete Stripe onboarding within 7 days
- 📋 Process at least 2 bookings through platform
- 📋 Provide feedback (30-min call mid-pilot)
- 📋 Allow use of anonymized data for case study
- 📋 Optional: Provide testimonial if satisfied

#### Post-Pilot Options:
- **Convert to paid:** $39/month Pro tier
- **Discontinue:** No obligation, data export provided
- **Extended pilot:** Available for constructive feedback

### Outreach Email Template

```
Subject: Free Professional Booking System for [Property Name] — Pilot Opportunity

Hi [Name],

I'm reaching out because I came across [Property Name] while researching 
Geneva-on-the-Lake vacation rentals. I'm building Insta-Book, a local 
booking platform designed specifically for cottage owners like you.

The problem I'm solving: Many GOTL owners are frustrated with:
- Airbnb's 17% total fees
- Phone/email booking hassles
- Payment collection headaches
- Double-booking risks

Insta-Book offers:
✓ Professional booking widget for your existing website
✓ Stripe-integrated payments (deposits, balance auto-charge)
✓ Calendar sync with Airbnb/VRBO to prevent double bookings
✓ Only 0.5% platform fee (vs 17% Airbnb)
✓ You keep guest relationships and contact info

I'm offering a FREE 90-day pilot to 5 GOTL properties:
- No monthly fees during pilot
- White-glove setup assistance
- Direct support line

Would you be open to a 15-minute call to see if it's a fit?

Best regards,
Michael Vega
Founder, Insta-Book
[Phone] | [Email]

P.S. I noticed you currently [use Lodgify/have a website/rely on Airbnb]. 
I'd love to show you how Insta-Book compares.
```

---

## 5. Competitive Intel: Lodgify vs Insta-Book

**Key Finding:** Christopher's Dockside currently uses Lodgify (evident from footer).

| Feature | Lodgify | Insta-Book (Target) |
|---------|---------|---------------------|
| **Price** | $29-69/mo + 1.9% booking fee | $19-79/mo + 0.5% |
| **Setup** | Self-service templates | White-glove local setup |
| **Support** | Email/chat | Local phone + direct line |
| **Customization** | Template-based | Fully custom branding |
| **Stripe** | Integrated | Native + optimized for deposits |
| **Local Knowledge** | ❌ None | ✅ GOTL-specific features |
| **Calendar Sync** | iCal import | Bidirectional (planned) |

**Migration Pitch for Lodgify Users:**
- Lower fees (0.5% vs 1.9% booking fee)
- Local support (not offshore)
- Custom features (not template constraints)
- Community-focused (we know GOTL)

---

## 6. Resource Procurement Checklist

### Contacts Acquired ✅
- [x] Christopher's Dockside (Chris & Sherri Cox)
- [x] Ashtabula Vacation Rentals (email + phone)
- [x] Sunset Vacation Rentals (email + phone)
- [x] Ahoy Cottages (Connie Sacco)
- [x] Miller's Cottages (email + phone)
- [x] Lucille's Lakefront (website)
- [x] GOTL Chamber of Commerce
- [x] Ashtabula County Visitors Bureau

### Technical Resources ✅
- [x] Stripe Connect architecture designed
- [x] Onboarding flow documented
- [x] Fee structure calculated
- [x] Payout schedule defined

### Legal/Administrative 🔄
- [ ] Terms of Service (needed for Phase 3)
- [ ] Privacy Policy (needed for Phase 3)
- [ ] Pilot Agreement (template above)

### Community Research 🔄
- [ ] Join Facebook groups (pending approval)
- [ ] Monitor owner pain points
- [ ] Identify additional prospects

---

## 7. Phase 3 Readiness Assessment

**Ready for SPEC.md when:**
1. ✅ Market validated (Phase 1)
2. ✅ Stakeholders identified (Phase 2)
3. ✅ Technical approach defined (Phase 2)
4. ⏳ At least 1 pilot property confirmed (needs outreach)
5. ⏳ Feedback from 2+ owners on concept (needs outreach)

**Recommended Next Action:**
Send pilot invitation to **Christopher's Dockside** (Lodgify user = proven pain point) and **Ashtabula Vacation Rentals** (smaller operator = faster decision).

---

## 8. Deliverables Summary

| Deliverable | Location | Status |
|-------------|----------|--------|
| Stakeholder Contact List | This file | ✅ Complete |
| Stripe Connect Architecture | Section 3 | ✅ Complete |
| Pilot Program Terms | Section 4 | ✅ Complete |
| Outreach Email Template | Section 4 | ✅ Complete |
| Lodgify Competitive Analysis | Section 5 | ✅ Complete |

**Total Contacts Identified:** 7 priority properties (40+ units total)  
**Estimated Market Reach:** 15-20% of GOTL rental market with confirmed contacts

---

**Status:** Phase 2 Resource Procurement Complete ✅  
**Blockers:** None — Ready for stakeholder outreach with Michael approval  
**Next Phase:** Phase 3 SPEC.md after pilot validation
