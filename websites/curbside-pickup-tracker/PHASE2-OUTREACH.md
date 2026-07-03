# Phase 2 Resource Procurement — Curbside Pickup Tracker
**Project:** SMS-Based Curbside Coordination for Ashtabula Small Businesses  
**Date:** 2026-02-20  
**Status:** Phase 2 Complete — Ready for Business Outreach Execution  
**Previous:** Phase 1 Research

---

## 1. Stakeholder Contact Directory

### Priority Tier 1 — Restaurant Targets (High Curbside Need)

| Business | Type | Location | Contact Strategy | Priority |
|----------|------|----------|------------------|----------|
| **Crosby's** | Family restaurant | Downtown Ashtabula | Phone → Email | 🔥 HIGH |
| **Baci's Pizza** | Pizza/Italian | Ashtabula | Phone → Email | 🔥 HIGH |
| **Dominic's Pizza** | Pizza | Multiple locations | Website form | 🔥 HIGH |
| **Lido's Restaurant** | Family dining | Ashtabula | Phone | HIGH |
| **Old Forge Cafe** | Breakfast/Lunch | Geneva | Facebook | HIGH |
| **Grand River Cellars** | Winery/Restaurant | Madison | Email → Phone | HIGH |

### Priority Tier 2 — Retail Targets (Medium Need)

| Business | Type | Location | Contact Strategy | Priority |
|----------|------|----------|------------------|----------|
| **Sander's Market** | Grocery | Jefferson | Phone → In-person | MEDIUM |
| **Harbor Gardens** | Food hub | Ashtabula | Email | MEDIUM |
| **Local boutique shops** | Retail | Bridge St | Walk-in | MEDIUM |
| **Hardware stores** | Home goods | County-wide | Phone | MEDIUM |

### Support Organizations

| Organization | Role | Contact | Purpose |
|--------------|------|---------|---------|
| **Ashtabula County Restaurant Association** | Industry group | Facebook/LinkedIn | Member introductions |
| **Geneva Area Chamber of Commerce** | Business support | 440-466-8131 | Pilot partnerships |
| **Downtown Ashtabula Association** | Business district | Facebook | Local business outreach |

---

## 2. Outreach Email Templates

### Template A: Restaurant Initial Outreach

**Subject:** Free curbside pickup tool for Ashtabula restaurants — no app needed

```
Hi [Owner Name],

I'm reaching out from a local tech initiative helping Ashtabula County 
businesses compete with the big chains.

**The problem we're solving:**
Walmart and Target offer slick curbside pickup, but their tools cost 
$300-500/month — way too expensive for local restaurants. Meanwhile, 
customers expect the convenience.

**Our solution:**
We're building a simple curbside coordination tool specifically for 
small businesses like yours:

• Customers text when they arrive (no app download)
• You get instant notifications with their spot number
• Works with your existing phone and staff
• $0 for pilot businesses (permanent free tier)

**Why it's different:**
- No customer app required (unlike SWIPEBY)
- No monthly fees for pilot partners
- 15-minute setup, not 2 weeks
- Designed for small-town businesses

**The ask:**
Would you be open to a 10-minute conversation about how curbside pickup 
currently works (or doesn't) at your restaurant? We're not selling 
anything — just want to build something that actually helps local 
businesses compete.

Best regards,
[Your Name]
[Phone]
[Email]

P.S. — This is being built specifically for Ashtabula County businesses, 
not a generic Silicon Valley tool.
```

### Template B: Follow-Up (1 Week Later)

**Subject:** Re: Curbside pickup tool — 2 restaurants already interested

```
Hi [Owner Name],

Quick follow-up on the curbside coordination tool for local restaurants.

We've spoken with [Restaurant X] and [Restaurant Y] who both expressed 
interest in piloting this before the busy summer season.

**What pilot partners get:**
• Free curbside tool permanently (no monthly fees, ever)
• Direct input on feature design
• Priority support during rollout
• Co-marketing through local channels

The pilot would run for 30 days starting in March, just before tourist 
season kicks in.

Worth a quick 10-minute call?

[Your Name]
```

### Template C: Retail/Grocery Outreach

**Subject:** Curbside pickup coordination — help your customers shop easier

```
Hi [Owner Name],

I noticed [Business Name] serves a lot of local customers who probably 
appreciate convenience.

I'm working on a simple curbside pickup tool designed specifically for 
independent businesses in Ashtabula County. Unlike the expensive 
enterprise solutions ($300+/month), this would be:

• SMS-based (customers text when they arrive)
• Under $30/month for full features
• 15-minute setup
• No app downloads required

Would you be open to sharing how you currently handle customer pickups? 
Even understanding the pain points would help us build something useful.

No commitment required — just a brief conversation.

Best,
[Your Name]
```

