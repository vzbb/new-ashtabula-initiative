# PROJECT — ClientStream Optimizer (Eligibility Pro)

## Desired Functionality (from CSV)
- **ClientStream Optimizer (ACCAA):** AI-powered pre‑screening tool that verifies client qualification across 11+ aid programs via a fast web quiz, cutting repetitive calls by ~60% and routing only approved applicants. 

## Current Functionality (observed)
- Single‑page UI with inputs for household size, monthly income, utilities responsibility, and primary need.
- Calls Gemini API to return a short “likely eligibility + 3 suggested programs” response.
- No persistence, intake handoff, or real program data.

## Gaps
- No real eligibility rules, program database, or multi‑program screening logic.
- No intake workflow, case creation, or staff dashboard.
- No privacy/consent flow, HIPAA disclaimers, or data retention policy.
- No audit trail or program eligibility evidence.

## High‑Priority Improvements
1. Implement a structured eligibility rules engine and authoritative program dataset for ACCAA (11+ programs).
2. Expand the questionnaire to capture required eligibility fields (household composition, income sources, residency, etc.).
3. Add intake handoff: create a case record, route to staff, and capture client contact info with consent.
4. Add privacy/consent notice + data handling policies; log eligibility reasoning for auditability.

## Assumptions
- Assumes this “Pro” version corresponds to **ClientStream Optimizer** entry in CSV.
