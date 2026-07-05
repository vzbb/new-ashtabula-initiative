# PROJECT — Blank Heating SMS Scheduler

## Desired Functionality
- **SMS Scheduler (Blank Heating Company Inc):** SMS agent that generates HVAC appointment confirmations, sends reminders, and drafts service follow-up texts for furnace, AC, and indoor air quality visits.

## Current Functionality (observed)
- Inputs for service type and phone number.
- OpenRouter (via callGeminiAPI wrapper) drafts a concise SMS confirmation with arrival window and prep note, under 160 characters.
- No SMS gateway integration.

## Gaps
- No live SMS sending/receiving.
- No customer record creation or automated reminders.
- No two-way conversation state.

## High‑Priority Improvements
1. Add Twilio (or similar) SMS gateway for actual message sending.
2. Add automated appointment reminders and follow-up texts.
3. Capture customer details and service history in a CRM table.
4. Add confirmation tracking and read receipts.

## Assumptions
- Directly mapped to **Blank Heating Company Inc** as target buyer.
- Branded with Blank Heating identity: Navy #1B2A4A, Blue #2563EB, Orange #f97316.
- HVAC-specific services: heating repair, AC service, system check-ups, free estimates, indoor air quality.

## Brand
- **Business:** Blank Heating Company Inc
- **Location:** Ashtabula, OH
- **Phone:** 440-969-1760
- **License:** OH LIC #25138 | NATE-certified | Three generations family-owned
