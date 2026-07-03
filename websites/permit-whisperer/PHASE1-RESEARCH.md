# Permit Whisperer — Phase 1 Research & Recon
**Date:** 2026-02-16
**Status:** Complete — Ready for Phase 2 Resource Procurement

---

## Executive Summary

The Ashtabula County permitting system operates on a **two-stage workflow**:
1. **Zoning Permit** from City of Ashtabula (or local township)
2. **Building Permit** from Ashtabula County Building Department (Jefferson)

The County recently launched a **CitizenServe online portal** that enables digital permit applications, inspection requests, and contractor registration. This represents a significant modernization opportunity for the Permit Whisperer tool.

---

## 1. Stakeholder Mapping

### Primary Authority: Ashtabula County Building Department
| Attribute | Detail |
|-----------|--------|
| **Location** | 25 W. Jefferson Street, Jefferson, OH 44047 (Old Court House, 1st Floor) |
| **Phone** | (440) 576-3737 |
| **Jurisdiction** | All of Ashtabula County including City of Ashtabula |
| **Online Portal** | https://www.citizenserve.com/ashtabula |
| **Portal Support** | 1-800-325-9818 |
| **Plan Review Email** | Taylor Todd (TETodd@ashtabulacounty.us), Cari Ellsworth (CAEllsworth@ashtabulacounty.us) |

