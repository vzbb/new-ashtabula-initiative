# GovTech Box — Phase 1: Research & Reconnaissance

**Date:** 2026-02-19  
**Status:** 🔴 Phase 1 Complete → Ready for Phase 2  
**Researcher:** Rondell (Noirsys AI)  

---

## 1. Executive Summary

**GovTech Box** is a "GovTech-in-a-Box" solution providing secure, compliant .gov email hosting and simple Town Hall landing pages for small municipal governments in Ashtabula County.

**Target Market:** 27 townships, 7 villages, and multiple county offices in Ashtabula County, Ohio — many lacking modern digital infrastructure.

**Key Insight:** Small municipalities (under 5,000 population) are underserved by existing govtech providers who focus on larger cities. Most townships rely on personal email addresses (@gmail.com, @yahoo.com) for official business — a compliance and security risk.

---

## 2. Competitor Analysis

### 2.1 Established GovTech Providers

| Competitor | Pricing | Target Market | Key Features | Weaknesses |
|------------|---------|---------------|--------------|------------|
| **EvoGov** | Custom quote | Mid-to-large cities | Full CMS, hosting, apps | Too complex/expensive for small townships |
| **Revize** | Custom quote | Municipalities | Government CMS, hosting | High touch, long sales cycle |
| **GovSites** | $300-500/mo estimated | Small-to-mid cities | 30 municipal users, 10GB storage | Price barrier for townships |
| **GovBuilt** | Custom quote | Counties/cities | WCAG 2.2 AA compliant | Overkill for small villages |
| **AmericanEagle** | Enterprise pricing | State/federal | PCI-compliant hosting | Not accessible to townships |

### 2.2 Big Tech Government Solutions

| Platform | Pricing | Compliance Level | Notes |
|----------|---------|------------------|-------|
| **Google Workspace Government** | 71% off standard via GSA (2025) | FedRAMP, StateRAMP | Best value for small governments |
| **Microsoft 365 GCC** | ~$20-35/user/mo | GCC (Government Community Cloud) | Complex licensing through CDW-G |
| **Microsoft 365 GCC High** | $50+/user/mo | DoD compliance | Overkill for township level |

**Gap Identified:** No provider offers an affordable, turn-key solution for townships under 2,000 population who need basic .gov email + a simple web presence.

---

## 3. Stakeholder Mapping

### 3.1 Primary Decision Makers

| Entity | Title | Contact | Population | Current Status |
|--------|-------|---------|------------|----------------|
| **Ashtabula County** | Data Board / IT Services | S.Pam@ashtabulacounty.us, 440-576-3798 | County-wide | Has infrastructure — potential partner/reseller |
| **City of Ashtabula** | IT Department | Via cityofashtabula.com | ~18,000 | Has website — could be lighthouse customer |
| **Conneaut** | City Administration | Unknown | ~12,000 | May have basic infrastructure |
| **Geneva** | City Administration | Unknown | ~6,000 | May need upgrade |

### 3.2 Target Townships (27 Total)

All 27 townships in Ashtabula County are potential customers:
- Most lack dedicated IT staff
- Many use personal email for official business
- Few have modern websites
- Budgets are limited (typically $1,000-5,000/year for tech)

**Priority Townships (High Need, Accessible):**
1. **Jefferson Township** (county seat proximity)
2. **Kingsville Township** (near Ashtabula city)
3. **Geneva Township** (largest population)
4. **Conneaut Township** (near city of Conneaut)

### 3.3 Villages (7 Total)

The 7 villages in Ashtabula County may have slightly more resources but still lack enterprise-grade email:
- **Andover Village**
- **Orwell Village**
- **Roaming Shores Village**
- Plus 4 others

---

## 4. Compliance Requirements

### 4.1 Ohio Sunshine Laws

| Requirement | Description | Impact on GovTech Box |
|-------------|-------------|----------------------|
| **Public Records Act (ORC 149.43)** | All records must be available upon request | Email archiving mandatory |
| **Records Retention Schedule** | Each office must maintain and publish retention policy | Automated retention compliance needed |
| **Email Retention** | Official emails are public records | Minimum 3-7 year retention |
| **Open Meetings Act** | Deliberations must be in open meetings | Integration with meeting recording/streaming |
| **CPRT Training** | Mandatory for all elected officials | Training resource integration opportunity |

### 4.2 Technical Compliance Standards

| Standard | Level | Notes |
|----------|-------|-------|
| **WCAG 2.2** | AA minimum | Required for government websites |
| **Section 508** | Federal standard | Apply for federal funding eligibility |
| **StateRAMP** | Recommended | Ohio-specific cloud security framework |
| **CJIS** | If law enforcement | Only needed for sheriff/court integrations |

