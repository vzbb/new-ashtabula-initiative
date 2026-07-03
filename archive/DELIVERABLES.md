---

## 2026-02-20 — license-wizard Phase 4 Build Checklist Complete (Heartbeat Deliverable)
- `websites/license-wizard/PHASE4-BUILD.md` — 47KB comprehensive build checklist
  - **Complete Project Setup:** Vite + React + TypeScript + Tailwind configuration
  - **Type Definitions:** Full TypeScript interfaces for BusinessProfile, LicenseRequirement, WizardStep
  - **License Database:** 15+ Ashtabula-specific requirements across Federal/State/County/City
    - Federal: EIN, TTB (alcohol), FFL (firearms), USDOT
    - State: SOS registration, Vendor's license, Workers' comp, Unemployment, Food service
    - County: Commercial permits, Home occupation permits
    - City: Zoning, Sign permits, Home occupation
  - **5-Step Wizard Flow:** Welcome → Business Type → Location → Activities → Entity → Results
  - **UI Components:** StepIndicator, OptionCard, LicenseCard with full styling
  - **PDF Generation:** jsPDF integration for downloadable checklists
  - **Full Source Code:** Copy-paste ready components (StepIndicator.tsx, BusinessTypeStep.tsx, etc.)
  - **Build Commands:** Complete deployment instructions for Cloudflare/Netlify/Vercel
  - **Testing Checklist:** Functionality, responsive design, accessibility, performance
  - **Time Estimate:** 6-7 hours for single developer
- **Status:** 🟢 Phase 4 Complete — Ready for development kickoff
- **Previous Phases:** Phase 1 Research (9.9KB), Phase 2 Resources (14.4KB), Phase 3 SPEC (20.7KB)
- **Next Steps:** Execute build checklist OR seek City PCD endorsement first
- **Website Tracking:** license-wizard status 🟢 (all 4 phases complete)

---

## 2026-02-20 — Comparable Community Case Studies Research (Heartbeat Deliverable)
- `COMPARABLE-COMMUNITY-CASE-STUDIES.md` — 8KB comprehensive research analysis
  - **Star Performers Analyzed:** Grand Rapids (MI), Pittsburgh (PA), St. Louis (MO)
  - **Success Pattern Identified:** Manufacturing legacy + University anchor + Innovation infrastructure = Knowledge economy transition
  - **Key Finding:** Concentrated downtown density outperforms sprawl; civic tech reduces friction for new businesses
  - **Ashtabula Applications:** Kent State partnership, healthcare anchor positioning, permit-whisperer as competitive advantage
  - **Comparable by Size:** Allentown PA, McKeesport PA, Sandusky OH — all succeeded through focus vs. breadth
  - **Funding Models:** Wisconsin Main Street Program, ARC, EDA, DOT grants identified
  - **Actionable Recommendations:** Immediate (30 days), Short-term (90 days), Medium-term (6 months)
  - **Competitive Advantages:** Lake Erie location, manufacturing heritage, 68+ civic tech prototypes (first-mover)
  - **Risks to Avoid:** Sprawl trap, car dependency, waiting for "big employer"
- **Status:** ✅ Research complete → Ready for strategic planning integration
- **Next Steps:** Michael review for alignment with initiative priorities

---

## 2026-02-20 — pet-matchmaker Phase 2 Resource Procurement Complete (Heartbeat Deliverable)
- `websites/pet-matchmaker/PHASE2-OUTREACH.md` — 16.5KB comprehensive stakeholder outreach package
  - **ACAPL Primary Contact Secured:** Director Josh D., 440-224-1222, acapl@acapl.org, best call time Tue-Thu 10am-12pm
  - **Secondary Shelter Contacts:** Humane Society Ashtabula County, Animal Welfare Center, Harbor Cat Rescue, Winky Cats
  - **4 Copy-Paste Email Templates:** ACAPL partnership intro, vet sponsorship inquiry, user survey distribution, secondary shelter outreach
  - **User Research Plan:** 8-question survey (target 25 responses), 30-min interview script (target 5-8 participants), distribution channels (Facebook groups: 20K+ members)
  - **Veterinary Partner Pipeline:** 4 clinics identified with sponsorship tiers ($50-100/mo)
  - **Technical Resource Verification:** Petfinder API FREE, OpenAI ~$0.01-0.05/match, Supabase FREE, Vercel FREE — total monthly cost $5-20
  - **Grant Opportunities Mapped:** Best Friends Network ($500-5K), PetSmart Charities ($5K-50K), ASPCA Community Grants ($5K-25K)
  - **4-Week Outreach Execution Checklist:** Week-by-week action plan with milestones
- **Status:** 🟡 Phase 2 Complete → Ready for Phase 3 (SPEC) or execute outreach
- **Previous Phase:** Phase 1 Research (13KB) completed 2026-02-19
- **Next Steps:** Execute ACAPL outreach (call 440-224-1222), launch user survey, contact vet clinics
- **Website Tracking:** pet-matchmaker status 🟡 (phases 1-2 complete)

---

## 2026-02-20 — eligibility-screener Phase 2 Resource Procurement Complete (Heartbeat Deliverable)
- `websites/eligibility-screener/PHASE2-OUTREACH.md` — 14.5KB comprehensive stakeholder outreach package
  - **Stakeholder Contact Directory:** 5 primary government partners (ACDJFS, ACCAA, Direction Home, 211, Council on Aging) with contacts, best times
  - **4 Copy-Paste Email Templates:** ACDJFS partnership intro, ACCAA HEAP/PIPP verification, 211 data partnership, Council on Aging senior programs
  - **Resident Validation Survey:** 5-question survey for Facebook groups and physical distribution
  - **Program Data Verification Checklist:** 8 programs (SNAP, Medicaid, HEAP, PIPP, Childcare, OWF, WIC, Senior programs)
  - **Technical Resource Assessment:** Integration options ranked (Ohio Benefits links = high, 211 API = medium)
  - **Content Maintenance Strategy:** 3 options — manual updates (MVP), stakeholder network (recommended), automated monitoring (future)
  - **Competitive Feature Audit:** FindHelp.org, Benefits.gov, 211, Ohio Benefits gaps/opportunities mapped
  - **Risk Assessment Matrix:** 6 risks with mitigation strategies (outdated info harm mitigation: disclaimers + official source links)
- **Status:** 🟡 Phase 2 Complete → Ready for Phase 3 (SPEC) or execute outreach
- **Previous Phase:** Phase 1 Research (13KB) completed 2026-02-18
- **Next Steps:** Execute outreach emails OR proceed to SPEC.md with conservative assumptions
- **Website Tracking:** eligibility-screener status 🟡 (phases 1-2 complete)

---

## 2026-02-19 — license-wizard Phase 3 SPEC Complete (Heartbeat Deliverable)
- `websites/license-wizard/SPEC.md` — 20.7KB comprehensive technical specification
  - **Product Definition:** Free wizard helping Ashtabula business owners identify required licenses across federal, state, county, and city levels
  - **6-Step Wizard Flow:** Welcome → Business Type → Location → Activities → Entity Type → Results
  - **Business Types Supported:** Restaurant, Retail, Contractor, Home-Based, Professional, Transportation, Alcohol, Firearms, Agriculture
  - **License Database:** 50+ requirements mapped with costs, forms, contacts, prerequisites
  - **Requirement Matching Algorithm:** Rule-based engine filtering by business type, location, activities, entity type
  - **Tech Stack:** React 18 + Vite + Tailwind CSS + jsPDF (no backend required)
  - **Data Models:** Complete TypeScript interfaces for BusinessProfile, LicenseRequirement, ChecklistResult
  - **UI/UX Specifications:** Design system (Blue-800 primary, Green-600 accent), component mockups, responsive breakpoints
  - **Features:**
    - P0: Multi-step wizard, dynamic results, cost calculator, PDF generation, email results, localStorage persistence
    - P1: Calendar reminders (.ics), progress tracking, renewal alerts
    - P2: Account system, document storage, township expansion
  - **Integrations:** mailto: links for email, Formspree fallback, direct PDF form links, IRS/Ohio SOS/County/City websites
  - **Security:** 100% client-side, no PII required, privacy-first analytics
  - **Deployment:** Cloudflare Pages (recommended), Netlify, Vercel alternatives
  - **Success Metrics:** 50 completions @ 30 days, 200 @ 90 days, >60% completion rate
  - **Open Questions:** City PCD endorsement, variable fee schedules, township variations, renewal tracking email capture
