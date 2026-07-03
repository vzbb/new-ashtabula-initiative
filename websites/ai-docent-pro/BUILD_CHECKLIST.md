# AI Docent Pro — Phase 4 Build Checklist

**Project:** ai-docent-pro  
**Date:** February 19, 2026  
**Status:** Ready for implementation upon museum partnership

This is a copy-paste ready implementation guide. Each section includes:
- Task description
- Code snippets where applicable
- File paths
- Verification steps

---

## Phase A: Foundation (Weeks 1–2)

### A1. Project Setup

**Task:** Initialize React + Vite + Firebase project

```bash
# Terminal commands
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/ai-docent-pro
npm create vite@latest . -- --template react
npm install
npm install firebase
npm install -D @types/node  # if using TypeScript
```

**Create files:**

`src/firebase.js`:
```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export default app;
```

`.env` (add to .gitignore!):
```
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key
```

**Verification:**
- [ ] `npm run dev` starts without errors
- [ ] No API keys committed to git

---

### A2. Image Upload Component

**File:** `src/components/PhotoUpload.jsx`

```jsx
import { useState, useRef } from 'react';
import styles from './PhotoUpload.module.css';

function PhotoUpload({ onPhotoSelect }) {
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      onPhotoSelect(file, e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Handle camera stream for capture
      // Simplified: use file input with capture="environment"
    } catch (err) {
      console.error('Camera access denied:', err);
    }
  };

  return (
    <div 
      className={`${styles.uploadContainer} ${dragActive ? styles.dragActive : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className={styles.fileInput}
      />
      
      {preview ? (
        <div className={styles.previewContainer}>
          <img src={preview} alt="Preview" className={styles.preview} />
          <button 
            className={styles.retakeButton}
            onClick={() => { setPreview(null); onPhotoSelect(null, null); }}
          >
            Retake
          </button>
        </div>
      ) : (
        <div className={styles.uploadPrompt}>
          <div className={styles.icon}>📷</div>
          <p>Tap to take photo or upload</p>
          <button 
            className={styles.uploadButton}
            onClick={() => inputRef.current?.click()}
          >
            Select Photo
          </button>
        </div>
      )}
    </div>
  );
}

export default PhotoUpload;
```

**File:** `src/components/PhotoUpload.module.css`

```css
.uploadContainer {
  border: 2px dashed #ccc;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  transition: all 0.2s;
  background: #fafafa;
}

.dragActive {
  border-color: #007bff;
  background: #f0f8ff;
}

.fileInput {
  display: none;
}

.uploadPrompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.icon {
  font-size: 48px;
}

.uploadButton {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.previewContainer {
  position: relative;
}

.preview {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
}

.retakeButton {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.7);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
}
```

**Verification:**
- [ ] Photo upload displays preview
- [ ] Drag-and-drop works
- [ ] Mobile camera capture works

---

### A3. Gemini Vision Integration

**File:** `src/services/geminiVision.js`

```javascript
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_VISION_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Analyze image and identify artifact
 * @param {string} base64Image - Base64 encoded image (data URL format)
 * @param {Array} knownArtifacts - Array of {id, name, description} for matching
 * @returns {Promise<{artifactId: string|null, confidence: number, description: string}>}
 */
export async function identifyArtifact(base64Image, knownArtifacts = []) {
  // Remove data URL prefix if present
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
  
  const artifactContext = knownArtifacts.length > 0 
    ? `Known artifacts in our collection:\n${knownArtifacts.map(a => `- ${a.name}: ${a.description}`).join('\n')}`
    : 'No known artifacts in database yet.';

  const prompt = `${artifactContext}

Analyze this image from a maritime museum. Either:
1. Match it to one of the known artifacts above (return the exact name)
2. Or describe what you see if it's unknown

Respond in this JSON format:
{
  "match": "artifact name or null",
  "confidence": 0.0-1.0,
  "description": "detailed description of what you see",
  "possibleIdentity": "what this object likely is"
}`;

  const response = await fetch(GEMINI_VISION_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          { inline_data: { mime_type: 'image/jpeg', data: base64Data } },
          { text: prompt }
        ]
      }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  
  try {
    return JSON.parse(text);
  } catch {
    // Fallback if JSON parsing fails
    return {
      match: null,
      confidence: 0,
      description: text,
      possibleIdentity: 'Unknown'
    };
  }
}
```

**Verification:**
- [ ] API call returns structured data
- [ ] Confidence scores are numeric
- [ ] Handles errors gracefully

---

### A4. Narration Generation

**File:** `src/services/narrationGenerator.js`

```javascript
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_PRO_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

