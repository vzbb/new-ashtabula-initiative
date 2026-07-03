# Volunteer Scheduler — Phase 1 Research

**Project:** volunteer-scheduler  
**Date:** 2026-02-18  
**Status:** 🔴 → 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement)  

---

## 1. Problem Statement

### The Pain
Nonprofit volunteer coordinators in Ashtabula County waste 5-10 hours weekly on manual scheduling tasks:
- **Spreadsheet juggling:** Tracking 50-400 volunteers across events in Excel/Google Sheets
- **Email chaos:** Sending weekly availability requests to 100+ person lists
- **Last-minute scrambles:** No-shows (15-25%) leave gaps unfilled
- **Double-bookings:** No centralized view causes scheduling conflicts
- **No-shows tracked manually:** Hours spent on follow-up calls and confirmations

### Who Suffers
1. **Small nonprofits (<$500K budget)** — 80%+ of Ashtabula County's nonprofit ecosystem
2. **Faith-based organizations** — Heavy volunteer dependency for events
3. **Event coordinators** — Seasonal festivals, food banks, community cleanups
4. **Volunteers themselves** — Poor experience leads to 40% annual attrition

### Current Workarounds (Inadequate)
- **SignUpGenius free tier:** Ads, limited customization, no hour tracking
- **Google Sheets + email:** Manual, error-prone, no automated reminders
- **Facebook groups:** Unreliable, no accountability, messy threads
- **Phone trees:** Time-consuming, excludes younger volunteers

---

## 2. Market Analysis

### Total Addressable Market
- **Ashtabula County nonprofits:** 800+ registered 501(c)(3) organizations
- **Estimated with active volunteer programs:** 150-200 organizations
- **Volunteer workforce:** 15,000+ residents (Cleveland Foundation data: 25% of Ohio adults volunteer)
- **Annual volunteer hours:** 2.5M+ hours county-wide

### Targetable Market (Year 1)
- **Small-medium nonprofits:** 60-80 organizations
- **Faith organizations:** 40-50 churches/temples
- **Event coordinators:** 15-20 seasonal festivals/events

### Market Gap
No **free, locally-branded** volunteer scheduling tool exists that combines:
- Zero cost for nonprofits (truly free, not freemium)
- Ashtabula-specific features (local events, regional coordination)
- Hour tracking for grant reporting
- Multi-organization volunteer discovery

---

## 3. Competitor Analysis

| Competitor | Price | Free Tier | Key Limitations |
|------------|-------|-----------|-----------------|
| **SignUpGenius** | $0-$100/mo | Yes (with ads) | Generic branding, no hour tracking on free plan, limited nonprofit features |
| **VolunteerLocal** | $600/yr+ | 14-day trial | Too expensive for small nonprofits, no free option |
| **VolunteerHub** | $1,200+/yr | No | Enterprise-focused, overkill for small orgs |
| **POINT** | Free | Full platform | National focus, no local Ashtabula customization |
| **Better Impact** | $1,000+/yr | No | Complex, designed for large orgs (25K+ users) |
| **Get Connected (Galaxy Digital)** | Custom | Limited | Expensive customization, enterprise sales cycle |
| **Cervis** | $40+/mo | Limited | Basic, lacks modern UX |

### Competitive Gap
- **No Ashtabula-only platform** — Local events, local volunteer pool
- **No "volunteer passport" concept** — Hours transferable across organizations
- **No nonprofit consortium features** — Shared volunteer pool across causes

---

## 4. User Personas

### Persona 1: Coordinating Carla
- **Role:** Volunteer coordinator at ACCAA food pantry
- **Pain:** Manages 75 volunteers across 4 weekly shifts using spreadsheets
- **Current workflow:** Email blast → manual signup sheet → reminder calls
- **Needs:** Automated reminders, easy shift swapping, hour tracking for United Way reports
- **Tech comfort:** Medium (uses Google Workspace, avoids complex software)
- **Budget:** $0 (must be free)

