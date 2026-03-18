# AI Docent — Phase 1 Research Document
## New Ashtabula Initiative | MVP Research

**Date:** February 19, 2026  
**Researcher:** Rondell (Noirsys AI)  
**Status:** Phase 1 Complete → Ready for Phase 2 Resource Procurement

---

## 1. Problem Statement

### The Gap
Ashtabula County's museums and cultural sites struggle with:
- **Limited staffing:** Most operate with all-volunteer teams (e.g., ACHS has no paid staff)
- **Inconsistent tour availability:** Seasonal hours (Memorial Day–Labor Day only at Hubbard House), volunteer-dependent scheduling
- **No digital interpretation:** Visitors lack on-demand context for exhibits; static signage only
- **Accessibility barriers:** No multilingual support, audio descriptions, or sign language tours
- **Missed engagement:** No way to continue the experience post-visit or build visitor relationships

### Visitor Pain Points
1. Arrive at museum → no docent available → wander without context
2. Want deeper information on an artifact → limited signage → unanswered questions
3. Non-English speaker → no translation options → diminished experience
4. Vision-impaired visitor → no audio descriptions → exclusion from content
5. Interested in related exhibits elsewhere → no connections drawn → missed cross-promotion

### Institution Pain Points
1. Can't afford full-time staff or traditional audio guide systems ($10K–50K+)
2. No visitor data or feedback mechanisms
3. Difficulty promoting related sites (no cross-institution coordination)
4. Grant funders want "innovation" and "accessibility" — no budget to deliver

---

## 2. Market Data

### Ashtabula County Cultural Inventory

