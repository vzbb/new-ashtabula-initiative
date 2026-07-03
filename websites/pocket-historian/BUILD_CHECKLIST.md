# Pocket Historian — Build Checklist

Complete implementation guide with copy-paste commands and code snippets.
**Estimated Build Time:** 60-80 hours (8 weeks part-time)

---

## Phase A: Project Setup & Firebase (Days 1-3)

### A1. Initialize React PWA Project

```bash
# Create Vite React project
npm create vite@latest pocket-historian -- --template react
cd pocket-historian

# Install core dependencies
npm install react-router-dom zustand @mapbox/mapbox-gl-draw
npm install -D @vitejs/plugin-pwa vite-plugin-pwa

# Install Firebase
npm install firebase

# Install audio & utilities
npm install howler @types/howler
npm install date-fns lodash-es

# Install testing
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### A2. Firebase Project Setup

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login and init
firebase login
firebase init hosting firestore storage functions

# Select: Use existing project OR create new
# Hosting: public (dist folder)
# Firestore: use default rules
# Functions: TypeScript
```

### A3. Firebase Configuration File

**`src/services/firebase.js`:**
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence enabled in first tab only');
  } else if (err.code === 'unimplemented') {
    console.warn('Browser does not support offline persistence');
  }
});

export default app;
```

**`.env.local`:**
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

---

## Phase B: Core Components (Days 4-10)

### B1. Geolocation Hook

**`src/hooks/useGeolocation.js`:**
```javascript
import { useState, useEffect, useCallback, useRef } from 'react';

export function useGeolocation(options = {}) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [isWatching, setIsWatching] = useState(false);
  const watchId = useRef(null);

  const getCurrentPosition = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        ...options,
      });
    });
  }, [options]);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError(new Error('Geolocation not supported'));
      return;
    }
    
    setIsWatching(true);
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        });
        setError(null);
      },
      (err) => setError(err),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        ...options,
      }
    );
  }, [options]);

  const stopWatching = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
      setIsWatching(false);
    }
  }, []);

  useEffect(() => () => stopWatching(), [stopWatching]);

  return { position, error, isWatching, startWatching, stopWatching, getCurrentPosition };
}
```

### B2. Geofence Utility

**`src/utils/geofence.js`:**
```javascript
// Haversine formula for distance calculation
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export function isWithinGeofence(userLat, userLon, stopLat, stopLon, radius = 30) {
  const distance = calculateDistance(userLat, userLon, stopLat, stopLon);
  return {
    isInside: distance <= radius,
    distance,
    radius,
  };
}

