# BUILD CHECKLIST — Harbor Cam Dashboard

Production-ready implementation commands. Copy-paste each section.

---

## Phase 1: Project Setup (30 min)

### 1.1 Initialize Firebase
```bash
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/harbor-cam-dashboard

# Install Firebase CLI if not present
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init

# Select:
# - Hosting
# - Functions (Node.js)
# - Existing project or create: "harbor-cam-dashboard"
# - Use dist as public directory
# - Configure as single-page app: Yes
```

### 1.2 Install Dependencies
```bash
# Frontend dependencies (already have React + Vite)
npm install

# Additional packages
npm install axios date-fns

# Firebase SDK
npm install firebase

# Dev dependencies
npm install -D @types/node
```

### 1.3 Project Structure Setup
```bash
# Create directories
mkdir -p functions/src
mkdir -p src/components
mkdir -p src/hooks
mkdir -p src/services
mkdir -p src/utils

# Move existing files to backup if needed
mv src/App.jsx src/App.jsx.backup 2>/dev/null || true
mv src/App.css src/App.css.backup 2>/dev/null || true
```

---

## Phase 2: Cloud Functions (45 min)

### 2.1 Functions Setup
```bash
cd functions

# Install function dependencies
npm install axios cors

# Return to project root
cd ..
```

### 2.2 Camera Proxy Function
Create `functions/src/camera.ts`:
```typescript
import * as functions from 'firebase-functions';
import axios from 'axios';

const CACHE_DURATION_MS = 60000; // 1 minute
let cachedImage: { data: Buffer; contentType: string; timestamp: number } | null = null;

export const getCameraImage = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  // Check cache
  if (cachedImage && Date.now() - cachedImage.timestamp < CACHE_DURATION_MS) {
    res.set('Content-Type', cachedImage.contentType);
    res.set('X-Cached', 'true');
    res.set('X-Cached-At', new Date(cachedImage.timestamp).toISOString());
    res.send(cachedImage.data);
    return;
  }

  try {
    // Fetch from Weather Underground / webcam source
    // NOTE: Replace with actual camera URL when verified
    const response = await axios.get('https://www.webcamgalore.com/webcam/USA/Ashtabula-Ohio/14848.html', {
      timeout: 10000,
      responseType: 'arraybuffer'
    });
    
    // TODO: Parse actual image URL from HTML or use direct image endpoint
    
    cachedImage = {
      data: response.data,
      contentType: response.headers['content-type'] || 'image/jpeg',
      timestamp: Date.now()
    };
    
    res.set('Content-Type', cachedImage.contentType);
    res.set('X-Cached', 'false');
    res.send(cachedImage.data);
  } catch (error) {
    console.error('Camera fetch error:', error);
    res.status(500).json({ error: 'Camera unavailable' });
  }
});
```

