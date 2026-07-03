import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Send,
  User,
  CircleUserRound,
  Bot,
  Loader2,
  FileText,
  ShieldCheck,
  ArrowUp,
  Landmark,
} from 'lucide-react';
import { CitationsList } from '../components/CitationCard';
import { IntakeDrawer } from '../components/IntakeDrawer';
import {
  askRagService,
  checkRagHealth,
  checkRequestHealth,
  FALLBACK_CONTEXT,
} from '../lib/rag';

function ChatHero() {
  return (
    <div className="saybrook-hero animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <h1 className="font-display">zoning? codes? permits?<br/><span className="text-saybrook-sand italic saybrook-hero-highlight">don't worry — we got this.</span></h1>
    </div>
  );
}

export function ChatAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Good morning. I am the Saybrook Township digital zoning clerk. How can I assist you with your project or property today?",
      citations: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ragStatus, setRagStatus] = useState('checking');
  const [requestStatus, setRequestStatus] = useState('checking');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    propertyAddress: '',
    projectSummary: '',
    requestType: 'zoning guidance',
    preferredContact: 'email',
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const messagesEndRef = useRef(null);
  
  // scroll container ref to mask top
  const scrollRef = useRef(null);

  const checkStatus = useCallback(async () => {
    const healthy = await checkRagHealth();
    setRagStatus(healthy ? 'connected' : 'fallback');
    const healthyRequest = await checkRequestHealth();
    setRequestStatus(healthyRequest ? 'connected' : 'fallback');
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  async function handleSend(e, overrideInput = null) {
    if (e) e.preventDefault();
    const messageText = overrideInput || input;
    if (!messageText.trim() || isLoading) return;

    setInput('');
    const userMsg = { role: 'user', content: messageText, citations: [] };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      if (ragStatus !== 'connected') {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Notice: Automated knowledge service is currently unavailable.\n\n${FALLBACK_CONTEXT}\n\nPlease contact the Saybrook Township Zoning Office directly for assistance.`,
            citations: [],
          },
        ]);
        return;
      }

      const result = await askRagService(messageText, [...messages, userMsg].slice(1));

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result.answer,
          citations: result.citations?.length > 0 ? result.citations : undefined,
        },
      ]);
    } catch (error) {
      console.error('Saybrook RAG error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I had a bit of trouble connecting to our municipal records. Please try your question again, or reach out to the township office directly.',
          citations: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="saybrook-main">
      <div className="saybrook-header-mask" />
      
      {/* Top Header / Nav */}
      <header className="absolute top-0 left-0 right-0 h-16 bg-white/70 backdrop-blur-xl border-b-[1.5px] border-black/10 z-30 flex items-center justify-between px-6 lg:px-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="saybrook-header-icon">
            <Landmark size={36} className="text-saybrook-forest" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-display text-lg text-saybrook-forest font-semibold tracking-tight leading-none mt-0.5">Digital Zoning Clerk</h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Saybrook Township</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.08em] text-slate-800">
            <span>Questions?</span>
            <span className="text-sm font-black text-saybrook-forest tracking-tighter">(440) 576-3737</span>
          </div>
        </div>
      </header>

      {/* Chat Scroll Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 lg:px-10 pt-8 pb-32" ref={scrollRef}>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="pt-6 pb-12 text-center animate-in fade-in duration-1000">
            <ChatHero />
          </div>
          
          {messages.map((message, idx) => {
            // Hide the first assistant welcome message to prevent layout shifts/duplication
            if (idx === 0 && message.role === 'assistant') return null;
            
            const isUser = message.role === 'user';
            return (
              <div
                key={idx}
                className={`flex w-full animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both ${isUser ? 'justify-end' : 'justify-start'}`}
                style={{ animationDelay: `${Math.min(idx * 50, 300)}ms` }}
              >
                <div className={`flex gap-5 max-w-[78%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start`}>
                  
                  {/* Avatar */}
                  <div className={`w-11 h-11 rounded-full shrink-0 flex items-center justify-center saybrook-avatar mt-1 border-[2.5px] group transition-all duration-500 ${
                    isUser 
                      ? 'bg-saybrook-forest text-white border-saybrook-sand shadow-xl' 
                      : 'bg-white text-saybrook-forest border-saybrook-sand/80 saybrook-avatar-bot shadow-lg'
                  }`}>
                    {isUser ? <User size={22} strokeWidth={2.5} className="text-white" /> : <Bot size={22} className="text-saybrook-forest" />}
                  </div>

                  {/* Message Body */}
                  <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div className="mb-2 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                      {isUser ? 'You' : 'Zoning Clerk'}
                    </div>
                    
                    <div className={`py-4 px-6 border-[1.5px] ${
                      isUser
                        ? 'bg-[#f4faf7] text-saybrook-forest border-saybrook-sand/20 rounded-3xl rounded-tr-[4px] shadow-[0_15px_35px_-10px_rgba(16,40,32,0.18),0_10px_15px_-8px_rgba(16,40,32,0.08)]'
                        : 'bg-white text-saybrook-ink shadow-[0_15px_40px_-10px_rgba(0,0,0,0.12),0_10px_15px_-8px_rgba(0,0,0,0.05)] border-saybrook-sand/15 rounded-3xl rounded-tl-[4px]'
                    }`}>
                      <div className="text-[1.1rem] leading-snug font-medium whitespace-pre-wrap">
                        {message.content}
                      </div>

                      {message.citations && message.citations.length > 0 && (
                        <div className="mt-5 pt-5 border-t border-black/5">
                          <CitationsList citations={message.citations} />
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex w-full justify-start animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex gap-5 max-w-[85%] flex-row">
                <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center saybrook-forest text-saybrook-sand saybrook-avatar saybrook-avatar-bot bg-saybrook-forest">
                  <Bot size={22} className="text-saybrook-sand" />
                </div>
                <div className="flex flex-col items-start">
                  <div className="mb-2 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Zoning Clerk
                  </div>
                  <div className="py-3 px-5 bg-white text-saybrook-ink shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200/60 rounded-2xl rounded-tl-[4px] flex items-center gap-4 text-saybrook-forest">
                    <Loader2 size={18} className="animate-spin text-saybrook-forest/60" />
                    <span className="text-[1.05rem] font-medium leading-snug opacity-80">Consulting municipal code...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Composer */}
      <div className="saybrook-composer-container">
        <form onSubmit={handleSend} className="saybrook-composer">
          <input
            id="saybrook-zoning-question"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="saybrook-input"
            placeholder="Inquire about property codes, setbacks, or permits..."
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="saybrook-submit-golden"
          >
            <ArrowUp size={20} className="text-black" strokeWidth={3} />
          </button>
        </form>
        <div className="mt-3 flex items-center justify-end gap-5 max-w-3xl mx-auto w-full px-4">
          <p className="text-[12px] font-medium text-slate-400 italic">
            When you're ready, click here to automatically submit a request.
          </p>
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-saybrook-sand/20 text-saybrook-forest font-bold uppercase text-[10px] tracking-widest border border-saybrook-sand/30 hover:bg-saybrook-sand/30 transition-all active:scale-[0.98]"
          >
            <FileText size={14} />
            Start Formal Review
          </button>
        </div>
      </div>

      <IntakeDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        messages={messages}
        requestForm={requestForm}
        setRequestForm={setRequestForm}
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages}
      />
    </div>
  );
}
