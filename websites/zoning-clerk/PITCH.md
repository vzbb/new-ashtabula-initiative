# Zoning Clerk — Pitch Deck
## For City of Ashtabula Planning & Community Development

**Prepared by:** Noirsys AI  
**Date:** February 18, 2026  
**Contact:** Michael A. Vega, michael@noirsys.com  

---

## The Pitch (30 Seconds)

> "We've built a free AI-powered zoning assistant specifically for Ashtabula residents. It answers common zoning questions instantly, cites official city documents, and routes complex inquiries to your office. It's already working—would you like to see a demo?"

---

## Problem Statement

### Current State (The Friction)
| Pain Point | Impact on PCD | Impact on Residents |
|------------|---------------|---------------------|
| Phone calls for basic questions | Staff time diverted from complex work | Long hold times, limited office hours |
| PDF forms buried on website | Incomplete applications, repeat submissions | Frustration, project delays |
| Zoning code is dense/legalistic | Residents need hand-holding | Self-service nearly impossible |
| Historic district process unclear | ARB delays, resubmissions | Confusion, compliance issues |
| No after-hours support | Backlog builds overnight | Urgency cannot be addressed |

### The Cost of Status Quo
- **Staff time:** 10-20 hours/week answering repetitive questions
- **Resident frustration:** Projects delayed, permits abandoned
- **Economic impact:** Development friction reduces investment

---

## Solution: Ashtabula Zoning Assistant

### What It Does

**1. Instant Answers, 24/7**
- Natural language questions: "Do I need a permit for a shed?"
- Citation-backed responses from official city documents
- Works on phones, tablets, desktops

**2. Permit Wizard**
- Conversational guide to required permits
- No wrong doors—residents get to the right form
- Reduces incomplete applications

**3. Historic District Navigator**
- Clear explanation of ARB process
- Certificate of Appropriateness guidance
- Cites official Historic District Zoning Guide

**4. Smart Escalation**
- Complex questions routed to PCD@cityofashtabula.com
- Context preserved (conversation history attached)
- Your team handles what needs human judgment

---

## Live Demo Preview

### Demo Script (3 Minutes)

**Setup:** Open [staging URL] on phone + laptop

**1. Quick Question (30 sec)**
> Type: "Do I need a permit for a shed?"

Show: Instant answer with citation to zoning guide

**2. Follow-up (30 sec)**
> Type: "What about a fence?"

Show: Contextual understanding, accurate response

**3. Historic District (45 sec)**
> Type: "I'm on West 8th Street, do I need ARB approval for new windows?"

Show: Specific historic district guidance, process steps

**4. Complex Escalation (45 sec)**
> Type: "I want to open a restaurant with outdoor seating"

Show: Wizard flow, then "Contact PCD" with pre-filled context

**5. Mobile View (30 sec)**
Switch to phone, show responsive design

---

## Technical Overview

### Architecture (For IT Review)

```
User Query → AI Processing → Citation → Response
                 ↑
            Qdrant Vector DB
            (Official Documents)
```

- **Documents ingested:** Historic District Zoning Guide, City Welcome Info
- **Pending:** Part 11 Zoning Code (for deeper Q&A)
- **LLM:** Gemini 2.5 Flash (fast, accurate, cost-effective)
- **Hosting:** Firebase (Google infrastructure, 99.95% uptime SLA)
- **No city IT resources required**

### Data Privacy
- No resident data stored permanently
- Conversations logged for improvement (anonymized)
- No tracking/selling of user behavior
- City maintains document control

---

## Benefits Summary

### For PCD Staff
| Metric | Before | After |
|--------|--------|-------|
| Basic question calls | 20+/week | <5/week |
| Incomplete applications | Common | Reduced |
| After-hours support | None | 24/7 |
| Historic district confusion | High | Guided |

### For Residents
- **Immediate answers** — no waiting on hold
- **Clear citations** — verify information yourself
- **Mobile-friendly** — check while at the property
- **Always available** — nights, weekends, holidays

### For City Leadership
- **Modern service delivery** — tech-forward reputation
- **Economic development** — reduce friction for investment
- **Staff efficiency** — focus on complex work
- **No budget impact** — provided at no cost

---

## Implementation: Already Done

### What's Built (Ready Today)
- ✅ Full React application (6 feature modules)
- ✅ Chat assistant with document citations
- ✅ Permit wizard with decision trees
- ✅ Historic district guide integration
- ✅ Property lookup (GIS-ready)
- ✅ Document center with PDF links
- ✅ Mobile-responsive design
- ✅ Production build optimized

### What's Needed From City
| Item | Purpose | Timeline |
|------|---------|----------|
| Part 11 Zoning Code PDF | Enhanced Q&A coverage | Anytime |
| Current permit forms | Direct form links | Anytime |
| Fee schedule | Cost estimates in wizard | Anytime |
| Official blessing | Public launch authority | Before public announcement |

---

## Partnership Model

### Phase 1: Soft Launch (Immediate)
- Deploy to staging URL
- PCD staff testing and feedback
- Document gaps identified and filled

### Phase 2: Official Launch (Week 2-3)
- City-approved messaging
- Link from city website
- Announcement to residents

### Phase 3: Enhancement (Ongoing)
- New documents added as available
- Analytics review (popular questions)
- Feature requests from staff feedback

