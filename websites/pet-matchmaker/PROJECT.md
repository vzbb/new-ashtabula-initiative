# PROJECT — Pet Matchmaker

## Desired Functionality (from CSV)
- **Pet Matchmaker:** Bot that asks about lifestyle and suggests available dogs from the database.

## Current Functionality (observed)
- Single-page React UI with basic input fields.
- Uses Gemini API to generate a response based on user inputs.
- Output is shown on-screen only; no persistence or backend workflows.

## Gaps
- No real data integrations (Petfinder API, shelter databases).
- No persistence, intake routing, or audit trail.
- No operational integrations (SMS/email) tied to real systems.
- Limited validation, multi-step flows, or admin tooling.
- No personality-based matching algorithm.

## Research-Validated Direction (Phase 1 Complete)
See `PHASE1-RESEARCH.md` for comprehensive market analysis.

**Key Findings:**
- Primary partner: Ashtabula County Animal Protective League (ACAPL), 440-224-1222
- Competitor gap: No hyper-local, personality-based matching tool exists
- Technical feasibility: Petfinder API is FREE, validated methodology exists (ASPCA Meet Your Match)
- Market: ~2,500-3,000 annual shelter intakes, ~1,500 adoptable pets/year

**Recommended MVP:**
1. 15-question lifestyle quiz for adopters
2. Petfinder API integration (Ashtabula filter)
3. Simple personality badges (shelter-assessed)
4. AI-powered match scoring (0-100% compatibility)
5. ACAPL branding/integration

## High‑Priority Improvements
1. **Petfinder API Integration** — Real adoptable pet data from ACAPL
2. **Personality Assessment System** — Shelter-side + adopter-side quizzes
3. **Match Algorithm** — Compatibility scoring based on lifestyle/personality fit
4. **Persistence Layer** — Match history, adoption applications, shelter dashboard
5. **Multi-step Flow** — Guided adoption journey, not just a chatbot

## Assumptions
- ACAPL partnership can be secured (must validate in Phase 2)
- Petfinder API access is free and available
- Shelter staff willing to complete personality assessments
- Adopters willing to complete lifestyle quiz before browsing

## Status
- Phase 1 Research: ✅ COMPLETE (13KB document)
- Phase 2 Outreach: ⏳ Pending
- Phase 3 SPEC: ⏳ Pending
- Phase 4 Build: ⏳ Pending
