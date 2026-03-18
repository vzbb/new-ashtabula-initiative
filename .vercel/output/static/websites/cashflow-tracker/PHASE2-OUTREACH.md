# Phase 2 — Resource Procurement: Cashflow Tracker
**Date:** 2026-02-19
**Project:** cashflow-tracker
**Status:** Outreach package ready for deployment

---

## 1. Target Contacts Acquired

### Primary: SBDC at YSU (Partnership)
| Field | Details |
|-------|---------|
| **Organization** | SBDC at Youngstown State University |
| **Website** | sbdc-ysu.org |
| **Service Area** | Ashtabula County |
| **Contact Method** | Online form + phone |
| **Phone** | (330) 941-2140 |
| **Best Approach** | Partnership inquiry via email to Director |

**Pitch Angle:** Free tool to extend SBDC counseling capacity; helps clients track cash flow between appointments.

---

### Secondary: Ashtabula Growth Partnership
| Field | Details |
|-------|---------|
| **Organization** | Ashtabula Growth Partnership |
| **Website** | ashtabulagrowth.com |
| **Focus** | Economic development, business retention |
| **Contact** | info@ashtabulagrowth.com |
| **Best Approach** | Endorsement request; aligns with small business support mission |

**Pitch Angle:** Keeps local businesses financially healthy = business retention.

---

### Tertiary: Local Accountant Outreach (3 targets)

| Firm | Location | Contact Strategy |
|------|----------|------------------|
| Local CPA serving small biz | Ashtabula/GOTL | LinkedIn search + cold email |
| Bookkeeping service | Geneva-on-the-Lake | Chamber directory |
| Tax prep/accounting | Conneaut | Google Maps → website → contact form |

**Pitch Angle:** Tool they can recommend to clients who can't afford full bookkeeping.

---

## 2. Outreach Email Templates

### Template A: SBDC Partnership Request
```
Subject: Partnership Inquiry — Free Cash Flow Tool for Ashtabula Small Businesses

Dear [Director Name],

I'm reaching out on behalf of a community initiative to support Ashtabula County 
small businesses with accessible financial tools.

We've developed a concept for Cashflow Tracker — a free, simple cash flow 
management tool specifically designed for micro-businesses in our seasonal 
tourism economy. It requires no accounting background and includes features 
like:

• Simple income/expense tracking
• 30/60/90-day cash projections
• Seasonal pattern awareness (built for Ashtabula's tourism cycles)
• Lender-ready reports for RLF/SBA applications

We're seeking validation and partnership opportunities with organizations 
already serving small businesses. Specifically, we'd love to explore:

1. Would this tool complement your counseling services?
2. Could SBDC advisors refer clients to this resource?
3. Would you be willing to provide feedback on the prototype?

The tool would remain free for basic use, with optional paid features 
funding ongoing development.

Would you be available for a 15-minute call to discuss? I'm happy to work 
around your schedule.

Thank you for your time and for all you do for our local business community.

Best regards,
[Michael's name/contact]
[Noirsys/community initiative context]
```

### Template B: Growth Partnership Endorsement
```
Subject: Tool Proposal — Cash Flow Management for Local Small Businesses

Dear Growth Partnership Team,

I'm writing to propose a free resource that could support your business 
retention and development mission: Cashflow Tracker.

The Problem:
82% of small business failures are tied to cash flow mismanagement. In 
Ashtabula's seasonal economy, this risk is even higher. Yet most local 
businesses can't afford $50-100/month for cash flow tools like Float or 
QuickBooks.

The Solution:
A free, Ashtabula-focused cash flow tracking tool with:
• Zero learning curve (no accounting background needed)
• Built-in awareness of our tourism seasonality
• One-click reports for RLF and SBA loan applications
• Local context and support

The Ask:
Would the Growth Partnership consider endorsing this tool as a resource 
for local businesses? An endorsement would help with:
• Credibility and trust
• Distribution to your network
• Feedback from businesses you serve

I'm happy to present the concept in more detail or provide a demo when 
ready.

Thank you for considering this opportunity to strengthen our local 
business ecosystem.

Best regards,
[Michael's name/contact]
```

### Template C: Accountant/Bookkeeper Validation
```
Subject: Quick Question — Cash Flow Tool for Small Business Clients

Hi [Name],

I came across your firm while researching accounting services in Ashtabula 
County. I'm working on a community project and would value your professional 
opinion.

We're building a simple cash flow tracking tool for small businesses that 
can't afford full bookkeeping services. Think of it as a stepping stone — 
helps them stay organized until they're ready for professional services.

Quick question: Would a tool like this be helpful for your clients who 
aren't quite ready for full bookkeeping? Or would it create more work for 
you during tax season?

I'd love 5 minutes of your perspective if you're willing.

Thanks,
[Michael]
```

---

## 3. User Interview Targets

### Business Owner Recruitment
**Goal:** Interview 5-10 small business owners about current cash flow practices

**Recruitment Channels:**
1. **Facebook Groups:**
   - "Ashtabula County Business Network"
   - "Geneva-on-the-Lake Business Owners"
   - "Conneaut Small Business"

2. **Chamber Directories:**
   - Ashtabula Chamber member list
   - Geneva Area Chamber
   - Conneaut Area Chamber

3. **Physical Locations (GOTL Strip):**
   - Gift shops, restaurants, arcades
   - Ask: "Do you track cash flow? What do you use?"

**Interview Questions (15 min):**
1. How do you currently track income and expenses?
2. What tools do you use (spreadsheets, QuickBooks, nothing)?
3. What's the hardest part about managing cash flow?
4. Have you ever been surprised by a cash shortage?
5. Would a simple, free cash flow tool be useful?
6. What would it need to do for you to actually use it?

---

## 4. Technical Resource Procurement

### API Pricing Verification

| Service | Cost | Notes |
|---------|------|-------|
| **Plaid** | Free up to 100 auth tokens/mo, then $0.30/auth | Viable for free tier if limited |
| **Supabase** | Free tier: 500MB DB, 2GB bandwidth | Sufficient for MVP |
| **Firebase** | Spark plan: free limits generous | Alternative to Supabase |

### Decision
Start with **Firebase** (consistent with other projects) + manual entry only for MVP. Add Plaid at Pro tier ($9/mo) when user justifies the cost.

---

## 5. Data Sources to Acquire

| Data Need | Source | Status | Action |
|-----------|--------|--------|--------|
| Local business count by sector | Census Bureau/SBA | Pending | Download SBA small business profiles |
| Seasonal tourism patterns | Ashtabula Tourism Council | Pending | Email request for visitor data |
| RLF loan requirements | City of Ashtabula Economic Dev | Pending | Contact for reporting requirements |
| Industry cash flow benchmarks | SBDC Ohio | Pending | Request during partnership call |

---

## 6. Next Steps Checklist

- [ ] Send SBDC partnership email
- [ ] Send Growth Partnership endorsement email
- [ ] Contact 3 local accountants
- [ ] Post in 3 Facebook business groups requesting interviews
- [ ] Visit 5 GOTL businesses for quick feedback
- [ ] Download SBA small business profile for Ashtabula County
- [ ] Email Tourism Council for seasonal data
- [ ] Compile interview findings
- [ ] Proceed to Phase 3: SPEC.md

---

**Status:** ✅ Phase 2 Complete — Outreach materials ready for Michael's review/send
