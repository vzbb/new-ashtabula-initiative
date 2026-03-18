# Phase 2 Resource Procurement — Eligibility Lite
**Project:** Simplified Benefits Screening for Ashtabula County  
**Date:** 2026-02-20  
**Status:** Phase 2 Complete — Ready for Stakeholder Outreach  
**Previous:** Phase 1 Research

---

## 1. Stakeholder Contact Directory

### Government Partners (Primary)

| Organization | Role | Contact | Priority |
|--------------|------|---------|----------|
| **ACDJFS** | SNAP, Medicaid, TANF | 440-994-1265 (Ashtabula) | 🔥 CRITICAL |
| **ACCAA** | HEAP, utility assistance | 440-992-7263 | 🔥 CRITICAL |
| **Ashtabula Health Dept** | WIC | 440-576-6010 | HIGH |
| **AMHA** | Housing vouchers | 440-992-5611 | MEDIUM |
| **Council on Aging** | Senior programs | 440-576-5514 | MEDIUM |

### Community Partners

| Organization | Role | Contact | Purpose |
|--------------|------|---------|---------|
| **211 Helpline** | Referral hub | 211 or 440-375-4100 | Integration/validation |
| **Ashtabula County Community Action** | Social services | 440-997-5959 | Outreach partnership |
| **United Way Ashtabula** | Nonprofit hub | 440-992-7208 | Distribution channel |
| **Local food pantries** | Direct reach | Via ACCAA | User testing |
| **Library branches** | Public access | 6 county locations | Promotion/distribution |

### Validation Partners

| Source | Method | Goal |
|--------|--------|------|
| **Facebook groups** | "Ashtabula County Residents" | Validate pain points |
| **Local nonprofits** | Catholic Charities, Salvation Army | Referral pathway |
| **Churches** | Various denominations | Distribution network |

---

## 2. Outreach Email Templates

### Template A: Government Agency (ACDJFS/ACCAA)

**Subject:** Partnership proposal — digital benefits screening tool for residents

```
Dear [Director Name],

I'm writing on behalf of a local technology initiative to propose a 
partnership that could help Ashtabula County residents access the 
benefits they're entitled to.

**The challenge we're addressing:**
Research shows that 5,000-8,000 county residents are likely eligible 
for Medicaid but unenrolled, and many more miss SNAP, HEAP, and other 
programs due to:
- Complex eligibility rules
- Not knowing which programs exist
- Intimidation by the application process

**Our proposed solution:**
A simple, anonymous, mobile-friendly screening tool that asks residents 
5-10 questions and tells them which programs they likely qualify for — 
with clear next steps to apply.

**Key features:**
• Anonymous (no login or personal data required)
• Mobile-first (works on any phone)
• Local focus (Ashtabula County programs only)
• Clear next steps (links to official applications)
• No cost to the county

**What we need from [Agency]:**
• Validation that our eligibility logic is accurate
• Feedback on the user experience
• Permission to reference official application processes
• Potential co-promotion through your channels

**Timeline:**
We'd like to pilot this in March with a small group of residents, 
refine based on feedback, and launch publicly in April.

Would you be open to a 20-minute conversation to discuss this 
opportunity?

Best regards,
[Your Name]
[Phone]
[Email]
```

### Template B: 211 / Community Partners

**Subject:** Collaboration opportunity — benefits screening tool for Ashtabula

```
Dear [Partner Name],

I hope this message finds you well. I'm reaching out about a potential 
collaboration that could support your mission to connect residents with 
resources.

We're building a simple digital tool that helps Ashtabula County 
residents quickly identify which benefit programs they may qualify for 
(SNAP, HEAP, Medicaid, WIC, etc.).

**Why this helps your organization:**
• Reduces basic eligibility questions (screening happens online)
• Provides consistent, accurate information
• Can integrate with your referral process
• Free resource for your clients

**The tool would:**
• Ask 5-10 anonymous questions
• Show which programs match their situation
• Provide next steps and application links
• Never collect personal information

Would you be interested in:
1. Reviewing the tool for accuracy before launch?
2. Distributing it through your channels?
3. Providing feedback on how it fits with your workflow?

Happy to schedule a brief call to discuss.

Thank you for your work in our community,
[Your Name]
```

### Template C: Library/Food Pantry Distribution

**Subject:** Free resource for your visitors — benefits screening tool

```
Dear [Organization Name],

I'm developing a free tool to help Ashtabula County residents identify 
benefits they may qualify for (SNAP, utility assistance, Medicaid, etc.).

The tool is:
• Completely free
• Anonymous (no personal information collected)
• Mobile-friendly (works on any phone)
• Specific to Ashtabula County programs

Would you be willing to:
- Display a small sign with QR code linking to the tool?
- Share it with visitors who might benefit?

I'm happy to provide printed materials and answer any questions.

Thank you for supporting our community,
[Your Name]
```

---

## 3. Eligibility Rules Validation Checklist

