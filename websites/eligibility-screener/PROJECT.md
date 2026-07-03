# PROJECT — Eligibility Screener

## Desired Functionality (from CSV)
- **Eligibility Screener:** Fast, anonymous web quiz that tells users if they likely qualify for HEAP or Food Aid.

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
- Mapped to **Eligibility Screener** CSV entry.
