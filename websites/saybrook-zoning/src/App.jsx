import { ChatAssistant } from "./pages/ChatAssistant.jsx";
import { TrusteeQueue } from "./pages/TrusteeQueue.jsx";
import { CivicSidebar } from "./components/CivicSidebar.jsx";
import "./App.css";

function getViewMode() {
  if (typeof window === "undefined") return "public";

  const params = new URLSearchParams(window.location.search);
  const view = (params.get("view") || params.get("mode") || "").toLowerCase();
  const hash = window.location.hash.replace("#", "").toLowerCase();
  const pathname = window.location.pathname.toLowerCase();

  if (["trustees", "trustee", "queue", "internal", "ops"].includes(view)) {
    return "trustees";
  }
  if (["trustees", "trustee", "queue", "internal", "ops"].includes(hash)) {
    return "trustees";
  }
  if (pathname.includes("trustee") || pathname.includes("queue")) {
    return "trustees";
  }

  return "public";
}

function App() {
  const viewMode = getViewMode();

  if (viewMode === "trustees") {
    return <TrusteeQueue />;
  }

  return (
    <div className="saybrook-app flex flex-col lg:flex-row h-screen overflow-hidden">
      <CivicSidebar />
      
      <main className="flex-1 relative flex flex-col min-w-0 overflow-y-auto">
        {/* Top decorative bar */}
        <div className="h-1 bg-saybrook-forest shrink-0" />
        
        <div className="saybrook-main-container flex-1 flex flex-col p-4 md:p-8 lg:p-12">
          <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
            <ChatAssistant />
          </div>
          
          <footer className="mt-8 text-center text-[10px] uppercase tracking-[0.2em] text-saybrook-ink/40 font-bold pb-4">
            Saybrook Township Zoning Workstation • Official Resident Service
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
