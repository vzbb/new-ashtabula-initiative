# Engineers Assistant — Phase 1 Research Document
**Project:** engineers-assistant  
**MVP Number:** #21 (following compassionate-planner #19, curbside-pickup-tracker #20)  
**Date:** 2026-02-19  
**Status:** Phase 1 Complete → Ready for Phase 2 (Resource Procurement)

---

## Executive Summary

**Problem Solved:** Ashtabula homeowners and small contractors face confusion navigating city/county engineering requirements for permits, zoning, drainage, sidewalks, and property improvements. The City Engineering Division handles street repairs, sewer work, and excavations, but residents struggle to understand when permits are needed, which jurisdiction handles what, and how to proceed with common property projects.

**Solution:** An AI-powered "Engineer's Assistant" — a conversational tool that answers homeowner engineering questions, guides permit requirements, and provides Ashtabula-specific guidance for property improvements.

**Market Gap:** No free, accessible tool exists to help residents navigate the complex overlap between City Engineering, County Building Department, and Zoning requirements. Residents currently must call multiple offices (City: 440-992-7111, County: 440-576-3737) or visit in-person during business hours.

---

## User Personas

### 1. Homeowner Hank
- **Profile:** 55-year-old homeowner in Ashtabula, wants to replace driveway and add drainage
- **Pain Points:** Unsure if driveway replacement needs permit; confused about City vs County jurisdiction; doesn't want to pay contractor just to ask basic questions
- **Needs:** Quick answers about permit requirements, setback rules, drainage requirements
- **Tech Comfort:** Moderate — uses smartphone, prefers simple web interface

### 2. DIY Darla
- **Profile:** 35-year-old who wants to build a deck, install a shed, and fix sidewalk
- **Pain Points:** Code requirements unclear; worried about doing work then being told it's non-compliant; doesn't understand zoning setbacks
- **Needs:** Project-specific guidance, code references, step-by-step process
- **Tech Comfort:** High — comfortable with apps and online research

### 3. Small Contractor Carl
- **Profile:** Local handyman/contractor doing 2-3 small jobs per week in Ashtabula
- **Pain Points:** Different rules for City vs County vs townships; permit fees vary; inspection scheduling unclear
- **Needs:** Quick reference for permit costs, timeline estimates, contact info
- **Tech Comfort:** Moderate — uses phone for business, wants fast answers

### 4. New Neighbor Nancy
- **Profile:** Just moved to Ashtabula, unfamiliar with local requirements
- **Pain Points:** No knowledge of local processes; overwhelmed by city/county/township distinctions
- **Needs:** Beginner-friendly explanations, what-to-expect guidance
- **Tech Comfort:** Moderate — uses web but needs clear, jargon-free language

---

## Jurisdictional Mapping

### City of Ashtabula Engineering Division
**Location:** City Hall, 4717 Main Avenue, Ashtabula, OH 44004  
**Phone:** (440) 992-7111  
**Responsibilities:**
- Street repairs and paving
- Sewer repairs and tap-ins
- Street cuts and excavations (within city right-of-way)
- Curb cut permits (driveway access from street)
- Sidewalk repair/replacement permits
- Storm drainage (public system)

**Permit Process:** Forms available online, return to office for review, fees vary by project

### Ashtabula County Building Department
**Location:** Jefferson, Ohio  
**Phone:** (440) 576-3737  
**Email:** TMFrench@ashtabulacounty.gov, CAEllsworth@ashtabulacounty.us  
**Responsibilities:**
- All building permits (new construction, additions, alterations)
- Demolition permits
- Electrical inspections
- Plumbing inspections (except Conneaut — city handles their own)
- Non-residential projects (digital submission)

**Key Requirement:** Must obtain City Zoning Permit FIRST before County Building Permit

### City of Ashtabula Zoning Division
**Location:** City Hall  
**Responsibilities:**
- Zoning permits (required before building permits)
- Setback verification
- Home occupation permits
- Sign permits
- Property line disputes (initial guidance)

**Process:** Zoning permit application → approval → take to County Building Department

---

## Common Engineering Questions (Research-Based)

### Driveway & Access
1. **Do I need a permit to replace my driveway?**
   - Curb cut permit from City Engineering (if accessing public street)
   - No permit needed for driveway surface itself on private property
   - Must maintain minimum setbacks from property lines

2. **Can I widen my driveway?**
   - Depends on property setbacks and curb cut location
   - May require Engineering approval for additional curb cuts

### Sidewalks
3. **Who is responsible for sidewalk repair?**
   - Property owners are typically responsible for sidewalk maintenance
   - City may have programs for shared cost or assessment
   - Permit required from Engineering for replacement

4. **Do I need a permit to replace my sidewalk?**
   - Yes — Engineering permit required
   - Must meet ADA compliance if on public right-of-way

