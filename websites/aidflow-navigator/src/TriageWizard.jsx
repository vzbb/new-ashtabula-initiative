import { useState, useCallback, useEffect, useRef } from "react";
import "./TriageWizard.css";

/* ── Inline SVG icons from the NAI Creative spec ── */

function IconFood() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" className="tw-icon">
      <defs>
        <linearGradient id="food-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34D399"/>
          <stop offset="100%" stopColor="#059669"/>
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="none" stroke="url(#food-grad)" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="7.5" fill="none" stroke="url(#food-grad)" strokeWidth="1.2" opacity="0.5"/>
      <path d="M 8 2 L 8 10 M 6 3 L 6 7 M 10 3 L 10 7"
            stroke="url(#food-grad)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M 8 10 L 8 14" stroke="url(#food-grad)" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M 16 2 L 16 14" stroke="url(#food-grad)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M 14 10 Q 16 8 18 10 L 18 14 L 14 14 Z"
            fill="url(#food-grad)" stroke="none" opacity="0.85"/>
      <rect x="14.2" y="14" width="3.6" height="4" rx="1"
            fill="url(#food-grad)" opacity="0.7"/>
    </svg>
  );
}

function IconUtilities() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" className="tw-icon">
      <defs>
        <linearGradient id="util-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBBF24"/>
          <stop offset="100%" stopColor="#F59E0B"/>
        </linearGradient>
      </defs>
      <path d="M 13.5 2 L 9 12 L 12.5 12 L 10.5 22 L 17 10 L 13 10 L 15.5 2 Z"
            fill="url(#util-grad)" stroke="none"/>
      <circle cx="13" cy="12" r="9.5" fill="none" stroke="url(#util-grad)" strokeWidth="0.6" opacity="0.3"/>
    </svg>
  );
}

function IconHealth() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" className="tw-icon">
      <defs>
        <linearGradient id="health-grad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#60A5FA"/>
          <stop offset="100%" stopColor="#2563EB"/>
        </linearGradient>
      </defs>
      <rect x="9" y="3" width="6" height="18" rx="1.2" fill="url(#health-grad)"/>
      <rect x="3" y="9" width="18" height="6" rx="1.2" fill="url(#health-grad)"/>
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="url(#health-grad)" strokeWidth="0.5" opacity="0.2"/>
    </svg>
  );
}

function IconHousing() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" className="tw-icon">
      <defs>
        <linearGradient id="house-grad" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#A78BFA"/>
          <stop offset="100%" stopColor="#7C3AED"/>
        </linearGradient>
      </defs>
      <polygon points="2,10 12,2 22,10" fill="url(#house-grad)" stroke="none"/>
      <rect x="15" y="3" width="3" height="4" rx="0.6" fill="url(#house-grad)" opacity="0.7"/>
      <rect x="4" y="10" width="16" height="12" rx="1" fill="url(#house-grad)" opacity="0.85"/>
      <rect x="9.5" y="14" width="5" height="8" rx="0.8" fill="#1E1B4B" opacity="0.3"/>
      <rect x="10.5" y="15" width="3" height="6" rx="0.5" fill="#FFF" opacity="0.15"/>
      <circle cx="13" cy="18" r="0.6" fill="#FFF" opacity="0.4"/>
      <rect x="5.5" y="11.5" width="3" height="3" rx="0.4" fill="#FFF" opacity="0.25"/>
      <line x1="7" y1="11.5" x2="7" y2="14.5" stroke="#FFF" strokeWidth="0.4" opacity="0.3"/>
      <line x1="5.5" y1="13" x2="8.5" y2="13" stroke="#FFF" strokeWidth="0.4" opacity="0.3"/>
    </svg>
  );
}

/* ── Category config with colors from spec ── */