- **Status:** 🟡 → 🟢 Phase 3 Complete → Ready for Phase 4 (BUILD Checklist)
- **Previous Phases:** Phase 1 Research (9.9KB), Phase 2 Resources (14.4KB)
- **Next Steps:** Phase 4 BUILD checklist with copy-paste implementation steps
- **Website Tracking:** license-wizard status 🟡 → 🟢

---

## 2026-02-19 — cashflow-tracker Phase 2 + Phase 3 Complete (Heartbeat Deliverable)
- `websites/cashflow-tracker/PHASE2-OUTREACH.md` — 7.5KB resource procurement package
  - **Target Contacts Acquired:** SBDC at YSU (330-941-2140, partnership angle), Ashtabula Growth Partnership (endorsement request), 3 local accountants (validation interviews)
  - **3 Email Templates:** SBDC partnership request, Growth Partnership endorsement, Accountant validation (copy-paste ready)
  - **User Interview Plan:** Facebook groups (3), Chamber directories, GOTL Strip field visits; 7-question interview script
  - **Technical Resources:** Firebase (free tier selected over Supabase for consistency), Plaid pricing verified ($0.30/auth after 100 free), manual entry fallback strategy
  - **Data Sources to Acquire:** SBA small business profiles, Tourism Council visitor data, City RLF requirements, SBDC industry benchmarks
  - **Next Steps Checklist:** 8 outreach actions ready for execution
- `websites/cashflow-tracker/SPEC.md` — 8.5KB comprehensive technical specification
  - **Product Definition:** Free cash flow tracking for Ashtabula micro-businesses with seasonal awareness
  - **P0 MVP Features:** Manual entry, cash position dashboard, 30-day forecast, category tracking, transaction history, CSV export, seasonal view
  - **P1/P2 Roadmap:** Bank sync (Plaid), recurring transactions, goal tracking, lender reports, AI insights
  - **Tech Stack:** React 19 + Vite + Tailwind + Firebase (Auth, Firestore, Hosting)
  - **Data Model:** Complete TypeScript interfaces for User, Transaction, Category, CashSnapshot
  - **UI/UX Specs:** Dashboard wireframe, add transaction modal, design system (colors, typography)
  - **Security:** Firestore RLS rules, user data isolation
  - **Performance Targets:** <2s TTI, <500ms dashboard load, >90 Lighthouse score
  - **Success Criteria:** 50 users month 1, 200 users day 90, 20% weekly retention
- **Status:** 🟡 Phases 2-3 Complete → Ready for Phase 4 (BUILD Checklist) or Phase 2 execution (outreach)
- **Previous Phase:** Phase 1 Research (12.9KB) completed 2026-02-18
- **Next Steps:** Execute outreach emails (pending Michael approval) OR proceed to Phase 4 BUILD checklist

---

## 2026-02-19 — engineers-assistant Phase 4 Build Checklist Complete (Heartbeat Deliverable)
- `websites/engineers-assistant/PHASE4-BUILD.md` — 24KB comprehensive build checklist
  - **Complete Initialization Commands:** Copy-paste commands for Next.js + shadcn setup, dependency installation, environment configuration
  - **Supabase Setup:** Complete SQL schema for sessions, messages, feedback, events tables; RLS policies; indexes
  - **Pinecone Configuration:** Index creation commands (1536 dims, cosine metric), namespace structure
  - **File Structure:** Complete project layout with 20+ files organized by feature
  - **Week-by-Week Implementation:** 
    - Week 1: Foundation (Supabase/Pinecone/OpenAI integration, RAG pipeline, API routes, Chat UI)
    - Week 2: Features (Topic Browser, Permit Wizard, Contacts Page, Feedback system)
    - Week 3: Polish (mobile responsive, testing, deployment)
  - **Full Code Samples:** 15+ copy-paste code blocks for lib/supabase.ts, lib/pinecone.ts, lib/openai.ts, lib/rag.ts, API routes, React components
  - **Knowledge Base Ingestion:** Complete TypeScript script for markdown → Pinecone vectorization
  - **Data Files:** topics.ts, contacts.ts, wizard-flows.ts with Ashtabula-specific content
  - **Testing Checklist:** Unit tests (Jest), E2E tests (Playwright), manual testing matrix
  - **Deployment Guide:** Vercel commands, environment variables, custom domain setup
  - **Cost Estimate:** $15/month (OpenAI usage), all other services on free tiers
  - **5-Week Timeline:** 40-50 hours total effort for single developer
- **Status:** 🟢 All 4 Phases Complete — Ready for development kickoff
- **Previous Phases:** Phase 1 Research (15.4KB), Phase 2 Resources (1,200 words), Phase 3 SPEC (2,800 words)
- **Next Steps:** Begin Week 1 implementation, populate knowledge base with City/County documents, coordinate stakeholder outreach
- **Website Tracking:** engineers-assistant status 🟡 → 🟢

---

## 2026-02-19 — pet-matchmaker Phase 1 Research Complete (Heartbeat Deliverable)
- `websites/pet-matchmaker/PHASE1-RESEARCH.md` — 13KB comprehensive research document
  - **Problem Solved:** Ashtabula County residents face fragmented pet discovery across multiple platforms; 10-15% of adoptions fail due to personality/lifestyle mismatches
  - **Market Data:** ~2,500-3,000 annual shelter intakes, ~1,500 adoptable pets/year, 40,000 county households
  - **Key Shelters Mapped:** ACAPL (primary, 440-224-1222), Humane Society of Ashtabula County, Animal Welfare Center, Harbor Cat Rescue, Winky Cats
  - **Competitor Analysis:** Petfinder (17,000 shelters), Adopt-a-Pet (largest non-profit), PawsLikeMe (personality matching — no local focus), ASPCA Meet Your Match (research-based methodology)
  - **Market Gap:** No hyper-local, AI-powered personality matching tool exists for rural counties; national platforms don't prioritize local shelters
  - **Solution Concept:** "Tinder for pet adoption" — 15-question lifestyle quiz + shelter-side personality profiles + AI match scoring (0-100% compatibility)
  - **Differentiation:** Hyper-local Ashtabula focus, AI personality matching, foster-to-adopt workflow, return prevention support
  - **4 User Personas:** Searching Sarah (adopter), Foster Freddie (foster parent), Busy Shelter Becky (ACAPL staff), Returning Robert (experienced owner)
  - **Tech Stack:** Next.js + Supabase + Petfinder API (FREE) + OpenAI for matching algorithm
  - **Revenue Options:** Free civic tool (recommended), shelter SaaS $29-49/mo, freemium adopter features $9/mo
  - **4 Critical Blockers:** ACAPL partnership commitment, shelter staff assessment burden, adopter quiz completion willingness, match outcome validation
  - **Build Estimate:** 30-40 hours (MVP), 4-6 weeks part-time
- **Status:** 🔴 → 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement/Stakeholder Outreach)
- **Next Steps:** Contact ACAPL director for partnership meeting, sign up for Petfinder API, survey 20+ potential adopters, tour shelter to observe process
- **Website Tracking:** pet-matchmaker status 🔴 → 🟡

---

