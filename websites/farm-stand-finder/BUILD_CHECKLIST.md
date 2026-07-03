# BUILD_CHECKLIST.md — Farm Stand Finder
**Project:** Farm Stand Finder  
**Purpose:** Copy-paste implementation commands for rapid development  
**Last Updated:** February 19, 2026

---

## Pre-Development Setup

### 1. Firebase Project Setup

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Create new Firebase project (via web console first)
# Then initialize in project directory
mkdir -p ~/projects/farm-stand-finder && cd ~/projects/farm-stand-finder
firebase init

# Select options:
# ✓ Firestore
# ✓ Functions
# ✓ Hosting
# ✓ Storage
# ✓ Emulators (optional but recommended)
```

### 2. React + Vite Project Scaffolding

```bash
# Create Vite project with React + TypeScript
npm create vite@latest farm-stand-finder -- --template react-ts

cd farm-stand-finder

# Install core dependencies
npm install

# Install UI and utility libraries
npm install react-router-dom @tanstack/react-query zustand
npm install tailwindcss @headlessui/react @heroicons/react
npm install mapbox-gl react-map-gl
npm install date-fns
npm install firebase
npm install clsx tailwind-merge

# Install dev dependencies
npm install -D @types/mapbox-gl
npm install -D vite-plugin-pwa
npm install -D prettier eslint-config-prettier

# Initialize Tailwind
npx tailwindcss init -p
```

### 3. Firebase SDK Configuration

Create `src/lib/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
```

Create `.env.local`:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_MAPBOX_TOKEN=your_mapbox_token
```

---

## Phase 1: MVP Implementation Commands

### Week 1: Project Setup & Map

```bash
# 1. Configure Tailwind
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'farm-green': '#2D5016',
        'harvest-gold': '#F5A623',
      },
    },
  },
  plugins: [],
}
EOF

# 2. Update src/index.css
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-stone-50 text-stone-900;
  }
}
EOF

# 3. Install and verify
npm run dev
```

### Week 1: Core Components

Create `src/components/MapView.tsx`:

```typescript
import { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import type { FarmStand } from '../types/farm';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapViewProps {
  farms: FarmStand[];
  onFarmSelect?: (farm: FarmStand) => void;
}

export function MapView({ farms, onFarmSelect }: MapViewProps) {
  const [selectedFarm, setSelectedFarm] = useState<FarmStand | null>(null);
  const [viewport, setViewport] = useState({
    latitude: 41.86,
    longitude: -80.79,
    zoom: 10,
  });

  return (
    <Map
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      initialViewState={viewport}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/outdoors-v12"
    >
      {farms.map((farm) => (
        <Marker
          key={farm.id}
          latitude={farm.address.coordinates.lat}
          longitude={farm.address.coordinates.lng}
          anchor="bottom"
          onClick={() => setSelectedFarm(farm)}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold cursor-pointer shadow-lg ${
            farm.status === 'open' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            🌾
          </div>
        </Marker>
      ))}
      
      {selectedFarm && (
        <Popup
          latitude={selectedFarm.address.coordinates.lat}
          longitude={selectedFarm.address.coordinates.lng}
          anchor="top"
          onClose={() => setSelectedFarm(null)}
        >
          <div className="p-2">
            <h3 className="font-bold">{selectedFarm.name}</h3>
            <p className="text-sm text-gray-600">{selectedFarm.shortDescription}</p>
            <button 
              className="mt-2 text-farm-green font-medium"
              onClick={() => onFarmSelect?.(selectedFarm)}
            >
              View Details →
            </button>
          </div>
        </Popup>
      )}
    </Map>
  );
}
```

Create `src/types/farm.ts`:

```typescript
export interface FarmStand {
  id: string;
  name: string;
  slug: string;
  type: 'farm-stand' | 'farmers-market' | 'u-pick' | 'csa';
  status: 'open' | 'closed' | 'seasonal-closed';
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  phone?: string;
  email?: string;
  website?: string;
  hours: Record<string, { open: string; close: string; closed?: boolean }>;
  description: string;
  shortDescription: string;
  products: string[];
  photos: {
    main: string;
    gallery: string[];
  };
  currentStatus: {
    isOpenNow: boolean;
    lastUpdated: Date;
  };
}
```

