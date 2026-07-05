# Gemini Dependency Audit Report
**Date:** 2026-07-04
**Task:** t_2a0d605c
**Scope:** Full audit of `websites/` directory for Gemini API references, SDKs, and API keys
**Baseline:** `./nai scan` — 76/76 routes clean (from parent task t_035ae0c7)

---

## 1. SUMMARY

| Category | Count |
|----------|-------|
| Sites with Gemini SDK in package.json (`@google/genai` or `@google/generative-ai`) | 12 |
| Sites with DIRECT Gemini REST API calls in source code | 8 |
| Sites with hardcoded Gemini API keys in dist/ builds | 2+ (invest-ashtabula, rental-availability) |
| Sites using shared/ OpenRouter client (already migrated) | 3 |
| Sites with VITE_GEMINI_API_KEY in build scripts | 11 |
| Sites with GEMINI_API_KEY env var reference | 1 (site-ops-pro) |
| Shared code with Gemini model as default OpenRouter route | 1 (shared/api-client.js) |

---

## 2. SITES WITH DIRECT GEMINI REST API CALLS (NEED MIGRATION)

These sites call `generativelanguage.googleapis.com` directly instead of routing through OpenRouter.

### 2.1 adaptive-reuse-planner
- **Source:** `websites/adaptive-reuse-planner/src/App.jsx`
- **Lines:** 4, 32-35, 49, 66, 106, 109, 111, 128, 136, 150
- **Pattern:** Direct fetch to `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
- **Env var:** `VITE_GEMINI_API_KEY` (exposed client-side)
- **Build:** `VITE_GEMINI_API_KEY=$GEMINI_API_KEY vite build` in package.json
- **Pitch/PROJECT docs:** Reference Gemini API explicitly
- **Severity:** HIGH — full API URL in source, client-side key exposure

### 2.2 cashflow-tracker
- **Source:** `websites/cashflow-tracker/src/App.jsx` (line 4) and `dist/assets/index-CEsTBmq0.js`
- **Pattern:** Direct Gemini fetch via `uh()` function pointing to Gemini 1.5 Flash
- **Env var:** `VITE_GEMINI_API_KEY`
- **Build package.json:** `VITE_GEMINI_API_KEY=$GEMINI_API_KEY vite build`
- **Severity:** HIGH — direct Gemini call, exposed key pattern

### 2.3 invest-ashtabula
- **Source:** `websites/invest-ashtabula/dist/assets/` (hardcoded key visible in dist)
- **Pattern:** Direct fetch to Gemini with HARDCODED API KEY (`AIzaSy...pH1A`)
- **Build package.json:** `VITE_GEMINI_API_KEY=$GEMINI_API_KEY vite build`
- **Severity:** CRITICAL — hardcoded API key in dist, direct Gemini calls
- **Note:** The hardcoded key `AIzaSy...pH1A` is clearly visible in the minified dist

### 2.4 mytrip-planner-export
- **Source:** `websites/mytrip-planner-export/dist/assets/` (compiled bundle)
- **Pattern:** Direct Gemini config object with `GEMINI_API_KEY`, `GEMINI_API_URL`, `TIMEOUT_MS` constants, then direct fetch
- **Build package.json:** `VITE_GEMINI_API_KEY=$GEMINI_API_KEY vite build`
- **Source not found in src/ — may only exist in compiled dist**
- **Severity:** HIGH

### 2.5 permit-whisperer
- **Source:** `websites/permit-whisperer/assets/` (standalone JS, no Vite/React SPA)
- **Pattern:** Direct fetch to Gemini API (looks like it was pulled from another project)
- **No src/ directory —** code is in `assets/index-Bwr7_Tac.js` as a non-module script tag app
- **Severity:** HIGH

### 2.6 plating-tracker
- **Source:** `websites/plating-tracker/src/App.jsx` (lines 4, 57)
- **Pattern:** `const apiKey = import.meta.env.VITE_GEMINI_API_KEY;` — direct Gemini calls
- **Build package.json:** `VITE_GEMINI_API_KEY=$GEMINI_API_KEY vite build`
- **Severity:** HIGH

### 2.7 rental-availability
- **Source:** `websites/rental-availability/src/App.jsx` (line 79)
- **Pattern:** `callGeminiAPI` function calling Gemini 1.5 Flash directly via fetch
- **Hardcoded key in dist:** Redacted as `__OPENCLAW_REDACTED__` but was originally a hardcoded key
- **Severity:** HIGH

### 2.8 blueprint-analyzer
- **Source:** `websites/blueprint-analyzer/src/App.jsx` (lines 4, 57)
- **Pattern:** `const apiKey = import.meta.env.VITE_GEMINI_API_KEY;` — direct Gemini calls
- **Build package.json:** `VITE_GEMINI_API_KEY=$GEMINI_API_KEY vite build`
- **Doc references:** Multiple PHASE/BUILD docs reference Gemini Vision API
- **Severity:** HIGH

---

## 3. SITES WITH GEMINI SDK IN DEPENDENCIES (NEED VERIFICATION)

These have `@google/genai` or `@google/generative-ai` in `package.json`. Need to verify whether source code actually USES these SDKs or they're leftover from a partial migration.

### 3.1 `@google/genai` SDK (newer SDK, ^1.29.0)
| Site | Version | Notes |
|------|---------|-------|
| site-ops-pro | ^1.29.0 | Also references `process.env.GEMINI_API_KEY` in vite.config.ts — **active usage likely** |
| trumbull-locker | ^1.29.0 | In node_modules/ only — needs source check |
| thomas-fence | ^1.29.0 | In node_modules/ only — needs source check |
| roofquote | ^1.29.0 | Needs source check |
| terra-vantage | ^1.29.0 | Needs source check |
| parcelvisor | ^1.29.0 | Needs source check |
| rennick-market | ^1.29.0 | Needs source check |
| ashtabula-fence | ^1.29.0 | Needs source check |
| cut-custom | ^1.29.0 | Needs source check |

### 3.2 `@google/generative-ai` SDK (older SDK, ^0.24.1)
| Site | Version | Notes |
|------|---------|-------|
| saybrook-zoning | ^0.24.1 | Needs source check |
| zoning-clerk | ^0.24.1 | Needs source check |

### 3.3 `@google/genai` SDK (newer version)
| Site | Version | Notes |
|------|---------|-------|
| civic-insight-engine | ^1.43.0 | Newest version — likely active usage |

**Note:** site-ops-pro is the highest-priority to check as its `vite.config.ts` injects `process.env.GEMINI_API_KEY` into the bundle, confirming active Gemini SDK usage.

---

## 4. SITES ALREADY USING SHARED OPENROUTER CLIENT (MIGRATED)

These sites' `api-client.js` files re-export from `../../../shared/api-client.js`, which routes through OpenRouter:

| Site | File |
|------|------|
| grantgenius | `websites/grantgenius/src/api-client.js` |
| farm-stand-finder | `websites/farm-stand-finder/src/api-client.js` |
| hvac-tuneup | `websites/hvac-tuneup/src/api-client.js` |

**Status:** These are likely already migrated to OpenRouter. However, their components import `callGeminiAPI` (not `callOpenRouterAPI`) from the shared client. The shared client has `callGeminiAPI` as a backward-compatible alias — it actually calls OpenRouter under the hood.

---

## 5. SITES WITH VITE_GEMINI_API_KEY IN BUILD SCRIPTS

These sites have `VITE_GEMINI_API_KEY=$GEMINI_API_KEY` in their `package.json` build/dev scripts:

| Site | Build Script Pattern |
|------|---------------------|
| hvac-tuneup | `"build": "VITE_GEMINI_API_KEY=$GEMINI_API_KEY vite build"` |
| adaptive-reuse-planner | Same pattern |
| cashflow-tracker | Same pattern |
| mytrip-planner-export | Same pattern |
| aidflow-navigator | Same pattern |
| plating-tracker | Same pattern |
| license-wizard | Same pattern |
| invest-ashtabula | Same pattern |
| farm-stand-finder | Same pattern |
| blueprint-analyzer | Same pattern |
| instant-dirt-quote | Same pattern |

---

## 6. SHARED CODE

### `shared/api-client.js`
- **File:** `/root/new-ashtabula-initiative/shared/api-client.js`
- **Status:** Routes through OpenRouter correctly
- **Endpoint:** `https://openrouter.ai/api/v1/chat/completions`
- **Default model:** `google/gemini-2.5-flash-lite` (line 16)
- **Key env var:** `VITE_OPENROUTER_API_KEY` (line 91)
- **Alias:** `callGeminiAPI` (line 195) is a backward-compatible wrapper for `callOpenRouterAPI`
- **Note:** While the API routes through OpenRouter, the DEFAULT_MODEL is still `google/gemini-2.5-flash-lite` — this is a Gemini model accessed via OpenRouter. This is the correct pattern per NAI standing orders (provider-agnostic via OpenRouter), but the default could be changed to a non-Google model for true independence.

