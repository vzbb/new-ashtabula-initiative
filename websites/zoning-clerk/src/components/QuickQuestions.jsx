import React from 'react';
import { HelpCircle, Phone, Home, FileText } from 'lucide-react';

const QUICK_QUESTIONS = [
  { 
    id: 'shed', 
    label: 'Shed Permit?', 
    query: 'Do I need a permit for a shed in Ashtabula?',
    icon: Home
  },
  { 
    id: 'historic', 
    label: 'Historic District', 
    query: 'What is the Historic District review process?',
    icon: FileText
  },
  { 
    id: 'contact', 
    label: 'Contact PCD', 
    query: 'How do I contact the Planning and Community Development office?',
    icon: Phone
  },
  { 
    id: 'deck', 
    label: 'Deck Permit?', 
    query: 'What permits do I need to build a deck?',
    icon: HelpCircle
  }
];

export function QuickQuestions({ onSelect, disabled = false }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
        Quick Questions
      </p>
      <div className="flex flex-wrap gap-2">
        {QUICK_QUESTIONS.map((q) => {
          const Icon = q.icon;
          return (
            <button
              key={q.id}
              onClick={() => onSelect(q.query)}
              disabled={disabled}
              className="flex items-center gap-2 px-4 py-2 bg-ashtabula-bg hover:bg-ashtabula-secondary/10 
                         text-ashtabula-primary rounded-full text-sm font-medium
                         transition-all border border-slate-100 hover:border-ashtabula-secondary/30
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon size={14} className="text-ashtabula-secondary" />
              {q.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