### Week 2: Data Layer

Create `src/hooks/useFarms.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { FarmStand } from '../types/farm';

export function useFarms() {
  return useQuery({
    queryKey: ['farms'],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, 'farms'));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as FarmStand[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useFarm(slug: string) {
  return useQuery({
    queryKey: ['farm', slug],
    queryFn: async () => {
      // Implement single farm fetch
    },
    enabled: !!slug,
  });
}
```

Seed Firestore with sample data:

```bash
# Create seed script
mkdir -p scripts
cat > scripts/seed-farms.js << 'EOF'
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = { /* your config */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const farms = [
  {
    name: "Kiraly's Orchard",
    slug: 'kiralys-orchard',
    type: 'u-pick',
    status: 'open',
    address: {
      street: '6031 South Ridge Road West',
      city: 'Ashtabula',
      state: 'OH',
      zip: '44004',
      coordinates: { lat: 41.86, lng: -80.82 },
    },
    phone: '440-969-1297',
    email: 'skiraly@suite224.net',
    hours: {
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: '09:00', close: '17:00' },
      sunday: { open: '09:00', close: '17:00' },
    },
    description: 'Family orchard offering U-pick apples, peaches, and plums. Fresh cider available in season.',
    shortDescription: 'U-pick apples, peaches, and fresh cider',
    products: ['apples', 'peaches', 'plums', 'cider'],
    photos: { main: '', gallery: [] },
    currentStatus: { isOpenNow: true, lastUpdated: new Date() },
  },
  // Add more farms...
];

async function seed() {
  for (const farm of farms) {
    await addDoc(collection(db, 'farms'), farm);
    console.log(`Added ${farm.name}`);
  }
}

seed().then(() => process.exit());
EOF

node scripts/seed-farms.js
```

### Week 3: UI Components

Install shadcn/ui components (alternative to building from scratch):

```bash
# Option: Use shadcn for rapid UI
npx shadcn-ui@latest init

# Add components
npx shadcn add button card badge dialog input
npx shadcn add select tabs separator
```

Create `src/components/FarmCard.tsx`:

```typescript
import { MapPin, Clock, Phone } from 'lucide-react';
import type { FarmStand } from '../types/farm';

interface FarmCardProps {
  farm: FarmStand;
  distance?: number;
}

export function FarmCard({ farm, distance }: FarmCardProps) {
  const isOpen = farm.currentStatus?.isOpenNow;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-32 bg-gray-200 relative">
        {farm.photos.main ? (
          <img src={farm.photos.main} alt={farm.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🌾</div>
        )}
        <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
          isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isOpen ? 'Open' : 'Closed'}
        </span>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg">{farm.name}</h3>
          {distance && (
            <span className="text-sm text-gray-500">{distance.toFixed(1)} mi</span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{farm.shortDescription}</p>
        
        <div className="mt-3 space-y-1 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{farm.address.city}, {farm.address.state}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{isOpen ? 'Open now' : 'Closed'}</span>
          </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {farm.products.slice(0, 3).map(product => (
            <span key={product} className="px-2 py-1 bg-farm-green/10 text-farm-green text-xs rounded-full">
              {product}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Week 4: PWA Setup

```bash
# Configure PWA
npm install -D vite-plugin-pwa
```

Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Farm Stand Finder',
        short_name: 'FarmFinder',
        description: 'Discover local farms and farm stands in Ashtabula County',
        theme_color: '#2D5016',
        background_color: '#FAFAF8',
        display: 'standalone',
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
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https://firestore\.googleapis\.com/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'farm-data',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              },
            },
          },
        ],
      },
    }),
  ],
});
```

---

## Phase 2: Farmer Portal

### Authentication Setup

```bash
# Enable Auth in Firebase Console first
# Then implement in app
```

Create `src/hooks/useAuth.ts`:

```typescript
import { useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User 
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  const signup = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  return { user, loading, login, signup, logout };
}
```

### Farm Edit Form

```bash
# Install form library
npm install react-hook-form @hookform/resolvers zod
```

Create `src/components/FarmEditForm.tsx`:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const farmSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  description: z.string().max(500),
  // ... other fields
});