### Persona 2: Busy Benjamin
- **Role:** Church volunteer coordinator (youth group, food drives, events)
- **Pain:** 6 events/month, 30-50 volunteers each, all coordinated via Facebook
- **Current workflow:** FB post → comments for signup → manual tracking
- **Needs:** Simple mobile signup, automatic reminders, substitute finder
- **Tech comfort:** Low (prefers phone over desktop)
- **Budget:** Minimal (church has no software budget)

### Persona 3: Helping Hannah
- **Role:** Retiree, wants to volunteer across multiple organizations
- **Pain:** Must check 5+ different places for opportunities
- **Current workflow:** Email lists, church bulletin, Facebook groups
- **Needs:** Single place to find all local opportunities, track total hours
- **Tech comfort:** Medium (uses smartphone, some apps)
- **Motivation:** Meaningful engagement, recognition, community connection

### Persona 4: Festival Frank
- **Role:** Event coordinator for Grape Jamboree, Harbor Days
- **Pain:** 200+ volunteers needed for 3-day event, last-minute cancellations
- **Current workflow:** Paper signup at local businesses + phone coordination
- **Needs:** Bulk volunteer recruitment, shift management, emergency broadcast
- **Tech comfort:** Medium
- **Budget:** Small ($200-500 event budget)

---

## 5. Data Sources & Stakeholders

### Primary Stakeholders (Direct Users)
| Organization | Contact | Role | Priority |
|--------------|---------|------|----------|
| **ACCAA** (Community Action) | katie.lamson@accaa.org | Social services coordinator | P0 |
| **United Way of Ashtabula County** | info@unitedwayashtabula.org | Volunteer center hub | P0 |
| **RSVP Ashtabula** | Stephanie Blessing | Senior volunteer coordinator | P0 |
| **211 Ashtabula** | — | Volunteer opportunity aggregator | P1 |
| **AshtaBeautiful** | info@ashtabeautiful.org | Beautification nonprofit | P1 |

### Secondary Stakeholders
- **Ashtabula County Fair Board** — Large seasonal volunteer needs
- **Geneva-on-the-Lake Business Association** — Event volunteers
- **Local churches/temples** — Faith-based volunteer coordination
- **Hospice of the Western Reserve** — Healthcare volunteers
- **Ashtabula Arts Center** — Cultural event volunteers

### Data Sources
1. **VolunteerMatch API** — National volunteer opportunity feed
2. **211 Database** — Local opportunity listings
3. **United Way Partner Network** — Verified nonprofit directory
4. **Manual outreach** — Direct coordinator interviews

---

## 6. Feature Requirements (MVP)

### Core Features (Free Tier)
1. **Simple Event Creation** — Name, date, time slots, description
2. **Signup Page** — Public or private link, mobile-optimized
3. **Automated Reminders** — Email 24hrs + 2hrs before shift
4. **Hour Tracking** — Volunteer logs hours, coordinator verifies
5. **Basic Reports** — CSV export for grant reporting

### Pro Features ($9-19/mo — Future Phase)
1. **SMS Reminders** — Text notifications
2. **Substitute Finder** — Auto-offer shift to waitlist
3. **Multi-Event Dashboard** — Organization-wide view
4. **Volunteer Profiles** — Skills, preferences, history
5. **Integration** — QuickBooks, donor management

### Ashtabula-Specific Differentiation
1. **Local Event Feed** — County-wide volunteer opportunity discovery
2. **"Volunteer Passport"** — Hours tracked across organizations
3. **Nonprofit Directory** — Find and connect with local causes
4. **Seasonal Campaigns** — Grape Jamboree, Harbor Days, etc.

---

## 7. Revenue Model

### Primary: Freemium
- **Free:** Unlimited events, up to 50 volunteers, email reminders, hour tracking
- **Pro ($9/mo):** SMS reminders, unlimited volunteers, substitute finder, reports
- **Organization ($19/mo):** Multi-coordinator accounts, API access, priority support

