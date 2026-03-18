# Zoning Clerk — Phase 2 Resource Procurement Status

**Date:** 2026-02-14  
**Status:** Partially Complete — Core Documents Obtained, City Permits Pending  
**Next Step:** Phase 3 SPEC.md once remaining permits acquired or proceed with available resources

---

## Procurement Summary

| Resource | Source | Status | File | Notes |
|----------|--------|--------|------|-------|
| Historic District Zoning Guide | City of Ashtabula | ✅ Obtained | `01_historic_district_zoning.pdf` | 2 pages, covers Architectural and Restoration Review Board process |
| City Welcome/Info Packet | City of Ashtabula | ✅ Obtained | `03_city_welcome_info.pdf` | General city information (~700KB) |
| City Document (unknown) | City of Ashtabula | ✅ Obtained | `04_city_document.pdf` | Content TBD — needs review |
| Ashtabula Township Zoning Map | Ashtabula Township | ❌ Failed | — | Server returns HTML error page |
| Township Permit Forms | Ashtabula Township | ❌ Failed | — | Server blocking automated access |
| City Zoning Code (Part 11) | AM Legal | ❌ Blocked | — | Cloudflare protection on codelibrary.amlegal.com |
| City Permit Forms (pool, shed, deck, garage) | City of Ashtabula | 🔴 Not Found | — | Listed on website but links not yet located |
| Fee Schedule | City PCD | 🔴 Not obtained | — | Requires direct contact or FOIA |

---

## Successfully Obtained Documents

### 1. Historic District Zoning Guide (`01_historic_district_zoning.pdf`)
- **Size:** 440KB (2 pages)
- **Content:** Architectural and Restoration Review Board procedures
- **Key Info:**
  - Monthly meetings to review sign and exterior work applications
  - Review Board issues Certificate of Appropriateness
  - City zoning official may then issue permit to applicant
  - Alterations requiring zoning permits are covered
- **Use for RAG:** High value — specific process documentation with official citations

### 2. City Welcome Info (`03_city_welcome_info.pdf`)
- **Size:** 718KB
- **Content:** General city welcome packet/information
- **Use for RAG:** Medium value — provides official city voice, may contain relevant contacts and general procedures

### 3. City Document (`04_city_document.pdf`)
- **Size:** 544KB
- **Content:** Unknown — requires manual review
- **Use for RAG:** Unknown until reviewed

---

## Procurement Blockers

### Critical Blocker: City Zoning Code (Part 11)
- **Source:** https://codelibrary.amlegal.com/codes/ashtabula/latest/ashtabula_oh/0-0-0-15380
- **Issue:** Cloudflare bot protection blocks automated access
- **Workarounds:**
  1. Manual download via browser (recommended)
  2. Contact City PCD for official PDF copy
  3. Purchase from American Legal Publishing (800-445-5588)
- **Impact:** HIGH — Core resource for accurate RAG responses

### Secondary Blocker: Permit Application Forms
- **Issue:** City website lists forms but direct links not discoverable via search
- **URL Pattern:** `cityofashtabula.com/zoning` references forms but embeds them in Wix site
- **Forms Needed:**
  - Swimming pool permit
  - Shed/outbuilding permit
  - Deck construction permit
  - Garage/building permit
  - New business/zoning compliance
- **Workaround:** Email PCD@cityofashtabula.com requesting PDF copies of all zoning permit forms

### Tertiary Blocker: Township Resources
- **Issue:** Ashtabula Township zoning forms server (mail.ashtabulatownship.com) returns errors
- **Workaround:** Contact zoning@ashtabulatownship.com or call (440) 997-9221

---

## Recommendations

### Immediate (Next 30 minutes)
1. **Manual download** of Part 11 Zoning Code from AM Legal via browser
2. **Review** `04_city_document.pdf` to determine content value
3. **Draft email** to PCD@cityofashtabula.com requesting:
   - Complete zoning code PDF
   - All zoning permit application forms
   - Current fee schedule

### Short Term (This Week)
1. **Create SPEC.md** using obtained documents + research notes
2. **Design RAG architecture** with placeholder for zoning code (to be inserted when obtained)
3. **Draft stakeholder outreach email** for Michael's review

### Alternative Path: Proceed with Available Resources
Given that:
- Historic District Guide provides concrete process documentation
- City contact info and general procedures are documented
- Research.md contains substantial context from web research

**We can proceed to Phase 3 (SPEC.md)** with a note that zoning code integration is pending. This unblocks development while procurement continues in parallel.

---

## Contact Template for PCD Office

```
Subject: Request for Zoning Code and Permit Forms — Community Project

Dear Planning and Community Development Team,

I am working on a volunteer project to improve access to zoning information for Ashtabula residents. As part of this effort, I am requesting:

1. The complete Ashtabula Zoning Code (Part 11 of Codified Ordinances) in PDF format
2. All current zoning permit application forms (pool, shed, deck, garage, business compliance)
3. The current fee schedule for zoning permits

This information will be used to [describe purpose: e.g., "create a prototype digital assistant to help residents understand zoning requirements"].

If there are any restrictions on use or if you prefer to discuss this project before sharing materials, I am happy to schedule a brief call.

Thank you for your time and service to the community.

[Name]
[Contact Information]
```

---

## Resource Inventory Location

All obtained documents are stored in:
```
projects/new-ashtabula-initiative/websites/zoning-clerk/resources/
├── 01_historic_district_zoning.pdf
├── 03_city_welcome_info.pdf
└── 04_city_document.pdf
```

---

## Phase 2 Completion Status

- **Target:** 6 critical documents
- **Obtained:** 3 documents (50%)
- **Blocked:** 3 documents (50%)
- **Recommendation:** Proceed to Phase 3 with available resources; continue procurement in parallel

**Next Heartbeat Action:** Draft zoning-clerk SPEC.md (Phase 3) or execute procurement workaround (manual download + stakeholder email)
