# Zoning Clerk — Phase 3B Implementation Checklist
## Advanced Features & Pre-Deployment Polish

**Project:** Zoning Clerk (RAG-based zoning chatbot)  
**Phase:** 3B — Advanced features, citations, permit wizard, and deployment prep  
**Estimated Time:** 3–4 hours  
**Prerequisites:** Phase 3A complete (working chat with basic UI)

---

## Step 1: Citation System Implementation (45 min)

### 1.1 Update Document Ingestion to Store Source Metadata
```python
# scripts/enhanced_ingest.py
import hashlib
from pathlib import Path

def ingest_with_metadata(file_path: str, collection_name: str = "zoning_docs"):
    """Ingest PDF with page-level source tracking for citations."""
    import fitz  # PyMuPDF
    from qdrant_client import QdrantClient
    from qdrant_client.models import PointStruct
    import openai
    
    client = QdrantClient(host="localhost", port=6333)
    doc = fitz.open(file_path)
    filename = Path(file_path).name
    
    points = []
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text()
        
        # Chunk by paragraph with overlap
        paragraphs = [p.strip() for p in text.split('\n\n') if len(p.strip()) > 50]
        
        for i, para in enumerate(paragraphs):
            # Generate embedding
            response = openai.embeddings.create(
                model="text-embedding-3-small",
                input=para[:8000]  # Token limit safety
            )
            embedding = response.data[0].embedding
            
            # Unique ID combining file, page, chunk
            chunk_id = hashlib.md5(f"{filename}:{page_num}:{i}".encode()).hexdigest()
            
            points.append(PointStruct(
                id=chunk_id,
                vector=embedding,
                payload={
                    "text": para,
                    "source": filename,
                    "page": page_num + 1,
                    "chunk_index": i,
                    "total_chunks": len(paragraphs),
                    "document_type": "zoning_code" if "zoning" in filename.lower() else "historic"
                }
            ))
    
    # Upsert in batches
    batch_size = 100
    for i in range(0, len(points), batch_size):
        batch = points[i:i + batch_size]
        client.upsert(collection_name=collection_name, points=batch)
    
    print(f"Ingested {len(points)} chunks from {filename}")
    return len(points)

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python enhanced_ingest.py <pdf_file>")
        sys.exit(1)
    ingest_with_metadata(sys.argv[1])
```

**Commands:**
```bash
cd ~/ai-stack/zoning-clerk
pip install pymupdf
mkdir -p scripts
# Save above as scripts/enhanced_ingest.py
python scripts/enhanced_ingest.py data/AshtabulaZoningCode.pdf
python scripts/enhanced_ingest.py data/HistoricDistrictGuidelines.pdf
```

### 1.2 Update Chat API with Citation Return
```typescript
// app/api/chat/route.ts — Enhanced with citations
import { NextRequest, NextResponse } from 'next/server';
import { QdrantClient } from '@qdrant/js-client-rest';
import OpenAI from 'openai';

const qdrant = new QdrantClient({ host: '192.168.1.223', port: 6333 });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface Citation {
  text: string;
  source: string;
  page: number;
  relevanceScore: number;
}

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json();
    
    // Get query embedding
    const embeddingRes = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: message,
    });
    const queryVector = embeddingRes.data[0].embedding;
    
    // Search with higher limit for citation diversity
    const searchResult = await qdrant.search('zoning_docs', {
      vector: queryVector,
      limit: 5,
      with_payload: true,
    });
    
    // Build citations from results
    const citations: Citation[] = searchResult.map(hit => ({
      text: hit.payload?.text as string,
      source: hit.payload?.source as string,
      page: hit.payload?.page as number,
      relevanceScore: hit.score,
    }));
    
    // Format context with citation markers
    const contextWithCitations = citations.map((c, i) => 
      `[${i + 1}] From ${c.source}, page ${c.page}:\n${c.text}`
    ).join('\n\n');
    
    // Build system prompt with citation instructions
    const systemPrompt = `You are the Ashtabula Zoning Clerk Assistant. Answer zoning questions using ONLY the provided context.

