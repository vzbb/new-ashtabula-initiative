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


// SVG Icons
const Icons = {
  compass: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  ),
  ruler: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/>
      <path d="m14.5 12.5 2-2"/>
      <path d="m11.5 9.5 2-2"/>
      <path d="m8.5 6.5 2-2"/>
      <path d="m17.5 15.5 2-2"/>
    </svg>
  ),
  check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  alert: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" x2="12" y1="9" y2="13"/>
      <line x1="12" x2="12.01" y1="17" y2="17"/>
    </svg>
  ),
  clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  fileText: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" x2="8" y1="13" y2="13"/>
      <line x1="16" x2="8" y1="17" y2="17"/>
      <line x1="10" x2="8" y1="9" y2="9"/>
    </svg>
  ),
  handshake: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m11 17 2 2a1 1 0 1 0 3-3"/>
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.27.13a4 4 0 0 0 5.66-4.8l-2.14-2.14"/>
      <path d="M3.69 9.75a6.15 6.15 0 0 0 1.5 8.5l2.04-2"/>
      <path d="M18.36 19.36a9 9 0 0 0 1.18-9.75L15.5 5.5"/>
    </svg>
  ),
  loader: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  ),
};

function App() {
  const [project, setProject] = useState("Retail build-out, 4,000 sq ft");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    setLoading(true);
    setError("");
    setSummary("");
    try {
      const prompt = `Summarize key risks and next steps for this blueprint project: ${project}. Provide 3 bullets and a CTA to schedule review. 90 words max.`;
      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
    } catch (e) {
      setError(e.message || "Failed to generate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white selection:bg-purple-500/30">
      {/* Animated Orbs */}
      <div className="orb orb-cyan" />
      <div className="orb orb-purple" />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <nav className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Icons.compass />
            </div>
            <span className="font-display font-bold text-xl">Blueprint <span className="accent-purple">Analyzer</span></span>
          </div>
          <div className="text-sm text-white/50">Construction Risk Intelligence</div>
        </nav>

        <div className="animate-fade-in">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-3 glass-panel p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-cyan-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10">
                <p className="text-sm font-medium uppercase tracking-widest accent-purple mb-4">AI Risk Analysis</p>
                <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4 leading-tight">
                  Spot risks before they <br />
                  <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">cost money</span>
                </h1>
                <p className="text-lg text-white/60 mb-8 max-w-md">
                  Gemini-powered insights that identify issues early and keep projects on track.
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                  <button 
                    onClick={analyze} 
                    disabled={loading}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Icons.loader /> : <Icons.ruler />}
                    {loading ? "Analyzing..." : "Generate Summary"}
                  </button>
                  <button className="btn-secondary flex items-center gap-2">
                    <Icons.handshake />
                    Book consult
                  </button>
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-white/50">
                  <span className="flex items-center gap-2">
                    <Icons.ruler /> Gemini API
                  </span>
                  <span className="flex items-center gap-2">
                    <Icons.clock /> 5-second output
                  </span>
                  <span className="flex items-center gap-2">
                    <Icons.check /> Fewer surprises
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 glass-card p-6">
              <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
                <Icons.fileText />
                Project Details
              </h3>
              <label className="block text-sm text-white/60 mb-2">Describe your project</label>
              <textarea 
                value={project} 
                onChange={(e) => setProject(e.target.value)}
                rows={5}
                className="mb-4 resize-none"
                placeholder="Enter project details..."
              />
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-sm text-purple-300">
                  <strong className="flex items-center gap-2 mb-1">
                    <Icons.alert /> AI will analyze
                  </strong>
                  Zoning issues, permit requirements, cost risks, timeline concerns
                </p>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="glass-panel p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                <Icons.fileText />
                Risk Analysis Summary
              </h2>
              <span className="tag">Gemini API</span>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 mb-4">
                {error}
              </div>
            )}

            {summary ? (
              <div className="glass-panel p-6 border-l-4 border-l-purple-500">
                <pre className="whitespace-pre-wrap text-white/80 leading-relaxed font-sans">{summary}</pre>
                <div className="mt-6 flex gap-3">
                  <button onClick={analyze} className="btn-secondary text-sm flex items-center gap-2">
                    <Icons.ruler /> Regenerate
                  </button>
                  <button className="btn-primary text-sm flex items-center gap-2">
                    <Icons.handshake /> Schedule review
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-white/30">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <Icons.fileText />
                </div>
                <p>Analysis will appear here</p>
              </div>
            )}
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                <Icons.alert />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">Risk reduction</h3>
              <p className="text-sm text-white/60">Catch zoning and permit issues before they cause delays.</p>
            </div>

            <div className="glass-card p-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                <Icons.clock />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">Faster approvals</h3>
              <p className="text-sm text-white/60">Clear next steps for permits and inspections.</p>
            </div>

            <div className="glass-card p-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                <Icons.handshake />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">Client trust</h3>
              <p className="text-sm text-white/60">Transparent analysis builds confidence with stakeholders.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/5 text-center text-sm text-white/40">
          <p>Local Builders • Ashtabula County, OH</p>
          <p className="mt-2">Powered by Gemini 2.5 Flash</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
