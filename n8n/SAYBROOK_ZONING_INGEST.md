# Saybrook Zoning Ingest Workflow

This workflow is the first simple local backend lane for `saybrook-zoning`.

It is intentionally limited to **ingestion and indexing**:

1. fetch the Saybrook PDF over HTTP
2. extract text from the PDF
3. chunk the text
4. embed each chunk with local Ollama using `nomic-embed-text`
5. upsert the points into local Qdrant

It does **not** yet serve live answers to the frontend.
That should be the next workflow or thin query-service layer.

## Files

- Workflow JSON:
  - `n8n/saybrook-zoning-ingest.workflow.json`
- Source PDF:
  - `branding_research/saybrook-zoning/resources/zoning032626.pdf`
- Expected HTTP source:
  - `https://verdantasplanning.com/wp-content/uploads/2026/03/Saybrook-Text-03.26.26-Draft.pdf`

## Expected Local Services

- Ollama:
  - `http://127.0.0.1:11434`
- Qdrant:
  - `http://127.0.0.1:6333`
- n8n:
  - local instance already running

## Models / Collections

- Embedding model:
  - `nomic-embed-text`
- Qdrant collection:
  - `saybrook_zoning_20260326`

## Workflow Shape

- `Manual Trigger`
- `Fetch Saybrook PDF`
- `Extract PDF Text`
- `Chunk + Embed PDF`
- `Upsert Qdrant Points`
- `Summarize Ingest`

## Why This Shape

This keeps the first backend pass understandable and debuggable.

- `n8n` is used as orchestration glue
- `Ollama` does local embeddings
- `Qdrant` stores the retrieval corpus
- the complicated product logic is not buried in a giant visual maze

## Next Step After Ingest

Build the query path:

1. accept a user question
2. embed the question with Ollama
3. search Qdrant
4. pass top chunks to lightweight `llama3`
5. return a cited answer to the Saybrook frontend

## Notes

- The workflow no longer depends on the n8n runtime seeing a host filesystem path.
- It expects the PDF to be reachable from the n8n runtime over HTTP.
- If the hosting URL changes, update only the `Fetch Saybrook PDF` node.
- The chunking logic currently runs inside a Code node.
- It preserves large heading boundaries when possible and falls back to overlapping text windows.
- The workflow assumes the PDF text extractor returns usable text in a `text`, `content`, `extractedText`, or `pages[].text` shape.
- If the real extractor shape differs slightly in your n8n instance, the Code node is the first place to adjust.
