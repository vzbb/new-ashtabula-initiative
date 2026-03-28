import { useCallback, useEffect, useMemo, useState } from "react";
import {
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
} from "lucide-react";
import { getRequestsConfiguration, checkRequestsHealth, fetchSaybrookRequests } from "../lib/queue";

const ASSET_BASE = import.meta.env.BASE_URL || "/";

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
    return { label: "Reviewing", className: "bg-amber-50 text-amber-900 border-amber-200" };
  }
  if (normalized.includes("respond")) {
    return { label: "Responded", className: "bg-emerald-50 text-emerald-900 border-emerald-200" };
  }
  if (normalized.includes("need")) {
    return { label: "Needs info", className: "bg-rose-50 text-rose-900 border-rose-200" };
  }
  if (normalized.includes("closed")) {
    return { label: "Closed", className: "bg-slate-100 text-slate-700 border-slate-200" };
  }
  return {
    label: "New",
    className: "bg-saybrook-mist/70 text-saybrook-forest border-saybrook-border",
  };
}

function QueueStat({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-saybrook-border bg-white/78 p-4 shadow-sm backdrop-blur">
      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
        {label}
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-3xl text-saybrook-forest">{value}</span>
      </div>
      <p className="mt-1 text-xs leading-5 text-slate-500">{hint}</p>
    </div>
  );
}

