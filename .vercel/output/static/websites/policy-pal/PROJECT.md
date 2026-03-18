# PROJECT — Policy Pal

## Desired Functionality (from CSV)
- **Policy Pal Chatbot:** 24/7 agent that answers coverage FAQs and starts the claims process.

## Current Functionality (observed)
- Single-page React UI with basic input fields.
- Uses Gemini API to generate a response based on user inputs.
- Output is shown on-screen only; no persistence or backend workflows.

## Gaps
- No real data integrations (calendars, inventories, codes, schedules, or databases).
- No persistence, intake routing, or audit trail.
- No operational integrations (SMS/email/Stripe/maps) tied to real systems.
- Limited validation, multi-step flows, or admin tooling.

## High‑Priority Improvements
1. Connect to authoritative data sources or operational systems relevant to the app’s purpose.
2. Add persistence (submissions, logs) and a basic admin review/queue workflow.
3. Implement appropriate integrations (SMS/email, payments, calendars, maps) as needed.
4. Expand intake fields with validation, guidance, and next‑step actions.

## Assumptions
- Mapped to **Policy Pal Chatbot** CSV entry.
