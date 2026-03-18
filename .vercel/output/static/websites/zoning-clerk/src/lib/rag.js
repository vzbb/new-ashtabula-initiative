/**
 * RAG (Retrieval Augmented Generation) Utilities
 * 
 * Provides vector search capabilities using Qdrant for the zoning-clerk
 * application. Searches embedded city documents to find relevant context
 * for user queries.
 */

const QDRANT_URL = 'http://192.168.1.223:6333';
const COLLECTION_NAME = 'zoning_ashtabula';
const EMBEDDING_DIMENSIONS = 768; // Gemini text-embedding-004

/**
 * Generate embedding for a query using Gemini API
 * Note: This should be done server-side in production
 */
export async function generateQueryEmbedding(query, apiKey) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: {
            parts: [{ text: query }]
          }
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(`Embedding API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.embedding.values;
  } catch (error) {
    console.error('Failed to generate embedding:', error);
    throw error;
  }
}

/**
 * Search Qdrant for relevant document chunks
 */
export async function searchContext(queryEmbedding, limit = 5, scoreThreshold = 0.7) {
  try {
    const response = await fetch(`${QDRANT_URL}/collections/${COLLECTION_NAME}/points/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vector: queryEmbedding,
        limit: limit,
        score_threshold: scoreThreshold,
        with_payload: true
      })
    });
    
    if (!response.ok) {
      throw new Error(`Qdrant search error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.result.map(hit => ({
      text: hit.payload.text,
      source: hit.payload.source || 'Unknown Document',
      section: hit.payload.section,
      page: hit.payload.page,
      score: hit.score
    }));
  } catch (error) {
    console.error('RAG search failed:', error);
    return []; // Return empty on error to allow fallback
  }
}

/**
 * Build a system prompt with retrieved context
 */
export function buildSystemPrompt(contextChunks, baseContext = '') {
  const contextText = contextChunks
    .map((chunk, idx) => `[${idx + 1}] Source: ${chunk.source}${chunk.section ? `, ${chunk.section}` : ''}${chunk.page ? `, Page ${chunk.page}` : ''}\n${chunk.text}`)
    .join('\n\n---\n\n');
  
  return `You are the Ashtabula Zoning Assistant, a helpful AI that answers questions about zoning, permits, and historic district requirements for the City of Ashtabula, Ohio.

RETRIEVED CONTEXT FROM OFFICIAL DOCUMENTS:
${contextText}

${baseContext}

INSTRUCTIONS:
1. Answer based PRIMARILY on the provided context documents
2. Always cite your sources using [Source: Document Name, Section X] format
3. If the context doesn't contain the answer, say: "I don't have specific information about that in my current documents. For accurate guidance, please contact the Planning & Community Development office at (440) 992-7125 or PCD@cityofashtabula.com."
4. Never make up information or cite documents not in the context
5. Keep answers concise but complete
6. Include relevant procedure steps when available
7. Always end with the disclaimer about seeking official guidance

CITATION FORMAT:
- Use inline citations like: [Source: Historic District Zoning Guide, Section 1115.03]
- For multiple sources, cite all relevant ones
- If page number is available, include it: [Source: City Welcome Info, p. 3]

DISCLAIMER TO INCLUDE:
"This information is based on official city documents but is for general guidance only. For binding decisions, contact PCD at (440) 992-7125."`;
}

/**
 * Extract citations from LLM response text
 */
export function extractCitations(responseText, contextChunks) {
  const citationRegex = /\[Source: ([^\]]+)\]/g;
  const citations = [];
  
  let match;
  while ((match = citationRegex.exec(responseText)) !== null) {
    const citationText = match[1];
    
    // Parse source name and section/page
    const parts = citationText.split(',').map(p => p.trim());
    const source = parts[0];
    const section = parts.find(p => p.toLowerCase().includes('section'));
    const pageMatch = parts.find(p => p.toLowerCase().includes('page') || p.toLowerCase().includes('p.'));
    const page = pageMatch ? parseInt(pageMatch.match(/\d+/)?.[0]) : undefined;
    
    // Find matching context chunk for quote
    const matchingChunk = contextChunks.find(chunk => 
      chunk.source.toLowerCase().includes(source.toLowerCase())
    );
    
    citations.push({
      source,
      section,
      page,
      quote: matchingChunk ? matchingChunk.text.substring(0, 200) + '...' : undefined,
      score: matchingChunk?.score
    });
  }
  
  // Remove citation markers from display text
  const cleanText = responseText.replace(citationRegex, '');
  
  return { text: cleanText, citations };
}

/**
 * Fallback context when RAG is unavailable
 */
export const FALLBACK_CONTEXT = `
Ashtabula Harbor Historical District
The Harbor Historical District has zoning to protect historic buildings and preserve the character of the old Harbor neighborhood. Established in 1978. Boundaries: ordinance 2010-04, section 1137.02.
Review Board: The Architectural and Restoration Review Board reviews all signs and exterior changes (alterations, restoration, rehabilitation, and construction). 
Process: Submit an Application for Review before receiving a zoning permit. Review Board holds monthly meetings. If approved, they issue a Certificate of Appropriateness. Then city zoning official issues a permit.
National Register Properties: Any work done to exterior of National Register Property must be reviewed even if it doesn't require a zoning permit.
Includes: Hubbard House, Mother of Sorrows Catholic Church, Bascule Lift Bridge, 1000-1205 Bridge Street.

General City Info: Located at 4717 Main Avenue, Phone: (440) 992-7125.
Office Hours: Mon-Fri 8:00 AM - 4:30 PM.
Planning & Community Development (PCD) is the department in charge.
`;
