import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Send,
  User,
  Bot,
  Loader2,
  AlertCircle,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { QuickQuestions } from '../components/QuickQuestions';
import { CitationsList } from '../components/CitationCard';
import { IntakeDrawer } from '../components/IntakeDrawer';
import {
  askRagService,
  checkRagHealth,
  checkRequestHealth,
  FALLBACK_CONTEXT,
  getRagConfiguration,
  getRequestConfiguration,
} from '../lib/rag';

export function ChatAssistant() {
  const ragConfig = getRagConfiguration();
  const requestConfig = getRequestConfiguration();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Saybrook Township digital zoning assistant active. State your inquiry.',
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

  const checkStatus = useCallback(async () => {
    if (!ragConfig.enabled) {
      setRagStatus('fallback');
    } else {
      const healthy = await checkRagHealth();
      setRagStatus(healthy ? 'connected' : 'fallback');
    }

    if (!requestConfig.enabled) {
      setRequestStatus('fallback');
    } else {
      const healthyRequest = await checkRequestHealth();
      setRequestStatus(healthyRequest ? 'connected' : 'fallback');
    }
  }, [ragConfig.enabled, requestConfig.enabled]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleQuickQuestion(query) {
    setInput(query);
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} };
      handleSend(fakeEvent, query);
    }, 100);
  }

  async function handleSend(e, overrideInput = null) {
    if (e) e.preventDefault();
    const messageText = overrideInput || input;
    if (!messageText.trim() || isLoading) return;

    setInput('');
    const nextMessages = [...messages, { role: 'user', content: messageText, citations: [] }];
    setMessages((prev) => [...prev, { role: 'user', content: messageText, citations: [] }]);
    setIsLoading(true);

    try {
      if (ragStatus !== 'connected') {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `The official Saybrook zoning knowledge service is currently unavailable.\n\n${FALLBACK_CONTEXT}\n\nPlease try again shortly, or contact the Saybrook Township Zoning Office directly while the connection is re-established.`,
            citations: [],
          },
        ]);
        return;
      }

      const result = await askRagService(messageText, nextMessages.slice(1));

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result.answer,
          citations: result.citations.length > 0 ? result.citations : undefined,
        },
      ]);
      setDrawerOpen(true);
    } catch (error) {
      console.error('Saybrook RAG error:', error);
      setRagStatus('fallback');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'A communication error occurred with the Saybrook zoning knowledge service. Please try again in a moment, or contact the Saybrook Township Zoning Office directly.',
          citations: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      uploadedImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, [uploadedImages]);

  return (
    <div className="saybrook-chat-shell flex w-full flex-col overflow-hidden animate-in fade-in duration-500">
      <div className="saybrook-chat-topbar p-4 sm:p-5 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="saybrook-chat-header flex flex-row items-center justify-between">
          <div className="saybrook-chat-brand">
            <div className="saybrook-chat-heading">
              <p className="saybrook-chat-kicker">Saybrook Township Zoning Service</p>
              <h3 className="saybrook-chat-title">Official Zoning Inquiry Terminal</h3>
              <p className="saybrook-chat-subtitle hidden sm:block">
                Review official code citations, then submit for official review to the township office.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saybrook-forest text-white text-sm font-bold shadow-lg shadow-saybrook-forest/20 hover:bg-saybrook-fern transition-all active:scale-[0.98]"
            >
              <FileText size={18} />
              Submit for Official Review
            </button>
            <p className="saybrook-chat-status">
              <span
                className="saybrook-chat-status-dot"
                data-state={
                  ragStatus === 'connected'
                    ? 'live'
                    : ragStatus === 'checking'
                      ? 'warm'
                      : 'soft'
                }
              />
              <span className="hidden sm:inline">
                {ragStatus === 'connected'
                  ? 'Station Active'
                  : ragStatus === 'checking'
                    ? 'Initializing'
                    : 'Connection Error'}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="saybrook-chat-stream flex-1 space-y-6 overflow-y-auto p-5 sm:p-6 bg-slate-50/30">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={cn(
              'flex gap-4',
              message.role === 'user' ? 'ml-auto flex-row-reverse max-w-[85%]' : 'max-w-[90%]'
            )}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm',
                message.role === 'user'
                  ? 'bg-saybrook-lake/20 text-saybrook-forest'
                  : 'bg-saybrook-forest text-white'
              )}
            >
              {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className="flex-1">
              <div
                className={cn(
                  'p-5 rounded-3xl text-sm leading-relaxed shadow-sm border',
                  message.role === 'user'
                    ? 'bg-saybrook-forest text-white rounded-tr-none border-saybrook-forest'
                    : 'bg-white text-slate-700 border-slate-100 rounded-tl-none'
                )}
              >
                {message.content}
              </div>

              {message.role === 'assistant' && message.citations && (
                <CitationsList citations={message.citations} />
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 max-w-[85%] animate-pulse">
            <div className="w-10 h-10 rounded-2xl bg-saybrook-forest flex items-center justify-center text-white">
              <Bot size={20} />
            </div>
            <div className="p-5 bg-white border border-slate-100 rounded-3xl rounded-tl-none flex items-center gap-3 text-slate-400">
              <Loader2 size={18} className="animate-spin text-saybrook-lake" />
              <span className="font-medium text-slate-900">Accessing Saybrook Municipal Records...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="saybrook-chat-footer p-4 sm:p-5 bg-white border-t border-slate-100 sticky bottom-0 z-10">
        <div className="max-w-4xl mx-auto w-full">
          <div className="saybrook-composer-shell">
            <div className="saybrook-composer-head flex items-center justify-between">
              <div>
                <p className="saybrook-composer-kicker">Direct Entry</p>
                <h4 className="saybrook-composer-title">Input primary inquiry for official processing.</h4>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="md:hidden p-2 rounded-lg bg-saybrook-cream text-saybrook-forest"
                aria-label="Submit for Official Review"
              >
                <FileText size={20} />
              </button>
              <span className="saybrook-composer-signal hidden sm:flex font-bold">
                <AlertCircle size={14} />
                Official Cited Response
              </span>
            </div>

            <form onSubmit={handleSend} className="saybrook-composer-form">
              <label className="saybrook-composer-label font-bold text-slate-900" htmlFor="saybrook-zoning-question">
                Type your zoning inquiry
              </label>
              <div className="saybrook-composer-row">
                <input
                  id="saybrook-zoning-question"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="State your question (e.g., fence height regulations)"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="saybrook-composer-send"
                  aria-label="Send inquiry"
                >
                  <Send size={22} />
                </button>
              </div>
            </form>
          </div>

          <div className="saybrook-prompt-shell mt-4">
            <QuickQuestions onSelect={handleQuickQuestion} disabled={isLoading} />
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
            <div className="text-[10px] text-slate-500">
              Township Direct Support:{' '}
              <a href="tel:440-576-3737" className="text-saybrook-forest hover:underline font-bold">
                (440) 576-3737
              </a>
            </div>
            <div className="flex gap-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                <div className={`w-1.5 h-1.5 rounded-full ${requestConfig.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                {requestConfig.enabled ? 'Official Queue Accessible' : 'Manual Handoff Required'}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                <div className={`w-1.5 h-1.5 rounded-full ${requestStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {requestStatus === 'connected' ? 'Network Connected' : 'Internal Routing'}
              </span>
            </div>
          </div>
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

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}
