CREATE TABLE IF NOT EXISTS saybrook_zoning_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submitted_at TEXT NOT NULL,
  slug TEXT NOT NULL DEFAULT 'saybrook-zoning',
  jurisdiction TEXT NOT NULL DEFAULT 'Saybrook Township',
  request_type TEXT,
  applicant_name TEXT,
  email TEXT,
  phone TEXT,
  preferred_contact TEXT,
  property_address TEXT,
  project_type TEXT,
  project_summary TEXT,
  specific_question TEXT,
  ai_summary TEXT,
  source_answer TEXT,
  source_citations_json TEXT NOT NULL DEFAULT '[]',
  attachments_json TEXT NOT NULL DEFAULT '[]',
  chat_transcript_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'new'
);

CREATE INDEX IF NOT EXISTS idx_saybrook_requests_status
  ON saybrook_zoning_requests(status);

CREATE INDEX IF NOT EXISTS idx_saybrook_requests_submitted_at
  ON saybrook_zoning_requests(submitted_at);
