# PROJECT — Service Scheduler Bot (SMS)

## Desired Functionality (from CSV)
- **Service Scheduler Bot (Albert’s Automotive):** SMS agent that books appointments, confirms times, and sends “car is ready” notifications.

## Current Functionality (observed)
- Inputs for vehicle and issue.
- Gemini API drafts a concise SMS reply with two proposed time windows.
- No SMS integration or booking system.

## Gaps
- No live calendar/slot availability or booking confirmation.
- No customer record creation or reminders.
- No SMS gateway integration.

## High‑Priority Improvements
1. Integrate with scheduling calendar (or build a simple slot database).
2. Add Twilio (or similar) SMS sending/receiving + conversation state.
3. Capture customer contact details and vehicle info in a CRM table.
4. Add automated reminders and “car ready” notifications.

## Assumptions
- Directly mapped to **Albert’s Automotive** CSV entry.
