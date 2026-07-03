# Research Stack

This repo uses a three-layer research stack for workers that need internet access:

1. native Codex/OpenAI web search for broad coverage
2. local `SearXNG` for metasearch and local augmentation
3. local `Crawl4AI` for full-page extraction, JS-heavy pages, screenshots, and structured capture

This mirrors the existing local deep-search skill at:

- `/home/tt/.openclaw/workspace/skills/deep-search/SKILL.md`

## Endpoints

### SearXNG

- `http://127.0.0.1:8085/search?q=<query>&format=json`

### Crawl4AI

- health: `http://127.0.0.1:11235/health`
- markdown extraction: `POST /md`
- HTML extraction: `POST /html`
- crawl: `POST /crawl`
- JS execution: `POST /execute_js`
- screenshot: `POST /screenshot`
- PDF: `POST /pdf`

## Role Guidance

- Research workers should use native Codex web search first, then SearXNG when a second search pass is useful, then Crawl4AI when they need deeper extraction.
- Asset workers should prefer official brand websites, use native Codex web search first, use SearXNG for discovery augmentation, and use Crawl4AI when an asset or page needs structured capture.
- Verification workers should stay headless and only use Crawl4AI or screenshots when a page needs deeper inspection.

## Rules

- Do not use a visible browser unless explicitly requested.
- Prefer official sources for logos, wordmarks, and brand facts.
- Keep extracted facts short, source-backed, and tied to the current target.
- Save durable findings in repo artifacts, not scattered notes.
