# Phase 1 Research — Box Builder

**Date:** 2026-02-18  
**Project:** box-builder (AI Custom Box Estimation Tool)  
**Researcher:** Rondell ♟️  

---

## 1. Problem Statement

Small-to-mid packaging manufacturers and e-commerce sellers struggle with:
- **Manual quote processes:** Customers wait hours/days for custom box pricing
- **Dimensional weight surprises:** Sellers don't realize shipping costs until after purchase
- **Inefficient sizing:** Using stock boxes means "sizing up" — wasted material + higher shipping
- **No instant visualization:** Hard to communicate box specs to customers

**Target Users:**
- Local packaging manufacturers (quick quotes for walk-ins/calls)
- E-commerce sellers (right-size packaging for products)
- Small fulfillment operations (estimate shipping costs upfront)

---

## 2. Competitor Analysis

### Enterprise/Automated Solutions
| Competitor | Model | Pricing | Gap |
|------------|-------|---------|-----|
| **Packsize** | On-demand box-making machines | $$$$ Enterprise | Too expensive for small ops |
| **DieCutTemplates.com** | Dieline library + cost calculator | Subscription | No AI, manufacturing focus only |

### Online Custom Box Platforms
| Competitor | Strength | Weakness |
|------------|----------|----------|
| **Packlane** | Beautiful 3D preview, instant quote | $$$, high minimums, slow turnaround |
| **Arka** | Eco-friendly, FSC certified | Still 2-3 week lead times |
| **Packola** | Good for small quantities | Limited customization |
| **PackMojo** | Cost estimator tool | No AI optimization, generic sizing |
| **Packaging Squad** | Free calculator | Basic, no material optimization |

### Bulk Suppliers (The "Easy" Default)
| Competitor | Model | Gap |
|------------|-------|-----|
| **Uline** | Massive catalog, fast shipping | No custom sizing, expensive at scale |
| **The Boxery** | Wholesale pricing | Stock sizes only |
| **Crown Packaging** | Local distribution | Phone/quote-based, no instant tool |

### Key Insight
**No one serves the gap between:**
- Enterprise automated systems (Packsize)
- Online custom platforms (high minimums, slow turnaround)
- Stock box suppliers (no customization)

---

## 3. Local Market Mapping (Northeast Ohio)

### Primary Targets — Packaging Manufacturers
| Company | Location | Notes | Contact Strategy |
|---------|----------|-------|------------------|
| **Northeast Box Company** | Ashtabula, OH | Founded 1978, acquired by Welch Packaging | Ideal pilot — local, established, likely lacks digital tools |
| **Welch Packaging** | Ashtabula + Cleveland | 40+ years experience, custom design team | Could white-label tool for customer self-service |
| **Jamestown Container** | Cleveland, OH | Own fleet, fast turnaround | Integration opportunity — API for quote requests |
| **Crown Packaging** | Cleveland, OH | 125,000+ products, single-source | Enterprise approach — efficiency tool for sales team |

### Secondary Targets — E-commerce Hubs
- **Etsy sellers** in Cleveland/Ashtabula craft scene
- **Amazon FBA sellers** needing right-size packaging
- **Local fulfillment centers** (3PLs)
- **Small manufacturers** shipping parts/products

---

## 4. Data Sources & APIs

### Pricing Data
| Source | Data | Access |
|--------|------|--------|
| **Industry averages** | $0.29-$0.40 per small box (wholesale) | Public research |
| **Corrugated pricing indices** | Material cost fluctuations | PPI (Producer Price Index) |
| **Freight APIs** | DIM weight calculations | FedEx/UPS APIs |

### Technical Data
| Source | Use |
|--------|-----|
| **Board grades** | ECT (Edge Crush Test) ratings for strength |
| **Volumetric formulas** | (L × W × H) / DIM divisor = billable weight |
| **Dieline templates** | DieCutTemplates.com API for structural designs |

### AI/ML Inputs
- Historical quote data (if available from partner manufacturer)
- Product dimensions → optimal box size algorithms
- Material thickness/grade → weight estimation

