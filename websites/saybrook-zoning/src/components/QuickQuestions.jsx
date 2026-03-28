import React from 'react';
import { HelpCircle, Phone, Home, FileText, Send } from 'lucide-react';

const QUICK_QUESTIONS = [
  { 
    id: 'shed', 
    label: 'Shed Permit Requirement', 
    query: 'What are the zoning permit requirements for a shed in Saybrook Township?',
    icon: Home
  },
  { 
    id: 'setbacks', 
    label: 'Setback Regulations', 
    query: 'Provide setback requirements for residential properties in Saybrook Township.',
    icon: FileText
  },
  {
    id: 'formalize',
    label: 'Submit Formal Inquiry',
    query: 'Initiate the process to submit a formal zoning inquiry to Saybrook Township.',
    icon: Send,
  },
  { 
    id: 'contact', 
    label: 'Official Contact Information', 
    query: 'Provide official contact details for the Saybrook Township Zoning Office.',
    icon: Phone
  },
  { 
    id: 'deck', 
    label: 'Residential Additions', 
    query: 'Review zoning regulations applicable to decks and residential home additions in Saybrook Township.',
    icon: HelpCircle
  }
];

export function QuickQuestions({ onSelect, disabled = false }) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-[0.65rem] font-black uppercase tracking-[0.28em] text-slate-900">
        Standard Inquiries
      </p>
      <div className="flex flex-wrap gap-2">
        {QUICK_QUESTIONS.map((q) => {
          const Icon = q.icon;
          return (
            <button
              key={q.id}
              onClick={() => onSelect(q.query)}
              disabled={disabled}
              className="group inline-flex items-center gap-2 rounded-full border border-saybrook-forest/15 bg-white/75 px-3.5 py-2 text-[0.82rem] font-bold text-saybrook-forest shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-saybrook-clay/40 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon size={14} className="text-saybrook-lake transition-transform group-hover:scale-110" />
              {q.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
