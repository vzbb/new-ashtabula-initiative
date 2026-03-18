import { useState, useCallback } from "react";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// === NAI API Client - Robust Error Handling & Retry Logic ===
const API_CONFIG = {
  TIMEOUT_MS: 30000,
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY_MS: 1000,
  MAX_RETRY_DELAY_MS: 10000,
  RATE_LIMIT_STATUS: 429,
  RETRYABLE_STATUS_CODES: [408, 429, 500, 502, 503, 504],
};

const delay = (ms) => {
  const jitter = Math.random() * 200;
  return new Promise(resolve => setTimeout(resolve, ms + jitter));
};

const getBackoffDelay = (retryCount) => {
  const exponentialDelay = API_CONFIG.INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCount);
  return Math.min(exponentialDelay, API_CONFIG.MAX_RETRY_DELAY_MS);
};

const fetchWithTimeout = async (url, options = {}, timeoutMs = API_CONFIG.TIMEOUT_MS) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

const isRetryable = (errorOrResponse) => {
  if (errorOrResponse instanceof Response) {
    return API_CONFIG.RETRYABLE_STATUS_CODES.includes(errorOrResponse.status);
  }
  const errorMessage = errorOrResponse.message?.toLowerCase() || '';
  return (
    errorOrResponse.name === 'TypeError' ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('network') ||
    errorMessage.includes('failed to fetch') ||
    errorMessage.includes('timeout')
  );
};

const callGeminiAPI = async (prompt, model = 'gemini-1.5-flash', retryCount = 0) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('API key not configured. Please check your environment settings.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  };

  try {
    const response = await fetchWithTimeout(url, options, API_CONFIG.TIMEOUT_MS);

    if (response.status === API_CONFIG.RATE_LIMIT_STATUS) {
      if (retryCount < API_CONFIG.MAX_RETRIES) {
        await delay(getBackoffDelay(retryCount));
        return callGeminiAPI(prompt, model, retryCount + 1);
      }
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `API error: ${response.status}`;
      if (API_CONFIG.RETRYABLE_STATUS_CODES.includes(response.status) && retryCount < API_CONFIG.MAX_RETRIES) {
        await delay(getBackoffDelay(retryCount));
        return callGeminiAPI(prompt, model, retryCount + 1);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('No response content received from API.');
    }
    return data;
  } catch (error) {
    if (isRetryable(error) && retryCount < API_CONFIG.MAX_RETRIES) {
      await delay(getBackoffDelay(retryCount));
      return callGeminiAPI(prompt, model, retryCount + 1);
    }

    let userMessage = 'An error occurred while processing your request.';
    if (error.message?.includes('timeout')) {
      userMessage = 'Request timed out. Please check your connection and try again.';
    } else if (error.message?.includes('Rate limit') || error.message?.includes('API key') || error.message?.includes('No response content')) {
      userMessage = error.message;
    }
    throw new Error(userMessage);
  }
};

const extractResponseText = (responseData) => {
  return responseData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
};
// === End NAI API Client ===


// SVG Icons
const Icons = {
  sparkle: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  ),
  robot: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
    </svg>
  ),
  zap: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  lock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  copy: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  ),
  refresh: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>
    </svg>
  ),
  loader: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  ),
  alert: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>
    </svg>
  ),
  dollar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  target: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
};

const STYLE_OPTIONS = [
  "Mural",
  "Portrait",
  "Abstract",
  "Landscape", 
  "Custom Illustration",
  "Digital Art",
  "Mixed Media"
];

const BUDGET_OPTIONS = [
  "$250 - $500",
  "$500 - $1,000",
  "$1,000 - $2,500",
  "$2,500 - $5,000",
  "$5,000+"
];