### Drainage & Stormwater
5. **My yard floods — what can I do?**
   - Private drainage solutions (French drains, grading) generally don't need permits on private property
   - Connection to public storm system requires Engineering approval
   - Cannot divert water to neighbor's property

6. **Can I fill in a drainage ditch?**
   - Likely requires Engineering approval
   - May affect stormwater management for area

### Construction & Structures
7. **Do I need a permit for a shed?**
   - Under 200 sq ft: typically no building permit
   - Must meet setback requirements (zoning)
   - Cannot be placed over utility easements without approval

8. **Do I need a permit for a deck?**
   - Under 30" above grade: no permit
   - Over 30" or attached to house: building permit required
   - Must meet setbacks

### Excavation & Utilities
9. **Can I dig on my property?**
   - Must call OHIO 811 before digging (1-800-362-2764) — 48 hours notice required
   - Street/right-of-way excavation requires City Engineering permit

10. **How do I connect to city sewer?**
    - Sewer tap-in permit from City Engineering
    - Requires licensed plumber
    - Connection fees apply

---

## Competitor Analysis

### Direct Competitors
| Tool | Focus | Price | Ashtabula Coverage |
|------|-------|-------|-------------------|
| **CivicPlus** | Enterprise gov software | $$$$ | None — enterprise only |
| **CivCheck** | AI plan review | $$ | None — major cities only |
| **Civic Atlas** | Permit tracking | $$ | None — large metros only |
| **CitizenServe** | Online permitting | $$ | Conneaut uses this; Ashtabula does not |

### Gap Analysis
- **No consumer-facing tool** exists for small cities like Ashtabula
- **No free option** for homeowners to get quick answers
- **No unified tool** covering City + County + Zoning requirements
- **Phone-only support** creates bottlenecks during business hours

### Differentiation
- **Free** for homeowners
- **Ashtabula-specific** — knows local processes, phone numbers, requirements
- **24/7 availability** — answers when City Hall is closed
- **Multi-jurisdictional** — understands City/County/Zoning interactions
- **Project-based guidance** — "I want to build a deck" → step-by-step process

---

## Technical Feasibility

### AI Knowledge Base Requirements
1. **City Code References**
   - Chapter 1109: Building permits (City code)
   - Zoning ordinance sections
   - Engineering permit fee schedule

2. **Process Documentation**
   - Step-by-step permit workflows
   - Required documents checklists
   - Timeline estimates

3. **Contact Directory**
   - City Engineering: (440) 992-7111
   - County Building: (440) 576-3737
   - Zoning Office: (City Hall)
   - OHIO 811: 1-800-362-2764

### Data Sources
- City of Ashtabula website (cityofashtabula.com)
- Ashtabula County Building Department
- Codified city ordinances (codelibrary.amlegal.com)
- Ohio building codes (base for County requirements)

### LLM Strategy
- **RAG-based responses** — retrieve relevant code sections and process docs
- **Confidence scoring** — flag uncertain answers for human verification
- **Escalation paths** — provide phone numbers for complex situations
- **Disclaimer:** "This tool provides general guidance. Always verify with City/County offices before starting work."

---

## Stakeholder Mapping

### Primary Stakeholders
| Entity | Role | Contact | Interest Level |
|--------|------|---------|----------------|
| **City Engineering** | Permit issuer, technical authority | (440) 992-7111 | High — reduces phone volume |
| **County Building Dept** | Building permits | (440) 576-3737 | Medium — referral source |
| **City Zoning** | Zoning permits | City Hall | Medium — related workflows |
| **City Mayor's Office** | Innovation/efficiency | — | Medium — constituent service |

### Secondary Stakeholders
| Entity | Role | Interest |
|--------|------|----------|
| **Ashtabula County Commissioners** | County efficiency | Reduce confusion, streamline |
| **Home Builders Association** | Contractor resource | Member benefit |
| **Chamber of Commerce** | Business support | New business onboarding |
| **Realtors** | Client questions | Property transaction clarity |

### Potential Champions
- **City Engineer** — reduces repetitive phone inquiries
- **City Council** — constituent service improvement
- **Local contractors** — quick reference tool

---

## Revenue Model Options

### Option 1: Civic Service (Free)
- **Model:** Free for all users, funded as public service
- **Benefit:** Maximum adoption, goodwill, City partnership potential
- **Sustainability:** Grant-funded or City contract

### Option 2: Freemium
- **Free:** Basic Q&A, general guidance
- **Pro ($9/mo):** Project tracking, document storage, priority support, contractor connection
- **City License ($499/mo):** White-label, custom branding, analytics dashboard

### Option 3: Contractor Referral
- **Free:** Homeowner tool
- **Revenue:** Referral fees from verified contractors
- **Risk:** Potential conflict of interest, trust issues

**Recommendation:** Start with Option 1 (free civic service) to build trust and adoption. Evaluate Option 2 after user base established.

---

## Open Questions (Phase 2 Blockers)

