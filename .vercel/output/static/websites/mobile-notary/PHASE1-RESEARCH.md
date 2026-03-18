# mobile-notary — Phase 1 Research
## Mobile Notary Booking Platform for Ashtabula County

**Research Date:** 2026-02-18  
**Researcher:** Rondell (Noirsys AI)  
**Status:** Phase 1 Complete → Ready for Phase 2

---

## 1. Problem Statement

Finding and booking a mobile notary in Ashtabula County is currently inefficient and fragmented:

- **No centralized directory** — Residents must search multiple sources (Google, Facebook, word-of-mouth)
- **Unclear availability** — Most notaries don't publish real-time availability online
- **Pricing opacity** — Travel fees and service rates vary widely; no upfront quotes
- **Booking friction** — Phone tag, delayed responses, manual coordination
- **Verification concerns** — Hard to confirm credentials, commission status, insurance
- **Last-minute urgency** — Real estate closings, legal deadlines often need same-day service

### Key Insight
Mobile notaries exist in Ashtabula but operate as fragmented solo practitioners. There is no "Uber for notaries" experience — customers waste time calling multiple providers to find availability.

---

## 2. Target User Personas

### Persona A: "Closing Chris" (Primary)
- Home buyer/seller in real estate transaction
- Needs: Loan document notarization (often 100+ pages)
- Time sensitivity: HIGH — closing scheduled, deadline fixed
- Pain point: Title company schedules notary, but customer prefers to choose their own
- Tech comfort: Moderate — expects online booking like any other service

### Persona B: "Elderly Eleanor"
- Senior citizen, limited mobility
- Needs: Power of attorney, advance directives, will notarization
- Pain point: Cannot travel to notary office; needs in-home service
- Tech comfort: Low — may need family member to book on her behalf

### Persona C: "Business Ben"
- Small business owner needing regular notarizations
- Needs: Contracts, affidavits, business documents
- Pain point: Inconsistent availability of preferred notary
- Tech comfort: High — wants recurring appointment scheduling

### Persona D: "Remote Rachel"
- Lives in rural Conneaut/Roaming Shores area
- Needs: Document notarization, limited local options
- Pain point: Few notaries serve rural zip codes; travel fees unpredictable
- Tech comfort: Moderate — smartphone user

---

## 3. Competitive Landscape

### Local Ashtabula Mobile Notaries (Direct Competition)

| Provider | Location | Notes |
|----------|----------|-------|
| **Notes and Prints Mobile** | Ashtabula | notesandprintsmobile.com — "reliable mobile notary services for Ashtabula and surrounding areas" |
| **Rai's Mobile Notary LLC** | Ashtabula | raismobilenotary.com — Offers remote online notary (RON) + in-person; "civil and corporate" focus |
| **OneNotary.us** | Ashtabula | onenotary.us — Platform model, coverage in Ashtabula area |
| **NotaryWide.com** | Ashtabula County | notarywide.com — Directory of roaming notaries by zip code |

### National Platforms (Indirect Competition)

| Platform | Model | Pros | Cons |
|----------|-------|------|------|
| **Snapdocs** | B2B platform for title companies | Enterprise-grade, automated | Not for consumer direct booking |
| **SigningOrder** | Signing service platform | Real-time tracking | Notary-side focus, not consumer |
| **NotaryAssist** | Notary business management | Scheduling tools | For notaries, not customers |
| **CloseWise** | Notary database + scheduling | Smart matching | Signing services focus |
| **Calendly/Setmore** | Generic scheduling | Easy to use | No notary-specific features |
| **NotaryCam / Notarize** | Remote online notary (RON) | 24/7 availability | Limited to online-only, not in-person |

### Gap Analysis
**No existing solution offers:**
1. Consumer-facing mobile notary booking specifically for Ashtabula County
2. Upfront pricing with travel fee calculator by zip code
3. Real-time availability from multiple local notaries
4. Integrated credential verification (commission status, insurance)
5. Both in-person mobile AND remote online notary options

---

## 4. Stakeholders to Contact (Phase 2)

### Primary: Mobile Notaries (Recruit to Platform)
| Notary/Business | Contact | Why | Priority |
|-----------------|---------|-----|----------|
| **Notes and Prints Mobile** | notesandprintsmobile.com | Established local presence | HIGH |
| **Rai's Mobile Notary LLC** | raismobilenotary.com | Already tech-savvy (offers RON) | HIGH |
| **Ashtabula County Law Library** | 440-576-3690 | Notary education provider, network access | HIGH |
| **Local banks/credit unions** | Various | Staff notaries may want side work | MEDIUM |

### Secondary: Demand Sources
| Organization | Role |
|--------------|------|
| **Title companies** (First American, Chicago Title, etc.) | Source of closing notary demand |
| **Real estate agents** | Refer clients needing notaries |
| **Law offices** | Document notarization referrals |
| **Ashtabula County Clerk of Courts** | Document recording, notary needs |
| **Senior centers / libraries** | Elderly population access point |

---

## 5. Technical/Data Sources