CRITICAL RULES:
1. ALWAYS cite sources using [1], [2], [3], etc. format
2. If the answer spans multiple sources, cite each relevant source
3. If the context doesn't contain the answer, say "I don't have specific information about that in my current documents."
4. Be concise but complete — prioritize accuracy over brevity
5. For zoning decisions, always mention that official confirmation from the City Zoning Office is recommended

CONTEXT:
${contextWithCitations}`;
    
    // Call LLM
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.slice(-4), // Keep last 4 exchanges for context
        { role: 'user', content: message },
      ],
      temperature: 0.3, // Lower for more factual responses
      max_tokens: 800,
    });
    
    const answer = completion.choices[0].message.content;
    
    return NextResponse.json({
      answer,
      citations: citations.slice(0, 3), // Return top 3 for display
      confidence: searchResult[0]?.score || 0,
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process question', answer: null },
      { status: 500 }
    );
  }
}
```

---

## Step 2: Enhanced UI with Citation Display (45 min)

### 2.1 Citation Component
```typescript
// app/components/CitationCard.tsx
'use client';

interface CitationProps {
  index: number;
  source: string;
  page: number;
  text: string;
  relevanceScore: number;
}

export function CitationCard({ index, source, page, text, relevanceScore }: CitationProps) {
  const relevanceColor = relevanceScore > 0.8 ? 'bg-green-500' : 
                        relevanceScore > 0.6 ? 'bg-yellow-500' : 'bg-orange-500';
  
  return (
    <div className="border-l-4 border-blue-500 pl-4 py-2 mb-3 bg-slate-50 rounded-r">
      <div className="flex items-center gap-2 mb-1">
        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">
          [{index}]
        </span>
        <span className="text-sm font-medium text-slate-700">
          {source.replace('.pdf', '')}
        </span>
        <span className="text-sm text-slate-500">
          Page {page}
        </span>
        <div className={`ml-auto w-2 h-2 rounded-full ${relevanceColor}`} 
             title={`Relevance: ${(relevanceScore * 100).toFixed(1)}%`} />
      </div>
      <p className="text-sm text-slate-600 line-clamp-3">
        "{text.substring(0, 200)}{text.length > 200 ? '...' : ''}"
      </p>
    </div>
  );
}
```

