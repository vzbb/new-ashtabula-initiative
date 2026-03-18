# zoning-clerk Phase 3B — RAG Integration Checklist

**Date:** 2026-02-16  
**Status:** Implementation Guide — Ready for Execution  
**Prerequisite:** Phase 3A Complete (Next.js scaffold, Qdrant, UI shell)

---

## 3B.1 Document Ingestion Pipeline

### Task: Ingest 3 Available Documents

**Files to Process:**
- `resources/01_historic_district_zoning.pdf`
- `resources/03_city_welcome_info.pdf`
- `resources/04_city_document.pdf` (review first)

**Implementation:**

```typescript
// scripts/ingest-documents.ts
import { QdrantClient } from '@qdrant/js-client-rest';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

const qdrant = new QdrantClient({ url: 'http://192.168.1.223:6333' });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface DocumentChunk {
  id: string;
  text: string;
  metadata: {
    source: string;
    page?: number;
    section?: string;
  };
}

async function chunkPDF(filePath: string): Promise<DocumentChunk[]> {
  // Use pdf-parse or similar
  // Split by section headers with 100-token overlap
  // Return array of chunks with metadata
}

async function embedAndUpsert(chunks: DocumentChunk[]) {
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  
  for (const chunk of chunks) {
    const result = await model.embedContent(chunk.text);
    const embedding = result.embedding.values;
    
    await qdrant.upsert('zoning_ashtabula', {
      points: [{
        id: chunk.id,
        vector: embedding,
        payload: {
          text: chunk.text,
          ...chunk.metadata
        }
      }]
    });
  }
}

// Main execution
async function main() {
  const docs = [
    'resources/01_historic_district_zoning.pdf',
    'resources/03_city_welcome_info.pdf',
    'resources/04_city_document.pdf'
  ];
  
  for (const doc of docs) {
    console.log(`Processing ${doc}...`);
    const chunks = await chunkPDF(doc);
    await embedAndUpsert(chunks);
    console.log(`✓ Ingested ${chunks.length} chunks from ${doc}`);
  }
}

main().catch(console.error);
```

**Acceptance Criteria:**
- [ ] All 3 documents chunked and embedded
- [ ] Qdrant collection shows expected point count
- [ ] Metadata includes source file and section info

---

## 3B.2 RAG Search Implementation

### Task: Build Vector Search for Chat API

**File:** `app/api/chat/route.ts` (extend existing)

```typescript
// Add to existing chat route
async function searchContext(query: string): Promise<string[]> {
  const qdrant = new QdrantClient({ url: 'http://192.168.1.223:6333' });
  
  // Generate embedding for query
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(query);
  const queryVector = result.embedding.values;
  
  // Search Qdrant
  const searchResult = await qdrant.search('zoning_ashtabula', {
    vector: queryVector,
    limit: 5,
    score_threshold: 0.7
  });
  
  return searchResult.map(hit => hit.payload?.text as string);
}

// In chat handler:
const relevantChunks = await searchContext(userMessage);
const context = relevantChunks.join('\n\n---\n\n');
```

**Acceptance Criteria:**
- [ ] Query embedding matches document embedding dimensions (768)
- [ ] Returns top-5 relevant chunks
- [ ] Score threshold filters low-relevance results

---

## 3B.3 LLM Prompt with Citation

### Task: Design Prompt Template

```typescript
const SYSTEM_PROMPT = `You are the Ashtabula Zoning Assistant, a helpful AI that answers questions about zoning, permits, and historic district requirements for the City of Ashtabula, Ohio.

CONTEXT FROM OFFICIAL DOCUMENTS:
{context}

INSTRUCTIONS:
1. Answer based ONLY on the provided context documents
2. Always cite your sources using [Source: Document Name, Section X]
3. If the context doesn't contain the answer, say: "I don't have specific information about that in my current documents. For accurate guidance, please contact the Planning & Community Development office at (440) 992-7125 or PCD@cityofashtabula.com."
4. Never make up information or cite documents not in the context
5. Keep answers concise but complete
6. Include relevant procedure steps when available

CITATION FORMAT:
- Use inline citations: [Source: Historic District Zoning Guide, Section 1115.03]
- For multiple sources, cite all relevant ones
- If page number is available, include it: [Source: City Welcome Info, p. 3]

DISCLAIMER TO INCLUDE:
"This information is based on official city documents but is for general guidance only. For binding decisions, contact PCD."`;

function buildPrompt(userQuery: string, context: string): string {
  return SYSTEM_PROMPT.replace('{context}', context) + 
         `\n\nUSER QUESTION: ${userQuery}`;
}
```

