# Pet-Matchmaker — Phase 1 Research: AI-Powered Pet Adoption Matching for Ashtabula County

**Date:** 2026-02-19  
**Status:** 🔴 → 🟡 Phase 1 Complete  
**Next:** Phase 2 Resource Procurement (Stakeholder Outreach)

---

## 1. Problem Statement

### Current Pain Points
1. **Fragmented Discovery:** Ashtabula County residents looking to adopt must check multiple sources (Petfinder, Adopt-a-Pet, individual shelter websites, Facebook) with no unified local view
2. **Mismatch Returns:** Nationally, 10-15% of adopted pets are returned to shelters due to lifestyle/personality mismatches — a heartbreaking and costly outcome
3. **Shelter Resource Strain:** ACAPL and other local shelters rely on manual processes and national platforms that don't prioritize local visibility
4. **No Personality Matching:** Existing platforms list pets by physical characteristics (breed, age, size) but lack behavioral/personality-based matching that predicts adoption success
5. **Competitive Disadvantage:** Small rural shelters compete for attention against urban shelters with better marketing resources

### User Quote (Representative)
> "I want a dog that fits my lifestyle — I work from home, have a small yard, and want a calm companion. But browsing photos doesn't tell me if a dog is high-energy or couch-potato material."

---

## 2. Market Analysis

### Local Market Size
| Metric | Estimate | Source |
|--------|----------|--------|
| Ashtabula County Households | ~40,000 | US Census |
| Pet-Owning Households | ~28,000 (70%) | AVMA Statistics |
| Annual Shelter Intakes | ~2,500-3,000 | ACAPL estimates |
| Target Adoptions/Year | ~1,500 | Based on regional data |
| Unmet Matching Need | ~500+ failed adoptions | Industry avg 10-15% return rate |

### Key Local Shelters & Rescues
| Organization | Type | Location | Contact | Status |
|--------------|------|----------|---------|--------|
| **Ashtabula County Animal Protective League (ACAPL)** | County Shelter | 5970 Green Road, Ashtabula, OH | 440-224-1222 | Primary partner target |
| **Humane Society of Ashtabula County** | Humane Society | Jefferson, OH | Web contact | Secondary partner |
| **Animal Welfare Center of Ashtabula** | Support Org | Ashtabula County | awcashtabula.org | Pet retention focus |
| **Harbor Cat Rescue** | Cat Rescue | Ashtabula, OH | harborcatrescue.org | Specialty partner |
| **Winky Cats Ashtabula** | TNR/Community | Ashtabula, OH | winkycats.com | Network member |
| **Purrfect Partners Ohio** | Rescue | Mentor, OH (regional) | Facebook | Extended network |

### National Competitor Analysis

| Platform | Reach | Matching Features | Cost to Shelters | Ashtabula Focus |
|----------|-------|-------------------|------------------|-----------------|
| **Petfinder** | 17,000+ shelters | Basic filtering by breed/age/size | FREE | Yes (ACAPL listed) |
| **Adopt-a-Pet** | 17,000+ shelters | Alert-based matching | FREE | Yes (ACAPL listed) |
| **Rescue Me!** | Regional focus | Location-based | FREE | Limited |
| **PawsLikeMe** | National | **Personality algorithm** (40-question quiz) | Unknown | Limited |
| **ASPCA Meet Your Match** | Program-based | **Canine-ality/Feline-ality** | Training required | Not implemented locally |
| **PetSmart Charities** | In-store | Basic listings | Partnership | Geneva store |

### Competitive Gap Analysis
**What's Missing:**
1. ✅ No hyper-local Ashtabula-focused platform
2. ✅ No personality-based matching integrated with local shelters
3. ✅ No AI-enhanced "Meet Your Match" experience for rural communities
4. ✅ No shelter-side personality assessment tools for small shelters
5. ✅ No "foster-to-adopt" matching workflow

---

## 3. User Personas

### Primary: "Searching Sarah"
- **Demographics:** 28-45 years old, Ashtabula County resident, first-time or returning pet owner
- **Situation:** Wants to adopt but overwhelmed by options; worried about making the wrong choice
- **Goals:** Find a pet whose personality matches her lifestyle; avoid returns; support local shelter
- **Pain Points:** Can't judge personality from photos; afraid of mismatch; doesn't know what questions to ask
- **Tech Comfort:** High — uses apps daily, prefers mobile-first experience

