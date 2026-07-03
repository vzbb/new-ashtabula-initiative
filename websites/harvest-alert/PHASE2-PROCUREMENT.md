# Phase 2 Resource Procurement — Harvest Alert
**Project:** Harvest Alert — Crop Readiness Notification System  
**Date:** February 18, 2026  
**Researcher:** Rondell ♟️

---

## 1. Executive Summary

Resource procurement phase complete. All critical contacts, APIs, and vendor relationships identified for Harvest Alert MVP development and pilot launch.

**Key Outcomes:**
- ✅ 12 stakeholder contacts documented
- ✅ 5 API integrations mapped
- ✅ SMS/email vendor pricing secured
- ✅ Hosting/cost model validated
- ✅ Anchor farm pilot candidate identified

---

## 2. Stakeholder Contact Registry

### Primary Partners (Launch Critical)

| Organization | Contact Method | Purpose | Status |
|--------------|----------------|---------|--------|
| **Harbor Gardens** | info@harborgardens.org | Pilot venue, farmer network, promotion | Ready to approach |
| **OSU Extension Ashtabula** | 440-576-9004 / ashtabula@osu.edu | Credibility, farmer outreach, crop data | Ready to approach |
| **Ashtabula Farmers Market** | Facebook Messenger / market manager | Vendor recruitment, customer acquisition | Ready to approach |

### Anchor Farm Candidates (Early Adopters)

| Farm | Location | Contact Method | Crops | Fit |
|------|----------|----------------|-------|-----|
| **Peters Creek Farm** | Geneva, OH | LocalHarvest contact form | Mixed vegetables | HIGH - diverse crops |
| **Contraban Farms** | Ashtabula County | Via Harbor Gardens | Vegetables, herbs | HIGH - Harbor Gardens vendor |
| **Brennan's Farm Market** | Rt 84, OH | Phone/Facebook | Strawberries, sweet corn | MEDIUM - u-pick focus |
| **Blueberry Hill Farm** | Madison, OH | (440) 415-0950 | Blueberries | MEDIUM - seasonal |

### Local Food Network

| Organization | Role | Contact | Partnership Potential |
|--------------|------|---------|----------------------|
| **Ashtabula Local Food Network** | Food advocacy | ashtabulalocalfood@wordpress.com | HIGH - aligned mission |
| **Ashtabula County Farm Bureau** | Farmer advocacy | (440) 437-8485 | MEDIUM - member benefit |
| **Country Neighbor** | Senior food access | countryneighbor.org | MEDIUM - senior produce alerts |

### Restaurant Wholesale Buyers

| Restaurant | Chef/Contact | Interest Level |
|------------|--------------|----------------|
| **Bascule Bridge** | Main St, Ashtabula | HIGH - local sourcing |
| **Crows' Nest** | Geneva-on-the-Lake | MEDIUM - seasonal menu |
| **The Lakehouse Inn** | Geneva | MEDIUM - farm-to-table |

---

## 3. API & Service Procurement

### SMS Gateway Providers

| Provider | Cost per SMS | Monthly Minimum | API | Recommendation |
|----------|--------------|-----------------|-----|----------------|
| **Twilio** | $0.0075 | None | ✅ Excellent | **PRIMARY** |
| **MessageBird** | $0.0055 | None | ✅ Good | Alternative |
| **Vonage (Nexmo)** | $0.0062 | None | ✅ Good | Backup option |
| **AWS SNS** | $0.0075 | None | ✅ Good | If already on AWS |

**Decision:** Use **Twilio** for reliability, documentation, and developer experience.

**Cost Projection:**
- 1 farm × 500 subscribers × 4 alerts/month × $0.0075 = **$15/month SMS cost**
- At $19/month Grower tier pricing: **$4 profit margin** (sustainable)
- At scale (1,000 subs × 10 farms): $300/month SMS cost vs $190 revenue = **needs email hybrid**

### Email Service Providers

