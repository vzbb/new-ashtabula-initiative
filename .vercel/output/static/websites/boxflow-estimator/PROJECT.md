# PROJECT — BoxFlow Estimator

## Desired Functionality (from CSV)
- **Box‑Builder Bot / BoxFlow Estimator (Northeast Box Co.):** Interface to input dimensions/material and receive instant AI‑estimated volume/price range and lead time.

## Current Functionality (observed)
- Inputs for length, width, height, quantity.
- Gemini API generates a quote summary with price range and lead time.
- No material selection, pricing rules, or CRM handoff.

## Gaps
- No real pricing model, material options, or constraints.
- No file upload for specs or customer details.
- No quote storage, follow‑up, or sales pipeline integration.

## High‑Priority Improvements
1. Implement real pricing logic (materials, coatings, printing, setup fees).
2. Add material/finish options and validation for dimensional constraints.
3. Capture customer info and save quotes to CRM/ERP.
4. Provide downloadable quote PDF and sales follow‑up triggers.

## Assumptions
- Mapped to **Northeast Box Co.** CSV entry.
