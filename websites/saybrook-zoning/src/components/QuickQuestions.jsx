import React from 'react';
import { HelpCircle, Phone, Home, FileText, Send } from 'lucide-react';

const QUICK_QUESTIONS = [
  { 
    id: 'shed', 
    label: 'Shed Permit?', 
    query: 'Do I need a zoning permit for a shed in Saybrook Township?',
    icon: Home
  },
  { 
    id: 'setbacks', 
    label: 'Setback Rules', 
    query: 'Where should I look for setback requirements in the Saybrook Township zoning code?',
    icon: FileText
  },
  {
    id: 'formalize',
    label: 'Formal Request',
    query: 'Help me turn my Saybrook zoning question into a formal township request.',
    icon: Send,
  },
  { 
    id: 'contact', 
    label: 'Township Contact', 
    query: 'How should residents contact the Saybrook Township Zoning Office for official guidance?',
    icon: Phone
  },
  { 
    id: 'deck', 
    label: 'Deck / Addition', 
    query: 'What zoning topics should I review before building a deck or home addition in Saybrook Township?',
    icon: HelpCircle
  }
];

export function QuickQuestions({ onSelect, disabled = false }) {
  return (
    <div className="mb-4">
      <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-slate-500/80">
        Quick prompts
      </p>
      <div className="flex flex-wrap gap-2">
        {QUICK_QUESTIONS.map((q) => {
          const Icon = q.icon;
          return (
            <button
              key={q.id}
              onClick={() => onSelect(q.query)}
              disabled={disabled}
              className="group inline-flex items-center gap-2 rounded-full border border-[color:rgba(23,54,45,0.1)] bg-white/65 px-3.5 py-2 text-[0.82rem] font-semibold text-[color:var(--color-ashtabula-primary)] shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-[color:rgba(184,138,94,0.28)] hover:bg-[color:rgba(255,255,255,0.9)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon size={14} className="text-[color:var(--color-ashtabula-secondary)] transition-transform group-hover:scale-110" />
              {q.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
