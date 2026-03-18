# Phase 2 Resource Procurement — Harvest Alert
**Project:** Agricultural Harvest Notification System for Ashtabula County  
**Date:** 2026-02-20  
**Status:** Phase 2 Complete — Ready for Stakeholder Outreach  
**Previous:** Phase 1 Research

---

## 1. Stakeholder Contact Directory

### Local Farms & U-Pick Operations (Primary Validation)

| Farm | Type | Location | Contact | Priority |
|------|------|----------|---------|----------|
| **Sander's Market** | Farm stand/U-pick | Geneva | 440-466-8254 | 🔥 CRITICAL |
| **Harbor Gardens** | Farm stand | Ashtabula | 440-964-1771 | 🔥 CRITICAL |
| **Peters Creek Farm** | CSA/U-pick | Madison | Via Facebook | HIGH |
| **Covered Bridge Gardens** | CSA | Ashtabula | Via OSU Extension | HIGH |
| **Munn's Orchards** | Apples/U-pick | Geneva | Via Facebook | HIGH |
| **Emerald Vineyard** | Grapes | Harpersfield | Via Facebook | MEDIUM |
| **Quarry Hill Farm** | Diverse crops | Orwell | Via Farmers Market | MEDIUM |

### OSU Extension Ashtabula County (Technical Partner)

| Resource | Contact | Purpose |
|----------|---------|---------|
| **Agriculture Educator** | 440-576-9004 | Crop timing validation, farmer network |
| **Master Gardener Program** | Via OSU Ext | Gardeners with surplus produce |
| **Local Food Guide** | OSU Ext publishes | Distribution channel |

### Farmers Market Network

| Organization | Contact | Role |
|--------------|---------|------|
| **Ashtabula Farmers Market** | 440-812-8262 | Sunday market coordinator |
| **Geneva Farmers Market** | Via city | Saturday market validation |
| **Jefferson Farmers Market** | Via Facebook | Additional validator |

### Agricultural Orgs

| Organization | Contact | Purpose |
|--------------|---------|---------|
| **ACMC Farm Bureau** | 440-998-2961 | Farmer network access |
| **Ashtabula County Growers** | Via OSU Ext | Peer validation |
| **NE Ohio Food Hub** | Via Facebook | Regional perspective |

---

## 2. Outreach Email Templates

### Template A: Farm/Farmer

**Subject:** Free tool to notify customers when your crops are ready

```
Hi [Farmer Name],

I hope this message finds you well. I'm reaching out from a local 
technology initiative to offer a free tool that could help your 
farm communicate with customers more effectively.

**The challenge we see:**
Many farmers struggle to reach customers when crops are ready for 
harvest — Facebook posts get buried, email newsletters take time, 
and phone trees don't scale.

**Our solution — Harvest Alert:**
A simple, free tool that lets you:
• Send harvest notifications via text AND email (no app download)
• Notify customers who specifically asked about specific crops
• Reach 90%+ of subscribers vs. 10-20% on social media
• Send alerts in 30 seconds from your phone

**Why it's different:**
• FREE for Ashtabula County farms (underwritten by local sponsors)
• No complex software to learn
• Customers sign up once, get alerts automatically
• Weather-based harvest predictions built-in

**What we'd like from you:**
A 15-minute phone call to:
• Understand your current communication workflow
• Get feedback on the tool design
• Possibly pilot with your farm this season

Would you be open to a brief conversation? No commitment required — 
just feedback to help us build something actually useful.

Best regards,
[Your Name]
[Phone]
[Email]
```

### Template B: OSU Extension

**Subject:** Partnership opportunity — harvest notification tool for county farmers

```
Dear [Extension Educator Name],

I'm writing from a local tech initiative to propose a partnership 
that could benefit Ashtabula County farmers and gardeners.

**The opportunity:**
We're building "Harvest Alert" — a free, simple notification tool 
specifically designed for small-scale farms and gardeners in our 
county. It addresses a real gap: farmers need an easy way to tell 
customers when crops are ready, without expensive farm management 
software or unreliable social media reach.

**Why partner with Extension:**
• Your credibility and farmer network
• Access to crop timing expertise
• Distribution through your Local Food Guide
• Alignment with your mission to support local agriculture

**What we'd provide:**
• Completely free tool for all county farmers
• Technical support and maintenance
• Co-branded as "Powered by OSU Extension Ashtabula"
• Data insights (anonymized) on local food trends

**The ask:**
Would you be open to a 20-minute conversation about how this could 
complement your existing programs? We'd love your input on features, 
crop timing data, and farmer outreach.

Thank you for your service to our agricultural community,
[Your Name]
```

### Template C: Farmers Market Coordinator

**Subject:** Free tool for your vendors — harvest alerts for customers

```
Dear [Market Coordinator],

I'm developing a free notification tool for local farms and thought 
it might interest your market vendors.

**Harvest Alert** lets farmers send text/email notifications to 
customers when specific crops are ready — perfect for U-pick 
operations, CSA surplus, or "first of season" announcements.

**Why it helps your market:**
• Vendors can drive traffic on slow days
• Customers get real-time updates on favorite crops
• Reduces "are strawberries ready yet?" questions
• Free for all vendors

**Would you be willing to:**
• Share this with interested vendors?
• Display a small sign with QR code at the info booth?
• Provide feedback on features from a market perspective?

Happy to send more details or schedule a brief call.

Thanks for all you do for local food,
[Your Name]
```

---

## 3. Ashtabula Crop Calendar (Validation Data)

