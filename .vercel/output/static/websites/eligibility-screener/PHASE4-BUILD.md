# Phase 4 Build — Eligibility Screener MVP

## Implementation Details

### 1. Wizard Interface
- **Step-by-step flow:** Prevents user overwhelm by breaking down the intake process into 4 manageable steps.
- **State Management:** Uses React `useState` to track data across steps.
- **Validation:** Basic numeric and presence validation for household size and income.

### 2. Eligibility Engine
- **Deterministic Rules:** Implemented the 2025 FPL guidelines directly in code to ensure accuracy.
- **Dynamic Thresholds:** Calculations adjust based on household size ($15,060 + $5,380 per additional person).
- **Program Coverage:**
  - SNAP (130% FPL)
  - Medicaid (138% FPL or Disabled)
  - HEAP/PIPP (150% FPL)
  - WIC (185% FPL + Categorical)
  - OWF (50% FPL + Categorical)
  - Senior Meals (Categorical)

### 3. AI Navigator (Gemini 2.5 Flash)
- **Personalized Context:** Passes user's specific circumstances and eligible programs to the AI.
- **Persona:** Acts as a "Warm Coach" to encourage the next steps.
- **Fallback Logic:** Included a fallback to Gemini 1.5 Flash if 2.5 is unavailable.

### 4. Document Checklist
- **Dynamic Generation:** Collects required documents from all eligible programs and presents a unique, de-duplicated list.
- **Interactive:** Users can check off items as they gather them.

### 5. Professional Styling
- **Mobile-First:** Clean layout optimized for smartphones.
- **Accessibility:** High contrast, clear fonts, and simple input fields.
- **Branding:** Aligned with the "New Ashtabula Initiative" and local service providers (ACCAA/ACDJFS).

## Verification
- [x] Build Success: `npm run build` verified.
- [x] Logic Verification: Tested with various household sizes and incomes.
- [x] UI/UX Check: Verified via local dev server.

## Next Steps for Phase 5 (Polish)
- [ ] Add Spanish translation.
- [ ] Add more granular Zip Code logic for specific city benefits.
- [ ] Implement "Save Progress" via encrypted URL parameters.
- [ ] Integrate with 211 API if partnership is finalized.
