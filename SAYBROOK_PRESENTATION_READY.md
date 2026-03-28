## Saybrook Presentation Ready

This is the shortest path to a clean live presentation of `saybrook-zoning`.

The current UI is a split-screen municipal workstation:

- the CivicSidebar holds the township seal and system status
- the chatbot occupies the primary interaction canvas
- the IntakeDrawer handles the official submission flow
- the sign header has been removed
- the request handoff and queue view stay secondary to the main Q&A surface

### Live pieces

- Public RAG query webhook:
  - `https://flow.noirsys.com/webhook/saybrook-zoning-query`
- Request intake webhook:
  - `https://flow.noirsys.com/webhook/saybrook-zoning-request`
- Trustee request list webhook:
  - `https://flow.noirsys.com/webhook/saybrook-zoning-trustee-requests`
- n8n Data Table:
  - Saybrook request records are stored in the shared n8n Data Table used by both the intake and trustee workflows

Imported workflow sources:

- `n8n/saybrook-zoning-request-intake.workflow.json`
- `n8n/saybrook-zoning-trustee-requests.workflow.json`

### Frontend env

Set these for `websites/saybrook-zoning`:

```bash
VITE_SAYBROOK_RAG_API_URL=https://flow.noirsys.com/webhook/saybrook-zoning-query
VITE_SAYBROOK_REQUEST_API_URL=https://flow.noirsys.com/webhook/saybrook-zoning-request
VITE_SAYBROOK_REQUESTS_API_URL=https://flow.noirsys.com/webhook/saybrook-zoning-trustee-requests
```

Optional health URLs are not required for the presentation. If the webhook URLs are present,
the app now treats the request surfaces as live-capable by default.

### n8n request flow

The request intake flow should insert the normalized record into the Saybrook request
Data Table immediately after the normalization node.

Recommended row operation:
- Resource: `Row`
- Operation: `Insert`
- Data table: `Saybrook Zoning Requests`
- Mapping mode: `Map Automatically` when the normalized field names already match the
  table columns; otherwise map manually.

### n8n trustee list flow

The trustee list flow should read from the same Saybrook request Data Table.

Recommended row operation:
- Resource: `Row`
- Operation: `Get`
- Data table: `Saybrook Zoning Requests`
- Order By: `submitted_at` descending
- Limit: `25`

### Hidden trustee view

Any of these should open the internal queue view:

- `?view=trustees`
- `#trustees`
- any path containing `trustee`
- any path containing `queue`

Example:

```text
https://new-ashtabula-initiative.vercel.app/saybrook-zoning/?view=trustees
```

### Demo path

1. Ask a real zoning question.
2. Show the cited answer.
3. Add one or two images.
4. Fill contact info.
5. Prepare the formal request packet.
6. Submit to township queue.
7. Open the hidden trustee page and refresh.
8. Show the newly queued request card.

### What this demonstrates

- modern resident-facing zoning guidance
- citation-backed retrieval over the actual Saybrook code
- AI-assisted request formalization
- structured township queue handoff
- internal trustee/staff visibility without adding a heavy admin system
- an official civic workstation layout rather than a brochure-style landing page