## 2026-02-19 — engineers-assistant Phase 1 Research Complete (Heartbeat Deliverable)
- `websites/engineers-assistant/PHASE1-RESEARCH.md` — 15.4KB comprehensive research document
  - **Problem Solved:** Ashtabula homeowners and contractors face confusion navigating city/county engineering requirements; must call multiple offices during business hours
  - **Jurisdictional Complexity:** City Engineering (streets, sewer, curb cuts) + County Building (permits, inspections) + City Zoning (setbacks) — overlap confuses residents
  - **User Personas:** 4 types — Homeowner Hank (driveway questions), DIY Darla (decks/sheds), Small Contractor Carl (permits/pricing), New Neighbor Nancy (process guidance)
  - **10 Common Questions Mapped:** Driveway permits, sidewalk repair, drainage solutions, shed/deck requirements, excavation/utility rules, sewer connections
  - **Competitor Analysis:** CivicPlus, CivCheck, Civic Atlas — all enterprise-focused, none serve small cities; no free consumer tool exists
  - **Differentiation:** Free, Ashtabula-specific, 24/7 availability, multi-jurisdictional knowledge, project-based guidance
  - **Stakeholders Mapped:** City Engineering (440-992-7111), County Building (440-576-3737), Zoning Office, Mayor's Office
  - **Revenue Options:** Free civic service (recommended), freemium Pro $9/mo, City license $499/mo
  - **4 Critical Blockers:** City partnership, liability/disclaimers, code access, County coordination
  - **Synergies:** permit-whisperer (applications), zoning-clerk (setbacks), contractor-match (referrals)
  - **MVP Scope:** Conversational AI + topic browser + permit checker + contact directory
  - **Build Estimate:** 30-40 hours, 4-5 weeks part-time
- **Status:** 🔴 → 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement)
- **Next Steps:** Contact City Engineer and County Building Department for stakeholder meetings; survey 10-15 homeowners; compile complete code/fee documentation
- **Website Tracking:** engineers-assistant status 🔴 → 🟡

---

## 2026-02-19 — curbside-pickup-tracker Phase 1 Research Complete (Heartbeat Deliverable)
- `websites/curbside-pickup-tracker/PHASE1-RESEARCH.md` — 12.6KB comprehensive research document
  - **Problem Solved:** Ashtabula restaurants/retailers lack affordable curbside coordination tool; customers wait unsure, businesses field constant calls
  - **Market Size:** ~200 potential businesses, ~150 active curbside operators in county
  - **User Personas:** 4 types — Hurry-Up Hannah (time-starved parent), Overwhelmed Omar (restaurant owner), Regular Rita (senior), Manager Miguel (multi-location)
  - **Competitor Analysis:** Olo ($300+/mo), Toast ($165+/mo), ChowNow ($149/mo) — all too expensive for small businesses
  - **Market Gap:** No sub-$50/mo curbside tool exists for businesses with <20 employees
  - **Differentiation:** Free tier (20 orders/mo), Pro $19/mo, Ashtabula-branded, license plate photo matching
  - **Stakeholders Mapped:** Bascule Grill, Ferrante Winery, Covered Bridge Pizza, Main Street Ashtabula, Chamber of Commerce
  - **Tech Stack:** Next.js + Supabase + Twilio + Mapbox (estimated MVP: 40-50 hours)
  - **Revenue Model:** Freemium → Pro $19/mo → Business $49/mo; target 50 businesses = $11,400/year
  - **Open Questions:** 8 blockers including business validation, customer habit (SMS vs app), Toast/Square saturation
  - **Next Steps:** Survey 10 businesses + 50 customers, secure 3+ beta commitments, Chamber partnership outreach
- **Status:** 🔴 → 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement)
- **Website Tracking:** curbside-pickup-tracker MVP #20 status 🟡

---

## 2026-02-19 — compassionate-planner Phase 3 SPEC Complete (Heartbeat Deliverable)
- `websites/compassionate-planner/SPEC.md` — 28KB comprehensive technical specification
  - **Product Definition:** End-of-life planning platform for Ashtabula families, funeral homes, and hospice organizations
  - **Problem Solved:** Families arrive at funeral homes unprepared; 18,000+ Ashtabula seniors lack digital planning tools
  - **Architecture:** Next.js 14 + Supabase (PostgreSQL + Auth + Storage) + Vercel hosting
  - **Database Schema:** Complete SQL schema for profiles, plans, modules, documents, shares, activity_logs, directory_listings
  - **6 Core Features Specified:**
    - F1: User Authentication (email/password + magic links + Google OAuth)
    - F2: Planning Checklists (6 modules: Basic Info, Funeral Preferences, Financial, Legal, Digital Legacy, Personal Wishes)
    - F3: Document Storage (PDF/JPG/PNG, AES-256 encryption, 10MB limit)
    - F4: Family Sharing (View/Contributor/Full access levels, revocable)
    - F5: Local Directory (5+ funeral homes, hospice orgs, attorneys mapped)
    - F6: Print Export (PDF plan generation, wallet card option)
  - **UI/UX Specs:** Page structure, dashboard wireframe, planning wizard layout, design system (colors, typography)
  - **API Specs:** Full RESTful endpoint definitions with request/response formats
  - **Security:** Encryption at rest/transit, RLS policies, GDPR compliance, audit logging
  - **Accessibility:** WCAG 2.1 AA compliance, 44px touch targets, screen reader support
  - **Performance Targets:** FCP < 1.5s, API p95 < 200ms, Lighthouse > 90
  - **Implementation Phases:** MVP (4 weeks) → Polish (4 weeks) → B2B Portal (4 weeks) → Scale (4 weeks)
  - **Revenue Model:** Freemium B2C + Funeral Home SaaS ($99-299/mo) + Hospice Partnership ($500-2000/mo)
  - **Tech Stack Rationale:** Next.js for SEO/SSR, Supabase for managed backend, Vercel for edge deployment
  - **Previous Phases:** Phase 1 Research (15KB) and Phase 2 Outreach (18KB) already complete
- **Status:** 🟡 Phase 3 Complete → Ready for Phase 4 (BUILD Checklist) or Phase 2 execution (outreach)
- **Next Steps:** Create PHASE4-BUILD.md with copy-paste implementation commands, or begin funeral home outreach per PHASE2-OUTREACH.md
- **Website Tracking:** compassionate-planner status 🟡 (phases 1-3 complete)

---

## 2026-02-19 — ai-docent Phase 1 Research Complete (Heartbeat Deliverable)
- `websites/ai-docent/PHASE1-RESEARCH.md` — 15KB comprehensive research document
  - **Problem Solved:** Ashtabula museums operate with all-volunteer staff, no digital interpretation; visitors lack on-demand context for exhibits
  - **Market Data:** 6+ museums serving ~70,000 annual visitors; zero paid staff across institutions; national AI docent solutions cost $10K–50K+
  - **Key Museums:** Ashtabula County Historical Society (3 properties), Victorian Perambulator Museum (world's only), Hubbard House UGRR Museum, Maritime Museum
  - **User Personas:** 4 types — Curious Carol (weekend tourist), Teacher Tom (educator), Volunteer Vivian (coordinator), Accessible Alex (visitor with disability)
  - **Competitor Analysis:** Smartify (enterprise $5K–20K+/yr), Guidekick ($10K+), DIY GPTs (require technical knowledge) — none serve small museums
  - **Market Gap:** No affordable AI docent for small museums (<10K annual visitors); accessibility features (multilingual, audio descriptions) out of reach
  - **Differentiation:** First affordable AI docent ($29–79/mo), purpose-built for small museums, PWA (no app download), QR-code activation, grant-ready reporting
  - **Revenue Model:** Freemium SaaS — Free (1 museum, 10 artifacts) → Museum $29/mo (unlimited) → Network $79/mo (multi-site) → Custom $199+/mo
  - **Stakeholders Mapped:** ACHS (board), Perambulator Museum, Hubbard House, Maritime Museum, Visit Ashtabula County (potential funder)
  - **Grant Opportunities:** Ohio Arts Council, Ohio History Connection, IMLS, NEH Digital Humanities
  - **Open Questions:** 5 blockers for Phase 2 including museum buy-in, content creation burden, WiFi connectivity, volunteer tech anxiety
  - **Next Steps:** Contact priority museums (ACHS, Perambulator, Hubbard House), validate pain points, secure 2+ pilot commitments
- **Status:** 🔴 → 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement)
- **Website Tracking Updated:** ai-docent status changed 🔴 → 🟡

