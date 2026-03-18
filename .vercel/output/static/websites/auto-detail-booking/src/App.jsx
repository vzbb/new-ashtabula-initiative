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
  car: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
      <circle cx="6.5" cy="16.5" r="2.5"/>
      <circle cx="16.5" cy="16.5" r="2.5"/>
    </svg>
  ),
  calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
      <line x1="16" x2="16" y1="2" y2="6"/>
      <line x1="8" x2="8" y1="2" y2="6"/>
      <line x1="3" x2="21" y1="10" y2="10"/>
    </svg>
  ),
  check: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  diamond: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="6 3 18 3 22 9 12 22 2 9"/>
    </svg>
  ),
  sparkles: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  ),
  message: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
    </svg>
  ),
  creditCard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2"/>
      <line x1="2" x2="22" y1="10" y2="10"/>
    </svg>
  ),
  loader: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  ),
};

function App() {
  const [date, setDate] = useState("");
  const [vehicle, setVehicle] = useState("SUV");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const confirm = async () => {
    setLoading(true);
    setError("");
    setReply("");
    try {
      const prompt = `Write a short booking confirmation for auto detailing on ${date || 'the selected date'} for ${vehicle}. Include a premium add-on suggestion. 70 words max.`;
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
      setReply(text);
    } catch (e) {
      setError(e.message || "Failed to generate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white selection:bg-cyan-500/30">
      {/* Animated Orbs */}
      <div className="orb orb-cyan" />
      <div className="orb orb-purple" />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <nav className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Icons.car />
            </div>
            <span className="font-display font-bold text-xl">Auto <span className="accent-cyan">Detail Pro</span></span>
          </div>
          <div className="text-sm text-white/50">Premium Detailing Services</div>
        </nav>

        <div className="animate-fade-in">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-3 glass-panel p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-purple-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10">
                <p className="text-sm font-medium uppercase tracking-widest accent-cyan mb-4">AI Booking Assistant</p>
                <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4 leading-tight">
                  Book more details with <br />
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">instant confirmations</span>
                </h1>
                <p className="text-lg text-white/60 mb-8 max-w-md">
                  Gemini-powered replies with premium add-on suggestions that boost revenue.
                </p>

                <div className="flex flex-wrap gap-4 mb-8">
                  <button 
                    onClick={confirm} 
                    disabled={loading}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Icons.loader /> : <Icons.message />}
                    {loading ? "Generating..." : "Generate Confirmation"}
                  </button>
                  <button className="btn-secondary flex items-center gap-2">
                    <Icons.creditCard />
                    Enable payments
                  </button>
                </div>

                <div className="flex flex-wrap gap-6 text-sm text-white/50">
                  <span className="flex items-center gap-2">
                    <Icons.car /> Gemini API
                  </span>
                  <span className="flex items-center gap-2">
                    <Icons.sparkles /> 5-second output
                  </span>
                  <span className="flex items-center gap-2">
                    <Icons.diamond /> Upsell add-ons
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 glass-card p-6">
              <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
                <Icons.calendar />
                Appointment Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Select Date</label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Vehicle Type</label>
                  <input 
                    value={vehicle} 
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder="SUV, Sedan, Truck..."
                  />
                </div>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <p className="text-sm text-cyan-300">
                  <strong className="flex items-center gap-2 mb-1">
                    <Icons.sparkles /> AI will suggest
                  </strong>
                  Ceramic coating, interior shampoo, or paint protection
                </p>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="glass-panel p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                <Icons.message />
                Generated Confirmation
              </h2>
              <span className="tag">Gemini API</span>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 mb-4">
                {error}
              </div>
            )}

            {reply ? (
              <div className="glass-panel p-6 border-l-4 border-l-cyan-500">
                <pre className="whitespace-pre-wrap text-white/80 leading-relaxed font-sans">{reply}</pre>
                <div className="mt-6 flex gap-3">
                  <button onClick={confirm} className="btn-secondary text-sm flex items-center gap-2">
                    <Icons.sparkles /> Regenerate
                  </button>
                  <button className="btn-primary text-sm flex items-center gap-2">
                    <Icons.check /> Send to customer
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-white/30">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <Icons.message />
                </div>
                <p>Confirmation will appear here</p>
              </div>
            )}
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                <Icons.check />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">Faster close</h3>
              <p className="text-sm text-white/60">Reduce no-shows with instant, professional responses.</p>
            </div>

            <div className="glass-card p-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                <Icons.diamond />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">Higher ticket</h3>
              <p className="text-sm text-white/60">Promote ceramic coatings and interior upgrades automatically.</p>
            </div>

            <div className="glass-card p-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                <Icons.calendar />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">Less admin</h3>
              <p className="text-sm text-white/60">Automate confirmations and follow-ups with AI precision.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/5 text-center text-sm text-white/40">
          <p>Local Auto Detail • Ashtabula County, OH</p>
          <p className="mt-2">Powered by Gemini 2.5 Flash</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