export function findNearestStop(userLat, userLon, stops) {
  if (!stops?.length) return null;
  
  return stops.reduce((nearest, stop) => {
    const distance = calculateDistance(
      userLat, userLon,
      stop.coordinates.latitude,
      stop.coordinates.longitude
    );
    if (!nearest || distance < nearest.distance) {
      return { stop, distance };
    }
    return nearest;
  }, null);
}
```

### B3. Audio Hook with Background Playback

**`src/hooks/useAudio.js`:**
```javascript
import { useState, useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const howlRef = useRef(null);
  const rafRef = useRef(null);

  const load = useCallback((src) => {
    setIsLoading(true);
    
    if (howlRef.current) {
      howlRef.current.unload();
    }

    howlRef.current = new Howl({
      src: [src],
      html5: true, // Forces HTML5 Audio for streaming
      preload: true,
      onload: () => {
        setDuration(howlRef.current.duration());
        setIsLoading(false);
      },
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => {
        setIsPlaying(false);
        setCurrentTime(0);
      },
      onend: () => setIsPlaying(false),
      onloaderror: () => {
        setIsLoading(false);
        console.error('Audio load error');
      },
    });

    // Setup media session for lock screen controls
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'Pocket Historian Tour',
        artist: 'Ashtabula Historical Society',
        artwork: [
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => play());
      navigator.mediaSession.setActionHandler('pause', () => pause());
      navigator.mediaSession.setActionHandler('seekbackward', () => seek(currentTime - 15));
      navigator.mediaSession.setActionHandler('seekforward', () => seek(currentTime + 15));
    }
  }, []);

  const play = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.play();
    }
  }, []);

  const pause = useCallback(() => {
    if (howlRef.current) {
      howlRef.current.pause();
    }
  }, []);

  const seek = useCallback((time) => {
    if (howlRef.current) {
      howlRef.current.seek(time);
      setCurrentTime(time);
    }
  }, []);

  const skip = useCallback((seconds) => {
    if (howlRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      seek(newTime);
    }
  }, [currentTime, duration, seek]);

  useEffect(() => {
    const updateTime = () => {
      if (howlRef.current && isPlaying) {
        setCurrentTime(howlRef.current.seek());
        rafRef.current = requestAnimationFrame(updateTime);
      }
    };
    
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(updateTime);
    }
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (howlRef.current) {
        howlRef.current.unload();
      }
    };
  }, []);

  return {
    isPlaying,
    currentTime,
    duration,
    isLoading,
    load,
    play,
    pause,
    seek,
    skip,
  };
}
```

---

## Phase C: Map Integration (Days 11-14)

### C1. Mapbox Component

**`src/components/map/MapContainer.jsx`:**
```jsx
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export function MapContainer({ 
  center, 
  zoom = 14, 
  stops = [], 
  route = null,
  userPosition = null,
  activeStopId = null,
  onStopClick,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center || [-80.7895, 41.8645], // Ashtabula default
      zoom,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    return () => {
      map.current?.remove();
    };
  }, [center, zoom]);

  // Update markers when stops change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(m => m.remove());
    markers.current = [];

    // Add stop markers
    stops.forEach((stop, index) => {
      const el = document.createElement('div');
      el.className = `stop-marker ${stop.id === activeStopId ? 'active' : ''}`;
      el.innerHTML = `<span>${index + 1}</span>`;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([stop.coordinates.longitude, stop.coordinates.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${stop.title}</h3>`))
        .addTo(map.current);

      marker.getElement().addEventListener('click', () => onStopClick?.(stop));
      markers.current.push(marker);
    });
  }, [stops, activeStopId, onStopClick]);

  // Update user position marker
  useEffect(() => {
    if (!map.current || !userPosition) return;

    // Add or update user location marker
    const userMarkerId = 'user-location';
    let userMarker = markers.current.find(m => m.id === userMarkerId);
    
    if (!userMarker) {
      const el = document.createElement('div');
      el.className = 'user-marker';
      el.innerHTML = '<div class="pulse"></div>';
      
      userMarker = new mapboxgl.Marker(el)
        .setLngLat([userPosition.longitude, userPosition.latitude])
        .addTo(map.current);
      userMarker.id = userMarkerId;
      markers.current.push(userMarker);
    } else {
      userMarker.setLngLat([userPosition.longitude, userPosition.latitude]);
    }
  }, [userPosition]);

  // Add route line
  useEffect(() => {
    if (!map.current || !route) return;

    const mapInstance = map.current;
    
    mapInstance.on('load', () => {
      if (mapInstance.getSource('route')) {
        mapInstance.getSource('route').setData(route);
      } else {
        mapInstance.addSource('route', {
          type: 'geojson',
          data: route,
        });
        
        mapInstance.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 4,
          },
        });
      }
    });
  }, [route]);

  return <div ref={mapContainer} className="map-container" style={{ width: '100%', height: '100%' }} />;
}
```

**`src/index.css` (add map styles):**
```css
.map-container {
  border-radius: 12px;
  overflow: hidden;
}

.stop-marker {
  width: 32px;
  height: 32px;
  background: #3b82f6;
  border: 3px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  cursor: pointer;
}

.stop-marker.active {
  background: #ef4444;
  transform: scale(1.2);
}

.user-marker {
  width: 20px;
  height: 20px;
  background: #22c55e;
  border: 3px solid white;
  border-radius: 50%;
  position: relative;
}

.user-marker .pulse {
  position: absolute;
  width: 40px;
  height: 40px;
  background: rgba(34, 197, 94, 0.3);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
}
```

---

## Phase D: Audio Player & Offline Storage (Days 15-18)

### D1. IndexedDB Service for Offline Audio

**`src/services/audioStorage.js`:**
```javascript
const DB_NAME = 'PocketHistorianDB';
const DB_VERSION = 1;
const AUDIO_STORE = 'audioFiles';
const TOUR_STORE = 'tourData';

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(AUDIO_STORE)) {
        db.createObjectStore(AUDIO_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(TOUR_STORE)) {
        db.createObjectStore(TOUR_STORE, { keyPath: 'tourId' });
      }
    };
  });
}

export async function storeAudioFile(stopId, audioBlob, metadata = {}) {
  const db = await openDB();
  const transaction = db.transaction([AUDIO_STORE], 'readwrite');
  const store = transaction.objectStore(AUDIO_STORE);
  
  const arrayBuffer = await audioBlob.arrayBuffer();
  
  return new Promise((resolve, reject) => {
    const request = store.put({
      id: stopId,
      audioData: arrayBuffer,
      storedAt: Date.now(),
      ...metadata,
    });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getAudioFile(stopId) {
  const db = await openDB();
  const transaction = db.transaction([AUDIO_STORE], 'readonly');
  const store = transaction.objectStore(AUDIO_STORE);
  
  return new Promise((resolve, reject) => {
    const request = store.get(stopId);
    request.onsuccess = () => {
      const result = request.result;
      if (result) {
        const blob = new Blob([result.audioData], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        resolve({ url, metadata: result });
      } else {
        resolve(null);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export async function storeTourData(tourId, tourData) {
  const db = await openDB();
  const transaction = db.transaction([TOUR_STORE], 'readwrite');
  const store = transaction.objectStore(TOUR_STORE);
  
  return new Promise((resolve, reject) => {
    const request = store.put({
      tourId,
      data: tourData,
      storedAt: Date.now(),
    });
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getTourData(tourId) {
  const db = await openDB();
  const transaction = db.transaction([TOUR_STORE], 'readonly');
  const store = transaction.objectStore(TOUR_STORE);
  
  return new Promise((resolve, reject) => {
    const request = store.get(tourId);
    request.onsuccess = () => resolve(request.result?.data || null);
    request.onerror = () => reject(request.error);
  });
}

export async function isTourDownloaded(tourId) {
  const data = await getTourData(tourId);
  return data !== null;
}

export async function deleteTourData(tourId) {
  const db = await openDB();
  
  // Get tour to find all audio files
  const tourData = await getTourData(tourId);
  
  if (tourData?.stops) {
    const audioTx = db.transaction([AUDIO_STORE], 'readwrite');
    const audioStore = audioTx.objectStore(AUDIO_STORE);
    
    for (const stop of tourData.stops) {
      audioStore.delete(stop.id);
    }
  }
  
  const tourTx = db.transaction([TOUR_STORE], 'readwrite');
  const tourStore = tourTx.objectStore(TOUR_STORE);
  tourStore.delete(tourId);
}

export async function getStorageUsage() {
  const db = await openDB();
  const audioTx = db.transaction([AUDIO_STORE], 'readonly');
  const audioStore = audioTx.objectStore(AUDIO_STORE);
  
  return new Promise((resolve, reject) => {
    const request = audioStore.getAll();
    request.onsuccess = () => {
      const items = request.result;
      const totalBytes = items.reduce((sum, item) => 
        sum + (item.audioData?.byteLength || 0), 0
      );
      resolve({
        bytes: totalBytes,
        mb: (totalBytes / 1024 / 1024).toFixed(2),
        itemCount: items.length,
      });
    };
    request.onerror = () => reject(request.error);
  });
}
```

### D2. Audio Player Component

**`src/components/audio/AudioPlayer.jsx`:**
```jsx
import { useAudio } from '../../hooks/useAudio';
import { useEffect } from 'react';

export function AudioPlayer({ 
  audioUrl, 
  title,
  onComplete,
  autoPlay = false,
}) {
  const { 
    isPlaying, 
    currentTime, 
    duration, 
    isLoading,
    load, 
    play, 
    pause, 
    seek,
    skip,
  } = useAudio();

  useEffect(() => {
    if (audioUrl) {
      load(audioUrl);
    }
  }, [audioUrl, load]);

  useEffect(() => {
    if (autoPlay && !isLoading && duration > 0) {
      play();
    }
  }, [autoPlay, isLoading, duration, play]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player">
      <div className="audio-info">
        <h4>{title}</h4>
        {isLoading && <span className="loading">Loading...</span>}
      </div>
      
      <div className="progress-container">
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={(e) => seek(Number(e.target.value))}
          className="progress-bar"
        />
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="controls">
        <button onClick={() => skip(-15)} className="skip-btn">
          -15s
        </button>
        
        <button 
          onClick={isPlaying ? pause : play} 
          className="play-btn"
          disabled={isLoading}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <button onClick={() => skip(15)} className="skip-btn">
          +15s
        </button>
      </div>
    </div>
  );
}
```

---

## Phase E: PWA Configuration (Day 19)

### E1. Vite PWA Plugin Setup

**`vite.config.js`:**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.mapbox\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mapbox-cache',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'firebase-storage-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Pocket Historian',
        short_name: 'PocketHist',
        description: 'Audio walking tours of Ashtabula\'s historic sites',
        theme_color: '#1e3a5f',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icon-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
});
```

### E2. Public Assets Checklist

Create these in `public/` folder:
- [ ] `icon-192x192.png` — App icon
- [ ] `icon-512x512.png` — App icon large
- [ ] `icon-512x512-maskable.png` — Adaptive icon
- [ ] `favicon.ico` — Browser tab icon
- [ ] `apple-touch-icon.png` — iOS home screen

---

## Phase F: Testing & Deployment (Days 20-21)

### F1. Testing Checklist

**Unit Tests:**
```bash
# Run tests
npm run test

# Coverage report
npm run test:coverage
```

**Manual Testing:**
- [ ] App installs on iOS Safari (Add to Home Screen)
- [ ] App installs on Android Chrome
- [ ] Audio plays in background
- [ ] Lock screen controls work
- [ ] GPS triggers audio at test locations
- [ ] Offline mode works after download
- [ ] Purchase flow completes with test card
- [ ] Map loads and shows route

**Geofence Testing (use mock locations):**
```javascript
// Chrome DevTools > Sensors > Geolocation
// Test coordinates for Ashtabula:
const TEST_LOCATIONS = {
  hubbardHouse: { lat: 41.8642, lng: -80.7891 },
  percyBridge: { lat: 41.8756, lng: -80.7834 },
  harborDistrict: { lat: 41.9023, lng: -80.7956 },
};
```

### F2. Firebase Deployment

```bash
# Build production bundle
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Cloud Functions
firebase deploy --only functions
```

### F3. Stripe Webhook Setup

```bash
# Set Stripe webhook endpoint in Firebase
firebase functions:config:set stripe.secret_key="sk_live_..."
firebase functions:config:set stripe.webhook_secret="whsec_..."
```

---

## Implementation Order Summary

| Day | Task | Est. Hours |
|-----|------|------------|
| 1-3 | Firebase setup, project init | 12 |
| 4-6 | Geolocation hooks, utilities | 10 |
| 7-10 | Audio hook, player component | 12 |
| 11-14 | Mapbox integration | 12 |
| 15-18 | IndexedDB, offline storage | 12 |
| 19 | PWA config, icons | 6 |
| 20-21 | Testing, deployment | 10 |

**Total: ~74 hours (8 weeks at 10 hrs/week)**

---

## Post-MVP Enhancements (Future)

- [ ] AR marker detection at stops
- [ ] User-generated tour submissions
- [ ] Seasonal tour variants (Haunted Ashtabula)
- [ ] Multi-language support
- [ ] Achievement/badges system
- [ ] Social sharing integration
