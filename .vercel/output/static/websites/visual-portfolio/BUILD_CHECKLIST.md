# Phase 4: Build Checklist

## Project: Visual Portfolio - Real Estate Virtual Tour Platform
**Version:** 1.0  
**Date:** February 2026

---

## Quick Start Commands

### Project Initialization
```bash
# Create project directory
mkdir visual-portfolio && cd visual-portfolio

# Initialize with Vite + React + TypeScript
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install

# Install core dependencies
npm install react-router-dom zustand @tanstack/react-query axios firebase
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
npm install cloudinary-react cloudinary-core
npm install react-dropzone pannellum react-pannellum
npm install date-fns lodash clsx tailwind-merge
npm install react-hook-form zod @hookform/resolvers
npm install sonner lucide-react

# Install dev dependencies
npm install -D tailwindcss postcss autoprefixer @types/lodash
npm install -D eslint prettier eslint-config-prettier
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D playwright

# Initialize Tailwind
npx tailwindcss init -p
```

### Firebase Setup Commands
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init

# Select: Firestore, Functions, Hosting, Storage, Emulators
```

### Development Server
```bash
# Start Vite dev server
npm run dev

# Start Firebase emulators (in separate terminal)
firebase emulators:start

# Run tests
npm run test

# Build for production
npm run build
```

---

## Project Structure

```
visual-portfolio/
├── public/
│   ├── favicon.ico
│   └── logo.svg
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── Toast.tsx
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── DashboardLayout.tsx
│   │   ├── properties/
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── PropertyForm.tsx
│   │   │   ├── PhotoGallery.tsx
│   │   │   ├── PhotoUploader.tsx
│   │   │   └── PropertyList.tsx
│   │   ├── tours/
│   │   │   ├── TourViewer.tsx
│   │   │   ├── TourEditor.tsx
│   │   │   ├── SceneList.tsx
│   │   │   ├── HotspotEditor.tsx
│   │   │   └── TourPreview.tsx
│   │   └── analytics/
│   │       ├── StatsCard.tsx
│   │       ├── ViewsChart.tsx
│   │       └── AnalyticsDashboard.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useProperties.ts
│   │   ├── useProperty.ts
│   │   ├── useTour.ts
│   │   ├── useUpload.ts
│   │   └── useSubscription.ts
│   ├── lib/
│   │   ├── firebase.ts         # Firebase config
│   │   ├── cloudinary.ts       # Cloudinary config
│   │   ├── stripe.ts           # Stripe config
│   │   ├── api.ts              # API client
│   │   └── utils.ts            # Utilities
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Properties.tsx
│   │   ├── PropertyDetail.tsx
│   │   ├── TourEditor.tsx
│   │   ├── Settings.tsx
│   │   ├── Billing.tsx
│   │   └── PublicTour.tsx
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── propertyStore.ts
│   │   └── uiStore.ts
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── functions/                   # Firebase Functions
│   ├── src/
│   │   ├── auth/
│   │   ├── properties/
│   │   ├── stripe/
│   │   └── analytics/
│   └── package.json
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Component Implementation

### 1. Tailwind Configuration

**File:** `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### 2. Firebase Configuration

**File:** `src/lib/firebase.ts`
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

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
export const functions = getFunctions(app);
```

### 3. TypeScript Types