const TONE_PROMPTS = {
  conversational: 'Write in a warm, conversational tone as if speaking to a curious visitor.',
  formal: 'Write in a formal, academic tone suitable for scholarly audiences.',
  child: 'Write for children ages 8-12. Use simple words, be engaging, and include one fun fact.',
  scholarly: 'Write a detailed, citation-ready description for researchers.'
};

/**
 * Generate narration for an artifact
 * @param {Object} artifact - {name, description, era, origin, category}
 * @param {Object} options - {tone, wordCount, language}
 * @returns {Promise<{text: string, tags: string[], wordCount: number}>}
 */
export async function generateNarration(artifact, options = {}) {
  const {
    tone = 'conversational',
    wordCount = 120,
    language = 'en'
  } = options;

  const prompt = `You are a knowledgeable maritime museum docent. Create an engaging museum audio guide narration.

${TONE_PROMPTS[tone]}

ARTIFACT INFORMATION:
- Name: ${artifact.name}
- Description: ${artifact.description}
- Era/Date: ${artifact.era || 'Unknown date'}
- Origin: ${artifact.origin || 'Unknown origin'}
- Category: ${artifact.category}

REQUIREMENTS:
- Length: approximately ${wordCount} words
- Include historical context and significance
- Tell one memorable or surprising fact
- End with a thought-provoking observation
- Language: ${language === 'en' ? 'English' : language}

FORMAT your response as:
NARRATION: [your narration text]

TAGS: [3-5 relevant keywords separated by commas]`;

  const response = await fetch(GEMINI_PRO_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  // Parse response
  const narrationMatch = text.match(/NARRATION:\s*([\s\S]+?)(?=TAGS:|$)/i);
  const tagsMatch = text.match(/TAGS:\s*([\s\S]+)/i);
  
  const narrationText = narrationMatch ? narrationMatch[1].trim() : text;
  const tags = tagsMatch 
    ? tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean)
    : [];

  return {
    text: narrationText,
    tags,
    wordCount: narrationText.split(/\s+/).length
  };
}
```

**Verification:**
- [ ] Generates appropriate-length narrations
- [ ] Tags are extracted correctly
- [ ] Different tones produce different styles

---

### A5. Text-to-Speech Integration

**File:** `src/services/ttsService.js`

```javascript
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