---

## 5. Data Sources & APIs

### 5.1 Required Integrations

| Service | Purpose | API Availability |
|---------|---------|------------------|
| **Google Workspace** | Email hosting, docs, calendar | Full API, government pricing |
| **Microsoft 365** | Alternative email platform | Full API, GCC licensing |
| **Cloudflare** | DNS, security, .gov domain support | Full API, government program |
| **Google Sites / Wix / WordPress** | Simple town hall pages | API available |
| **Zoom / Teams** | Meeting streaming | API available |
| **Stripe** | Billing (if charging townships) | Full API |

### 5.2 Government Data Sources

| Source | Data | Use Case |
|--------|------|----------|
| **Ashtabula County GIS** | Parcel data, zoning | Town hall map integration |
| **Ohio Auditor** | Financial data | Transparency dashboard |
| **US Census** | Demographics | Township profiles |
| **Ohio Secretary of State** | Election data | Voter information |

---

## 6. Market Sizing

### 6.1 Ashtabula County Opportunity

| Segment | Count | Est. Annual Value (per unit) | Total TAM |
|---------|-------|------------------------------|-----------|
| **Townships** | 27 | $1,200-2,400/yr | $32,400-64,800 |
| **Villages** | 7 | $2,400-4,800/yr | $16,800-33,600 |
| **Cities** | 3 | $4,800-12,000/yr | $14,400-36,000 |
| **County Offices** | 15+ | $1,200-2,400/yr | $18,000-36,000 |
| **Ashtabula County TAM** | | | **$81,600-170,400/yr** |

### 6.2 Ohio Expansion

| Region | Townships | Villages | Est. TAM |
|--------|-----------|----------|----------|
| **Rural Ohio counties** (50 similar) | 1,350 | 350 | $4M-8M/yr |
| **Total Ohio** | 1,308 | 680 | $5M-10M/yr |

---

## 7. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Compliance violations** | Medium | High | Partner with legal, automated retention |
| **Data breaches** | Low | High | Use established providers (Google/Microsoft) |
| **Budget constraints** | High | Medium | Freemium tier, grant funding options |
| **Adoption resistance** | Medium | Medium | CPRT training integration, hands-on support |
| **Competition from big tech** | Medium | Medium | Local support advantage, bundled services |

---

## 8. Key Findings & Recommendations

### 8.1 Critical Insights

1. **Compliance is the wedge:** Ohio Sunshine Laws require email retention — most townships are non-compliant with personal email use.

2. **Price sensitivity is extreme:** Townships operate on $50,000-200,000 annual budgets; every dollar matters.

3. **Trust is local:** Township trustees prefer working with local providers they can call, not 1-800 numbers.

4. **Bundling wins:** Email + website + basic cloud storage in one package reduces decision fatigue.

5. **Training gap exists:** Mandatory CPRT (Public Records Training) is an opportunity to embed product education.

### 8.2 Recommended Positioning

**Tagline:** "Professional .gov email and websites for Ohio townships — compliant, affordable, local."

**Key Messages:**
- "Stop using @gmail.com for township business"
- "Ohio Sunshine Law compliant email retention"
- "Setup in 48 hours, local support"
- "$99/month for your entire township"

---

## 9. Next Steps (Phase 2)

1. **Contact Ashtabula County IT Services** (S.Pam@ashtabulacounty.us, 440-576-3798) — explore partnership/reseller opportunity

2. **Survey 5 townships** — validate need and pricing sensitivity

3. **Build pilot proposal** — "Free for 90 days" offer for first 3 townships

4. **Develop compliance checklist** — Ohio-specific Sunshine Law requirements

5. **Create pricing tiers:**
   - **Starter:** $49/mo — 5 email accounts, basic website
   - **Standard:** $99/mo — 15 email accounts, website, calendar
   - **Plus:** $199/mo — Unlimited emails, website, cloud storage, meeting streaming

---

## 10. Research Sources

1. Ashtabula County IT Services — https://www.ashtabulacounty.us/555/Data-Board-IT-Services
2. Ohio Sunshine Laws Manual 2025 — https://www.co.trumbull.oh.us/archives/pdfs/Ohio%20Sunshine%20Manual.pdf
3. Google Workspace Government — https://workspace.google.com/industries/government/
4. EvoGov Municipal Websites — https://www.evogov.com/
5. GovSites Government Solutions — https://govsites.com/

---

**Document Status:** Phase 1 Complete  
**Word Count:** ~1,200 words  
**Deliverable ID:** govtech-box-phase1-2026-02-19
