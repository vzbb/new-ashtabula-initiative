---
name: nai-media-generation
description: Generate brand and site imagery (and structured text) by calling OpenRouter directly from the shell at authoring time, then commit the asset with provenance. Use for logos, icons, hero images, favicons, illustrative art, or og images during brandkit and implementation work. Never for runtime browser code, which must go through the same-origin shared proxy.
---

# Author-Time Media Generation (Direct OpenRouter)

## The distinction that governs everything here

| | Runtime (in the shipped MVP) | Authoring time (you, now, in the shell) |
| --- | --- | --- |
| Path | browser → `shared/api-client.js` → same-origin `/api/image` → proxy → OpenRouter | your shell → OpenRouter directly |
| Key | stays server-side, never in browser code | read from `.env` into your shell env, never printed or committed |
| Output | rendered in the page at runtime | a file committed into the repo as an asset |

**Never** add `VITE_OPENROUTER_API_KEY`, a key literal, or a direct provider call
to MVP source. If the product needs to generate images when a user clicks
something, that is the proxy's job. This skill is only for baking assets into the
repo before shipping.

## Load the key without exposing it

```bash
cd /root/new-ashtabula-initiative
set -a; eval "$(grep -h '^OPENROUTER_API_KEY=' .env | head -1)"; set +a
[ -n "$OPENROUTER_API_KEY" ] && echo "key loaded (not printed)"
```

Rules: never `echo` the value, never `cat .env`, never paste it into a script,
config, commit, or worker packet, and never pass it to a subagent. It also lives
in `.env.production` and `.env.vercel`; `.env` is the one to read.

## Verified image contract

```bash
curl -s -m 180 -X POST https://openrouter.ai/api/v1/images \
  -H "authorization: Bearer $OPENROUTER_API_KEY" \
  -H "content-type: application/json" \
  -H "http-referer: https://new-ashtabula-initiative.com" \
  -H "x-title: New Ashtabula Initiative" \
  -d '{
    "model": "google/gemini-2.5-flash-image",
    "prompt": "<see prompting below>",
    "n": 1,
    "output_format": "png",
    "aspect_ratio": "1:1"
  }' -o /tmp/gen.json
```

Also accepted: `size`, `resolution`, `quality`, `background`, `seed` (reproducible
retries), `output_compression`, `input_references` (up to 10 image URLs or data
URLs, for style or subject continuity), `provider`. The response is
`data[].b64_json` with `data[].media_type`; `usage.cost` reports the real spend.
These are the same fields `nai_suite/openrouter_proxy_function.js` sends upstream,
so anything valid here is valid through the proxy later.

Decode and verify — never trust a 200 alone:

```bash
python3 - <<'PY'
import json, base64, pathlib
d = json.load(open('/tmp/gen.json'))
img = d['data'][0]
raw = base64.b64decode(img['b64_json'])
out = pathlib.Path('branding_research/<asset>/logo.png')   # a packet-listed path
out.write_bytes(raw)
print(out, len(raw), 'bytes', img.get('media_type'), 'cost', d.get('usage', {}).get('cost'))
PY
```

Confirm the file is a real image (PNG magic `89504e47`), open it, and look at it
before committing.

## Cost discipline

A single 1:1 PNG from `google/gemini-2.5-flash-image` measured **$0.0387** (~1290
image tokens). That is cheap once and expensive by the hundred.

- Generate **1–3 candidates**, not twenty. Iterate on the *prompt* between calls.
- Reuse a `seed` when retrying a near-miss instead of rerolling blind.
- Record the spend in your handoff notes so the orchestrator sees it.

## Prompting for brand assets

- Name the concrete subject, then style, then palette using the brandkit's actual
  hex values, then background (`transparent`, `solid white`), then composition
  (`centered`, `generous margins`, `flat vector`, `no gradient`).
- **Ask for no text.** Image models mangle lettering. Render wordmarks and labels
  in HTML/SVG/CSS over or beside the generated art.
- Aspect ratios by use: logo/icon `1:1`, hero `16:9` or `3:2`, og image `1.91:1`.
- Favicons: generate at `1:1`, then downscale — do not ask for 32px art.
- Keep one visual language across an asset set; `input_references` with the first
  accepted asset holds style steady.

## Committing assets

- Write only to packet-listed paths (typically `branding_research/<asset>/` or the
  MVP's own `src/assets` / `public`). Never into another site's directory.
- Downsize before committing: a 2 MB hero is a defect. Target well under ~400 KB
  for heroes, far less for icons. PNG for logos/transparency, JPEG or WebP for
  photographic art.
- **Provenance is a brandkit gate requirement.** For every generated asset record
  the model, the exact prompt, the date, and the cost — in the brandkit notes or a
  `curation-guide.md` beside the assets. An asset with no provenance can be failed.

## Structured text and vision, same pattern

Chat/vision at authoring time (e.g. turning scraped markdown into structured
research fields) uses `POST https://openrouter.ai/api/v1/chat/completions` with
the same headers; house default `google/gemini-2.5-flash-lite`. Prefer a strict
`response_format` JSON schema over loose JSON mode, omit `max_tokens` unless the
task truly needs a cap, and keep display-only historical labels as strings.

For **speech**, do not improvise a direct call: the proxy wraps Gemini's PCM
output as browser-playable WAV and runs as a Node function with a 120s budget for
a reason. Long narration stays one coherent performance — never chunk it per
sentence to dodge a timeout. Route audio through the documented `/api/speech`
contract, and escalate if an authored audio asset is genuinely needed.

## Integrity limits

Illustrative and abstract imagery is fine. Do **not** generate: photorealistic
faces presented as real staff or customers, fake photographs of a real business's
premises, imitations of another company's logo or trade dress, or any image
implying a partnership, certification, or endorsement that does not exist. These
MVPs are shown to real buyers about their real businesses; manufactured evidence
is a hard fail, not a style question.
