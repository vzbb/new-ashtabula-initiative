# saybrook-zoning -> Saybrook Township Zoning Office

## Brand / Display Name
- Brand: Saybrook Township Zoning Office
- Suggested display copy: `Saybrook Zoning Clerk`
- Suggested trust subtitle: `Draft-code guidance and request preparation for Saybrook Township`

## Positioning
- Township-specific zoning code assistant
- Retrieval-backed public utility for navigating the updated Saybrook zoning draft
- Strong early child-clone candidate from the `zoning` parent

## Why This Clone Matters
- Saybrook was already a strong target in the original zoning research.
- A newly obtained clean zoning draft PDF now makes jurisdiction-specific ingestion much easier.
- This turns the opportunity from a generic zoning workflow demo into a real, citation-backed modernization product for one township.

## Working Brand Cues
- Tone: official, procedural, calm, document-first, trustworthy
- Visual cue: restrained township-government styling, not generic SaaS
- UX cue: every important answer should point back to the draft zoning text with sections/citations
- UX flow cue: the product should feel like a compact civic intake surface
  where a resident can ask a few questions, get grounded answers, and then
  formalize a request without leaving the app
- Interaction cue: optional image uploads are useful, but should be framed as
  supporting materials for township review rather than as a flashy AI feature
- AI cue: the assistant should behave like a retrieval-backed township aide,
  not a general-purpose chatbot; every strong answer should feel grounded in
  the Saybrook corpus and ready to be turned into a staff-usable record
- Layout cue: dense, confident, form-forward, with very little wasted space
- Trust cue: lean on familiar civic signals like a posted draft date, township
  address, public-document language, and visible citations instead of flashy
  product polish
- Affiliation cue: the app should feel township-aware without claiming official
  endorsement or implying that submission equals official filing

## Practical UX / Visual Guidance
- Keep the top of the app compact: title, short trust line, source-draft note,
  then the first useful action.
- Treat the chat area like a guided question desk, not a conversational toy.
- Keep the formal request step looking like a review sheet or intake packet,
  not a marketing form.
- Optional image upload should be framed as supporting material for staff
  review: `Attach up to 2 site photos if helpful`.
- Use calm status labels such as:
  - `Draft-code answer`
  - `Source sections`
  - `Request draft`
  - `Ready for township review`
- Avoid giant heroes, decorative illustrations, or AI-themed flourishes.

## Useful Official / Public Cues
- Public site reference:
  - `saybrooktownship.org`
- Address cue from the township site:
  - `7247 Center Road`
- Planning update cue:
  - the Verdantas-hosted zoning draft and update materials
- Language cues:
  - township trustees
  - public review
  - zoning draft
  - zoning resolution
  - township staff review

## What The App Should Show
- A small source banner:
  - `Using the March 26, 2026 Saybrook Township zoning draft`
- A compact trust note:
  - `Answers are based on the posted draft and should be confirmed by township staff for official determinations.`
- Visible section/page citations on every substantive answer.
- A compact call-to-action after useful answers:
  - `Prepare a township-ready request draft`
- A final review state that feels like a civic packet, including:
  - resident contact info
  - property/project summary
  - AI-generated draft summary
  - cited source sections
  - optional uploaded images

## What To Avoid
- No invented township seals or fake official marks.
- No wording like `official permit approval`, `submitted to the township`, or
  `official determination` unless that is literally true in the backend.
- No over-designed, startup-style dashboards.
- No oversized empty hero areas or ornamental UI that gets in the way of the
  intake journey.

## Local / Institutional Context
- Saybrook Township has been actively updating its zoning framework.
- The modernization effort appears to have a real near-term deadline and public visibility.
- The local relationship context around Bob Brobst makes this more than a random cold outreach target, but the product should stand on its own regardless.

## Required Next Assets
- Official township logo or seal, if one is publicly used and reusable
- Official township favicon candidate, if exposed by the public site
- Any township color/branding guidance if it exists
- Public-document visuals from the newly posted zoning draft that can inform
  a trustworthy intake layout without implying formal township endorsement
- If no reliable official mark is available, prefer text-first civic branding
  and a simple document icon treatment over invented municipal imagery

## Source Document
- Primary zoning draft PDF:
  - `branding_research/saybrook-zoning/resources/zoning032626.pdf`
- Notes:
  - clean Adobe-generated PDF
  - tagged
  - 164 pages
  - highly suitable for chunking, embedding, indexing, and citation extraction

## Required Next Document Step
- Use the stored PDF above as the first retrieval corpus for the child clone.
- Keep `lead_research_json/saybrook-zoning.json` and `brandkits/saybrook-zoning.json` pointing at this path unless a newer official draft supersedes it.

## Recommended User Flow
1. User asks a plain-English zoning or permit question.
2. User can optionally attach 1-2 photos to clarify lot, structure, or project context.
3. Assistant answers using retrieved Saybrook zoning sections and visible citations.
4. Assistant explicitly states that it is offering draft-code guidance and that township staff make the official determination.
5. Assistant offers to formalize the interaction into a township-ready request draft.
6. User confirms or edits the AI-generated summary.
7. User provides contact details only at the end.
8. The structured record is sent to a township follow-up queue / database.

## Formalized Request Shape
- Required:
  - request type
  - applicant name
  - email or phone
  - property address
  - project stage
  - project summary
  - specific question
  - requested action
  - AI summary
  - source citations
  - retrieval context version
- Strongly recommended:
  - user-confirmed summary
  - confidence / ambiguity notes from the assistant when the code is not definitive
- Optional:
  - parcel number
  - zoning district if known
  - contractor/business name
  - timeline/deadline
  - preferred contact method
  - 1-2 attached images
  - follow-up notes

## Suggested Microcopy Direction
- Good:
  - `Ask about your project`
  - `See the draft section behind this answer`
  - `Prepare a request draft for township follow-up`
  - `Attach site photos if they would help staff review`
  - `Review before sending`
- Avoid:
  - `Chat with AI`
  - `Instant permit approval`
  - `Official filing complete`
  - `Smart zoning automation`

## Backend Shape This UX Should Assume
- Embeddings:
  - `nomic-embed-text`
- Retrieval:
  - local `Qdrant`
- Answer generation:
  - local `llama3.1:8b` via `Ollama`
- Product implication:
  - the assistant should keep answers concise, citation-backed, and close to
    the retrieved source text so the final formalized request is trustworthy
    for township staff review
  - the assistant should never imply that the township has already approved or
    validated the project; the product is a guidance-and-intake surface, not an
    official decision engine

## Clone Notes
- Parent MVP: `zoning`
- Recommended child slug: `saybrook-zoning`
- Recommended site name: `Saybrook Zoning Clerk`
- Do not overwrite the county-oriented parent.
- The child should preserve the strong zoning UX while narrowing the corpus and branding to Saybrook specifically.
