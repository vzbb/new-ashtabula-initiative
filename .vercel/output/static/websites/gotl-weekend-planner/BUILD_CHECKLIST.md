# BUILD_CHECKLIST.md — GotL Weekend Planner
## Implementation Guide: Copy-Paste Ready Commands

**Project:** gotl-weekend-planner  
**Version:** 1.0  
**Est. Timeline:** 4 weeks (1 developer, part-time)

---

## Prerequisites

```bash
# Required tools
node --version  # v18+
npm --version   # v9+
firebase --version  # v13+ (npm install -g firebase-tools)
git --version

# Create project directory
mkdir -p ~/projects/gotl-weekend-planner
cd ~/projects/gotl-weekend-planner
```

---

## Phase 1: Foundation (Week 1)

### Day 1-2: Firebase Setup

```bash
# 1. Login to Firebase
firebase login

# 2. Initialize project
firebase init
# Select: Firestore, Functions, Hosting, Emulators
# Use existing project or create new: gotl-weekend-planner
# Firestore rules: firestore.rules
# Firestore indexes: firestore.indexes.json
# Functions language: JavaScript
# Hosting public dir: dist
# Single-page app: Yes

# 3. Set up Gemini API key
firebase functions:config:set gemini.api_key="YOUR_GEMINI_API_KEY"

# 4. Update Firestore rules (firestore.rules)
cat > firestore.rules << 'EOF'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /itineraries/{itineraryId} {
      allow read: if resource.data.shareToken == request.query.token ||
                    request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if true;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /attractions/{attractionId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
EOF

# 5. Deploy rules
firebase deploy --only firestore:rules
```

### Day 3-4: React Scaffold

```bash
# 1. Create Vite + React project
npm create vite@latest web -- --template react
cd web
npm install

# 2. Install dependencies
npm install firebase @google/generative-ai react-router-dom lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Configure Tailwind (tailwind.config.js)
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        wine: '#722F37',
        lake: '#4A90A4',
        gold: '#D4AF37',
        cream: '#FDF8F3',
        charcoal: '#2D3436',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
EOF

# 4. Add Tailwind directives (src/index.css)
cat > src/index.css << 'EOF'
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', sans-serif;
  background-color: #FDF8F3;
  color: #2D3436;
}

h1, h2, h3, h4 {
  font-family: 'Playfair Display', serif;
}
EOF

# 5. Firebase config (src/firebase.js)
cat > src/firebase.js << 'EOF'
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
EOF

# 6. Create .env.local
cat > .env.local << 'EOF'
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=gotl-weekend-planner.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gotl-weekend-planner
VITE_FIREBASE_STORAGE_BUCKET=gotl-weekend-planner.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
EOF
```

### Day 5-7: Core Components

```bash
# Create component structure
mkdir -p src/components src/pages src/context src/data

# 1. Quiz Context (src/context/QuizContext.jsx)
cat > src/context/QuizContext.jsx << 'EOF'
import { createContext, useContext, useState } from 'react';

const QuizContext = createContext();

export function QuizProvider({ children }) {
  const [quizData, setQuizData] = useState({
    dates: { start: null, end: null },
    groupType: 'couple',
    adults: 2,
    children: 0,
    interests: [],
    pace: 'moderate',
    budget: 'moderate',
    mobility: 'driving',
  });

  const updateQuizData = (updates) => {
    setQuizData(prev => ({ ...prev, ...updates }));
  };

  return (
    <QuizContext.Provider value={{ quizData, updateQuizData }}>
      {children}
    </QuizContext.Provider>
  );
}

export const useQuiz = () => useContext(QuizContext);
EOF

# 2. Sample attractions data (src/data/attractions.js)
cat > src/data/attractions.js << 'EOF'
export const attractions = [
  {
    id: 'old-firehouse-winery',
    name: 'Old Firehouse Winery',
    category: 'winery',
    description: 'Iconic winery with carousel bar and lake views',
    location: { lat: 41.8595, lng: -80.9553 },
    tags: ['wine-tasting', 'lake-view', 'iconic', 'dining'],
    priceRange: '$$',
  },
  {
    id: 'ferrante-winery',
    name: 'Ferrante Winery & Restaurant',
    category: 'winery',
    description: 'Award-winning wines with full-service restaurant',
    location: { lat: 41.8001, lng: -80.9467 },
    tags: ['wine-tasting', 'dining', 'award-winning'],
    priceRange: '$$$',
  },
  {
    id: 'adventure-zone',
    name: 'Adventure Zone',
    category: 'activity',
    description: 'Family fun with zip lines, go-karts, mini-golf, and arcade',
    location: { lat: 41.8602, lng: -80.9561 },
    tags: ['kid-friendly', 'adventure', 'arcade', 'outdoor'],
    priceRange: '$$',
  },
  // Add 17+ more attractions...
];
EOF

# 3. Main App with Router (src/App.jsx)
cat > src/App.jsx << 'EOF'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import LandingPage from './pages/LandingPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import ItineraryPage from './pages/ItineraryPage';
import './index.css';

function App() {
  return (
    <QuizProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/itinerary/:id" element={<ItineraryPage />} />
          <Route path="/shared/:token" element={<ItineraryPage />} />
        </Routes>
      </BrowserRouter>
    </QuizProvider>
  );
}

export default App;
EOF
```