function App() {
  const [formData, setFormData] = useState({
    clientName: "",
    style: "Mural",
    budget: "$500 - $1,000",
    timeline: "2-4 weeks",
    details: ""
  });
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const validateForm = () => {
    if (!formData.clientName.trim()) {
      setError("Please enter the client's name.");
      return false;
    }
    if (!formData.details.trim()) {
      setError("Please provide some project details.");
      return false;
    }
    if (!apiKey) {
      setError("API key not configured. Please set VITE_GEMINI_API_KEY in your environment.");
      return false;
    }
    return true;
  };

  const generateReply = async () => {
    setError("");
    setSuccess("");
    
    if (!validateForm()) return;

    setLoading(true);
    setReply("");

    try {
      const prompt = `Write a professional, friendly commission response email for a potential client.

Client Name: ${formData.clientName}
Art Style: ${formData.style}
Budget Range: ${formData.budget}
Timeline: ${formData.timeline}
Project Details: ${formData.details}

Requirements:
- Start with a warm greeting using the client's name
- Acknowledge their specific project details
- Express enthusiasm about the ${formData.style} style
- Address their budget range (${formData.budget}) professionally
- Include a clear next step to schedule a consultation
- Add a professional signature
- Keep it under 150 words
- Tone: professional yet approachable`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 300
            }
          }),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || `API Error: ${res.status} ${res.statusText}`
        );
      }

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error.message || "Unknown API error");
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      
      if (!text) {
        throw new Error("No response generated. Please try again.");
      }

      if (data.candidates?.[0]?.finishReason === "SAFETY") {
        throw new Error("Response blocked by safety filters. Please adjust your input.");
      }

      setReply(text);
      setSuccess("Reply generated successfully!");
    } catch (e) {
      if (e.name === "AbortError") {
        setError("Request timed out. Please check your connection and try again.");
      } else {
        setError(e.message || "Failed to generate reply. Please try again.");
      }
      console.error("Generation error:", e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(reply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  const clearAll = () => {
    setFormData({
      clientName: "",
      style: "Mural",
      budget: "$500 - $1,000",
      timeline: "2-4 weeks",
      details: ""
    });
    setReply("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">Artist Commission Form</p>
          <h1>Convert inquiries into paid commissions</h1>
          <p className="sub">
            AI-powered reply generator. Transform casual inquiries into 
            professional commission proposals with one click.
          </p>
          <div className="hero-actions">
            <button 
              className="primary" 
              onClick={generateReply} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Icons.loader />
                  Generating...
                </>
              ) : (
                <>
                  <Icons.sparkle />
                  Generate Reply
                </>
              )}
            </button>
            <button className="ghost" onClick={clearAll}>
              Clear Form
            </button>
          </div>
          <div className="trust">
            <span><Icons.robot /> Gemini 2.0 Flash</span>
            <span><Icons.zap /> ~5 second output</span>
            <span><Icons.lock /> Private &amp; Secure</span>
          </div>
        </div>
        
        <div className="hero-card">
          <h3>Project Details</h3>
          
          <label>
            Client Name
            <input 
              value={formData.clientName} 
              onChange={(e) => updateField("clientName", e.target.value)}
              placeholder="e.g., Sarah Johnson"
            />
          </label>
          
          <label>
            Art Style
            <select 
              value={formData.style} 
              onChange={(e) => updateField("style", e.target.value)}
            >
              {STYLE_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          
          <label>
            Budget Range
            <select 
              value={formData.budget} 
              onChange={(e) => updateField("budget", e.target.value)}
            >
              {BUDGET_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </label>
          
          <label>
            Timeline
            <select 
              value={formData.timeline} 
              onChange={(e) => updateField("timeline", e.target.value)}
            >
              <option>1-2 weeks</option>
              <option>2-4 weeks</option>
              <option>1-2 months</option>
              <option>2-3 months</option>
              <option>Flexible</option>
            </select>
          </label>
          
          <label>
            Project Details
            <textarea 
              value={formData.details} 
              onChange={(e) => updateField("details", e.target.value)}
              placeholder="Describe the project, dimensions, location, etc."
              rows={3}
            />
          </label>
        </div>
      </header>

      {(error || success) && (
        <section className="card animate-in">
          {error && <div className="error"><Icons.alert /> {error}</div>}
          {success && <div className="success"><Icons.check /> {success}</div>}
        </section>
      )}

      <section className="card">
        <div className="card-head">
          <h2>Generated Reply</h2>
          <span className="pill">Gemini API</span>
        </div>
        
        {loading ? (
          <div className="loading">
            <div className="spinner" />
            <span>Crafting your professional response...</span>
          </div>
        ) : reply ? (
          <div className="animate-in">
            <pre className="output">{reply}</pre>
            <div className="hero-actions" style={{ marginTop: '16px' }}>
              <button className="primary" onClick={copyToClipboard}>
                {copied ? <><Icons.check /> Copied!</> : <><Icons.copy /> Copy to Clipboard</>}
              </button>
              <button className="ghost" onClick={generateReply}>
                <Icons.refresh /> Regenerate
              </button>
            </div>
          </div>
        ) : (
          <p className="muted">
            Your AI-generated reply will appear here. Fill out the form and click "Generate Reply" to get started.
          </p>
        )}
      </section>

      <section className="grid">
        <div className="tile">
          <h3><Icons.zap /> Faster Response</h3>
          <p>Instant professional replies boost client conversion by up to 40%.</p>
        </div>
        
        <div className="tile">
          <h3><Icons.dollar /> Higher Value</h3>
          <p>AI-suggested package upgrades increase average commission value.</p>
        </div>
        
        <div className="tile">
          <h3><Icons.clock /> Less Admin</h3>
          <p>Automated follow-ups and scheduling integration saves hours weekly.</p>
        </div>
      </section>

      <footer className="footer">
        <p>Local Artist Commission Assistant • Ashtabula County, OH</p>
        <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '8px' }}>
          Powered by Google Gemini AI
        </p>
      </footer>
    </div>
  );
}

export default App;
