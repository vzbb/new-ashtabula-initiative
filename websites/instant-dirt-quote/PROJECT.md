# Project: Instant Dirt Quote

**Status:** 🟡 Phase 1 Complete (Research)  
**Category:** Construction / Contractor Tools  
**Last Updated:** 2026-02-19  

## Overview

Instant quote platform for bulk aggregate materials (gravel, topsoil, fill dirt, sand) in Ashtabula County. Think "Uber for dirt" but locally focused with real-time pricing.

## Problem

Contractors and homeowners waste hours calling suppliers for quotes, calculating material quantities, and coordinating deliveries. No local platform provides instant, transparent pricing.

## Solution

Web-based calculator + quote platform:
1. Enter project dimensions → automatic material calculation
2. Enter delivery address → instant delivery cost
3. View real-time quotes from multiple local suppliers
4. Order with one click

## Key Research Findings

### Local Suppliers Identified
- Bull Moose Aggregates & Trucking (Rome, OH)
- Simak Trucking & Excavating (North Kingsville)
- Valley City Supply (Ashtabula)
- Ashtabula Sand & Gravel Company

### Competitors
- Hello Gravel (national, mixed reviews)
- Gravel Monkey (reputation issues)
- Individual supplier phone/email (current state)

### Gap Confirmed
No local instant-quote platform exists for Ashtabula County specifically.

## Target Users

1. **Contractor Carl** - Needs fast quotes for bidding, volume pricing
2. **Homeowner Hannah** - DIY projects, needs education + transparency
3. **Landscaper Leo** - Same-day delivery, multiple job sites
4. **Property Manager Paula** - Recurring orders, invoicing needs

## Proposed Tech Stack

- Next.js + Tailwind + shadcn/ui
- Supabase (auth, database)
- Google Maps API (zones, distance)
- Stripe (payments)
- Twilio (SMS notifications)

## Revenue Model

**Phase 1:** Lead generation - charge suppliers per qualified lead ($5-15)
**Phase 2:** Supplier SaaS - $99/month for premium listings
**Phase 3:** Contractor Pro - $29/month for advanced features

## Next Steps

1. Contact Bull Moose & Simak for partnership discussions
2. Interview 3-5 local contractors
3. Map delivery zones for Ashtabula County
4. Validate calculator accuracy with real projects

## Links

- Full Research: [PHASE1-RESEARCH.md](./PHASE1-RESEARCH.md)