## 2026-02-19 — pocket-sommelier Phase 1 Research Complete (Heartbeat Deliverable)
- `websites/pocket-sommelier/PHASE1-RESEARCH.md` — 11KB comprehensive research document
  - **Problem Solved:** Diners in Ashtabula's 30+ winery region lack pairing guidance; static menus + generic apps fail local wine discovery
  - **Market Data:** 30+ wineries, ~500K annual wine trail visitors, $50M+ economic impact
  - **Key Wineries with Restaurants:** Ferrante (largest), Grand River Cellars, Laurello, Fitzgerald's Wine Bar
  - **User Personas:** 4 types — Weekend Wine Tourist Sarah, Server Mike, Local Foodie Jennifer, Restaurant Owner David
  - **Competitor Analysis:** Vivino (poor local coverage), Delectable (no pairing), Hello Vino (limited database) — none Ashtabula-focused
  - **Market Gap:** No QR-based AI pairing tool for local wine + restaurant ecosystem
  - **Differentiation:** Hyper-local Ashtabula wine database, QR simplicity, AI personalization, free for diners
  - **Revenue Model:** Restaurant SaaS — Free → Pro $49/mo → Enterprise $149/mo
  - **Stakeholders Mapped:** Ferrante Winery, Grand River Cellars, Fitzgerald's, Bascule, Vines & Wines Wine Trail
  - **Open Questions:** 5 critical blockers for Phase 2 including restaurant participation, AI quality threshold, inventory maintenance burden
  - **Next Steps:** Contact Ferrante and Grand River Cellars, survey 20+ diners, validate AI pairing quality
- **Status:** 🔴 → 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement)
- **Website Tracking Updated:** pocket-sommelier status changed 🔴 → 🟡

---

## 2026-02-18 — harvest-alert Phase 1 Research Complete (Heartbeat Deliverable)
- `websites/harvest-alert/PHASE1-RESEARCH.md` — 10.9KB comprehensive research document
  - **Problem Solved:** Farmers lack simple, affordable way to notify customers when crops are ready; Facebook only reaches 10% of followers
  - **Market Data:** Ashtabula Farmers Market (5,400+ followers), active U-pick operations, CSA programs (Peters Creek Farm, Covered Bridge Gardens)
  - **User Personas:** 4 types — U-Pick Patty (strawberry farmer), CSA Chris (coordinator), Eager Emma (customer), Backyard Bob (surplus gardener)
  - **Competitor Analysis:** Barn2Door ($99+/mo), Local Line ($29+/mo), Farmish (national, no local presence) — all too expensive/complex for small farms
  - **Market Gap:** No free/ultra-low-cost harvest alert tool with Ashtabula-specific crop data and weather predictions
  - **Differentiation:** Free tier (50 SMS subscribers), Ashtabula crop database, weather-based harvest predictions, no app download required
  - **Revenue Model:** Free forever → Pro $9/mo (unlimited SMS/crops) → Farm Stand $29/mo (multi-farmer, embeddable widget)
  - **Stakeholders Mapped:** Ashtabula Farmers Market, OSU Extension Ashtabula, Peters Creek Farm, Covered Bridge Gardens
  - **Open Questions:** 5 blockers for Phase 2 including farmer tech adoption, customer SMS vs email preference, OSU Extension partnership, Twilio costs at scale
  - **Next Steps:** Contact Farmers Market manager, OSU Extension agriculture educator, 3-5 U-pick farms for discovery calls and validation surveys
- **Status:** 🔴 → 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement)
- **Website Tracking Updated:** harvest-alert status changed 🔴 → 🟡

---

## 2026-02-18 — volunteer-scheduler Phase 1 Research Complete (Heartbeat Deliverable)
- `websites/volunteer-scheduler/PHASE1-RESEARCH.md` — 11.4KB comprehensive research document
  - **Problem Solved:** Nonprofit coordinators waste 5-10 hrs/week on manual volunteer scheduling via spreadsheets/email
  - **Market Data:** 800+ nonprofits in Ashtabula County, 150-200 with active volunteer programs, 15,000+ volunteers
  - **User Personas:** 4 types — Coordinating Carla (ACCAA), Busy Benjamin (church), Helping Hannah (retiree), Festival Frank (event coordinator)
  - **Competitor Analysis:** SignUpGenius (free=ads), VolunteerLocal ($600+/yr), POINT (free but national) — none Ashtabula-focused
  - **Market Gap:** No free, locally-branded tool with grant-ready hour tracking + county-wide volunteer discovery
  - **Differentiation:** Ashtabula-only focus, "volunteer passport" (hours across orgs), true free tier, nonprofit consortium features
  - **Revenue Model:** Free forever → Pro $9/mo (SMS, unlimited) → Organization $19/mo (multi-coordinator)
  - **Stakeholders Mapped:** RSVP Ashtabula (Stephanie Blessing), United Way, ACCAA (Katie Lamson), 211 Ashtabula
  - **Open Questions:** 8 blockers for Phase 2 including coordinator tech comfort, United Way endorsement, grant reporting requirements
  - **Next Steps:** Contact RSVP/United Way/ACCAA, survey 10-15 coordinators, validate freemium willingness
- **Status:** 🔴 → 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement)
- **Website Tracking Updated:** volunteer-scheduler status changed 🔴 → 🟡

---

## 2026-02-18 — hvac-tuneup Phase 1 Research Complete (Heartbeat Deliverable)
- `websites/hvac-tuneup/PHASE1-RESEARCH.md` — 14.6KB comprehensive research document
  - **Problem Solved:** Ashtabula homeowners rely on phone-only HVAC booking; ZERO local contractors offer online scheduling
  - **Market Data:** 10+ HVAC contractors identified (HAVE, Blank, Hearn, Ryan, Ogram + independents); maintenance plans $150-300/year; emergency repairs 2-5x premium
  - **User Personas:** 4 types — Preventive Patty (planner), Emergency Eddie (crisis), Landlord Larry (multi-property), New Neighbor Nancy (new to area)
  - **Seasonal Pattern:** Peak demand Dec-Feb (heating) and Jul-Aug (cooling) — Lake Erie climate creates severe winter demand spikes
  - **Competitor Analysis:** ServiceTitan, Jobber, Housecall Pro (all contractor-side only); Angi/HomeAdvisor (expensive, Ashtabula coverage weak)
  - **Market Gap:** No consumer-facing platform helps homeowners find, compare, and book local HVAC services
  - **Differentiation:** Ashtabula-only focus, online booking for homeowners, maintenance reminders, transparent pricing estimates
  - **Revenue Model:** Free for homeowners; contractor tiers $49-99/mo; featured listings $25/mo
  - **Open Questions:** 10 blockers for Phase 2 including contractor willingness, market sizing, homeowner behavior validation
  - **Next Steps:** Contact 5-7 local HVAC contractors for discovery calls, survey 20+ homeowners, complete market sizing analysis
- **Status:** 🔴 → 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement)
- **Website Tracking Updated:** hvac-tuneup status changed 🔴 → 🟡

---

