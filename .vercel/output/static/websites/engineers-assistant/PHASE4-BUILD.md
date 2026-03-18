# Engineers Assistant — Build Checklist (Phase 4)
**Project:** engineers-assistant  
**MVP Number:** #21  
**Date:** 2026-02-19  
**Status:** Phase 4 Complete — Ready for Development

---

## Quick Start (Copy-Paste Commands)

### 1. Project Initialization

```bash
# Create project directory
mkdir -p ~/projects/ashtabula/engineers-assistant
cd ~/projects/ashtabula/engineers-assistant

# Initialize Next.js project with shadcn
echo "my-app" | npx shadcn@latest init --yes --template next --base-color slate

# Navigate into project
cd my-app

# Install required shadcn components
npx shadcn add button input textarea card badge sheet dialog scroll-area separator avatar

# Install additional dependencies
npm install @supabase/supabase-js @supabase/ssr @pinecone-database/pinecone openai ai
npm install lucide-react react-markdown remark-gfm
npm install date-fns uuid
npm install --save-dev @types/uuid

# Initialize shadcn dialog (for modals)
npx shadcn add dialog
```

### 2. Environment Setup

```bash
# Create env file
cat > .env.local << 'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Pinecone
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX_NAME=engineers-assistant-kb
PINECONE_HOST=your_pinecone_host

# OpenAI
OPENAI_API_KEY=your_openai_key

# App Config
NEXT_PUBLIC_APP_NAME="Engineers Assistant"
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
```

### 3. Supabase Setup

```sql
-- Run this in Supabase SQL Editor

-- 1. Enable RLS
alter table if exists sessions enable row level security;
alter table if exists messages enable row level security;
alter table if exists feedback enable row level security;
alter table if exists events enable row level security;

-- 2. Create tables
create table sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  user_agent text,
  ip_hash text,
  is_pro boolean default false
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  role text check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamp with time zone default now(),
  confidence_score float,
  sources jsonb default '[]'::jsonb
);

create table feedback (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references messages(id) on delete cascade,
  is_helpful boolean,
  comment text,
  created_at timestamp with time zone default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  event_type text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

-- 3. Create indexes
create index idx_messages_session on messages(session_id, created_at);
create index idx_events_session on events(session_id, created_at);
create index idx_events_type on events(event_type, created_at);

-- 4. RLS Policies (anonymous access for MVP)
create policy "Allow anonymous inserts" on sessions
  for insert with check (true);

create policy "Allow anonymous selects" on sessions
  for select using (true);

create policy "Allow anonymous message inserts" on messages
  for insert with check (true);

create policy "Allow anonymous message selects" on messages
  for select using (true);

create policy "Allow anonymous feedback" on feedback
  for all using (true);

create policy "Allow anonymous events" on events
  for all using (true);
```

### 4. Pinecone Setup

```bash
# Create index via Pinecone Console or API
# Index name: engineers-assistant-kb
# Dimensions: 1536 (for text-embedding-3-small)
# Metric: cosine

# Or via curl:
curl -X POST "https://api.pinecone.io/indexes" \
  -H "Api-Key: $PINECONE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "engineers-assistant-kb",
    "dimension": 1536,
    "metric": "cosine",
    "spec": {
      "serverless": {
        "cloud": "aws",
        "region": "us-east-1"
      }
    }
  }'
```

---

## File Structure

```
my-app/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts
│   │   └── wizard/
│   │       └── route.ts
│   ├── chat/
│   │   └── page.tsx
│   ├── topics/
│   │   └── page.tsx
│   ├── contacts/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/                    # shadcn components
│   ├── chat/
│   │   ├── ChatWindow.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── ChatInput.tsx
│   │   └── SourceCitation.tsx
│   ├── topics/
│   │   ├── TopicGrid.tsx
│   │   └── TopicCard.tsx
│   ├── wizard/
│   │   ├── PermitWizard.tsx
│   │   └── WizardStep.tsx
│   ├── shared/
│   │   ├── JurisdictionBadge.tsx
│   │   ├── ConfidenceIndicator.tsx
│   │   ├── ContactCard.tsx
│   │   └── Header.tsx
│   └── FeedbackButton.tsx
├── lib/
│   ├── supabase.ts
│   ├── pinecone.ts
│   ├── openai.ts
│   ├── rag.ts
│   └── utils.ts
├── data/
│   ├── knowledge-base/        # Markdown source docs
│   ├── topics.ts
│   ├── contacts.ts
│   └── wizard-flows.ts
├── scripts/
│   └── ingest-kb.ts
├── types/
│   └── index.ts
└── public/
    └── icons/
```

---

## Implementation Order

### Week 1: Foundation

#### Day 1-2: Project Setup + Core Infrastructure

**File: `lib/supabase.ts`**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Session = {
  id: string;
  created_at: string;
  user_agent?: string;
  ip_hash?: string;
};

