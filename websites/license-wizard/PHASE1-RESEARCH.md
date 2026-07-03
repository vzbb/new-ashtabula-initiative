# License Wizard — Phase 1 Research & Recon
**Date:** February 17, 2026  
**Status:** 🟡 Phase 1 Complete  
**Project:** license-wizard (P1 Civic Tool)

---

## Problem Statement

New and existing business owners in Ashtabula face confusion navigating:
1. **Multi-layered licensing** — City, county, state, and federal requirements
2. **Industry-specific permits** — Different rules for restaurants, contractors, retail, etc.
3. **Zoning compliance** — Whether their business type is allowed at a specific location
4. **Renewal tracking** — When licenses expire and how to renew
5. **Cost uncertainty** — Total cost of compliance before starting

**Current pain:** Business owners must visit multiple websites, make phone calls, and often discover missing requirements after starting operations.

---

## Competitor Analysis

### Direct Competitors

| Competitor | Approach | Price | Gap |
|------------|----------|-------|-----|
| **BizFilings Business License Wizard** (Wolters Kluwer) | National database of 19,000+ jurisdictions | ~$99-299 | Not free; no local Ashtabula guidance; generic instructions |
| **LegalZoom** | Business formation + licensing add-on | $199-499 | Expensive; focuses on formation; not location-specific |
| **Rocket Lawyer** | Legal docs + licensing guidance | $39.99/mo | Subscription model; limited local expertise |
| **BusinessLicenses.com** | License research service | Variable | Paid service; not self-serve |

### Indirect Competitors

| Tool | Approach | Gap |
|------|----------|-----|
| **Ohio Business Gateway** | State permits only | No city/county guidance; not user-friendly |
| **City of Ashtabula website** | PDF forms only | No wizard; no guidance; hard to navigate |
| **Ashtabula County website** | Permit requirements listed | Not interactive; no business type filtering |
| **Accountants/Lawyers** | Professional advice | Expensive; not self-serve |

### Key Insights

1. **No free local tool exists** — All competitors are national, paid, or not user-friendly
2. **Fragmented information** — Business owners must piece together requirements from multiple sources
3. **High failure cost** — Operating without proper licenses can result in fines or shutdown
4. **Opportunity for differentiation:** Free, Ashtabula-specific, industry-tailored guidance

---

## User Personas

### 1. Maria — Aspiring Restaurant Owner
- **Age:** 42, former line cook wanting to open café
- **Needs:** Food service license, liquor license (maybe), health permits, signage permits
- **Pain point:** "I don't know what I don't know — I just want a checklist"
- **Tech comfort:** Medium — uses smartphone, not a lawyer

### 2. James — Contractor Going Solo
- **Age:** 35, leaving construction company to start own business
- **Needs:** Contractor registration, liability insurance proof, maybe EPA certification
- **Pain point:** "I've been told I need different licenses for each city I work in"
- **Tech comfort:** Low-medium — prefers simple, clear instructions

### 3. Sarah — Home-Based Business
- **Age:** 28, freelance graphic designer
- **Needs:** Home occupation permit, zoning verification, tax registration
- **Pain point:** "Can I even legally work from home? What's allowed?"
- **Tech comfort:** High — expects modern web app experience

### 4. David — Expanding Retail Owner
- **Age:** 55, opening second location
- **Needs:** Quick verification he has everything, transfer/amend existing licenses
- **Pain point:** "I did this once 10 years ago — have the rules changed?"
- **Tech comfort:** Low — needs clear, printable guidance

---

## Data Sources & Requirements Mapping

### Federal Level (if applicable)
| License/Permit | Business Types | Source |
|----------------|----------------|--------|
| EIN (Tax ID) | All except sole proprietors | IRS.gov |
| Alcohol (TTB) | Breweries, distilleries | ttb.gov |
| Agriculture | Farms, food processing | USDA |
| Firearms | Gun shops | ATF |
| Transportation | Trucking, logistics | DOT/FMCSA |

### Ohio State Level
| License/Permit | Business Types | Source | Cost |
|----------------|----------------|--------|------|
| **Secretary of State Registration** | LLCs, Corps | Ohio SOS | $99 LLC / $125 Corp |
| **Vendor's License** | Retail sales | Ohio Dept of Taxation | $25 |
| **Professional Licenses** | Varies by profession | eLicense Ohio | Varies |
| **Unemployment Insurance** | Employers | Ohio Job & Family Services | Free |
| **Workers' Comp** | Employers (most) | BWC | Based on payroll |
| **Environmental Permits** | Manufacturing, waste | Ohio EPA | Varies |

**Key Finding:** Ohio does NOT require a general state business license for LLCs — only entity registration + industry-specific licenses.

### Ashtabula County Level
| License/Permit | Business Types | Source | Contact |
|----------------|----------------|--------|---------|
| **Commercial Building Permits** | Construction, renovation | County Building Dept | 440-576-9090 |
| **Septic/Well Permits** | Rural businesses | Health District | Varies |
| **Home Occupation** | Home-based businesses | City PCD | PCD@cityofashtabula.com |

