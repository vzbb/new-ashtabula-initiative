# Zoning Clerk — Phase 1 Research & Recon
**Date:** February 19, 2026  
**Status:** ✅ Phase 1 Complete  
**Project:** Zoning Clerk (RAG Chatbot)  
**Objective:** Build a text-based AI agent that answers resident zoning questions with citations to official code sections.

---

## 1. Problem Statement

Residents, property owners, and developers in Ashtabula face significant friction when seeking zoning information:

1. **Zoning codes are complex** — Part 11 of the Codified Ordinances spans 100+ pages of dense legal text
2. **No self-service option exists** — Residents must call/email Planning & Community Development (PCD@cityofashtabula.com) for basic questions
3. **Answers are inconsistent** — Staff interpretations may vary; no searchable knowledge base
4. **High staff burden** — PCD staff spend significant time answering repetitive questions
5. **24/7 need vs. office hours** — Zoning questions arise during evenings/weekends when city offices are closed

### Current Workflow (Painful)
1. Resident has zoning question
2. Must find correct department contact
3. Call/email during business hours (8am-4:30pm weekdays)
4. Wait for staff response (hours to days)
5. Staff manually look up code sections
6. Email/call back with answer

### Desired Workflow (Zoning Clerk)
1. Resident visits zoning chatbot
2. Asks natural language question
3. Receives instant answer with citations to code sections
4. Follow-up questions answered immediately
5. Complex cases escalated to staff with full context

---

## 2. Market & Competitor Analysis

### Direct Competitors

| Competitor | Price | Approach | Strengths | Weaknesses |
|------------|-------|----------|-----------|------------|
| **ZoningBot** (zoningbot.com) | $500+/mo | SaaS RAG chatbot | Purpose-built for zoning, citations, embeddable | Expensive for small cities, generic training |
| **Civic AI Navigator** (Promet Source) | Custom quote | Drupal-integrated RAG | Government focus, multilingual (80+) | Platform lock-in, implementation complexity |
| **Polco AI Chatbots** | Platform-based | Vector DB + RAG | Civic engagement integration | Requires Polco platform subscription |
| **CivicPlus Chatbot** | Enterprise | Website integration | Established gov vendor ecosystem | Overkill for small cities, expensive |
| **iWorQ AI** | Add-on to permit system | Document chat for permit files | Deep permit integration | Requires iWorQ system, limited zoning focus |
| **Streebo Municipality** | Custom | Pre-trained gov assistants | Domain-specific training | Implementation cost, vendor dependency |

### Key Findings

**Market Gap Identified:**
- No affordable (<$100/month) zoning-specific chatbot for small cities (population <20,000)
- Existing solutions are either:
  - Too expensive for small municipalities
  - Generic chatbots without zoning domain expertise
  - Require vendor lock-in to larger platforms

**Ashtabula Opportunity:**
- Population ~18,000 — too small for enterprise solutions
- Active development interest (downtown revitalization, lakefront properties)
- No existing self-service zoning tool
- Partner city Geneva (~6,000) could be expansion target

### Competitive Differentiation

| Feature | ZoningBot | Zoning Clerk (NAI) |
|---------|-----------|-------------------|
| Price | $500+/mo | **Free** (open source) |
| Customization | Limited branding | **Full control** |
| Local context | Generic training | **Ashtabula-specific** |
| Data ownership | Vendor-hosted | **Self-hosted** |
| Citation format | Standard | **Link to official code** |
| Escalation workflow | Basic | **Custom PCD integration** |

---

## 3. Stakeholder Mapping

### Primary Authority: City of Ashtabula Planning & Community Development

| Attribute | Detail |
|-----------|--------|
| **Department** | Planning & Community Development (PCD) |
| **Email** | PCD@cityofashtabula.com |
| **Phone** | (440) 992-7135 |
| **Address** | 4717 Main Avenue, Ashtabula, OH 44004 |
| **Hours** | Monday-Friday, 8:00 AM - 4:30 PM |
| **Key Function** | Zoning compliance, use changes, variances, permits |
| **Zoning Code** | Part 11, Codified Ordinances (readopted 2004-109) |

**Key Personnel** (to identify):
- Director of Planning & Community Development
- Zoning Administrator
- Code Enforcement Officers

### Secondary Authorities

| Entity | Role | Contact |
|--------|------|---------|
| **Ashtabula County Building Department** | Building permits, inspections | (440) 576-3737, Jefferson OH |
| **Ashtabula County Zoning** | Township zoning (14 townships) | ashtabulacounty.us/278/Zoning |
| **City Engineering** | Site plans, infrastructure | City of Ashtabula |

### User Personas