| Provider | Cost | Free Tier | Recommendation |
|----------|------|-----------|----------------|
| **Resend** | $0.0001/email | 3,000/mo free | **PRIMARY** - modern, clean API |
| **SendGrid** | $0.0001/email | 100/day free | Alternative - mature, complex |
| **Mailgun** | $0.0008/email | 5,000/mo free | Alternative |

**Decision:** Use **Resend** for simplicity and generous free tier.

### Weather Data APIs

| Provider | Cost | GDD Support | Latency | Recommendation |
|----------|------|-------------|---------|----------------|
| **Open-Meteo** | FREE | ✅ Yes | <500ms | **PRIMARY** |
| **NOAA NWS API** | FREE | ❌ Manual calc | <200ms | Backup for US forecasts |
| **Cornell NEWA** | FREE | ✅ Yes | <1s | Pest/disease models |

**Decision:** Use **Open-Meteo** as primary for GDD calculations; NOAA for frost alerts.

### Database & Auth

| Provider | Cost | Postgres | Auth | Realtime |
|----------|------|----------|------|----------|
| **Supabase** | FREE tier: 500MB | ✅ Yes | ✅ Yes | ✅ Yes | **PRIMARY** |
| **Firebase** | FREE tier: 1GB | ❌ NoSQL | ✅ Yes | ✅ Yes | Alternative |
| **Neon** | FREE tier: 500MB | ✅ Yes | ❌ Separate | ❌ No | Alternative |

**Decision:** Use **Supabase** for integrated auth + database + realtime subscriptions.

### Hosting

| Provider | Cost | Edge Network | Serverless | Recommendation |
|----------|------|--------------|------------|----------------|
| **Vercel** | FREE tier: 100GB | ✅ Yes | ✅ Yes | **PRIMARY** |
| **Netlify** | FREE tier: 100GB | ✅ Yes | ✅ Yes | Alternative |
| **Railway** | $5/mo starter | ❌ Limited | ❌ No | Alternative |

**Decision:** Use **Vercel** for Next.js optimization and generous free tier.

---

## 4. Domain & Branding

### Domain Options

| Domain | Available | Cost | Notes |
|--------|-----------|------|-------|
| **harvestalert.app** | ✅ Yes | $12/yr | **PRIMARY** - clean, modern |
| **harvestalert.io** | ✅ Yes | $30/yr | Tech feel |
| **ashtabula.harvest** | ❌ No | — | New TLD, risky |
| **picktime.app** | ✅ Yes | $12/yr | Broader appeal |

**Decision:** Acquire **harvestalert.app** for primary domain.

### Brand Assets Needed

| Asset | Source | Cost | Status |
|-------|--------|------|--------|
| Logo | Fiverr/99designs | $50-200 | Pending |
| App icons | Canva Pro + export | $13/mo | Ready |
| Color palette | Brand guidelines | FREE | Defined (green/gold/earth) |

---

## 5. Legal & Compliance

### Required Documentation

| Document | Purpose | Source | Cost |
|----------|---------|--------|------|
| **Privacy Policy** | Phone number handling | Termly/iubenda | FREE-$30/yr |
| **Terms of Service** | User agreement | Termly/iubenda | FREE-$30/yr |
| **SMS Compliance** | TCPA, opt-in/opt-out | Twilio guidelines | FREE |
| **Cookie Policy** | GDPR/CCPA compliance | Termly/iubenda | FREE-$30/yr |

### Regulatory Considerations

| Regulation | Applies To | Compliance Action |
|------------|------------|-------------------|
| **TCPA** | SMS marketing | Required: Double opt-in, easy opt-out, business hours only |
| **GDPR** | EU users | Unlikely needed for Ashtabula-only launch |
| **CCPA** | California residents | Unlikely needed for local launch |
| **CAN-SPAM** | Email | Include unsubscribe, physical address |

**Decision:** Implement TCPA-compliant SMS workflow from day one.

---

## 6. Cost Model Validation

### MVP Operating Costs (Month 1-3)

