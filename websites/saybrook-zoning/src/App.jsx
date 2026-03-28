import { ShieldCheck, MessageSquareText } from "lucide-react";
import { ChatAssistant } from "./pages/ChatAssistant.jsx";
import { TrusteeQueue } from "./pages/TrusteeQueue.jsx";
import "./App.css";

const ASSET_BASE = import.meta.env.BASE_URL || "/";
const saybrookSeal = `${ASSET_BASE}saybrook-seal.png`;

const intakeSteps = [
  { label: "1", title: "Ask", copy: "Start with zoning Q&A." },
  { label: "2", title: "Attach", copy: "Optionally add 1-2 reference images." },
  { label: "3", title: "Prepare", copy: "Convert the answer into a ready-to-send request." },
  { label: "4", title: "Submit", copy: "Send it straight to the township queue." },
];

const trustNotes = [
  { label: "Service", value: "Saybrook Township zoning intake" },
  { label: "Answer style", value: "Cited, compact, plain English" },
  { label: "Handoff", value: "Township-ready request queue" },
];

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
    <div className="saybrook-app">
      <header className="saybrook-header">
        <div className="saybrook-shell">
          <div className="saybrook-topline">
            <span>Saybrook Township zoning service</span>
            <span>Resident questions, citations, and request handoff</span>
          </div>
        </div>
      </header>

      <main className="saybrook-shell saybrook-main">
        <ChatAssistant />

        <section className="saybrook-intro-panel saybrook-context-strip">
          <div className="saybrook-intro-copy">
            <p className="saybrook-eyebrow">Saybrook Township zoning clerk</p>
            <h1 className="saybrook-hero-title saybrook-hero-title-small">
              Ask the zoning question. Get the rule. Send the request.
            </h1>
            <p className="saybrook-hero-copytext">
              Ask in plain English, review the cited code section, and if needed turn the answer
              into a request for the township queue.
            </p>

            <div className="saybrook-badge-row">
              <span className="saybrook-pill">
                <ShieldCheck size={14} />
                Live zoning answers
              </span>
              <span className="saybrook-pill">Optional image context</span>
              <span className="saybrook-pill">
                <MessageSquareText size={14} />
                Queue handoff ready
              </span>
            </div>

            <div className="saybrook-trust-row">
              {trustNotes.map((note) => (
                <div key={note.label} className="saybrook-trust-card">
                  <span className="saybrook-trust-label">{note.label}</span>
                  <span className="saybrook-trust-value">{note.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="saybrook-intro-seal-card" aria-hidden="true">
            <div className="saybrook-intro-seal-frame">
              <img className="saybrook-intro-seal" src={saybrookSeal} alt="" />
            </div>
            <p className="saybrook-intro-seal-note">Official township mark</p>
          </div>
        </section>

        <div className="saybrook-step-grid">
          {intakeSteps.map((step) => (
            <div key={step.label} className="saybrook-step-card">
              <span className="saybrook-step-badge">{step.label}</span>
              <div className="saybrook-step-copy">
                <p className="saybrook-step-title">{step.title}</p>
                <p className="saybrook-step-text">{step.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
