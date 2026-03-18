# Zoning Clerk — Phase 1 Research & Recon

**Date:** 2026-02-14  
**Researcher:** Rondell ♟️  
**Status:** Complete — Ready for Phase 2 (Resource Procurement)

---

## 1. Entity Identification

### Primary: City of Ashtabula — Planning & Community Development (PCD)
- **Department:** Planning and Community Development
- **Address:** 4717 Main Avenue, Ashtabula, OH 44004
- **Phone:** (440) 992-7125
- **Fax:** (440) 992-7180
- **Email:** PCD@cityofashtabula.com
- **Website:** https://www.cityofashtabula.com/zoning

### Key Personnel (to identify for outreach)
- Zoning Inspector/Officer (title unknown — needs verification)
- Planning & Community Development Director
- Code Enforcement officers

### Secondary: Ashtabula County Department of Planning & Development
- **Role:** County-level coordination, township zoning oversight
- **Website:** https://www.ashtabulacounty.us/278/Zoning
- **Value:** Township zoning resolutions, county-wide coordination

### Tertiary: Ashtabula Township Zoning
- **Phone:** (440) 997-9221
- **Email:** zoning@ashtabulatownship.com
- **Note:** Separate entity from City of Ashtabula; may serve as model/reference

---

## 2. Branding & Voice Analysis

### Current Government Voice
- Formal but service-oriented
- Process-focused ("Our review process usually takes up to a week")
- Instructional (PDF forms, submission methods)
- Compliance-oriented (permits, inspections, fees)

### Brand Colors (to verify from official site)
- **UNVERIFIED:** Likely city official colors — need to check cityofashtabula.com CSS/logo
- Suggested palette: Professional blues/grays typical of municipal sites

### Tone for Chatbot
- Helpful, authoritative, concise
- Citation-focused ("according to Section 1115.03...")
- Action-oriented (clear next steps)
- No marketing fluff — residents need answers

---

## 3. Pain Points (Opportunity Areas)

### Current Resident Friction
| Pain Point | Current State | Opportunity |
|------------|---------------|-------------|
| Form access | PDF downloads, print/fill/return | Digital intake with validation |
| Submission | Fax, email scan, or in-person | Direct web submission |
| Status tracking | No visibility | "Check my permit status" feature |
| Wait time | "Up to a week" without updates | Proactive notifications |
| Code lookup | Manual PDF search | RAG-based Q&A with citations |
| Multi-step guidance | Static text | Conversational wizard |

### Staff Pain Points (inferred)
- Repetitive phone calls for basic questions
- Incomplete applications requiring follow-up
- No-show appointments for permit pickup

---

## 4. Competitor & Comparable Analysis

### Direct: Other Municipal Zoning Chatbots
- **Philadelphia (PA):** myPhilly311 — general city services, not zoning-specific
- **Boston (MA):** Boston.gov chatbot — general FAQ, limited zoning depth
- **Research gap:** Few small-to-mid cities have true RAG-based zoning chatbots

### Indirect: Private Sector Zoning Tools
- **ZoningHub:** Commercial SaaS for zoning code management
- **Municode:** Code hosting with search, no conversational interface
- **ClearForms:** Digital permitting (form-based, not chat)

### Advantage Opportunity
Most comparable cities either:
1. Have generic chatbots without RAG (high hallucination risk)
2. Use static FAQ pages (poor searchability)
3. Require phone/email for complex questions

**Differentiator:** Purpose-built RAG chatbot with citations to actual code sections and forms.

---

## 5. Resource Requirements (Phase 2 Procurement List)

### Critical Documents to Obtain
| Resource | Source | Status | Priority |
|----------|--------|--------|----------|
| City of Ashtabula Zoning Code (PDF) | City PCD office or AM Legal | 🔴 Not obtained | P0 |
| Zoning Map (GIS/shapefile) | City/County GIS | 🔴 Not obtained | P0 |
| Permit application forms (all types) | cityofashtabula.com/zoning | 🟡 Partial (list identified) | P0 |
| Fee schedule | PCD office | 🔴 Not obtained | P1 |
| Zoning Inspector contact/protocol | Direct outreach | 🔴 Not obtained | P1 |

### Identified Form Types (from web research)
1. Swimming pool permits
2. Shed/outbuilding permits
3. Deck construction permits
4. Garage/building permits
5. New business/zoning compliance
6. Demolition permits (noted: NOT issued by PCD)

### Technical Resources Needed
- **RAG Infrastructure:** Vector DB (Qdrant already available at xai:6333)
- **PDF Processing:** PDF-to-text extraction for zoning code
- **Citation system:** Page/section reference tracking
- **Submission integration:** Email API or form endpoint to PCD@cityofashtabula.com

---

## 6. Key Stakeholder Questions (for Michael/outreach)

1. **Permission:** Does the City of Ashtabula consent to a prototype zoning chatbot?
2. **Data access:** Can we obtain the official zoning code PDF and zoning map?
3. **Integration:** Is there interest in receiving digital submissions vs. current fax/email?
4. **Accuracy review:** Will a zoning officer review responses for accuracy before deployment?

---

## 7. Risk Notes

- **Legal:** Zoning decisions have legal consequences — chatbot must include disclaimer
- **Accuracy:** RAG reduces but doesn't eliminate hallucinations — citations required
- **Scope:** Clarify chatbot provides "general information" not "legal advice"
- **Maintenance:** Zoning codes change — need update protocol

---

## 8. Next Steps (Phase 2)

1. **Download** Ashtabula Zoning Code from AM Legal or request from PCD
2. **Collect** all PDF forms from cityofashtabula.com/zoning
3. **Create** `resources/` folder with organized documents
4. **Draft** SPEC.md with exact functionality, wireframes, integration specs

---

**Research Confidence:** High for public information, Medium for internal processes (needs stakeholder contact)

**Estimated Phase 2 Duration:** 2-3 hours (document procurement and organization)