---

## 7. HARDCODED API KEYS (SECURITY ISSUE)

| Site | Location | Key Fragment | Status |
|------|----------|-------------|--------|
| invest-ashtabula | dist/ bundle | `AIzaSy...pH1A` | Visible in compiled dist — regenerate key |
| rental-availability | dist/ bundle | `__OPENCLAW_REDACTED__` | Was hardcoded, now redacted by tooling |

---

## 8. SITE-BY-SITE MIGRATION PRIORITY

### Tier 1 — CRITICAL: Hardcoded keys + direct Gemini calls
1. **invest-ashtabula** — hardcoded key, direct calls
2. **rental-availability** — was hardcoded key, direct calls

### Tier 2 — HIGH: Direct Gemini calls with env var
3. **adaptive-reuse-planner** — direct Gemini fetch in source
4. **cashflow-tracker** — direct Gemini fetch
5. **mytrip-planner-export** — direct Gemini in build
6. **permit-whisperer** — standalone direct Gemini
7. **plating-tracker** — direct Gemini in source
8. **blueprint-analyzer** — direct Gemini in source

### Tier 3 — MEDIUM: SDK dependency + possible active usage
9. **site-ops-pro** — has `@google/genai` + `GEMINI_API_KEY` in vite config (ACTIVE)
10. **civic-insight-engine** — has `@google/genai` ^1.43.0
11. **saybrook-zoning** — has `@google/generative-ai` ^0.24.1
12. **zoning-clerk** — has `@google/generative-ai` ^0.24.1