### Primary: "Foster Freddie"
- **Demographics:** 35-55 years old, experienced pet owner, considering fostering
- **Situation:** Wants to help but needs to know which pets are foster-able vs. adoption-ready
- **Goals:** Match foster skills to pet needs; seamless foster-to-adopt pathway
- **Pain Points:** No visibility into foster needs; manual coordination with shelter
- **Tech Comfort:** Moderate — prefers email but uses apps

### Secondary: "Busy Shelter Becky" (ACAPL Staff)
- **Demographics:** Shelter coordinator/volunteer, overworked, passionate
- **Situation:** Manages 50+ animals, limited time for marketing/adoption counseling
- **Goals:** Reduce return rates; streamline adoptions; better match pets to homes
- **Pain Points:** No time for detailed personality assessments; reliance on national platforms
- **Tech Comfort:** Low-moderate — needs simple, fast tools

### Secondary: "Returning Robert"
- **Demographics:** 40-60 years old, previous pet owner, recently lost a pet
- **Situation:** Emotionally ready for new pet but has specific needs based on past experience
- **Goals:** Find a similar personality to previous beloved pet; avoid surprises
- **Pain Points:** Difficult to communicate specific needs; shelters don't have detailed personality data
- **Tech Comfort:** Moderate — desktop preferred

---

## 4. Solution Concept

### Core Value Proposition
**"Find your perfect pet match in Ashtabula County using AI-powered personality matching — not just photos."**

### Key Differentiators
1. **Hyper-Local Focus:** Only Ashtabula County shelters and rescues
2. **AI Personality Matching:** ML-powered compatibility scoring based on lifestyle quiz + pet personality profiles
3. **Shelter-Side Tools:** Simple personality assessment app for shelter staff/volunteers
4. **Foster Integration:** Dedicated foster matching workflow
5. **Return Prevention:** Post-adoption check-ins and support resources

### MVP Feature Set
| Feature | Priority | Description |
|---------|----------|-------------|
| **Lifestyle Quiz** | P0 | 15-question adopter assessment (energy, space, experience, schedule) |
| **Pet Personality Profiles** | P0 | Shelter-side assessment tool + public-facing personality badges |
| **Match Scoring** | P0 | AI-generated compatibility percentage (0-100%) |
| **Local Pet Feed** | P0 | Filterable browse of all Ashtabula adoptable pets |
| **Shelter Dashboard** | P1 | Manage listings, track matches, view analytics |
| **Foster Matching** | P1 | Separate workflow for foster placements |
| **Appointment Booking** | P2 | Schedule meet-and-greets directly |
| **Post-Adoption Support** | P2 | Resources, check-ins, return prevention |

---

## 5. Technical Feasibility

### Data Sources
| Source | Data | Integration Method |
|--------|------|-------------------|
| **Petfinder API** | 17,000 shelter pet listings | FREE REST API, JSON |
| **Adopt-a-Pet API** | Shelter listings | Partner API |
| **ACAPL Direct** | Personality assessments | Manual entry + future API |
| **ASPCA Meet Your Match** | Assessment methodology | License/consultation |

### Recommended Tech Stack
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Real-time)
- **AI/ML:** OpenAI API for personality matching algorithm
- **Hosting:** Vercel (edge deployment)
- **Images:** Cloudinary or Supabase Storage
- **Maps:** Mapbox for shelter location mapping

### Personality Matching Algorithm (Concept)
```
Compatibility Score = 
  (Energy Match × 0.30) +
  (Space Suitability × 0.25) +
  (Experience Alignment × 0.20) +
  (Time Availability × 0.15) +
  (Special Needs Capability × 0.10)
```

**Personality Dimensions:**
1. **Energy Level:** Couch Potato → Moderate → High Energy → Athlete
2. **Socialization:** Shy → Selective → Friendly → Social Butterfly
3. **Training:** Beginner → Intermediate → Advanced
4. **Special Needs:** None → Medical → Behavioral → Both
5. **Size Compatibility:** Apartment → Small Yard → Large Property

---

## 6. Revenue Model Options

| Model | Description | Pros | Cons |
|-------|-------------|------|------|
| **Free Civic Tool** | Funded by grants/donations | Maximum adoption, good PR | Sustainability risk |
| **Shelter SaaS** | $29-49/mo for shelter dashboard | Revenue aligned with value | Adoption barrier |
| **Freemium** | Free matching + $9/mo premium features (unlimited alerts, priority matching) | Dual revenue stream | Complexity |
| **Grant-Funded** | Non-profit grants for animal welfare | Mission-aligned | Time-intensive |
| **Hybrid** | Free for shelters + sponsored by local vets/pet stores | Community partnership | Sales effort |

