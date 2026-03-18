# Phase 2 Resource Procurement — Outreach Package
**Project:** Permit Whisperer  
**Date:** 2026-02-16  
**Status:** Ready for Michael Review/Send

---

## Overview
Phase 1 research complete. Phase 2 requires stakeholder engagement to determine integration possibilities and secure partnerships. This package contains ready-to-send email drafts for all three key contacts.

**Recommended Send Order:**
1. CitizenServe API inquiry (determines technical feasibility)
2. City PCD partnership (local relationship, lower stakes)
3. County Building Dept (after City response, or in parallel)

---

## Contact 1: CitizenServe (Technical Integration)

**To:** support@citizenserve.com (or partnership/contact form at citizenserve.com)  
**Subject:** Partnership Inquiry — Third-Party Integration API Access

```
Hello CitizenServe Team,

I'm reaching out on behalf of a civic technology initiative we're developing 
for Ashtabula County, Ohio residents.

We've been researching ways to improve the permitting experience for local 
homeowners and contractors. Your CitizenServe platform powers the Ashtabula 
County Building Department's online portal, and we're impressed with its 
capabilities.

We're building a tool called "Permit Whisperer" — a guided assistant that 
helps residents understand which permits they need, estimate fees, and 
navigate the application process. Our goal is to complement (not replace) 
the CitizenServe experience.

We're writing to inquire about:

1. Do you offer API access for approved third-party partners?
2. Is iframe embedding of permit application forms permitted?
3. Are there webhook or callback mechanisms for status updates?
4. Do you have a partner/developer program we could apply to?

We're happy to sign any necessary agreements, comply with branding 
guidelines, and discuss revenue-sharing if applicable.

Thank you for your time. We look forward to exploring how we can work 
together to serve Ashtabula County residents better.

Best regards,
[Michael A. Vega / Noirsys AI]
[Contact Information]
```

**Follow-up:** 1 week if no response

---

## Contact 2: City of Ashtabula PCD (Local Partnership)

**To:** PCD@cityofashtabula.com  
**Subject:** Partnership Opportunity — Digital Permit Guide for Residents

```
Dear Planning & Community Development Team,

I'm a local technology professional working on a pro-bono civic project 
to help Ashtabula residents navigate the permitting process more easily.

We've completed initial research on the two-stage permitting workflow 
(City zoning + County building) and identified common pain points:
- Residents are unsure which permits they need and in what order
- The zoning permit application requires downloading, printing, and 
  faxing/emailing PDFs
- There's no unified guidance combining City and County requirements

We're building a simple web tool called "Permit Whisperer" that would:
- Ask residents a few questions about their project
- Tell them exactly which permits are needed (zoning, building, or both)
- Provide fee estimates
- Link directly to the correct forms
- Explain the workflow in plain language

The tool would be free for residents and designed to reduce confusion 
and phone calls to your office — not add to your workload.

Would you be open to a brief 15-minute conversation to:
1. Confirm our understanding of the zoning permit process
2. Verify we have the correct forms and fee schedules
3. Discuss any concerns or suggestions you might have

We're also happy to provide a demo of the prototype once it's ready.

Thank you for your time and for the work you do serving our community.

Best regards,
Michael A. Vega
[Contact Information]
Noirsys AI
```

**Follow-up:** 1 week if no response

---

## Contact 3: Ashtabula County Building Department (Feedback)

**To:** TETodd@ashtabulacounty.us (Taylor Todd)  
**Cc:** CAEllsworth@ashtabulacounty.us (Cari Ellsworth)  
**Subject:** Feedback Request — Resident-Facing Permit Guide Tool

```
Dear Taylor and Cari,

I'm reaching out regarding a civic technology project I'm developing to 
help Ashtabula County residents better understand and navigate the 
building permit process.

We've researched the current workflow (CitizenServe portal, plan review 
timelines, inspection scheduling) and identified opportunities to reduce 
resident confusion — particularly around when a zoning permit is required 
before a building permit can be issued.

We're building a guided tool called "Permit Whisperer" that would:
- Help residents determine if their project needs permits
- Explain the two-stage process (City zoning → County building)
- Provide fee estimates based on project type
- Link to the appropriate CitizenServe application forms
- Answer common questions to reduce phone volume

Before we proceed, we'd value your input:

1. Does our understanding of the permit workflow match your experience?
2. Are there common misconceptions or questions you see repeatedly?
3. Would a tool like this be helpful, or do you see potential issues?
4. Is there official documentation (fee schedules, requirement checklists) 
   we should reference to ensure accuracy?

We're happy to meet at your convenience — even a brief 10-15 minute 
phone call would be invaluable.

This is a community service project with no commercial intent. Our goal 
is simply to make the process clearer for residents.

Thank you for your time and for the work you do.

Best regards,
Michael A. Vega
[Contact Information]
Noirsys AI
```

**Follow-up:** 1 week if no response

---

## Parallel Actions (No Blockers)

While waiting for responses, proceed with:

### 1. Fee Schedule Documentation
- [ ] Download official fee schedule PDFs from Ashtabula County website
- [ ] Create structured fee calculator data file
- [ ] Note exceptions (decks <30", sheds <200 sq ft, etc.)

### 2. Zoning Permit Forms Inventory
- [ ] Document current PDF form URLs
- [ ] Note any fillable vs. print-only forms
- [ ] Capture submission options (fax, email, in-person)

### 3. Decision Tree Logic Draft
- [ ] Map project types → permit requirements
- [ ] Draft questionnaire flow
- [ ] Identify edge cases and clarifications needed

---

## Success Criteria for Phase 2

| Outcome | Impact | Next Step |
|---------|--------|-----------|
| CitizenShare API available | High | Proceed to integration design |
| CitizenShare no API | Medium | Proceed with Option A (informational MVP) |
| City PCD positive response | High | Schedule meeting, verify content |
| City PCD no response | Low | Build based on public docs, soft launch |
| County feedback received | Medium | Refine accuracy, build credibility |
| County no response | Low | Proceed with public information only |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| No API access | Informational MVP still delivers value |
| Negative stakeholder response | Pivot to purely educational resource (no official affiliation) |
| Long response delays | Proceed with public data, iterate when feedback arrives |
| Scope creep | Stay focused on residential permits for City of Ashtabula only |

---

## Resources Compiled

### Contact Summary
| Entity | Contact | Method | Status |
|--------|---------|--------|--------|
| CitizenServe | support@citizenserve.com | Email | Ready to send |
| City PCD | PCD@cityofashtabula.com | Email | Ready to send |
| County Building | TETodd@ashtabulacounty.us | Email | Ready to send |

### Reference Documents
- CitizenServe Portal: https://www.citizenserve.com/ashtabula
- County Fee Schedule: https://www.ashtabulacounty.us/DocumentCenter/View/149/Fees---Residential--Commercial
- Residential Requirements: https://www.ashtabulacounty.us/203/Residential-Permit-Requirements
- Zoning Contacts: https://www.ashtabulacounty.us/DocumentCenter/View/1746/Ashtabula-County-Zoning-Contacts-2023

---

**Next Deliverable:** Based on response patterns, create SPEC.md for Informational MVP (Option A) or Integration Design Doc (Option B).

**Approved to send?** [ ] Yes, send all three  [ ] Yes, send CitizenServe only  [ ] Modify first  [ ] Hold until ___