### 2.3 Buoy Data Function
Create `functions/src/buoy.ts`:
```typescript
import * as functions from 'firebase-functions';
import axios from 'axios';

const CACHE_DURATION_MS = 600000; // 10 minutes
let cachedBuoy: { data: any; timestamp: number } | null = null;

interface BuoyReading {
  stationId: string;
  timestamp: string;
  windSpeed: number | null;
  windDirection: number | null;
  windGust: number | null;
  waveHeight: number | null;
  wavePeriod: number | null;
  waterTemp: number | null;
  airTemp: number | null;
  pressure: number | null;
}

function parseNdbcData(text: string): BuoyReading | null {
  const lines = text.trim().split('\n');
  if (lines.length < 3) return null;
  
  // Skip header lines, get latest data
  const headers = lines[0].trim().split(/\s+/);
  const units = lines[1].trim().split(/\s+/);
  const latest = lines[2].trim().split(/\s+/);
  
  const getValue = (name: string): number | null => {
    const idx = headers.indexOf(name);
    if (idx === -1 || !latest[idx] || latest[idx] === 'MM') return null;
    return parseFloat(latest[idx]);
  };
  
  return {
    stationId: '45005',
    timestamp: `${latest[0]}-${latest[1]}-${latest[2]}T${latest[3]}:${latest[4]}:00Z`,
    windDirection: getValue('WDIR'),
    windSpeed: getValue('WSPD'),
    windGust: getValue('GST'),
    waveHeight: getValue('WVHT'),
    wavePeriod: getValue('DPD'),
    airTemp: getValue('ATMP'),
    waterTemp: getValue('WTMP'),
    pressure: getValue('PRES')
  };
}

export const getBuoyData = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  if (cachedBuoy && Date.now() - cachedBuoy.timestamp < CACHE_DURATION_MS) {
    res.set('X-Cached', 'true');
    res.json({ ...cachedBuoy.data, cached: true });
    return;
  }

  try {
    const response = await axios.get('https://www.ndbc.noaa.gov/data/realtime2/45005.txt', {
      timeout: 10000
    });
    
    const parsed = parseNdbcData(response.data);
    if (!parsed) {
      throw new Error('Failed to parse buoy data');
    }
    
    cachedBuoy = {
      data: parsed,
      timestamp: Date.now()
    };
    
    res.set('X-Cached', 'false');
    res.json(parsed);
  } catch (error) {
    console.error('Buoy fetch error:', error);
    
    // Return stale cache if available
    if (cachedBuoy) {
      res.set('X-Stale', 'true');
      res.json({ ...cachedBuoy.data, stale: true });
      return;
    }
    
    res.status(500).json({ error: 'Buoy data unavailable' });
  }
});
```

### 2.4 Index and Deploy
Update `functions/src/index.ts`:
```typescript
export { getCameraImage } from './camera';
export { getBuoyData } from './buoy';
```

```bash
# Deploy functions
firebase deploy --only functions
```

---

## Phase 3: Frontend Components (60 min)

### 3.1 Service Layer
Create `src/services/api.js`:
```javascript
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchBuoyData() {
  const response = await fetch(`${API_BASE}/buoy/current`);
  if (!response.ok) throw new Error('Failed to fetch buoy data');
  return response.json();
}

export async function fetchCameraImage() {
  const response = await fetch(`${API_BASE}/camera`);
  if (!response.ok) throw new Error('Failed to fetch camera image');
  return response.json();
}

export async function fetchForecast() {
  const response = await fetch('https://tgftp.nws.noaa.gov/data/forecasts/marine/near_shore/le/lez148.txt');
  if (!response.ok) throw new Error('Failed to fetch forecast');
  return response.text();
}
```

### 3.2 Custom Hooks
Create `src/hooks/useBuoyData.js`:
```javascript
import { useState, useEffect } from 'react';
import { fetchBuoyData } from '../services/api';

export function useBuoyData(refreshInterval = 600000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const refresh = async () => {
    try {
      setLoading(true);
      const buoyData = await fetchBuoyData();
      setData(buoyData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { data, loading, error, lastUpdated, refresh };
}
```

Create `src/hooks/useCameraFeed.js`:
```javascript
import { useState, useEffect } from 'react';

export function useCameraFeed(refreshInterval = 60000) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [capturedAt, setCapturedAt] = useState(null);

  const refresh = async () => {
    try {
      setLoading(true);
      // Add timestamp to bust cache
      const url = `/api/camera?t=${Date.now()}`;
      setImageUrl(url);
      setCapturedAt(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { imageUrl, loading, error, capturedAt, refresh };
}
```

### 3.3 Components

Create `src/components/WindDisplay.jsx`:
```jsx
function WindDisplay({ direction, speed, gust }) {
  const arrowStyle = {
    transform: `rotate(${direction}deg)`,
    display: 'inline-block',
    transition: 'transform 0.3s ease'
  };

  const getDirectionLabel = (deg) => {
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(deg / 45) % 8];
  };

  return (
    <div className="wind-display">
      <span className="wind-arrow" style={arrowStyle}>➤</span>
      <span className="wind-speed">{speed} kts</span>
      <span className="wind-direction">{getDirectionLabel(direction)}</span>
      {gust && <span className="wind-gust">Gusts to {gust} kts</span>}
    </div>
  );
}

export default WindDisplay;
```