export type Message = {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  confidence_score?: number;
  sources?: Source[];
};

export type Source = {
  title: string;
  url?: string;
  jurisdiction?: string;
};
```

**File: `lib/pinecone.ts`**
```typescript
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export const index = pinecone.index(process.env.PINECONE_INDEX_NAME!);

export interface KnowledgeChunk {
  id: string;
  content: string;
  metadata: {
    source: string;
    category: string;
    jurisdiction: 'city-engineering' | 'county-building' | 'city-zoning' | 'other';
    title: string;
    url?: string;
  };
}
```

**File: `lib/openai.ts`**
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export { openai };

export async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

export async function generateResponse(
  query: string,
  context: string,
  history: { role: string; content: string }[]
): Promise<{ response: string; confidence: number }> {
  const messages = [
    {
      role: 'system',
      content: `You are the Engineers Assistant for Ashtabula, Ohio. Help residents navigate engineering permits, zoning, and property improvement.

Guidelines:
- Be concise and practical
- Always cite your sources
- Indicate jurisdiction (City Engineering, County Building, or City Zoning)
- Include confidence level in your assessment
- Add disclaimer for complex situations

Context from knowledge base:
${context}`,
    },
    ...history.slice(-4), // Last 4 messages for context
    { role: 'user', content: query },
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // Use gpt-4o for production
    messages: messages as any,
    temperature: 0.3,
    max_tokens: 1000,
  });

  const response = completion.choices[0].message.content || '';
  
  // Simple confidence heuristic
  const confidence = response.includes('not sure') || response.includes('unclear') 
    ? 0.5 
    : 0.85;

  return { response, confidence };
}
```

#### Day 3-4: RAG Pipeline

**File: `lib/rag.ts`**
```typescript
import { index } from './pinecone';
import { getEmbedding, generateResponse } from './openai';
import { supabase } from './supabase';

export interface RAGResult {
  response: string;
  confidence: number;
  sources: Array<{
    title: string;
    url?: string;
    jurisdiction: string;
  }>;
  jurisdiction: string;
}

export async function processQuery(
  query: string,
  sessionId: string,
  history: Array<{ role: string; content: string }>
): Promise<RAGResult> {
  // 1. Get embedding for query
  const queryEmbedding = await getEmbedding(query);
  
  // 2. Retrieve relevant chunks from Pinecone
  const results = await index.query({
    vector: queryEmbedding,
    topK: 5,
    includeMetadata: true,
  });

  // 3. Build context from retrieved chunks
  const context = results.matches
    ?.map(match => match.metadata?.content as string)
    .join('\n\n---\n\n') || '';

  // 4. Get sources for citation
  const sources = results.matches?.map(match => ({
    title: match.metadata?.title as string,
    url: match.metadata?.url as string | undefined,
    jurisdiction: match.metadata?.jurisdiction as string,
  })) || [];

  // 5. Determine primary jurisdiction
  const jurisdictionCounts = sources.reduce((acc, s) => {
    acc[s.jurisdiction] = (acc[s.jurisdiction] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const jurisdiction = Object.entries(jurisdictionCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'city-engineering';

  // 6. Generate response
  const { response, confidence } = await generateResponse(query, context, history);

  // 7. Save to database
  await supabase.from('messages').insert({
    session_id: sessionId,
    role: 'user',
    content: query,
    confidence_score: confidence,
  });

  await supabase.from('messages').insert({
    session_id: sessionId,
    role: 'assistant',
    content: response,
    confidence_score: confidence,
    sources: sources,
  });

  return { response, confidence, sources, jurisdiction };
}
```

#### Day 5-7: API Routes + Chat UI

**File: `app/api/chat/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { processQuery } from '@/lib/rag';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, history } = await req.json();

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await processQuery(message, sessionId, history || []);

    return NextResponse.json({
      response: result.response,
      confidence: result.confidence,
      sources: result.sources,
      jurisdiction: result.jurisdiction,
      disclaimer: 'This guidance is for informational purposes only. Always verify with City or County officials before proceeding.',
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    );
  }
}
```

**File: `app/api/wizard/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { wizardFlows } from '@/data/wizard-flows';

export async function POST(req: NextRequest) {
  try {
    const { projectType, answers } = await req.json();
    
    const flow = wizardFlows[projectType];
    if (!flow) {
      return NextResponse.json({ error: 'Unknown project type' }, { status: 400 });
    }

    const result = flow.evaluate(answers);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Wizard API error:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate project' },
      { status: 500 }
    );
  }
}
```