| Expense | Monthly Cost | Notes |
|---------|--------------|-------|
| Twilio SMS | $0-15 | Variable by usage |
| Resend Email | $0 | Within free tier |
| Supabase | $0 | Within free tier |
| Vercel | $0 | Within free tier |
| Domain | $1 | amortized |
| Privacy/Terms | $3 | Termly basic |
| **TOTAL MVP** | **~$4-19/mo** | Sustainable at freemium |

### Scale Costs (100 farms, 10,000 subscribers)

| Expense | Monthly Cost | Assumptions |
|---------|--------------|-------------|
| Twilio SMS | $300 | 40K messages |
| Resend Email | $0-5 | 50K emails |
| Supabase Pro | $25 | 8GB database |
| Vercel Pro | $20 | 1TB bandwidth |
| **TOTAL SCALE** | **~$350/mo** | Revenue target: $1,900/mo |

**Margin at scale: 81%** (highly sustainable)

---

## 7. Technical Resources

### Open Source Libraries

| Purpose | Library | License | Status |
|---------|---------|---------|--------|
| UI Components | shadcn/ui | MIT | ✅ Ready |
| Icons | Lucide React | ISC | ✅ Ready |
| Date/Time | date-fns | MIT | ✅ Ready |
| Forms | React Hook Form | MIT | ✅ Ready |
| Validation | Zod | MIT | ✅ Ready |
| Maps | Leaflet | BSD-2 | ✅ Ready |
| Charts | Recharts | MIT | ✅ Ready |

### Developer Tools

| Tool | Purpose | Cost |
|------|---------|------|
| **GitHub** | Source control | FREE (private repos) |
| **GitHub Actions** | CI/CD | FREE (2,000 min/mo) |
| **Sentry** | Error tracking | FREE (5K events/mo) |
| **Plausible** | Analytics | $9/mo (or self-host) |

---

## 8. Pilot Program Resources

### Pilot Structure

**Duration:** 12 weeks (May-July 2026, peak growing season)
**Scope:** 2-3 anchor farms, 200-500 customers
**Success Metrics:**
- 80%+ farmer satisfaction
- 50%+ customer alert open rate
- <5 min average crop status update time
- Zero major outages

### Pilot Support Resources

| Resource | Availability | Owner |
|----------|--------------|-------|
| Harbor Gardens promotion | Venue + social media | Harbor Gardens |
| OSU Extension endorsement | Credibility + farmer network | Extension office |
| Customer acquisition | Farmers market booth | Harvest Alert team |
| Feedback collection | In-app + email surveys | Automated |

---

## 9. Risk Mitigation Resources

| Risk | Mitigation Resource | Cost |
|------|---------------------|------|
| SMS delivery failures | Twilio + MessageBird backup | Minimal |
| Weather API downtime | Open-Meteo + NOAA redundancy | FREE |
| Database corruption | Supabase daily backups | Included |
| Farmer churn | Harbor Gardens relationship | Time investment |
| Seasonal downtime | Cross-promote with local-grocer-go | Shared marketing |

---

## 10. Phase 2 Completion Checklist

- [x] Stakeholder contact list compiled
- [x] API vendors selected and costed
- [x] Domain availability confirmed
- [x] Legal compliance requirements mapped
- [x] Cost model validated (MVP and scale)
- [x] Open source libraries identified
- [x] Pilot program structure defined
- [x] Risk mitigation resources documented

---

## 11. Gates for Phase 3 (SPEC.md)

| Gate | Status | Action Required |
|------|--------|-----------------|
| Domain purchased | 🟡 Ready | Michael to confirm |
| Twilio account created | 🟡 Ready | Developer setup |
| Supabase project created | 🟡 Ready | Developer setup |
| Harbor Gardens contact initiated | 🟡 Ready | Michael to reach out |
| Anchor farm confirmed | 🔴 Blocked | Pending outreach |

**Ready to proceed to Phase 3:** SPEC.md architecture and feature specification.

---

*Phase 2 Complete — All procurement resources documented and ready for implementation.*
