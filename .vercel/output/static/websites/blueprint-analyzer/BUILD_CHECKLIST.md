# Phase 4: Build Checklist — Blueprint Analyzer MVP
**Project:** Blueprint Analyzer (New Ashtabula Initiative)  
**Date:** February 19, 2026  
**Est. Time:** 100 hours (~2.5 weeks)

---

## Pre-Flight Checklist

Before starting, ensure you have:
- [ ] Node.js 18+ installed (`node -v`)
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Google Cloud account with billing enabled
- [ ] Gemini API key (from Google AI Studio)
- [ ] Git repository initialized

---

## Phase 1: Foundation (Week 1)

### Step 1.1: Project Initialization

```bash
# Create project directory
cd /home/tt/.openclaw/workspace/projects/new-ashtabula-initiative/websites/blueprint-analyzer/
mkdir blueprint-analyzer-web && cd blueprint-analyzer-web

# Initialize React + TypeScript + Vite
npm create vite@latest . -- --template react-ts

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install Firebase
npm install firebase

# Install additional dependencies
npm install react-router-dom zustand pdfjs-dist xlsx lucide-react clsx tailwind-merge

# Install dev dependencies
npm install -D @types/node @types/pdfjs-dist

# Initialize Git
git init
git add .
git commit -m "Initial commit: React + TS + Tailwind setup"
```

### Step 1.2: Tailwind Configuration

```bash
# Update tailwind.config.js
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
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
}
EOF

# Update src/index.css
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}
EOF
```

### Step 1.3: Firebase Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Select: Firestore, Functions, Hosting, Storage, Emulators

# Create firebase.ts config
cat > src/services/firebase.ts << 'EOF'
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
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
export default app;
EOF

# Create .env template
cat > .env.example << 'EOF'
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_key
EOF
```

### Step 1.4: Type Definitions

```bash
# Create types file
mkdir -p src/types
cat > src/types/index.ts << 'EOF'
export interface User {
  uid: string;
  email: string;
  displayName: string;
  companyName?: string;
  subscriptionTier: 'free' | 'pro' | 'team' | 'enterprise';
  createdAt: Date;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  address?: string;
  clientName?: string;
  status: 'active' | 'archived' | 'completed';
  totalSquareFootage?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Blueprint {
  id: string;
  projectId: string;
  name: string;
  fileUrl: string;
  fileType: 'pdf' | 'png' | 'jpg';
  fileSize: number;
  pageCount: number;
  scale?: Scale;
  rooms: Room[];
  totalSquareFootage: number;
  analysisStatus: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Scale {
  ratio: string;
  pixelsPerUnit?: number;
}

export interface Room {
  id: string;
  name: string;
  type?: string;
  dimensions: {
    width: number;
    length: number;
    height?: number;
  };
  squareFootage: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  isManuallyCreated: boolean;
  notes?: string;
  confidence?: number;
}
EOF
```

### Step 1.5: Authentication Components

```bash
# Create auth hook
mkdir -p src/hooks
cat > src/hooks/useAuth.ts << 'EOF'
import { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, displayName: string) => {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    
    const newUser: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName,
      subscriptionTier: 'free',
      createdAt: new Date(),
    };
    
    await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
    return newUser;
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return { user, loading, signup, login, logout };
};
EOF
```

```bash
# Create Login page
mkdir -p src/pages
cat > src/pages/Login.tsx << 'EOF'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, displayName);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-primary-500"
              required
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-primary-500"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-primary-500"
            required
          />
          
          <button
            type="submit"
            className="w-full p-3 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary-600 hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};
EOF
```

### Step 1.6: Project Management

```bash
# Create projects hook
cat > src/hooks/useProjects.ts << 'EOF'
import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { Project } from '../types';