type FarmFormData = z.infer<typeof farmSchema>;

export function FarmEditForm({ farm }: { farm: FarmStand }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FarmFormData>({
    resolver: zodResolver(farmSchema),
    defaultValues: farm,
  });

  const onSubmit = async (data: FarmFormData) => {
    const farmRef = doc(db, 'farms', farm.id);
    await updateDoc(farmRef, {
      ...data,
      updatedAt: new Date(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Farm Name</label>
        <input {...register('name')} className="mt-1 input" />
        {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
      </div>
      
      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input {...register('phone')} className="mt-1 input" />
      </div>
      
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea {...register('description')} className="mt-1 input" rows={4} />
      </div>
      
      <button type="submit" className="btn-primary">
        Save Changes
      </button>
    </form>
  );
}
```

---

## Phase 3: Deployment

### Firebase Hosting Deploy

```bash
# Build production
npm run build

# Deploy to Firebase
firebase deploy --only hosting

# Deploy functions (if using)
firebase deploy --only functions

# Deploy firestore rules
firebase deploy --only firestore:rules
```

### Firestore Security Rules

Create `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Farms - public read, owner/admin write
    match /farms/{farmId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.token.role == 'admin';
      allow update: if request.auth != null && (
        request.auth.token.role == 'admin' || 
        resource.data.ownerId == request.auth.uid
      );
      allow delete: if request.auth != null && request.auth.token.role == 'admin';
    }
    
    // Users - self and admin access
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Deploy rules:

```bash
firebase deploy --only firestore:rules
```

---

## Testing Checklist

### Unit Tests

```bash
# Install testing libraries
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Add test script to package.json
# "test": "vitest"
```

Create `src/components/FarmCard.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FarmCard } from './FarmCard';

const mockFarm = {
  id: '1',
  name: 'Test Farm',
  slug: 'test-farm',
  type: 'farm-stand',
  status: 'open',
  address: {
    street: '123 Main St',
    city: 'Ashtabula',
    state: 'OH',
    zip: '44004',
    coordinates: { lat: 41.86, lng: -80.79 },
  },
  description: 'A test farm',
  shortDescription: 'Test farm description',
  products: ['corn', 'tomatoes'],
  photos: { main: '', gallery: [] },
  hours: {},
  currentStatus: { isOpenNow: true, lastUpdated: new Date() },
};

describe('FarmCard', () => {
  it('renders farm name', () => {
    render(<FarmCard farm={mockFarm} />);
    expect(screen.getByText('Test Farm')).toBeDefined();
  });
  
  it('shows open status', () => {
    render(<FarmCard farm={mockFarm} />);
    expect(screen.getByText('Open')).toBeDefined();
  });
});
```

### E2E Tests (Playwright)

```bash
npm init playwright@latest

# Run tests
npx playwright test
```

### Manual Testing Checklist

- [ ] Map loads and shows farm pins
- [ ] Clicking pin shows farm info
- [ ] List view filters by product
- [ ] Farm detail page shows all info
- [ ] "Open Now" calculation is correct
- [ ] Works on mobile (iOS Safari, Android Chrome)
- [ ] Works offline (PWA caching)
- [ ] Auth flow (login/logout) works
- [ ] Farm edit form saves changes
- [ ] Image uploads work
- [ ] Analytics tracking active

---

## Post-Launch Monitoring

### Firebase Console Monitoring

```bash
# View logs
firebase functions:log

# Check hosting usage
# (via Firebase Console > Hosting)

# Monitor Firestore usage
# (via Firebase Console > Firestore > Usage)
```

### Performance Budgets

```javascript
// lighthouse-ci.config.js
module.exports = {
  ci: {
    collect: {
      url: ['https://your-app.web.app/'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
      },
    },
  },
};
```

---

## Quick Reference: Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build

# Firebase
firebase emulators:start # Start local emulators
firebase deploy          # Deploy all
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules

# Testing
npm test                 # Run unit tests
npx playwright test      # Run E2E tests

# Maintenance
npm outdated             # Check for updates
npm update               # Update dependencies
```

---

*Ready to build. Copy-paste and adapt as needed.*