| Museum/Site | Type | Attendance (Est.) | Staffing | Current Digital Guide |
|-------------|------|-------------------|----------|----------------------|
| **Ashtabula County Historical Society** | History (3 properties) | 3,000–5,000/yr | All-volunteer | None |
| **Jennie Munger Gregory Museum** | 1823 Farmhouse | Part of ACHS | Volunteers | None |
| **Blakeslee Log Cabin (1810)** | Historic Structure | Part of ACHS | Volunteers | None |
| **Victorian Perambulator Museum** | Specialty (world's only) | 2,000–3,000/yr | Minimal | None |
| **Hubbard House UGRR Museum** | Underground Railroad | 4,000–6,000/yr | Volunteers | None |
| **Ashtabula Maritime Museum** | Maritime History | 3,000–4,000/yr | Volunteers | Basic website |
| **Historic Ashtabula Harbor** | District/Trail | 50,000+ visitors | Self-guided | Printed brochures |
| **Local Galleries** | Art/Rotating | Variable | Artist-run | Social media only |

**Total addressable annual attendance: ~65,000–75,000 visitors across all sites**

### Tourism Context
- Ashtabula County: 26 miles of Lake Erie shoreline
- Wine Country: 20+ wineries, 500K+ annual visitors to county
- Lake Erie Coastal Trail: 160+ cultural/historic attractions along route
- Second busiest tourism county in Ohio for agritourism

### Competitive Landscape

#### National/Enterprise Solutions
| Competitor | Pricing | Target Market | Ashtabula Fit |
|------------|---------|---------------|---------------|
| **Smartify** | $5K–20K+/yr setup + usage | Major museums (Smithsonian, Louvre) | ❌ Too expensive, enterprise focus |
| **Guidekick** | Custom pricing ($10K+) | Large institutions | ❌ Overkill for small museums |
| **Antenna Audio** | $15K–50K+ | Major attractions | ❌ Enterprise-only |
| **Acoustiguide** | Rental + setup fees | Major museums | ❌ Hardware required |

#### DIY/Consumer Solutions
| Competitor | Model | Limitation |
|------------|-------|------------|
| **Custom GPTs** | Free/$20/mo | Requires OpenAI knowledge, no location awareness |
| **VoiceMap** | $300–500/tour creation | Not AI-powered, static audio only |
| **izi.TRAVEL** | Freemium | No AI interactivity, generic platform |
| **GPSmyCity** | Free/paid articles | Not museum-specific, no exhibit-level detail |

### Market Gap Analysis
**The Opportunity:** No affordable, AI-powered, museum-specific solution exists for small-to-medium institutions (under 10,000 annual visitors). Current options are either:
1. Too expensive (enterprise-tier)
2. Not interactive (static audio)
3. Not museum-focused (generic tour apps)
4. Require technical expertise (DIY)

---

## 3. User Personas

### Primary: "Curious Carol" (Weekend Cultural Tourist)
- **Demographics:** 45–65, suburban Columbus/Cleveland, day-tripper
- **Goals:** Learn local history, feel connected to place, share interesting finds
- **Pain points:** Arrives at museum, no docent on duty, limited signage
- **Tech comfort:** Smartphone comfortable, uses apps occasionally
- **Quote:** *"I love small museums but I never know what I'm looking at without someone to ask."*

### Secondary: "Teacher Tom" (Educator/Group Leader)
- **Demographics:** 35–55, teaches 4th–8th grade Ohio history
- **Goals:** Engage students, meet curriculum standards, plan field trips
- **Pain points:** Limited field trip budgets, needs pre-visit materials, accessibility requirements
- **Tech comfort:** Uses EdTech tools, needs simple interfaces
- **Quote:** *"I need something my students can use independently while I manage the group."*

### Tertiary: "Volunteer Vivian" (Museum Volunteer Coordinator)
- **Demographics:** 60–75, retired, passionate about local history
- **Goals:** Increase visitor engagement, reduce repetitive questions, attract younger audiences
- **Pain points:** Can't be everywhere at once, repetitive questions drain energy, no data on what visitors want
- **Tech comfort:** Basic smartphone use, needs simple backend
- **Quote:** *"If I had a tool that answered the same 20 questions I get every day, I could focus on the interesting conversations."*

### Fourth: "Accessible Alex" (Visitor with Disability)
- **Demographics:** Any age, vision or hearing impairment
- **Goals:** Full museum experience, independence, rich content access
- **Pain points:** No audio descriptions, no sign language content, relies on companion for descriptions
- **Tech comfort:** Screen reader proficient, accessibility app user
- **Quote:** *"I want to experience exhibits without having to ask someone to read every sign to me."*

---

## 4. Stakeholder Mapping

### Primary Stakeholders (Direct Users)

| Organization | Contact Path | Interest Level | Decision Maker |
|--------------|--------------|----------------|----------------|
| **Ashtabula County Historical Society** | ashtabulahistory.com | ⭐⭐⭐ High | Board President |
| **Victorian Perambulator Museum** | 440-576-9588 | ⭐⭐⭐ High | Owner/Curator |
| **Hubbard House UGRR Museum** | Facebook: @HubbardHouseUGRRMuseum | ⭐⭐⭐ High | Board/Volunteer Coord |
| **Ashtabula Maritime Museum** | 440-964-6847 | ⭐⭐ High | Director |

### Secondary Stakeholders (Ecosystem)

| Organization | Role | Value Proposition |
|--------------|------|-------------------|
| **Visit Ashtabula County** | Tourism promotion | Cross-site visitor flow data, enhanced visitor experience |
| **Geneva Area Chamber of Commerce** | Business support | Cultural tourism enhancement |
| **OSU Extension Ashtabula** | Community education | Youth engagement tool |
| **Local School Districts** | Education partners | Field trip enhancement, curriculum alignment |
| **Lake Erie Coastal Trail** | Regional tourism | Trail-wide digital experience |

### Potential Funding Sources
| Source | Program | Fit |
|--------|---------|-----|
| **Ohio Arts Council** | Arts Access Grants | Accessibility focus |
| **Ohio History Connection** | History Fund Grants | Historic preservation tie-in |
| **National Endowment for the Humanities** | Digital Humanities | AI/tech innovation angle |
| **Institute of Museum and Library Services** | Museums for America | Small museum support |
| **Community Foundations** | Various | Local innovation narrative |

---

## 5. Revenue Model Options

### Option A: Freemium SaaS (Recommended)
- **Free tier:** 1 museum, 10 artifacts, basic Q&A, English only
- **Museum tier:** $29/mo — unlimited artifacts, multilingual, audio, analytics
- **Network tier:** $79/mo — multi-site (like ACHS's 3 properties), cross-promotion, grant reporting
- **Custom tier:** $199+/mo — white-label app, custom voices, priority support

### Option B: Grant-Funded Model
- Build platform with initial grant funding ($25K–50K)
- Museums access free (grant subsidized)
- Sustainability through ongoing grants + small usage fees
- Requires nonprofit fiscal sponsor or 501(c)(3) status

### Option C: Tourism Board Partnership
- Visit Ashtabula County pays annual license ($5K–10K/yr)
- All museums in county get free access
- Value: unified visitor experience, tourism data, destination marketing
- Risk: single payer dependency

### Option D: Mixed Model (Long-term)
- Year 1–2: Grant-funded, free to museums
- Year 3+: Introduce paid tiers, museums hooked on value
- consulting/services for custom content

**Recommendation:** Start with Option A (freemium) but pursue Option B grants for initial development funding. Museums have zero budget; visitors expect free tools.

---

## 6. Technical Feasibility

### Core Technology Stack
| Component | Technology | Cost Estimate |
|-----------|------------|---------------|
| **Frontend** | React PWA (mobile-first) | Dev time |
| **Backend** | Firebase (Auth, Firestore, Hosting) | $0–50/mo |
| **AI/LLM** | Gemini API (multimodal) | $0.01–0.10/visit |
| **Text-to-Speech** | ElevenLabs or Google TTS | $0.01–0.05/utterance |
| **Image Recognition** | Gemini Vision API | Included in LLM |
| **QR Generation** | QRCode.js or similar | Free |
| **Hosting** | Firebase/Vercel | $0–20/mo |

### Estimated Monthly Costs (at Scale)
| Scenario | Museums | Monthly Visits | AI Calls | Est. Cost |
|----------|---------|----------------|----------|-----------|
| Pilot (3 museums) | 3 | 500 | 1,000 | $20–40 |
| Launch (10 museums) | 10 | 2,000 | 5,000 | $80–150 |
| Scale (25 museums) | 25 | 5,000 | 15,000 | $200–400 |

### Technical Requirements
1. **No hardware required:** QR codes on exhibits trigger web app
2. **No app store:** PWA works on any smartphone browser
3. **Offline capability:** Cache content for spotty museum WiFi
4. **Accessibility:** WCAG 2.1 AA compliance, screen reader support
5. **Multilingual:** Gemini supports 40+ languages
6. **Low bandwidth:** Compressed images, text-first fallback

### MVP Feature Set
- [ ] QR code scanning (exhibit activation)
- [ ] AI chat interface (ask questions about artifacts)
- [ ] Audio narration (auto-generated + human override)
- [ ] Basic multilingual (Spanish, French, Mandarin priority)
- [ ] Simple CMS for museums (add artifacts, upload images)
- [ ] Analytics dashboard (popular artifacts, visitor flow)

### Phase 2+ Features
- [ ] Image recognition (point camera at artifact)
- [ ] Personalized tours ("30-minute highlights," "Kids tour")
- [ ] Cross-museum passport (visit 3 sites, unlock content)
- [ ] Accessibility modes (audio description, sign language video)
- [ ] School/group mode (teacher controls, quiz integration)
- [ ] Grant reporting exports (attendance, engagement metrics)

---

## 7. Critical Blockers for Phase 2

### Blocker 1: Museum Buy-In
**Risk:** Volunteers may resist "technology replacing human connection"  
**Mitigation:** Position as "volunteer force multiplier," not replacement; emphasize capturing volunteer knowledge before it's lost

### Blocker 2: Content Creation Burden
**Risk:** Museums lack time to photograph artifacts and write descriptions  
**Mitigation:** Offer content creation service (photo + AI-assisted description); use Gemini to generate from minimal input

### Blocker 3: WiFi Connectivity
**Risk:** Many museums have poor or no visitor WiFi  
**Mitigation:** Offline-first PWA design; encourage museums to upgrade WiFi (position as visitor amenity)

### Blocker 4: Technical Anxiety
**Risk:** All-volunteer staff intimidated by "AI"  
**Mitigation:** Call it a "smart audio guide" in outreach; emphasize no-code CMS; offer white-glove onboarding

### Blocker 5: Funding Sustainability
**Risk:** Museums can't pay even $29/mo  
**Mitigation:** Pursue tourism board or grant subsidy model; prove value with free pilot

---

## 8. Data Sources Cataloged

### Museum Information
- ashtabulahistory.com — ACHS properties, hours, contact
- hubbardhouseugrrmuseum.org — UGRR museum (currently offline, use Facebook)
- perambulatormuseum.com — Victorian Perambulator Museum
- visitashtabulacounty.com — Tourism data, visitor statistics
- historicashtabulaharbor.org — Harbor district info

### Grant Opportunities
- oac.ohio.gov — Ohio Arts Council grants
- ohiohistory.org — History Fund grants
- imls.gov — IMLS Museums for America
- neh.gov — NEH Digital Humanities

### Competitive Intelligence
- smartify.org — Leading competitor (enterprise focus)
- izi.travel — Open-source alternative (static audio)
- MuseumNext articles — Industry trends

---

## 9. Phase 2 Resource Procurement Tasks

### Outreach Targets (Priority Order)
1. **Ashtabula County Historical Society** — Highest credibility, 3 properties, no paid staff (perfect fit)
2. **Victorian Perambulator Museum** — Unique niche, world's only (strong PR angle)
3. **Hubbard House UGRR Museum** — Important history, active Facebook presence
4. **Ashtabula Maritime Museum** — Harbor tourism anchor
5. **Visit Ashtabula County** — Potential funder/partner

### Discovery Questions for Museums
1. How do visitors currently learn about your exhibits?
2. What's the most common question you answer repeatedly?
3. Do you have WiFi for visitors? Photos of your collection?
4. Would you be interested in a free pilot program?
5. What would make this a "must-have" for your museum?

### Artifacts to Research
- [ ] ACHS collection highlights (Jennie Munger Museum)
- [ ] Perambulator Museum signature pieces
- [ ] Hubbard House UGRR stories and artifacts
- [ ] Maritime Museum ship models and history
- [ ] Harbor district walking tour stops

---

## 10. Summary & Recommendation

### The Opportunity
Ashtabula County has 6+ cultural institutions serving ~70,000 annual visitors, all operating with minimal staff and no digital interpretation. National AI museum solutions cost $10K–50K+ and target major institutions. A purpose-built, affordable ($29–79/mo) AI docent platform fills a clear gap.

### Why Now
- AI costs have dropped 90%+ in 2 years (Gemini flash pricing)
- Post-pandemic tourism recovery drives visitor experience investment
- Grant funders prioritize "accessibility" and "digital innovation"
- Small museums are desperate for solutions but priced out of enterprise market

### Next Step
**Phase 2:** Contact 3–5 museums with discovery call requests, validate pain points, secure 2+ pilot partners. Gate to Phase 3 (SPEC) requires:
- [ ] 2+ museums committed to pilot
- [ ] Content samples (10+ artifacts with images/descriptions)
- [ ] Funding pathway identified (grant or tourism board)

---

**Document produced:** February 19, 2026  
**Word count:** ~2,100  
**Ready for:** Phase 2 outreach template creation