### 2.2 Updated Chat Interface
```typescript
// app/components/ChatPanel.tsx — Enhanced with citations
'use client';

import { useState, useRef, useEffect } from 'react';
import { CitationCard } from './CitationCard';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: Array<{
    source: string;
    page: number;
    text: string;
    relevanceScore: number;
  }>;
  confidence?: number;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m the Ashtabula Zoning Clerk Assistant. Ask me about zoning districts, setbacks, permit requirements, or historic district guidelines.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCitations, setShowCitations] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [messages]);
  
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    
    try {
      const history = messages.slice(-4).map(m => ({
        role: m.role,
        content: m.content,
      }));
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history }),
      });
      
      const data = await res.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer || 'Sorry, I encountered an error.',
        citations: data.citations,
        confidence: data.confidence,
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I\'m having trouble connecting. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Confidence indicator */}
      {messages.length > 1 && messages[messages.length - 1].confidence !== undefined && (
        <div className="px-4 py-2 bg-slate-100 border-b flex items-center justify-between">
          <span className="text-xs text-slate-600">
            Last response confidence: {((messages[messages.length - 1].confidence || 0) * 100).toFixed(0)}%
          </span>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={showCitations}
              onChange={(e) => setShowCitations(e.target.checked)}
              className="rounded"
            />
            Show citations
          </label>
        </div>
      )}
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border'} rounded-lg p-4 shadow-sm`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              
              {/* Citations */}
              {msg.role === 'assistant' && msg.citations && showCitations && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                    Sources
                  </p>
                  {msg.citations.map((citation, cidx) => (
                    <CitationCard
                      key={cidx}
                      index={cidx + 1}
                      {...citation}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-lg p-4">
              <div className="flex gap-2">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about zoning, setbacks, permits..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Information provided may not be complete. Always verify with Ashtabula City Zoning Office.
        </p>
      </div>
    </div>
  );
}
```

---

## Step 3: Permit Wizard Component (60 min)

### 3.1 Wizard State Machine
```typescript
// app/components/PermitWizard.tsx
'use client';

import { useState } from 'react';

type WizardStep = 'project-type' | 'location' | 'size' | 'historic' | 'result';

interface WizardState {
  projectType: string | null;
  location: string | null;
  estimatedSize: string | null;
  inHistoricDistrict: boolean | null;
}

const PROJECT_TYPES = [
  { id: 'fence', label: 'Fence Installation', icon: '🏡' },
  { id: 'deck', label: 'Deck or Patio', icon: '🌳' },
  { id: 'shed', label: 'Shed or Garage', icon: '🏗️' },
  { id: 'addition', label: 'Home Addition', icon: '🏠' },
  { id: 'business', label: 'Business Signage', icon: '📋' },
  { id: 'demolition', label: 'Demolition', icon: '🏚️' },
];

const SIZE_RANGES = [
  { id: 'small', label: 'Under 200 sq ft', description: 'Small shed, minor fence' },
  { id: 'medium', label: '200–500 sq ft', description: 'Large shed, small deck' },
  { id: 'large', label: 'Over 500 sq ft', description: 'Garage, home addition' },
];

export function PermitWizard() {
  const [step, setStep] = useState<WizardStep>('project-type');
  const [state, setState] = useState<WizardState>({
    projectType: null,
    location: null,
    estimatedSize: null,
    inHistoricDistrict: null,
  });
  
  const updateState = (key: keyof WizardState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };
  
  const getPermitResult = () => {
    const results = [];
    
    // Building permit logic
    if (state.estimatedSize === 'large' || state.projectType === 'addition') {
      results.push({
        type: 'Building Permit',
        required: true,
        urgency: 'high',
        description: 'Required for all new construction over 200 sq ft and home additions.',
        contact: 'Ashtabula City Building Dept: (440) 992-7115',
      });
    }
    
    // Zoning clearance
    results.push({
      type: 'Zoning Clearance',
      required: true,
      urgency: 'medium',
      description: 'Verify setbacks and permitted uses for your property.',
      contact: 'City Planning & Zoning: (440) 992-7120',
    });
    
    // Historic district review
    if (state.inHistoricDistrict) {
      results.push({
        type: 'Historic Review',
        required: true,
        urgency: 'high',
        description: 'Historic District Commission review required for exterior changes visible from public right-of-way.',
        contact: 'Historic Preservation Office',
        timeline: 'Allow 30–45 days for HDC review',
      });
    }
    
    // Fence permit
    if (state.projectType === 'fence') {
      results.push({
        type: 'Fence Permit',
        required: true,
        urgency: 'medium',
        description: 'Required for all fences. Max height: 6 ft (back/side), 4 ft (front).',
        notes: 'Corner lots have additional visibility triangle requirements.',
      });
    }
    
    // Sign permit
    if (state.projectType === 'business') {
      results.push({
        type: 'Sign Permit',
        required: true,
        urgency: 'medium',
        description: 'All business signs require permit and must meet size/illumination standards.',
      });
    }
    
    return results;
  };
  
  const renderStep = () => {
    switch (step) {
      case 'project-type':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">What type of project?</h3>
            <div className="grid grid-cols-2 gap-3">
              {PROJECT_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => {
                    updateState('projectType', type.id);
                    setStep('location');
                  }}
                  className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition"
                >
                  <span className="text-2xl mr-2">{type.icon}</span>
                  <span className="font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
        
      case 'location':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Where is your property?</h3>
            <input
              type="text"
              placeholder="Enter your address..."
              className="w-full border rounded-lg px-4 py-3"
              onChange={(e) => updateState('location', e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setStep('project-type')}
                className="flex-1 py-2 border rounded-lg hover:bg-slate-50"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep('size')}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continue →
              </button>
            </div>
          </div>
        );
        
      case 'size':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Estimated size?</h3>
            <div className="space-y-2">
              {SIZE_RANGES.map(size => (
                <button
                  key={size.id}
                  onClick={() => {
                    updateState('estimatedSize', size.id);
                    setStep('historic');
                  }}
                  className="w-full p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left"
                >
                  <div className="font-medium">{size.label}</div>
                  <div className="text-sm text-slate-500">{size.description}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep('location')}
              className="w-full py-2 border rounded-lg hover:bg-slate-50"
            >
              ← Back
            </button>
          </div>
        );
        
      case 'historic':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Is your property in a historic district?</h3>
            <p className="text-sm text-slate-500">
              Historic districts include: Main Street, Lake Shore, and select designated areas.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  updateState('inHistoricDistrict', true);
                  setStep('result');
                }}
                className="flex-1 p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50"
              >
                <div className="text-2xl mb-1">🏛️</div>
                <div className="font-medium">Yes, historic district</div>
              </button>
              <button
                onClick={() => {
                  updateState('inHistoricDistrict', false);
                  setStep('result');
                }}
                className="flex-1 p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50"
              >
                <div className="text-2xl mb-1">🏠</div>
                <div className="font-medium">No, not historic</div>
              </button>
            </div>
            <button
              onClick={() => setStep('size')}
              className="w-full py-2 border rounded-lg hover:bg-slate-50"
            >
              ← Back
            </button>
          </div>
        );
        
      case 'result':
        const results = getPermitResult();
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Permit Requirements</h3>
            <div className="space-y-3">
              {results.map((result, idx) => (
                <div key={idx} className={`p-4 border-l-4 rounded-r ${
                  result.urgency === 'high' ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      result.urgency === 'high' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    <span className="font-semibold">{result.type}</span>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded bg-white">
                      {result.urgency === 'high' ? 'Required' : 'Recommended'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{result.description}</p>
                  {result.contact && (
                    <p className="text-sm text-slate-500 mt-1">📞 {result.contact}</p>
                  )}
                  {result.timeline && (
                    <p className="text-sm text-amber-600 mt-1">⏱️ {result.timeline}</p>
                  )}
                  {result.notes && (
                    <p className="text-sm text-slate-500 mt-1">💡 {result.notes}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep('project-type')}
                className="flex-1 py-2 border rounded-lg hover:bg-slate-50"
              >
                Start Over
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Print Summary
              </button>
            </div>
            <p className="text-xs text-slate-400 text-center">
              This is a guide only. Always confirm requirements with city officials.
            </p>
          </div>
        );
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Permit Wizard</h2>
        <p className="text-sm text-slate-500">Find what permits you need for your project</p>
      </div>
      {renderStep()}
    </div>
  );
}
```

---

## Step 4: Integration & Layout (30 min)

### 4.1 Main Page with Tabs
```typescript
// app/page.tsx — Full layout with chat, wizard, and info
'use client';

import { useState } from 'react';
import { ChatPanel } from './components/ChatPanel';
import { PermitWizard } from './components/PermitWizard';

type Tab = 'chat' | 'wizard' | 'contact';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Ashtabula Zoning Clerk</h1>
              <p className="text-blue-200 text-sm">AI-powered zoning assistance</p>
            </div>
            <div className="text-right text-sm text-blue-200">
              <p>Official confirmation always required</p>
              <p>City of Ashtabula, Ohio</p>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 flex gap-1">
          {[
            { id: 'chat', label: 'Ask Questions', icon: '💬' },
            { id: 'wizard', label: 'Permit Wizard', icon: '🧙' },
            { id: 'contact', label: 'City Contacts', icon: '📞' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`px-4 py-3 rounded-t-lg flex items-center gap-2 transition ${
                activeTab === tab.id
                  ? 'bg-white text-blue-900'
                  : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'chat' && (
          <div className="bg-white rounded-b-xl rounded-tr-xl shadow-lg h-[600px]">
            <ChatPanel />
          </div>
        )}
        
        {activeTab === 'wizard' && (
          <div className="bg-white rounded-b-xl rounded-tl-xl shadow-lg p-8">
            <PermitWizard />
          </div>
        )}
        
        {activeTab === 'contact' && (
          <div className="bg-white rounded-b-xl rounded-tl-xl shadow-lg p-8">
            <h2 className="text-xl font-bold mb-6">City of Ashtabula Contacts</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-blue-900">Building Department</h3>
                <p className="text-slate-600">Permits, inspections, code compliance</p>
                <p className="text-slate-800 font-medium mt-2">(440) 992-7115</p>
                <p className="text-sm text-slate-500">4405 Main Avenue, Ashtabula, OH 44004</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-blue-900">Planning & Zoning</h3>
                <p className="text-slate-600">Zoning clearance, variances, land use</p>
                <p className="text-slate-800 font-medium mt-2">(440) 992-7120</p>
                <p className="text-sm text-slate-500">4405 Main Avenue, Ashtabula, OH 44004</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-blue-900">Historic Preservation</h3>
                <p className="text-slate-600">Historic district review, certificates</p>
                <p className="text-slate-800 font-medium mt-2">(440) 992-7125</p>
                <p className="text-sm text-slate-500">Contact for Historic District Commission dates</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-blue-900">Engineering</h3>
                <p className="text-slate-600">Stormwater, infrastructure, curb cuts</p>
                <p className="text-slate-800 font-medium mt-2">(440) 992-7110</p>
                <p className="text-sm text-slate-500">4405 Main Avenue, Ashtabula, OH 44004</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm">
                <strong>⚠️ Important:</strong> The information provided by this AI assistant 
                is for guidance only. Always verify requirements and obtain official approval 
                from the relevant city department before starting your project.
              </p>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-slate-500">
        <p>© 2025 Ashtabula Zoning Clerk Assistant — Built for the City of Ashtabula, Ohio</p>
        <p className="mt-1">This tool uses AI and may contain errors. Not a substitute for professional legal advice.</p>
      </footer>
    </div>
  );
}
```

---

## Step 5: Pre-Deployment Checklist (30 min)

### 5.1 Environment & Config Validation
```bash
# Create production env template
cat > .env.production << 'EOF'
# OpenAI (Required)
OPENAI_API_KEY=sk-...

# Qdrant (Internal network)
QDRANT_HOST=192.168.1.223
QDRANT_PORT=6333

# Optional: Analytics
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
EOF

echo "✓ Production env template created"
```

### 5.2 Build Verification
```bash
# Verify build succeeds
npm run build

# Check for common issues
npm run lint
```

### 5.3 Pre-Launch Checklist
```bash
# Test data ingestion
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are the fence height limits in R-1 zoning?"}'

# Verify citations appear
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Do I need a permit for a 12x16 shed?"}' | jq '.citations'
```

---

## Verification Checklist

- [ ] Enhanced ingestion script stores page numbers and filenames
- [ ] Chat API returns citations array with source, page, text
- [ ] Citation cards display in UI with relevance indicators
- [ ] Permit wizard flows through all 4 steps and produces results
- [ ] Tab navigation works (Chat, Wizard, Contact)
- [ ] Disclaimer appears on all pages
- [ ] Build succeeds with no errors
- [ ] Environment variables configured for production

---

## Phase 3C Preview (Next Steps)

1. **Analytics & Monitoring** — Track popular questions, failed lookups
2. **Feedback Loop** — Thumbs up/down on answers with correction flow
3. **Multi-Document Search** — PDF viewer integration with highlight jump
4. **Mobile Polish** — Responsive refinements, touch optimizations
5. **SEO & Metadata** — OpenGraph, sitemap, search indexing

---

## Deployment Quick Reference

```bash
# Production build
cd ~/ai-stack/zoning-clerk
npm run build

# Deploy to Vercel (if using)
vercel --prod

# Or serve locally via PM2
pm2 start npm --name "zoning-clerk" -- start
pm2 save
```

---

*Document Version: 3B.1*  
*Last Updated: 2026-02-15*  
*Author: Rondell ♟️*
