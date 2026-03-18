# Phase 1 Research — Eligibility Screener
**Project:** eligibility-screener  
**Type:** Community Service / Social Services Directory  
**Target:** Ashtabula County residents seeking assistance  
**Date:** 2026-02-18  
**Status:** Phase 1 Complete — Ready for Phase 2 (Resource Procurement) and Phase 3 (SPEC)

---

## 1. Problem Statement

### Resident Pain Points
- **Information fragmentation:** Social services are spread across county, state, and nonprofit organizations with no unified entry point
- **Eligibility confusion:** Residents don't know which programs they qualify for based on income, family size, age, or circumstances
- **Application complexity:** Each program has different applications, documentation requirements, and processes
- **Missed opportunities:** Many eligible residents don't apply for benefits they're entitled to (SNAP participation rate in Ohio is ~85%, leaving 15% unclaimed)
- **Crisis navigation:** When facing emergency needs (eviction, utility disconnection, hunger), residents struggle to find help quickly

### Existing Gaps
- No single tool connects residents to all available programs
- 211 service exists but requires phone navigation
- County websites have program lists but no eligibility wizard
- Nonprofits operate independently without cross-referral coordination

---

## 2. Stakeholder Analysis

### Primary Service Providers (Government)

| Organization | Services | Contact | Application Method |
|--------------|----------|---------|-------------------|
| **Ashtabula County DJFS** | SNAP, Medicaid, OWF cash assistance, Childcare subsidies | 2924 Donahoe Dr, Ashtabula, OH<br>Phone: (440) 998-1111<br>Fax: 440-998-1538<br>ssp.benefits.ohio.gov | Online (Ohio Benefits), Mail, In-person |
| **Ashtabula County Community Action Agency (ACCAA)** | HEAP, PIPP, Weatherization, Emergency assistance | 440-997-5957<br>accaa.org | In-person, Phone |
| **Direction Home of Eastern Ohio** | Long-term care, Medicaid waivers, caregiver support | dheo.org | Phone, Online |
| **Ohio Benefits** | Statewide benefits portal | ssp.benefits.ohio.gov | Online |

### Secondary Providers (Nonprofit/Community)

| Organization | Services | Contact |
|--------------|----------|---------|
| **Country Neighbor** | Food bank (serves 26 local pantries) | countryneighbor.org |
| **Ashtabula Dream Center** | Basic needs, youth services | ashtabuladreamcenter.org |
| **211 Ashtabula County** | Information and referral | 211 or 211ashtabula.org |
| **Ashtabula County Council on Aging** | Senior services, prescription assistance | Ashtabula Senior Center |
| **4C for Children** | Childcare resource and referral | 4cforchildren.org |

---

## 3. Program Inventory

### Food & Nutrition

| Program | Eligibility | Benefit | Application |
|---------|-------------|---------|-------------|
| **SNAP** (Food Stamps) | Income ≤ 130% FPL | Monthly EBT benefits | Ohio Benefits portal |
| **WIC** | Pregnant/postpartum women, infants, children ≤5, income ≤ 185% FPL | Nutrition food package, education | Local WIC clinic |
| **Food Pantries** | Emergency need (varies by pantry) | Groceries, hot meals | Walk-in (varies) |
| **SNAP-Ed** | SNAP recipients eligible | Nutrition education | OSU Extension Ashtabula |

### Healthcare

| Program | Eligibility | Benefit | Application |
|---------|-------------|---------|-------------|
| **Medicaid** | Income ≤ 138% FPL, or disability, or pregnancy | Health insurance | Ohio Benefits portal |
| **Healthchek** | Medicaid recipients under 21 | Well-child visits, dental | Automatic with Medicaid |
| **Prescription Assistance** | Seniors, low-income | Discounted medications | Council on Aging |

### Cash & Emergency Assistance

| Program | Eligibility | Benefit | Application |
|---------|-------------|---------|-------------|
| **Ohio Works First (OWF)** | Families with children, income ≤ 50% FPL | Cash assistance, job training | Ohio Benefits portal |
| **HEAP** | Income ≤ 150% FPL, pays heating costs | One-time utility payment | ACCAA (440-997-5957) |
| **PIPP Plus** | Income ≤ 150% FPL, utility customers | Percentage of income payment plan | ACCAA or Ohio Development |
| **Winter Crisis Program** | In disconnect status or <25% fuel | Emergency utility assistance | ACCAA |

### Housing