**Acceptance Criteria:**
- [ ] Prompt includes all context documents
- [ ] Citation format is consistent
- [ ] Disclaimer is mandatory
- [ ] Fallback response for unknown questions

---

## 3B.4 Citation Extraction & UI

### Task: Parse and Display Citations

**Server-side (API):**
```typescript
interface Citation {
  source: string;
  section?: string;
  page?: number;
  quote: string;
}

function extractCitations(response: string): { text: string; citations: Citation[] } {
  const citationRegex = /\[Source: ([^,]+)(?:,\s*(.+?))?\]/g;
  const citations: Citation[] = [];
  
  let match;
  while ((match = citationRegex.exec(response)) !== null) {
    citations.push({
      source: match[1],
      section: match[2]?.includes('Section') ? match[2] : undefined,
      page: match[2]?.includes('p.') ? parseInt(match[2].match(/p\.\s*(\d+)/)?.[1] || '0') : undefined,
      quote: '' // Populated from context lookup
    });
  }
  
  // Remove citation markers from display text
  const cleanText = response.replace(citationRegex, '');
  
  return { text: cleanText, citations };
}
```

**Client-side (React):**
```tsx
// components/CitationCard.tsx
interface CitationCardProps {
  citation: Citation;
}

export function CitationCard({ citation }: CitationCardProps) {
  return (
    <div className="mt-2 p-2 bg-slate-50 border-l-4 border-blue-500 text-sm">
      <div className="font-medium text-slate-700">
        {citation.source}
        {citation.section && ` · ${citation.section}`}
        {citation.page && ` · Page ${citation.page}`}
      </div>
      {citation.quote && (
        <div className="mt-1 text-slate-600 italic">"{citation.quote}"</div>
      )}
    </div>
  );
}
```

**Acceptance Criteria:**
- [ ] Citations parsed from LLM response
- [ ] Clean text displayed to user
- [ ] Citation cards show source + section + quote
- [ ] Clickable to expand full context (future)

---

## 3B.5 Quick Question Buttons

### Task: Implement Common Question Shortcuts

**File:** `components/QuickQuestions.tsx`

```tsx
const QUICK_QUESTIONS = [
  { id: 'shed', label: 'Shed permit?', query: 'Do I need a permit for a shed?' },
  { id: 'historic', label: 'Historic district?', query: 'What is the historic district approval process?' },
  { id: 'contact', label: 'Contact PCD', query: 'How do I contact the zoning office?' },
  { id: 'pool', label: 'Pool permit?', query: 'What permits do I need for a swimming pool?' }
];

export function QuickQuestions({ onSelect }: { onSelect: (q: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {QUICK_QUESTIONS.map(q => (
        <button
          key={q.id}
          onClick={() => onSelect(q.query)}
          className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition"
        >
          {q.label}
        </button>
      ))}
    </div>
  );
}
```

**Acceptance Criteria:**
- [ ] 4 quick question buttons displayed
- [ ] Clicking populates chat input
- [ ] Questions cover most common zoning queries

---

## 3B.6 Testing & Validation

### Test Cases

| Test | Query | Expected Result |
|------|-------|-----------------|
| Historic District | "What is the historic district process?" | Returns ARB procedure with citations from Historic District Zoning Guide |
| Unknown | "What are the setback requirements for a garage?" | Fallback to contact PCD (no zoning code yet) |
| Contact Info | "How do I contact zoning?" | Returns PCD phone/email from City Welcome Info |
| Permit Wizard | "Do I need a permit for a deck?" | General guidance with disclaimer, cites available docs or falls back |

**Validation Steps:**
1. [ ] Run ingestion script, verify Qdrant points
2. [ ] Test each quick question
3. [ ] Verify citations appear correctly
4. [ ] Test unknown question fallback
5. [ ] Check mobile responsiveness

---

## Phase 3B Completion Checklist

- [ ] 3B.1: Document ingestion script working
- [ ] 3B.2: Vector search integrated in chat API
- [ ] 3B.3: LLM prompt with citation requirements
- [ ] 3B.4: Citation extraction and UI components
- [ ] 3B.5: Quick question buttons implemented
- [ ] 3B.6: Test cases passing

**Estimated Time:** 2-3 hours  
**Blockers:** None (proceed with available documents)

---

## Next Phase (3C)

Once 3B is complete:
1. Citation modal with full context
2. Mobile polish
3. Error handling & fallbacks
4. Deploy to live URL