## 2026-02-18 — eligibility-screener Phase 1 Research Complete (Heartbeat Deliverable)
- `websites/eligibility-screener/PHASE1-RESEARCH.md` — 13KB comprehensive research document
  - **Problem Solved:** Social services information is fragmented across county/state/nonprofits; residents don't know which programs they qualify for
  - **Programs Mapped:** 10+ programs including SNAP, Medicaid, WIC, HEAP, PIPP, OWF, Childcare subsidies, Senior services, Food pantries
  - **User Personas:** 4 types — Working Mom Maria (needs childcare/SNAP), Senior Sam (HEAP/property tax), Unemployed Mike (SNAP/Medicaid/OWF), Caregiver Carol (PASSPORT waiver)
  - **Income Thresholds:** Documented 2025 FPL guidelines at 130% (SNAP), 138% (Medicaid), 150% (HEAP/PIPP), 185% (WIC)
  - **Stakeholders Mapped:** ACDJFS (440-998-1111), ACCAA (440-997-5957), Direction Home, 211 Ashtabula, County on Aging, Country Neighbor Food Bank
  - **Decision Tree:** High-level logic flow for food → healthcare → utilities → cash → childcare → senior services
  - **Competitive Gap:** No Ashtabula-specific tool; Ohio Benefits portal is complex; 211 requires phone navigation
  - **Differentiation:** Simple wizard interface, mobile-first, anonymous screening, personalized checklist generation
  - **Open Questions:** 10 questions for Phase 2 outreach including ACDJFS partnership, Ohio Benefits API access, Spanish translation needs
  - **Next Steps:** Contact ACDJFS, ACCAA, 211, and Council on Aging for program verification and partnership
- **Status:** 🔴 → 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement)
- **Website Tracking Updated:** eligibility-screener status changed 🔴 → 🟡

---

## 2026-02-18 — rental-availability Phase 1 Research Complete (Heartbeat Deliverable)
- `websites/rental-availability/PHASE1-RESEARCH.md` — 12.8KB comprehensive research document
  - **Problem Solved:** Only 25-26 rental listings county-wide, scattered across 8+ platforms, no affordable housing integration
  - **Market Data:** 2-bed FMR $794, 376 subsidized units exist but hard to find, Section 8 waitlist opens March 10 2025
  - **User Personas:** 5 types — Searching Sarah (young professional), Family Marcus (relocating), Senior Dorothy (fixed income), Landlord Larry (small owner), Worker Wendy (seasonal)
  - **Competitor Analysis:** Zillow (largest but duplicates/outdated), Apartments.com (verified only), AffordableHousingOnline (Section 8 only)
  - **Key Finding:** No platform provides unified view of market-rate + affordable housing; all optimize for urban markets
  - **Stakeholders Mapped:** AMHA (ashtabulamha.com), Ridgeview Estates, Tucker Real Estate, DTS Property Management, Western Reserve Properties, ACCAA
  - **Differentiation:** Ashtabula-only focus, affordable housing portal, free listings for small landlords (<10 units), employer workforce housing matching
  - **Revenue Options:** Landlord paid listings, application fees, employer sponsorships
  - **Risk Assessment:** Data staleness (high), low inventory (high — mitigation: include surrounding counties), AMHA partnership (high)
  - **Open Questions:** 10 blockers including AMHA data sharing, property manager participation, scrape vs. manual vs. API strategy
  - **Next Steps:** Contact AMHA for partnership, survey property managers (Ridgeview, Tucker, DTS), interview 10 renters
- **Status:** 🔴 → 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement)
- **Website Tracking Updated:** rental-availability status changed 🔴 → 🟡

---

## 2026-02-18 — service-scheduler Phase 1 Research Complete (Heartbeat Deliverable)
- `websites/service-scheduler/PHASE1-RESEARCH.md` — 12.9KB comprehensive research document
  - **Problem Solved:** Small service businesses in Ashtabula rely on phone-only booking → double-bookings, no-shows (15-30%), lost customers
  - **User Personas:** 4 types — Solo Sarah (stylist/barber), Seasonal Steve (lawn/snow), Mechanic Mike (auto shop), Therapist Tina (wellness)
  - **Competitor Analysis:** Calendly (free=limited, paid $10+/mo), Square ($29+/mo), Acuity (no free tier, $20+/mo), Fresha (salon-only)
  - **Market Gap:** No free, locally-branded scheduling tool for micro-businesses with seasonal needs
  - **Stakeholders Mapped:** Greater Ashtabula Chamber of Commerce, SBDC at YSU, Growth Partnership, 200+ Chamber members
  - **Business Categories:** Hair/beauty (25-40), auto repair (15-25), HVAC (10-15), lawn care (20-30), pet grooming (5-10), wellness (8-12), tattoos (5-8), home repair (15-25)
  - **MVP Features (Free):** Booking page, Google Calendar sync, email reminders, mobile-friendly admin
  - **Pro Features ($9-19/mo):** SMS reminders, multi-staff, custom branding, recurring appointments, intake forms, Stripe payments
  - **Local Differentiation:** "Book Local Ashtabula" discovery directory, seasonal business mode, route optimization for mobile services
  - **Draft Outreach:** Chamber partnership email prepared, ready to send
  - **Next Steps:** Email Chamber, contact SBDC, interview 20 businesses, validate pricing willingness
- **Status:** 🔴 → 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement)
- **Website Tracking Updated:** service-scheduler status changed 🔴 → 🟡

---

## 2026-02-18 — cashflow-tracker Phase 1 Research Complete (Heartbeat Deliverable)
- `websites/cashflow-tracker/PHASE1-RESEARCH.md` — 12.9KB comprehensive research document
  - **Problem Solved:** Small businesses in Ashtabula lack accessible cash flow tools; 82% of failures tied to cash flow mismanagement
  - **User Personas:** 4 types — Seasonal Sarah (tourism), Startup Marcus (solopreneur), Growth Jennifer (expanding), Resource Robert (nonprofit)
  - **Competitor Analysis:** 10+ tools analyzed (Agicap $$$, Float $59-199/mo, Tidely $60+/mo, QuickBooks $30-200/mo) — all too expensive or complex for micro-businesses
  - **Key Finding:** No free/ultra-low-cost tool exists for businesses with <10 employees, especially seasonal businesses
  - **Market Gap:** Opportunity for FREE tier + Ashtabula-specific seasonal insights
  - **Stakeholders Mapped:** SBDC at YSU, Growth Partnership, NEO Fund, 3 Chambers (Conneaut, Geneva, Ashtabula), City Revolving Loan Fund
  - **Technical Feasibility:** Plaid API for bank sync, Supabase/Firebase backend, simple MVP scope
  - **Differentiation:** Free forever tier, Ashtabula seasonality, lender-ready reports, zero learning curve
  - **Risk Assessment:** Bank API costs (mitigated by manual entry fallback), low adoption (mitigated by SBDC partnership)
  - **Open Questions:** 10 blockers covering SBDC partnership, accountant validation, Plaid costs, Growth Partnership endorsement
  - **Next Steps:** Email SBDC and Growth Partnership, survey 10-15 businesses, interview accountants
- **Status:** 🔴 → 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement)
- **Website Tracking Updated:** cashflow-tracker status changed 🔴 → 🟡

---

## 2026-02-18 — policy-pal Phase 1 Research Complete (Heartbeat Deliverable)
- `websites/policy-pal/PHASE1-RESEARCH.md` — 11.8KB comprehensive research document
  - **Problem Solved:** Residents lack visibility into City Council activities—meeting schedules buried, agendas lack context, no alert system for issues of interest
  - **User Personas:** 5 types — Engaged Resident, Small Business Owner, Nonprofit Coordinator, Journalist/Blogger, City Council Candidate
  - **Competitor Analysis:** National tools (LegiStorm, FiscalNote) are enterprise/federal-only; no affordable municipal solution exists for cities under 100K
  - **Data Sources Mapped:** Clerk of Council (clerkofcouncil@cityofashtabula.com), City website, BoxCast video, PDF agendas/minutes
  - **Stakeholders:** Primary (Clerk of Council, Council Members, Mayor's Office), Secondary (Growth Partnership, Chamber, ACDI, journalists, Historical Society)
  - **Technical Feasibility:** PDF scraping (medium effort), website monitoring (low effort), video transcription (high effort), manual curation hybrid recommended
  - **AI Enhancement Opportunities:** Plain-language summaries, topic categorization (zoning/budget/safety), impact assessment, voting record analysis
  - **MVP Features:** Meeting calendar, agenda alerts (email/SMS), plain-language summaries, topic filtering, searchable archive
  - **Business Model:** Free civic service; white-label to other cities later
  - **Risk Assessment:** Clerk cooperation (mitigated by framing as workload reduction), data format changes (flexible scraper), low adoption (partner with engaged residents)
  - **Open Questions:** 8 blockers covering cooperation, video access, alert preferences, legal review
  - **Next Steps:** Email Clerk of Council, analyze existing PDFs, survey council members, build prototype scraper
- **Status:** 🔴 → 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement)
- **Website Tracking Updated:** policy-pal status changed 🔴 → 🟡

