---
name: nai-image
description: Generate an image file with one command using the agent image tool (.claude/bin/nai-image) — logos, icons, hero art, favicons, og images. Use during brandkit or implementation work when a needed asset does not exist yet. This is agent tooling, unrelated to the MVP runtime image API.
---

# Agent Image Capability

You can create image files. One command:

```bash
.claude/bin/nai-image --prompt "<what to draw>" --out <path> [--aspect 1:1]
```

It writes the image, writes `<path>.provenance.json` beside it (model, prompt,
date, cost), and prints what it did. Options: `--aspect` (`1:1`, `16:9`, `3:2`,
`1.91:1`), `--n` (candidates, 1–10), `--seed` (reuse to retry a near-miss),
`--ref <file-or-https-url>` (repeatable, for style continuity), `--background
transparent`, `--model`, `--dry-run`.

## This is not the MVP's image API

Separate things, deliberately:

- **This tool** — you, in the shell, making a file to commit. Agent tooling.
- **`/api/image` + `shared/api-client.js`** — the shipped MVP's runtime path for
  images a *user* generates in the browser. Governed by
  `SHARED_OPENROUTER_API.md`, key server-side.

Never wire MVP source to this script, and never put its key in browser code. If a
product feature needs images at runtime, that is the shared API's job, not this.

The tool reads `NAI_AGENT_IMAGE_KEY` if set, otherwise `OPENROUTER_API_KEY` from
the environment or the repo-root `.env`. Set `NAI_AGENT_IMAGE_KEY` to bill agent
image work to a separate key. Never paste a key into a command, script, commit, or
worker packet.

## How to use it well

- **A few candidates, not dozens.** Roughly $0.04 per image. Iterate on the prompt
  between calls; reuse `--seed` when a result is close.
- **Prompt shape:** subject, then style, then palette in the brandkit's actual hex
  values, then background, then composition. Example: *"Flat vector icon of a snow
  plow, single navy #1B3A5C shape on solid white, centered, generous margins, no
  gradient."*
- **Ask for no text.** Models mangle lettering — render wordmarks in HTML/SVG.
- **Look at the file** before you commit it. A 200 response is not a good image.
- **Downsize before committing.** The tool warns above ~400 KB. Icons should be
  tiny; a multi-megabyte hero is a defect.
- **Write only to packet-listed paths** (usually `branding_research/<asset>/` or
  the MVP's own assets directory). Never into another site's directory.
- Keep the `.provenance.json` sidecars — brandkit acceptance requires provenance,
  and an asset without it can be failed.

## If it fails

Report the exact message; don't improvise around it.

- `http 402 Insufficient credits` — the OpenRouter account needs topping up.
  Escalate to the orchestrator as a blocker. Do not switch providers or keys.
- `no API key found` — escalate; do not go hunting for keys in other files.
- Bad or off-brand result — that is a prompt problem, so refine the prompt rather
  than lowering the standard or shipping a placeholder.

## Integrity limits

Illustrative and abstract imagery is fine. Never generate photorealistic faces
presented as real staff or customers, fake photos of a real business's premises,
imitations of another company's logo, or imagery implying an endorsement,
certification, or partnership that does not exist. These MVPs are shown to real
buyers about their real businesses.
