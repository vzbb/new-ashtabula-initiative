# Deliverables — Zoning Clerk

## Phase Tracking

| Phase | Status | Document | Notes |
|-------|--------|----------|-------|
| Phase 1: Research | ✅ Complete | [PHASE1-RESEARCH.md](./PHASE1-RESEARCH.md) | 14KB comprehensive analysis |
| Phase 2: Resources | 🔄 Pending | — | Stakeholder outreach needed |
| Phase 3A: Foundation | ✅ Complete | [BUILD-PROGRESS.md](./BUILD-PROGRESS.md) | Next.js scaffold, Qdrant, basic chat |
| Phase 3B: RAG Integration | ✅ Complete | [PHASE3B-COMPLETE.md](./PHASE3B-COMPLETE.md) | Citations, QuickQuestions, RAG utils |
| Phase 3C: Polish | ⏳ Planned | — | Citation modal, mobile polish |
| Phase 4: Build Checklist | ⏳ Blocked | — | Waiting on stakeholder validation |

## Research Summary

### Market Opportunity
- **Gap identified:** No affordable (<$100/mo) zoning chatbot for small cities (<20k population)
- **Competitors analyzed:** ZoningBot ($500+/mo), Civic AI Navigator, Polco, CivicPlus, iWorQ AI
- **Differentiation:** Free/open source, Ashtabula-specific, self-hosted, full control

### Key Stakeholders
- **Primary:** City of Ashtabula PCD (PCD@cityofashtabula.com)
- **Secondary:** County Building Department, County Zoning (14 townships)
- **Users:** Homeowners, developers, business owners, PCD staff

### Data Sources
- **Official code:** American Legal Publishing (codelibrary.amlegal.com)
- **Coverage:** Part 11, all 12 chapters of zoning code
- **Format:** HTML (scrapable), ~100+ pages
- **Last updated:** 2025-01

### Technical Approach
- **Architecture:** RAG (Retrieval-Augmented Generation)
- **Stack:** React + Qdrant + Gemini
- **Cost:** $20-70/month
- **ROI:** ~16x (saves ~$8,100/year in staff time)

### Risk Mitigation
- Strict RAG grounding to prevent hallucinations
- Confidence thresholds with escalation
- Required citations for all factual claims
- Clear disclaimers and PCD handoff protocol

## Deliverables Log

### Phase 1 — Research (Complete)
**Date:** February 19, 2026

**Output:** PHASE1-RESEARCH.md

**Contents:**
- Problem statement and current workflow analysis
- Competitor analysis (6 direct competitors)
- Stakeholder mapping (PCD, County, user personas)
- Data source inventory (code library, GIS, permits)
- Technical architecture (RAG pipeline)
- Risk register with mitigation strategies
- Business model and ROI analysis
- Go-to-market strategy (3 phases)
- Success metrics and KPIs
- Sample training questions (appendix)

**Key Findings:**
- Blue ocean: No affordable solution for small cities
- Staff burden: ~50 inquiries/week × 15 min = 12.5 staff hours
- Cost advantage: $70/mo vs $500+/mo competitors
- Citation requirement: Link to official American Legal Publishing source

## Risk Register

| Risk | Status | Owner | Mitigation |
|------|--------|-------|------------|
| Hallucination/incorrect answers | 🔍 Monitoring | Dev | RAG grounding, confidence thresholds |
| Code updates not reflected | 🔍 Monitoring | Dev | Automated scraping, version alerts |
| Staff resistance | 🔍 Monitoring | Michael | Position as assistive, not replacement |
| Legal liability | 🔍 Monitoring | Legal | Disclaimers, escalation paths |

## Next Deliverables

### Phase 2 — Resources
- [ ] PCD Director contact and partnership discussion
- [ ] Zoning code export/permission
- [ ] Common FAQ list from staff
- [ ] Qdrant instance setup
- [ ] Gemini API production key
- [ ] Zoning map acquisition

### Phase 3 — SPEC
- [ ] Technical architecture document
- [ ] UI/UX wireframes
- [ ] API specifications
- [ ] Testing strategy
- [ ] Security/privacy review

### Phase 4 — Build Checklist
- [ ] Implementation roadmap
- [ ] Copy-paste code blocks
- [ ] Staff training guide
- [ ] Deployment checklist
- [ ] Analytics dashboard

---

**Last Updated:** February 19, 2026 11:04 PM