---

## 2026-02-18 — grantgenius Phase 1 Research Complete (Heartbeat Deliverable)
- `websites/grantgenius/PHASE1-RESEARCH.md` — 8.2KB comprehensive research document
  - **Problem Solved:** Nonprofits and small businesses in Ashtabula County struggle with fragmented, time-consuming grant discovery across federal/state/county/foundation sources
  - **Competitor Analysis:** 5 grant databases analyzed (Instrumentl $50-150/mo, FDO $50-200/mo, GrantHub $75/mo, GrantStation $199/yr, GrantWatch varies) — all paid, none Ashtabula-focused
  - **Key Finding:** No free, Ashtabula County-focused grant aggregator exists; all solutions are either paid national databases or narrow single-source listings
  - **Funding Sources Mapped:**
    - Federal: USDA Rural Development (Patrick Sarver), SBA, HUD, DOT
    - State: Ohio Development Services Agency, JobsOhio (underrepresented priority), Ohio Arts Council, BWC Wellness Grant
    - Foundations: Ashtabula Foundation ($21M+ assets), Cleveland Foundation ($3B+), Foundation for Appalachian Ohio ($50M+), African American Community Fund, United Black Fund
    - Local: Ashtabula Growth Partnership, City of Ashtabula, ACCAA
  - **User Personas:** 4 types — Sarah (Nonprofit ED), Marcus (Small Business Owner), Jennifer (Grant Writer), David (Faith-Based Org Leader)
  - **Differentiation Strategy:** FREE vs paid competitors; hyper-local Ashtabula focus; deadline intelligence with proactive alerts; application support with templates; local office hours support
  - **Risk Assessment:** Data staleness (high impact), low initial adoption (medium), legal/content rights (low), sustainability (medium), scope creep (high)
  - **Open Questions:** 6 critical blockers (scrape feasibility, foundation partnership, nonprofit survey results, user preference web vs SMS, sustainability model, curation burden)
  - **Recommended Next Steps:** Contact Ashtabula Foundation (Pamela Buzon), survey 10 local nonprofits, interview Growth Partnership, test Ohio Grants Portal scrape
- **Status:** 🔴 → 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement)
- **Deliverables Created:** PHASE1-RESEARCH.md (8.2KB), DELIVERABLES.md initialized
- **Website Tracking Updated:** grantgenius status changed 🔴 → 🟡

---

## 2026-02-18 — boat-storage-waitlist Phase 1 Research Complete (Heartbeat Deliverable)
- `websites/boat-storage-waitlist/PHASE1-RESEARCH.md` — 6KB comprehensive research document
  - **Problem Solved:** Marinas struggle with manual waitlist management, slow responses, missed upsell opportunities
  - **Competitor Analysis:** Dockwa (waitlist + payments), DockMaster (enterprise), Harbour Assist (UK-focused), Molo (feature-heavy) — all too complex/expensive for small marinas
  - **Local Marinas Mapped:** A.R.U. Marina, North Coast Marina, River Marine, City of Ashtabula Marinas — all potential users
  - **Market Gap:** No affordable, AI-powered confirmation/upsell tool for small Great Lakes marinas
  - **Stakeholders:** Marina owners/operators (primary), boat owners (secondary), Port Authority (partnership)
  - **Revenue Model:** $49-99/month per marina, 10-15 marinas in county = $750-1,500/month potential
  - **Seasonality:** Peak Aug-Oct (winter storage booking), secondary Mar-May (spring launch)
  - **Open Questions:** 3 critical blockers (marina budget constraints, competitor dominance, tech adoption)
  - **Differentiation:** AI-powered messaging, local focus, quick deployment, affordable pricing
- **Status:** 🔴 → 🟡 Phase 1 Complete → Ready for Phase 2 (Stakeholder Outreach)
- **Next Steps:** Contact A.R.U. Marina and River Marine for discovery calls, refine ROI messaging

---

## 2026-02-17 — event-permit-express Phase 1 Research Complete (Heartbeat Deliverable)
- `websites/event-permit-express/PHASE1-RESEARCH.md` — 8.3KB comprehensive research document
  - **Problem Solved:** Event organizers face fragmented, opaque permit process across 5+ Ashtabula County jurisdictions
  - **User Personas:** 5 types — Family Reunion Planner, Nonprofit Coordinator, Festival Organizer, Wedding Planner, Youth Sports Coach
  - **Competitor Analysis:** Eproval (enterprise $$$), OpenCounter (enterprise $$$), Cleveland Metroparks (PDF forms), generic reservation systems — all too complex/expensive for small communities
  - **Key Finding:** No lightweight, citizen-focused tool exists for communities under 100K; all solutions target cities with dedicated IT staff
  - **Jurisdictions Mapped:**
    - Ashtabula County Metroparks — phone/email only, manual processing
    - City of Ashtabula Parks — phone/in-person only
    - Geneva Park District — has facility rentals but limited permit info
    - Ashtabula Fairgrounds — PDF forms, fax/email submission
    - Townships — varies widely, often phone-only
  - **Event Types Matrix:** 8 categories with permit requirements, lead times, and cost estimates
    - Picnics/Pavilion Rentals (2-4 weeks, $25-100)
    - 5K Runs/Walks (4-8 weeks, $100-500)
    - Street Festivals (6-12 weeks, $500-2,000)
    - Outdoor Weddings (2-4 weeks, $100-300)
    - Concerts in Park (4-8 weeks, $200-1,000)
    - Farmers Markets (4-6 weeks, $50-200)
    - Youth Sports Tournaments (2-4 weeks, $100-500)
    - Charity Car Shows (4-6 weeks, $150-500)
  - **Common Required Documents:** Event description, insurance proof ($1M liability typical), site plan, emergency contacts, vendor list, noise plan, traffic plan, cleanup plan
  - **Stakeholder Targets:** Metroparks (reservations@ashtabulametroparks.com), Geneva Park District, City Parks, Fairgrounds, Chamber, Tourism Council
  - **Open Questions:** 5 critical blockers (online vs paper usage, processing bottlenecks, integration feasibility, liability, budget)
  - **Differentiation:** Free/low-cost vs enterprise competitors; Ashtabula-tailored; mobile-first; citizen-facing with staff dashboard; smart event-type checklists
- **Status:** 🟡 Phase 1 Complete → Ready for Phase 2 (Stakeholder Outreach)
- **Next Steps:** Email Metroparks, contact Geneva Park District, survey 3-5 event organizers

---
- `websites/license-wizard/PHASE1-RESEARCH.md` — 9.8KB comprehensive research document
  - **Problem Solved:** Business owners in Ashtabula face confusion navigating city, county, state, and federal licensing requirements
  - **User Personas:** 4 types — Restaurant Owner Maria, Contractor James, Home-Based Sarah, Expanding Retailer David
  - **Competitor Analysis:** BizFilings ($99-299), LegalZoom ($199-499), Rocket Lawyer — all paid, none Ashtabula-specific
  - **Key Finding:** Ohio does NOT require general state business license for LLCs; only entity registration + industry-specific licenses
  - **Requirements Mapped:**
    - Federal: EIN, TTB (alcohol), USDA (agriculture), ATF (firearms), DOT (transportation)
    - State: SOS registration ($99 LLC), Vendor's License ($25), professional licenses, workers' comp
    - County: Commercial building permits (440-576-9090)
    - City: Zoning permits, sign permits, home occupation permits (PCD@cityofashtabula.com)
  - **Industry Profiles:** Food service, construction, retail, home-based business, professional services
  - **Stakeholder Targets:** City PCD, County Building Dept, Health Dept, SBDC, Chamber
  - **Open Questions:** 5 critical blockers for Phase 2 (City endorsement, payment integration, industry prioritization, township complexity, maintenance)
  - **Differentiation:** FREE vs paid competitors; Ashtabula-tailored; guided wizard experience; printable checklists
