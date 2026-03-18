# Civic Insight Engine 🛰️
### AI-Powered Transparency Dashboard for Ashtabula County

The **Civic Insight Engine** is a demonstrative MVP designed to solve a critical gap in local government: the disconnect between dense public records and accessible community knowledge. Using advanced AI (Gemini 2.5 Flash), this platform transforms township meeting minutes into clear, actionable summaries for every citizen.

---

## 🚀 Key Features

- **AI Meeting Summarizer:** Upload PDF minutes or paste text to generate instant, structured summaries (Bullets, Action Items, Narrative Overviews).
- **Public Dashboard:** A central hub for residents to browse the latest decisions, search by topic, and see what's happening in their township.
- **311 Issue Reporting:** A map-integrated reporting system for roads, utilities, and safety concerns with real-time status tracking.
- **Property & Parcel Lookup:** Quick access to county auditor data and local permit records.
- **Budget Explorer:** Visual transparency for tax dollars, integrated with Ohio Checkbook concepts.
- **Admin Control Center:** A dedicated portal for township clerks to manage summaries and the community issue queue.

---

## 🛠️ Technology Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **State Management:** Zustand (with Persistence)
- **AI Engine:** Google Gemini 2.5 Flash (`@google/genai`)
- **Maps:** Leaflet.js + OpenStreetMap
- **Icons:** Lucide-React
- **Animations:** Tailwind Animate

---

## 🚦 Getting Started

### 1. Prerequisites
- Node.js v18+
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 2. Installation
```bash
npm install
```

### 3. Configuration
Create a `.env` file in the root directory:
```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 📂 Project Structure

- `/src/pages`: Main application routes (Dashboard, Admin, Report Issue, etc.)
- `/src/store`: Central state management with persistence logic.
- `/src/lib/gemini.js`: Specialized AI prompt engineering and API integration.
- `/src/components`: Reusable UI components including maps and layout.

---

## 📈 Roadmap (Future Polish)

- **Real Firebase Integration:** Migrate from local state to Firestore/Storage.
- **Email Notifications:** Automatic alerts for new summaries or issue status changes.
- **Improved PDF OCR:** Enhanced server-side parsing for multi-page document extraction.
- **Multi-Township Scaling:** Support for multiple townships across the county with shared code.
- **Mobile Home Screen:** Full home screen installation support.

---

**Developed as part of the New Ashtabula Initiative.**  
*Empowering citizens through transparent data.*