#### Persona 1: Homeowner Heather
**Profile:** Longtime resident considering adding an accessory dwelling unit (ADU)
**Goals:** Understand if ADUs are permitted on her property
**Pain Points:** Confusing code language, uncertainty about setbacks
**Needs:** Simple yes/no with explanation, specific code citations

#### Persona 2: Developer Dan
**Profile:** Small developer looking at downtown commercial property
**Goals:** Understand permitted uses, parking requirements, facade standards
**Pain Points:** Multiple code sections to cross-reference, variance requirements unclear
**Needs:** Comprehensive answers, permit workflow guidance, staff escalation

#### Persona 3: Business Owner Bob
**Profile:** Opening restaurant, needs to verify zoning compliance
**Goals:** Confirm C-2 General Commercial allows restaurants, understand signage rules
**Pain Points:** Doesn't know zoning district, unclear use definitions
**Needs:** Address-based zoning lookup, plain English explanations

#### Persona 4: Staff Member Sarah
**Profile:** PCD administrative staff
**Goals:** Reduce repetitive inquiry volume, ensure consistent answers
**Pain Points:** Same questions daily, time spent on basic lookups
**Needs:** Escalation workflow, analytics on common questions, draft response generation

---

## 4. Data Sources & Content Inventory

### Official Zoning Code

**Source:** American Legal Publishing Code Library
- **URL:** https://codelibrary.amlegal.com/codes/ashtabula/latest/ashtabula_oh/
- **Format:** HTML, searchable
- **Coverage:** Complete Part 11 Planning & Zoning Code
- **Last Updated:** 2025-01 (current)
- **Content:**
  - Chapter 1101: General Provisions
  - Chapter 1103: Zoning Districts & Maps
  - Chapter 1105: District Regulations
  - Chapter 1107: Supplemental Regulations
  - Chapter 1109: Nonconformities
  - Chapter 1111: Signs
  - Chapter 1113: Off-Street Parking
  - Chapter 1115: Landscaping
  - Chapter 1117: Planned Unit Development
  - Chapter 1119: Administration & Enforcement
  - Chapter 1121: Board of Zoning Appeals
  - Chapter 1123: Planning Commission

### Supporting Documents (to acquire)

| Document | Source | Format | Priority |
|----------|--------|--------|----------|
| Zoning Map (GIS) | City PCD | PDF/Shapefile | High |
| Zoning Applications | City website | PDF | High |
| Fee Schedule | City PCD | PDF | Medium |
| Common FAQ list | PCD staff | Text | High |
| Variance case examples | Board of Zoning Appeals | PDF/Text | Medium |
| Sign permit guidelines | City PCD | PDF | Medium |

### External Reference Data

| Data Source | Purpose | API Available |
|-------------|---------|---------------|
| Ashtabula County Auditor | Property lookup by address | No (scraping) |
| County GIS | Zoning overlay maps | Possible |
| Google Places | Address validation | Yes |

---

## 5. Technical Architecture

### RAG (Retrieval-Augmented Generation) Approach

```
User Query
    ↓
[Query Classification] → Is this a zoning question?
    ↓ Yes
[Vector Search] → Find relevant code sections (top-k=5)
    ↓
[Context Assembly] → Code chunks + query
    ↓
[LLM Generation] → Gemini 2.0 Flash
    ↓
[Response Formatting] → Answer + Citations + Confidence
    ↓
User Response + Source Links
```

### Component Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React + Vite | Chat interface |
| **Vector DB** | Qdrant (local) | Code chunk embeddings |
| **Embeddings** | Gemini Embedding API | Text → vectors |
| **LLM** | Gemini 2.0 Flash | Response generation |
| **Citation Engine** | Custom | Link to source sections |
| **Analytics** | Firebase or local | Query logging |
| **Escalation** | Email/Form | Staff handoff |

### Data Pipeline

1. **Ingest:** Scrape/code Part 11 from American Legal Publishing
2. **Chunk:** Split by section/subsection (preserve hierarchy)
3. **Embed:** Generate vector embeddings for each chunk
4. **Index:** Store in Qdrant with metadata (chapter, section, title)
5. **Query:** Vector similarity search + re-ranking
6. **Generate:** LLM with retrieved context
7. **Cite:** Extract and format source references

### Citation Format

Responses should include:
- **Direct quote** from code (highlighted)
- **Source link** to American Legal Publishing
- **Section reference** (e.g., "Part 11, Chapter 1105, Section 1105.03")
- **Last updated** date

---

## 6. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Hallucination/incorrect answers** | Medium | High | RAG grounding, confidence thresholds, disclaimer |
| **Code updates not reflected** | High | Medium | Automated scraping, version alerts, quarterly review |
| **Staff resistance** | Medium | Medium | Position as assistive tool, not replacement |
| **High query volume (cost)** | Low | Low | Rate limiting, local LLM fallback |
| **Legal liability for wrong answers** | Low | High | Clear disclaimers, escalation paths, PCD approval |
| **Low adoption** | Medium | Medium | Promotion via city website, Chamber partnership |