const CATEGORIES = [
  {
    id: "food",
    label: "Food and groceries",
    intro: "Support with grocery costs, infant nutrition, or pantry referrals.",
    Icon: IconFood,
    primary: "#10B981",
    light: "#34D399",
    dark: "#059669",
    bgTint: "#ECFDF5",
    dot: "var(--tw-dot-food)",
  },
  {
    id: "utilities",
    label: "Utility bills and heating costs",
    intro: "Help with winter heating, electric bills, and payment plans.",
    Icon: IconUtilities,
    primary: "#F59E0B",
    light: "#FBBF24",
    dark: "#D97706",
    bgTint: "#FFFBEB",
    dot: "var(--tw-dot-util)",
  },
  {
    id: "health",
    label: "Health coverage and care",
    intro: "Coverage for doctor visits, prescriptions, and ongoing care.",
    Icon: IconHealth,
    primary: "#3B82F6",
    light: "#60A5FA",
    dark: "#2563EB",
    bgTint: "#EFF6FF",
    dot: "var(--tw-dot-health)",
  },
  {
    id: "housing",
    label: "Housing and rent support",
    intro: "Rental assistance, shelter referrals, and housing stabilization.",
    Icon: IconHousing,
    primary: "#8B5CF6",
    light: "#A78BFA",
    dark: "#7C3AED",
    bgTint: "#F5F3FF",
    dot: "var(--tw-dot-house)",
  },
];

const STEPS = [
  { key: "category", title: "Category", label: "What kind of help?" },
  { key: "household", title: "Household", label: "Who needs help?" },
  { key: "urgency", title: "Urgency", label: "How soon?" },
  { key: "contact", title: "Contact", label: "Follow-up" },
];

const HOUSEHOLD_OPTIONS = [
  { value: "adult", label: "An adult or individual", icon: "👤" },
  { value: "family", label: "A family with children", icon: "👨‍👩‍👧‍👦" },
  { value: "senior", label: "An older adult or caregiver", icon: "👴" },
];

const URGENCY_OPTIONS = [
  { value: "soon", label: "I need help soon", icon: "📅", desc: "Within the next few days or weeks" },
  { value: "urgent", label: "It feels urgent today", icon: "🔴", desc: "I need help right now" },
  { value: "planning", label: "I am planning ahead", icon: "📋", desc: "Exploring options for the future" },
];

const CONTACT_OPTIONS = [
  { value: "phone", label: "Phone", icon: "📞", desc: "Best for urgent or complex situations" },
  { value: "text", label: "Text message", icon: "💬", desc: "Great for simple questions and quick handoff" },
  { value: "email", label: "Email", icon: "📧", desc: "Good for written next steps and checklists" },
];

/* ── Progress dots ── */

