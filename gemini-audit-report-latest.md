# Gemini Dependency Audit Report
**Date:** 2026-07-04  
**Scope:** Full `/root/new-ashtabula-initiative/` codebase  
**Performed by:** Shaw (Engineering Lead, NAI)  

---

## Executive Summary

The NAI codebase has Gemini dependencies at four tiers of severity. **One site still uses the Google Gemini SDK directly (`zoning-clerk`)** — the critical security/architecture violation. Multiple sites have direct REST calls to `generativelanguage.googleapis.com`. The toolchain defaults to Gemini models via OpenRouter but can be trivially reconfigured.

---

## TIER 1 — CRITICAL: Direct Gemini SDK / API Usage (Active)

### 1. zoning-clerk (MOST CRITICAL)

| Aspect | Detail |
|--------|--------|
| **SDK** | `@google/generative-ai` ^0.24.1 in `package.json` |
| **Build** | `VITE_GEMINI_API_KEY=$GEMINI_API_KEY vite build` |
| **Files** | `src/pages/ChatAssistant.jsx` — uses `GoogleGenerativeAI` class directly |
| | `src/App.jsx` — `callGeminiAPI()` fetches `generativelanguage.googleapis.com` |
| | `src/lib/rag.js` — RAG embedding via `generativelanguage.googleapis.com` |
| **Env** | `VITE_GEMINI_API_KEY` consumed client-side |
| **Risk** | FULLY ACTIVE Gemini SDK usage. API key exposed client-side. |

### 2. rennick-market, site-ops-pro, cut-custom, ashtabula-fence, thomas-fence, trumbull-locker, terra-vantage, saybrook-zoning, roofquote, civic-insight-engine, parcelvisor

All have `@google/genai` or `@google/generative-ai` in package.json. Some (cut-custom, ashtabula-fence, etc.) inject `process.env.GEMINI_API_KEY` via `vite.config.ts`. Need per-site source verification.

---

## TIER 2 — HIGH: Direct REST calls to `generativelanguage.googleapis.com`

**38+ MVPs** have direct fetch calls to `generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent` in their `src/App.jsx` or `src/config/api.js` files. Most follow one of two patterns:
- `callGeminiAPI()` inline function in `App.jsx`
- `geminiService` wrapper object
- `config/api.js` with `GEMINI_API_URL` constant

4 sites also have Vite dev proxy configs targeting `generativelanguage.googleapis.com`.

---

## TIER 3 — MODERATE: OpenRouter Defaulting to Gemini Models

| Component | Default Model |
|-----------|---------------|
| `shared/api-client.js` | `google/gemini-2.5-flash-lite` |
| `nai_suite/analyze_sitemap_screenshots.py` | `google/gemini-3.1-flash-lite-preview` (fast), `google/gemini-3.1-pro-preview` (deep) |
| `nai_suite/nai_hub.py` | 3 Gemini model presets in UI datalist |

30 package.json files also have `VITE_GEMINI_API_KEY=$GEMINI_API_KEY` in build scripts.

---

## TIER 4 — LOW: Legacy / Archive / Documentation

Archive docs, old audit scripts (`full_audit_api.py`/`single_audit.py`), audit result files, screenshot analysis archives, node_modules SDK packages.

---

## REMOVAL / MIGRATION PLAN

### Phase 1: CRITICAL — Migrate Active Gemini SDK Sites (~1-2 days)
1. **zoning-clerk** — Full migration to OpenRouter: replace SDK calls, inline REST calls, and RAG embedding
2. **Verify 11 SDK-pinned sites** — check for actual source usage, remove `@google/genai` where vestigial

### Phase 2: HIGH — Migrate Direct REST Call Sites (~2-4 days)
Batch by pattern (callGeminiAPI, geminiService, config/api.js, Vite proxies). Use `shared/api-client.js` as replacement.

### Phase 3: MODERATE — Change OpenRouter Default Models (< 1 hour)
Update `shared/api-client.js` DEFAULT_MODEL and toolchain model defaults to non-Google models.

### Phase 4: LOW — Housekeeping (< 1 hour)
Archive old scripts, clean audit_results/, update docs.

---

## Key Metrics

| Category | Count |
|----------|-------|
| Sites with actively used Gemini SDK | 1 (zoning-clerk) |
| Sites with installed but unverified Gemini SDK | 11 |
| Sites with direct REST calls to Gemini API | 38+ |
| Sites with VITE_GEMINI_API_KEY in build scripts | 30 |
| OpenRouter-defaulted-to-Gemini components | 3 |

---

Full report with complete file-level detail:  
`kanban/boards/nai/workspaces/t_0a5379d3/gemini-audit-report-2026-07-04.md`
