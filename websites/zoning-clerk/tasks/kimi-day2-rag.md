# Zoning Clerk MVP - Day 2: RAG Query API

## Task for Kimi CLI
Build the RAG (Retrieval Augmented Generation) query layer:

## Components:
1. **query_engine.py** - Main RAG orchestrator
   - Query preprocessing (entity extraction for addresses)
   - Vector search against Qdrant
   - Context assembly with citations
   - Confidence scoring
   
2. **api/rag.py** - FastAPI endpoints
   - POST /query - Main RAG endpoint
   - POST /chat - Conversational with history
   - GET /sources - List available documents
   - Health check endpoints

3. **prompts/** - Prompt templates
   - zoning_expert.txt - System prompt for zoning Q&A
   - permit_advisor.txt - System prompt for permit guidance

## RAG Pipeline:
1. Receive query (e.g., "Can I build a garage at 123 Main St?")
2. Extract address → lookup zoning district (mock for now)
3. Search Qdrant for relevant code sections
4. Assemble context: zoning district + relevant sections
5. Format prompt with context + query
6. Return: {answer, sources, confidence, follow_up_questions}

## Mock data for MVP:
Create zoning_districts.json with sample Ashtabula districts:
- R-1 Residential
- R-2 Residential
- C-1 Commercial
- C-2 Commercial
- M Industrial
- CBD Central Business

Each with: allowed_uses, setbacks, height_limits, permit_requirements

## Integration:
- Connect to Qdrant (localhost:6333)
- Prepare for Ollama local LLM integration
- Document API with examples

## Tech:
- Python, FastAPI
- Qdrant client
- Pydantic models for all requests/responses

Run until complete. Report back with:
- API endpoints tested with curl
- Sample query/response
- Confidence scoring working