**File:** `src/types/index.ts`
```typescript
import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  brokerage: string;
  licenseNumber: string;
  role: 'agent' | 'broker' | 'admin';
  avatarUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  subscriptionId: string;
  teamId?: string;
  teamRole?: 'owner' | 'admin' | 'member';
  preferences: {
    emailNotifications: boolean;
    weeklyReport: boolean;
    timezone: string;
  };
}

export interface Property {
  id: string;
  userId: string;
  teamId?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    latitude: number;
    longitude: number;
    formatted: string;
  };
  propertyType: 'single_family' | 'condo' | 'townhouse' | 'land' | 'commercial' | 'multi_family';
  listPrice: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  lotSize?: string;
  yearBuilt?: number;
  description?: string;
  status: 'draft' | 'active' | 'sold' | 'off_market';
  mlsNumber?: string;
  featuredImageId?: string;
  imageCount: number;
  hasTour: boolean;
  publicId: string;
  isPublic: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
  expiresAt?: Timestamp;
}

export interface PropertyImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  size: number;
  caption?: string;
  order: number;
  isFeatured: boolean;
  uploadedAt: Timestamp;
}

export interface TourScene {
  id: string;
  imageUrl: string;
  thumbnailUrl: string;
  title: string;
  initialView: {
    pitch: number;
    yaw: number;
    hfov: number;
  };
  hotspots: Hotspot[];
}

export interface Hotspot {
  id: string;
  type: 'scene' | 'info';
  pitch: number;
  yaw: number;
  targetSceneId?: string;
  text?: string;
}

export interface Tour {
  id: string;
  scenes: TourScene[];
  config: {
    autoRotate: boolean;
    autoRotateSpeed: number;
    showZoomControls: boolean;
    showFullscreen: boolean;
    showGyroscope: boolean;
    themeColor: string;
  };
  updatedAt: Timestamp;
}

export interface Subscription {
  id: string;
  userId?: string;
  teamId?: string;
  planId: 'starter' | 'professional' | 'team' | 'enterprise';
  planName: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  maxListings: number;
  maxTeamMembers?: number;
  features: string[];
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  cancelAtPeriodEnd: boolean;
  currentListingCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 4. Button Component

**File:** `src/components/ui/Button.tsx`
```typescript
import { forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center font-medium rounded-lg transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
            'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500':
              variant === 'primary',
            'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500':
              variant === 'secondary',
            'text-gray-700 hover:bg-gray-100 focus:ring-gray-500': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': variant === 'danger',
            'opacity-50 cursor-not-allowed': disabled || loading,
          },
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### 5. Photo Gallery Component

**File:** `src/components/properties/PhotoGallery.tsx`
```typescript
import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { PropertyImage } from '../../types';

interface PhotoGalleryProps {
  images: PropertyImage[];
  onReorder: (images: PropertyImage[]) => void;
  onDelete: (imageId: string) => void;
  onSetFeatured: (imageId: string) => void;
  editable?: boolean;
}

export function PhotoGallery({ images, onReorder, onDelete, onSetFeatured, editable = false }: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      onReorder(arrayMove(images, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      {images.length > 0 && (
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={images.find(img => img.isFeatured)?.url || images[0]?.url}
            alt="Featured property"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Thumbnail Grid */}
      {editable ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images.map(img => img.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-4 gap-2">
              {images.map((image) => (
                <SortablePhoto
                  key={image.id}
                  image={image}
                  onDelete={() => onDelete(image.id)}
                  onSetFeatured={() => onSetFeatured(image.id)}
                  onClick={() => setSelectedImage(image.url)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(image.url)}
            >
              <img src={image.thumbnailUrl} alt={image.caption || ''} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <ImageLightbox src={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
}
```

### 6. Image Upload Component

**File:** `src/components/properties/PhotoUploader.tsx`
```typescript
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface PhotoUploaderProps {
  onUpload: (files: File[]) => void;
  uploading?: boolean;
  maxFiles?: number;
}

export function PhotoUploader({ onUpload, uploading = false, maxFiles = 50 }: PhotoUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}
        ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {uploading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600" />
        ) : (
          <Upload className="w-6 h-6 text-gray-600" />
        )}
      </div>
      
      <p className="text-sm font-medium text-gray-900 mb-1">
        {isDragActive ? 'Drop photos here' : 'Drag & drop photos here'}
      </p>
      <p className="text-xs text-gray-500">
        or click to browse • JPG, PNG up to 10MB each
      </p>
    </div>
  );
}
```

### 7. Tour Viewer Component