---

## 3. Business Research Checklist

### Information to Gather (Per Business)

| Question | Why It Matters |
|----------|----------------|
| Current curbside process? | Baseline understanding |
| Volume of curbside orders/week? | Sizing the opportunity |
| Current pain points? | Feature prioritization |
| Staff workflow for pickups? | Integration design |
| Phone vs online ordering ratio? | SMS vs app preference |
| Peak hours/days? | Load balancing needs |
| Customer demographics? | Tech comfort level |
| Payment methods accepted? | Integration requirements |

### Mystery Shopper Script

**Task:** Call 5 local restaurants pretending to be a customer wanting curbside pickup.

**Questions to ask:**
1. "Do you offer curbside pickup?"
2. "How does it work? Do I need to call when I arrive?"
3. "Is there an app I need to download?"
4. "How do you know when I'm here?"

**Document:**
- Do they offer curbside?
- How do they currently coordinate?
- Pain points in their process?
- Staff attitude toward curbside?

---

## 4. Technical Resource Assessment

### SMS Provider Comparison

| Provider | Pricing | Features | Recommendation |
|----------|---------|----------|----------------|
| **Twilio** | ~$0.0075/SMS | Reliable, good APIs | **Primary choice** |
| **SimpleTexting** | $29/mo unlimited | Easy dashboard | Alternative |
| **TextMagic** | $0.04/SMS | Simple setup | Backup |

### Geofencing Options

| Approach | Accuracy | Cost | Complexity |
|----------|----------|------|------------|
| **Customer texts when arrives** | High (self-reported) | Free | None |
| **GPS geofencing** | Medium | Free (browser API) | Medium |
| **Beacon hardware** | Very high | $50-100/beacon | High |

**MVP Decision:** Start with SMS-based arrival (customer texts "HERE"), add GPS later if needed.

### Integration Points

| System | Integration Type | Priority |
|--------|------------------|----------|
| **Square POS** | Webhook/API | High |
| **Toast POS** | API | Medium |
| **Clover POS** | API | Medium |
| **Phone orders** | Manual entry | MVP fallback |

---

## 5. Competitive Intelligence

### SWIPEBY Deep Dive
- **Pricing:** $0.99/order OR $58/month + 4%
- **Setup:** 2-3 weeks
- **Customer friction:** Requires app download
- **Weakness:** Cost prohibitive for small volume

### SimpleTexting Analysis
- **Pricing:** $29/month base
- **Features:** SMS only, no geofencing
- **Gap:** No arrival coordination workflow

### Opportunity Gap
**No solution offers:**
- SMS-based arrival (no app)
- Under $30/month
- 15-minute setup
- Small-town business focused

---

## 6. Risk Assessment Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Businesses don't see curbside value | Medium | High | Start with restaurants (highest need) |
| SMS costs eat margins | Low | Medium | Estimate volume, cap monthly |
| Competition from free solutions | Medium | Medium | Focus on simplicity, local support |
| POS integration complexity | Medium | Medium | Start with manual workflow |
| Customer adoption low | Low | Medium | SMS has near-zero friction |

---

## 7. Go/No-Go Decision Tree

```
After outreach complete:
│
├─► If 3+ businesses express interest:
│   └─► Proceed to Phase 3 (SPEC.md)
│       └─► Include real business requirements
│
├─► If 1-2 businesses interested:
│   └─► Narrow MVP scope
│       └─► Single business pilot
│
└─► If 0 businesses interested:
    └─► Pause project
        └─► Document learnings, pivot to delivery focus
```

### Go Criteria
- [ ] 3+ businesses agree to pilot conversation
- [ ] At least 1 restaurant (high-need vertical)
- [ ] Pricing data gathered from 3+ competitors

### No-Go Criteria
- [ ] Zero business interest
- [ ] All businesses satisfied with current process
- [ ] SMS costs prohibitive at estimated volume

---

## 8. Quick Reference — Key Contacts

| Business | Phone | Best Time | Notes |
|----------|-------|-----------|-------|
| Crosby's | (440) 992-9944 | Lunch rush avoided | Family restaurant |
| Baci's Pizza | (440) 992-2988 | Mid-afternoon | Pizza/Italian |
| Lido's | (440) 998-4661 | After 2pm | Diner-style |
| Old Forge | (440) 466-6488 | Mid-morning | Geneva location |
| Geneva Chamber | (440) 466-8131 | Business hours | Partnerships |

---

**Document Status:** Phase 2 Complete  
**Next:** Execute outreach OR proceed to Phase 3 with assumptions  
**Recommended:** Contact 3 restaurants this week for validation
