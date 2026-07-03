import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  FileImage,
  FileText,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ClipboardCopy,
  Mail,
  Activity,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import {
  getRequestConfiguration,
  submitFormalRequest,
  digestConversation,
} from '../lib/rag';

export function IntakeDrawer({ 
  isOpen, 
  onClose, 
  messages, 
  requestForm, 
  setRequestForm, 
  uploadedImages, 
  setUploadedImages 
}) {
  const requestConfig = getRequestConfiguration();
  const [requestFormalized, setRequestFormalized] = useState(false);
  const [requestSubmissionState, setRequestSubmissionState] = useState('idle');
  const [requestSubmissionMessage, setRequestSubmissionMessage] = useState('');
  const [isDigesting, setIsDigesting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (!requestForm.projectSummary || !requestForm.aiContextSummary) {
        handleSmartDigest();
      }
    }
  }, [isOpen]);

  async function handleSmartDigest() {
    if (messages.length < 2) return;
    setIsDigesting(true);
    try {
      const digest = await digestConversation(messages);
      if (digest.residentSummary) {
        updateRequestField('projectSummary', digest.residentSummary);
      }
      if (digest.aiContextSummary) {
        updateRequestField('aiContextSummary', digest.aiContextSummary);
      }
    } catch (err) {
      console.warn("Smart digest failed, falling back to heuristics:", err);
      // Fallback
      updateRequestField('projectSummary', getLatestUserQuestion());
      const lastReply = getLatestAssistantReply()?.content || '';
      updateRequestField('aiContextSummary', lastReply.substring(0, 300) + (lastReply.length > 300 ? '...' : ''));
    } finally {
      setIsDigesting(false);
    }
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

  function getLatestAssistantReply() {
    return [...messages].reverse().find((message) => message.role === 'assistant');
  }

  function getLatestUserQuestion() {
    return [...messages].reverse().find((message) => message.role === 'user')?.content || '';
  }

  function buildOfficialInquiry() {
    const lastAssistantReply = requestForm.aiContextSummary || '';
    const summary = requestForm.projectSummary.trim() || getLatestUserQuestion();

    // Collect all citations from the entire chat history
    const allCitations = messages
      .filter(m => m.role === 'assistant' && m.citations && m.citations.length > 0)
      .flatMap(m => m.citations);

    // Format chat transcript for database storage
    const transcript = messages.map(m => ({
      author: m.role === 'user' ? 'Resident' : 'Zoning Clerk',
      content: m.content,
      timestamp: new Date().toISOString() // In a real app we'd want actual msg timestamps
    }));

    return {
      fullName: requestForm.fullName || 'Not provided',
      email: requestForm.email || 'Not provided',
      phone: requestForm.phone || 'Not provided',
      preferredContact: requestForm.preferredContact || 'email',
      propertyAddress: requestForm.propertyAddress || 'Not provided',
      request_type: requestForm.requestType,
      residentSummary: summary || 'Not provided',
      aiContextSummary: lastAssistantReply || 'No AI response captured yet.',
      sourceCitations: JSON.stringify(allCitations),
      chatTranscript: JSON.stringify(transcript),
      imageCount: uploadedImages.length,
      imageNames: uploadedImages.map((image) => image.file.name),
      queueDestination: 'Saybrook Township queue',
      nextStep: 'Administrative Triage Core follow-up.',
    };
  }

  function handleFormalizeRequest() {
    setRequestFormalized(true);
    setRequestSubmissionState('idle');
    setRequestSubmissionMessage('');
  }

  async function handleQueueSubmit() {
    const officialInquiry = buildOfficialInquiry();

    if (!requestFormalized) {
      setRequestFormalized(true);
      return;
    }

    if (!requestConfig.enabled) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(officialInquiry, null, 2));
        setRequestSubmissionState('copied');
        setRequestSubmissionMessage('OFFLINE MODE: Record payload exported to clipboard for manual handoff.');
      } catch {
        setRequestSubmissionState('error');
        setRequestSubmissionMessage('EXPORT ERROR: Could not generate clipboard payload.');
      }
      return;
    }

    setRequestSubmissionState('submitting');
    setRequestSubmissionMessage('');

    try {
      const response = await submitFormalRequest({
        ...officialInquiry,
        attachments: uploadedImages.map((image) => image.file),
      });

      setRequestSubmissionState('submitted');
      setRequestSubmissionMessage(
        response.queueId
          ? `TRANSMISSION SUCCESS: Entry logged under Record ID: ${response.queueId}`
          : response.message || 'TRANSMISSION SUCCESS: Entry logged.'
      );
    } catch (error) {
      console.error('Saybrook request submission error:', error);
      setRequestSubmissionState('error');
      setRequestSubmissionMessage('TRANSMISSION FAILURE: Communication with municipal core interrupted.');
    }
  }

  const officialInquiry = buildOfficialInquiry();
  const mailtoBody = encodeURIComponent(
    `Hello Saybrook Township Zoning Records,\n\nI am submitting an official zoning inquiry record.\n\nName: ${officialInquiry.fullName}\nEmail: ${officialInquiry.email}\nPhone: ${officialInquiry.phone}\nPreferred contact: ${officialInquiry.preferredContact}\nProperty address: ${officialInquiry.propertyAddress}\nRecord type: ${officialInquiry.request_type}\n\nResident summary:\n${officialInquiry.residentSummary}\n\nAI Context Engine summary:\n${officialInquiry.aiContextSummary}\n\nReference assets: ${officialInquiry.imageCount}\n\nPlease acknowledge receipt of this official record.\n`
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
          />
          <Motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-2xl bg-[#08120e] border-l border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-y-auto saybrook-drawer"
          >
            <div className="sticky top-0 z-10 bg-[#08120e] border-b border-white/10 p-8 pb-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1 opacity-80">
                  <Activity size={14} className="text-saybrook-sand" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-saybrook-sand">Township Services</h3>
                </div>
                <h2 className="text-3xl font-display text-white tracking-tight">Zoning Inquiry Request</h2>
              </div>
              <button
                onClick={onClose}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-saybrook-glow/30 transition-all active:scale-[0.95]"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 pt-6 space-y-10 pb-12">
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="space-y-3">
                    <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest">Full Name</span>
                    <input
                      type="text"
                      value={requestForm.fullName}
                      onChange={(e) => updateRequestField('fullName', e.target.value)}
                      className="w-full rounded-xl border-2 border-saybrook-sand/30 bg-black/30 px-4 py-3 text-white outline-none focus:border-saybrook-sand transition-all font-medium placeholder:text-white/40 shadow-inner"
                      placeholder="Legal full name"
                    />
                  </label>
                  <label className="space-y-3">
                    <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest">Email Address</span>
                    <input
                      type="email"
                      value={requestForm.email}
                      onChange={(e) => updateRequestField('email', e.target.value)}
                      className="w-full rounded-xl border-2 border-saybrook-sand/30 bg-black/30 px-4 py-3 text-white outline-none focus:border-saybrook-sand transition-all font-medium placeholder:text-white/40 shadow-inner"
                      placeholder="resident@network.com"
                    />
                  </label>
                  <label className="space-y-3">
                    <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest">Phone Number</span>
                    <input
                      type="tel"
                      value={requestForm.phone}
                      onChange={(e) => updateRequestField('phone', e.target.value)}
                      className="w-full rounded-xl border-2 border-saybrook-sand/30 bg-black/30 px-4 py-3 text-white outline-none focus:border-saybrook-sand transition-all font-medium placeholder:text-white/40 shadow-inner"
                      placeholder="(440) 555-0000"
                    />
                  </label>
                  <label className="space-y-3">
                    <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest">Preferred Contact Method</span>
                    <div className="relative group">
                      <select
                        value={requestForm.preferredContact}
                        onChange={(e) => updateRequestField('preferredContact', e.target.value)}
                        className="w-full appearance-none rounded-xl border-2 border-saybrook-sand/30 bg-black/40 px-4 py-3 text-white outline-none focus:border-saybrook-sand transition-all font-bold shadow-inner cursor-pointer"
                      >
                        <option value="email" className="bg-[#1a2e26] text-white">Email</option>
                        <option value="phone" className="bg-[#1a2e26] text-white">Phone Call</option>
                        <option value="either" className="bg-[#1a2e26] text-white">Either Email or Phone</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:translate-y-[-40%]">
                        <ChevronDown size={18} className="text-saybrook-sand" />
                      </div>
                    </div>
                  </label>
                  <label className="space-y-3 md:col-span-2">
                    <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest">Inquiry Type</span>
                    <div className="relative group">
                      <select
                        value={requestForm.requestType}
                        onChange={(e) => updateRequestField('requestType', e.target.value)}
                        className="w-full appearance-none rounded-xl border-2 border-saybrook-sand/30 bg-black/40 px-4 py-3 text-white outline-none focus:border-saybrook-sand transition-all font-bold shadow-inner cursor-pointer"
                      >
                        <option value="zoning guidance" className="bg-[#1a2e26] text-white">General Inquiry</option>
                        <option value="setback / lot question" className="bg-[#1a2e26] text-white">Dimensional Analysis</option>
                        <option value="permit pre-check" className="bg-[#1a2e26] text-white">Compliance Pre-Check</option>
                        <option value="use eligibility question" className="bg-[#1a2e26] text-white">Land Use Verification</option>
                        <option value="formal township request" className="bg-[#1a2e26] text-white">Formal Division Review</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:translate-y-[-40%]">
                        <ChevronDown size={18} className="text-saybrook-sand" />
                      </div>
                    </div>
                  </label>
                </div>

                <label className="block space-y-3">
                  <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest">Property Address</span>
                  <input
                    type="text"
                    value={requestForm.propertyAddress}
                    onChange={(e) => updateRequestField('propertyAddress', e.target.value)}
                    className="w-full rounded-xl border-2 border-saybrook-sand/30 bg-black/30 px-4 py-3 text-white outline-none focus:border-saybrook-sand transition-all font-medium placeholder:text-white/40 shadow-inner"
                    placeholder="Project site location"
                  />
                </label>

                <label className="block space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest">Project Summary</span>
                    {isDigesting && (
                      <span className="flex items-center gap-2 text-[10px] font-black text-saybrook-sand animate-pulse uppercase tracking-widest">
                        <Loader2 size={10} className="animate-spin" /> Distilling History
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={5}
                    value={requestForm.projectSummary}
                    onChange={(e) => updateRequestField('projectSummary', e.target.value)}
                    className="w-full rounded-xl border-2 border-saybrook-sand/30 bg-black/30 px-4 py-3 text-white outline-none focus:border-saybrook-sand transition-all font-medium placeholder:text-white/40 shadow-inner resize-none"
                    placeholder="Briefly state project objectives or zoning concerns."
                  />
                  {!isDigesting && (
                    <button 
                      onClick={handleSmartDigest}
                      className="mt-2 text-[8px] font-black uppercase text-saybrook-sand/50 hover:text-saybrook-sand flex items-center gap-1 transition-colors"
                    >
                      <Sparkles size={8} /> Refresh smart summary from chat
                    </button>
                  )}
                </label>

                <label className="space-y-3 block">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white/70 uppercase tracking-widest">Zoning Context</span>
                  </div>
                  <textarea
                    rows={5}
                    value={requestForm.aiContextSummary}
                    onChange={(e) => updateRequestField('aiContextSummary', e.target.value)}
                    className="w-full rounded-xl border-2 border-emerald-900/30 bg-emerald-900/10 px-4 py-3 text-emerald-100/70 outline-none focus:border-emerald-500 transition-all font-medium placeholder:text-emerald-900/40 shadow-inner resize-none text-xs"
                    placeholder="Distilled findings from the AI Zoning Clerk"
                  />
                </label>

                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 transition-all hover:bg-white/[0.08] hover:border-saybrook-glow/30">
                  <label className="flex items-center gap-4 font-bold text-white cursor-pointer uppercase text-[11px] tracking-widest group/upload">
                    <Upload size={18} className="text-saybrook-sand group-hover/upload:scale-110 transition-transform" />
                    Upload Photos or Documents (Max 2)
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                  </label>
                  <p className="mt-3 text-[10px] text-white/60 font-bold uppercase tracking-tight">
                    Attach maps, sketches, or photos of the property.
                  </p>
                  {uploadedImages.length > 0 && (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {uploadedImages.map((image) => (
                        <div
                          key={image.previewUrl}
                          className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-spatial"
                        >
                          <div className="aspect-video">
                            <img
                              src={image.previewUrl}
                              alt={image.file.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex items-center gap-2 px-4 py-3 text-[9px] font-bold text-white/50 bg-black/40">
                            <FileImage size={12} className="text-saybrook-glow" />
                            <span className="truncate uppercase tracking-tighter">{image.file.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleFormalizeRequest}
                  className="w-full rounded-2xl bg-saybrook-sand text-saybrook-forest-deep px-6 py-5 font-black uppercase tracking-[0.2em] hover:scale-[1.01] shadow-[0_10px_30px_rgba(202,175,123,0.15)] transition-all active:scale-[0.98]"
                >
                  Review Your Request
                </button>
              </div>

              {requestFormalized && (
                <div className="space-y-8 pt-10 border-t border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-saybrook-glow/10 text-saybrook-glow flex items-center justify-center border border-saybrook-glow/20 shadow-spatial">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Ready for Submission</p>
                      <h5 className="text-lg font-display text-white uppercase tracking-tight">Request Details Summary</h5>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {requestSubmissionMessage && (
                      <div
                        className={`rounded-2xl border px-6 py-5 text-xs font-black uppercase tracking-widest ${
                          requestSubmissionState === 'error'
                            ? 'border-rose-500/50 bg-rose-500/10 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.1)]'
                            : requestSubmissionState === 'submitted'
                              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                              : 'border-white/10 bg-white/5 text-white/60'
                        }`}
                      >
                        {requestSubmissionState === 'submitted' ? 'Your request has been successfully sent.' : requestSubmissionMessage}
                      </div>
                    )}

                    <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 text-[13px] leading-relaxed text-white/60 font-medium shadow-inner">
                      The contents of your chat history and any official code citations provided will be automatically included with your request to streamline the review process and provide transparency for everyone involved. 
                      <p className="mt-4 font-bold text-saybrook-sand uppercase text-[10px] tracking-widest">Click below to submit your official inquiry.</p>
                    </div>

                    <div className="flex flex-col gap-4">
                      <button
                        type="button"
                        onClick={handleQueueSubmit}
                        disabled={requestSubmissionState === 'submitting'}
                        className="inline-flex items-center justify-center gap-3 w-full rounded-2xl border border-saybrook-glow bg-saybrook-glow text-saybrook-forest-deep px-6 py-5 font-black uppercase tracking-widest hover:bg-saybrook-glow shadow-spatial disabled:opacity-50 transition-all active:scale-[0.98]"
                      >
                        {requestSubmissionState === 'submitting' ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            Sending Request...
                          </>
                        ) : requestConfig.enabled ? (
                          <>
                            <ArrowRight size={20} />
                            Send Request
                          </>
                        ) : (
                          <>
                            <ClipboardCopy size={20} />
                            Copy Request Data
                          </>
                        )}
                      </button>

                        <a
                          href={`mailto:zoning@saybrooktownship.org?subject=${encodeURIComponent('OFFICIAL RECORD: Zoning Inquiry')}&body=${mailtoBody}`}
                          className="inline-flex items-center justify-center gap-3 w-full rounded-2xl border border-white/10 text-white/60 px-6 py-5 font-black uppercase tracking-widest hover:bg-white/5 transition-all active:scale-[0.98]"
                        >
                          <Mail size={20} />
                          Email Directly
                        </a>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-saybrook-glow/5 border border-saybrook-glow/10 p-6 text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-widest">
                    "NOTE: Your request will be reviewed by the Saybrook Township zoning department."
                  </div>
                </div>
              )}
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
