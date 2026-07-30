# Implementation Gate

## Scope

Implement only in the packet-listed source directory and permitted coordination
file. Preserve the existing framework and dependencies unless the feature
genuinely requires a small addition.

## Build loop

1. Resolve the canonical slug to the packet-listed directory; never guess from
   the public route.
2. Read accepted research and brand evidence.
3. Change source, not `dist/`, `.vercel/`, or `node_modules/`.
4. Remove leaked parent-template names, logos, contact details, routes, and copy.
5. Run `./nai build --slugs <slug>` and every other packet-listed check.
6. Verify route/base behavior and confirm `dist/index.html` exists.

## AI features

- Before implementing text, vision, image-generation, or speech behavior, read
  [shared-openrouter-api.md](shared-openrouter-api.md). If the assignment packet
  grants read access to a repository `SHARED_OPENROUTER_API.md`, use that as the
  current contract and the bundled file as a portable fallback.
- Use the repository shared API surface rather than exposing provider keys in
  browser code.
- Route provider-backed generation through the authorized server endpoint and
  OpenRouter configuration already used by the repository.
- Use only packet-authorized endpoints and shared client helpers. Escalate a
  missing capability or contract mismatch instead of editing shared
  infrastructure from a site implementation assignment.
- Validate inputs, loading, empty responses, errors, and output constraints.
- Label generated content honestly when users could mistake it for a completed
  external action.
- Do not claim an email, SMS, booking, purchase, or other external action was
  sent unless the application actually performs and verifies it.

## n8n administration

Treat n8n as orchestrator-owned shared infrastructure unless the packet grants
administration and names the exact workflow or Data Table scope. Without that
grant, consume the packet-listed webhook contract and escalate schema or
workflow changes.

When administration is explicitly granted:

1. Inspect the named workflow or table before changing it; do not browse or
   modify unrelated resources.
2. Read the relevant node or MCP tool documentation before constructing a
   workflow change.
3. Preserve or record the previous workflow version before a material edit.
4. Validate the workflow after changes and test the exact webhook path or
   execution covered by the assignment.
5. Record workflow ID, table ID, endpoint contract, checks, and evidence in the
   packet-listed repository documentation. Never record credentials.
6. Do not activate, deactivate, delete, roll back, or deploy unrelated
   workflows. Activation of the assigned workflow must be an explicit
   deliverable or an orchestrator clarification inside the packet scope.

Implementation completion is a focused build plus asset-specific evidence. It
does not authorize deployment and does not replace independent verification.
