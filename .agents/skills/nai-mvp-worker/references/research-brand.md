# Research and Brand Gates

## Research

- Name the exact assigned target and current buyer problem.
- Prefer primary, current sources and record URLs or citations.
- Resolve contradictory historical facts instead of selecting the convenient
  version.
- Use the exact canonical `SITEMAP.json` route slug for both the filename and the
  top-level `slug` value. Website folder names, buyer names, and legacy aliases
  are not research identities.
- Write a non-empty JSON object at the packet-listed
  `lead_research_json/<slug>.json` path only when the research is complete enough
  to hand off. Do not create placeholder files; absence means unfinished.
- Include non-empty source or citation data using a clearly named field such as
  `sources`, `citations`, or `research_sources`.
- Run `./nai pipeline validate` after writing the artifact.
- Do not invent contact details, services, claims, prices, licenses, or history.

## Brandkit

- Read the accepted research evidence first.
- Create valid buyer-specific JSON at `brandkits/<slug>.json` and non-empty notes
  at `branding_research/<slug>/branding.md`.
- Name the assigned target in the brandkit or notes.
- Store sourced or generated assets only in the packet-listed brand directory.
- Record source, license, generation provenance, and intended use.
- Confirm every local path referenced by the brandkit exists and is non-empty.
- Never substitute a plausible logo or claim for an unverified one.

Return both brandkit and branding notes as evidence. The orchestrator performs acceptance.
