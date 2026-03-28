import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, ExternalLink, MapPinned } from 'lucide-react';

export function CitationCard({ citation }) {
  const [expanded, setExpanded] = useState(false);
  
  // Determine document type icon/color
  const getDocStyle = (source) => {
    const source_lower = source.toLowerCase();
    if (source_lower.includes('historic')) {
      return { color: 'amber', label: 'Historic District Guide' };
    }
    if (source_lower.includes('welcome') || source_lower.includes('city')) {
      return { color: 'blue', label: 'City Information' };
    }
    if (source_lower.includes('saybrook-zoning') || source_lower.includes('code')) {
      return { color: 'emerald', label: 'Zoning Code' };
    }
    return { color: 'slate', label: 'Document' };
  };
  
  const style = getDocStyle(citation.source);
  const colorClasses = {
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    slate: 'bg-slate-50 border-slate-200 text-slate-800'
  };
  
  return (
    <div className={`saybrook-citation-card mt-3 rounded-2xl border px-4 py-3 text-sm ${colorClasses[style.color]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-white/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em]">
              <MapPinned size={10} />
              {style.label}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800">
              <FileText size={14} className="shrink-0" />
              <span className="truncate">{citation.source}</span>
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            {citation.section && <span>{citation.section}</span>}
            {citation.page && <span>Page {citation.page}</span>}
          </div>
        </div>
        {citation.quote && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-full border border-black/10 bg-white/70 p-1.5 text-slate-600 transition-colors hover:bg-white"
            title={expanded ? "Show less" : "Show more"}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>

      {citation.quote && expanded && (
        <div className="mt-3 border-t border-black/10 pt-3">
          <p className="text-xs leading-relaxed italic text-slate-700">
            "{citation.quote}"
          </p>
        </div>
      )}

      {citation.url && (
        <a
          href={citation.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[color:var(--color-ashtabula-primary)] transition-opacity hover:opacity-80"
        >
          View source <ExternalLink size={10} />
        </a>
      )}
    </div>
  );
}

export function CitationsList({ citations }) {
  if (!citations || citations.length === 0) return null;
  
  return (
    <div className="mt-4 space-y-2">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
        Sources ({citations.length})
      </p>
      {citations.map((citation, idx) => (
        <CitationCard key={idx} citation={citation} />
      ))}
    </div>
  );
}