| Program | Eligibility | Benefit | Application |
|---------|-------------|---------|-------------|
| **Section 8 / Housing Choice Voucher** | Income ≤ 50% area median | Rent subsidy | Local housing authority |
| **Emergency Shelter** | Homeless or at-risk | Temporary housing | 211 referral |
| **Weatherization** | Income ≤ 150% FPL | Home energy improvements | ACCAA |

### Childcare & Family

| Program | Eligibility | Benefit | Application |
|---------|-------------|---------|-------------|
| **Publicly Funded Child Care** | Working parents or in training, income limits | Subsidized childcare | ACDJFS (Fax: 440-998-1538) |
| **Adult Protective Services** | Adults 60+ in danger of harm | Investigation, services | aps.jfs.ohio.gov or call |
| **Child Protective Services** | Children at risk of abuse/neglect | Investigation, services | ACDJFS |

### Senior Services

| Program | Eligibility | Benefit | Application |
|---------|-------------|---------|-------------|
| **Home-Delivered Meals** | Homebound seniors 60+ | Daily meals | Council on Aging |
| **Caregiver Support** | Family caregivers | Respite, training, resources | Direction Home |
| **PASSPORT Medicaid Waiver** | Seniors needing nursing home level care | In-home services | Direction Home |

---

## 4. Eligibility Logic Framework

### Income Guidelines (2025 Federal Poverty Level - approximate)

| Household Size | 100% FPL | 130% FPL (SNAP) | 138% FPL (Medicaid) | 150% FPL (HEAP/PIPP) | 185% FPL (WIC) |
|----------------|----------|-----------------|---------------------|----------------------|----------------|
| 1 | $15,060 | $19,578 | $20,783 | $22,590 | $27,861 |
| 2 | $20,440 | $26,572 | $28,207 | $30,660 | $37,814 |
| 3 | $25,820 | $33,566 | $35,632 | $38,730 | $47,767 |
| 4 | $31,200 | $40,560 | $43,056 | $46,800 | $57,720 |
| 5 | $36,580 | $47,554 | $50,480 | $54,870 | $67,673 |

### Decision Tree (High-Level)

```
START: What do you need help with?
├── Food/Groceries
│   ├── Emergency (need food today) → Food Pantries
│   ├── Regular assistance → SNAP (check income ≤ 130% FPL)
│   └── Have children under 5 → WIC (check income ≤ 185% FPL)
├── Healthcare
│   ├── No insurance → Medicaid (check income ≤ 138% FPL)
│   ├── Have Medicaid + under 21 → Healthchek (automatic)
│   └── Prescription costs → Senior prescription programs
├── Utilities
│   ├── Gas/electric help → HEAP (check income ≤ 150% FPL)
│   ├── Want lower monthly bills → PIPP Plus
│   └── In disconnect crisis → Winter Crisis Program
├── Cash/Emergency
│   ├── Have children + need cash → OWF
│   └── Behind on rent → Emergency assistance (varies)
├── Childcare
│   └── Working or in school + need childcare → Publicly Funded Child Care
└── Senior Services (60+)
    ├── Homebound + meals → Home-Delivered Meals
    ├── Caregiver needs support → Caregiver Support Program
    └── Need nursing home level care → PASSPORT Waiver
```

---

## 5. Competitive Analysis

### Existing Solutions

| Solution | Type | Pros | Cons |
|----------|------|------|------|
| **Ohio Benefits (ssp.benefits.ohio.gov)** | State portal | Comprehensive, official | Complex, no wizard, overwhelming |
| **211** | Phone hotline | Human assistance, comprehensive | Wait times, phone-only, hours limited |
| **findhelp.org** | National directory | Wide coverage, searchable | Not Ashtabula-specific, no eligibility guidance |
| **Benefits.gov** | Federal screening | Federal programs included | Not county-specific, dated interface |
| **SingleStop** | Nonprofit tool | Multi-benefit screening | Limited Ohio coverage |

### Gap Analysis
- No tool specifically targets Ashtabula County residents
- No simple wizard interface for eligibility screening
- No consolidated application checklist generator
- No Spanish language support for local services
- No mobile-first design for residents with limited computer access

---

## 6. User Personas

### Persona 1: "Working Mom Maria"
- **Demographics:** 32, single mom, 2 kids (ages 3 and 6), works retail $14/hr
- **Needs:** Childcare subsidy, SNAP, possibly WIC
- **Pain points:** Doesn't know she qualifies for childcare help; overwhelmed by application paperwork
- **Tech use:** Smartphone primary, limited data plan