**File: `components/chat/ChatWindow.tsx`**
```typescript
'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    title: string;
    url?: string;
    jurisdiction: string;
  }>;
  confidence?: number;
  jurisdiction?: string;
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm the Engineers Assistant. Ask me about permits, zoning, or property improvements in Ashtabula.",
      confidence: 1,
      jurisdiction: 'system',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (content: string) => {
    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          sessionId,
          history,
        }),
      });

      const data = await res.json();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        sources: data.sources,
        confidence: data.confidence,
        jurisdiction: data.jurisdiction,
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I had trouble processing that. Please try again.',
        confidence: 0,
        jurisdiction: 'system',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg bg-white">
      <ScrollArea className="flex-1 p-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="animate-pulse">Thinking...</div>
          </div>
        )}
        <div ref={scrollRef} />
      </ScrollArea>
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
```

### Week 2: Features

#### Day 1-2: Topic Browser + Permit Wizard

**File: `data/topics.ts`**
```typescript
export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  commonQuestions: Array<{
    question: string;
    shortAnswer: string;
  }>;
}

export const topics: Topic[] = [
  {
    id: 'driveways',
    title: 'Driveways',
    description: 'New driveways, expansions, and curb cut permits',
    icon: 'Car',
    commonQuestions: [
      {
        question: 'Do I need a permit for a new driveway?',
        shortAnswer: 'Yes, a curb cut permit from City Engineering is required.',
      },
      {
        question: 'How wide can my driveway be?',
        shortAnswer: 'Maximum 24 feet for residential properties.',
      },
    ],
  },
  {
    id: 'decks',
    title: 'Decks & Sheds',
    description: 'Building permits for outdoor structures',
    icon: 'Home',
    commonQuestions: [
      {
        question: 'Do I need a permit for a deck?',
        shortAnswer: 'Yes, if over 30 inches high or attached to the house.',
      },
    ],
  },
  // Add more topics...
];
```

**File: `data/wizard-flows.ts`**
```typescript
interface WizardStep {
  id: string;
  question: string;
  type: 'select' | 'boolean';
  options?: Array<{ value: string; label: string; next?: string }>;
}

interface WizardResult {
  permitsRequired: Array<{
    type: string;
    authority: string;
    description: string;
    estimatedCost?: string;
    timeline?: string;
  }>;
  nextSteps: string[];
}

export const wizardFlows: Record<string, {
  name: string;
  steps: WizardStep[];
  evaluate: (answers: Record<string, string>) => WizardResult;
}> = {
  deck: {
    name: 'Deck Project',
    steps: [
      {
        id: 'height',
        question: 'Will your deck be over 30 inches high?',
        type: 'boolean',
      },
      {
        id: 'attachment',
        question: 'Will it be attached to your house?',
        type: 'boolean',
      },
      {
        id: 'size',
        question: 'Approximate deck size?',
        type: 'select',
        options: [
          { value: 'small', label: 'Under 200 sq ft' },
          { value: 'medium', label: '200-400 sq ft' },
          { value: 'large', label: 'Over 400 sq ft' },
        ],
      },
    ],
    evaluate: (answers) => {
      const permits = [];
      const steps = [];

      if (answers.height === 'true' || answers.attachment === 'true') {
        permits.push({
          type: 'Building Permit',
          authority: 'Ashtabula County Building',
          description: 'Required for decks over 30" or attached to house',
          estimatedCost: '$150-300',
          timeline: '5-10 business days',
        });
        steps.push('Contact County Building at (440) 576-3737');
        steps.push('Prepare site plans showing dimensions');
      }

      return { permitsRequired: permits, nextSteps: steps };
    },
  },
  // Add more project types...
};
```

#### Day 3-4: Contacts Page + Feedback

**File: `data/contacts.ts`**
```typescript
export interface Contact {
  id: string;
  name: string;
  department: string;
  jurisdiction: 'city' | 'county';
  phone: string;
  email?: string;
  hours: string;
  address: string;
  services: string[];
}

export const contacts: Contact[] = [
  {
    id: 'city-engineering',
    name: 'City Engineering Department',
    department: 'Engineering',
    jurisdiction: 'city',
    phone: '(440) 992-7111',
    hours: 'Mon-Fri 8:00 AM - 4:30 PM',
    address: '4717 Main Ave, Ashtabula, OH 44004',
    services: ['Curb cuts', 'Sidewalk permits', 'Sewer connections', 'Street openings'],
  },
  {
    id: 'county-building',
    name: 'Ashtabula County Building Department',
    department: 'Building',
    jurisdiction: 'county',
    phone: '(440) 576-3737',
    hours: 'Mon-Fri 8:00 AM - 4:30 PM',
    address: '25 W Jefferson St, Jefferson, OH 44047',
    services: ['Building permits', 'Inspections', 'Code compliance'],
  },
  {
    id: 'city-zoning',
    name: 'City of Ashtabula Zoning',
    department: 'Zoning',
    jurisdiction: 'city',
    phone: '(440) 992-7125',
    hours: 'Mon-Fri 8:00 AM - 4:30 PM',
    address: '4717 Main Ave, Ashtabula, OH 44004',
    services: ['Zoning permits', 'Setback verification', 'Zoning maps'],
  },
  {
    id: 'ohio-811',
    name: 'OHIO 811',
    department: 'Utility Locating',
    jurisdiction: 'other',
    phone: '811 or (800) 362-2764',
    hours: '24/7',
    address: 'Statewide service',
    services: ['Utility locating', 'Underground line marking'],
  },
];
```

