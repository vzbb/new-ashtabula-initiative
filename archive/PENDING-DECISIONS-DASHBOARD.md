# New Ashtabula Initiative — Pending Decisions Dashboard

**Generated:** 2026-02-16 9:56 PM ET  
**Purpose:** Consolidated view of all decisions blocking project progress  
**Action Required:** Review and respond to items marked 🔴 **BLOCKING**

---

## 🔴 CRITICAL — Blocking Critical Path

### 1. permit-whisperer: Send Outreach Emails (Day 1-3 Blocked)
**Status:** Outreach package ready since Feb 16, awaiting approval to send  
**Impact:** Cannot proceed to SPEC.md without stakeholder feedback  
**Decision:** Approve sending 3 emails to CitizenServe, City PCD, and County Building Dept  
**Effort:** 5 minutes to forward/approve; 2-3 day response window  
**Risk if delayed:** 2-3 day slip in timeline, permits season approaching  

**Email Recipients:**
| Contact | Purpose | Risk Level |
|---------|---------|------------|
| CitizenServe Support | API access inquiry | Low — information request only |
| Chris McClure, City PCD | Local partnership | Low — value proposition offered |
| Ashtabula County Building | Technical accuracy review | Low — feedback request |

**Pre-drafted content:** `projects/new-ashtabula-initiative/websites/permit-whisperer/PHASE2-OUTREACH-PACKAGE.md`

**Options:**
- ✅ **APPROVE:** I will note approval and await responses before proceeding
- 📝 **EDIT FIRST:** Send me edits/changes and I will revise before sending
- ⏸️ **PAUSE:** Explicitly defer and I will shift to other P0 sites
- ❌ **REJECT:** Cancel permit-whisperer and I will prioritize invest-ashtabula

---

## 🟡 HIGH — Blocking Build Phase

### 2. invest-ashtabula: MVP vs Full Build Decision
**Status:** Phase 2 spec complete, ready for build kickoff  
**Impact:** Determines 4-day vs 2-week timeline, resource allocation  
**Decision:** Proceed with MVP (4 days, static data) or wait for full build (2 weeks, Supabase backend)?

**MVP Scope:**
- Static JSON for 3 sample sites
- No backend/database
- Contact form via Resend
- 4-day implementation

**Full Build Scope:**
- Supabase + PostGIS for dynamic data
- Admin dashboard for AADC
- Calendly integration
- 2-week implementation

**Recommendation:** Start MVP now — delivers deployable demo in 4 days, can enhance to full build later  

**Open Questions:**
1. Photography budget for site photos? (Can use stock initially)
2. Domain preference? (invest.ashtabula.oh.us or investashtabula.com)
3. AADC stakeholder review before build or after MVP?
4. Utility data access — can we get real capacity data or use representative data?

---

### 3. contractor-match: Monetization & Verification Strategy
**Status:** Phase 1 research complete, 8 open questions  
**Impact:** Determines build scope, revenue model, go-to-market  
**Decision:** Choose verification level and monetization approach

**Verification Options:**
- **Level 1 (Self-reported):** Fastest, lowest trust, free to contractors
- **Level 2 (Document upload):** Manual review, medium trust, small fee
- **Level 3 (API integration):** OCILB lookup, highest trust, but Ohio has no license API

**Monetization Options:**
- **Free for all:** Growth-first, monetize later via premium features
- **Lead fees:** Charge contractors per matched project (requires volume)
- **Subscription:** Monthly fee for verified contractors
- **Municipal sponsorship:** City pays to offer as resident service

**Recommendation:** Level 2 verification + Municipal sponsorship model — unique differentiator, aligns with New Ashtabula mission  

---

## 🟢 MEDIUM — Optimization & Polish

### 4. zoning-clerk: Continue to Phase 3B?
**Status:** Phase 3A complete (foundation scaffolded), ready for Phase 3B  
**Impact:** Adds Permit Wizard + Historic District checker + citations  
**Decision:** Continue with Phase 3B (3-4 hours) or pause for other priorities?

**Phase 3B Features:**
- Permit Wizard (4-step state machine)
- Historic District checker
- Citation system with source metadata
- Tabbed layout (Chat, Wizard, Contacts)

**Note:** No blockers — can proceed independently while waiting on permit-whisperer outreach  

---

### 5. P0 Site Priority Reordering
**Current Priority:** permit-whisperer → contractor-match → invest-ashtabula  
**Question:** Should we reorder based on new information?

**Case for reordering:**
- invest-ashtabula has clearest path to deployment (no external dependencies)
- contractor-match has strongest differentiation (municipal partnership)
- permit-whisperer has highest resident impact but external blockers

**Recommendation:** Parallel track — advance invest-ashtabula MVP while waiting on permit-whisperer outreach responses  

---

## 📊 Decision Summary Matrix

| Decision | Urgency | Impact | Your Action |
|----------|---------|--------|-------------|
| Send permit-whisperer emails | 🔴 High | Critical path | Approve/Edit/Pause/Reject |
| invest-ashtabula MVP vs Full | 🟡 Medium | Timeline | Choose scope |
| contractor-match monetization | 🟡 Medium | Revenue model | Choose strategy |
| zoning-clerk Phase 3B | 🟢 Low | Feature depth | Continue/Pause |
| P0 priority reorder | 🟢 Low | Resource allocation | Confirm/Change |

---

## 🎯 Recommended Immediate Actions

1. **This session:** Approve or edit permit-whisperer outreach emails
2. **This week:** Decide invest-ashtabula scope and kickoff build
3. **Next week:** Confirm contractor-match strategy
4. **Ongoing:** Parallel work on zoning-clerk Phase 3B as filler

---

## 📝 How to Respond

**Quick responses (copy/paste one line):**
- `Approve permit-whisperer emails, proceed with invest-ashtabula MVP, continue zoning-clerk`
- `Edit permit-whisperer: [your changes]`
- `Pause permit-whisperer, prioritize invest-ashtabula full build`
- `Reject permit-whisperer, focus on contractor-match`

**Detailed responses:** Address individual decisions above with your preference and any context.

---

*Last updated: 2026-02-16 9:56 PM ET*  
*Next review: After responses received or Feb 17 heartbeat*
