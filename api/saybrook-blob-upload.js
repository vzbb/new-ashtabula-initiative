const { Blob } = require("node:buffer");
const { put } = require("@vercel/blob");

function normalizeBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

function sanitizeFileName(fileName, fallbackIndex) {
  const base = String(fileName || `attachment-${fallbackIndex + 1}`).trim();
  const safe = base.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-");
  return safe || `attachment-${fallbackIndex + 1}`;
}

function asBuffer(base64) {
  if (typeof base64 !== "string" || !base64.trim()) return null;
  const stripped = base64.includes(",") ? base64.split(",").pop() : base64;
  return Buffer.from(stripped, "base64");
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = normalizeBody(req.body);
  const attachments = Array.isArray(body.attachments) ? body.attachments : [];

  if (!attachments.length) {
    return res.status(200).json({ ok: true, attachments: [] });
  }

  const uploaded = [];

  for (let index = 0; index < attachments.length; index += 1) {
    const item = attachments[index] || {};
    const buffer = asBuffer(item.data || item.base64 || item.contents);
    if (!buffer) {
      continue;
    }

    const fileName = sanitizeFileName(item.fileName || item.name || `attachment-${index + 1}`, index);
    const mimeType = item.mimeType || item.type || "application/octet-stream";
    const blob = await put(`saybrook-zoning/${Date.now()}-${index + 1}-${fileName}`, new Blob([buffer], { type: mimeType }), {
      access: "public",
      addRandomSuffix: true,
    });

    uploaded.push({
      key: item.key || `attachment_${index + 1}`,
      fileName,
      mimeType,
      size: typeof item.size === "number" ? item.size : typeof item.fileSize === "number" ? item.fileSize : buffer.length,
      url: blob.url,
      pathname: blob.pathname,
    });
  }

  return res.status(200).json({
    ok: true,
    attachments: uploaded,
    count: uploaded.length,
  });
};