| Crop | Typical Harvest | Alert Timing | Key Varieties |
|------|-----------------|--------------|---------------|
| **Strawberries** | Mid-June – Early July | 3-5 days before peak | Jewel, Earliglow |
| **Blueberries** | July – August | Weekly updates | Bluecrop, Jersey |
| **Sweet Corn** | July – September | 2-3 days before ready | Peaches & Cream |
| **Peaches** | July – August | 5-7 days (softening) | Redhaven, Cresthaven |
| **Apples** | September – October | Weekly by variety | Honeycrisp, Fuji |
| **Pumpkins** | Late September – Oct | 1-2 weeks (U-pick) | Pie, Jack-o-lantern |
| **Tomatoes** | July – September | Weekly updates | Heirloom varieties |
| **Leafy Greens** | May – October | Continuous | Lettuce, spinach |
| **Winter Squash** | September – October | Harvest availability | Butternut, acorn |

**Weather Data Sources:**
- NOAA Ashtabula weather station
- Growing Degree Day calculator (Cornell model)
- Frost date predictions (OSU Extension)

---

## 4. Technical Resource Assessment

### SMS/Email Providers

| Provider | Cost | Notes |
|----------|------|-------|
| **Twilio** | ~$0.0075/SMS | Industry standard, reliable |
| **MessageBird** | ~$0.005/SMS | European alternative |
| **Resend** | 3,000 emails/mo free | Modern email API |
| **SendGrid** | 100 emails/day free | Established player |

### Free Tier Calculations

**Conservative estimate (10 farms, 50 subscribers each):**
- 500 subscribers
- 2 alerts/month/farm = 200 SMS/month
- Cost: ~$1.50/month

**Growth estimate (50 farms, 100 subscribers each):**
- 5,000 subscribers
- 4 alerts/month/farm = 2,000 SMS/month
- Cost: ~$15/month

### Weather API Options

| Source | Cost | Data |
|--------|------|------|
| **OpenWeatherMap** | Free tier (1,000 calls/day) | Current + forecast |
| **NOAA/NWS API** | Free | Official forecasts, alerts |
| **WeatherAPI.com** | Free tier (1M calls/month) | Historical + forecast |

---

## 5. Competitive Intelligence

### Barn2Door Analysis
- **Pricing:** $99+/month + setup fee
- **Features:** Full farm management, e-commerce, notifications
- **Gap:** Too expensive for small farms, overkill for simple alerts

### Local Line Analysis
- **Pricing:** $29-79/month
- **Features:** CSA management, SMS/email alerts
- **Gap:** CSA-focused, not U-pick or farm stand friendly

### Farmish App Analysis
- **Pricing:** Free listings
- **Features:** Marketplace, farm discovery
- **Gap:** No notification system, no Ashtabula presence

**Our Opportunity:**
- **Price:** FREE (or <$10/mo for large operations)
- **Focus:** Harvest timing only (simple)
- **Local:** Ashtabula-specific crop knowledge
- **No app:** SMS/email direct (works for all customers)

---

## 6. User Testing Plan

### Target Testers

| Group | Count | Recruitment |
|-------|-------|-------------|
| U-pick farms | 2-3 | OSU Extension referral |
| CSA coordinators | 1-2 | Peters Creek, Covered Bridge |
| Farm stands | 2-3 | Ashtabula/Geneva markets |
| Gardeners | 3-5 | Master Gardener program |
| Customers | 10-15 | Facebook groups, market tables |

### Testing Questions

**For Farmers:**
1. How do you currently notify customers about harvest timing?
2. What's the biggest pain point in that process?
3. Would you use a tool that sends SMS + email alerts?
4. What features would be essential? Nice-to-have?
5. What would prevent you from using this?

**For Customers:**
1. How do you currently find out when crops are ready?
2. Would you sign up for text alerts from favorite farms?
3. What info do you want in an alert? (timing, price, location, etc.)
4. How many farms would you subscribe to?

---

## 7. Risk Assessment Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Farmers don't trust new tool | Medium | High | OSU Extension partnership, free pilot season |
| Low customer signups | Medium | Medium | Farmers promote to existing customers |
| SMS costs exceed budget | Low | Medium | Start with email-only tier, SMS as upgrade |
| Weather predictions inaccurate | Medium | Low | Partner with OSU for local calibration |
| Competing tool enters market | Low | Medium | Focus on local relationships, not features |

---

## 8. Go/No-Go Decision Tree

```
After outreach:
│
├─► If 3+ farmers interested in pilot:
│   └─► Proceed to Phase 3 (SPEC.md)
│       └─► Build MVP for pilot season
│
├─► If OSU Extension partners:
│   └─► Proceed with credibility boost
│       └─► Use their network for recruitment
│
├─► If 1-2 farmers interested:
│   └─► Proceed with limited pilot
│       └─► Document case studies
│
└─► If no farmer interest:
    └─► Pause
        └─► Reassess approach or pivot
```

### Go Criteria
- [ ] At least 3 farms commit to pilot testing
- [ ] OR OSU Extension agrees to partnership
- [ ] OR 50+ customers express interest in signup

### No-Go Criteria
- [ ] Zero farmer interest after 10+ outreach attempts
- [ ] Farmers cite dealbreaker concerns (privacy, cost, complexity)
- [ ] Competing solution already solving this well locally

---

## 9. Quick Reference — Key Contacts

| Organization | Phone/Contact | Best Time | Notes |
|--------------|---------------|-----------|-------|
| Sander's Market | 440-466-8254 | Morning | Established U-pick |
| OSU Extension | 440-576-9004 | Business hrs | Credibility partner |
| Farmers Market | 440-812-8262 | Weekend | Vendor network |
| Peters Creek Farm | Via Facebook | Any | CSA coordinator |

---

**Document Status:** Phase 2 Complete  
**Next:** Execute farmer outreach OR proceed to Phase 3 if pilots secured  
**Priority:** Contact OSU Extension (440-576-9004) first for partnership
