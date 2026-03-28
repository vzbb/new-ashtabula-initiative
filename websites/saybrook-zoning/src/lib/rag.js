/**
 * Saybrook-specific RAG helpers.
 *
 * The preferred path is a thin backend endpoint (for example an n8n webhook)
 * that handles question embedding, Qdrant search, and Ollama answer synthesis.
 * The browser should not talk directly to Ollama or Qdrant in the normal path.
 */

const DEFAULT_RAG_API_URL = "https://flow.noirsys.com/webhook/saybrook-zoning-query";
const DEFAULT_REQUEST_API_URL = "https://flow.noirsys.com/webhook/saybrook-zoning-request";
const DEFAULT_TRUSTEE_REQUESTS_API_URL =
  "https://flow.noirsys.com/webhook/saybrook-zoning-trustee-requests";

const RAG_API_URL = import.meta.env.VITE_SAYBROOK_RAG_API_URL || DEFAULT_RAG_API_URL;
const RAG_HEALTH_URL = import.meta.env.VITE_SAYBROOK_RAG_HEALTH_URL || "";
const REQUEST_API_URL =
  import.meta.env.VITE_SAYBROOK_REQUEST_API_URL ||
  import.meta.env.VITE_SAYBROOK_QUEUE_URL ||
  DEFAULT_REQUEST_API_URL;
const TRUSTEE_REQUESTS_API_URL =
  import.meta.env.VITE_SAYBROOK_REQUESTS_API_URL || DEFAULT_TRUSTEE_REQUESTS_API_URL;
const REQUEST_HEALTH_URL = import.meta.env.VITE_SAYBROOK_REQUEST_HEALTH_URL || "";

export const FALLBACK_CONTEXT = `
Saybrook Township zoning guidance is temporarily unavailable.
The assistant should help residents, contractors, trustees, and staff find the
right section of the zoning code quickly and keep the intake process moving.

When AI retrieval is unavailable, the assistant should:
- avoid pretending to know exact legal determinations
- recommend checking the zoning document set and township intake queue
- encourage direct follow-up with the Saybrook Township Zoning Office
- explain that township-specific guidance should be confirmed before acting
`;

export function getRagConfiguration() {
  return {
    apiUrl: RAG_API_URL,
    healthUrl: RAG_HEALTH_URL,
    enabled: Boolean(RAG_API_URL),
  };
}

export function getRequestConfiguration() {
  return {
    apiUrl: REQUEST_API_URL,
    healthUrl: REQUEST_HEALTH_URL,
    enabled: Boolean(REQUEST_API_URL),
  };
}

export function getTrusteeRequestsConfiguration() {
  return {
    apiUrl: TRUSTEE_REQUESTS_API_URL,
    enabled: Boolean(TRUSTEE_REQUESTS_API_URL),
  };
}

export async function checkRagHealth() {
  if (!RAG_API_URL) return false;
  if (!RAG_HEALTH_URL) return true;

  try {
    const response = await fetch(RAG_HEALTH_URL, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return response.ok;
  } catch (error) {
    console.warn("Saybrook RAG health check failed:", error);
    return false;
  }
}

export async function checkRequestHealth() {
  if (!REQUEST_API_URL) return false;
  if (!REQUEST_HEALTH_URL) return true;

  try {
    const response = await fetch(REQUEST_HEALTH_URL, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return response.ok;
  } catch (error) {
    console.warn("Saybrook request queue health check failed:", error);
    return false;
  }
}

export async function askRagService(question, history = []) {
  if (!RAG_API_URL) {
    throw new Error("RAG API URL is not configured.");
  }

  const response = await fetch(RAG_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      question,
      history: history.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      slug: "saybrook-zoning",
      jurisdiction: "Saybrook Township",
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`RAG API error ${response.status}: ${detail}`);
  }

  const data = await response.json();
  return normalizeRagResponse(data);
}

export async function submitFormalRequest(draft) {
  if (!REQUEST_API_URL) {
    throw new Error("Request queue API URL is not configured.");
  }

  const payload = buildRequestPayload(draft);
  const attachments = Array.isArray(draft.attachments) ? draft.attachments : [];
  const hasAttachments = attachments.length > 0;

  const response = await fetch(REQUEST_API_URL, {
    method: "POST",
    headers: hasAttachments
      ? { Accept: "application/json" }
      : {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
    body: hasAttachments ? buildRequestFormData(payload, attachments) : JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Request queue error ${response.status}: ${detail}`);
  }

  const data = await response.json().catch(() => ({}));
  return normalizeRequestResponse(data);
}

export async function fetchTrusteeRequests() {
  if (!TRUSTEE_REQUESTS_API_URL) {
    throw new Error("Trustee requests API URL is not configured.");
  }

  const response = await fetch(TRUSTEE_REQUESTS_API_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Trustee requests API error ${response.status}: ${detail}`);
  }

  const data = await response.json();
  return {
    ok: Boolean(data.ok),
    count: typeof data.count === "number" ? data.count : 0,
    requests: Array.isArray(data.requests) ? data.requests : [],
  };
}

function normalizeRagResponse(data) {
  return {
    answer:
      data.answer ||
      data.text ||
      "I couldn't produce a zoning answer from the current knowledge service.",
    citations: Array.isArray(data.citations) ? data.citations : [],
    model: data.model || "unknown",
    mode: data.mode || "rag",
    contextCount:
      typeof data.contextCount === "number"
        ? data.contextCount
        : Array.isArray(data.citations)
          ? data.citations.length
          : 0,
  };
}

function buildRequestPayload(draft) {
  return {
    slug: "saybrook-zoning",
    jurisdiction: "Saybrook Township",
    submittedAt: new Date().toISOString(),
    requestType: draft.requestType || draft.request_type || draft.projectType || "zoning guidance",
    fullName: draft.fullName || draft.applicantName || draft.name || "",
    email: draft.email || "",
    phone: draft.phone || "",
    preferredContact: draft.preferredContact || draft.preferred_contact || "email",
    propertyAddress: draft.propertyAddress || draft.property_address || draft.address || "",
    projectType: draft.projectType || draft.project_type || "",
    projectSummary:
      draft.projectSummary || draft.residentSummary || draft.draftRequest || "",
    specificQuestion: draft.specificQuestion || draft.sourceQuestion || draft.question || "",
    aiSummary: draft.aiSummary || draft.aiContextSummary || "",
    sourceQuestion: draft.sourceQuestion || draft.question || "",
    sourceAnswer: draft.sourceAnswer || draft.aiContextSummary || "",
    sourceCitations: Array.isArray(draft.sourceCitations)
      ? draft.sourceCitations
      : Array.isArray(draft.citations)
        ? draft.citations
        : [],
    chatTranscript: Array.isArray(draft.chatTranscript) ? draft.chatTranscript : [],
    imageCount: Array.isArray(draft.attachments) ? draft.attachments.length : 0,
    imageNames: Array.isArray(draft.attachments) ? draft.attachments.map((file) => file.name) : [],
  };
}

function buildRequestFormData(payload, attachments) {
  const formData = new FormData();
  formData.append("payload", new Blob([JSON.stringify(payload)], { type: "application/json" }));
  attachments.forEach((file, index) => {
    formData.append(`attachment_${index + 1}`, file, file.name);
  });
  return formData;
}

function normalizeRequestResponse(data) {
  return {
    status: data.status || "queued",
    message:
      data.message ||
      data.detail ||
      "Request payload was accepted by the township queue endpoint.",
    queueId: data.queueId || data.id || data.ticketId || "",
    receivedAt: data.receivedAt || data.createdAt || "",
    raw: data,
  };
}
