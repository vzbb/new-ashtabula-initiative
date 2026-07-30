---
name: nai-firecrawl-research
description: Use the local self-hosted Firecrawl instance (127.0.0.1:3002, no auth) for web search, page scraping to markdown, and link mapping during NAI research and brandkit work. Use whenever an assignment needs current external facts, buyer or competitor pages, county/permit sources, or citable sources for lead_research_json.
---

# Local Firecrawl for NAI Research

A self-hosted Firecrawl runs on this machine as `ai-stack-firecrawl-api-1` with a
companion playwright-service, so JavaScript-rendered pages work. All facts below
were verified against the running instance.

- Base URL: `http://localhost:3002` (also `127.0.0.1:3002`)
- **No authentication** — the deployment sets `USE_DB_AUTHENTICATION=false`. If a
  client library demands a key, the house convention is the literal string
  `local` (`FIRECRAWL_API_KEY=local`).
- `/v1/...` and `/v2/...` both respond. Prefer `v1` unless you need a v2 feature.
- It is local: no per-call vendor cost, but it shares this machine's CPU and
  network with everything else. Scrape what the assignment needs, not a whole site.

## Search — start here

Returns real web results (url, title, description). This is usually the fastest
way to find primary sources for a buyer or a county process.

```bash
curl -s -m 60 -X POST http://localhost:3002/v1/search \
  -H 'Content-Type: application/json' \
  -d '{"query":"Ashtabula County Ohio building permit application process","limit":5}'
```

## Scrape a page to markdown

```bash
curl -s -m 90 -X POST http://localhost:3002/v1/scrape \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://example.gov/permits","formats":["markdown"]}'
```

The response carries `data.markdown` plus `data.metadata` with `title`,
`sourceURL`, `url` (post-redirect), `statusCode`, and `contentType`. Record
`sourceURL` and `statusCode` — a 200 with an empty body is a render failure, not
a fact, and a 403/404 means you have no source.

## Map a site's links

```bash
curl -s -m 60 -X POST http://localhost:3002/v1/map \
  -H 'Content-Type: application/json' -d '{"url":"https://example.gov"}'
```

Good for finding the one page that actually holds the fee schedule or form.
`/v1/crawl` exists too (`{"url":...,"limit":N}`, returns a job id you poll), but
prefer search → map → targeted scrape; crawling a county site to find one number
is waste.

## What does NOT work here

**Do not use the LLM-backed formats.** `formats:["json"]`, `jsonOptions`, and
`/v1/extract` fail on this instance — `OPENAI_API_KEY` is intentionally unset in
`/opt/firecrawl/.env`, so the extraction path errors out (verified: returns
`success:false, UNKNOWN_ERROR`).

Instead: scrape to markdown, then do the structuring yourself. If you need model
help turning a messy page into structured fields, use the NAI shared AI backend
(OpenRouter) rather than trying to enable Firecrawl's extractor — see
`nai-media-generation` for the direct-call pattern, and never enable a new
provider key inside `/opt/firecrawl` from a worker assignment.

## Research discipline

- **Primary sources first.** The county's own page, the buyer's own site, the
  actual permit PDF, the state statute. Yelp and directory aggregators are a lead
  to the primary source, not the citation.
- **Cite what you actually fetched.** Every entry in `sources` should be a URL you
  scraped or searched, with the retrieval date. Never cite a page you did not
  open; never let a search snippet become a claim about a document you never read.
- **Failed fetch is a finding.** If the county site is dead or blocks scraping,
  record that — it is often itself the sales insight — and say the fact is
  unverified. Missing research is honest; invented research is a `fail`.
- **Keep the repo clean.** Raw markdown dumps do not belong in the repository
  unless the packet lists an evidence path for them. Put the distilled facts in
  `lead_research_json/<canonical-route-slug>.json` and cite the URLs.
- **Boundaries still apply.** Do not scrape or contact prospects' contact forms,
  do not submit anything, and do not use Firecrawl to reach internal services
  (n8n, the proxy, localhost apps). Outreach belongs to Hermes at the Pitch gate.

## Quick check that it is up

```bash
curl -s -m 10 http://localhost:3002/     # -> {"message":"Firecrawl API",...}
```

If that fails, report it as a blocker with the exact error. Do not start the
container, edit `/opt/firecrawl`, or substitute a different scraping service from
inside a worker assignment.
