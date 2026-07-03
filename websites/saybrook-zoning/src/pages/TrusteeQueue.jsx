import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Bell,
  CheckCircle2,
  Clock3,
  FileClock,
  Inbox,
  MessageSquareText,
  NotebookPen,
  RefreshCcw,
  Route,
  ShieldCheck,
  ShieldAlert,
  Database,
  Lock,
  MapPin,
  LayoutGrid,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getRequestsConfiguration, checkRequestsHealth, fetchSaybrookRequests } from "../lib/queue";

const ASSET_BASE = import.meta.env.BASE_URL || "/";
const saybrookSeal = `${ASSET_BASE}saybrook-seal.png`;

function formatTime(value) {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function statusMeta(status) {
  const normalized = String(status || "new").toLowerCase();
  if (normalized.includes("review")) {
    return { label: "Under Review", className: "bg-amber-50 text-amber-700 border-amber-200" };
  }
  if (normalized.includes("respond")) {
    return { label: "Processed", className: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  }
  if (normalized.includes("need")) {
    return { label: "Action Required", className: "bg-rose-50 text-rose-700 border-rose-200" };
  }
  if (normalized.includes("closed")) {
    return { label: "Archived", className: "bg-[#f9f8f4] text-[#2c3e2d]/60 border-[#e8e4db]" };
  }
  return {
    label: "New Entry",
    className: "bg-[#f0d283]/10 text-[#8b7336] border-[#f0d283]/20",
  };
}

function QueueStat({ label, value, hint, icon: Icon }) {
  return (
    <div className="group relative bg-[#e8e4db] border-2 border-[#182c25]/30 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#182c25]/50 overflow-hidden translate-y-0 hover:-translate-y-1">
      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#182c25]/50">{label}</p>
          <p className="font-display text-3xl text-[#182c25] tracking-tighter leading-none font-black">{value}</p>
        </div>
        <div className="p-3 bg-[#2c3e2d] rounded-xl text-[#f0d283] shadow-lg border-2 border-[#182c25]">
          <Icon size={16} strokeWidth={3} />
        </div>
      </div>
      <div className="absolute -bottom-2 -right-2 opacity-[0.05] scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-700">
        <Icon size={40} className="text-[#182c25]" />
      </div>
    </div>
  );
}

function CitationList({ citations = [] }) {
  if (!citations || citations.length === 0) return null;
  return (
    <div className="mt-12 pt-12 border-t border-[#e8e4db]">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 shadow-sm">
          <ClipboardCheck size={20} />
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#182c25]/50">Township Archive</h4>
          <p className="text-lg font-display text-[#182c25] font-bold tracking-tight">Cited Zoning Ordinances</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {citations.map((cite, i) => (
          <div key={i} className="group flex flex-col bg-white border border-[#e8e4db] rounded-3xl p-8 shadow-sm hover:border-emerald-200 transition-all hover:bg-[#f9f8f4] hover:shadow-md">
            <div className="flex items-start justify-between gap-6 mb-6">
              <div className="flex-1">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-600/60 block mb-2">
                  {cite.source || "Saybrook Township Resolution"}
                </span>
                <p className="text-xl font-display text-[#182c25] tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
                  {cite.section || cite.title || cite.reference || "Official Zoning Record"}
                </p>
              </div>
              {cite.page && (
                <div className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                  P. {cite.page}
                </div>
              )}
            </div>

            {cite.quote && (
              <div className="relative pl-6 border-l-4 border-emerald-100 py-2 mb-6">
                <p className="text-[15px] leading-relaxed text-[#2c3e2d]/70 font-medium italic">
                  "{cite.quote}"
                </p>
              </div>
            )}

            {cite.url && (
              <a
                href={cite.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto self-start flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <div className="w-8 h-px bg-emerald-600/30" />
                Launch Reference Records
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
function TranscriptView({ transcript = [] }) {
  if (!transcript || transcript.length === 0) return null;
  return (
    <div className="mt-8 pt-8 border-t border-[#e8e4db]">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-[#f0d283]/20 text-[#8b7336] rounded-2xl border border-[#f0d283]/30 shadow-sm">
          <MessageSquareText size={20} />
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#182c25]/60">Township Dialogue</h4>
          <p className="text-xl font-display text-[#182c25] font-black tracking-tight">Citizen Correspondence</p>
        </div>
      </div>
      <div className="space-y-6 max-h-[600px] overflow-y-auto pr-6 scrollbar-hide">
        {transcript.map((msg, i) => {
          const authorStr = String(msg.author || "");
          const isClerk = authorStr.toLowerCase().includes('clerk');
          return (
            <div key={i} className={`flex flex-col ${isClerk ? 'items-start' : 'items-end'} gap-2`}>
              <div className="flex items-center gap-3 px-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-[#2c3e2d]/40">
                  {msg.author}
                </span>
                <span className="text-[8px] font-medium text-[#2c3e2d]/20 uppercase tracking-tighter">
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
              <div className={`max-w-[90%] rounded-3xl px-6 py-4 text-sm font-medium shadow-sm border ${isClerk
                ? 'bg-white text-[#182c25]/80 rounded-tl-sm border-[#e8e4db]'
                : 'bg-[#182c25] text-white rounded-tr-sm border-[#182c25]'
                }`}>
                {msg.content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QueueEntry({ request, statusMeta, formatTime }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const meta = statusMeta(request.status);

  return (
    <article className={`border-b border-[#e8e4db] transition-all duration-300 group ${isExpanded ? 'bg-[#fcfbf9]' : 'hover:bg-[#f9f8f4]'}`}>
      {/* Header / Collapsed View */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-8 py-6 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] border ${meta.className}`}>
                {meta.label}
              </span>
              <span className="text-[9px] font-bold text-[#2c3e2d]/30 uppercase tracking-[0.2em]">#{String(request.id || 'AUTO').slice(0, 8)}</span>
            </div>
            <h3 className="font-display text-2xl text-[#182c25] group-hover:text-[#8b7336] transition-colors tracking-tighter leading-none">
              {request.applicantName}
            </h3>
            <div className="flex items-center gap-3 text-[10px] text-[#2c3e2d]/40 font-bold uppercase tracking-[0.1em]">
              <MapPin size={10} className="text-[#8b7336]/60" />
              {request.propertyAddress || "Saybrook Jurisdiction"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden sm:block text-right">
            <p className="text-[9px] font-black text-[#2c3e2d]/30 uppercase tracking-[0.3em] mb-0.5">Timestamp</p>
            <p className="text-xs font-black text-[#182c25] italic tracking-tight">{formatTime(request.submittedAt)}</p>
          </div>
          <div className="hidden sm:block w-px h-10 bg-[#e8e4db]" />
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[9px] font-black text-[#2c3e2d]/30 uppercase tracking-[0.3em] mb-0.5">Classification</p>
              <p className="text-xs font-black text-[#2c3e2d]/60 uppercase tracking-tighter font-mono">{request.projectType || 'Standard'}</p>
            </div>
            <div className={`p-2.5 rounded-xl transition-all duration-300 ${isExpanded ? 'rotate-180 bg-[#182c25] text-white shadow-lg' : 'bg-[#182c25]/5 text-[#182c25]/20 group-hover:text-[#182c25]/40'}`}>
              <ChevronDown size={14} strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-10 md:px-24 pb-16 space-y-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#182c25] shadow-sm" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#182c25]/50">Executive Briefing</p>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-[#e8e4db] shadow-sm min-h-[140px]">
                <p className="text-[16px] leading-relaxed text-[#2c3e2d]/70 font-medium">
                  {request.projectSummary || "No documentation entered."}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-600 shadow-sm" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2c3e2d]/30">Clerk Intelligence</p>
              </div>
              <div className="bg-[#f0f9f4] p-8 rounded-3xl border border-emerald-100 shadow-inner min-h-[140px] relative overflow-hidden group/context">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 blur-[60px] opacity-0 group-hover/context:opacity-100 transition-opacity" />
                <p className="text-[16px] leading-relaxed text-emerald-900/80 italic font-medium relative z-10">
                  {request.aiSummary || "Digital analysis pending initialization."}
                </p>
                <div className="mt-6 flex gap-6 relative z-10">
                  <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/60">
                    <Activity size={14} className="animate-pulse" /> {request.attachments?.length || 0} Evidentiary Files
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-[#e8e4db] shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md">
              <div className="p-4 bg-[#f0d283]/10 rounded-2xl text-[#8b7336]"><Inbox size={20} /></div>
              <div>
                <p className="text-[9px] font-black text-[#2c3e2d]/30 uppercase tracking-[0.3em] mb-1">Official Email</p>
                <p className="text-sm font-black text-[#182c25] tracking-tight">{request.email || "Private Record"}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-[#e8e4db] shadow-sm transition-transform hover:scale-[1.02] hover:shadow-md">
              <div className="p-4 bg-[#f0d283]/10 rounded-2xl text-[#8b7336]"><Clock3 size={20} /></div>
              <div>
                <p className="text-[9px] font-black text-[#2c3e2d]/30 uppercase tracking-[0.3em] mb-1">Contact Phone</p>
                <p className="text-sm font-black text-[#182c25] tracking-tight">{request.phone || "Not Registered"}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
            <TranscriptView transcript={request.chatTranscript} />
            <div className="space-y-12">
              <CitationList citations={request.sourceCitations} />
              <AttachmentGallery attachments={request.attachments} />
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function AttachmentGallery({ attachments = [] }) {
  const visible = attachments
    .map((attachment) => {
      if (!attachment || typeof attachment !== "object") return null;
      return {
        url: attachment.url || attachment.publicUrl || attachment.downloadUrl || "",
        fileName: attachment.fileName || attachment.name || attachment.filename || "Attachment",
      };
    })
    .filter((attachment) => attachment?.url)
    .slice(0, 4);

  if (!visible.length) return null;

  return (
    <div className="mt-12 pt-12 border-t border-[#e8e4db]">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-[#f0d283]/20 text-[#8b7336] rounded-2xl border border-[#f0d283]/30 shadow-sm">
          <LayoutGrid size={20} />
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#2c3e2d]/40">Evidence Division</h4>
          <p className="text-lg font-display text-[#182c25] font-bold tracking-tight">Supplied Digital Assets</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {visible.map((attachment, index) => (
          <a
            key={`${attachment.url}-${index}`}
            href={attachment.url}
            target="_blank"
            rel="noreferrer"
            className="group relative overflow-hidden rounded-3xl border border-[#e8e4db] bg-white shadow-sm transition hover:scale-[1.05] hover:border-[#f0d283] hover:shadow-xl"
          >
            <div className="aspect-square relative z-0">
              <img
                src={attachment.url}
                alt={attachment.fileName}
                className="h-full w-full object-cover transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#182c25]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 backdrop-blur-md bg-white/80">
              <p className="text-[9px] font-black text-[#182c25] uppercase tracking-widest truncate">{attachment.fileName}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export function TrusteeQueue() {
  const queueConfig = getRequestsConfiguration();
  const [requests, setRequests] = useState([]);
  const [queueStatus, setQueueStatus] = useState("checking");
  const [error, setError] = useState("");
  const [lastSync, setLastSync] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadQueue = useCallback(async () => {
    if (!queueConfig.enabled) {
      setQueueStatus("disabled");
      setRequests([]);
      setError("");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setQueueStatus("checking");
    setError("");

    try {
      const healthy = await checkRequestsHealth();
      const data = await fetchSaybrookRequests();
      setRequests(data.requests || []);
      setLastSync(new Date().toISOString());
      setQueueStatus(healthy ? "live" : "warm");
    } catch (fetchError) {
      setError(fetchError?.message || "Municipal record synchronization failed.");
      setRequests([]);
      setQueueStatus("error");
    } finally {
      setIsLoading(false);
    }
  }, [queueConfig.enabled]);

  useEffect(() => {
    loadQueue();
    if (!queueConfig.enabled) return undefined;

    const timer = window.setInterval(() => {
      loadQueue();
    }, 45000);

    return () => window.clearInterval(timer);
  }, [loadQueue, queueConfig.enabled]);

  const counts = useMemo(() => {
    return requests.reduce(
      (acc, request) => {
        acc.total += 1;
        const status = String(request.status || "new").toLowerCase();
        if (status.includes("review")) acc.reviewing += 1;
        else if (status.includes("need")) acc.needsInfo += 1;
        else if (status.includes("respond")) acc.responded += 1;
        else if (status.includes("closed")) acc.closed += 1;
        else acc.new += 1;
        return acc;
      },
      { total: 0, new: 0, reviewing: 0, needsInfo: 0, responded: 0, closed: 0 }
    );
  }, [requests]);

  return (
    <div className="relative min-h-screen bg-[#fdfcf8] p-4 lg:p-12 overflow-hidden selection:bg-[#f0d283] selection:text-[#182c25]">
      {/* Enhanced Watermark for Contrast */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-[0.08] mix-blend-multiply overflow-hidden grayscale">
        <img
          src={saybrookSeal}
          alt=""
          className="w-[120vh] h-[120vh] max-w-none animate-[spin_180s_linear_infinite]"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        {/* Bold Header Section with Centered Branding */}
        <header className="relative flex items-center justify-between gap-6 pb-2 pt-2">
          <div className="flex items-center gap-10 relative z-10">
            <div className="relative shrink-0">
              <img src={saybrookSeal} alt="Saybrook Township Seal" className="relative w-48 h-48 hover:scale-105 transition-all duration-700" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-4">
                <span className="text-[14px] font-black uppercase tracking-[0.6em] text-[#182c25]">SAYBROOK TOWNSHIP TRUSTEES PORTAL</span>
                <div className="h-[2px] w-12 bg-[#182c25]/40" />
              </div>
              <h1 className="font-display text-7xl text-[#182c25] tracking-tighter leading-[0.9]">Inquiry Queue</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadQueue}
              className="group flex items-center gap-2 rounded-xl bg-[#182c25] text-white px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-[#182c25]/20 transition-all"
            >
              <RefreshCcw size={12} className="group-hover:rotate-180 transition-transform duration-700" />
              Sync
            </button>
            <a
              href={ASSET_BASE}
              className="flex items-center gap-2 rounded-xl border border-[#e8e4db] bg-white px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#2c3e2d] hover:bg-[#f9f8f4] transition-all"
            >
              <ArrowLeft size={12} />
              Exit
            </a>
          </div>
        </header>

        {/* Dense Stats Strip */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <QueueStat label="Total" value={counts.total} icon={Database} />
          <QueueStat label="New" value={counts.new} icon={Inbox} />
          <QueueStat label="Review" value={counts.reviewing} icon={FileClock} />
          <QueueStat label="Action" value={counts.needsInfo} icon={AlertTriangle} />
        </section>

        {/* Main Ledger Content - Refined Heritage Structure */}
        <main className="bg-white rounded-[2.5rem] border-4 border-[#182c25] shadow-[0_45px_120px_-30px_rgba(24,44,37,0.3)] overflow-hidden min-h-[600px] relative z-10">
          <div className="px-10 py-5 border-b-4 border-[#182c25] flex items-center justify-between bg-[#f0ebd8]">
            <div className="flex items-center gap-5">
              <div className="p-2.5 bg-[#182c25] rounded-xl text-[#f0d283] shadow-lg border-2 border-[#182c25]">
                <Inbox size={22} strokeWidth={2.5} />
              </div>
              <h2 className="font-display text-2xl text-[#182c25] tracking-tight">Digital Ledger</h2>
            </div>
            <div className="flex items-center gap-3 px-5 py-2 bg-white rounded-full border-2 border-[#182c25] text-[10px] font-black text-[#182c25] tracking-[0.2em] uppercase shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Sync
            </div>
          </div>

          <div className="divide-y divide-[#e8e4db]">
            {isLoading ? (
              <div className="p-12 text-center animate-pulse space-y-4">
                <div className="h-4 w-48 bg-[#e8e4db] mx-auto rounded-full" />
                <div className="h-4 w-32 bg-[#e8e4db]/50 mx-auto rounded-full" />
              </div>
            ) : error ? (
              <div className="p-10 text-center">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-600 border border-rose-100">
                  <ShieldAlert size={24} />
                </div>
                <h3 className="text-rose-900 font-bold mb-2 uppercase tracking-widest text-xs">Synchronization Halted</h3>
                <p className="text-rose-700/70 text-sm max-w-sm mx-auto font-medium">{error}</p>
                <button onClick={loadQueue} className="mt-6 text-xs font-black uppercase text-rose-600 hover:underline tracking-widest">Retry Connection</button>
              </div>
            ) : requests.length ? (
              requests.map((request) => (
                <QueueEntry
                  key={request.id || Math.random()}
                  request={request}
                  statusMeta={statusMeta}
                  formatTime={formatTime}
                />
              ))
            ) : (
              <div className="p-20 text-center text-[#2c3e2d]/20">
                <Inbox size={40} className="mx-auto mb-4 opacity-10" />
                <p className="text-sm font-bold uppercase tracking-[0.4em]">Digital Ledger Empty</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