Create `src/components/BuoyCard.jsx`:
```jsx
import WindDisplay from './WindDisplay';
import { formatDistanceToNow } from 'date-fns';

function BuoyCard({ data, loading, lastUpdated }) {
  if (loading) return <div className="card loading">Loading buoy data...</div>;
  if (!data) return <div className="card error">No buoy data available</div>;

  const isWinterOffline = !data.waterTemp && !data.windSpeed;
  
  return (
    <div className="card buoy-card">
      <h2>🌊 Current Conditions</h2>
      
      {isWinterOffline ? (
        <div className="offline-notice">
          <p>⚠️ Buoy recovered for winter maintenance</p>
          <p>Typically returns April-May</p>
        </div>
      ) : (
        <>
          <div className="stat-row">
            <label>Wind:</label>
            <WindDisplay 
              direction={data.windDirection} 
              speed={data.windSpeed} 
              gust={data.windGust}
            />
          </div>
          
          <div className="stat-row">
            <label>Waves:</label>
            <span>{data.waveHeight?.toFixed(1) || '--'} ft</span>
            {data.wavePeriod && <span className="period">@ {data.wavePeriod}s</span>}
          </div>
          
          <div className="stat-row">
            <label>Water Temp:</label>
            <span>{data.waterTemp?.toFixed(1) || '--'}°F</span>
          </div>
          
          <div className="stat-row">
            <label>Air Temp:</label>
            <span>{data.airTemp?.toFixed(1) || '--'}°F</span>
          </div>
          
          <div className="stat-row">
            <label>Pressure:</label>
            <span>{data.pressure?.toFixed(2) || '--'}"</span>
          </div>
        </>
      )}
      
      <div className="meta">
        <span>Buoy 45005 (West Erie)</span>
        {lastUpdated && (
          <span className="updated">
            Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
          </span>
        )}
      </div>
    </div>
  );
}

export default BuoyCard;
```

Create `src/components/CameraFeed.jsx`:
```jsx
import { formatDistanceToNow } from 'date-fns';

function CameraFeed({ imageUrl, capturedAt, loading, error }) {
  if (loading) return <div className="camera-placeholder">Loading camera...</div>;
  if (error) return <div className="camera-placeholder error">Camera unavailable</div>;
  
  return (
    <div className="camera-feed">
      <div className="camera-container">
        <img 
          src={imageUrl} 
          alt="Ashtabula Harbor" 
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>
      <div className="camera-meta">
        {capturedAt && (
          <span>Updated {formatDistanceToNow(capturedAt, { addSuffix: true })}</span>
        )}
        <span className="refresh-badge">↻ Auto-refresh</span>
      </div>
    </div>
  );
}

export default CameraFeed;
```

### 3.4 Main App Component
Replace `src/App.jsx`:
```jsx
import { useBuoyData } from './hooks/useBuoyData';
import { useCameraFeed } from './hooks/useCameraFeed';
import BuoyCard from './components/BuoyCard';
import CameraFeed from './components/CameraFeed';
import './App.css';

function App() {
  const { 
    data: buoyData, 
    loading: buoyLoading, 
    lastUpdated: buoyLastUpdated 
  } = useBuoyData();
  
  const { 
    imageUrl, 
    loading: cameraLoading, 
    error: cameraError,
    capturedAt 
  } = useCameraFeed();

  return (
    <div className="app">
      <header>
        <h1>🌊 Ashtabula Harbor Dashboard</h1>
        <p>Real-time conditions for boaters and lake enthusiasts</p>
      </header>
      
      <main>
        <CameraFeed 
          imageUrl={imageUrl}
          capturedAt={capturedAt}
          loading={cameraLoading}
          error={cameraError}
        />
        
        <BuoyCard 
          data={buoyData}
          loading={buoyLoading}
          lastUpdated={buoyLastUpdated}
        />
      </main>
      
      <footer>
        <p>
          Data: <a href="https://www.ndbc.noaa.gov/">NOAA NDBC</a> | 
          <a href="https://www.weather.gov/">NWS</a>
        </p>
        <p>© 2025 New Ashtabula Initiative</p>
      </footer>
    </div>
  );
}

export default App;
```