### Hallucination Mitigation Strategy

1. **Strict RAG:** Only answer from retrieved context
2. **Confidence Scoring:** Low confidence → "I don't know" + escalate
3. **Citations Required:** Every factual claim linked to source
4. **Disclaimer:** "This is for informational purposes only..."
5. **Escalation Path:** Complex/variance questions → PCD staff

---

## 7. Business Model & Sustainability

### Cost Structure (Monthly)

| Item | Cost | Notes |
|------|------|-------|
| Gemini API | ~$20-50 | Depends on usage |
| Hosting (Vercel) | $0-20 | Pro if high traffic |
| Qdrant Cloud | $0 | Self-hosted option |
| **Total** | **$20-70/mo** | Negligible vs. staff time savings |

### Value Proposition

**For City:**
- Reduce PCD staff inquiry volume by 40-60%
- 24/7 availability without overtime
- Consistent, documentable answers
- Analytics on resident concerns

**For Residents:**
- Instant answers vs. hours/days
- Available evenings/weekends
- Cited sources for confidence
- No phone tag with city offices

### ROI Estimate

Assuming:
- 50 inquiries/week currently handled by staff
- 15 min average per inquiry
- $25/hour fully-loaded staff cost
- 50% deflection to chatbot

**Savings:** 25 inquiries × 0.25 hours × $25 = **$156/week = $8,100/year**
**Cost:** ~$500/year
**Net ROI:** ~16x

---

## 8. Go-to-Market Strategy

### Phase 1: Pilot (Month 1-2)
- Deploy on noirsys.com subdomain
- Train on core zoning code sections
- Test with 5-10 friendly users
- Gather feedback, refine responses

### Phase 2: City Partnership (Month 3-4)
- Demo to PCD Director
- Propose embed on cityofashtabula.com/zoning
- Establish escalation protocol
- Train staff on handoff workflow

### Phase 3: Expansion (Month 5-6)
- Add building permit FAQ
- Integrate with county township zoning
- Expand to Geneva (partner city)
- Analytics review and optimization

### Promotion Channels

1. **City website** — Primary placement
2. **Chamber of Commerce** — Business outreach
3. **Social media** — City Facebook, community groups
4. **Physical signage** — QR codes at City Hall
5. **Partner sites** — Downtown association, landlords

---

## 9. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Query volume** | 100+/month | Analytics |
| **Deflection rate** | 50%+ | Escalation tracking |
| **User satisfaction** | 4.0/5.0 | Post-chat rating |
| **Response accuracy** | 95%+ | Staff review sample |
| **Avg response time** | <3 seconds | Performance monitoring |
| **Citation click rate** | 30%+ | Source link tracking |

---

## 10. Next Steps

### Phase 2: Resource Procurement (Pending)
- [ ] Contact PCD Director for partnership discussion
- [ ] Request zoning code export/permission to scrape
- [ ] Acquire common FAQ list from staff
- [ ] Set up Qdrant instance
- [ ] Get Gemini API production key

### Phase 3: SPEC.md (Blocked until Phase 2)
- Technical architecture detail
- UI/UX wireframes
- API specifications
- Testing strategy

### Phase 4: Build Checklist (Blocked until Phase 3)
- Implementation roadmap
- Copy-paste code blocks
- Deployment checklist
- Staff training guide

---

## Appendix A: Sample Questions for Training

1. "What are the setback requirements for an R-1 zone?"
2. "Can I run a business from my home?"
3. "How do I apply for a zoning variance?"
4. "What's the maximum sign size for my storefront?"
5. "How many parking spaces do I need for a restaurant?"
6. "Is my property in a flood zone?"
7. "What does C-2 zoning allow?"
8. "How tall can my fence be?"
9. "Do I need a permit for a deck?"
10. "What are the landscaping requirements for new construction?"

---

## Appendix B: Technical Research Notes

### RAG Implementation Patterns
- Chunk size: 512-1024 tokens optimal for legal text
- Overlap: 20% between chunks for context preservation
- Top-k retrieval: 5-7 chunks balances coverage vs. noise
- Re-ranking: Cross-encoder improves relevance 15-20%

### Similar Projects
- **NYC Zoning Chatbot:** Uses RAG on NYC zoning resolution
- **Chicago Zoning:** Open data + map-based lookup
- **OpenAssistant:** Open-source alternative to proprietary

### Citation Best Practices
- Always link to canonical source
- Include section number in text
- Highlight quoted passage
- Provide "see full context" link

---

**Document Version:** 1.0  
**Research Hours:** ~0.5  
**Next Review:** Upon completion of Phase 2 stakeholder outreach
