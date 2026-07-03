# Saybrook Zoning RAG Verification

Date: 2026-03-27

## Scope

Verify the Saybrook zoning query path as far as possible from the repo side:

- query webhook: `https://flow.noirsys.com/webhook/saybrook-zoning-query`
- stack: local `Ollama` + local `Qdrant` + `n8n`
- corpus: Saybrook draft zoning PDF already ingested into `saybrook_zoning_20260326`

## What Was Checked

- Query workflow contract in [`n8n/saybrook-zoning-query.workflow.json`](../n8n/saybrook-zoning-query.workflow.json)
- Frontend RAG helper contract in [`websites/saybrook-zoning/src/lib/rag.js`](../websites/saybrook-zoning/src/lib/rag.js)
- Request intake schema/docs in [`n8n/SAYBROOK_ZONING_REQUEST_FLOW.md`](../n8n/SAYBROOK_ZONING_REQUEST_FLOW.md)
- SQLite demo store schema in [`data/saybrook-zoning-requests.sql`](../data/saybrook-zoning-requests.sql)

## Prompt Sweep Attempted

Test prompts used:

- `What setback rules apply to a detached garage in Saybrook Township?`
- `Do I need a permit or zoning review for a backyard shed?`
- `Can I build a deck or addition near the property line?`
- `Do I need a variance for a corner lot fence?`

Failure-handling probe:

- empty `question` payload

## Result

Repo-side POST attempts to the live query webhook were blocked before the workflow could answer.

Observed failure:

- Cloudflare `1010` access denied
- `browser_signature_banned`
- response category: access denied

That means the issue is outside the workflow itself. From this shell, the endpoint is not currently callable because the edge/access layer blocks the request signature.

## What Still Looks Good

- The repo-side query workflow shape is sane:
  - normalize input
  - embed with Ollama
  - search Qdrant
  - build grounded prompt
  - generate answer
  - format response
- Request intake is aligned with the lightweight SQLite demo path.
- The Saybrook app is wired to a clean ask-first, then formalize flow.

## What Breaks

- Direct shell access to the live query webhook is blocked by Cloudflare access policy.
- Because of that, this verification pass could not observe:
  - live answer text
  - live citations
  - contextCount / mode response behavior

## Tight Next Fix

Provide one of these so the RAG query path can be verified end-to-end:

- a non-blocked test URL for the webhook, or
- a service-to-service bypass token / allowlist, or
- a browser-authenticated test session that can exercise the webhook

## Verification Checklist

- [x] Query workflow contract reviewed
- [x] Frontend request/query contract reviewed
- [x] Realistic zoning prompts prepared
- [x] Failure probe attempted
- [x] Cloudflare block captured cleanly
- [ ] Live webhook returns answer payload from repo-side test
- [ ] Citations confirmed from live response
- [ ] Empty-question failure behavior confirmed from live response