### Notary Verification Data
| Source | URL | Purpose |
|--------|-----|---------|
| Ohio Secretary of State Notary Search | https://www.ohiosos.gov/notary/ | Verify commission status |
| Ohio Notary Commission Application | https://notary.ohiosos.gov/ | Understanding requirements |

### Ohio Notary Requirements (for verification logic)
- Must be 18+ years old
- Ohio resident OR nonresident attorney with Ohio office
- No disqualifying criminal convictions
- Complete 3-hour education + 1-hour continuing ed
- BCI background check required
- Commission term: 5 years
- **Remote Online Notary (RON)** requires additional authorization

### Pricing Research (Market Rates)
- Ohio maximum notary fee: $5 per signature (ORS 147.51)
- Mobile/travel fees: $25-$75 typical (not regulated)
- Loan signing agent fees: $75-$200 per closing
- After-hours/same-day premium: +$25-$50

---

## 6. Business Model Options

### Option A: Marketplace (Recommended)
- **Consumer free** to search/book
- **Commission from notaries**: 10-20% of transaction OR monthly subscription ($29-$99/mo)
- **Value prop for notaries**: Lead generation, scheduling automation, payment processing

### Option B: SaaS for Notaries
- Notaries pay monthly fee for booking tools
- Consumer-facing directory is free marketing
- $19-$49/month per notary

### Option C: Premium Consumer Features
- Basic booking: Free
- Priority/same-day: $9.99 fee
- After-hours: $19.99 fee
- Corporate accounts: $99/month

### Recommended: Hybrid
- Free directory + booking
- Notary subscription for premium features (scheduling, invoicing, reviews)
- Consumer convenience fees for rush requests

---

## 7. Differentiation & Value Proposition

| Feature | mobile-notary (Proposed) | Generic Search | Snapdocs |
|---------|-------------------------|----------------|----------|
| Ashtabula-specific | ✅ Yes | ⚠️ Mixed | ❌ B2B only |
| Upfront pricing | ✅ Yes | ❌ No | ❌ No |
| Credential verified | ✅ Yes | ❌ No | ✅ Yes |
| Real-time booking | ✅ Planned | ❌ No | ✅ Yes |
| Customer reviews | ✅ Planned | ⚠️ Google only | ✅ Yes |
| RON + Mobile | ✅ Both | ❌ Rare | ⚠️ Varies |

### Core Value Prop
> "Book a verified mobile notary in Ashtabula County — see upfront pricing, real availability, and reviews. In-person or online, scheduled in under 2 minutes."

---

## 8. Critical Blockers for Phase 2

1. **Notary recruitment?** — Need 3-5 local notaries willing to join platform
2. **Insurance verification?** — How to confirm E&O (Errors & Omissions) insurance?
3. **Pricing model acceptance?** — Will notaries pay subscription or accept commission?
4. **RON integration?** — Partner with existing RON platform or build?
5. **Same-day fulfillment?** — Guarantee or no guarantee? (Inventory challenge)

---

## 9. Success Metrics

| Metric | Target (6 months) | Measurement |
|--------|------------------|-------------|
| Notaries on platform | 5+ active | Sign-ups |
| Booking requests | 50+/month | Analytics |
| Completed appointments | 30+/month | Notary confirmation |
| Customer rating | 4.5+ stars | Post-appointment survey |
| Avg response time | <2 hours | Platform tracking |

---

## 10. Recommended MVP Features

### Phase 1 MVP (Week 1-2)
- [ ] Notary directory with profiles (photo, bio, coverage area)
- [ ] Simple booking request form (customer info, document type, location, urgency)
- [ ] Email notification to notary + customer
- [ ] Basic credential display (commission #, expiration)
- [ ] Mobile-responsive design

### Phase 2 (Month 2)
- [ ] Real-time availability calendar integration
- [ ] Automated SMS/email reminders
- [ ] Customer review system
- [ ] Payment integration (Stripe) — hold until service complete
- [ ] Travel fee calculator by zip code

### Phase 3 (Month 3+)
- [ ] Remote Online Notary (RON) integration
- [ ] Corporate accounts with invoicing
- [ ] Notary mobile app for on-the-go management
- [ ] API for title company integrations

---

## 11. Next Steps (Phase 2: Resource Procurement)

1. **Contact Notes and Prints Mobile** — Explore partnership interest
2. **Contact Rai's Mobile Notary** — Discuss RON capabilities, platform interest
3. **Reach out to Ashtabula County Law Library** — Network with new/renewing notaries
4. **Survey local title companies** — Understand current notary sourcing pain points
5. **Legal review** — Platform terms of service, liability disclaimers

---

## Appendix: Key Contacts Summary

| Organization | Contact | Phone/Email |
|--------------|---------|-------------|
| Notes and Prints Mobile | Website contact | notesandprintsmobile.com |
| Rai's Mobile Notary LLC | Website contact | raismobilenotary.com |
| Ashtabula County Law Library | 25 W Jefferson St, Jefferson | (440) 576-3690 |
| Ohio Secretary of State Notary | Online portal | https://notary.ohiosos.gov/ |

---

**Document Status:** Complete for Phase 1  
**Next Action:** Stakeholder outreach (above)  
**Risk Level:** Medium — marketplace chicken-and-egg (need supply and demand)