const VOICES = {
  josh: { id: 'TX3AEvVoIzMeN6rKPMjC', name: 'Josh', style: 'Warm, professional male' },
  rachel: { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', style: 'Friendly, approachable female' },
  adam: { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', style: 'Conversational male' },
  bella: { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', style: 'Warm, expressive female' }
};

/**
 * Generate audio from text
 * @param {string} text - Narration text
 * @param {string} voiceId - Voice ID from VOICES
 * @returns {Promise<Blob>} - Audio blob
 */
export async function generateSpeech(text, voiceId = VOICES.josh.id) {
  const response = await fetch(`${ELEVENLABS_URL}/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    })
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs API error: ${response.status}`);
  }

  return await response.blob();
}

/**
 * Generate speech and upload to Firebase Storage
 * @param {string} text - Narration text  
 * @param {string} artifactId - Artifact ID for path
 * @param {string} voiceId - Voice ID
 * @returns {Promise<string>} - Download URL
 */
export async function generateAndUploadSpeech(text, artifactId, voiceId = VOICES.josh.id) {
  const audioBlob = await generateSpeech(text, voiceId);
  
  // Upload to Firebase Storage
  const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
  const { storage } = await import('../firebase');
  
  const storageRef = ref(storage, `narrations/${artifactId}/${Date.now()}.mp3`);
  await uploadBytes(storageRef, audioBlob);
  
  return await getDownloadURL(storageRef);
}

export { VOICES };
```

**Verification:**
- [ ] Audio generates and plays
- [ ] File uploads to Firebase Storage
- [ ] Download URL is accessible

---

### A6. Audio Player Component

**File:** `src/components/AudioPlayer.jsx`

```jsx
import { useState, useRef, useEffect } from 'react';
import styles from './AudioPlayer.module.css';

function AudioPlayer({ audioUrl, transcript }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('ended', onEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.player}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <div className={styles.controls}>
        <button 
          className={styles.playButton}
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className={styles.timeDisplay}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>

      {transcript && (
        <div className={styles.transcriptSection}>
          <button 
            className={styles.transcriptToggle}
            onClick={() => setShowTranscript(!showTranscript)}
          >
            {showTranscript ? 'Hide' : 'Show'} Transcript
          </button>
          {showTranscript && (
            <div className={styles.transcript}>{transcript}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default AudioPlayer;
```

**File:** `src/components/AudioPlayer.module.css`

```css
.player {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.playButton {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: #007bff;
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s;
}

.playButton:hover {
  transform: scale(1.05);
}

.progressContainer {
  flex: 1;
}

.progressBar {
  height: 6px;
  background: #dee2e6;
  border-radius: 3px;
  overflow: hidden;
}

.progressFill {
  height: 100%;
  background: #007bff;
  transition: width 0.1s linear;
}

.timeDisplay {
  font-size: 12px;
  color: #6c757d;
  margin-top: 6px;
}

.transcriptSection {
  margin-top: 16px;
}

.transcriptToggle {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
}

.transcript {
  margin-top: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}
```

---

## Phase B: Museum Admin (Weeks 3–4)

### B1. Authentication Setup

**File:** `src/contexts/AuthContext.jsx`

```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) => 
    signInWithEmailAndPassword(auth, email, password);
  
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### B2. Artifact CRUD Operations

**File:** `src/services/artifactService.js`

```javascript
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

const ARTIFACTS_COLLECTION = 'artifacts';

export async function createArtifact(museumId, artifactData) {
  const docRef = await addDoc(collection(db, ARTIFACTS_COLLECTION), {
    ...artifactData,
    museumId,
    isPublished: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

export async function updateArtifact(artifactId, updates) {
  const docRef = doc(db, ARTIFACTS_COLLECTION, artifactId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
}

export async function deleteArtifact(artifactId) {
  await deleteDoc(doc(db, ARTIFACTS_COLLECTION, artifactId));
}

export async function getArtifactsByMuseum(museumId) {
  const q = query(
    collection(db, ARTIFACTS_COLLECTION),
    where('museumId', '==', museumId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getArtifact(artifactId) {
  const docSnap = await getDoc(doc(db, ARTIFACTS_COLLECTION, artifactId));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
}
```

### B3. Admin Dashboard Layout

**File:** `src/components/admin/AdminLayout.jsx`

```jsx
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './AdminLayout.module.css';

function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>AI Docent Pro</div>
        <nav className={styles.nav}>
          <Link to="/admin" className={styles.navLink}>Dashboard</Link>
          <Link to="/admin/artifacts" className={styles.navLink}>Artifacts</Link>
          <Link to="/admin/narrations" className={styles.navLink}>Narrations</Link>
          <Link to="/admin/analytics" className={styles.navLink}>Analytics</Link>
          <Link to="/admin/settings" className={styles.navLink}>Settings</Link>
        </nav>
        <div className={styles.userSection}>
          <span>{user?.email}</span>
          <button onClick={logout} className={styles.logoutBtn}>Logout</button>
        </div>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
```

---

## Phase C: Visitor Experience (Weeks 5–6)

### C1. Main Visitor App Flow

**File:** `src/components/visitor/VisitorExperience.jsx`

```jsx
import { useState } from 'react';
import PhotoUpload from '../PhotoUpload';
import ArtifactResult from './ArtifactResult';
import { identifyArtifact } from '../../services/geminiVision';
import { getArtifactsByMuseum } from '../../services/artifactService';
import styles from './VisitorExperience.module.css';

const MUSEUM_ID = 'ashtabula-maritime'; // Configurable

function VisitorExperience() {
  const [step, setStep] = useState('upload'); // upload, analyzing, result, unknown
  const [selectedImage, setSelectedImage] = useState(null);
  const [matchedArtifact, setMatchedArtifact] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handlePhotoSelect = async (file, dataUrl) => {
    setSelectedImage(dataUrl);
    setStep('analyzing');
    setError(null);

    try {
      // Load known artifacts for matching
      const artifacts = await getArtifactsByMuseum(MUSEUM_ID);
      
      // Identify the artifact
      const result = await identifyArtifact(dataUrl, artifacts.map(a => ({
        id: a.id,
        name: a.name,
        description: a.shortDesc
      })));

      setAnalysis(result);

      if (result.match && result.confidence > 0.7) {
        const matched = artifacts.find(a => 
          a.name.toLowerCase() === result.match.toLowerCase()
        );
        if (matched) {
          setMatchedArtifact(matched);
          setStep('result');
          return;
        }
      }

      // No confident match
      setStep('unknown');
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Sorry, we had trouble analyzing that photo. Please try again.');
      setStep('upload');
    }
  };

  return (
    <div className={styles.experience}>
      <header className={styles.header}>
        <h1>Ashtabula Maritime Museum</h1>
        <p>Snap a photo of any artifact to learn its story</p>
      </header>

      {step === 'upload' && (
        <PhotoUpload onPhotoSelect={handlePhotoSelect} />
      )}

      {step === 'analyzing' && (
        <div className={styles.analyzing}>
          <div className={styles.spinner}></div>
          <p>Identifying artifact...</p>
          {selectedImage && (
            <img src={selectedImage} alt="Analyzing" className={styles.analyzingImage} />
          )}
        </div>
      )}

      {step === 'result' && matchedArtifact && (
        <ArtifactResult 
          artifact={matchedArtifact}
          onReset={() => setStep('upload')}
        />
      )}

      {step === 'unknown' && (
        <div className={styles.unknown}>
          <h2>We couldn't identify that artifact</h2>
          <p>{analysis?.description || "Try a clearer photo with better lighting."}</p>
          {analysis?.possibleIdentity && (
            <p className={styles.guess}>It might be: {analysis.possibleIdentity}</p>
          )}
          <button onClick={() => setStep('upload')} className={styles.retryBtn}>
            Try Another Photo
          </button>
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}

export default VisitorExperience;
```

---

## Phase D: Scale & Refinement (Weeks 7–8)

### D1. PWA Configuration

**File:** `public/manifest.json`

```json
{
  "name": "AI Docent Pro",
  "short_name": "AI Docent",
  "description": "Photo-to-narration guide for maritime museums",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#007bff",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### D2. Offline Caching Strategy

**File:** `public/sw.js` (Service Worker)

```javascript
const CACHE_NAME = 'ai-docent-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.css'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
```

### D3. Analytics Tracking

**File:** `src/services/analytics.js`

```javascript
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const INTERACTIONS_COLLECTION = 'interactions';

export async function trackEvent(eventType, data = {}) {
  const sessionId = getSessionId();
  
  await addDoc(collection(db, INTERACTIONS_COLLECTION), {
    eventType,
    sessionId,
    userAgent: navigator.userAgent,
    language: navigator.language,
    timestamp: serverTimestamp(),
    ...data
  });
}

function getSessionId() {
  let sessionId = sessionStorage.getItem('docent_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('docent_session_id', sessionId);
  }
  return sessionId;
}

export const Events = {
  PHOTO_UPLOAD: 'photo_upload',
  ARTIFACT_VIEW: 'artifact_view',
  AUDIO_START: 'audio_start',
  AUDIO_COMPLETE: 'audio_complete',
  ARTIFACT_SAVE: 'artifact_save'
};
```

---

## Testing Checklist

### Unit Tests (Jest/Vitest)
- [ ] `identifyArtifact()` returns correct structure
- [ ] `generateNarration()` produces expected word count
- [ ] `generateSpeech()` returns valid audio blob
- [ ] CRUD operations handle errors gracefully

### Integration Tests
- [ ] Full flow: Upload → Identify → Narrate → Play
- [ ] Admin: Login → Add artifact → Generate narration → Publish
- [ ] Offline mode: Cache artifact → View without network

### User Acceptance Tests
- [ ] Visitor can complete photo-to-audio in <10 seconds
- [ ] Audio plays clearly on mobile speakers
- [ ] Curator can add new artifact in <5 minutes
- [ ] App works on iOS Safari and Android Chrome

### Performance Benchmarks
- [ ] Time to first byte < 200ms
- [ ] Image analysis completes < 3 seconds
- [ ] Audio generation completes < 5 seconds
- [ ] App bundle size < 500KB (gzipped)

---

## Deployment Checklist

### Pre-launch
- [ ] Environment variables set in production
- [ ] Firebase security rules configured
- [ ] API rate limits monitored
- [ ] Error logging (Sentry) integrated
- [ ] Privacy policy and terms drafted
- [ ] Museum branding assets uploaded

### Launch
- [ ] Deploy to Firebase Hosting
- [ ] Configure custom domain if needed
- [ ] Enable Firebase Analytics
- [ ] Test on museum's WiFi network
- [ ] Train museum staff (1-hour session)

### Post-launch
- [ ] Monitor daily error rates
- [ ] Weekly check-in with museum
- [ ] Gather visitor feedback
- [ ] Iterate based on usage data

---

## Estimated Effort Summary

| Phase | Tasks | Est. Hours |
|-------|-------|------------|
| A. Foundation | 6 major components | 20–25 hrs |
| B. Admin | Auth, CRUD, dashboard | 15–20 hrs |
| C. Visitor | Public UI, PWA | 15–20 hrs |
| D. Scale | Polish, offline, analytics | 10–15 hrs |
| **Total** | | **60–80 hrs** |

**Ready to build upon museum partnership confirmation.**