### 3.5 Styling
Replace `src/App.css`:
```css
:root {
  --color-primary: #0066CC;
  --color-secondary: #4A90E2;
  --color-bg: #0F172A;
  --color-card: #1E293B;
  --color-text: #F8FAFC;
  --color-text-muted: #94A3B8;
  --color-success: #22C55E;
  --color-warning: #EAB308;
  --color-danger: #EF4444;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
}

.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  min-height: 100vh;
}

header {
  text-align: center;
  padding: 2rem 0;
  border-bottom: 1px solid var(--color-card);
  margin-bottom: 2rem;
}

header h1 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

header p {
  color: var(--color-text-muted);
}

main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.camera-feed {
  background: var(--color-card);
  border-radius: 12px;
  overflow: hidden;
}

.camera-container {
  aspect-ratio: 16/9;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-meta {
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.refresh-badge {
  color: var(--color-success);
}

.card {
  background: var(--color-card);
  border-radius: 12px;
  padding: 1.5rem;
}

.card h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-bg);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-bg);
}

.stat-row:last-of-type {
  border-bottom: none;
}

.stat-row label {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.stat-row span {
  font-weight: 600;
  font-size: 1.125rem;
}

.wind-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.wind-arrow {
  font-size: 1.25rem;
}

.period {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-left: 0.5rem;
}

.meta {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-bg);
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.offline-notice {
  padding: 2rem;
  text-align: center;
  color: var(--color-warning);
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
}

footer {
  margin-top: 3rem;
  padding: 2rem 0;
  text-align: center;
  border-top: 1px solid var(--color-card);
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

footer a {
  color: var(--color-secondary);
  text-decoration: none;
}

@media (max-width: 600px) {
  header h1 {
    font-size: 1.5rem;
  }
  
  .card {
    padding: 1rem;
  }
  
  .stat-row span {
    font-size: 1rem;
  }
}
```

---

## Phase 4: Build and Deploy (15 min)

### 4.1 Environment Configuration
Create `.env`:
```
VITE_API_URL=https://us-central1-harbor-cam-dashboard.cloudfunctions.net
```

### 4.2 Build
```bash
# Build the app
npm run build

# Verify dist folder contents
ls -la dist/
```

### 4.3 Deploy
```bash
# Deploy everything
firebase deploy

# Or deploy specific parts
firebase deploy --only hosting
firebase deploy --only functions
```

---

## Phase 5: Post-Launch (15 min)

### 5.1 Verify Deployment
```bash
# Test endpoints
curl https://us-central1-harbor-cam-dashboard.cloudfunctions.net/getBuoyData
curl https://us-central1-harbor-cam-dashboard.cloudfunctions.net/getCameraImage

# Test site
curl https://harbor-cam-dashboard.web.app
```

### 5.2 Setup Monitoring
```bash
# View logs
firebase functions:log

# Set up alerts (via Firebase Console)
# Go to: https://console.firebase.google.com/
# Navigate to Functions → Monitor
```

### 5.3 SEO/Meta Tags
Update `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ashtabula Harbor Dashboard | Live Conditions</title>
    <meta name="description" content="Real-time harbor conditions for Ashtabula Harbor, Ohio. Live camera, NOAA buoy data, marine forecast, and lake conditions for boaters." />
    <meta name="keywords" content="Ashtabula Harbor, Lake Erie, boating, marine weather, harbor camera, NOAA buoy" />
    <meta property="og:title" content="Ashtabula Harbor Dashboard" />
    <meta property="og:description" content="Live harbor conditions for boaters" />
    <meta property="og:type" content="website" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## Verification Checklist

- [ ] Camera proxy function returns image
- [ ] Buoy function returns parsed data
- [ ] React app loads without errors
- [ ] Auto-refresh intervals working
- [ ] Mobile layout looks good
- [ ] Error states display properly
- [ ] Footer links work
- [ ] Deployed to Firebase Hosting

## Known Issues / Next Iteration

1. **Camera Source:** Need to verify actual camera URL; current implementation uses placeholder
2. **Forecast Parsing:** Currently returns raw text; could parse into structured data
3. **Historical Data:** Not implemented (v2 feature)
4. **Alerts:** No push notifications for weather warnings (v2)
5. **Offline:** Limited offline support
