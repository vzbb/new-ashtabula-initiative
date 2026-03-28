const DEFAULT_REQUESTS_API_URL =
  "https://flow.noirsys.com/webhook/saybrook-zoning-trustee-requests";

const REQUESTS_API_URL =
  import.meta.env.VITE_SAYBROOK_REQUESTS_API_URL ||
  import.meta.env.VITE_SAYBROOK_REQUESTS_QUEUE_URL ||
  DEFAULT_REQUESTS_API_URL;
const REQUESTS_HEALTH_URL = import.meta.env.VITE_SAYBROOK_REQUESTS_HEALTH_URL || "";

function safeJsonParse(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [trimmed];
  }
}

function normalizeStatus(value) {
  const status = String(value || "new").trim().toLowerCase();
  if (status.includes("need")) return "needs info";
  if (status.includes("review")) return "reviewing";
  if (status.includes("respond")) return "responded";
  if (status.includes("close")) return "closed";
  return status || "new";
}

function normalizeRequest(item) {
  const record = item?.record && typeof item.record === "object" ? item.record : item;
  const citations = safeJsonParse(
    record.source_citations_json ??
      record.sourceCitations ??
      record.citations ??
      []
  );
  const attachments = safeJsonParse(
    record.attachments_json ??
      record.attachments ??
      record.images ??
      record.image_urls ??
      []
  );
  const transcript = safeJsonParse(
    record.chat_transcript_json ??
      record.chatTranscript ??
      record.chat_transcript ??
      []
  );

  return {
    id: record.id ?? record.queueId ?? record.submission_id ?? record.submissionId ?? record.ticketId ?? "",
    submittedAt:
      record.submitted_at ??
      record.submittedAt ??
      record.created_at ??
      record.createdAt ??
      "",
    status: normalizeStatus(record.status),
    applicantName:
      record.applicant_name ??
      record.fullName ??
      record.applicantName ??
      record.name ??
      "Unassigned resident",
    email: record.email ?? "",
    phone: record.phone ?? "",
    preferredContact: record.preferred_contact ?? record.preferredContact ?? "email",
    propertyAddress:
      record.property_address ?? record.propertyAddress ?? record.address ?? "",
    projectType: record.project_type ?? record.projectType ?? "",
    projectSummary:
      record.project_summary ??
      record.projectSummary ??
      record.residentSummary ??
      "",
    specificQuestion:
      record.specific_question ??
      record.specificQuestion ??
      record.question ??
      "",
    aiSummary: record.ai_summary ?? record.aiSummary ?? record.aiContextSummary ?? "",
    sourceAnswer: record.source_answer ?? record.sourceAnswer ?? "",
    sourceCitations: citations,
    attachments,
    chatTranscript: transcript,
  };
}

function normalizeQueueResponse(data) {
  const rawItems = Array.isArray(data)
    ? data
    : Array.isArray(data?.requests)
      ? data.requests
      : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.records)
          ? data.records
          : [];

  const requests = rawItems.map(normalizeRequest).sort((a, b) => {
    const left = new Date(b.submittedAt || 0).getTime();
    const right = new Date(a.submittedAt || 0).getTime();
    return left - right;
  });

  return {
    requests,
    count:
      typeof data?.count === "number" ? data.count : requests.length,
    raw: data,
  };
}

export function getRequestsConfiguration() {
  return {
    apiUrl: REQUESTS_API_URL,
    healthUrl: REQUESTS_HEALTH_URL,
    enabled: Boolean(REQUESTS_API_URL),
  };
}

export async function checkRequestsHealth() {
  if (!REQUESTS_API_URL) return false;
  if (!REQUESTS_HEALTH_URL) return true;

  try {
    const response = await fetch(REQUESTS_HEALTH_URL, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return response.ok;
  } catch (error) {
    console.warn("Saybrook requests queue health check failed:", error);
    return false;
  }
}

export async function fetchSaybrookRequests() {
  if (!REQUESTS_API_URL) {
    throw new Error("Requests API URL is not configured.");
  }

  const response = await fetch(REQUESTS_API_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Requests API error ${response.status}: ${detail}`);
  }

  const data = await response.json().catch(() => ({}));
  return normalizeQueueResponse(data);
}