---

## Phase 2: Cloud Function (Week 2)

```bash
# Navigate to functions directory
cd ../functions

# 1. Install dependencies
npm install @google/generative-ai

# 2. Generate itinerary function (index.js)
cat > index.js << 'EOF'
const { GoogleGenerativeAI } = require('@google/generative-ai');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateItinerary = functions.https.onCall(async (data, context) => {
  // Rate limiting check (simplified - use Firestore for production)
  
  const { quizData } = data;
  
  // Fetch relevant attractions
  const attractionsSnapshot = await db.collection('attractions')
    .where('isActive', '==', true)
    .limit(20)
    .get();
  
  const attractions = attractionsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  const prompt = buildPrompt(quizData, attractions);
  
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  
  try {
    const itineraries = JSON.parse(response.text());
    
    // Save to Firestore
    const docRef = await db.collection('itineraries').add({
      inputs: quizData,
      generatedItineraries: itineraries,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      shareToken: generateToken(),
    });
    
    return { 
      id: docRef.id, 
      itineraries,
      shareToken: docRef.shareToken,
    };
  } catch (error) {
    console.error('Parse error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate itinerary');
  }
});

function buildPrompt(quizData, attractions) {
  return `
You are an expert Geneva-on-the-Lake travel planner.

USER PREFERENCES:
- Dates: ${quizData.dates.start} to ${quizData.dates.end}
- Group: ${quizData.adults} adults, ${quizData.children} children (${quizData.groupType})
- Interests: ${quizData.interests.join(', ')}
- Pace: ${quizData.pace}
- Budget: ${quizData.budget}
- Transport: ${quizData.mobility}

AVAILABLE ATTRACTIONS:
${JSON.stringify(attractions, null, 2)}

Generate 3 itinerary options in this JSON format:
[
  {
    "id": "classic",
    "title": "The Classic GOTL Experience",
    "description": "...",
    "days": [
      {
        "day": 1,
        "theme": "...",
        "activities": [
          {
            "time": "9:00 AM",
            "name": "...",
            "type": "winery|activity|dining|beach",
            "description": "...",
            "duration": "2 hours"
          }
        ]
      }
    ],
    "estimatedCost": "$X per person",
    "tags": [...]
  }
]

Include diverse options: one balanced, one focused on top interest (${quizData.interests[0]}), one with hidden gems.
Use ONLY the attraction names provided. Be specific with times and realistic with travel.
`;
}

function generateToken() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
EOF

# 3. Deploy function
firebase deploy --only functions
```

---

## Phase 3: UI Polish (Week 3)

```bash
cd ../web

# Install additional UI dependencies
npm install framer-motion date-fns

# Build and deploy
npm run build
firebase deploy --only hosting
```

**Key UI Tasks:**
- [ ] Quiz step animations (Framer Motion)
- [ ] Loading states during generation
- [ ] Empty/error states
- [ ] Mobile touch optimization
- [ ] Print styles (`@media print`)
- [ ] Share dialog with copy-to-clipboard

---

## Phase 4: Launch Prep (Week 4)

```bash
# SEO optimization
# Create public/robots.txt
cat > public/robots.txt << 'EOF'
User-agent: *
Allow: /
Sitemap: https://gotl-planner.noirsys.com/sitemap.xml
EOF

# Performance checks
npm run build
# Check bundle size: dist/assets/*.js

# Lighthouse CI (optional)
npm install -g @lhci/cli
lhci autorun

# Final deploy
firebase deploy

# Verify endpoints
curl https://your-project.web.app/
```

---

## Data Seeding

```bash
# Create seed script (scripts/seedAttractions.js)
node scripts/seedAttractions.js
```

Sample seed data for the 20 core attractions included in SPEC.md.

---

## Environment Variables Checklist

| Variable | Source | Set In |
|----------|--------|--------|
| `GEMINI_API_KEY` | Google AI Studio | Firebase Functions Config |
| `FIREBASE_API_KEY` | Firebase Console | `.env.local` |
| `GA_MEASUREMENT_ID` | Google Analytics | `.env.local` |

---

## Post-Launch Tasks

- [ ] Submit to Google Search Console
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Configure weekly attraction data review
- [ ] Create feedback form (Typeform/Google Forms)
- [ ] Plan v1.1 feature list based on analytics

---

**Status:** Ready for development  
**Estimated Effort:** 40-60 hours  
**Blockers:** None identified