**Key Functions:**
- Building permit issuance (residential & commercial)
- Demolition permits
- Plumbing inspections (now integrated into building permits)
- Plan review (up to 30 days)
- Inspection scheduling (Option #2 for residential)

### Secondary Authority: City of Ashtabula Zoning/PCD
| Attribute | Detail |
|-----------|--------|
| **Department** | Planning & Community Development (PCD) |
| **Email** | PCD@cityofashtabula.com |
| **Fax** | (440) 992-7180 |
| **Review Time** | Up to 1 week |
| **Payment** | At pickup (fees vary by project) |

**Key Functions:**
- Zoning permits for physical changes to property
- First step in two-stage process
- Required BEFORE building permit application

---

## 2. Permit Types & Requirements Matrix

### Zoning Permits (City of Ashtabula)
**Required for:**
- Swimming pools
- Sheds
- Decks
- Garages
- Fences
- Any changes to premise condition

**Process:**
1. Download/fill PDF form from city website
2. Submit via: in-person, fax (440-992-7180), or email (PCD@cityofashtabula.com)
3. Wait up to 1 week for review
4. Pick up permit and pay fees

### Building Permits (County Building Department)
**Required for:**
- New construction
- Structural changes
- Projects requiring plumbing/electrical inspection
- Demolition

**Process:**
1. Obtain zoning permit first (if applicable)
2. Submit via CitizenServe portal OR in-person at Jefferson office
3. Plan review (up to 30 days)
4. Pay fees (calculated after review)
5. Schedule inspections via (440) 576-3737

---

## 3. Fee Structure

### Residential Projects
- **Base calculation:** 1% of total project value (state requirement)
- **Cancellation fee:** $40.00 administration fee deducted for cancelled permits
- **Extension:** One free 6-month extension if requested before expiration

### Payment Methods
- **Current:** Cash or check (mail or drop-off)
- **Coming soon:** Credit card via CitizenServe portal (delayed)

### Fee Exceptions
- **Decks:** Exempt if less than 30" from finish grade
- **Sheds:** One-story detached accessory structures under 200 sq ft exempt from building permit (zoning permit still required)
- **Playground structures:** Exempt

---

## 4. Data Sources & APIs

### CitizenServe Portal (Primary)
**URL:** https://www.citizenserve.com/ashtabula

**Current Capabilities:**
- Submit permit applications
- Request inspections
- Contractor registration/renewal
- Document upload
- Payment processing (coming soon)

**UNVERIFIED:** API availability — No public API documentation found. May require:
- Web scraping (fragile)
- Contact CitizenServe directly for partner API access
- iframe integration (if supported)

### Document Resources
- **Zoning Contacts:** https://www.ashtabulacounty.us/DocumentCenter/View/1746/Ashtabula-County-Zoning-Contacts-2023
- **Fee Schedule:** https://www.ashtabulacounty.us/DocumentCenter/View/149/Fees---Residential--Commercial
- **Residential Requirements:** https://www.ashtabulacounty.us/203/Residential-Permit-Requirements

---

## 5. Workflow Analysis

### Current Resident Experience
```
Resident wants to build deck
        ↓
[UNSURE] Do I need permits?
        ↓
Call City? Call County? Website hunt
        ↓
Discover: Need Zoning Permit FIRST
        ↓
Download PDF, fill, submit
        ↓
Wait up to 1 week
        ↓
Get Zoning Permit
        ↓
Apply for Building Permit (CitizenServe or in-person)
        ↓
Wait up to 30 days for plan review
        ↓
Pay fees
        ↓
Schedule inspections
        ↓
Complete project
```

### Pain Points Identified
1. **Confusion:** Unclear which permits needed, in what order
2. **Two locations:** City office for zoning, Jefferson for building
3. **No unified guidance:** Residents must piece together requirements
4. **PDF forms:** Manual fill/print/fax/email process for zoning
5. **30-day wait:** No transparency on plan review status
6. **Phone-only inspection scheduling:** No online booking

---

## 6. Competitive Landscape

### CitizenServe Portal
- **Strengths:** Online applications, document upload, contractor registry
- **Weaknesses:** No intelligent guidance, static forms, no mobile optimization mentioned

### Permit Whisperer Opportunity
- Pre-qualification wizard ("Do I need a permit?")
- Unified view of both zoning + building requirements
- Document checklist generator
- Status tracking (if API available)
- Cost estimator
- Mobile-first design

---

## 7. Open Questions (Phase 2 Research)

### Technical Integration
- [ ] Does CitizenServe offer API access for partners?
- [ ] Can we embed their portal via iframe?
- [ ] Is there a webhook/callback system for status updates?

### Content Verification
- [ ] Obtain official fee schedule for all permit types
- [ ] Get current zoning permit application forms (PDF links)
- [ ] Confirm inspection types and requirements

### Stakeholder Engagement
- [ ] Contact PCD@cityofashtabula.com — interest in partnership?
- [ ] Contact TETodd@ashtabulacounty.us — Building Dept feedback?
- [ ] Interview 2-3 residents about permitting experience

### Scope Refinement
- [ ] Start with City of Ashtabula only, or include all townships?
- [ ] Focus on residential only, or include commercial?
- [ ] MVP: Informational only, or integrate with CitizenServe?

---

## 8. Recommendations for Phase 2

### Option A: Informational MVP (Low Risk)
Build an intelligent guide that:
- Asks project questions → tells user exactly which permits needed
- Provides fee estimates
- Links to correct forms
- Explains workflow clearly
- No external integrations required

**Effort:** 2-3 days
**Value:** High (reduces confusion, improves resident experience)
**Blockers:** None

### Option B: CitizenServe Integration (Medium Risk)
- Contact CitizenServe about API/partnership
- Attempt iframe embedding of their application forms
- Build unified application flow

**Effort:** 1-2 weeks
**Value:** Very High (true one-stop shop)
**Blockers:** CitizenServe API availability unknown

### Option C: Full Workflow Automation (High Risk)
- Direct integration with both City and County systems
- Automated status tracking
- Digital submission handling

**Effort:** 4-6 weeks
**Value:** Very High
**Blockers:** Requires official partnerships, API access unlikely

### Recommended Path
**Start with Option A** (Informational MVP) to deliver immediate value while exploring Option B partnerships in parallel.

---

## 9. Resources for Phase 2

### Immediate (No Blockers)
- Fee schedule document download
- Zoning permit forms inventory
- Create decision tree logic for permit requirements

### Requires Outreach
- CitizenServe API inquiry
- City PCD partnership discussion
- County Building Dept feedback session

### Nice to Have
- Resident user interviews
- Comparative analysis with other OH municipalities
- CitizenServe demo/trial access

---

## Deliverables Checklist
- [x] Stakeholder mapping complete
- [x] Permit types & requirements documented
- [x] Fee structure captured
- [x] Data sources identified
- [x] Workflow pain points analyzed
- [x] Phase 2 recommendations defined
- [x] Open questions listed for resolution

**Next Step:** Phase 2 Resource Procurement — Begin with CitizenServe API inquiry and City PCD outreach.
