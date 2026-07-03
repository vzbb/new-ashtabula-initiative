# Saybrook Zoning Trustee Requests Flow

This is the companion read-side flow for the hidden trustee/admin-style page.

It should stay simple:

1. n8n webhook receives the request
2. n8n fetches recent requests from the Saybrook request Data Table
3. n8n returns a compact JSON payload for the hidden trustee page

## Local source of truth

- n8n Data Table:
  - `Saybrook Zoning Requests`

## Suggested live webhook

- `saybrook-zoning-trustee-requests`

## Expected response shape

```json
{
  "ok": true,
  "count": 12,
  "requests": [
    {
      "id": 12,
      "submitted_at": "2026-03-27T20:12:00Z",
      "applicant_name": "Jane Resident",
      "property_address": "123 Example Rd",
      "project_type": "Detached garage",
      "specific_question": "Can I build a detached garage behind my house?",
      "status": "new"
    }
  ]
}
```

The page can still advertise higher-end operational options in its own UI, but
those notes should stay out of the response payload itself.

If the request row includes attachment URLs from Vercel Blob, the trustee page
should show small previews and let staff open the image in a new tab.