### Cost Structure
| Phase | City Cost | Noirsys Cost |
|-------|-----------|--------------|
| Setup & Launch | $0 | Development, hosting |
| Operation Year 1 | $0 | Hosting, maintenance |
| Ongoing | $0 | Hosting (~$20/month) |

**Why free?** We're demonstrating civic tech capability for the region. Your success is our marketing.

---

## Risk Mitigation

### Legal/Accuracy
- ✅ Clear disclaimers: "General information, not legal advice"
- ✅ Citations to official sources
- ✅ Complex questions routed to staff
- ✅ Regular document updates

### Technical
- ✅ Hosted on Google Firebase (enterprise-grade)
- ✅ Auto-scaling, no city IT burden
- ✅ Version control, rollback capability
- ✅ Uptime monitoring

### Adoption
- ✅ Mobile-first (meets residents where they are)
- ✅ No app download required
- ✅ Works with existing city phone/email
- ✅ Staff training: 15 minutes

---

## Next Steps

### Immediate (This Week)
1. **Demo meeting** (30 min) — Show working prototype
2. **Staff feedback** — Identify any concerns
3. **Document sharing** — Part 11 Zoning Code, forms

### Short-term (Next 2 Weeks)
4. **Soft launch** — Deploy to production URL
5. **Staff training** — 15-minute walkthrough
6. **Feedback cycle** — Iterate based on usage

### Launch (Week 3-4)
7. **Official announcement** — City communication channels
8. **Analytics review** — Popular questions, gaps
9. **Continuous improvement** — Monthly updates

---

## Appendix A: Sample Conversations

### Scenario 1: Shed Permit
**User:** "Do I need a permit for a shed?"

**Assistant:** "Yes, sheds typically require a zoning permit in Ashtabula. The specific requirements depend on size and location:

• Sheds under 120 sq ft: Zoning permit only
• Sheds over 120 sq ft: Zoning permit + building permit
• Setback: Must be 5+ feet from property lines
• Historic district: ARB approval also required

[Citation: Historic District Zoning Guide, Section 1115]

Would you like help determining which permits apply to your specific situation?"

---

### Scenario 2: Historic District Process
**User:** "What is the Certificate of Appropriateness?"

**Assistant:** "A Certificate of Appropriateness (COA) is required for exterior alterations to properties in Ashtabula's Historic District. Here's the process:

1. **Submit application** to PCD office
2. **ARB review** at monthly meeting (3rd Tuesday)
3. **Decision** within 30 days
4. **Appeal** possible to City Council

Work cannot begin until COA is approved.

[Citation: Historic District Zoning Guide, Sections 1115.03-1115.05]

The Architectural Review Board meets at City Hall, 4717 Main Avenue. For application forms, contact PCD at (440) 992-7125."

---

### Scenario 3: Complex Escalation
**User:** "I want to convert my garage into an apartment"

**Assistant:** "This involves multiple permits and potential zoning considerations:

• **Zoning permit** — Accessory dwelling unit rules
• **Building permit** — Structural/electrical/plumbing
• **Possible variances** — If setbacks don't comply
• **Historic district** — COA if applicable

This situation requires review of your specific property. Let me connect you with PCD:

📧 **Email:** PCD@cityofashtabula.com  
📞 **Phone:** (440) 992-7125  
📍 **Office:** 4717 Main Avenue, Ashtabula, OH 44004

Office hours: Monday-Friday, 8:00 AM - 4:30 PM

[Your conversation context will be included when you click 'Email PCD']"

---

## Appendix B: Competitive Landscape

### What Other Cities Are Doing

| City | Approach | Ashtabula Advantage |
|------|----------|---------------------|
| Cleveland | Phone-based only | 24/7 availability |
| Erie, PA | Basic website FAQ | Conversational AI |
| Sandusky | PDF forms online | Guided wizard |
| Mentor | Email inquiry | Instant response |

**No comparable small city in the region has an AI zoning assistant.**

---

## Appendix C: Technical Specifications (For IT)

### Stack
- **Frontend:** React 19 + Vite + Tailwind CSS
- **Backend:** Firebase Hosting + Functions
- **AI:** Gemini 2.5 Flash via API
- **Vector DB:** Qdrant (local to Noirsys)
- **Monitoring:** Firebase Analytics + UptimeRobot

### Security
- HTTPS only (SSL certificate auto-managed)
- No resident PII stored
- Content Security Policy implemented
- Rate limiting on API endpoints

### Performance
- First contentful paint: <1.5s
- Time to interactive: <3s
- Bundle size: ~315KB (compressed)
- Mobile-optimized

---

## Closing

**The zoning assistant is built. It's working. It's ready.**

We're offering it to the City of Ashtabula at no cost because we believe in demonstrating what's possible with modern civic technology.

The only question is: **Are you ready to give your residents 24/7 access to zoning information?**

---

**Contact:**  
Michael A. Vega  
Noirsys AI  
michael@noirsys.com  

**Demo URL:** [Staging link provided at meeting]  
**Documentation:** Full technical docs available upon request

---

*This pitch deck accompanies a working demonstration. We recommend scheduling a 30-minute meeting to see the assistant in action and discuss any questions.*