### Tier 4 — LOW: SDK in node_modules but may be unused (needs verification)
13. trumbull-locker
14. thomas-fence
15. roofquote
16. terra-vantage
17. parcelvisor
18. rennick-market
19. ashtabula-fence
20. cut-custom

### Tier 5 — ALREADY MIGRATED (verify only)
21. grantgenius — using shared OpenRouter client
22. farm-stand-finder — using shared OpenRouter client
23. hvac-tuneup — using shared OpenRouter client

---

## 9. SHARED CLIENT NOTE

`shared/api-client.js` (line 195):
```js
export const callGeminiAPI = callOpenRouterAPI;
```

The naming is misleading — `callGeminiAPI` is an alias for the OpenRouter call. Sites importing this function are actually calling OpenRouter. However, the DEFAULT_MODEL is `google/gemini-2.5-flash-lite` — this should remain as-is per NAI standing orders (OpenRouter for provider flexibility is the goal, not necessarily removing Gemini models).

---

## 10. RECOMMENDED NEXT STEPS

1. **Regenerate the invest-ashtabula API key** — hardcoded key is exposed
2. **Migrate Tier 2 sites** — replace direct `generativelanguage.googleapis.com` calls with `shared/api-client.js` OpenRouter calls
3. **Audit Tier 3-4 SDK sites** — check if `@google/genai` / `@google/generative-ai` is actually imported in source code
4. **Remove unused SDK packages** from Tier 4 sites if confirmed unused
5. **Change default model** in `shared/api-client.js` from `google/gemini-2.5-flash-lite` to a non-Google model if independence is desired
6. **Remove `VITE_GEMINI_API_KEY`** from build scripts after migration
