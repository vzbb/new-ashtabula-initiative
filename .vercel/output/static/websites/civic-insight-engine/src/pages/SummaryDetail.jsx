import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Calendar, Tag, CheckCircle2, ChevronLeft, Printer, Share2, Download, MapPin } from 'lucide-react';

export default function SummaryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const summary = useAppStore(state => state.summaries.find(s => s.id === id));

  if (!summary) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Summary not found</h2>
        <p className="mt-2 text-gray-600">The meeting summary you are looking for does not exist or has been removed.</p>
        <Link to="/" className="mt-6 inline-flex items-center text-blue-600 hover:underline">
          <ChevronLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition font-medium"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex gap-3">
          <button className="p-2 text-gray-400 hover:text-blue-600 transition rounded-full hover:bg-blue-50" title="Print Summary">
            <Printer className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-blue-600 transition rounded-full hover:bg-blue-50" title="Share">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-slate-900 px-8 py-10 text-white">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-blue-300 border border-white/10">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(summary.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-slate-300 border border-white/10">
              <MapPin className="h-3.5 w-3.5" />
              Ashtabula Township
            </div>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight">Township Board of Trustees Meeting</h1>
          <div className="mt-6 flex flex-wrap gap-2">
            {summary.tags?.map(tag => (
              <span key={tag} className="px-3 py-1 bg-blue-500/20 text-blue-200 text-xs font-bold rounded-lg border border-blue-500/30 flex items-center gap-1">
                <Tag className="h-3 w-3" /> {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="p-8 lg:p-12 space-y-12">
          <section>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <div className="h-1 w-8 bg-blue-600 rounded"></div>
              Meeting Overview
            </h2>
            <p className="text-xl text-slate-700 leading-relaxed font-serif italic">
              "{summary.overview}"
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-12">
            <section className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100/50">
              <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] mb-6">Key Decisions</h2>
              <ul className="space-y-4">
                {summary.bullets?.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="mt-1.5 h-2 w-2 bg-blue-500 rounded-full shrink-0"></div>
                    <span className="text-slate-800 leading-snug font-medium">{bullet}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-green-50/50 p-8 rounded-2xl border border-green-100/50">
              <h2 className="text-sm font-black text-green-600 uppercase tracking-[0.2em] mb-6">Action Items</h2>
              <ul className="space-y-4">
                {summary.actionItems?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-slate-800 leading-snug font-bold">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {summary.pressRelease && (
            <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
               <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Official Press Release</h2>
                  <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Copy Text</button>
               </div>
               <div className="p-8 lg:p-10">
                  <div className="text-slate-700 leading-relaxed whitespace-pre-wrap font-serif">
                     {summary.pressRelease}
                  </div>
               </div>
            </section>
          )}

          <section className="pt-12 border-t border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
               <div className="flex items-center gap-4">
                 <div className="h-12 w-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                    <Download className="h-6 w-6 text-slate-400" />
                 </div>
                 <div>
                   <div className="font-bold text-slate-900">Raw Meeting Minutes</div>
                   <div className="text-sm text-slate-500 italic">Minutes_2026-02-16.pdf (1.2 MB)</div>
                 </div>
               </div>
               <button className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition shadow-sm">
                 Download Full PDF
               </button>
            </div>
          </section>
        </div>
        
        <div className="bg-slate-50 px-12 py-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-medium">
            This summary was generated by the Civic Insight Engine AI and reviewed by the Township Clerk. 
            For official legal records, please refer to the downloaded PDF above.
          </p>
        </div>
      </div>
    </div>
  );
}
