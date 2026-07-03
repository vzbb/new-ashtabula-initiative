# zoning-clerk Phase 3A — Foundation Scaffolding Checklist

**Project:** New Ashtabula Initiative — zoning-clerk  
**Phase:** 3A (Foundation Scaffolding)  
**Goal:** Initialize project, configure RAG infrastructure, prepare for UI build  
**Estimated Time:** 2-3 hours  
**Prerequisites:** SPEC.md complete, 3/6 documents obtained

---

## Step 1: Project Initialization (15 min)

### 1.1 Create Next.js project with shadcn/ui
```bash
mkdir -p ~/projects/ashtabula/zoning-clerk
cd ~/projects/ashtabula/zoning-clerk
echo "my-app" | npx shadcn@latest init --yes --template next --base-color slate
```

### 1.2 Install required components
```bash
cd my-app
npx shadcn add button card input textarea badge separator
npx shadcn add scroll-area avatar tooltip
```

### 1.3 Install AI/RAG dependencies
```bash
npm install ai @ai-sdk/openai @qdrant/js-client-rest
npm install pdf-parse cheerio
npm install lucide-react
```

**Deliverable:** Initialized Next.js project with dependencies

---

## Step 2: Qdrant Collection Setup (20 min)

### 2.1 Verify Qdrant connectivity
```bash
curl http://192.168.1.223:6333/collections
```

### 2.2 Create collection script
Create `scripts/setup-qdrant.js`:
```javascript
const { QdrantClient } = require('@qdrant/js-client-rest');

const client = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://192.168.1.223:6333'
});

const COLLECTION_NAME = 'zoning_ashtabula';

async function setup() {
  // Check if collection exists
  const collections = await client.getCollections();
  const exists = collections.collections.find(c => c.name === COLLECTION_NAME);
  
  if (exists) {
    console.log(`Collection ${COLLECTION_NAME} already exists`);
    return;
  }

  // Create collection with 1536 dimensions (OpenAI embeddings)
  await client.createCollection(COLLECTION_NAME, {
    vectors: {
      size: 1536,
      distance: 'Cosine'
    },
    optimizers_config: {
      default_segment_number: 2
    }
  });

  // Create payload indexes for filtering
  await client.createPayloadIndex(COLLECTION_NAME, {
    field_name: 'document_type',
    field_schema: 'keyword'
  });

  await client.createPayloadIndex(COLLECTION_NAME, {
    field_name: 'source',
    field_schema: 'keyword'
  });

  console.log(`Collection ${COLLECTION_NAME} created successfully`);
}

setup().catch(console.error);
```

### 2.3 Run setup
```bash
node scripts/setup-qdrant.js
```

**Deliverable:** Qdrant collection ready with indexes

---

## Step 3: Document Ingestion Pipeline (45 min)

### 3.1 Create ingestion script
Create `scripts/ingest-documents.js`:
```javascript
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { QdrantClient } = require('@qdrant/js-client-rest');
const { openai } = require('@ai-sdk/openai');

const client = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://192.168.1.223:6333'
});

const COLLECTION_NAME = 'zoning_ashtabula';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function getEmbedding(text) {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text.slice(0, 8000) // OpenAI limit
    })
  });
  
  const data = await response.json();
  return data.data[0].embedding;
}

async function chunkText(text, maxChunkSize = 1000) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks = [];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }
  
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}

async function ingestPDF(filePath, metadata) {
  console.log(`Ingesting: ${filePath}`);
  
  const buffer = fs.readFileSync(filePath);
  const pdf = await pdfParse(buffer);
  const chunks = await chunkText(pdf.text);
  
  console.log(`  → ${chunks.length} chunks`);
  
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await getEmbedding(chunks[i]);
    
    await client.upsert(COLLECTION_NAME, {
      points: [{
        id: `${metadata.source}_chunk_${i}`,
        vector: embedding,
        payload: {
          text: chunks[i],
          chunk_index: i,
          total_chunks: chunks.length,
          ...metadata
        }
      }]
    });
    
    // Rate limit: 20 requests/minute for embeddings
    await new Promise(r => setTimeout(r, 3000));
  }
  
  console.log(`  ✓ Complete`);
}

async function main() {
  const docsDir = path.join(__dirname, '../documents');
  
  // Documents we have
  const documents = [
    {
      file: 'historic_district_zoning_guide.pdf',
      source: 'historic_district_guide',
      document_type: 'zoning_regulation',
      title: 'Historic District Zoning Guide'
    },
    {
      file: 'city_welcome_packet.pdf',
      source: 'city_welcome_packet',
      document_type: 'general_info',
      title: 'City Welcome and Information Packet'
    },
    {
      file: 'city_document.pdf',
      source: 'city_document',
      document_type: 'general_info',
      title: 'City Document'
    }
  ];
  
  for (const doc of documents) {
    const filePath = path.join(docsDir, doc.file);
    if (fs.existsSync(filePath)) {
      await ingestPDF(filePath, {
        source: doc.source,
        document_type: doc.document_type,
        title: doc.title
      });
    } else {
      console.log(`⚠ Missing: ${doc.file}`);
    }
  }
  
  console.log('\n✓ Ingestion complete');
}

main().catch(console.error);
```

