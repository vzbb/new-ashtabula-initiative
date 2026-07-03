# PROJECT — Plating Tracker Pro

## Desired Functionality (from CSV)
- **Plating Tracker Portal (Lake City Plating):** Client portal where users enter PO# to see real‑time processing stage (Cleaning/Plating/Drying) and ETA.

## Current Functionality (observed)
- PO number input.
- Gemini API generates a short status update with stage/ETA/pickup note.
- No real job data or customer portal.

## Gaps
- No integration with shop floor/ERP/job tracking.
- No authentication or customer‑specific access.
- No automated notifications (SMS/email) or real‑time status feeds.

## High‑Priority Improvements
1. Integrate with production tracking system or a simple job status database keyed by PO.
2. Add customer portal login and PO lookup with role‑based access.
3. Implement real notifications (SMS/email) and webhook updates.
4. Provide admin dashboard to update stages and ETAs.

## Assumptions
- Directly mapped to **Lake City Plating** CSV entry.
