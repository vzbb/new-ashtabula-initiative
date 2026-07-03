# Phase 2 Resource Procurement — Event Permit Express
**Project:** Streamlined Event Permitting for Ashtabula County  
**Date:** 2026-02-20  
**Status:** Phase 2 Complete — Ready for Stakeholder Outreach  
**Previous:** Phase 1 Research

---

## 1. Stakeholder Contact Directory

### Government Partners (Primary)

| Jurisdiction | Department | Contact | Priority |
|--------------|------------|---------|----------|
| **Ashtabula County Metroparks** | Administration | 440-576-0717 | 🔥 CRITICAL |
| **City of Ashtabula Parks** | Parks & Rec | 440-992-7133 | 🔥 CRITICAL |
| **Geneva Park District** | Director | 440-466-4441 | 🔥 CRITICAL |
| **Ashtabula Fairgrounds** | Manager | 440-998-2961 | HIGH |
| **Geneva Township** | Trustees | 440-466-8131 | MEDIUM |
| **Ashtabula Township** | Trustees | 440-992-7822 | MEDIUM |

### Event Organizer Partners (Validation)

| Organization | Type | Contact | Purpose |
|--------------|------|---------|---------|
| **Ashtabula County Fair** | Annual event | 440-998-2961 | User testing |
| **Grape Jamboree** | Festival | Via Geneva Chamber | Pain point validation |
| **Bridge Fest** | City festival | City of Ashtabula | Requirements gathering |
| **Wedding planners** | Private events | Facebook groups | Private event needs |
| **Farmers market managers** | Weekly markets | Various | Recurring permits |

### Support Organizations

| Organization | Role | Contact | Purpose |
|--------------|------|---------|---------|
| **Ashtabula Area Chamber** | Business hub | 440-998-2961 | Event organizer network |
| **Geneva Area Chamber** | Business hub | 440-466-8131 | Distribution |
| **Downtown Ashtabula Assoc** | Business district | Facebook | Local events |

---

## 2. Outreach Email Templates

### Template A: Parks Department (Metroparks/City/Geneva)

**Subject:** Partnership proposal — streamlined event permitting tool

```
Dear [Director Name],

I'm writing from a local technology initiative to propose a tool that 
could reduce administrative burden for your department while improving 
the experience for event organizers.

**The challenge we see:**
Event organizers currently face a fragmented process across multiple 
jurisdictions — phone calls, paper forms, no visibility into status. 
This creates extra work for your staff fielding repetitive questions.

**Our proposed solution:**
A unified event permit portal specifically for Ashtabula County that:

• Guides organizers through permit requirements by event type
• Submits applications digitally to appropriate agencies
• Tracks application status in real-time
• Reduces back-and-forth with automated requirement checking
• Costs nothing for government partners

**What it would mean for [Department]:**
• Fewer phone calls about basic requirements
• Digital application intake (no more paper/fax)
• Status dashboard (see all pending applications)
• Automated notifications to applicants
• No IT burden — we handle hosting/maintenance

**The ask:**
Would you be open to a 20-minute conversation about your current 
permitting process and pain points? We're building this specifically 
for small communities like ours, not a one-size-fits-all enterprise 
solution.

Best regards,
[Your Name]
[Phone]
[Email]
```

### Template B: Multi-Jurisdiction Coordination

**Subject:** Collaborative permitting tool for Ashtabula County

```
Dear [Jurisdiction] Leadership,

I'm reaching out to propose a collaborative project that could benefit 
multiple jurisdictions in Ashtabula County.

**The opportunity:**
Event organizers often need permits from multiple agencies (parks, city, 
health department, etc.). A unified portal could:

• Route applications to correct agencies automatically
• Show organizers exactly what they need upfront
• Track status across all permits in one place
• Reduce duplicate data entry

**Pilot scope:**
We're looking for 2-3 jurisdictions to pilot this in Q2 2026, with 
a focus on:
- Park/special event permits (highest volume)
- Simple workflow (not complex conditional use permits)
- Agencies open to digital process improvement

**Your involvement:**
• 2-3 meetings to map current process
• Review of permit requirements for accuracy
• Pilot testing with select events
• Feedback on usability

Would you be interested in exploring this collaboration?

Best,
[Your Name]
```

### Template C: Event Organizer Validation

**Subject:** Quick question about event permitting in Ashtabula County

```
Hi [Organizer Name],

I'm researching event permitting challenges in Ashtabula County and 
would love your input.

**Quick question:**
When you organized [Event Name], how did you handle permits? 

Specifically:
• How did you know which permits you needed?
• Was the process clear or confusing?
• How long did it take to get approved?
• Any pain points or surprises?

I'm exploring whether a digital permit tool would help local event 
organizers. Would you be open to a 10-minute phone call to share 
your experience?

No sales pitch — just research to see if this would actually help.

Thanks!
[Your Name]
```

