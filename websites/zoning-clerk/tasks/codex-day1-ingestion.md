# Zoning Clerk MVP - Day 1: Document Ingestion Pipeline

## Task for Codex CLI
Build a Python document ingestion pipeline that:
1. Loads PDFs from resources/ folder
2. Chunks documents intelligently (preserve section headers, zoning codes)
3. Generates embeddings using local model (ollama/nomic-embed-text)
4. Stores in Qdrant vector DB
5. Exposes FastAPI endpoint for document status

## Files to create:
- pipeline/ingest.py - Main ingestion logic
- pipeline/chunker.py - Smart chunking with header preservation
- pipeline/embedder.py - Ollama embedding client
- api/main.py - FastAPI server with /status and /ingest endpoints
- requirements.txt - Dependencies

## Tech stack:
- Python 3.10+
- FastAPI, pypdf, qdrant-client, ollama, pydantic
- Use existing Qdrant at localhost:6333

## Design notes:
- Log everything with timestamps
- Handle PDF parsing errors gracefully
- Progress tracking for large docs
- Idempotent (re-running doesn't duplicate)

Run until complete. Report back with:
- Files created
- Endpoints working
- Sample curl command to test