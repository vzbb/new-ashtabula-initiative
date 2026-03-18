# PROJECT — Civic Insight Engine

## Desired Functionality (from CSV)
- **Civic Insight Engine:** Automated video summarizer that turns long public meeting recordings into bulleted action items and press releases.

## Current Functionality (as of 2026-02-27)
- **AI Meeting Summarizer:** Functional Gemini 2.5 integration with structured JSON output, including bullet points, action items, narrative overviews, and auto-generated press releases.
- **Admin Control Center:** Multi-step "Engine" interface for clerks to upload, process, edit, and publish summaries. Includes a simulated OCR/PDF extraction workflow.
- **Public Dashboard:** Polished, resident-facing interface with searchable meeting history, upcoming calendars, and live activity feeds.
- **311 Issue Reporting:** Full map-integrated reporting system with category selection, status tracking, and admin-resident communication threads.
- **Transparency Tools:** Built-in Budget Explorer (Ohio Checkbook integration) and Property/Parcel Lookup with mock data for Ashtabula County.
- **Persistence:** Local-first persistence via Zustand, ensuring the demo state remains consistent across refreshes.
- **PWA Ready:** Modern, responsive design optimized for mobile "field use" (issue reporting).

## Gaps (Future Expansion)
- Real Firebase/Backend integration (currently using robust local storage simulation).
- Real PDF parsing (currently simulated; would require server-side `pdf-parse` or Gemini 1.5/2.5 native file processing).
- Live SMS/Email notifications (placeholders in UI).
- Authentication (currently simulated with a "Simulate Clerk Login" bypass).

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
- Mapped to **Civic Insight Engine** CSV entry.
