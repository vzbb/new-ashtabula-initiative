import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

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
    if (source_lower.includes('zoning') || source_lower.includes('code')) {
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
    <div className={`mt-3 p-3 rounded-lg border ${colorClasses[style.color]} text-sm`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText size={14} className="shrink-0" />
          <span className="font-semibold">{citation.source}</span>
          {citation.section && (
            <span className="text-xs opacity-75">· {citation.section}</span>
          )}
          {citation.page && (
            <span className="text-xs opacity-75">· Page {citation.page}</span>
          )}
        </div>
        {citation.quote && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-black/5 rounded transition-colors"
            title={expanded ? "Show less" : "Show more"}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>
      
      {citation.quote && expanded && (
        <div className="mt-2 pt-2 border-t border-black/10">
          <p className="text-xs italic opacity-90 leading-relaxed">
            "{citation.quote}"
          </p>
        </div>
      )}
      
      {citation.url && (
        <a 
          href={citation.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium 
                     hover:underline opacity-75 hover:opacity-100 transition-opacity"
        >
          View Source <ExternalLink size={10} />
        </a>
      )}
    </div>
  );
}

export function CitationsList({ citations }) {
  if (!citations || citations.length === 0) return null;
  
  return (
    <div className="mt-4 space-y-2">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        Sources ({citations.length})
      </p>
      {citations.map((citation, idx) => (
        <CitationCard key={idx} citation={citation} />
      ))}
    </div>
  );
}
