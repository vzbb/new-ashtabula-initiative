# Saybrook Zoning Request Intake Flow

This is the companion flow to the Saybrook RAG assistant.

The product shape is:

1. user asks zoning questions
2. user optionally uploads one or two site images
3. AI helps summarize the issue into a clean township-facing request
4. user confirms the drafted request
5. user enters contact information
6. n8n uploads any attached images to durable storage, such as Vercel Blob
7. n8n normalizes the packet and captures attachment URLs
8. n8n inserts the final structured row into the Saybrook request Data Table

This keeps the assistant useful even when the user doesn't know zoning language.

## Intended Request Packet

The frontend should send a single structured packet like:

```json
{
  "slug": "saybrook-zoning",
  "jurisdiction": "Saybrook Township",
  "question": "Can I build a detached garage behind my house?",
  "draftRequest": "Resident would like guidance on whether a detached garage is permitted and what setbacks or zoning review steps apply.",
  "address": "123 Example Rd, Saybrook Township, OH",
  "projectType": "Detached garage",
  "contact": {
    "name": "Jane Resident",
    "email": "jane@example.com",
    "phone": "(440) 555-0101"
  },
  "images": [
    "https://example.com/uploads/site-photo-1.jpg",
    "https://example.com/uploads/site-photo-2.jpg"
  ],
  "chatTranscript": [
    { "role": "user", "content": "Can I build a detached garage behind my house?" },
    { "role": "assistant", "content": "The draft code suggests setback and lot coverage review will matter..." }
  ]
}
```

## Required Fields

- `question`
- `draftRequest`
- at least one contact method:
  - `contact.email`
  - or `contact.phone`

## Strongly Recommended Fields

- `address`
- `projectType`
- `images`
- `chatTranscript`

## Data Table Target

For the live workflow, the simplest and best target is an n8n Data Table that both
the request intake flow and the trustee read-back flow can access.

Suggested table name:

- `Saybrook Zoning Requests`

This workflow should end with a row insert, not just an email or a remote API call.
If images are present, the workflow should store the actual files in Blob storage
and only write the resulting URLs + metadata into the Data Table.
The upload hop can be a lightweight Vercel function such as
`/api/saybrook-blob-upload`, which receives the attachment payload from n8n and
returns durable URLs.

Recommended Data Table columns:

- `submitted_at`
- `slug`
- `jurisdiction`
- `request_type`
- `applicant_name`
- `email`
- `phone`
- `preferred_contact`
- `property_address`
- `project_type`
- `project_summary`
- `specific_question`
- `ai_summary`
- `source_answer`
- `source_citations_json`
- `attachments_json`
- `chat_transcript_json`
- `status` default `new`

For image attachments, `attachments_json` should store a JSON array with items
like:

```json
[
  {
    "fileName": "site-photo-1.jpg",
    "mimeType": "image/jpeg",
    "size": 1827341,
    "url": "https://blob.vercel-storage.com/..."
  }
]
```

## Canonical Request Contract

The frontend may send friendly aliases, but the normalized record should land as:

```json
{
  "submitted_at": "2026-03-27T18:00:00.000Z",
  "slug": "saybrook-zoning",
  "jurisdiction": "Saybrook Township",
  "request_type": "zoning guidance",
  "applicant_name": "Jane Resident",
  "email": "jane@example.com",
  "phone": "(440) 555-0101",
  "preferred_contact": "email",
  "property_address": "123 Example Rd, Saybrook Township, OH",
  "project_type": "Detached garage",
  "project_summary": "Resident wants guidance on a detached garage.",
  "specific_question": "Can I build a detached garage behind my house?",
  "ai_summary": "Assistant summarized the issue for staff review.",
  "source_answer": "Assistant answer text.",
  "source_citations_json": "[]",
  "attachments_json": "[{\"fileName\":\"site-photo-1.jpg\",\"mimeType\":\"image/jpeg\",\"size\":1827341,\"url\":\"https://blob.vercel-storage.com/...\"}]",
  "chat_transcript_json": "[]",
  "status": "new"
}
```

Accepted aliases during normalization:

- `question`, `sourceQuestion`, `specificQuestion`
- `draftRequest`, `projectSummary`, `residentSummary`
- `fullName`, `applicantName`, `contact.name`
- `preferredContact`, `preferred_contact`
- `propertyAddress`, `address`
- `aiSummary`, `aiContextSummary`
- `sourceAnswer`
- `sourceCitations`, `citations`
- `chatTranscript`, `chat_transcript`
- `attachments`, `images`

## Good Follow-up Statuses

- `new`
- `reviewing`
- `needs-more-info`
- `responded`
- `closed`

## Workflow Shape

- `Webhook`
- `Upload Attachments`
- `Normalize + Validate`
- `Shape Table Row`
- `Insert Into Data Table`
- `Respond To Webhook`

## Why This Matters

The AI answer is useful, but the handoff is what creates operational value.
The goal is not only to answer a zoning question. The goal is to turn confusion
into a legible request that township staff can actually respond to.