**File:** `src/components/tours/TourViewer.tsx`
```typescript
import { useEffect, useRef, useState } from 'react';
import { Tour, TourScene } from '../../types';

interface TourViewerProps {
  tour: Tour;
  onSceneChange?: (sceneId: string) => void;
}

declare global {
  interface Window {
    pannellum: any;
  }
}

export function TourViewer({ tour, onSceneChange }: TourViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstance = useRef<any>(null);
  const [currentScene, setCurrentScene] = useState(tour.scenes[0]?.id);

  useEffect(() => {
    if (!viewerRef.current || tour.scenes.length === 0) return;

    // Build pannellum scenes config
    const scenes: Record<string, any> = {};
    tour.scenes.forEach((scene) => {
      scenes[scene.id] = {
        type: 'equirectangular',
        panorama: scene.imageUrl,
        title: scene.title,
        pitch: scene.initialView.pitch,
        yaw: scene.initialView.yaw,
        hfov: scene.initialView.hfov,
        hotSpots: scene.hotspots.map((hotspot) => ({
          pitch: hotspot.pitch,
          yaw: hotspot.yaw,
          type: hotspot.type === 'scene' ? 'scene' : 'info',
          text: hotspot.type === 'info' ? hotspot.text : undefined,
          sceneId: hotspot.type === 'scene' ? hotspot.targetSceneId : undefined,
        })),
      };
    });

    // Initialize viewer
    viewerInstance.current = window.pannellum.viewer(viewerRef.current, {
      default: {
        firstScene: tour.scenes[0]?.id,
        sceneFadeDuration: 1000,
        autoLoad: true,
      },
      scenes,
    });

    // Listen for scene changes
    viewerInstance.current.on('scenechange', (sceneId: string) => {
      setCurrentScene(sceneId);
      onSceneChange?.(sceneId);
    });

    return () => {
      viewerInstance.current?.destroy();
    };
  }, [tour]);

  return (
    <div className="relative">
      {/* Pannellum Container */}
      <div ref={viewerRef} className="w-full aspect-video rounded-lg overflow-hidden" />
      
      {/* Scene Navigation Sidebar */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg shadow-lg p-2 max-w-xs">
        <h4 className="text-sm font-medium px-2 py-1">Rooms</h4>
        <div className="space-y-1 mt-1">
          {tour.scenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => viewerInstance.current?.loadScene(scene.id)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-sm transition-colors
                ${currentScene === scene.id ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'}
              `}
            >
              <img src={scene.thumbnailUrl} alt="" className="w-8 h-8 rounded object-cover" />
              <span className="truncate">{scene.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 8. Cloudinary Upload Hook

**File:** `src/hooks/useUpload.ts`
```typescript
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  url?: string;
}

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export function useUpload() {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  const uploadFiles = useCallback(async (files: File[], folder: string) => {
    const fileIds = files.map(() => uuidv4());
    
    // Initialize upload progress
    setUploads(prev => [
      ...prev,
      ...files.map((file, i) => ({
        fileId: fileIds[i],
        fileName: file.name,
        progress: 0,
        status: 'pending' as const,
      })),
    ]);

    const uploadPromises = files.map(async (file, index) => {
      const fileId = fileIds[index];
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', folder);
      
      setUploads(prev => prev.map(u => 
        u.fileId === fileId ? { ...u, status: 'uploading' } : u
      ));

      try {
        const response = await fetch(CLOUDINARY_URL, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();
        
        setUploads(prev => prev.map(u => 
          u.fileId === fileId 
            ? { ...u, status: 'complete', progress: 100, url: data.secure_url } 
            : u
        ));

        return {
          fileId,
          url: data.secure_url,
          thumbnailUrl: data.eager?.[0]?.secure_url || data.secure_url,
          width: data.width,
          height: data.height,
          size: data.bytes,
        };
      } catch (error) {
        setUploads(prev => prev.map(u => 
          u.fileId === fileId ? { ...u, status: 'error' } : u
        ));
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  }, []);

  return { uploads, uploadFiles };
}
```

---

## Firebase Functions

### 1. Stripe Webhook Handler

**File:** `functions/src/stripe/webhook.ts`
```typescript
import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import Stripe from 'stripe';

initializeApp();
const db = getFirestore();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

export const stripeWebhook = onRequest(
  { secrets: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'] },
  async (request, response) => {
    const sig = request.headers['stripe-signature']!;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(request.rawBody, sig, endpointSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle events
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.Invoice);
        break;
    }

    response.json({ received: true });
  }
);

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  
  await db.collection('subscriptions').doc(userId).update({
    status: subscription.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    updatedAt: new Date(),
  });
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  
  await db.collection('subscriptions').doc(userId).update({
    status: 'canceled',
    updatedAt: new Date(),
  });
}

async function handlePaymentFailure(invoice: Stripe.Invoice) {
  // Send notification to user
  // Grace period handling
}
```

### 2. Create Checkout Session

**File:** `functions/src/stripe/checkout.ts`
```typescript
import { onCall } from 'firebase-functions/v2/https';
import { Stripe } from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

const PRICE_IDS = {
  starter: process.env.STRIPE_PRICE_STARTER,
  professional: process.env.STRIPE_PRICE_PROFESSIONAL,
  team: process.env.STRIPE_PRICE_TEAM,
};

export const createCheckoutSession = onCall(
  { secrets: ['STRIPE_SECRET_KEY'] },
  async (request) => {
    const { planId, successUrl, cancelUrl } = request.data;
    const userId = request.auth?.uid;
    
    if (!userId) throw new Error('Authentication required');
    
    const priceId = PRICE_IDS[planId as keyof typeof PRICE_IDS];
    if (!priceId) throw new Error('Invalid plan');

    const session = await stripe.checkout.sessions.create({
      customer_email: request.auth?.token?.email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { userId },
      subscription_data: { metadata: { userId } },
    });

    return { sessionId: session.id };
  }
);
```

---

## Firestore Security Rules

**File:** `firestore.rules`
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function belongsToTeam(teamId) {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/teams/$(teamId)/members/$(request.auth.uid));
    }
    
    function isTeamAdmin(teamId) {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/teams/$(teamId)/members/$(request.auth.uid)).data.role in ['owner', 'admin'];
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow create: if isOwner(userId);
      allow update: if isOwner(userId);
      allow delete: if false;
    }
    
    // Properties collection
    match /properties/{propertyId} {
      allow read: if isAuthenticated() && (resource.data.userId == request.auth.uid || belongsToTeam(resource.data.teamId));
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update: if isAuthenticated() && (resource.data.userId == request.auth.uid || isTeamAdmin(resource.data.teamId));
      allow delete: if isAuthenticated() && (resource.data.userId == request.auth.uid || isTeamAdmin(resource.data.teamId));
    }
    
    // Property images subcollection
    match /properties/{propertyId}/images/{imageId} {
      allow read: if true; // Public access for tour images
      allow write: if isAuthenticated() && 
        (get(/databases/$(database)/documents/properties/$(propertyId)).data.userId == request.auth.uid);
    }
    
    // Tours subcollection
    match /properties/{propertyId}/tour/{tourId} {
      allow read: if true; // Public access for tours
      allow write: if isAuthenticated() && 
        (get(/databases/$(database)/documents/properties/$(propertyId)).data.userId == request.auth.uid);
    }
    
    // Subscriptions
    match /subscriptions/{subscriptionId} {
      allow read: if isAuthenticated() && 
        (resource.data.userId == request.auth.uid || resource.data.teamId in 
          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.teams);
      allow write: if false; // Only server-side writes
    }
    
    // Teams
    match /teams/{teamId} {
      allow read: if belongsToTeam(teamId);
      allow create: if isAuthenticated();
      allow update: if isTeamAdmin(teamId);
      allow delete: if false;
    }
    
    match /teams/{teamId}/members/{memberId} {
      allow read: if belongsToTeam(teamId);
      allow write: if isTeamAdmin(teamId);
    }
  }
}
```

---

## Environment Variables

**File:** `.env.local` (local development)
```
# Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key
```

**File:** `functions/.env` (Firebase Functions)
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PROFESSIONAL=price_...
STRIPE_PRICE_TEAM=price_...
```

