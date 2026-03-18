# Requirements & Features — Boat Storage Waitlist

**Project:** boat-storage-waitlist  
**Date:** 2026-02-18  
**Status:** Phase 2 — Requirements Gathering (Pending Stakeholder Interviews)

---

## Core Features (Based on Research)

### 1. Customer-Facing Waitlist Signup
| Feature | Priority | Notes |
|---------|----------|-------|
| Mobile-responsive signup form | P0 | Most boaters will use phones |
| Boat details (type, length, storage type) | P0 | Needed for space planning |
| Contact info (name, phone, email) | P0 | SMS + email dual confirmation |
| Desired timeframe | P1 | When they need storage |
| Alternate contact method | P2 | Backup communication |

### 2. Automated Communications
| Feature | Priority | Notes |
|---------|----------|-------|
| Instant SMS confirmation | P0 | 90% open rate vs 20% email |
| Email confirmation with details | P0 | Paper trail, reference |
| Waitlist position updates | P1 | "You're #3 in line" |
| Availability alerts | P0 | "A spot opened up — confirm in 24hrs" |
| Follow-up reminders | P1 | Reduce no-shows |

### 3. Admin Dashboard (Marina View)
| Feature | Priority | Notes |
|---------|----------|-------|
| Waitlist queue visualization | P0 | See everyone at a glance |
| Boat filtering/sorting | P1 | By type, size, date needed |
| Manual entry capability | P1 | For phone/walk-in inquiries |
| Status tracking | P0 | Waitlist → Offered → Confirmed → Declined |
| Notes/communication history | P2 | Per-customer tracking |

### 4. Upsell Integration
| Feature | Priority | Notes |
|---------|----------|-------|
| Spring launch prep upsell | P1 | High-margin add-on |
| Winterization services | P1 | Often bundled |
| Maintenance packages | P2 | Oil change, detailing |
| Referral incentives | P2 | "Refer a friend, move up the list" |

### 5. Reporting & Analytics
| Feature | Priority | Notes |
|---------|----------|-------|
| Conversion rate (inquiry → storage) | P1 | Business metric |
| Average wait time | P1 | Customer experience |
| Revenue from upsells | P2 | ROI tracking |
| Peak demand forecasting | P2 | Plan staffing |

---

## Technical Requirements

### Integrations
| System | Purpose | Priority |
|--------|---------|----------|
| SMS gateway (Twilio/AWS SNS) | Text confirmations | P0 |
| Email service (SendGrid/AWS SES) | Email confirmations | P0 |
| Payment processor (Stripe) | Deposits/upsells | P1 |
| Calendar (Google/Outlook) | Schedule pickups | P2 |

### Data Model (Draft)
```
Customer:
  - id, name, phone, email, created_at

Boat:
  - id, customer_id, name, type, length, beam, draft

WaitlistEntry:
  - id, customer_id, boat_id, status, position, 
    storage_type_requested, date_needed, notes

Communication:
  - id, waitlist_entry_id, type (sms/email), 
    direction (in/out), content, sent_at

UpsellOffer:
  - id, waitlist_entry_id, service_type, 
    price, status, accepted_at
```

---

## Competitive Differentiation

| Competitor | Their Strength | Our Differentiation |
|------------|---------------|---------------------|
| Dockwa | National network, 300K+ boaters | Local focus, AI messaging, affordable |
| DockMaster | Enterprise features | Simple, fast setup, small marina pricing |
| Harbour Assist | Waitlist mgmt | Better SMS automation, Lake Erie specific |
| Manual/spreadsheet | Free | Professional, automated, revenue-generating |

---

## Open Questions (To Validate with Marinas)

1. **Pricing sensitivity:** What would you pay monthly for this? ($49? $99? $199?)
2. **Integration needs:** Do you use any existing marina software?
3. **Payment handling:** Would you want us to process deposits or just track?
4. **Multi-location:** Do you manage multiple marinas or just one?
5. **Seasonality:** How early do people start calling for winter storage?
6. **Capacity:** How many boats do you store vs. how many inquire?
7. **Upsell appetite:** What services do you wish you sold more of?
8. **Communication preferences:** Text, email, or phone for your customers?

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Marina adoption | 3-5 pilot marinas | Signed up for beta |
| Customer conversion | 60%+ | Waitlist → paying storage |
| Response time | <5 min | Inquiry → confirmation sent |
| Admin time saved | 5-10 hrs/week | Self-reported by marinas |
| Upsell revenue | +15% | Spring services sold |

---

**Next Steps:**
1. Validate requirements with 3-5 marina interviews
2. Prioritize features based on actual pain points
3. Update SPEC.md with confirmed scope
4. Begin Phase 3: Specification refinement