export const useProjects = (userId: string) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    
    const q = query(
      collection(db, 'projects'),
      where('userId', '==', userId)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Project[];
      
      setProjects(projectsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  const createProject = useCallback(async (data: Partial<Project>) => {
    await addDoc(collection(db, 'projects'), {
      ...data,
      userId,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }, [userId]);

  const updateProject = useCallback(async (id: string, data: Partial<Project>) => {
    await updateDoc(doc(db, 'projects', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'projects', id));
  }, []);

  return { projects, loading, createProject, updateProject, deleteProject };
};
EOF
```

```bash
# Create Dashboard page
cat > src/pages/Dashboard.tsx << 'EOF'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Folder, MoreVertical } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const { projects, loading, createProject } = useProjects(user?.uid || '');
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const navigate = useNavigate();

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProject({ name: newProjectName });
    setNewProjectName('');
    setShowNewProject(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Blueprint Analyzer</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={logout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Projects</h2>
          <button
            onClick={() => setShowNewProject(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            <Plus size={20} />
            New Project
          </button>
        </div>

        {showNewProject && (
          <form onSubmit={handleCreateProject} className="mb-6 p-4 bg-white rounded-lg shadow">
            <input
              type="text"
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full p-2 border rounded mb-3"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowNewProject(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                className="p-6 bg-white rounded-lg shadow hover:shadow-md cursor-pointer transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Folder className="text-primary-500" />
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-gray-500">
                        {project.totalSquareFootage 
                          ? `${project.totalSquareFootage.toLocaleString()} sq ft` 
                          : 'No blueprints'}
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
EOF
```

---

## Phase 2: Core AI Features (Week 2)

### Step 2.1: File Upload Component

```bash
# Create upload hook
cat > src/hooks/useBlueprint.ts << 'EOF'
import { useState, useCallback } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../services/firebase';
import { Blueprint } from '../types';

export const useBlueprint = (projectId: string) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadBlueprint = useCallback(async (file: File): Promise<string> => {
    setUploading(true);
    setProgress(0);
    
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `projects/${projectId}/${filename}`);
    
    // Upload file
    await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(storageRef);
    
    // Create blueprint record
    const blueprintRef = await addDoc(
      collection(db, 'projects', projectId, 'blueprints'),
      {
        projectId,
        name: file.name,
        fileUrl,
        fileType: file.name.split('.').pop()?.toLowerCase(),
        fileSize: file.size,
        pageCount: 1, // TODO: detect PDF pages
        rooms: [],
        totalSquareFootage: 0,
        analysisStatus: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );
    
    setUploading(false);
    return blueprintRef.id;
  }, [projectId]);

  return { uploadBlueprint, uploading, progress };
};
EOF
```

```bash
# Create file upload component
mkdir -p src/components/blueprint
cat > src/components/blueprint/FileUpload.tsx << 'EOF'
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File } from 'lucide-react';

interface FileUploadProps {
  onUpload: (file: File) => void;
  uploading?: boolean;
}

export const FileUpload = ({ onUpload, uploading }: FileUploadProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: uploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors duration-200
        ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}
        ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-400'}
      `}
    >
      <input {...getInputProps()} />
      
      {uploading ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-2"></div>
          <p className="text-gray-600">Uploading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {isDragActive ? (
            <Upload className="h-12 w-12 text-primary-500 mb-2" />
          ) : (
            <File className="h-12 w-12 text-gray-400 mb-2" />
          )}
          <p className="text-gray-700 font-medium">
            {isDragActive ? 'Drop the file here' : 'Drag & drop a blueprint'}
          </p>
          <p className="text-gray-500 text-sm mt-1">
            or click to select (PDF, PNG, JPG up to 50MB)
          </p>
        </div>
      )}
    </div>
  );
};
EOF

npm install react-dropzone
```

### Step 2.2: Gemini Vision Integration

```bash
# Create Gemini service
mkdir -p src/services
cat > src/services/gemini.ts << 'EOF'
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Room } from '../types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface AnalysisResult {
  rooms: Room[];
  totalSquareFootage: number;
}

export const analyzeBlueprint = async (
  fileUrl: string,
  scale: string
): Promise<AnalysisResult> => {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-3-flash',
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
    }
  });

  // Fetch file as base64
  const response = await fetch(fileUrl);
  const blob = await response.blob();
  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });

  const mimeType = blob.type || 'application/pdf';
  const base64Data = base64.split(',')[1];

  const prompt = `Analyze this architectural blueprint and extract all room measurements.

Blueprint scale: ${scale}

Instructions:
1. Identify every room in the blueprint
2. For each room, provide:
   - Room name (standard name like "Kitchen", "Master Bedroom", "Living Room")
   - Dimensions in feet (width and length)
   - Square footage (calculated)
   - Bounding box coordinates (normalized 0-1 for x, y, width, height)

3. Return ONLY valid JSON in this exact format:
{
  "rooms": [
    {
      "id": "unique-id",
      "name": "Room Name",
      "dimensions": { "width": 12.5, "length": 14.0 },
      "squareFootage": 175.0,
      "boundingBox": { "x": 0.1, "y": 0.2, "width": 0.3, "height": 0.25 },
      "confidence": 0.95
    }
  ],
  "totalSquareFootage": 175.0
}

Use decimal feet for precision. If a dimension is uncertain, provide your best estimate with lower confidence.`;

  const result = await model.generateContent([
    prompt,
    { inlineData: { mimeType, data: base64Data } }
  ]);

  const response_text = result.response.text();
  
  try {
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = response_text.match(/```json\n?([\s\S]*?)\n?```/) || 
                      response_text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : response_text;
    const parsed = JSON.parse(jsonStr);
    
    // Validate and transform to Room objects
    const rooms: Room[] = parsed.rooms.map((r: any) => ({
      id: r.id || Math.random().toString(36).substr(2, 9),
      name: r.name,
      dimensions: r.dimensions,
      squareFootage: r.squareFootage || (r.dimensions.width * r.dimensions.length),
      boundingBox: r.boundingBox,
      confidence: r.confidence || 0.8,
      isManuallyCreated: false,
    }));

    return {
      rooms,
      totalSquareFootage: parsed.totalSquareFootage || 
        rooms.reduce((sum, r) => sum + r.squareFootage, 0),
    };
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    throw new Error('Analysis failed. Please try again or enter measurements manually.');
  }
};
EOF

npm install @google/generative-ai
```

### Step 2.3: Blueprint Viewer with Overlay

```bash
# Create PDF viewer component
cat > src/components/blueprint/BlueprintViewer.tsx << 'EOF'
import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Room } from '../../types';

// Set worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface BlueprintViewerProps {
  fileUrl: string;
  rooms: Room[];
  selectedRoom: string | null;
  onRoomSelect: (roomId: string) => void;
  scale: number;
}

export const BlueprintViewer = ({ 
  fileUrl, 
  rooms, 
  selectedRoom, 
  onRoomSelect,
  scale 
}: BlueprintViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const loadPdf = async () => {
      if (!fileUrl) return;
      
      try {
        const pdf = await pdfjsLib.getDocument(fileUrl).promise;
        const page = await pdf.getPage(1);
        
        const viewport = page.getViewport({ scale: 1.5 });
        setPdfDimensions({ width: viewport.width, height: viewport.height });
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const context = canvas.getContext('2d');
        if (!context) return;
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({ canvasContext: context, viewport }).promise;
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };
    
    loadPdf();
  }, [fileUrl]);

  return (
    <div className="relative overflow-auto bg-gray-200 rounded-lg">
      <canvas
        ref={canvasRef}
        className="max-w-full"
        style={{ display: 'block' }}
      />
      
      {/* Room overlays */}
      <svg
        className="absolute top-0 left-0 pointer-events-none"
        width={pdfDimensions.width}
        height={pdfDimensions.height}
        viewBox={`0 0 ${pdfDimensions.width} ${pdfDimensions.height}`}
      >
        {rooms.map((room) => {
          const x = room.boundingBox.x * pdfDimensions.width;
          const y = room.boundingBox.y * pdfDimensions.height;
          const w = room.boundingBox.width * pdfDimensions.width;
          const h = room.boundingBox.height * pdfDimensions.height;
          const isSelected = selectedRoom === room.id;
          
          return (
            <g key={room.id}>
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill={isSelected ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.1)'}
                stroke={isSelected ? '#2563eb' : '#3b82f6'}
                strokeWidth={isSelected ? 3 : 2}
                className="pointer-events-auto cursor-pointer"
                onClick={() => onRoomSelect(room.id)}
              />
              <text
                x={x + 5}
                y={y + 20}
                fill={isSelected ? '#1d4ed8' : '#2563eb'}
                fontSize="14"
                fontWeight="bold"
                className="pointer-events-none"
              >
                {room.name}
              </text>
              <text
                x={x + 5}
                y={y + 38}
                fill="#4b5563"
                fontSize="12"
                className="pointer-events-none"
              >
                {room.dimensions.width.toFixed(1)}' × {room.dimensions.length.toFixed(1)}'
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
EOF
```

### Step 2.4: Scale Calibration Component

```bash
cat > src/components/blueprint/ScaleCalibrator.tsx << 'EOF'
import { useState } from 'react';

interface ScaleCalibratorProps {
  currentScale: string;
  onScaleChange: (scale: string) => void;
}

const COMMON_SCALES = [
  { label: '1/4" = 1\'', value: '1/4 inch = 1 foot' },
  { label: '1/8" = 1\'', value: '1/8 inch = 1 foot' },
  { label: '1/2" = 1\'', value: '1/2 inch = 1 foot' },
  { label: '1" = 1\'', value: '1 inch = 1 foot' },
  { label: '1:100', value: '1:100' },
  { label: '1:50', value: '1:50' },
];

export const ScaleCalibrator = ({ currentScale, onScaleChange }: ScaleCalibratorProps) => {
  const [customScale, setCustomScale] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-3">Blueprint Scale</h3>
      
      {!useCustom ? (
        <div className="space-y-2">
          <select
            value={currentScale}
            onChange={(e) => onScaleChange(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select scale...</option>
            {COMMON_SCALES.map((scale) => (
              <option key={scale.value} value={scale.value}>
                {scale.label}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setUseCustom(true)}
            className="text-sm text-primary-600 hover:underline"
          >
            Enter custom scale
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="e.g., 1/4 inch = 1 foot"
            value={customScale}
            onChange={(e) => setCustomScale(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                onScaleChange(customScale);
                setUseCustom(false);
              }}
              className="px-3 py-1 bg-primary-600 text-white rounded text-sm"
            >
              Apply
            </button>
            <button
              onClick={() => setUseCustom(false)}
              className="px-3 py-1 text-gray-600 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {currentScale && (
        <p className="mt-2 text-sm text-gray-600">
          Current: <strong>{currentScale}</strong>
        </p>
      )}
    </div>
  );
};
EOF
```

---

## Phase 3: Polish & Launch (Week 3)

### Step 3.1: Export Functionality

```bash
cat > src/services/export.ts << 'EOF'
import * as XLSX from 'xlsx';
import { Room } from '../types';

export const exportToCSV = (rooms: Room[], projectName: string): void => {
  const headers = ['Room Name', 'Width (ft)', 'Length (ft)', 'Height (ft)', 'Square Footage', 'Notes'];
  
  const rows = rooms.map(room => [
    room.name,
    room.dimensions.width.toFixed(2),
    room.dimensions.length.toFixed(2),
    room.dimensions.height?.toFixed(2) || '',
    room.squareFootage.toFixed(2),
    room.notes || ''
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${projectName}_measurements_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToExcel = (rooms: Room[], projectName: string): void => {
  const data = rooms.map(room => ({
    'Room Name': room.name,
    'Width (ft)': room.dimensions.width,
    'Length (ft)': room.dimensions.length,
    'Height (ft)': room.dimensions.height || '',
    'Square Footage': room.squareFootage,
    'Notes': room.notes || ''
  }));
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Measurements');
  
  XLSX.writeFile(wb, `${projectName}_measurements_${new Date().toISOString().split('T')[0]}.xlsx`);
};
EOF
```

### Step 3.2: Routing Setup

```bash
cat > src/App.tsx << 'EOF'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ProjectDetail } from './pages/ProjectDetail';
import { useAuth } from './hooks/useAuth';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex justify-center p-12">Loading...</div>;
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:id"
          element={
            <PrivateRoute>
              <ProjectDetail />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
EOF
```

### Step 3.3: Project Detail Page

```bash
cat > src/pages/ProjectDetail.tsx << 'EOF'
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileUp } from 'lucide-react';
import { useBlueprint } from '../hooks/useBlueprint';
import { useProject } from '../hooks/useProject';
import { FileUpload } from '../components/blueprint/FileUpload';
import { BlueprintViewer } from '../components/blueprint/BlueprintViewer';
import { ScaleCalibrator } from '../components/blueprint/ScaleCalibrator';
import { RoomEditor } from '../components/blueprint/RoomEditor';
import { analyzeBlueprint } from '../services/gemini';
import { exportToCSV, exportToExcel } from '../services/export';
import { Room } from '../types';

export const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, blueprints, updateBlueprint, loading } = useProject(id!);
  const { uploadBlueprint, uploading } = useBlueprint(id!);
  
  const [selectedBlueprint, setSelectedBlueprint] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [scale, setScale] = useState('1/4 inch = 1 foot');

  const currentBlueprint = blueprints.find(b => b.id === selectedBlueprint);

  const handleUpload = async (file: File) => {
    const blueprintId = await uploadBlueprint(file);
    setSelectedBlueprint(blueprintId);
  };

  const handleAnalyze = async () => {
    if (!currentBlueprint) return;
    
    setAnalyzing(true);
    try {
      const result = await analyzeBlueprint(currentBlueprint.fileUrl, scale);
      await updateBlueprint(currentBlueprint.id, {
        rooms: result.rooms,
        totalSquareFootage: result.totalSquareFootage,
        scale: { ratio: scale },
        analysisStatus: 'completed',
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again or enter measurements manually.');
    }
    setAnalyzing(false);
  };

  const handleExport = (format: 'csv' | 'excel') => {
    if (!currentBlueprint || !project) return;
    
    if (format === 'csv') {
      exportToCSV(currentBlueprint.rooms, project.name);
    } else {
      exportToExcel(currentBlueprint.rooms, project.name);
    }
  };

  if (loading) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-bold">{project?.name}</h1>
            </div>
            
            {currentBlueprint && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('csv')}
                  className="flex items-center gap-2 px-4 py-2 bg-white border rounded hover:bg-gray-50"
                >
                  <Download size={16} />
                  CSV
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="flex items-center gap-2 px-4 py-2 bg-white border rounded hover:bg-gray-50"
                >
                  <Download size={16} />
                  Excel
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3">Blueprints</h3>
              
              <FileUpload onUpload={handleUpload} uploading={uploading} />
              
              <div className="mt-4 space-y-2">
                {blueprints.map((bp) => (
                  <button
                    key={bp.id}
                    onClick={() => setSelectedBlueprint(bp.id)}
                    className={`w-full text-left p-3 rounded border transition ${
                      selectedBlueprint === bp.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileUp size={16} className="text-gray-400" />
                      <span className="truncate">{bp.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {bp.analysisStatus === 'completed' 
                        ? `${bp.rooms.length} rooms detected`
                        : 'Not analyzed'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            
            {currentBlueprint && (
              <ScaleCalibrator
                currentScale={scale}
                onScaleChange={setScale}
              />
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {currentBlueprint ? (
              <>
                {currentBlueprint.analysisStatus !== 'completed' && (
                  <div className="bg-white rounded-lg shadow p-4">
                    <button
                      onClick={handleAnalyze}
                      disabled={analyzing}
                      className="w-full py-3 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50"
                    >
                      {analyzing ? 'Analyzing...' : 'Analyze Blueprint with AI'}
                    </button>
                  </div>
                )}

                <div className="bg-white rounded-lg shadow">
                  <BlueprintViewer
                    fileUrl={currentBlueprint.fileUrl}
                    rooms={currentBlueprint.rooms}
                    selectedRoom={selectedRoom}
                    onRoomSelect={setSelectedRoom}
                    scale={1}
                  />
                </div>

                {currentBlueprint.rooms.length > 0 && (
                  <RoomEditor
                    rooms={currentBlueprint.rooms}
                    selectedRoom={selectedRoom}
                    onRoomSelect={setSelectedRoom}
                    onUpdateRoom={(updatedRoom) => {
                      const updatedRooms = currentBlueprint.rooms.map(r =>
                        r.id === updatedRoom.id ? updatedRoom : r
                      );
                      updateBlueprint(currentBlueprint.id, { rooms: updatedRooms });
                    }}
                  />
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
                <FileUp size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Upload a blueprint to get started</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
EOF
```

### Step 3.4: Firebase Deployment

```bash
# Update firebase.json
cat > firebase.json << 'EOF'
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{
      "source": "**",
      "destination": "/index.html"
    }]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
EOF

# Create Firestore rules
cat > firestore.rules << 'EOF'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/projects/$(projectId)).data.userId == request.auth.uid;
      match /blueprints/{blueprintId} {
        allow read, write: if request.auth != null && 
          get(/databases/$(database)/documents/projects/$(projectId)).data.userId == request.auth.uid;
      }
    }
  }
}
EOF

# Create storage rules
cat > storage.rules << 'EOF'
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /projects/{projectId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
        get(/databases/(default)/documents/projects/$(projectId)).data.userId == request.auth.uid;
    }
  }
}
EOF

# Build and deploy
npm run build
firebase deploy
```

---

## Testing Checklist

### Unit Tests
```bash
# Install testing libraries
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Run tests
npm run test
```

### Manual Testing

| Feature | Test Case | Expected Result | Status |
|---------|-----------|-----------------|--------|
| Auth | Register new account | Account created, email sent | [ ] |
| Auth | Login with valid credentials | Redirect to dashboard | [ ] |
| Auth | Login with invalid credentials | Error message shown | [ ] |
| Projects | Create new project | Project appears in list | [ ] |
| Projects | Delete project | Project removed | [ ] |
| Upload | Upload PDF blueprint | File uploads, progress shown | [ ] |
| Upload | Upload invalid file type | Error message shown | [ ] |
| Analysis | Analyze blueprint | Rooms detected within 30s | [ ] |
| Analysis | Rooms displayed | Overlay shows on PDF | [ ] |
| Measurements | Edit room dimensions | Calculations update | [ ] |
| Export | Export to CSV | File downloads correctly | [ ] |
| Export | Export to Excel | File downloads correctly | [ ] |
| Mobile | Test on mobile device | Layout responsive | [ ] |

### E2E Tests
```bash
# Install Playwright
npm install -D @playwright/test
npx playwright install

# Run E2E tests
npx playwright test
```

---

## Launch Checklist

### Pre-Launch
- [ ] All environment variables set in production
- [ ] Firebase billing enabled
- [ ] Gemini API key has sufficient quota
- [ ] Firestore indexes created
- [ ] Storage rules tested
- [ ] Domain configured (if custom domain)
- [ ] SSL certificate active

### Launch Day
- [ ] Deploy to Firebase Hosting
- [ ] Verify all routes work
- [ ] Test file upload/analysis flow
- [ ] Send launch email to beta users
- [ ] Monitor error logs

### Post-Launch
- [ ] Set up analytics (Google Analytics)
- [ ] Configure error tracking (Sentry)
- [ ] Create support email/channel
- [ ] Monitor Firebase usage/costs
- [ ] Collect user feedback

---

**Ready to build! Start with Phase 1, Step 1.1**