---

## Testing Checklist

### Unit Tests
```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage
```

**Test Files to Create:**
- `src/lib/utils.test.ts` - Utility functions
- `src/hooks/useAuth.test.ts` - Authentication hook
- `src/components/ui/Button.test.tsx` - UI components

### E2E Tests with Playwright
```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npx playwright test

# Run with UI
npx playwright test --ui
```

**Test Scenarios:**

#### Auth Flow
```typescript
// tests/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can register and login', async ({ page }) => {
  await page.goto('/register');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'TestPass123!');
  await page.fill('[name="firstName"]', 'Test');
  await page.fill('[name="lastName"]', 'User');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/dashboard');
});
```

#### Property Creation Flow
```typescript
// tests/property.spec.ts
test('user can create a property with photos', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'TestPass123!');
  await page.click('button[type="submit"]');
  
  // Create property
  await page.click('text=Add Property');
  await page.fill('[name="address"]', '123 Main St');
  await page.fill('[name="city"]', 'Ashtabula');
  await page.fill('[name="zip"]', '44004');
  await page.fill('[name="listPrice"]', '150000');
  await page.click('text=Save Property');
  
  // Upload photos
  await page.setInputFiles('[data-testid="photo-upload"]', [
    'test-assets/photo1.jpg',
    'test-assets/photo2.jpg',
  ]);
  
  await expect(page.locator('[data-testid="photo-gallery"] img')).toHaveCount(2);
});
```

