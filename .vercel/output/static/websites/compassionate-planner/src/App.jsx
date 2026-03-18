import { useState } from "react";
import { 
  HeartHandshake, 
  ArrowRight, 
  ArrowLeft, 
  Leaf, 
  BookOpen, 
  Music, 
  FileText, 
  Printer, 
  Phone,
  CheckCircle2,
  CalendarHeart,
  Users
} from "lucide-react";
import "./App.css";

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

function App() {
  const [step, setStep] = useState(0); // 0: Home, 1: Basics, 2: Preferences, 3: Tributes, 4: Wishes, 5: Summary
  const [formData, setFormData] = useState({
    planningFor: "myself", // myself, loved_one
    name: "",
    disposition: "", // burial, cremation, green_burial
    serviceType: "", // traditional, memorial, celebration, private
    music: "",
    honoredGuests: "",
    specialRequests: ""
  });
  
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const generatePlan = async () => {
    setLoading(true);
    setError("");
    setStep(5);
    try {
      const isSelf = formData.planningFor === "myself";
      const subject = isSelf ? "their own" : `their loved one, ${formData.name}'s,`;
      const nameRef = formData.name || (isSelf ? "the individual" : "the loved one");
      
      const prompt = `You are a compassionate, professional end-of-life planning assistant for Ducro Funeral Services. 
      Write a beautifully formatted, gentle, and comprehensive planning summary.
      
      Details:
      - Planning for: ${subject}
      - Name: ${nameRef}
      - Disposition Preference: ${formData.disposition || 'Undecided'}
      - Service Type: ${formData.serviceType || 'Undecided'}
      - Music Preferences: ${formData.music || 'None specified'}
      - Honored Guests / Notification List: ${formData.honoredGuests || 'None specified'}
      - Special Requests / Meaningful Elements: ${formData.specialRequests || 'None specified'}
      
      Structure the response clearly using Markdown:
      1. A warm, comforting opening paragraph honoring their proactive step in planning.
      2. "Summary of Preferences" (Bullet points covering the details provided).
      3. "Personal Touches" (Highlighting music, guests, and requests).
      4. "Recommended Next Steps" (Provide 2-3 gentle, actionable steps like gathering specific documents or scheduling a consultation with a Ducro director).
      
      Keep the tone empathetic, dignified, and clear.`;

      const data = await callGeminiAPI(prompt);
      const text = extractResponseText(data);
      setSummary(text);
    } catch (e) {
      setError(e.message || "Failed to generate your plan. Please try again.");
      setStep(4); // Go back to last step on error
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const renderProgressBar = () => {
    if (step === 0 || step === 5) return null;
    const progress = ((step) / 4) * 100;
    return (
      <div className="progress-container print-hide">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-labels">
          <span className={step >= 1 ? "active" : ""}>Basics</span>
          <span className={step >= 2 ? "active" : ""}>Preferences</span>
          <span className={step >= 3 ? "active" : ""}>Tributes</span>
          <span className={step >= 4 ? "active" : ""}>Wishes</span>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Background patterns */}
      <div className="bg-decor top-left"></div>
      <div className="bg-decor bottom-right"></div>

      {/* Header */}
      <header className="header print-hide">
        <div className="header-content">
          <div className="logo" onClick={() => setStep(0)} style={{cursor: 'pointer'}}>
            <div className="logo-icon">
              <Leaf size={24} color="white" />
            </div>
            <div>
              <div className="logo-text">Ducro Funeral Services</div>
              <div className="logo-subtext">Serving Ashtabula County Since 1892</div>
            </div>
          </div>
          <div className="header-contact">
            <Phone size={16} /> (440) 992-2191
          </div>
        </div>
      </header>

      {renderProgressBar()}

      <main className="main">
        <div className="content-wrapper">
          
          {/* STEP 0: HOME */}
          {step === 0 && (
            <div className="hero animate-in">
              <div className="hero-eyebrow">Compassionate Planning Assistant</div>
              <h1 className="hero-title">Plan with dignity,<br/>peace, and clarity.</h1>
              <p className="hero-subtitle">
                Guiding Ashtabula County families through end-of-life arrangements with a gentle, step-by-step approach. Remove the burden of guesswork for those you love.
              </p>
              
              <div className="hero-actions">
                <button className="btn btn-primary btn-lg" onClick={nextStep}>
                  Start Planning <ArrowRight size={18} />
                </button>
              </div>
              
              <div className="features">
                <div className="feature">
                  <div className="feature-icon"><HeartHandshake size={24} /></div>
                  <h3 className="feature-title">Compassionate</h3>
                  <p className="feature-desc">Gentle, understanding guidance at your own pace.</p>
                </div>
                <div className="feature">
                  <div className="feature-icon"><CheckCircle2 size={24} /></div>
                  <h3 className="feature-title">Clear Steps</h3>
                  <p className="feature-desc">Know exactly what to prepare and what comes next.</p>
                </div>
                <div className="feature">
                  <div className="feature-icon"><CalendarHeart size={24} /></div>
                  <h3 className="feature-title">Less Stress</h3>
                  <p className="feature-desc">Simplify difficult decisions for your family.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: BASICS */}
          {step === 1 && (
            <div className="card wizard-card animate-in">
              <h2 className="card-title">Let's start with the basics</h2>
              <p className="card-subtitle">Who are we planning for today?</p>
              
              <div className="options-grid">
                <div 
                  className={`option-card ${formData.planningFor === 'myself' ? 'selected' : ''}`}
                  onClick={() => updateForm('planningFor', 'myself')}
                >
                  <div className="option-icon">👤</div>
                  <h4>Myself</h4>
                  <p>I am planning my own arrangements.</p>
                </div>
                <div 
                  className={`option-card ${formData.planningFor === 'loved_one' ? 'selected' : ''}`}
                  onClick={() => updateForm('planningFor', 'loved_one')}
                >
                  <div className="option-icon">👥</div>
                  <h4>A Loved One</h4>
                  <p>I am planning on behalf of someone else.</p>
                </div>
              </div>

              <div className="form-group" style={{marginTop: '32px'}}>
                <label className="form-label">
                  {formData.planningFor === 'myself' ? "Your Full Name" : "Their Full Name"}
                </label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder="e.g. Jane Smith"
                  value={formData.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                />
              </div>

              <div className="wizard-actions">
                <button className="btn btn-ghost" onClick={prevStep}>
                  <ArrowLeft size={18} /> Back
                </button>
                <button className="btn btn-primary" onClick={nextStep} disabled={!formData.name}>
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PREFERENCES */}
          {step === 2 && (
            <div className="card wizard-card animate-in">
              <h2 className="card-title">Core Preferences</h2>
              <p className="card-subtitle">What type of arrangements are preferred?</p>
              
              <div className="form-group">
                <label className="form-label">Disposition Preference</label>
                <div className="options-grid small">
                  <div 
                    className={`option-card ${formData.disposition === 'Burial' ? 'selected' : ''}`}
                    onClick={() => updateForm('disposition', 'Burial')}
                  >
                    <h4>Traditional Burial</h4>
                  </div>
                  <div 
                    className={`option-card ${formData.disposition === 'Cremation' ? 'selected' : ''}`}
                    onClick={() => updateForm('disposition', 'Cremation')}
                  >
                    <h4>Cremation</h4>
                  </div>
                  <div 
                    className={`option-card ${formData.disposition === 'Green Burial' ? 'selected' : ''}`}
                    onClick={() => updateForm('disposition', 'Green Burial')}
                  >
                    <h4>Green Burial</h4>
                  </div>
                </div>
              </div>

              <div className="form-group" style={{marginTop: '24px'}}>
                <label className="form-label">Service Type</label>
                <div className="options-grid small">
                  <div 
                    className={`option-card ${formData.serviceType === 'Traditional Service' ? 'selected' : ''}`}
                    onClick={() => updateForm('serviceType', 'Traditional Service')}
                  >
                    <h4>Traditional Service</h4>
                  </div>
                  <div 
                    className={`option-card ${formData.serviceType === 'Memorial Service' ? 'selected' : ''}`}
                    onClick={() => updateForm('serviceType', 'Memorial Service')}
                  >
                    <h4>Memorial Service</h4>
                  </div>
                  <div 
                    className={`option-card ${formData.serviceType === 'Celebration of Life' ? 'selected' : ''}`}
                    onClick={() => updateForm('serviceType', 'Celebration of Life')}
                  >
                    <h4>Celebration of Life</h4>
                  </div>
                  <div 
                    className={`option-card ${formData.serviceType === 'Private / Direct' ? 'selected' : ''}`}
                    onClick={() => updateForm('serviceType', 'Private / Direct')}
                  >
                    <h4>Private / Direct</h4>
                  </div>
                </div>
              </div>

              <div className="wizard-actions">
                <button className="btn btn-ghost" onClick={prevStep}>
                  <ArrowLeft size={18} /> Back
                </button>
                <button className="btn btn-primary" onClick={nextStep}>
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TRIBUTES */}
          {step === 3 && (
            <div className="card wizard-card animate-in">
              <h2 className="card-title">Music & Honored Guests</h2>
              <p className="card-subtitle">It's the small details that make a service meaningful.</p>
              
              <div className="form-group">
                <label className="form-label">
                  <Music size={16} style={{display: 'inline', marginRight: '8px'}} />
                  Meaningful Music & Readings
                </label>
                <textarea 
                  className="form-textarea"
                  placeholder="e.g. Please play 'Amazing Grace', or ask my brother John to read a poem."
                  value={formData.music}
                  onChange={(e) => updateForm('music', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Users size={16} style={{display: 'inline', marginRight: '8px'}} />
                  Honored Guests / Notifications
                </label>
                <textarea 
                  className="form-textarea"
                  placeholder="e.g. Please notify the Ashtabula Rotary Club and my college roommate, Dave."
                  value={formData.honoredGuests}
                  onChange={(e) => updateForm('honoredGuests', e.target.value)}
                />
              </div>

              <div className="wizard-actions">
                <button className="btn btn-ghost" onClick={prevStep}>
                  <ArrowLeft size={18} /> Back
                </button>
                <button className="btn btn-primary" onClick={nextStep}>
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: WISHES */}
          {step === 4 && (
            <div className="card wizard-card animate-in">
              <h2 className="card-title">Special Requests</h2>
              <p className="card-subtitle">Any other personal touches you'd like to share?</p>
              
              {error && (
                <div className="message message-error">
                  {error}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  <BookOpen size={16} style={{display: 'inline', marginRight: '8px'}} />
                  Specific Instructions or Wishes
                </label>
                <textarea 
                  className="form-textarea"
                  placeholder="e.g. In lieu of flowers, please donate to the Ashtabula Animal Protective League. Please display my gardening photos."
                  value={formData.specialRequests}
                  onChange={(e) => updateForm('specialRequests', e.target.value)}
                />
              </div>

              <div className="wizard-actions">
                <button className="btn btn-ghost" onClick={prevStep} disabled={loading}>
                  <ArrowLeft size={18} /> Back
                </button>
                <button className="btn btn-primary" onClick={generatePlan} disabled={loading}>
                  {loading ? "Drafting Plan..." : "Generate My Plan Summary"}
                  {!loading && <FileText size={18} style={{marginLeft: '8px'}} />}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SUMMARY & LOADING */}
          {step === 5 && (
            <div className="animate-in">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner-ring"></div>
                  <h2>Drafting your compassionate summary...</h2>
                  <p>Our AI is formatting your preferences into a clear, dignified document.</p>
                </div>
              ) : (
                <>
                  <div className="summary-actions print-hide">
                    <button className="btn btn-ghost" onClick={() => setStep(4)}>
                      <ArrowLeft size={18} /> Edit Details
                    </button>
                    <div style={{display: 'flex', gap: '12px'}}>
                      <button className="btn btn-secondary" onClick={handlePrint}>
                        <Printer size={18} /> Print / Save PDF
                      </button>
                      <button className="btn btn-primary" onClick={() => window.open('https://ducro.com/contact', '_blank')}>
                        <CalendarHeart size={18} style={{marginRight: '8px'}}/> Meet with a Director
                      </button>
                    </div>
                  </div>

                  <div className="document-preview print-area">
                    <div className="document-header">
                      <Leaf size={32} color="var(--warm-gray)" />
                      <h1>End-of-Life Planning Summary</h1>
                      <p>Prepared securely via Compassionate Planner</p>
                    </div>
                    
                    <div 
                      className="document-content markdown-body" 
                      dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} 
                    />

                    <div className="document-footer">
                      <p><strong>Ducro Funeral Services</strong></p>
                      <p>4101 Main Avenue • Ashtabula, OH 44004 • (440) 992-2191</p>
                      <p style={{fontSize: '0.8rem', marginTop: '12px', color: '#888'}}>
                        This document is a summary of personal preferences and does not constitute a legally binding contract until formalized with a funeral director.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      {step !== 5 && (
        <footer className="footer print-hide">
          <div className="footer-content">
            <p className="footer-title">Ducro Funeral Services</p>
            <p className="footer-address">4101 Main Avenue • Ashtabula, OH 44004</p>
            <p className="footer-phone">(440) 992-2191</p>
            <p className="footer-tagline">Serving Ashtabula County Families for 130+ Years</p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