- **Status:** 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement)
- **Next Steps:** Email City PCD for partnership, interview 3-5 local business owners, catalog all PDF forms


---

## 2026-02-17 — grantgenius SPEC Complete (Heartbeat Deliverable)
- `websites/grantgenius/SPEC.md` — 9.1KB build specification
  - **Product Definition:** AI-powered local grant intelligence for Ashtabula businesses and nonprofits
  - **Core Features:** Grant discovery feed, eligibility pre-screener, deadline dashboard, grant detail pages, Ashtabula-specific section
  - **Data Sources:** Grants.gov API, USAspending.gov, Growth Partnership, Ashtabula Foundation, JobsOhio, SBA
  - **Technical Stack:** Next.js 14 + TypeScript + Supabase + OpenAI + Algolia/Meilisearch + Resend + Twilio
  - **Database Schema:** Complete SQL schema for grants, profiles, saved_grants, eligibility_checks tables
  - **User Flows:** First-time discovery, daily grant review, deadline management
  - **Implementation Phases:** 
    - Phase 1 (8-10 hrs): Core discovery + basic matching
    - Phase 2 (6-8 hrs): Intelligence layer (APIs, AI, search, reminders)
    - Phase 3 (8-10 hrs): Local integrations + growth features
    - Phase 4 (4-6 hrs): Monetization (Stripe, freemium)
  - **Differentiation:** $29/mo vs Instrumentl $95-195/mo, small business focused, local Ashtabula grants, rural-specific matching
  - **Success Metrics:** 50→500 grants, 25→100 users, 70%→85% match accuracy
  - **Open Questions:** 5 critical questions (API terms, foundation data, user validation, pricing, competition)
- **Status:** 🟢 SPEC Complete → Ready for Phase 2 (Resource Procurement) or Phase 1 Build
- **Next Steps:** Answer open questions, stakeholder outreach, user interviews

---

## 2026-02-17 — grantgenius Phase 1 Research Complete (Heartbeat Deliverable)
- `websites/grantgenius/PHASE1-RESEARCH.md` — 9.2KB comprehensive research document
  - **Product Concept:** AI-powered grant discovery for Ashtabula County small businesses + nonprofits
  - **Competitor Analysis:** Instrumentl ($95-195/mo), GrantHub (tracking-only), Submittable (funder-side) — all miss local discovery
  - **Data Sources Mapped:** Grants.gov API, USAspending.gov, Growth Partnership, Ashtabula Foundation (~$21M assets), JobsOhio
  - **Gap Identified:** No affordable tool serves rural counties with AI-powered local+federal+private grant matching
  - **Stakeholders:** 4 user personas, 5 outreach targets (Growth Partnership, Ashtabula Foundation, ACDI, Chamber, SBDC)
  - **Open Questions:** 3 critical blockers (API access, foundation data, user validation)
  - **Hypothesis:** Freemium model; Firebase stack; Phase 1 = discovery feed + alerts, Phase 2 = AI eligibility, Phase 3 = grant writing assistant
- **Status:** 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement)
- **Website Tracking Updated:** grantgenius status changed 🔴 → 🟡

---

## 2026-02-17 — civic-insight-engine Phase 1 Research Complete (Heartbeat Deliverable)
- `websites/civic-insight-engine/PHASE1-RESEARCH.md` — 8.5KB research document
  - **Pivot Decision:** Shifted from "meeting summarizer" (crowded) to "city data dashboard" (clear gap)
  - **Competitor Analysis:** Cleveland Open Data Portal (nearby exemplar), Ashtabula County GIS, County Transparency Portal
  - **Data Sources Mapped:** County GIS API, City Council videos (BoxCast/YouTube), meeting minutes PDFs, Clerk of Council contact
  - **Stakeholders Identified:** Clerk of Council (clerkofcouncil@cityofashtabula.com), County GIS team, Mayor's Office
  - **Strategic Positioning:** First unified transparency portal for Ashtabula — property + permits + council + budgets
  - **Open Questions:** 3 critical blockers for Phase 2 outreach
  - **Next Steps:** Draft outreach emails, one-page concept deck, City website mapping
- **Status:** 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement)
- **Website Tracking Updated:** civic-insight-engine status changed 🔴 → 🟡

---

## 2025-02-17 — civic-insight-engine Complete Workflow (Heartbeat Deliverable)
- `websites/civic-insight-engine/research/COMPETITOR_ANALYSIS.md` — 5.3KB
  - Competitors: SeeClickFix, CitySourced, OpenGov, PublicInput, FixMyStreet
  - Market gap: AI-first, small-jurisdiction affordable, unified dashboard
  - 3 user personas: Township Clerk, Engaged Resident, Busy Parent
  - Differentiation: Open source, Ashtabula-optimized, PWA offline support
- `websites/civic-insight-engine/research/DATA_SOURCES.md` — 4.5KB
  - Ohio Checkbook integration (financial transparency)
  - Ashtabula County GIS data sources
  - Gemini API configuration
  - Firebase services mapping
- `websites/civic-insight-engine/SPEC.md` — 10.8KB
  - Architecture: React + Vite + Firebase (Firestore, Auth, Functions, Hosting)
  - Complete data model (MeetingSummary, IssueReport, Township, User)
  - 8 features specified (F1-F8) with P0/P1/P2 prioritization
  - Security rules concept, API endpoints, deployment config
- `websites/civic-insight-engine/BUILD_CHECKLIST.md` — 9.3KB
  - 4-phase implementation (Weeks 1-4 + Month 2)
  - Copy-paste commands for Firebase init, dev, deploy
  - Complete file structure, testing checklist, rollback plan
- **Status:** 🟢 Full specification complete — ready for Phase 1 implementation
- **Total New Content:** ~30KB across 4 files

---

## 2026-02-17 — contractor-match SPEC.md v1.0 Complete (Heartbeat Deliverable)
- `websites/contractor-match/SPEC.md` — Complete build specification (20KB) for contractor marketplace
  - **Product Definition:** AI-powered contractor discovery with verification system
  - **8 Project Categories:** Renovation, Repair, Painting, Plumbing, Electrical, HVAC, Landscaping, New Build
  - **Matching Engine:** Rule-based scoring (category 40%, location 25%, availability 20%, verification 15%)
  - **3-Tier Verification:** Basic → Verified (doc upload) → City Partner (municipal endorsement)
  - **Complete Database Schema:** 6 core tables with relationships (homeowners, contractors, projects, quotes, reviews, messages)
  - **Development Phases:** Phase 1 MVP (6-8 hrs, no payments), Phase 2 (4-6 hrs, escrow + e-sign)
  - **Technical Stack:** Next.js + Supabase + Mapbox + Twilio + Resend (Stripe/DocuSign Phase 2)
  - **UI/UX Specs:** Trust-first design system, wizard flow, quote comparison, contractor dashboard
  - **Open Questions:** 3 blocking (monetization, domain, handyman tier), 3 important (outreach, emergency network, BG check costs)
- **Status:** 🟢 Ready for Phase 1 implementation
- **Completes:** Full P0 specification set — all 3 tools (permit-whisperer, invest-ashtabula, contractor-match) now have build-ready specs
- **Next:** Michael reviews SPEC, answers Open Questions #1-3, approves Phase 1 build start

---

