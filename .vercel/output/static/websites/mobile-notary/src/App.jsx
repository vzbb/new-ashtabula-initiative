import { useState } from "react";
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


// Official Seal with Pen Logo
const LogoIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-icon">
    <circle cx="32" cy="32" r="28" fill="#fdfbf7" stroke="#922b21" strokeWidth="2"/>
    <circle cx="32" cy="32" r="22" fill="none" stroke="#2874a6" strokeWidth="1.5" strokeDasharray="4 2"/>
    <rect x="28" y="12" width="8" height="28" rx="1" fill="#2c3e50"/>
    <polygon points="24,40 32,52 40,40" fill="#d4af37"/>
    <rect x="30" y="8" width="4" height="8" fill="#d4af37"/>
    <circle cx="32" cy="32" r="6" fill="#922b21"/>
    <text x="32" y="35" textAnchor="middle" fill="#fdfbf7" fontSize="8" fontWeight="bold">N</text>
    <path d="M14 32c0-10 8-16 8-16M50 32c0-10-8-16-8-16" stroke="#2874a6" strokeWidth="1.5" fill="none"/>
  </svg>
);

const StampIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22h16"/>
    <path d="M6 18v4"/>
    <path d="M18 18v4"/>
    <path d="M6 14a6 6 0 0 1 12 0v4H6v-4z"/>
    <circle cx="12" cy="8" r="4"/>
  </svg>
);

const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
    <circle cx="6.5" cy="16.5" r="2.5"/>
    <circle cx="16.5" cy="16.5" r="2.5"/>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const DOC_TYPES = [
  { id: "real_estate", name: "Real Estate Documents", icon: "🏠" },
  { id: "loan", name: "Loan Signing", icon: "📄" },
  { id: "legal", name: "Legal Affidavits", icon: "⚖️" },
  { id: "medical", name: "Medical Forms", icon: "🏥" },
  { id: "power", name: "Power of Attorney", icon: "✍️" },
];

function App() {
  const [docType, setDocType] = useState("real_estate");
  const [clientName, setClientName] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateConfirmation = async () => {
    if (!clientName.trim()) {
      setError("Please enter client name");
      return;
    }
    
    setLoading(true);
    setError("");
    setSummary("");
    try {
      const typeName = DOC_TYPES.find(d => d.id === docType)?.name || docType;
      const prompt = `Write a professional mobile notary appointment confirmation for ${clientName} for ${typeName} signing. Include: preparation checklist (valid ID, witnesses if needed), travel fee ($25), per-signature fee ($5), estimated appointment duration, and contact info. Professional tone, 100 words max.`;
      
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!text) throw new Error("No response from Gemini.");
      setSummary(text);
    } catch (e) {
      setError(e.message || "Failed to generate confirmation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="background-pattern" aria-hidden="true">
        <svg className="seal-bg" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="sealPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="20" fill="none" stroke="#2874a6" strokeWidth="1" opacity="0.15"/>
              <circle cx="50" cy="50" r="15" fill="none" stroke="#922b21" strokeWidth="0.5" opacity="0.12" strokeDasharray="2 2"/>
              <rect x="42" y="35" width="16" height="30" rx="2" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.1"/>
              <path d="M30 50 Q50 30 70 50" fill="none" stroke="#2874a6" strokeWidth="1" opacity="0.1"/>
              <path d="M30 50 Q50 70 70 50" fill="none" stroke="#922b21" strokeWidth="1" opacity="0.1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sealPattern)"/>
        </svg>
      </div>
      
      <div className="container">
        <header className="header">
          <div className="brand">
            <LogoIcon />
            <div className="brand-text">
              <span className="brand-name">Mobile Notary</span>
              <span className="brand-tagline">Professional • Bonded • Insured</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          <section className="hero-card">
            <div className="hero-content">
              <p className="eyebrow">Ohio Commissioned</p>
              <h1>Notary Services at Your Doorstep</h1>
              <p className="sub">Professional mobile notary for real estate, legal documents, and personal affairs. We come to you.</p>
              
              <div className="trust">
                <span className="trust-item"><StampIcon /> State Commissioned</span>
                <span className="trust-item"><CarIcon /> Mobile Service</span>
                <span className="trust-item"><ShieldIcon /> Bonded & Insured</span>
              </div>
            </div>
            
            <div className="input-card">
              <h3>Appointment Details</h3>
              
              <label>
                <span>Document Type</span>
                <select 
                  value={docType} 
                  onChange={(e) => setDocType(e.target.value)}
                  className="select-input"
                >
                  {DOC_TYPES.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </select>
              </label>
              
              <label>
                <span>Client Name</span>
                <input 
                  type="text" 
                  value={clientName} 
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter full legal name"
                />
              </label>
              
              <button 
                className="primary" 
                onClick={generateConfirmation} 
                disabled={loading}
              >
                {loading ? "Generating..." : "Create Confirmation"}
              </button>
            </div>
          </section>

          <section className="result-card">
            <div className="card-header">
              <h2>Appointment Confirmation</h2>
              <span className="pill">AI Generated</span>
            </div>
            
            {error && <div className="error">{error}</div>}
            
            {summary ? (
              <div className="output">{summary}</div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p>Enter appointment details to generate a professional confirmation with fees and preparation checklist.</p>
              </div>
            )}
          </section>

          <section className="features">
            <div className="feature">
              <div className="feature-icon">🚗</div>
              <h3>We Come to You</h3>
              <p>Home, office, hospital, or nursing facility visits available.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📅</div>
              <h3>Flexible Hours</h3>
              <p>Evening and weekend appointments to fit your schedule.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">✓</div>
              <h3>Error-Free</h3>
              <p>Experienced with loan signings and legal documents.</p>
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>Licensed Mobile Notary • Ashtabula County, Ohio</p>
          <p className="disclaimer">Notaries do not provide legal advice. Consult an attorney for legal matters.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