---

## 5. Market Gap & Opportunity

### The Gap
1. **Small manufacturers** rely on phone/email quotes — slow, inconsistent
2. **E-commerce sellers** guess at box sizes — shipping cost surprises
3. **No tool exists** that instantly recommends optimal box specs + estimates costs

### Unique Value Proposition
> "AI-powered box sizing and instant pricing for small manufacturers and e-commerce sellers — no minimums, no waiting, no surprises."

### Differentiation
| Feature | Box Builder | Packlane | Uline | Packsize |
|---------|-------------|----------|-------|----------|
| Instant AI estimate | ✅ | ⚠️ (manual) | ❌ | ✅ |
| No minimum order | ✅ | ❌ | ✅ | ❌ |
| Local manufacturing | ✅ (pilot) | ❌ | ❌ | ❌ |
| DIM weight preview | ✅ | ❌ | ❌ | ✅ |
| 3D preview | ✅ Planned | ✅ | ❌ | ✅ |
| Cost | Free tool / Small biz pricing | $$$ | $$ | $$$$$ |

---

## 6. Revenue Model Options

### Option A: SaaS for Manufacturers (Selected)
- **Pricing:** $49-149/month per manufacturer
- **Includes:** White-labeled estimator, lead capture, quote management
- **Target:** 10 local manufacturers = $500-1,500/month

### Option B: Affiliate/Referral Model
- Free tool for e-commerce sellers
- Commission on referrals to partner manufacturers
- Challenge: Requires manufacturing partnerships first

### Option C: Enterprise Licensing
- One-time license to packaging companies
- Custom integration with their ERP/quote systems
- Longer sales cycle, higher value

---

## 7. Risk Assessment

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Manufacturers resist digital tools | Medium | Start with one pilot, prove ROI |
| Pricing accuracy without real data | High | Partner with manufacturer for validation |
| Competition from Packlane/Arka | Low | They serve different segment (high volume) |
| Complex dieline/engineering requirements | Medium | Scope MVP to simple RSC boxes first |

---

## 8. Next Steps (Phase 2: Resource Procurement)

1. **Contact Northeast Box Company (Ashtabula)**
   - Request discovery call
   - Understand current quote process
   - Validate AI estimator concept

2. **Gather pricing data**
   - Sample quotes for common box sizes
   - Material cost ranges (corrugated board grades)
   - Labor/overhead factors

3. **Define MVP scope**
   - Limit to standard RSC (Regular Slotted Container) styles
   - Focus on dimensional weight calculation
   - Integrate with one freight API for shipping estimates

4. **Technical research**
   - Dieline generation libraries
   - 3D box visualization (Three.js)
   - PDF quote generation

---

## 9. Key Contacts to Acquire

- [ ] Northeast Box Company — General Manager / Sales Director
- [ ] Welch Packaging Ashtabula — Operations contact
- [ ] 2-3 local e-commerce sellers for user interviews
- [ ] Cleveland Small Business Development Center (referral network)

---

## 10. Research Sources

1. [DieCutTemplates.com](https://www.diecuttemplates.com/) — Dieline generator + cost calculator
2. [Packaging Squad Calculator](https://packagingsquad.com/packaging-calculator/) — Market comp
3. [PackMojo Estimator](https://packmojo.com/estimator/) — Market comp
4. [Packlane vs Arka vs Packola](https://www.growthmarketingpro.com/packola-vs-packlane-vs-packm-vs-arka/) — Competitive analysis
5. [Northeast Box Company Acquisition](https://melcap.com/transactions/northeast-box-company/) — Local market intel
6. [Welch Packaging Ashtabula](https://www.welchpkg.com/ashtabula) — Local market intel
7. [E-commerce Packaging Guide](https://amzprep.com/ecommerce-shipping-box-sizes-guide/) — User pain points
8. [Packsize E-commerce](https://www.packsize.com/industries/ecommerce-packaging) — Enterprise approach

---

**Status:** ✅ Phase 1 Complete  
**Next:** Phase 2 — Resource Procurement (contact acquisition + data gathering)
