# SPEC — Eligibility Screener MVP

## Overview
The Eligibility Screener is a mobile-first web application designed to help Ashtabula County residents quickly determine which social service programs they might qualify for. It provides a simple, anonymous "wizard" interface and generates a personalized results page with next steps and document checklists.

## Technical Stack
- **Frontend:** React (Vite)
- **Styling:** Vanilla CSS
- **Logic:** Client-side deterministic eligibility rules + Gemini AI for personalized guidance
- **Persistence:** LocalStorage (for session state)

## User Flow
1. **Landing:** Overview of the tool, privacy assurance (anonymous).
2. **Step 1: Household Basics:** Household size, Zip code (to verify Ashtabula residency).
3. **Step 2: Income:** Monthly or Annual gross income.
4. **Step 3: Needs & Circumstances:** Checkboxes for needs (Food, Utilities, etc.) and circumstances (Pregnant, Senior, Disabled, etc.).
5. **Results:**
   - List of likely eligible programs.
   - Summary of benefits.
   - AI-generated "Next Steps" advice.
   - Document checklist generator.
   - Links to official application portals.

## Eligibility Logic (2025 Guidelines)
- **Base FPL (100%):** $15,060 + ($5,380 per additional person)
- **SNAP:** Income ≤ 130% FPL
- **Medicaid:** Income ≤ 138% FPL OR Disabled
- **HEAP/PIPP:** Income ≤ 150% FPL
- **WIC:** Income ≤ 185% FPL AND (Pregnant OR Child < 5)
- **OWF:** Income ≤ 50% FPL AND Child in household
- **Senior Meals:** Age 60+

## Program Data
| Program | Provider | Link | Key Documents |
|---------|----------|------|---------------|
| SNAP | ACDJFS | [Apply](https://ssp.benefits.ohio.gov) | ID, Proof of Income, SSN |
| Medicaid | ACDJFS | [Apply](https://ssp.benefits.ohio.gov) | ID, Proof of Income, SSN |
| HEAP/PIPP | ACCAA | [Apply](https://accaa.org) | Utility Bill, Proof of Income |
| WIC | Local WIC | [Info](https://www.acdjfs.org) | Proof of Identity, Proof of Residency |

## AI Integration (Gemini 2.5 Flash)
- **Role:** Summarize results and provide a friendly, encouraging explanation of next steps.
- **Input:** User's situation + list of eligible programs.
- **Output:** Concise (max 150 words) "Coach" response.

## Roadmap to MVP Completion
- [ ] Implement Multi-step Wizard UI.
- [ ] Implement Eligibility Engine.
- [ ] Implement Document Checklist logic.
- [ ] Integrate Gemini 2.5 Flash for personalized summaries.
- [ ] Polish UI with professional "Community Service" aesthetic.
- [ ] Ensure mobile responsiveness.
