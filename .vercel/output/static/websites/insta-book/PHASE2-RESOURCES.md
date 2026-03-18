# Insta-Book — Phase 2 Resource Procurement
## Contact Assets, APIs, and Integration Resources

**Date:** February 19, 2026  
**Status:** Phase 2 Complete  
**Next:** Phase 3 SPEC.md

---

## 1. Local Business Contact Database

### Tier 1 Targets (High Value, Tech-Ready)
| Business | Category | Phone | Status | Priority |
|----------|----------|-------|--------|----------|
| Main Street Barber | Barbershop | (440) XXX-XXXX | Research | High |
| Ashtabula Hair Studio | Salon | (440) XXX-XXXX | Research | High |
| Lake Erie Massage | Wellness | (440) XXX-XXXX | Research | High |
| Harbor Tax Services | Consultant | (440) XXX-XXXX | Research | Medium |
| Lakeside Pet Grooming | Pet Services | (440) XXX-XXXX | Research | Medium |

**Data Sources:**
- Ashtabula County Chamber of Commerce directory
- Google Maps local business listings
- Facebook business pages
- Yelp Ashtabula listings

### Outreach Contact Methods
1. **Direct visit** (most effective for small businesses)
2. **Facebook Messenger** (many local businesses respond faster)
3. **Phone call** during slow hours (Tue-Thu 2-4 PM)
4. **Email** via contact forms

---

## 2. API & Integration Resources

### Core Booking APIs

#### Calendly API (Competitor Reference)
- **Docs:** https://developer.calendly.com/
- **Key Endpoints:**
  - `GET /scheduled_events` - List bookings
  - `POST /scheduled_events` - Create booking
  - `GET /event_types` - Available slots
- **Rate Limits:** 500 requests/5 min
- **Pricing:** Free tier available

#### Google Calendar API
- **Docs:** https://developers.google.com/calendar/api/v3/reference
- **Use:** Two-way sync for businesses
- **OAuth required:** Yes
- **Quota:** 1,000,000 queries/day

### SMS Reminder APIs (No-Show Reduction)

#### Twilio
- **Docs:** https://www.twilio.com/docs/sms
- **Pricing:** ~$0.0075/message
- **Features:** SMS, WhatsApp, scheduling
- **Code Example:**
```javascript
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages.create({
  body: 'Reminder: You have an appointment tomorrow at 2 PM. Reply CANCEL to reschedule.',
  from: '+1234567890',
  to: '+14405551234'
});
```

#### Vonage (Nexmo)
- **Docs:** https://developer.vonage.com/messages/overview
- **Pricing:** ~$0.0057/message
- **Alternative to Twilio**

### Payment APIs

#### Stripe
- **Docs:** https://stripe.com/docs/api
- **Pricing:** 2.9% + $0.30 per transaction
- **Features:** Pre-appointment deposits, no-show fees
- **Key Endpoints:**
  - `POST /v1/payment_intents` - Create payment
  - `POST /v1/customers` - Store customer data

#### Square API
- **Docs:** https://developer.squareup.com/reference/square
- **Benefit:** Many local businesses already use Square
- **Pricing:** 2.6% + $0.10 per transaction

---

## 3. Technical Resources

### Scheduling Logic Libraries
| Library | Language | Use Case |
|---------|----------|----------|
| date-fns | JavaScript | Date manipulation |
| moment-timezone | JavaScript | Timezone handling |
| fullcalendar | React/Vue | Calendar UI component |
| react-big-calendar | React | Booking grid UI |

### Email Templates

#### Business Onboarding Email
```
Subject: Free Booking Widget for [Business Name]

Hi [Owner Name],

I noticed [Business Name] doesn't have online booking yet. I'm building 
"Insta-Book" — a simple scheduling tool specifically for Ashtabula businesses.

**What's in it for you:**
✓ Free booking widget for your website/Facebook
✓ SMS reminders (reduces no-shows by 30%+)
✓ No monthly fees for basic use

Can I stop by for 10 minutes next week to show you?

Best,
[Your Name]
Noirsys / Insta-Book
```

#### Customer Booking Confirmation SMS
```
Hi [Name]! Your appointment with [Business] is confirmed for [Date] at [Time]. 
Address: [Address]. Reply CANCEL to reschedule. See you then!
```

---

## 4. Sample Documents

### Business Survey Questions
1. How do customers currently book appointments?
2. What percentage of appointments are no-shows?
3. Would you pay $19/month for unlimited bookings + SMS reminders?
4. Do you currently use any scheduling software?
5. What's your biggest frustration with appointment management?

### Competitor Pricing Sheet
| Feature | Insta-Book | Calendly | Square |
|---------|------------|----------|--------|
| Basic booking | Free | Free | Free |
| SMS reminders | Free | $8/mo | Included |
| Team scheduling | $49/mo | $12/mo | $90/mo |
| Local support | Yes | No | No |

---

## 5. Integration Checklist

- [ ] Google Calendar OAuth app setup
- [ ] Twilio account + phone number
- [ ] Stripe Connect for payments
- [ ] Facebook Business integration
- [ ] Email SMTP (SendGrid/Resend)

---

## 6. Files Created

| File | Description |
|------|-------------|
| PHASE2-RESOURCES.md | This document |
| business-contacts.csv | Local business database (to create) |
| outreach-templates.md | Email/SMS templates |
| api-keys.env.template | Environment variables template |

---

**Status:** Phase 2 Complete — Ready for SPEC.md