## 2026-02-17 — through-the-grapevine Phase 1 Research Complete (Heartbeat Deliverable)
- `websites/through-the-grapevine/PHASE1-RESEARCH.md` — 10KB comprehensive research document
  - **Product Concept:** Unified community events and local news aggregator for Ashtabula County
  - **Problem Solved:** Residents need to check 10+ sources to know what's happening; information fragmentation reduces attendance
  - **Competitor Analysis:** 6 competitors analyzed (Facebook Events, Eventbrite, Star Beacon, GOTL.com, Visit Ashtabula County, Cleveland.com)
  - **Gap Identified:** No single source aggregates ALL event types (tourism + community + civic + arts) with filtering
  - **Stakeholders Mapped:** Ashtabula Arts Center, Historic Harbor, GOTL Business Association, County Fairgrounds, Libraries, Tourism Council
  - **User Personas:** 5 personas — Weekend Planner Sarah, New Resident Marcus, Event Promoter Lisa, Seasonal Visitor Johnsons, Civic Engager Robert
  - **Data Sources:** Eventbrite API (easy), tourism sites (easy), Facebook/manual (hard), 6 library systems (partnership needed)
  - **Core MVP Features:** Event feed, category system, location/cost/date filters, detail pages, submit form
  - **Synergies:** farm-stand-finder (seasonal events), pocket-historian (historical tours), gotl-weekend-planner, civic-insight-engine
  - **Open Questions:** 5 critical blockers (scraping legality, tourism council partnership, duplicate handling, moderation model, revenue model)
  - **Revenue TBD:** Community service vs. featured listings vs. ads
- **Status:** 🔴 → 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement)
- **Next Steps:** Contact Ashtabula County Tourism Council, validate scraping feasibility, manual event inventory test

---

---

## 2026-02-17 — ai-docent SPEC Complete (Heartbeat Deliverable)
- `websites/ai-docent/SPEC.md` — 11KB complete technical specification for AI museum docent
  - **Product Definition:** AI-powered docent for small museums, starting with Ashtabula Maritime Museum
  - **Problem Solved:** Visitors browse static exhibits with unanswered questions, missing context, no interactive engagement
  - **Solution:** QR-code triggered AI docent accessible via smartphone, no app download required
  - **5 Core Features:** QR-Code Entry Points, Conversational AI Docent, Exhibit Deep-Dives, "Ask an Expert" Research Help, Visitor Analytics Dashboard
  - **Technical Architecture:** Next.js + OpenAI GPT-4o + Pinecone RAG + Vercel hosting
  - **Hallucination Prevention:** RAG-first responses, confidence scoring, staff review workflow
  - **MVP Scope:** Maritime Museum (25,000+ items, Hulett unloader, Fresnel lens, Titanic, 1876 train disaster)
  - **6 Exhibit QR Points:** Entrance, Hulett, Fresnel Lens, Titanic, Train Disaster, Pilot House
  - **Content Library:** Artifact stories, historical context, technical explanations, human stories
  - **Implementation Phases:** 4 weeks (40-50 hours total)
  - **Success Metrics:** 20+ conversations/day, 3+ min avg length, 85%+ thumbs up rate
  - **Open Questions:** 7 questions for museum partnership (WiFi, content review, maintenance, revenue)
  - **Future Enhancements:** Multilingual, image recognition, audio mode, kids mode, other museums
- **Deliverables Created:**
  - `PHASE1-RESEARCH.md` (5KB) — Competitor analysis, museum feasibility assessment
  - `CONTENT-INVENTORY.md` (6KB) — 4 museums analyzed, Maritime selected as MVP
  - `SPEC.md` (11KB) — Complete build specification
- **Status:** 🟢 SPEC Complete → Ready for Phase 4 (Build Checklist) upon approval
- **Next Steps:** Draft museum outreach email, create build checklist, await approval to proceed

---

## 2026-02-17 — gotl-weekend-planner Phase 1 Research Complete (Heartbeat Deliverable)
- `websites/gotl-weekend-planner/PHASE1-RESEARCH.md` — 7.2KB comprehensive research document
  - **Product Concept:** AI-assisted weekend itinerary builder specifically for Geneva-on-the-Lake visitors
  - **Problem Solved:** Visitors struggle to plan efficient, personalized GOTL itineraries; existing tools are too generic
  - **Competitor Analysis:** 5 competitors (Wanderlog, TripIt, Sygic, VisitGenevaOnTheLake.com, TripAdvisor) — none offer GOTL-specific itinerary building
  - **Gap Identified:** No AI-assisted, preference-based itinerary builder exists for GOTL; no tool understands Strip vs. winery geography
  - **Stakeholders Mapped:** Geneva-on-the-Lake Business Association, Ashtabula County Tourism Council, The Lodge at Geneva-on-the-Lake, Chamber of Commerce
  - **User Personas:** 5 personas — Wine Weekender, Family Vacationer, Adventure Seeker, Nostalgia Traveler, Spontaneous Visitor
  - **Asset Inventory:** 29+ wineries, The Strip attractions, Alison's Mini-Golf (est. 1924), Eddie's Grill, zip-lining, events (Grape Jamboree)
  - **Geographic Clusters:** The Strip (walkable), Winery Country (driving), Geneva City (dining), Adventure Zone
  - **Synergies:** pocket-historian (historic stories), through-the-grapevine (events), farm-stand-finder (fresh stops), harvest-alert (seasonal)
  - **Open Questions:** Google Places API cost, real-time availability access, revenue model, data maintenance, drunk driving liability disclaimers
- **Status:** 🔴 → 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement)
- **Next Steps:** Contact Business Association, validate with real visitors, test scraping feasibility, explore Lodge partnership

---

## 2026-02-19 — Deployment Checklist: Parts Finder + Plating Tracker (Heartbeat Deliverable)
- `websites/DEPLOYMENT_CHECKLIST.md` — 3.4KB step-by-step deployment guide
  - **Goal:** Get both prototypes from "built" to "live on Firebase"
  - **Pre-flight:** Firebase CLI check, auth confirmation, project selection decision tree
  - **Parts Finder Steps:** Build verification → Firebase init → Environment config → Deploy → Smoke test (14 min total)
  - **Plating Tracker Steps:** Same 5-step flow (14 min total)
  - **Blocker Table:** 3 items requiring Michael input (Gemini API key, Firebase project strategy, domain preference)
  - **Post-deploy:** URL tracking, status updates, demo script prep, pitch deck inclusion
  - **Target URLs:** `parts-finder-ashtabula.web.app`, `plating-tracker-ashtabula.web.app` (proposed)
- **Status:** ⏳ Ready to execute — pending Michael approval + API key
- **Impact:** 2 🟢 prototypes → 🚀 live demos for pitching

---

## 2026-02-17 — farm-stand-finder Phase 1 Research Complete (Heartbeat Deliverable)
- `websites/farm-stand-finder/PHASE1-RESEARCH.md` — 7.8KB comprehensive research document
  - **Product Concept:** Location-based discovery platform for Ashtabula County farm stands and roadside markets
  - **Competitor Analysis:** 5 direct competitors (FarmStandLocator, RoadsideStall, LocalHarvest, Farmish App, USDA Directories)
  - **Data Sources Mapped:** 3 tiers — USDA API (authoritative), Harbor Gardens/OSU Extension (community), crowdsourced user submissions
  - **Stakeholders Identified:** Ashtabula Local Food Network, Harbor Gardens, OSU Extension, Ashtabula Farmers Market
  - **User Personas:** 4 personas — Seasonal Resident, Local Food Advocate, Grower, Visitor
  - **Open Questions:** 6 critical blockers (USDA API terms, data maintenance, monetization, grower adoption, competition response, seasonality)
  - **Strategic Positioning:** Differentiation matrix vs competitors; focus on unlisted stands and real-time status
- **Status:** 🔴 → 🟡 Phase 1 Complete → Ready for Phase 2 (Resource Procurement) or SPEC.md
- **Next Steps:** Validate USDA API access, outreach to Harbor Gardens, user interviews, draft SPEC.md