function ProgressDots({ current, onGoTo }) {
  return (
    <nav className="tw-progress" aria-label="Triage steps">
      {STEPS.map((step, i) => (
        <button
          key={step.key}
          type="button"
          className={`tw-dot${i <= current ? " active" : ""}`}
          onClick={() => i < current && onGoTo(i)}
          disabled={i > current}
          aria-current={i === current ? "step" : undefined}
          aria-label={`Step ${i + 1}: ${step.label}${i < current ? " (completed)" : ""}`}
        >
          <span className="tw-dot-circle">
            {i < current ? (
              <svg viewBox="0 0 16 16" aria-hidden="true" className="tw-dot-check" width="12" height="12">
                <path d="M3 8l3 3 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <span className="tw-dot-num">{i + 1}</span>
            )}
          </span>
          <span className="tw-dot-label">{step.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ── Step panel wrapper with transition ── */

function StepPanel({ children, isActive }) {
  return (
    <div
      className={`tw-panel${isActive ? " tw-panel-enter" : " tw-panel-exit"}`}
      aria-hidden={!isActive}
    >
      {children}
    </div>
  );
}

/* ── Need cards grid ── */

function NeedsStep({ selectedNeed, onSelect }) {
  return (
    <div className="tw-step-content" role="radiogroup" aria-label="Select a category of help">
      <p className="tw-step-intro">Choose the type of help you need — we'll guide you through the next steps.</p>
      <div className="tw-cards-grid">
        {CATEGORIES.map((cat) => {
          const isSelected = cat.id === selectedNeed;
          return (
            <button
              key={cat.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`tw-card tw-card-${cat.id}${isSelected ? " selected" : ""}`}
              onClick={() => onSelect(cat.id)}
              style={{
                "--card-primary": cat.primary,
                "--card-light": cat.light,
                "--card-dark": cat.dark,
                "--card-bg": cat.bgTint,
                "--card-ring": isSelected ? `${cat.primary}40` : "transparent",
              }}
            >
              <span className="tw-card-icon-wrap">
                <cat.Icon />
              </span>
              <strong className="tw-card-label">{cat.label}</strong>
              <span className="tw-card-desc">{cat.intro}</span>
              <span className="tw-card-check" aria-hidden="true">
                <svg viewBox="0 0 16 16" width="14" height="14">
                  <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  {isSelected && (
                    <path d="M4.5 8l2.5 2.5 4.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  )}
                </svg>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Option selector (reusable for household, urgency, contact) ── */

function OptionCards({ options, value, onChange, name, desc }) {
  return (
    <div className="tw-step-content" role="radiogroup" aria-label={name}>
      {desc && <p className="tw-step-intro">{desc}</p>}
      <div className="tw-options-grid">
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`tw-option-card${isSelected ? " selected" : ""}`}
              onClick={() => onChange(opt.value)}
            >
              <span className="tw-option-icon" aria-hidden="true">{opt.icon}</span>
              <span className="tw-option-body">
                <strong className="tw-option-label">{opt.label}</strong>
                {opt.desc && <span className="tw-option-desc">{opt.desc}</span>}
              </span>
              <span className="tw-option-check" aria-hidden="true">
                {isSelected && (
                  <svg viewBox="0 0 16 16" width="14" height="14">
                    <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.15"/>
                    <path d="M4.5 8l2.5 2.5 4.5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Summary / results step ── */

function SummaryStep({ need, household, urgency, contactMode, onRestart }) {
  const selectedCat = CATEGORIES.find((c) => c.id === need);
  const householdLabel = HOUSEHOLD_OPTIONS.find((o) => o.value === household)?.label ?? household;
  const urgencyLabel = URGENCY_OPTIONS.find((o) => o.value === urgency)?.label ?? urgency;
  const contactLabel = CONTACT_OPTIONS.find((o) => o.value === contactMode)?.label ?? contactMode;

  const openingMessage =
    urgency === "urgent"
      ? "Your best next step is to connect with a live 211 operator now so they can triage urgent local options."
      : household === "family"
        ? "Start with family-focused benefit programs, then keep 211 ready for local follow-through and referrals."
        : household === "senior"
          ? "Focus on health, utility, and housing stability programs first, then use 211 for a guided handoff."
          : "A short self-service path can narrow your next step before you call, text, or email 211 Ashtabula County.";

  const intakeHint =
    contactMode === "text"
      ? "Text-first follow-up works best for simple questions and quick resource handoff."
      : contactMode === "email"
        ? "Email follow-up is useful when you need a written list of next steps and documents."
        : "Phone support is best when your situation is urgent, confusing, or involves multiple needs.";

  return (
    <div className="tw-step-content">
      <div className="tw-summary">
        <div className="tw-summary-badge" style={{ "--badge-color": selectedCat?.primary, "--badge-bg": selectedCat?.bgTint }}>
          <selectedCat.Icon />
          <span>{selectedCat?.label}</span>
        </div>

        <div className="tw-summary-choices" role="list" aria-label="Your selections">
          {[
            { label: "Household", value: householdLabel, icon: "👤" },
            { label: "Urgency", value: urgencyLabel, icon: urgency === "urgent" ? "🔴" : "📅" },
            { label: "Contact", value: contactLabel, icon: "📞" },
          ].map((item) => (
            <div key={item.label} className="tw-summary-chip" role="listitem">
              <span aria-hidden="true">{item.icon}</span>
              <span>{item.label}: <strong>{item.value}</strong></span>
            </div>
          ))}
        </div>

        <div className="tw-summary-message">
          <strong>Recommended starting point:</strong>
          <p>{openingMessage}</p>
        </div>

        <div className="tw-summary-hint">
          <p>{intakeHint}</p>
        </div>
      </div>

      <div className="tw-summary-actions">
        <button type="button" className="tw-btn tw-btn-secondary" onClick={onRestart}>
          Start over
        </button>
      </div>
    </div>
  );
}

/* ── Main Wizard ── */

export default function TriageWizard({ selectedNeed, household, urgency, contactMode, onChange }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState("forward");
  const panelRef = useRef(null);

  const handleNeedChange = useCallback((id) => {
    onChange("selectedNeed", id);
    setDirection("forward");
    setStep(1);
  }, [onChange]);

  const handleHouseholdChange = useCallback((val) => {
    onChange("household", val);
    setDirection("forward");
    setStep(2);
  }, [onChange]);

  const handleUrgencyChange = useCallback((val) => {
    onChange("urgency", val);
    setDirection("forward");
    setStep(3);
  }, [onChange]);

  const handleContactChange = useCallback((val) => {
    onChange("contactMode", val);
    setDirection("forward");
    setStep(4);
  }, [onChange]);

  const handleBack = useCallback(() => {
    if (step > 0) {
      setDirection("back");
      setStep((s) => s - 1);
    }
  }, [step]);

  const handleGoTo = useCallback((target) => {
    setDirection(target < step ? "back" : "forward");
    setStep(target);
  }, [step]);

  const handleRestart = useCallback(() => {
    setDirection("back");
    setStep(0);
  }, []);

  /* Focus management after step transitions */
  useEffect(() => {
    if (panelRef.current) {
      const heading = panelRef.current.querySelector("h3, [role=radiogroup], .tw-step-content");
      if (heading) heading.focus({ preventScroll: false });
      else panelRef.current.focus({ preventScroll: false });
    }
  }, [step]);

  return (
    <div className="triage-wizard" role="region" aria-label="Benefit triage wizard">
      <div className="tw-header">
        <p className="tw-eyebrow">Quick triage</p>
        <h3 id="tw-heading">Start with the kind of help you need</h3>
      </div>

      <ProgressDots current={step} onGoTo={handleGoTo} />

      <div className="tw-stage" ref={panelRef} tabIndex={-1} aria-labelledby="tw-heading">

        {step === 4 ? (
          <StepPanel isActive={true}>
            <SummaryStep
              need={selectedNeed}
              household={household}
              urgency={urgency}
              contactMode={contactMode}
              onRestart={handleRestart}
            />
          </StepPanel>
        ) : (
          <>
            <StepPanel isActive={step === 0}>
              {step === 0 && (
                <NeedsStep selectedNeed={selectedNeed} onSelect={handleNeedChange} />
              )}
            </StepPanel>

            <StepPanel isActive={step === 1}>
              {step === 1 && (
                <OptionCards
                  options={HOUSEHOLD_OPTIONS}
                  value={household}
                  onChange={handleHouseholdChange}
                  name="Who are you seeking help for?"
                  desc="This helps us recommend the right benefit pathways for your situation."
                />
              )}
            </StepPanel>

            <StepPanel isActive={step === 2}>
              {step === 2 && (
                <OptionCards
                  options={URGENCY_OPTIONS}
                  value={urgency}
                  onChange={handleUrgencyChange}
                  name="How urgent is the situation?"
                  desc="Your answer helps determine whether to start with self-service or connect with a live operator."
                />
              )}
            </StepPanel>

            <StepPanel isActive={step === 3}>
              {step === 3 && (
                <OptionCards
                  options={CONTACT_OPTIONS}
                  value={contactMode}
                  onChange={handleContactChange}
                  name="Preferred follow-up method"
                  desc="How would you like 211 to follow up with you?"
                />
              )}
            </StepPanel>
          </>
        )}

        {step > 0 && step < 4 && (
          <div className="tw-nav">
            <button type="button" className="tw-btn tw-btn-back" onClick={handleBack}>
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