### Manual QA Checklist

#### Registration & Onboarding
- [ ] Can register with valid email/password
- [ ] Email verification required
- [ ] Error shown for duplicate email
- [ ] Password strength requirements enforced
- [ ] Can complete profile after verification
- [ ] Welcome email received

#### Property Management
- [ ] Can create new property with all fields
- [ ] Address autocomplete works
- [ ] Can edit property details
- [ ] Can delete property (with confirmation)
- [ ] Property appears in dashboard list
- [ ] Search/filter properties works

#### Photo Upload
- [ ] Drag-and-drop upload works
- [ ] Can select multiple files
- [ ] Progress indicator shows during upload
- [ ] Images appear in gallery after upload
- [ ] Can reorder images via drag-drop
- [ ] Can delete images
- [ ] Can set featured image
- [ ] Captions can be added

#### Tour Creation
- [ ] Can upload 360° images
- [ ] Visual editor loads
- [ ] Can place hotspots on 360° view
- [ ] Can link hotspots to other scenes
- [ ] Can set initial view direction
- [ ] Preview shows correctly
- [ ] Tour saves successfully

#### Public Tour
- [ ] Public URL loads without login
- [ ] Gallery view displays properly
- [ ] 360° tour loads and navigates
- [ ] Mobile responsive
- [ ] QR code generates correctly
- [ ] Share buttons work

#### Subscription
- [ ] Can view current plan
- [ ] Can upgrade plan
- [ ] Payment processed via Stripe
- [ ] Subscription limits enforced
- [ ] Can cancel subscription
- [ ] Billing history accessible

#### Performance
- [ ] Page load < 3 seconds on 4G
- [ ] Image optimization working (WebP)
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] Smooth animations

#### Security
- [ ] Cannot access other users' properties
- [ ] Cannot access pages without login
- [ ] API endpoints require authentication
- [ ] Rate limiting prevents abuse

#### Cross-Browser
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Mobile
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Touch interactions work
- [ ] Forms usable on small screens

---

## Deployment Checklist

### Pre-Deployment
- [ ] All environment variables set in production
- [ ] Firebase project upgraded to Blaze plan
- [ ] Stripe webhooks configured for production
- [ ] Cloudinary upload preset configured
- [ ] Domain configured and SSL certificate active
- [ ] Terms of Service and Privacy Policy pages created
- [ ] Support email configured

### Firebase Deployment
```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes

# Deploy Cloud Functions
firebase deploy --only functions

# Deploy Storage rules
firebase deploy --only storage
```

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Post-Deployment
- [ ] Smoke test all critical paths
- [ ] Verify Stripe webhooks receiving events
- [ ] Check Firebase Analytics collecting data
- [ ] Test email notifications sending
- [ ] Monitor error logs (Sentry/Firebase)
- [ ] Verify CDN caching working
- [ ] Test on production domain

---

## Next Steps After Build

1. **Run Pilot Program**
   - Contact 5-10 agents from Phase 2
   - Onboard with free 90-day access
   - Collect weekly feedback

2. **Iterate Based on Feedback**
   - Prioritize feature requests
   - Fix reported bugs
   - Improve UX pain points

3. **Marketing Launch**
   - Create demo video
   - Write case studies from pilot
   - Present at ACR meeting
   - Launch social media campaign

4. **Scale Team Features**
   - Build team management dashboard
   - Add brokerage onboarding flow
   - Create white-label options

---

**Deliverables Complete!** All 4 phases documented and ready for implementation.