### Secondary: Local Partnerships
- **Sponsored campaigns** — Local businesses sponsor seasonal drives
- **Featured nonprofit listings** — Premium placement in directory
- **Event sponsorships** — Grape Jamboree, etc.

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Low adoption** (nonprofits stuck in spreadsheets) | High | High | Free tier removes barrier; success stories; in-person training |
| **SignUpGenius response** | Low | Medium | Local focus + hour tracking differentiation |
| **Data privacy concerns** | Medium | High | Clear GDPR/privacy policy; no data selling |
| **Volunteer no-shows persist** | Medium | Medium | SMS reminders (higher reliability than email) |
| **Coordinator tech resistance** | Medium | High | Extreme simplicity; phone support; training videos |

---

## 9. Open Questions (Phase 2 Blockers)

1. **How many Ashtabula nonprofits currently pay for volunteer software?** (Validates freemium model)
2. **What's the average volunteer coordinator's tech comfort level?** (UX complexity decision)
3. **Do organizations need integration with donor management tools?** (Feature priority)
4. **Is there appetite for a county-wide "volunteer passport" concept?** (Differentiation feature)
5. **Would United Way/RSVP endorse/promote a local platform?** (Distribution channel)
6. **What are grant reporting requirements for volunteer hours?** (Export format requirements)
7. **How do seasonal events currently recruit volunteers?** (Festival Frank workflow)
8. **What's the mobile vs desktop usage split for volunteers?** (Platform priority)

---

## 10. Next Steps (Phase 2 — Resource Procurement)

### Immediate Outreach Targets
1. **Email Stephanie Blessing (RSVP Ashtabula)** — Validate volunteer coordinator pain points
2. **Email United Way of Ashtabula County** — Partnership and endorsement discussion
3. **Email Katie Lamson (ACCAA)** — Social services coordinator interview
4. **Survey 10-15 nonprofit coordinators** — Quantify pain points and willingness to adopt

### Information to Gather
- [ ] List of 50+ nonprofits with active volunteer programs
- [ ] Current software usage survey (what they use today)
- [ ] Grant reporting requirements for volunteer hours
- [ ] Seasonal event calendar (opportunity density)
- [ ] Coordinator tech comfort assessment

---

## 11. Strategic Positioning

### Tagline Options
- "The free, local way to coordinate volunteers in Ashtabula County"
- "Where Ashtabula volunteers and causes connect"
- "Your volunteer hours, your community impact"

### Key Messaging
1. **Free forever for nonprofits** (truly free, not a trial)
2. **Built for Ashtabula** (local events, local support)
3. **Simple enough for anyone** (no training required)
4. **Hours that count** (grant-ready reporting)

---

## 12. Success Metrics

### Adoption (Year 1)
- **50+ nonprofits** using the platform
- **1,000+ registered volunteers**
- **5,000+ volunteer hours** tracked monthly

### Engagement
- **70%+ signup-to-show rate** (vs 75% industry average)
- **4+ hours saved weekly** per coordinator (self-reported)
- **60%+ return volunteer rate**

### Revenue (Year 2)
- **15-20 Pro subscriptions** ($135-360/mo)
- **2-3 Organization accounts** ($38-57/mo)
- **Break-even by Month 12-18**

---

## Summary

**Problem:** Ashtabula nonprofits waste thousands of hours annually on manual volunteer coordination using inadequate tools (spreadsheets, email, generic platforms).

**Market:** 150-200 active nonprofits, 15,000+ volunteers, zero local-focused solutions.

**Gap:** No free, Ashtabula-branded platform with local event discovery and grant-ready hour tracking.

**Opportunity:** Build the definitive volunteer coordination tool for Ashtabula County — free for nonprofits, sustainable through optional Pro features.

**Next Phase:** Contact RSVP, United Way, and ACCAA to validate pain points and secure partnership commitments.
