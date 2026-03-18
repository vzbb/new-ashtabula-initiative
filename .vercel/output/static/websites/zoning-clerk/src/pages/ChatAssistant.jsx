import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, AlertCircle, Building2 } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { QuickQuestions } from '../components/QuickQuestions';
import { CitationsList } from '../components/CitationCard';
import { 
  generateQueryEmbedding, 
  searchContext, 
  buildSystemPrompt, 
  extractCitations,
  FALLBACK_CONTEXT 
} from '../lib/rag';

// Message structure now includes citations
// { role: 'assistant', content: string, citations?: Citation[] }

export function ChatAssistant() {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hello! I am your Ashtabula Zoning Assistant. I can help you understand zoning codes, permit requirements, and the historic district review process.\n\nWhat can I help you with today?',
      citations: []
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ragStatus, setRagStatus] = useState('checking'); // 'checking' | 'connected' | 'fallback'
  const messagesEndRef = useRef(null);

  // Check RAG connection on mount
  useEffect(() => {
    checkRagStatus();
  }, []);

  const checkRagStatus = async () => {
    try {
      const response = await fetch('http://192.168.1.223:6333/collections/zoning_ashtabula');
      if (response.ok) {
        setRagStatus('connected');
      } else {
        setRagStatus('fallback');
      }
    } catch {
      setRagStatus('fallback');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickQuestion = (query) => {
    setInput(query);
    // Auto-submit after a brief delay to show the user what was selected
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} };
      handleSend(fakeEvent, query);
    }, 100);
  };

  const handleSend = async (e, overrideInput = null) => {
    if (e) e.preventDefault();
    const messageText = overrideInput || input;
    if (!messageText.trim() || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageText, citations: [] }]);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      let contextChunks = [];
      let systemPrompt;

      // Attempt RAG retrieval if connected
      if (ragStatus === 'connected') {
        try {
          const queryEmbedding = await generateQueryEmbedding(messageText, apiKey);
          contextChunks = await searchContext(queryEmbedding, 5, 0.7);
        } catch (ragError) {
          console.warn('RAG retrieval failed, using fallback:', ragError);
        }
      }

      // Build system prompt with context (RAG or fallback)
      if (contextChunks.length > 0) {
        systemPrompt = buildSystemPrompt(contextChunks);
      } else {
        systemPrompt = `You are the Ashtabula Zoning Assistant. 

${FALLBACK_CONTEXT}

Instructions:
1. Answer based on the context provided above
2. Always cite sources when possible
3. If you don't know, direct users to contact PCD at (440) 992-7125
4. Include the disclaimer about seeking official guidance`;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const chat = model.startChat({
        history: messages.slice(1).map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          maxOutputTokens: 1500,
          temperature: 0.3,
        },
      });

      const result = await chat.sendMessage([
        { text: systemPrompt },
        { text: messageText }
      ]);
      const response = await result.response;
      const rawText = response.text();

      // Extract citations from response
      const { text: cleanText, citations } = extractCitations(rawText, contextChunks);

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: cleanText,
        citations: citations.length > 0 ? citations : undefined
      }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble connecting to my knowledge base. Please try again or contact the Planning Department at (440) 992-7125.",
        citations: []
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-500">
      {/* Header */}
      <div className="p-6 border-b bg-ashtabula-primary flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-ashtabula-secondary flex items-center justify-center text-ashtabula-primary shadow-inner">
            <Building2 size={24} />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Zoning Assistant</h3>
            <p className="text-xs text-ashtabula-secondary flex items-center gap-1.5 font-bold uppercase tracking-widest">
              <span className={`w-2 h-2 rounded-full animate-pulse ${
                ragStatus === 'connected' ? 'bg-green-400' : 
                ragStatus === 'checking' ? 'bg-yellow-400' : 'bg-orange-400'
              }`}></span>
              {ragStatus === 'connected' ? 'RAG Connected' : 
               ragStatus === 'checking' ? 'Connecting...' : 'Fallback Mode'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-ashtabula-bg/50">
        {messages.map((message, idx) => (
          <div key={idx} className={cn(
            "flex gap-4",
            message.role === 'user' ? "ml-auto flex-row-reverse max-w-[85%]" : "max-w-[90%]"
          )}>
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
              message.role === 'user' ? "bg-ashtabula-secondary text-ashtabula-primary" : "bg-ashtabula-primary text-white"
            )}>
              {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className={cn(
              "flex-1",
              message.role === 'user' ? "" : ""
            )}>
              <div className={cn(
                "p-5 rounded-3xl text-sm leading-relaxed shadow-sm border",
                message.role === 'user' 
                  ? "bg-ashtabula-primary text-white rounded-tr-none border-ashtabula-primary" 
                  : "bg-white text-slate-700 border-slate-100 rounded-tl-none"
              )}>
                {message.content}
              </div>
              
              {/* Citation cards for assistant messages */}
              {message.role === 'assistant' && message.citations && (
                <CitationsList citations={message.citations} />
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4 max-w-[85%] animate-pulse">
            <div className="w-10 h-10 rounded-2xl bg-ashtabula-primary flex items-center justify-center text-white">
              <Bot size={20} />
            </div>
            <div className="p-5 bg-white border border-slate-100 rounded-3xl rounded-tl-none flex items-center gap-3 text-slate-400">
              <Loader2 size={18} className="animate-spin text-ashtabula-secondary" />
              <span className="font-medium">Searching documents...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-8 border-t bg-white">
        <QuickQuestions 
          onSelect={handleQuickQuestion} 
          disabled={isLoading}
        />
        
        <form onSubmit={handleSend} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your zoning question here..."
            className="w-full pl-6 pr-16 py-4 bg-ashtabula-bg border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-ashtabula-primary/5 focus:border-ashtabula-primary transition-all text-lg"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 p-3 bg-ashtabula-primary text-white rounded-xl hover:bg-ashtabula-accent disabled:opacity-50 transition-all shadow-lg shadow-ashtabula-primary/20"
          >
            <Send size={24} />
          </button>
        </form>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <AlertCircle size={12} className="text-ashtabula-secondary" />
            <span>Informational only • Not legal advice</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Contact PCD: <a href="tel:440-992-7125" className="text-ashtabula-primary hover:underline">(440) 992-7125</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}