### Persona 2: "Senior Sam"
- **Demographics:** 72, widower, fixed Social Security income, home owned
- **Needs:** HEAP, property tax assistance, maybe home-delivered meals
- **Pain points:** Doesn't know about PIPP program; worried about winter heating bills
- **Tech use:** Tablet with grandkids' help, prefers simple interfaces

### Persona 3: "Recently Unemployed Mike"
- **Demographics:** 45, laid off from factory, married, 2 kids
- **Needs:** SNAP, Medicaid, possibly OWF cash assistance
- **Pain points:** Never used benefits before, doesn't know where to start, pride barrier
- **Tech use:** Computer at library, smartphone

### Persona 4: "Caregiver Carol"
- **Demographics:** 58, caring for elderly mother with dementia, works part-time
- **Needs:** Caregiver support, respite care, Medicaid waiver for mom
- **Pain points:** Doesn't know PASSPORT program exists, exhausted, no time to research
- **Tech use:** Moderate, uses Facebook

---

## 7. Technical Considerations

### Data Sources
- **Ohio Benefits API:** Limited public API; primarily web portal
- **Program data:** Public information from county websites, can be curated
- **211 data:** Potential partnership for directory information
- **Income calculations:** Federal guidelines published annually

### Integration Possibilities
- **Deep links:** Link directly to Ohio Benefits portal with pre-filled parameters (if supported)
- **PDF generation:** Create personalized application checklist with required documents
- **SMS notifications:** Remind users of application deadlines or document needs

### Privacy Considerations
- Eligibility screener can be anonymous (no PII required)
- Optional email capture for checklist delivery only
- Clear disclaimer: "This is not an application—results are estimates only"

---

## 8. Open Questions for Phase 2

### Stakeholder Outreach Needed
1. **ACDJFS:** Can we get accurate program contact info and eligibility updates? Are they open to partnership?
2. **ACCAA:** HEAP/PIPP program details and application assistance availability?
3. **211 Ashtabula:** Data sharing or API access for directory information?
4. **County on Aging:** Senior program details and referral process?

### Content Verification
1. Are there program changes coming in 2025-2026 we should know about?
2. What are the most common eligibility mistakes residents make?
3. Which programs have the longest waitlists or limited funding?
4. Are there any programs NOT listed here that should be included?

### Technical Questions
1. Does Ohio Benefits portal support URL parameters for pre-screening?
2. Are there any existing eligibility APIs we could leverage?
3. What languages are most needed after English? (Spanish likely priority)

---

## 9. Phase 2 Action Items

### Resource Procurement
- [ ] Contact ACDJFS for program verification and partnership discussion
- [ ] Contact ACCAA for HEAP/PIPP details
- [ ] Contact 211 for directory data partnership
- [ ] Contact County on Aging for senior program details
- [ ] Research Spanish translation requirements

### Parallel Documentation
- [ ] Create detailed program database with all eligibility rules
- [ ] Document all application forms and required documents
- [ ] Compile contact information for all service providers
- [ ] Create income calculator with 2025 FPL guidelines

---

## 10. Next Steps

**Phase 2:** Resource procurement (outreach to stakeholders)  
**Phase 3:** SPEC.md creation with detailed wizard logic and UI/UX  
**Phase 4:** Build implementation  
**Phase 5:** Deploy and community outreach

---

## Appendix A: Quick Reference Links

| Resource | URL |
|----------|-----|
| Ohio Benefits Portal | https://ssp.benefits.ohio.gov |
| ACDJFS | https://www.acdjfs.org |
| ACCAA | https://accaa.org |
| 211 Ashtabula | https://www.211ashtabula.org |
| Direction Home | https://dheo.org |
| Country Neighbor | https://countryneighbor.org |
| Ohio APS | https://aps.jfs.ohio.gov |

---

## Appendix B: Income Calculator Reference

```javascript
// 2025 FPL Guidelines (approximate - verify current year)
const FPL_2025 = {
  1: 15060,
  2: 20440,
  3: 25820,
  4: 31200,
  5: 36580,
  6: 41960,
  7: 47340,
  8: 52720
};

// Calculate percentage of FPL
function calculateFPL(householdSize, annualIncome) {
  const fpl = FPL_2025[householdSize] || FPL_2025[8] + (householdSize - 8) * 5380;
  return (annualIncome / fpl) * 100;
}

// Check eligibility thresholds
const ELIGIBILITY = {
  snap: 130,
  medicaid: 138,
  heap: 150,
  wic: 185,
  owf: 50
};
```

---

**Research compiled:** 2026-02-18  
**Next heartbeat:** Begin Phase 2 outreach or start SPEC.md for eligibility-screener