---

## 3. Permit Requirements Research Checklist

### Event Types to Document

| Event Type | Typical Permits | Jurisdictions |
|------------|-----------------|---------------|
| **Park picnic/shelter** | Reservation, alcohol? | Metroparks, City, Geneva |
| **5K/10K race** | Park use, road closure, EMS | Multi-agency |
| **Festival/fair** | Park/facility, food vendors, alcohol | Metroparks, Health, City |
| **Concert** | Venue, noise, alcohol, security | Multi-agency |
| **Farmers market** | Weekly permit, vendor health | City, Health |
| **Wedding (public venue)** | Facility reservation, alcohol | Metroparks, City |
| **Parade** | Road closure, police, EMS | City, Sheriff |

### Data to Gather (Per Jurisdiction)

- [ ] Application forms (PDF or online)
- [ ] Required lead time (days/weeks before event)
- [ ] Fees (varies by event type/size)
- [ ] Insurance requirements
- [ ] Alcohol permit rules
- [ ] Noise ordinances
- [ ] Capacity limits
- [ ] Current processing time
- [ ] Contact person for questions

---

## 4. Technical Resource Assessment

### Platform Approach

| Feature | Implementation | Notes |
|---------|----------------|-------|
| **Multi-jurisdiction routing** | Conditional logic | Route to correct agency based on location |
| **Requirement wizard** | Question tree | "What type of event?" → "How many people?" → etc |
| **Digital forms** | Dynamic PDF/JSON | Auto-populate standard fields |
| **Status tracking** | Simple dashboard | Pending/under review/approved |
| **Notifications** | Email + optional SMS | Status updates, reminders |

### Integration Strategy

| Jurisdiction | Integration Level | Effort |
|--------------|-------------------|--------|
| **High-tech** | API/webhook | Medium |
| **Medium** | Email notification + dashboard | Low |
| **Low-tech** | Email + manual entry | Low (fallback) |

**MVP Approach:**
- Start with email-based routing (works for everyone)
- Dashboard for agencies to track applications
- Upgrade to API integration for willing partners

---

## 5. Competitive Intelligence

### Eproval Analysis
- **Target:** Cities 100K+
- **Pricing:** $$$ (enterprise)
- **Features:** Complex workflows, analytics
- **Gap:** Too expensive/complex for small communities

### OpenCounter Analysis  
- **Target:** Mid-size cities
- **Pricing:** SaaS subscription
- **Features:** Zoning + permitting
- **Gap:** No small community focus

### DIY Approach (Current State)
- **Method:** PDF forms, phone, email
- **Issues:** No tracking, inconsistent info, manual processing
- **Gap:** No unified view for organizers

**Our Opportunity:**
- Lightweight (not enterprise)
- Multi-jurisdiction (single portal)
- Free for government partners
- Simple setup (no IT department needed)

---

## 6. Risk Assessment Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Jurisdictions won't collaborate | Medium | High | Start with 1-2 willing partners |
| Legal liability for permit advice | Medium | High | Clear disclaimers, "consult official sources" |
| Permits too complex to standardize | Medium | Medium | Start with simple events (park rentals) |
| Low event volume to justify tool | Low | Medium | Include private events (weddings, parties) |
| Staff resistance to digital | Medium | Medium | Position as assistant, not replacement |

---

## 7. Go/No-Go Decision Tree

```
After outreach:
│
├─► If 2+ jurisdictions interested:
│   └─► Proceed to Phase 3 (SPEC.md)
│       └─► Build for willing partners first
│
├─► If 1 jurisdiction interested:
│   └─► Single-jurisdiction MVP
│       └─► Expand later
│
└─► If no jurisdiction interest:
    └─► Pause
        └─► Focus on event organizer tools only
```

### Go Criteria
- [ ] At least 1 parks department willing to pilot
- [ ] OR 5+ event organizers confirm pain points
- [ ] Permit requirements documented for 3+ event types

### No-Go Criteria
- [ ] All jurisdictions decline
- [ ] Legal barriers prevent digital submission
- [ ] Event volume too low (<50/year across county)

---

## 8. Quick Reference — Key Contacts

| Jurisdiction | Phone | Best Time | Notes |
|--------------|-------|-----------|-------|
| Metroparks | 440-576-0717 | Morning | County-wide parks |
| City Parks | 440-992-7133 | Morning | City of Ashtabula |
| Geneva Parks | 440-466-4441 | Afternoon | Geneva facilities |
| Fairgrounds | 440-998-2961 | Business hrs | Large event venue |
| County Fair | 440-998-2961 | Off-season | Annual event Aug |

---

**Document Status:** Phase 2 Complete  
**Next:** Execute outreach OR proceed to Phase 3 with assumptions  
**Priority:** Contact Metroparks (440-576-0717) — highest volume, county-wide