### City of Ashtabula Level
| License/Permit | Business Types | Source | Cost |
|----------------|----------------|--------|------|
| **Zoning Permit** | Structure changes, new use | City PCD | Varies |
| **Sign Permit** | Business signage | City PCD | Varies |
| **Plumbing Inspection** | New/renovated plumbing | City PCD | Waived for existing structures |
| **Swimming Pool/Shed/Deck** | Property improvements | City PCD | Varies |

**Process:** Forms → Submit to PCD@cityofashtabula.com or fax 440-992-7180 → ~1 week review → Pay fees → Receive permit

---

## Industry-Specific Requirements (Ashtabula Focus)

### Food Service
- ✅ Vendor's License (state)
- ✅ Food Service License (County Health Dept)
- ✅ Sign Permit (city)
- ✅ Zoning compliance (city)
- Liquor License (state — if applicable)

### Construction/Contractors
- ✅ Contractor registration (varies by type)
- ✅ Commercial permits (county)
- ✅ Liability insurance (typically required)
- EPA Lead-Safe Certification (if pre-1978 work)

### Retail
- ✅ Vendor's License (state)
- ✅ Sign Permit (city)
- ✅ Zoning compliance (city)

### Home-Based Business
- ✅ Home Occupation Permit (city)
- ✅ Zoning verification (city)
- May need: Vendor's License (if selling goods)

### Professional Services (consulting, accounting, etc.)
- May need: Professional license (state)
- May need: Home Occupation Permit (if home-based)

---

## Stakeholder Outreach Targets

| Organization | Contact | Purpose | Priority |
|--------------|---------|---------|----------|
| **City of Ashtabula PCD** | PCD@cityofashtabula.com | Verify requirements, get forms | P0 |
| **Ashtabula County Building Dept** | 440-576-9090 | Commercial permit details | P0 |
| **Ashtabula County Health Dept** | (varies) | Food service licensing | P1 |
| **Ashtabula SBDC** | Contact via OSU | Business advising partnership | P1 |
| **Chamber of Commerce** | Local office | Member resource, promotion | P2 |

---

## Technical Architecture Considerations

### Data Model
```
BusinessProfile:
  - businessType (industry)
  - location (home-based / commercial / mobile)
  - employees (yes/no)
  - hasPhysicalLocation (yes/no)
  - sellsProducts (yes/no)
  - servesFood (yes/no)
  - sellsAlcohol (yes/no)
  - constructionWork (yes/no)
  - professionalService (yes/no)

LicenseRequirement:
  - name
  - level (federal/state/county/city)
  - authority
  - cost
  - renewalPeriod
  - forms[]
  - prerequisites[]
```

### Wizard Flow
1. **Business Type** → What industry?
2. **Location** → Home-based? Commercial? Mobile?
3. **Activities** → Selling products? Food? Alcohol? Construction?
4. **Employees** → Will you have employees?
5. **Results** → Personalized checklist with links, costs, contacts

---

## Open Questions (Blockers for Phase 2)

1. **Can we get official endorsement from City PCD?** (Validation + accuracy)
2. **Are there any fees we can embed/pay through the tool?** (Revenue model)
3. **What industries are most common in Ashtabula?** (Prioritize wizard paths)
4. **Do we need to account for township vs city jurisdiction?** (Complexity)
5. **How often do requirements change?** (Maintenance burden)

---

## Strategic Positioning

### Differentiation Matrix

| Feature | BizFilings | LegalZoom | **License Wizard (Ours)** |
|---------|------------|-----------|---------------------------|
| **Price** | $99-299 | $199-499 | **FREE** |
| **Local specificity** | Generic | Generic | **Ashtabula-tailored** |
| **Interactive wizard** | Basic | No | **Guided step-by-step** |
| **Printable checklist** | Yes | Yes | **Yes + calendar reminders** |
| **Direct form links** | Yes | Yes | **Yes + pre-filled where possible** |
| **Zoning verification** | No | No | **Planned integration** |

### Value Proposition
> "The free, simple way for Ashtabula businesses to understand exactly what licenses they need — no lawyer required."

---

## Next Steps (Phase 2: Resource Procurement)

1. **Email City PCD** — Verify all requirements, request partnership
2. **Email County Building** — Confirm commercial permit details
3. **Interview 3-5 local business owners** — Validate pain points
4. **Map all PDF forms** — Download and catalog from city/county websites
5. **Draft outreach email** — For SBDC and Chamber partnerships

---

## References

- City of Ashtabula Zoning: https://www.cityofashtabula.com/zoning
- Ashtabula County Commercial Permits: https://www.ashtabulacounty.us/202/Commercial-Permit-Requirements
- Ohio SOS Business Start: https://www.ohiosos.gov/businesses/
- Ohio Business Gateway: https://business.ohio.gov/
- BizFilings License Wizard: https://www.wolterskluwer.com/en/solutions/bizfilings/tools-and-resources/business-license-wizard