### 3.2 Create documents directory
```bash
mkdir -p documents
# Copy obtained PDFs here:
# - historic_district_zoning_guide.pdf
# - city_welcome_packet.pdf
# - city_document.pdf
```

### 3.3 Test ingestion (dry run with small sample)
```bash
export OPENAI_API_KEY="your-key-here"
export QDRANT_URL="http://192.168.1.223:6333"
node scripts/ingest-documents.js
```

**Deliverable:** Documents ingested into Qdrant with embeddings

---

## Step 4: API Route Scaffold (30 min)

### 4.1 Create chat API route
Create `app/api/chat/route.ts`:
```typescript
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { QdrantClient } from '@qdrant/js-client-rest';

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://192.168.1.223:6333'
});

const COLLECTION_NAME = 'zoning_ashtabula';

async function retrieveContext(query: string) {
  // Get embedding for query
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: query
    })
  });
  
  const data = await response.json();
  const embedding = data.data[0].embedding;
  
  // Search Qdrant
  const results = await qdrant.search(COLLECTION_NAME, {
    vector: embedding,
    limit: 5,
    with_payload: true
  });
  
  return results.map(r => ({
    text: r.payload?.text,
    source: r.payload?.source,
    score: r.score
  }));
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1].content;
  
  // Retrieve relevant context
  const context = await retrieveContext(lastMessage);
  const contextText = context
    .map((c, i) => `[${i + 1}] ${c.text} (Source: ${c.source})`)
    .join('\n\n');
  
  const systemPrompt = `You are the City of Ashtabula Zoning Assistant. Answer questions based ONLY on the provided context. If the answer is not in the context, say so clearly and suggest contacting the Planning & Community Development office at 440-992-7125.

Always cite your sources using [1], [2], etc. corresponding to the context entries.

Include this disclaimer when appropriate: "This information is for general guidance only. For official determinations, please contact the City of Ashtabula Planning & Community Development Department."

Context:
${contextText}`;

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: systemPrompt,
    messages
  });

  return result.toDataStreamResponse();
}
```

### 4.2 Environment variables
Create `.env.local`:
```
OPENAI_API_KEY=sk-...
QDRANT_URL=http://192.168.1.223:6333
```

**Deliverable:** Working chat API with RAG retrieval

---

## Step 5: Basic UI Shell (30 min)

### 5.1 Create chat page
Create `app/page.tsx`:
```tsx
'use client';

import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building2, Send, AlertCircle } from 'lucide-react';

export default function ZoningChat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <Card className="mb-4">
          <CardHeader className="flex flex-row items-center gap-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <CardTitle>City of Ashtabula Zoning Assistant</CardTitle>
              <p className="text-sm text-muted-foreground">
                Ask questions about zoning, permits, and historic districts
              </p>
            </div>
            <Badge variant="secondary" className="ml-auto">Beta</Badge>
          </CardHeader>
        </Card>

        {/* Chat Area */}
        <Card className="mb-4">
          <CardContent className="p-0">
            <ScrollArea className="h-[500px] p-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                  <p className="mb-2">Welcome! I can help with:</p>
                  <ul className="text-sm space-y-1">
                    <li>• Zoning district questions</li>
                    <li>• Historic district requirements</li>
                    <li>• Permit application guidance</li>
                    <li>• General city information</li>
                  </ul>
                </div>
              )}
              
              {messages.map((m) => (
                <div key={m.id} className={`mb-4 ${m.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block max-w-[80%] rounded-lg p-3 ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-100 text-slate-900'
                  }`}>
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="text-muted-foreground text-sm">Thinking...</div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about zoning, permits, or historic districts..."
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {/* Disclaimer */}
        <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p>
            This is an unofficial tool for general guidance only. For official determinations, 
            contact the City of Ashtabula Planning & Community Development Department at 440-992-7125.
          </p>
        </div>
      </div>
    </div>
  );
}
```

**Deliverable:** Working UI shell with chat interface

---

## Verification Checklist

- [ ] Next.js project initializes without errors
- [ ] Qdrant collection created with proper vector config
- [ ] At least 1 document ingested with embeddings
- [ ] Chat API returns responses with citations
- [ ] UI displays messages and handles input
- [ ] Disclaimer visible on all pages

---

## Next Phase (3B): Polish & Features

After completing Phase 3A, next steps:
1. **Permit Wizard UI** — Multi-step form flow
2. **Historic District Checker** — Address-based lookup
3. **Citation Cards** — Expandable source references
4. **Contact Integration** — Phone/email quick actions
5. **Mobile responsiveness** — Full device support

---

**Document Info:**
- Created: 2026-02-15
- Status: Ready for execution
- Blockers: None (can proceed with available documents)
