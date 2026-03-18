import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store';
import { Calendar, MapPin, AlertCircle, ChevronLeft, MessageSquare, Clock, CheckCircle2, ShieldCheck, User } from 'lucide-react';

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const issue = useAppStore(state => state.issues.find(i => i.id === id));

  if (!issue) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="h-10 w-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Issue not found</h2>
        <p className="mt-2 text-gray-600">The report you are looking for does not exist or has been removed.</p>
        <Link to="/" className="mt-8 inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition">
          <ChevronLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const statusColors = {
    open: 'bg-red-50 text-red-600 border-red-100',
    in_progress: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    resolved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    closed: 'bg-gray-50 text-gray-500 border-gray-100'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition font-medium"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 lg:p-12">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                 <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${statusColors[issue.status]}`}>
                   {issue.status.replace('_', ' ')}
                 </span>
                 <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                   <Clock className="h-3 w-3" /> Reported {new Date(issue.createdAt).toLocaleDateString()}
                 </span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">{issue.title}</h1>
              <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold text-slate-500">
                 <div className="flex items-center gap-1.5">
                   <MapPin className="h-4 w-4 text-blue-500" /> {issue.location}
                 </div>
                 <div className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                   <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">{issue.category}</span>
                 </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 min-w-[200px]">
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Issue ID</div>
               <div className="font-mono text-sm font-bold text-slate-700">#REP-{issue.id.slice(-6).toUpperCase()}</div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-8 mb-12">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Original Description</h3>
             <p className="text-slate-700 leading-relaxed text-lg">
                {issue.description}
             </p>
          </div>

          <div className="space-y-8">
             <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
               <div className="h-1 w-8 bg-blue-600 rounded"></div>
               Resolution Timeline
             </h2>

             <div className="relative pl-8 space-y-12 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {/* Current Status */}
                <div className="relative">
                   <div className={`absolute -left-8 h-6 w-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                      issue.status === 'resolved' ? 'bg-emerald-500' : 'bg-blue-500'
                   }`}>
                      {issue.status === 'resolved' ? <CheckCircle2 className="h-3 w-3 text-white" /> : <Clock className="h-3 w-3 text-white" />}
                   </div>
                   <div>
                      <div className="font-black text-slate-900 uppercase tracking-wider text-xs mb-1">
                        Current Status: {issue.status.replace('_', ' ')}
                      </div>
                      <p className="text-sm text-slate-500">Last updated on {new Date().toLocaleDateString()}</p>
                   </div>
                </div>

                {/* Comments/Updates */}
                {issue.comments?.map((comment) => (
                  <div key={comment.id} className="relative">
                     <div className="absolute -left-8 h-6 w-6 bg-white rounded-full border-2 border-slate-200 shadow-sm flex items-center justify-center">
                        <MessageSquare className="h-3 w-3 text-slate-400" />
                     </div>
                     <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                           <div className="flex items-center gap-2">
                              <div className="h-6 w-6 bg-blue-50 rounded-full flex items-center justify-center">
                                 <ShieldCheck className="h-3 w-3 text-blue-600" />
                              </div>
                              <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Township Admin Update</span>
                           </div>
                           <span className="text-[10px] text-slate-400 font-medium">{new Date(comment.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-700 text-sm">{comment.text}</p>
                     </div>
                  </div>
                ))}

                {/* Initial Submission */}
                <div className="relative">
                   <div className="absolute -left-8 h-6 w-6 bg-slate-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                      <User className="h-3 w-3 text-slate-400" />
                   </div>
                   <div>
                      <div className="font-black text-slate-900 uppercase tracking-wider text-xs mb-1">Report Submitted</div>
                      <p className="text-sm text-slate-500">Resident report received and queued for review.</p>
                      <div className="text-[10px] text-slate-400 font-medium mt-1">{new Date(issue.createdAt).toLocaleString()}</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
        
        <div className="bg-slate-50 px-12 py-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
           <p className="text-xs text-slate-400 font-medium text-center md:text-left">
             This is a public record. Personal information has been redacted for privacy.
           </p>
           <button className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition shadow-sm flex items-center gap-2">
              Subscribe to Updates
           </button>
        </div>
      </div>
    </div>
  );
}