Programs to Research/Validate:

### SNAP (ACDJFS)
- [ ] Income limits (130% FPL for gross, 100% for net)
- [ ] Household size calculations
- [ ] Asset limits ($2,750 or $4,250 if elderly/disabled)
- [ ] Work requirements
- [ ] Application process/steps

### Medicaid (ACDJFS)
- [ ] Income limits (138% FPL for expansion)
- [ ] Categories (pregnant, children, elderly, disabled)
- [ ] MAGI vs non-MAGI pathways
- [ ] Application process

### HEAP (ACCAA)
- [ ] Income limits (175% FPL)
- [ ] One-time vs regular benefit
- [ ] Emergency HEAP criteria
- [ ] Application windows

### WIC (Health Dept)
- [ ] Categorical eligibility (pregnant, breastfeeding, postpartum, children <5)
- [ ] Income limits (185% FPL)
- [ ] Nutritional risk assessment
- [ ] Clinic locations

### TANF (ACDJFS)
- [ ] Income limits (very low)
- [ ] Time limits (36 months)
- [ ] Work participation requirements

### Housing Vouchers (AMHA)
- [ ] Income limits (50% AMI)
- [ ] Waitlist status
- [ ] Local preference rules

---

## 4. Technical Resource Assessment

### Data Sources

| Source | URL | Use |
|--------|-----|-----|
| **Federal Poverty Guidelines** | aspe.hhs.gov | Income thresholds |
| **Ohio Benefits** | benefits.ohio.gov | Program info |
| **ACDJFS Website** | ashtabuladjfs.org | Local application details |
| **ACCAA Website** | accaa.org | HEAP details |

### Calculation Engine

Simple rules-based engine (no AI needed):

```typescript
function checkEligibility(household: Household): EligibilityResult {
  const results = [];
  
  // SNAP
  if (household.income <= fpl[household.size] * 1.3) {
    results.push({
      program: 'SNAP',
      eligible: true,
      estimatedBenefit: estimateSnap(household.size),
      nextSteps: ['Apply at ACDJFS', 'Bring ID and income proof']
    });
  }
  
  // Medicaid
  if (household.income <= fpl[household.size] * 1.38) {
    results.push({
      program: 'Medicaid',
      eligible: true,
      nextSteps: ['Apply at Benefits.ohio.gov']
    });
  }
  
  // ... etc
  
  return results;
}
```

### Privacy Approach
- NO server-side storage of user data
- All calculations client-side
- Anonymous analytics only (aggregate)
- No PII collected ever

---

## 5. User Testing Plan

### Target Testers
- 5 residents who have recently applied for benefits
- 5 residents who think they might qualify but haven't applied
- 3 caseworkers (for accuracy validation)

### Testing Questions
1. Was the questionnaire easy to understand?
2. Did the results match your expectations?
3. Were the next steps clear?
4. Would you use this tool before applying?
5. What was confusing or missing?

### Distribution Channels for Testing
- Food pantries
- Library computer labs
- Community centers
- Facebook groups
- Partner organizations

---

## 6. Risk Assessment Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Eligibility info incorrect | Medium | HIGH | Validate with ACDJFS, add disclaimers |
| Low user adoption | Medium | Medium | Partner distribution, library promotion |
| Agency resistance | Medium | Medium | Position as complement, not replacement |
| Outdated program info | High | Medium | Quarterly review process |
| Legal liability for wrong info | Low | High | Clear disclaimers, "consult official sources" |

---

## 7. Go/No-Go Decision Tree

```
After outreach:
│
├─► If ACDJFS or ACCAA agrees to validate:
│   └─► Proceed to Phase 3 (SPEC.md)
│       └─► Build with official blessing
│
├─► If agencies don't respond but community partners interested:
│   └─► Proceed with disclaimers
│       └─► "Consult official sources for final determination"
│
└─► If no stakeholder interest:
    └─► Pause and reassess
        └─► Document learnings
```

### Go Criteria
- [ ] At least 1 government agency validates approach
- [ ] OR 3+ community partners agree to distribute
- [ ] Eligibility rules documented for 4+ programs

### No-Go Criteria
- [ ] Agencies actively oppose
- [ ] Legal concerns block progress
- [ ] Zero community partner interest

---

## 8. Quick Reference — Key Contacts

| Organization | Phone | Best Time | Contact Person |
|--------------|-------|-----------|----------------|
| ACDJFS | 440-994-1265 | Morning | Director's office |
| ACCAA | 440-992-7263 | Business hours | HEAP coordinator |
| Health Dept | 440-576-6010 | Morning | WIC clinic |
| 211 | 211 | 24/7 | Automated + live |
| United Way | 440-992-7208 | Business hours | Director |

---

**Document Status:** Phase 2 Complete  
**Next:** Execute outreach OR proceed to Phase 3 with conservative assumptions  
**Priority:** Contact ACDJFS (440-994-1265) for eligibility validation