#### Day 5-7: Polish + Deploy

**Deployment Checklist:**

```bash
# 1. Build check
npm run build

# 2. Environment variables in Vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add PINECONE_API_KEY
vercel env add PINECONE_INDEX_NAME
vercel env add OPENAI_API_KEY

# 3. Deploy
vercel --prod

# 4. Custom domain (optional)
vercel domains add engineers-assistant.ashtabula.io
```

---

## Knowledge Base Ingestion Script

**File: `scripts/ingest-kb.ts`**
```typescript
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const index = pinecone.index(process.env.PINECONE_INDEX_NAME!);

interface Document {
  id: string;
  content: string;
  metadata: {
    source: string;
    category: string;
    jurisdiction: string;
    title: string;
    url?: string;
  };
}

async function chunkText(text: string, maxChunkSize: number = 1000): Promise<string[]> {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += ' ' + sentence;
    }
  }
  
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}

async function ingestDocument(filePath: string) {
  const content = await fs.readFile(filePath, 'utf-8');
  const { data, content: body } = matter(content);
  
  const chunks = await chunkText(body);
  const vectors = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: chunks[i],
    });
    
    vectors.push({
      id: `${data.id}-chunk-${i}`,
      values: embedding.data[0].embedding,
      metadata: {
        content: chunks[i],
        source: data.source || 'unknown',
        category: data.category || 'general',
        jurisdiction: data.jurisdiction || 'other',
        title: data.title || 'Untitled',
        url: data.url,
      },
    });
  }
  
  await index.upsert(vectors);
  console.log(`Ingested ${filePath}: ${chunks.length} chunks`);
}

async function main() {
  const kbDir = path.join(process.cwd(), 'data/knowledge-base');
  const files = await fs.readdir(kbDir);
  
  for (const file of files.filter(f => f.endsWith('.md'))) {
    await ingestDocument(path.join(kbDir, file));
  }
}

main().catch(console.error);
```

---

## Testing Checklist

### Unit Tests (Jest)
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

**Key test files to create:**
- `__tests__/lib/rag.test.ts` — RAG pipeline
- `__tests__/components/ChatWindow.test.tsx` — Chat UI
- `__tests__/api/chat.test.ts` — API routes

### E2E Tests (Playwright)
```bash
npm install --save-dev @playwright/test
npx playwright install
```

**Critical flows:**
1. User sends message → receives response
2. Topic browser navigation
3. Permit wizard complete flow
4. Contact click-to-call

### Manual Testing
- [ ] Mobile responsiveness (iPhone SE, iPhone 14, Pixel 7)
- [ ] Accessibility (axe DevTools)
- [ ] Performance (Lighthouse >90)
- [ ] Error handling (network failure, API errors)

---

## Launch Checklist

### Pre-Launch
- [ ] All 4 contacts verified (phone numbers, hours)
- [ ] Knowledge base has minimum 20 documents
- [ ] Disclaimer text reviewed
- [ ] Analytics events tracking
- [ ] Error monitoring (Sentry optional)

### Launch Day
- [ ] Deploy to production
- [ ] Test all 4 core features
- [ ] Submit sitemap to Google
- [ ] Post to personal social
- [ ] Send to 5 beta testers

### Post-Launch (Week 1)
- [ ] Monitor error logs daily
- [ ] Review feedback submissions
- [ ] Check analytics for drop-offs
- [ ] Fix any critical bugs

---

## Cost Estimation (Monthly)

| Service | Free Tier | Expected Usage | Monthly Cost |
|---------|-----------|----------------|--------------|
| Vercel | 100GB bandwidth | <10GB | $0 |
| Supabase | 500MB, 2M reqs | ~100MB, ~10K reqs | $0 |
| Pinecone | 2GB, 100K ops | ~500MB, ~5K ops | $0 |
| OpenAI | - | ~$10-20/mo usage | ~$15 |
| **Total** | | | **~$15/mo** |

---

## Next Steps After Build

1. **Knowledge Base Population** — Work with City/County to digitize code sections
2. **User Testing** — 5-10 homeowners test the tool
3. **City Partnership** — Present to City Engineer for endorsement
4. **Spanish Translation** — Post-MVP feature for accessibility

---

**Document Status:** Phase 4 Complete  
**Ready for:** Development kickoff  
**Estimated Build Time:** 2-3 weeks (single developer)
