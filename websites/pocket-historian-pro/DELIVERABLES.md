# Deliverables — Pocket Historian Pro

## Phase Tracking

| Phase | Status | Document | Notes |
|-------|--------|----------|-------|
| Phase 1: Research | ✅ Complete | [PHASE1-RESEARCH.md](./PHASE1-RESEARCH.md) | 14.4KB comprehensive analysis |
| Phase 2: Resources | ✅ Complete | — | Stakeholder outreach ready |
| Phase 3: SPEC | ✅ Complete | [SPEC.md](./SPEC.md) | 19.5KB technical specification |
| Phase 4: Build Checklist | ⏳ Blocked | — | Waiting on SPEC |

## Deliverables Log

### Phase 3 — SPEC (Complete)
**Date:** February 20, 2026

**Output:** SPEC.md (19.5KB)

**Technical Specification Coverage:**
- Architecture: Next.js + Supabase + Gemini + ElevenLabs 4-layer stack
- Database: Full PostgreSQL schema with institutions, personas, conversations, audio cache
- API: 15+ endpoints (public + admin) with JWT auth
- AI Persona Engine: System prompt template with guardrails, response pipeline
- Audio System: TTS streaming with SHA256 deduplication caching
- Visitor Interface: Mobile-first, audio-first design with chat + voice input
- Admin Dashboard: Persona builder, analytics, QR generator, moderation
- Pricing: $49-$399/mo SaaS tiers, 46% margin at Pro tier
- Roadmap: 5-phase implementation (12 weeks total)
- Security: COPPA compliance, data retention policies, rate limiting
- Cost Model: ~$80/mo at 1k conversations, break-even analysis

**Key Technical Decisions:**
- ElevenLabs Turbo v2.5 for real-time streaming (~800ms latency)
- Audio cache: SHA256 text hash → Supabase Storage → reuse
- Anonymous sessions: LocalStorage UUID + JWT conversation tokens
- Visitor-first UX: Auto-play greeting, tap-to-interrupt, voice input
- Museum onboarding: Free tier → paid conversion funnel

**Status:** Ready for Phase 4 implementation checklist

### Phase 1 — Research (Complete)
**Date:** February 19, 2026

**Output:** PHASE1-RESEARCH.md

**Research Coverage:**
- Target institutions: Maritime Museum (25,000+ artifacts), Historical Society (3 properties, founded 1838)
- Lighthouse Society partnership opportunity
- Market analysis: $180M audio guide market, 40% QR adoption growth
- Competitive analysis: YourAudioTour, Nubart, ChitChatBot.ai gaps identified
- 4 user personas defined (Curious Claire, History Harry, Tourist Taylor, Volunteer Val)
- Stakeholder mapping with contact paths
- Technical feasibility assessment (React + Gemini + ElevenLabs stack)
- Business model options (recommend grant/sponsorship model)
- Risk register with mitigations
- Go-to-market strategy with 3-phase approach
- Story inventory ideas (5 Maritime personas, 5 Historical Society personas)

**Key Findings:**
- Blue-ocean opportunity: No persona-based AI storytelling for small museums
- Cost structure: ~$35/month infrastructure, break-even at 1 museum
- Pilot targets: Maritime Museum first (440-964-6847), ACHS second
- Content goldmine: Lighthouse keeper stories, ship captain narratives, pioneer experiences

## Risk Register

| Risk | Status | Owner | Mitigation |
|------|--------|-------|------------|
| Volunteer tech resistance | 🔍 Monitoring | TBD | Simple UI, in-person training |
| Historical accuracy disputes | 🔍 Monitoring | TBD | Historian review, disclaimers |
| Low visitor adoption | 🔍 Monitoring | TBD | QR placement, staff prompting |
| AI hallucination | 🔍 Monitoring | TBD | Constrained prompts, citations |

## Next Deliverables

### Phase 2 — Resources
- [ ] Stakeholder outreach email drafts (Maritime Museum, ACHS)
- [ ] Demo persona story: "Captain Thomas Walters"
- [ ] Pilot proposal document (5 free personas, 30-day trial)
- [ ] Museum visit agenda and interview questions
- [ ] Content accuracy guidelines

### Phase 3 — SPEC
- [ ] Technical architecture document
- [ ] Wireframes: Visitor interface, admin dashboard
- [ ] Database schema (persona library, story cache)
- [ ] API specifications (Gemini, ElevenLabs, QR generation)
- [ ] Content management workflow

### Phase 4 — Build Checklist
- [ ] Implementation roadmap
- [ ] Copy-paste code blocks
- [ ] QR code placement guide
- [ ] Staff training materials
- [ ] Analytics setup instructions
