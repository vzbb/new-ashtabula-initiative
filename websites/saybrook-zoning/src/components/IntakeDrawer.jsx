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
} from 'lucide-react';
import {
  getRequestConfiguration,
  submitFormalRequest,
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
    // Previews cleanup
  }, []);

  function getLatestAssistantReply() {
    return [...messages].reverse().find((message) => message.role === 'assistant');
  }

  function getLatestUserQuestion() {
    return [...messages].reverse().find((message) => message.role === 'user')?.content || '';
  }

  function buildOfficialInquiry() {
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
        setRequestSubmissionMessage(
          'Official queue endpoint unavailable. The record payload was copied for manual transmission.'
        );
      } catch {
        setRequestSubmissionState('error');
        setRequestSubmissionMessage(
          'Queue endpoint unavailable and the payload could not be copied automatically.'
        );
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
          ? `Inquiry transmitted successfully. Record ID: ${response.queueId}`
          : response.message || 'Inquiry transmitted successfully.'
      );
    } catch (error) {
      console.error('Saybrook request submission error:', error);
      setRequestSubmissionState('error');
      setRequestSubmissionMessage(
        error.message || 'The inquiry could not be transmitted to the municipal queue.'
      );
    }
  }

  const officialInquiry = buildOfficialInquiry();
  const mailtoBody = encodeURIComponent(
    `Hello Saybrook Township Zoning Office,\n\nI would like to submit an official zoning inquiry.\n\nName: ${officialInquiry.fullName}\nEmail: ${officialInquiry.email}\nPhone: ${officialInquiry.phone}\nPreferred contact: ${officialInquiry.preferredContact}\nProperty address: ${officialInquiry.propertyAddress}\nInquiry type: ${officialInquiry.request_type}\n\nResident summary:\n${officialInquiry.residentSummary}\n\nAI-assisted context summary:\n${officialInquiry.aiContextSummary}\n\nAttached reference imagery: ${officialInquiry.imageCount}\n\nPlease process this inquiry for official township review.\n`
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
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          />
          <Motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-2xl bg-white shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-saybrook-forest uppercase tracking-tight">Submit for Official Review</h3>
                <p className="text-sm text-slate-600 font-medium">
                  Format inquiry for official township processing.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-8 pb-24">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Full name</span>
                    <input
                      type="text"
                      value={requestForm.fullName}
                      onChange={(e) => updateRequestField('fullName', e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-saybrook-forest/5 focus:border-saybrook-forest transition-all font-medium"
                      placeholder="Full legal name"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Email Address</span>
                    <input
                      type="email"
                      value={requestForm.email}
                      onChange={(e) => updateRequestField('email', e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-saybrook-forest/5 focus:border-saybrook-forest transition-all font-medium"
                      placeholder="resident@example.com"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Phone Number</span>
                    <input
                      type="tel"
                      value={requestForm.phone}
                      onChange={(e) => updateRequestField('phone', e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-saybrook-forest/5 focus:border-saybrook-forest transition-all font-medium"
                      placeholder="(440) 555-1212"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Preferred contact</span>
                    <select
                      value={requestForm.preferredContact}
                      onChange={(e) => updateRequestField('preferredContact', e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-saybrook-forest/5 focus:border-saybrook-forest transition-all font-bold"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="either">Either</option>
                    </select>
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Inquiry Type</span>
                    <select
                      value={requestForm.requestType}
                      onChange={(e) => updateRequestField('requestType', e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-saybrook-forest/5 focus:border-saybrook-forest transition-all font-bold"
                    >
                      <option value="zoning guidance">Zoning Guidance</option>
                      <option value="setback / lot question">Setback / Lot Question</option>
                      <option value="permit pre-check">Permit Pre-Check</option>
                      <option value="use eligibility question">Use Eligibility Question</option>
                      <option value="formal township request">Formal Township Request</option>
                    </select>
                  </label>
                </div>

                <label className="block space-y-2">
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Property Address</span>
                  <input
                    type="text"
                    value={requestForm.propertyAddress}
                    onChange={(e) => updateRequestField('propertyAddress', e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-saybrook-forest/5 focus:border-saybrook-forest transition-all font-medium"
                    placeholder="Project site or parcel address"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Resident summary</span>
                  <textarea
                    rows={5}
                    value={requestForm.projectSummary}
                    onChange={(e) => updateRequestField('projectSummary', e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-saybrook-forest/5 focus:border-saybrook-forest transition-all font-medium"
                    placeholder="Briefly describe the project, parcel issue, or zoning concern."
                  />
                </label>

                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-6 transition-colors hover:bg-slate-50">
                  <label className="flex items-center gap-3 font-black text-saybrook-forest cursor-pointer uppercase text-xs tracking-tight">
                    <Upload size={20} className="text-saybrook-lake" />
                    Attach Documentation (Max 2)
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                  </label>
                  <p className="mt-2 text-[10px] text-slate-500 font-bold">
                    Official reference imagery helps clarify lot conditions, frontage, setbacks, or existing structures.
                  </p>
                  {uploadedImages.length > 0 && (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {uploadedImages.map((image) => (
                        <div
                          key={image.previewUrl}
                          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                        >
                          <div className="aspect-video bg-slate-100">
                            <img
                              src={image.previewUrl}
                              alt={image.file.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-slate-600">
                            <FileImage size={12} className="text-saybrook-lake" />
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
                  className="w-full rounded-2xl bg-saybrook-forest text-white px-5 py-4 font-black uppercase tracking-wide hover:bg-saybrook-fern shadow-lg shadow-saybrook-forest/20 transition-all active:scale-[0.98]"
                >
                  Formalize Official Inquiry
                </button>
              </div>

              {requestFormalized && (
                <div className="space-y-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-saybrook-cream text-saybrook-forest flex items-center justify-center border border-saybrook-forest/10">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Record Entry</p>
                      <h5 className="font-black text-saybrook-forest uppercase tracking-tight">Municipal Handoff Summary</h5>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-700 text-sm font-black uppercase tracking-tight">
                      <CheckCircle2 size={16} />
                      Inquiry Validated for Submission
                    </div>

                    {requestSubmissionMessage ? (
                      <div
                        className={`rounded-2xl border px-5 py-4 text-sm font-bold ${
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

                    <pre className="rounded-2xl bg-slate-900 text-slate-300 p-5 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap border border-slate-800 font-mono shadow-inner">
                      {JSON.stringify(officialInquiry, null, 2)}
                    </pre>

                    <div className="flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={handleQueueSubmit}
                        disabled={requestSubmissionState === 'submitting'}
                        className="inline-flex items-center justify-center gap-3 w-full rounded-2xl border border-saybrook-forest bg-saybrook-forest text-white px-5 py-4 font-black uppercase tracking-wide hover:bg-saybrook-fern transition-all shadow-lg shadow-saybrook-forest/10 disabled:opacity-50 active:scale-[0.98]"
                      >
                        {requestSubmissionState === 'submitting' ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Transmitting to Queue...
                          </>
                        ) : requestConfig.enabled ? (
                          <>
                            <ArrowRight size={18} />
                            Execute Official Submission
                          </>
                        ) : (
                          <>
                            <ClipboardCopy size={18} />
                            Export Official Payload
                          </>
                        )}
                      </button>

                      <a
                        href={`mailto:zoning@saybrooktownship.org?subject=${encodeURIComponent('Saybrook Official Zoning Inquiry')}&body=${mailtoBody}`}
                        className="inline-flex items-center justify-center gap-3 w-full rounded-2xl border border-slate-200 text-slate-900 px-5 py-4 font-black uppercase tracking-wide hover:bg-slate-50 transition-all active:scale-[0.98]"
                      >
                        <Mail size={18} />
                        Direct Municipal Email
                      </a>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-saybrook-cream/50 border border-saybrook-forest/10 p-5 text-sm text-slate-700 leading-relaxed font-bold italic">
                    "Official Notice: Maintain factual precision in all field entries to ensure accurate township processing."
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
