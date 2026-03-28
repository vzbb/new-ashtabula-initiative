import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Send,
  User,
  Bot,
  Loader2,
  AlertCircle,
  FileText,
  Upload,
  Mail,
  CheckCircle2,
  FileImage,
  ClipboardCopy,
  ArrowRight,
} from 'lucide-react';
import { QuickQuestions } from '../components/QuickQuestions';
import { CitationsList } from '../components/CitationCard';
import {
  askRagService,
  checkRagHealth,
  checkRequestHealth,
  FALLBACK_CONTEXT,
  getRagConfiguration,
  getRequestConfiguration,
  submitFormalRequest,
} from '../lib/rag';

export function ChatAssistant() {
  const ragConfig = getRagConfiguration();
  const requestConfig = getRequestConfiguration();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello. I can help you search the Saybrook zoning code, pull the relevant sections, and turn your question into a township-ready request.',
      citations: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ragStatus, setRagStatus] = useState('checking');
  const [requestStatus, setRequestStatus] = useState('checking');
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestDraftReady, setRequestDraftReady] = useState(false);
  const [requestSubmissionState, setRequestSubmissionState] = useState('idle');
  const [requestSubmissionMessage, setRequestSubmissionMessage] = useState('');
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
            content: `The live Saybrook zoning knowledge service is not connected right now.\n\n${FALLBACK_CONTEXT}\n\nPlease try again shortly, or contact the Saybrook Township Zoning Office directly while the service reconnects.`,
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
      setRequestOpen(true);
    } catch (error) {
      console.error('Saybrook RAG error:', error);
      setRagStatus('fallback');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I hit a problem reaching the Saybrook zoning knowledge service. Please try again in a moment, or contact the Saybrook Township Zoning Office directly while the service reconnects.',
          citations: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function getLatestAssistantReply() {
    return [...messages].reverse().find((message) => message.role === 'assistant');
  }

  function getLatestUserQuestion() {
    return [...messages].reverse().find((message) => message.role === 'user')?.content || '';
  }

  function buildRequestDraft() {
    const lastAssistantReply = getLatestAssistantReply()?.content || '';
    const summary = requestForm.projectSummary.trim() || getLatestUserQuestion();

    return {
      fullName: requestForm.fullName || 'Not provided',
      email: requestForm.email || 'Not provided',
      phone: requestForm.phone || 'Not provided',
      preferredContact: requestForm.preferredContact || 'email',
      propertyAddress: requestForm.propertyAddress || 'Not provided',
      request_type: requestForm.requestType,
      residentSummary: summary || 'Not provided',
      aiContextSummary: lastAssistantReply || 'No AI response captured yet.',
      imageCount: uploadedImages.length,
      imageNames: uploadedImages.map((image) => image.file.name),
      queueDestination: 'Saybrook Township queue',
      nextStep:
        'Route the summary to the Saybrook Township Zoning Office queue for staff follow-up.',
    };
  }

  function handleFormalizeRequest() {
    setRequestDraftReady(true);
    setRequestSubmissionState('idle');
    setRequestSubmissionMessage('');
  }

  function updateRequestField(field, value) {
    setRequestForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleImageUpload(event) {
    const files = Array.from(event.target.files || []).slice(0, 2);
    const images = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setUploadedImages((current) => {
      current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
      return images;
    });
    event.target.value = '';
  }

  useEffect(() => {
    return () => {
      uploadedImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, [uploadedImages]);

  async function handleQueueSubmit() {
    const requestDraft = buildRequestDraft();

    if (!requestDraftReady) {
      setRequestDraftReady(true);
      return;
    }

    if (!requestConfig.enabled) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(requestDraft, null, 2));
        setRequestSubmissionState('copied');
        setRequestSubmissionMessage(
          'Queue endpoint unavailable. The request packet was copied for handoff.'
        );
      } catch {
        setRequestSubmissionState('error');
        setRequestSubmissionMessage(
          'Queue endpoint unavailable and the request packet could not be copied automatically.'
        );
      }
      return;
    }

    setRequestSubmissionState('submitting');
    setRequestSubmissionMessage('');

    try {
      const response = await submitFormalRequest({
        ...requestDraft,
        attachments: uploadedImages.map((image) => image.file),
      });

      setRequestSubmissionState('submitted');
      setRequestSubmissionMessage(
        response.queueId
          ? `Request submitted successfully. Queue ID: ${response.queueId}`
          : response.message || 'Request submitted successfully.'
      );
    } catch (error) {
      console.error('Saybrook request submission error:', error);
      setRequestSubmissionState('error');
      setRequestSubmissionMessage(
        error.message || 'The request could not be handed off to the township queue.'
      );
    }
  }

  const requestDraft = buildRequestDraft();
  const mailtoBody = encodeURIComponent(
    `Hello Saybrook Township Zoning Office,\n\nI would like to submit a zoning-related request.\n\nName: ${requestDraft.fullName}\nEmail: ${requestDraft.email}\nPhone: ${requestDraft.phone}\nPreferred contact: ${requestDraft.preferredContact}\nProperty address: ${requestDraft.propertyAddress}\nRequest type: ${requestDraft.request_type}\n\nResident summary:\n${requestDraft.residentSummary}\n\nAI-assisted context summary:\n${requestDraft.aiContextSummary}\n\nAttached images to bring/reference: ${requestDraft.imageCount}\n\nPlease let me know the best next step for an official review.\n`
  );

  return (
    <div className="saybrook-chat-shell flex w-full flex-col overflow-hidden animate-in fade-in duration-500">
      <div className="saybrook-chat-topbar p-4 sm:p-5">
        <div className="saybrook-chat-header">
          <div className="saybrook-chat-brand">
            <div className="saybrook-chat-heading">
              <p className="saybrook-chat-kicker">Saybrook Township zoning service</p>
              <h3 className="saybrook-chat-title">Ask in plain English. Get cited code.</h3>
              <p className="saybrook-chat-subtitle">
                Review the cited code, then open the request panel if you need township follow-up.
              </p>
            </div>
          </div>
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
            {ragStatus === 'connected'
              ? 'Assistant live'
              : ragStatus === 'checking'
                ? 'Connecting'
                : 'Reconnect needed'}
          </p>
        </div>
      </div>

      <div className="saybrook-chat-stream flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
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
                  ? 'bg-ashtabula-secondary text-ashtabula-primary'
                  : 'bg-ashtabula-primary text-white'
              )}
            >
              {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className="flex-1">
              <div
                className={cn(
                  'p-5 rounded-3xl text-sm leading-relaxed shadow-sm border',
                  message.role === 'user'
                    ? 'bg-ashtabula-primary text-white rounded-tr-none border-ashtabula-primary'
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
            <div className="w-10 h-10 rounded-2xl bg-ashtabula-primary flex items-center justify-center text-white">
              <Bot size={20} />
            </div>
            <div className="p-5 bg-white border border-slate-100 rounded-3xl rounded-tl-none flex items-center gap-3 text-slate-400">
              <Loader2 size={18} className="animate-spin text-ashtabula-secondary" />
              <span className="font-medium">Searching Saybrook zoning documents...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="saybrook-chat-footer p-4 sm:p-5">
        <div className="saybrook-composer-shell">
          <div className="saybrook-composer-head">
            <div>
              <p className="saybrook-composer-kicker">Ask directly</p>
              <h4 className="saybrook-composer-title">Ask the zoning question directly.</h4>
              <p className="saybrook-composer-copy">
                Fence height, shed permit, addition setback, pool rules, parcel use, or anything else
                tied to the Saybrook code.
              </p>
            </div>
            <span className="saybrook-composer-signal">
              <AlertCircle size={14} />
              Cited response
            </span>
          </div>

          <form onSubmit={handleSend} className="saybrook-composer-form">
            <label className="saybrook-composer-label" htmlFor="saybrook-zoning-question">
              Type your zoning question
            </label>
            <div className="saybrook-composer-row">
              <input
                id="saybrook-zoning-question"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="How tall can a fence be in my front yard?"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="saybrook-composer-send"
                aria-label="Send question"
              >
                <Send size={22} />
              </button>
            </div>
          </form>

          <div className="saybrook-composer-meta">
            <p className="saybrook-composer-note">
              Ask first, then add images or prepare a township-ready request if you need follow-up.
            </p>
            <div className="text-[10px] text-slate-500">
              Saybrook follow-up:{' '}
              <a href="tel:440-576-3737" className="text-ashtabula-primary hover:underline">
                (440) 576-3737
              </a>
            </div>
          </div>
        </div>

        <div className="saybrook-prompt-shell">
          <QuickQuestions onSelect={handleQuickQuestion} disabled={isLoading} />
        </div>

        <div className="mt-7 border-t border-slate-100 pt-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Request handoff
              </p>
              <h4 className="text-lg font-bold text-ashtabula-primary">Move the answer into the queue</h4>
              <p className="text-sm text-slate-500 mt-2 max-w-2xl">
                After the question is answered, open the request panel, add images if they help, and
                prepare a compact township follow-up.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                {requestConfig.enabled ? 'Township handoff ready' : 'Clipboard handoff'}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                {requestStatus === 'connected' ? 'Direct submission live' : 'Queue status pending'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setRequestOpen((open) => !open)}
              className="shrink-0 px-5 py-3 rounded-xl bg-ashtabula-bg text-ashtabula-primary font-bold border border-slate-200 hover:border-ashtabula-secondary hover:bg-white transition-all"
            >
              {requestOpen ? 'Hide intake panel' : 'Open intake panel'}
            </button>
          </div>

          {requestOpen && (
            <div className="mt-6 grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
              <div className="saybrook-queue-panel space-y-5 p-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full name</span>
                    <input
                      type="text"
                      value={requestForm.fullName}
                      onChange={(e) => updateRequestField('fullName', e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-ashtabula-primary/5 focus:border-ashtabula-primary"
                      placeholder="Resident or applicant name"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</span>
                    <input
                      type="email"
                      value={requestForm.email}
                      onChange={(e) => updateRequestField('email', e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-ashtabula-primary/5 focus:border-ashtabula-primary"
                      placeholder="you@example.com"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phone</span>
                    <input
                      type="tel"
                      value={requestForm.phone}
                      onChange={(e) => updateRequestField('phone', e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-ashtabula-primary/5 focus:border-ashtabula-primary"
                      placeholder="(440) 555-1212"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Preferred contact</span>
                    <select
                      value={requestForm.preferredContact}
                      onChange={(e) => updateRequestField('preferredContact', e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-ashtabula-primary/5 focus:border-ashtabula-primary"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="either">Either</option>
                    </select>
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Request type</span>
                    <select
                      value={requestForm.requestType}
                      onChange={(e) => updateRequestField('requestType', e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-ashtabula-primary/5 focus:border-ashtabula-primary"
                    >
                      <option value="zoning guidance">Zoning guidance</option>
                      <option value="setback / lot question">Setback / lot question</option>
                      <option value="permit pre-check">Permit pre-check</option>
                      <option value="use eligibility question">Use eligibility question</option>
                      <option value="formal township request">Formal township request</option>
                    </select>
                  </label>
                </div>

                <label className="block space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Property address</span>
                  <input
                    type="text"
                    value={requestForm.propertyAddress}
                    onChange={(e) => updateRequestField('propertyAddress', e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-ashtabula-primary/5 focus:border-ashtabula-primary"
                    placeholder="Project site or parcel address"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resident summary</span>
                  <textarea
                    rows={5}
                    value={requestForm.projectSummary}
                    onChange={(e) => updateRequestField('projectSummary', e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-ashtabula-primary/5 focus:border-ashtabula-primary"
                    placeholder="Briefly describe the project, parcel issue, or zoning concern."
                  />
                </label>

                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4">
                  <label className="flex items-center gap-3 font-medium text-slate-700 cursor-pointer">
                    <Upload size={18} className="text-ashtabula-secondary" />
                    Upload up to two reference images
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                  </label>
                  <p className="mt-2 text-xs text-slate-500">
                    Optional photos help when someone is asking about a lot condition, frontage, setback, or an existing structure.
                  </p>
                  {uploadedImages.length > 0 && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {uploadedImages.map((image) => (
                        <div
                          key={image.previewUrl}
                          className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                        >
                          <div className="aspect-[4/3] bg-slate-100">
                            <img
                              src={image.previewUrl}
                              alt={image.file.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600">
                            <FileImage size={12} className="text-ashtabula-secondary" />
                            <span className="truncate">{image.file.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleFormalizeRequest}
                  className="w-full rounded-2xl bg-ashtabula-primary text-white px-5 py-4 font-bold hover:bg-ashtabula-accent transition-all"
                >
                  Prepare formal request
                </button>
              </div>

              <div className="saybrook-queue-panel space-y-5 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-ashtabula-bg text-ashtabula-primary flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Request packet</p>
                    <h5 className="font-bold text-ashtabula-primary">Structured handoff preview</h5>
                  </div>
                </div>

                {!requestDraftReady ? (
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Once you click <strong>Prepare formal request</strong>, this panel will package the latest
                    conversation into a compact intake summary ready for the township queue.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold">
                      <CheckCircle2 size={16} />
                      Request ready
                    </div>

                    {requestSubmissionMessage ? (
                      <div
                        className={`rounded-2xl border px-4 py-3 text-sm ${
                          requestSubmissionState === 'error'
                            ? 'border-rose-200 bg-rose-50 text-rose-800'
                            : requestSubmissionState === 'submitted'
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                              : 'border-slate-200 bg-slate-50 text-slate-700'
                        }`}
                      >
                        {requestSubmissionMessage}
                      </div>
                    ) : null}

                    <pre className="rounded-2xl bg-slate-950 text-slate-100 p-4 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap">
{JSON.stringify(requestDraft, null, 2)}
                    </pre>

                    <div className="flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={handleQueueSubmit}
                        disabled={requestSubmissionState === 'submitting'}
                        className="inline-flex items-center justify-center gap-2 w-full rounded-2xl border border-ashtabula-primary bg-ashtabula-primary text-white px-5 py-3 font-bold hover:bg-ashtabula-accent transition-all disabled:opacity-50"
                      >
                        {requestSubmissionState === 'submitting' ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Sending to queue...
                          </>
                        ) : requestConfig.enabled ? (
                          <>
                            <ArrowRight size={16} />
                            Send to township queue
                          </>
                        ) : (
                          <>
                            <ClipboardCopy size={16} />
                            Copy queue payload
                          </>
                        )}
                      </button>

                      <a
                        href={`mailto:zoning@saybrooktownship.org?subject=${encodeURIComponent('Saybrook zoning request')}&body=${mailtoBody}`}
                        className="inline-flex items-center justify-center gap-2 w-full rounded-2xl border border-slate-200 text-slate-700 px-5 py-3 font-bold hover:bg-slate-50 transition-all"
                      >
                        <Mail size={16} />
                        Open township email
                      </a>
                    </div>
                  </div>
                )}

                <div className="rounded-2xl bg-ashtabula-bg/70 border border-slate-100 p-4 text-sm text-slate-600">
                  Keep the tone compact and factual. This should read like a real township intake summary: clear, calm, and ready for staff review.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}