**Recommended:** Start as **Free Civic Tool** funded by small grants + local vet/pet store sponsorships. Monetize later if successful.

---

## 7. Stakeholder Map

### Primary Stakeholders
| Organization | Role | Contact Method | Priority |
|--------------|------|----------------|----------|
| **ACAPL** | Lead shelter partner | 440-224-1222, acapl.org | P0 |
| **Humane Society of Ashtabula County** | Secondary shelter | humanesocietyashco.com | P1 |
| **Animal Welfare Center** | Support network | awcashtabula.org | P1 |
| **Harbor Cat Rescue** | Specialty rescue | harborcatrescue.org | P2 |

### Secondary Stakeholders
| Organization | Value Proposition |
|--------------|-------------------|
| **Ashtabula County Vet Clinics** | Referral source, potential sponsors |
| **PetSmart Geneva** | Adoption event partner |
| **Ashtabula County Commissioners** | Potential funding/support |
| **Best Friends Animal Society** | National partnership (ACAPL is network partner) |

---

## 8. Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Shelter buy-in** | High | Medium | Start with ACAPL as champion; offer free tool |
| **Data freshness** | High | High | Petfinder API integration + manual shelter updates |
| **Personality assessment accuracy** | Medium | Medium | Use validated ASPCA methodology; train volunteers |
| **Adoption returns still occur** | Medium | Medium | Focus on education; track outcomes; iterate |
| **National platform competition** | Low | High | Hyper-local focus is differentiator |
| **Funding sustainability** | Medium | Medium | Seek grants; explore sponsorships |

---

## 9. Open Questions for Phase 2

### Critical Blockers (Must Answer Before Build)
1. **ACAPL Partnership:** Will ACAPL commit to pilot program and personality assessments?
2. **Data Integration:** Can we access Petfinder API for Ashtabula pets? (Likely yes — FREE)
3. **Assessment Burden:** Will shelter staff/volunteers complete personality profiles for each pet?
4. **Adopter Adoption:** Will adopters complete a 15-question quiz before browsing?
5. **Match Validation:** How do we validate that matches lead to better outcomes?

### Important Questions
6. Should we include foster-to-adopt workflow in MVP?
7. What's the optimal personality assessment length? (10, 15, or 20 questions?)
8. Do local vets offer "new adoption" health packages we can promote?
9. Are there county or state grants available for animal welfare technology?
10. Should we integrate with ASPCA Meet Your Match program officially?

---

## 10. Implementation Roadmap

### Phase 1: MVP (4-6 weeks)
- Lifestyle quiz for adopters
- Basic pet feed from Petfinder API (Ashtabula filter)
- Simple personality badges (staff-assessed)
- Basic match scoring
- ACAPL branding integration

### Phase 2: Enhanced Matching (4 weeks)
- AI-enhanced personality matching
- Foster matching workflow
- Shelter dashboard
- Post-adoption check-in system

### Phase 3: Scale (4 weeks)
- Multi-shelter network
- Mobile app
- Grant reporting dashboard
- Regional expansion (Lake County, Geauga County)

---

## 11. Success Metrics

| Metric | Target (6 months) | Target (12 months) |
|--------|-------------------|-------------------|
| Monthly Active Users | 500 | 1,500 |
| Pets Matched | 100 | 400 |
| Return Rate Reduction | 5% improvement | 10% improvement |
| Shelter Partners | 2 | 5 |
| User Satisfaction | 4.0/5.0 | 4.5/5.0 |

---

## 12. Recommended Next Steps (Phase 2)

1. **Outreach to ACAPL** — Schedule meeting with director to present concept
2. **Petfinder API Access** — Sign up for free developer account, test Ashtabula data
3. **User Research** — Survey 20+ potential adopters about matching preferences
4. **Shelter Visit** — Tour ACAPL, observe current adoption process
5. **Competitor Deep-Dive** — Test PawsLikeMe quiz, document UX gaps

---

## 13. Resources & References

- **ACAPL Website:** https://www.acapl.org/
- **Petfinder API:** https://www.petfinder.com/developers/
- **ASPCA Meet Your Match:** https://aspcameetyourmatch.org/
- **PawsLikeMe:** https://pawslikeme.com/
- **Adopt-a-Pet:** https://www.adoptapet.com/
- **Best Friends Network:** https://bestfriends.org/

---

**Document Status:** Phase 1 Complete — Ready for stakeholder outreach and Phase 2 resource procurement.

**Estimated Build Effort:** 30-40 hours (MVP)  
**Estimated Timeline:** 4-6 weeks (MVP with 1 shelter partner)