### Critical Blockers
1. **City Partnership:** Will City Engineering endorse or partner on this tool? (Need: Meeting with City Engineer)
2. **Accuracy Liability:** How do we handle incorrect AI responses? (Need: Legal review, disclaimer language)
3. **Code Access:** Can we get digital access to full city code and fee schedules? (Need: Clerk of Council, City Engineer)
4. **County Coordination:** Will County Building Department support or oppose? (Need: Meeting with County Building Official)

### Important Questions
5. **Zoning Integration:** Can we get zoning map data (setbacks, zones)? (Need: Zoning Officer)
6. **Inspection Scheduling:** Can we integrate with inspection scheduling systems? (Need: County IT)
7. **Spanish Translation:** Significant Hispanic population — need Spanish support? (Need: Demographic data)
8. **OHIO 811 Integration:** Can we link to or integrate with 811 system? (Need: Contact Ohio 811)

### Nice-to-Know
9. **Usage Estimates:** How many calls does Engineering receive monthly?
10. **Peak Seasons:** When are permit questions highest? (Spring construction season?)
11. **Contractor Network:** Is there an appetite for verified contractor directory?
12. **Mobile vs Web:** Do users prefer app or mobile web?

---

## Recommended Next Steps (Phase 2)

### Immediate (Week 1)
1. **Draft outreach email** to City Engineer — request 30-min meeting
2. **Draft outreach email** to County Building Department — gauge interest
3. **Compile complete question dataset** — survey 10-15 homeowners about their engineering/permit questions

### Short Term (Weeks 2-3)
4. **Conduct stakeholder meetings** with City Engineer and County Building
5. **Document complete permit workflows** — map every permit type from start to finish
6. **Create user survey** — validate personas and question priorities

### Medium Term (Month 2)
7. **Secure City endorsement** (or decision to proceed without)
8. **Build knowledge base** — compile code sections, fee schedules, process docs
9. **Create wireframes** for conversational interface

---

## Technical Stack Recommendation

### MVP Stack
- **Frontend:** Next.js 14 + Tailwind (PWA for mobile)
- **Backend:** Supabase (PostgreSQL + Auth)
- **AI:** OpenAI GPT-4o + RAG with Pinecone
- **Knowledge Base:** Markdown docs with structured Q&A pairs
- **Hosting:** Vercel (edge deployment)

### Key Features (MVP)
1. **Conversational interface** — "Ask the Engineer" chat
2. **Topic browser** — categorized Q&A (driveways, decks, drainage, etc.)
3. **Permit checker** — simple wizard: "What permits do I need for [project]?"
4. **Contact directory** — one-tap calling/emailing
5. **OHIO 811 reminder** — prompt to call before digging

---

## Success Metrics

### Launch Targets (Month 1)
- 100+ unique users
- 300+ questions answered
- 70%+ "helpful" rating
- <5% escalation to phone calls

### Growth Targets (Month 6)
- 500+ monthly active users
- 50% of users return for multiple questions
- City Engineering reports 20%+ reduction in basic inquiry calls
- 3+ City/County stakeholder endorsements

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Incorrect AI advice** | Medium | High | Strong disclaimers, confidence thresholds, escalation to humans |
| **City opposition** | Low | High | Position as complementary, not replacement; seek partnership |
| **Low adoption** | Medium | Medium | Marketing via City website, library kiosks, contractor referrals |
| **Maintenance burden** | Medium | Medium | Simple KB structure, user feedback loop, annual code review |
| **Scope creep** | High | Medium | Strict MVP scope, clear roadmap, defer advanced features |

---

## Related MVPs & Synergies

| MVP | Relationship | Synergy |
|-----|--------------|---------|
| **permit-whisperer** | Complementary | Permit-whisperer handles permit *application*; Engineers Assistant handles *questions* |
| **zoning-clerk** | Related | Zoning questions often overlap with engineering |
| **civic-insight-engine** | Platform | Could be integrated into city transparency dashboard |
| **license-wizard** | Same user | Homeowners doing construction may also need business licensing |
| **contractor-match** | Referral | Assistant could recommend verified contractors for complex jobs |

---

## Conclusion

The **Engineers Assistant** addresses a clear gap: residents need 24/7 guidance on engineering and permit questions, but currently must call multiple offices during business hours. The tool complements (rather than replaces) City and County staff by handling repetitive inquiries and freeing staff for complex cases.

**Next Action:** Secure stakeholder meetings with City Engineering and County Building Department to validate approach and secure partnership or endorsement.

**Estimated MVP Build Time:** 30-40 hours (4-5 weeks part-time)
**Estimated Phase 2 Duration:** 2-3 weeks (stakeholder outreach + validation)

---

**Document Status:** Phase 1 Complete  
**File Location:** `websites/engineers-assistant/PHASE1-RESEARCH.md`  
**Word Count:** ~2,100 words