function QueueEmptyState({ title, copy }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 2 }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-3xl border border-dashed border-saybrook-border bg-white/55 p-5 shadow-sm"
        >
          <div className="space-y-3">
            <div className="h-4 w-32 rounded-full bg-slate-200/80" />
            <div className="h-3 w-56 rounded-full bg-slate-200/70" />
            <div className="h-3 w-full rounded-full bg-slate-200/60" />
            <div className="h-3 w-4/5 rounded-full bg-slate-200/60" />
          </div>
        </div>
      ))}
      <div className="rounded-3xl border border-saybrook-border bg-white/78 p-6 text-sm text-slate-600 shadow-sm">
        <p className="font-semibold text-saybrook-forest">{title}</p>
        <p className="mt-2 leading-6">{copy}</p>
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
      setError(fetchError?.message || "Unable to load the trustee queue.");
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
    const tally = requests.reduce(
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
    return tally;
  }, [requests]);

  const internalFeatures = [
    {
      title: "Live SMS notifications",
      copy: "Route new requests to staff text alerts when you want immediate awareness.",
      icon: Bell,
    },
    {
      title: "Automatic acknowledgments",
      copy: "Send a calm, immediate reply that says the request was received.",
      icon: CheckCircle2,
    },
    {
      title: "Priority routing",
      copy: "Surface urgent zoning items, deadline-driven requests, or incomplete packets first.",
      icon: Route,
    },
    {
      title: "Staff notes and review trail",
      copy: "Keep a compact internal record of questions, follow-ups, and final disposition.",
      icon: NotebookPen,
    },
  ];

  return (
    <div className="saybrook-app min-h-screen py-6">
      <div className="saybrook-shell">
        <div className="rounded-[2rem] border border-saybrook-border bg-[rgba(255,253,248,0.88)] p-5 shadow-[0_22px_60px_rgba(17,33,28,0.10)] backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-saybrook-clay">
                Internal / trustee only
              </p>
              <h1 className="mt-2 font-display text-4xl tracking-tight text-saybrook-ink sm:text-5xl">
                Saybrook trustee queue
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                A discreet internal view for reviewing incoming zoning requests, structured summaries,
                and follow-up status without changing the public intake experience.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="saybrook-pill">
                <ShieldCheck size={14} />
                Internal portal
              </span>
              <span className="saybrook-pill">
                <Clock3 size={14} />
                Last sync {lastSync ? formatTime(lastSync) : "pending"}
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-saybrook-border pt-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={loadQueue}
                className="inline-flex items-center gap-2 rounded-full border border-saybrook-border bg-white px-4 py-2 text-sm font-semibold text-saybrook-forest shadow-sm transition hover:border-saybrook-forest/20 hover:bg-saybrook-cream"
              >
                <RefreshCcw size={14} />
                Refresh queue
              </button>
              <a
                href={`${ASSET_BASE}`}
                className="inline-flex items-center gap-2 rounded-full border border-saybrook-border bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-saybrook-forest/20 hover:text-saybrook-forest"
              >
                <ArrowLeft size={14} />
                Back to public intake
              </a>
            </div>

            <p className="text-xs font-medium text-slate-500">
              {queueConfig.enabled
                ? queueConfig.healthUrl
                  ? `Endpoint configured: ${queueConfig.apiUrl}`
                  : `Endpoint configured: ${queueConfig.apiUrl}`
                : "Queue endpoint not configured yet"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.75fr)]">
          <section className="rounded-[2rem] border border-saybrook-border bg-white/84 p-5 shadow-[0_22px_60px_rgba(17,33,28,0.10)] backdrop-blur">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <QueueStat label="Total requests" value={counts.total} hint="All submissions in the queue." />
              <QueueStat label="New" value={counts.new} hint="Fresh items awaiting first look." />
              <QueueStat label="Reviewing" value={counts.reviewing} hint="Currently being read or routed." />
              <QueueStat label="Needs info" value={counts.needsInfo} hint="Missing context or attachments." />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                  Request list
                </p>
                <h2 className="mt-1 font-display text-2xl text-saybrook-forest">
                  Recent resident and project requests
                </h2>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Inbox size={14} />
                {queueStatus === "live"
                  ? "Live queue"
                  : queueStatus === "warm"
                    ? "Queue reachable, no strong health signal"
                    : queueStatus === "checking"
                      ? "Checking queue..."
                      : queueStatus === "disabled"
                        ? "Queue endpoint not configured"
                        : "Queue unavailable"}
              </div>
            </div>

            <div className="mt-5">
              {isLoading ? (
                <QueueEmptyState
                  title="Loading trustee queue"
                  copy="Waiting for the request list endpoint to answer. Once the n8n queue workflow is wired up, submissions will appear here in descending time order."
                />
              ) : error ? (
                <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-5 text-sm text-rose-900">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 shrink-0" size={18} />
                    <div>
                      <p className="font-semibold">Queue temporarily unavailable</p>
                      <p className="mt-1 leading-6">{error}</p>
                      <p className="mt-2 text-xs text-rose-800/80">
                        The public intake can still collect requests. This page will light up once
                        the trustee list endpoint is available.
                      </p>
                    </div>
                  </div>
                </div>
              ) : requests.length ? (
                <div className="grid gap-4">
                  {requests.map((request) => {
                    const meta = statusMeta(request.status);
                    return (
                      <article
                        key={request.id || `${request.applicantName}-${request.submittedAt}`}
                        className="rounded-[1.75rem] border border-saybrook-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(17,33,28,0.10)]"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="max-w-2xl">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-400">
                                Request {request.id || "queued"}
                              </span>
                              <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${meta.className}`}>
                                {meta.label}
                              </span>
                            </div>
                            <h3 className="mt-2 font-display text-2xl text-saybrook-ink">
                              {request.applicantName}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                              {request.propertyAddress || "Property address not provided"}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-saybrook-border bg-saybrook-cream/80 px-3 py-2 text-right">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                              Submitted
                            </p>
                            <p className="mt-1 text-sm font-semibold text-saybrook-forest">
                              {formatTime(request.submittedAt)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          <div className="rounded-2xl bg-slate-50/80 p-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                              Request type
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              {request.projectType || "General zoning guidance"}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-slate-50/80 p-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                              Contact
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              {request.email || request.phone || "No contact supplied"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
                          <div className="rounded-2xl border border-saybrook-border bg-[rgba(245,239,230,0.72)] p-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                              Specific question
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-700">
                              {request.specificQuestion || "No specific question captured."}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-saybrook-border bg-white/80 p-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                              AI summary
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-700">
                              {request.aiSummary || request.projectSummary || "No summary captured yet."}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                              <span className="rounded-full border border-saybrook-border px-2.5 py-1">
                                {request.sourceCitations?.length || 0} citations
                              </span>
                              <span className="rounded-full border border-saybrook-border px-2.5 py-1">
                                {request.attachments?.length || 0} attachments
                              </span>
                              <span className="rounded-full border border-saybrook-border px-2.5 py-1">
                                {request.preferredContact || "email"} preferred
                              </span>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <QueueEmptyState
                  title="No requests yet"
                  copy="Once a resident submits through the Saybrook intake flow, the trustee queue will show request cards here with status, contact info, question summary, and cited context."
                />
              )}
            </div>
          </section>

          <aside className="grid gap-4">
            <div className="rounded-[2rem] border border-saybrook-border bg-white/84 p-5 shadow-[0_22px_60px_rgba(17,33,28,0.10)] backdrop-blur">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                Operational options available
              </p>
              <h2 className="mt-2 font-display text-2xl text-saybrook-forest">
                Quietly powerful if you ever want it to be
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                These are UI-facing capability cues only. They make the internal portal feel
                complete without overcomplicating the live request data model.
              </p>

              <div className="mt-5 grid gap-3">
                {internalFeatures.map((feature) => (
                  <div
                    key={feature.title}
                    className="flex items-start gap-3 rounded-2xl border border-saybrook-border bg-saybrook-cream/75 p-4"
                  >
                    <div className="rounded-2xl border border-saybrook-border bg-white p-2 text-saybrook-forest shadow-sm">
                      <feature.icon size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-saybrook-ink">{feature.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{feature.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-saybrook-border bg-[linear-gradient(180deg,rgba(23,54,45,0.98),rgba(15,36,30,0.98))] p-5 text-white shadow-[0_22px_60px_rgba(17,33,28,0.16)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-sand-200/80">
                Queue posture
              </p>
              <h3 className="mt-2 font-display text-2xl text-white">
                Internal follow-up, not public marketing
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/72">
                This page is meant to help trustees review incoming requests fast, with a small
                amount of operational polish and room for richer workflow features later.
              </p>

              <div className="mt-5 grid gap-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-white/6 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                    Live queue
                  </p>
                  <p className="mt-1 text-white/85">
                    {queueConfig.enabled ? "Connected" : "Waiting for `VITE_SAYBROOK_REQUESTS_API_URL`"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/6 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                    Review cadence
                  </p>
                  <p className="mt-1 text-white/85">
                    Requests can be triaged in order, by status, or by deadline pressure.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/6 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                    Feature runway
                  </p>
                  <p className="mt-1 text-white/85">
                    SMS alerts, auto-acknowledgments, and staff notes are easy add-ons later.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
