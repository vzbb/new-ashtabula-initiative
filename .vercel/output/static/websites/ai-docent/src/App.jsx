import { useState, useRef, useEffect } from "react";
import "./App.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Icons
const Icons = {
  headphones: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"/>
      <path d="M17 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3"/>
      <path d="M21 12c0-4.97-4.03-9-9-9s-9 4.03-9 9"/>
    </svg>
  ),
  camera: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="6" width="18" height="12" rx="2"/>
      <circle cx="12" cy="12" r="3"/>
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  ),
  upload: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  volume: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    </svg>
  ),
  loader: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  ),
  close: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  refresh: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
    </svg>
  ),
};

function App() {
  const [desc, setDesc] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
      setError("");
    } catch (e) {
      setError("Camera access denied. You can upload a photo instead.");
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  // Capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      stopCamera();
      // Auto-analyze the captured image
      analyzeImage(imageData);
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target.result);
        analyzeImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Analyze image with Gemini
  const analyzeImage = async (imageData) => {
    setLoading(true);
    setError("");
    setStory("");
    
    try {
      if (!apiKey) throw new Error("API key not configured.");
      
      // Extract base64 data
      const base64Data = imageData.split(',')[1];
      
      const prompt = {
        contents: [{
          parts: [
            { text: "You are a museum docent at the Ashtabula Maritime Museum. Analyze this artifact image and write an engaging 100-word narration for museum visitors. Include historical context, interesting details, and end with a call-to-action encouraging visitors to explore more. Be enthusiastic but professional." },
            { inlineData: { mimeType: "image/jpeg", data: base64Data } }
          ]
        }]
      };
      
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prompt)
        }
      );
      
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      if (!text) throw new Error("No response from AI.");
      setStory(text);
      setDesc("Artifact analyzed from photo");
    } catch (e) {
      setError(e.message || "Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate from text description
  const generateFromText = async () => {
    if (!desc.trim()) {
      setError("Please describe the artifact or take a photo.");
      return;
    }
    
    setLoading(true);
    setError("");
    setStory("");
    
    try {
      if (!apiKey) throw new Error("API key not configured.");
      
      const prompt = `Write a 100-word museum narration for: ${desc}. End with a visitor CTA.`;
      
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      );
      
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      if (!text) throw new Error("No response.");
      setStory(text);
    } catch (e) {
      setError(e.message || "Failed to generate.");
    } finally {
      setLoading(false);
    }
  };

  // Text-to-speech
  const speakNarration = () => {
    if (!story || isSpeaking) return;
    
    const utterance = new SpeechSynthesisUtterance(story);
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Stop speaking
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Icons.headphones />
            </div>
            <div>
              <h1 className="font-bold text-xl">AI Docent</h1>
              <p className="text-xs text-white/60">Ashtabula Maritime Museum</p>
            </div>
          </div>
        </header>

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
            <div className="flex justify-between items-center p-4">
              <span className="font-semibold">Take Photo of Artifact</span>
              <button onClick={stopCamera} className="p-2 hover:bg-white/10 rounded">
                <Icons.close />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <video ref={videoRef} autoPlay playsInline className="max-w-full max-h-full rounded-lg" />
            </div>
            <div className="p-4 flex justify-center">
              <button 
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center"
              >
                <div className="w-12 h-12 rounded-full bg-white" />
              </button>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-6">
          {/* Photo Capture Section */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">📸 Snap a Photo</h2>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={startCamera}
                className="p-6 bg-purple-600 hover:bg-purple-700 rounded-xl flex flex-col items-center gap-3 transition"
              >
                <Icons.camera />
                <span>Take Photo</span>
              </button>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-6 bg-cyan-600 hover:bg-cyan-700 rounded-xl flex flex-col items-center gap-3 transition"
              >
                <Icons.upload />
                <span>Upload Photo</span>
              </button>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            
            {/* Captured Image Preview */}
            {capturedImage && (
              <div className="mt-4 relative">
                <img src={capturedImage} alt="Captured artifact" className="w-full h-48 object-cover rounded-lg" />
                <button 
                  onClick={() => { setCapturedImage(null); setStory(""); }}
                  className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70"
                >
                  <Icons.close />
                </button>
              </div>
            )}
          </div>

          {/* Or Text Input */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">📝 Or Describe It</h2>
            <textarea 
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g., 1880s ship's wheel with brass compass mount"
              rows={3}
              className="w-full p-4 bg-black/20 rounded-xl border border-white/20 focus:border-purple-500 outline-none resize-none"
            />
            <button 
              onClick={generateFromText}
              disabled={loading}
              className="mt-4 w-full p-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Icons.loader /> : <Icons.headphones />}
              {loading ? "Generating..." : "Generate Narration"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
              {error}
            </div>
          )}

          {/* Generated Narration */}
          {story && (
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 animate-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">🎙️ Generated Narration</h2>
                <span className="text-xs bg-purple-500/30 px-2 py-1 rounded">Gemini AI</span>
              </div>
              
              <div className="p-4 bg-black/20 rounded-xl leading-relaxed">
                {story}
              </div>
              
              <div className="mt-4 flex gap-3">
                <button 
                  onClick={isSpeaking ? stopSpeaking : speakNarration}
                  className="flex-1 p-3 bg-cyan-600 hover:bg-cyan-700 rounded-xl flex items-center justify-center gap-2"
                >
                  <Icons.volume />
                  {isSpeaking ? "Stop" : "Play Audio"}
                </button>
                <button 
                  onClick={() => { setStory(""); setCapturedImage(null); setDesc(""); }}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-xl"
                >
                  <Icons.refresh />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-white/40">
          <p>Ashtabula Maritime Museum • Point your camera at any artifact</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
