# Phase 2: Resource Procurement — Auto Detail Booking

**MVP:** auto-detail-booking  
**Date:** 2026-02-18  
**Status:** Resources identified, ready for implementation

---

## 1. API Keys & Services

| Service | Use Case | Get Key At | Est. Cost |
|---------|----------|------------|-----------|
| **Stripe** | Payment processing | dashboard.stripe.com | 2.9% + $0.30/transaction |
| **Google Calendar API** | Availability sync | console.cloud.google.com | Free tier: 1M requests/day |
| **Twilio** | SMS reminders | twilio.com/try-twilio | ~$0.0075/SMS |
| **SendGrid** | Email confirmations | sendgrid.com | Free: 100 emails/day |
| **Google Maps Platform** | Address validation | console.cloud.google.com | $200 free monthly credit |

### Quick Start Commands
```bash
# Stripe CLI for testing
npm install -g stripe
stripe login

# Twilio CLI
npm install -g twilio-cli
```

---

## 2. Sample Data Sources

### Service Package Templates
```json
{
  "packages": [
    {
      "id": "exterior-wash",
      "name": "Exterior Wash",
      "duration": 60,
      "price": 35,
      "description": "Hand wash, dry, tire shine, window cleaning"
    },
    {
      "id": "interior-detail",
      "name": "Interior Detail",
      "duration": 120,
      "price": 85,
      "description": "Vacuum, steam clean, leather treatment, odor removal"
    },
    {
      "id": "full-detail",
      "name": "Full Detail",
      "duration": 240,
      "price": 175,
      "description": "Complete interior and exterior detailing"
    },
    {
      "id": "ceramic-coating",
      "name": "Ceramic Coating",
      "duration": 480,
      "price": 450,
      "description": "Paint correction + ceramic coating application"
    }
  ]
}
```

### Vehicle Size Categories
- Compact (sedan, coupe)
- Mid-size (SUV, small truck)
- Full-size (truck, van, large SUV)

---

## 3. Contact Templates

### Business Owner Onboarding Email
```
Subject: Your Auto Detail Booking Page is Ready

Hi [Name],

Your online booking system for [Business Name] is ready!

What you get:
✓ Online booking 24/7
✓ Automatic SMS/email confirmations
✓ Payment processing
✓ Simple dashboard

Setup takes 5 minutes: [link]

Questions? Reply to this email.

—
Noirsys AI / New Ashtabula Initiative
```

### Customer Booking Confirmation SMS
```
[Business Name]: Confirmed!
📅 [Date] at [Time]
🚗 [Service] for [Vehicle]
📍 [Address]

Need to reschedule? Call [phone] or reply CANCEL
```

---

## 4. Design Assets Needed

### Icons (Lucide React)
- `Car` — vehicle selector
- `Calendar` — date picker
- `Clock` — time slots
- `CreditCard` — payment
- `MapPin` — location (mobile)
- `Sparkles` — service quality
- `CheckCircle` — confirmation

### Color Palette Suggestion
- Primary: `#0066CC` (trust, cleanliness)
- Secondary: `#00AA66` (fresh, eco-friendly)
- Accent: `#FFD700` (premium, gold standard)
- Background: `#F8FAFC` (clean, light)
- Text: `#1E293B` (readable dark)

---

## 5. Legal/Compliance Templates

### Required Pages
- Terms of Service
- Privacy Policy
- Cancellation Policy
- Refund Policy

### Sample Cancellation Text
> Cancellations must be made at least 24 hours before appointment for full refund. Same-day cancellations subject to 50% fee. No-shows charged full amount.

---

## 6. Integration Checklist

- [ ] Stripe account created
- [ ] Google Cloud project setup
- [ ] Twilio account (optional, for SMS)
- [ ] SendGrid account (optional, for email)
- [ ] Test data populated
- [ ] Sample business profile created
- [ ] Legal templates drafted
