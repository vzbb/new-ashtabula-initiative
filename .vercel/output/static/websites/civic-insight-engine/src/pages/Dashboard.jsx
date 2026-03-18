import { useState } from 'react';
import { useAppStore } from '../store';
import { Calendar, Tag, CheckCircle2, ChevronRight, FileText, AlertCircle, MapPin, DollarSign, ExternalLink, Search, Filter, X, Building2, Wheat } from 'lucide-react';
import { Link } from 'react-router-dom';
import IssueMap from '../components/IssueMap';

export default function Dashboard() {
  const summaries = useAppStore((state) => state.summaries);
  const issues = useAppStore((state) => state.issues);
  const hasSeenWelcome = useAppStore((state) => state.hasSeenWelcome);
  const setHasSeenWelcome = useAppStore((state) => state.setHasSeenWelcome);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Get unique tags from all summaries
  const allTags = Array.from(new Set(summaries.flatMap(s => s.tags || []))).sort();

  const filteredSummaries = summaries.filter(s => {
    const matchesSearch = 
      s.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.bullets.some(b => b.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTag = selectedTag === 'all' || s.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const recentIssues = issues.slice(0, 5); 

  return (
    <div className="space-y-8 max-w-6xl mx-auto relative">
      {/* Welcome Overlay */}
      {!hasSeenWelcome && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#003f87]/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="bg-[#003f87] p-8 text-white relative">
                 <div className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer" onClick={() => setHasSeenWelcome(true)}>
                    <X className="h-5 w-5" />
                 </div>
                 <div className="h-12 w-12 bg-[#ffd700]/20 rounded-xl flex items-center justify-center mb-6">
                    <Building2 className="h-6 w-6 text-[#ffd700]" />
                 </div>
                 <h2 className="text-3xl font-black tracking-tight mb-2">Welcome to City of Ashtabula's Civic Insight Engine.</h2>
                 <p className="text-blue-100 font-medium">Your official transparency portal. Serving Ashtabula residents since 1831.</p>
              </div>
              <div className="p-8 space-y-6">
                 <p className="text-slate-600 leading-relaxed">
                   Your Municipal Government, Working For You. This official portal provides transparency and access to city records, services, and community engagement across Lake Erie's finest city.
                 </p>
                 <div className="grid gap-4">
                    <div className="flex gap-4 p-4 bg-[#003f87]/5 rounded-2xl border border-[#003f87]/10">
                       <FileText className="h-6 w-6 text-[#003f87] shrink-0" />
                       <div>
                          <p className="font-bold text-slate-900 text-sm">AI-Powered Transparency</p>
                          <p className="text-xs text-slate-500">Meeting summaries and records made accessible.</p>
                       </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-[#ffd700]/10 rounded-2xl border border-[#ffd700]/20">
                       <AlertCircle className="h-6 w-6 text-[#b8860b] shrink-0" />
                       <div>
                          <p className="font-bold text-slate-900 text-sm">Community Issue Reporting</p>
                          <p className="text-xs text-slate-500">Report and track concerns across the county.</p>
                       </div>
                    </div>
                 </div>
                 <button 
                   onClick={() => setHasSeenWelcome(true)}
                   className="w-full py-4 bg-[#003f87] text-white rounded-2xl font-bold hover:bg-[#002d66] transition shadow-xl"
                 >
                    Claim Your City Portal — 60% Off Launch Pricing
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Hero Section - City Branded */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#152a45] rounded-3xl p-10 lg:p-16 shadow-xl text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-10 left-10 w-64 h-64 bg-[#d4af37] rounded-full blur-[100px]"></div>
           <div className="absolute bottom-10 right-10 w-64 h-64 bg-white rounded-full blur-[100px]"></div>
        </div>
        
        {/* Official City Badge */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 mb-6">
            <span className="text-sm font-semibold text-[#d4af37]">Official City Service</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Welcome to City of Ashtabula's
            <br />Civic Insight Engine
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            AI-powered transparency for our Lake Erie coastal community
          </p>
          <p className="text-sm text-[#d4af37] mt-2 font-medium">
            Serving Ashtabula residents since 1831 — Bridge Street to Main Avenue
          </p>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/report" className="px-8 py-4 bg-[#d4af37] text-[#1e3a5f] rounded-xl font-bold hover:bg-[#b8962e] transition shadow-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> Report an Issue
            </Link>
            <Link to="/property" className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition backdrop-blur-sm flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Property Lookup
            </Link>
            <Link to="/budget" className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition backdrop-blur-sm flex items-center gap-2">
              <DollarSign className="h-5 w-5" /> Budget Explorer
            </Link>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Content - Summaries */}
        <div className="lg:col-span-2 space-y-6">
          <IssueMap issues={issues} />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4">
            <div>
              <h2 className="text-2xl font-black text-[#1e3a5f] tracking-tight">Meeting Summaries</h2>
              <p className="text-xs text-slate-500 mt-1">Official City Council Records</p>
            </div>
            
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search county records..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#003f87] focus:border-transparent outline-none transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
             <button 
               onClick={() => setSelectedTag('all')}
               className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                 selectedTag === 'all' 
                   ? 'bg-[#003f87] text-white border-[#003f87] shadow-md' 
                   : 'bg-white text-slate-400 border-slate-100 hover:border-[#003f87]'
               }`}
             >
               All
             </button>
             {allTags.map(tag => (
               <button 
                 key={tag}
                 onClick={() => setSelectedTag(tag)}
                 className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                   selectedTag === tag 
                     ? 'bg-[#003f87] text-white border-[#003f87] shadow-md' 
                     : 'bg-white text-slate-400 border-slate-100 hover:border-[#003f87]'
                 }`}
               >
                 {tag}
               </button>
             ))}
          </div>

          {filteredSummaries.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="h-20 w-20 bg-[#003f87]/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-10 w-10 text-[#003f87]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No matching records</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search terms.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredSummaries.map((summary) => (
                <Link 
                  to={`/summary/${summary.id}`} 
                  key={summary.id} 
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 hover:shadow-xl hover:border-[#003f87]/20 hover:-translate-y-1 transition-all duration-300 block"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="px-3 py-1 bg-[#003f87]/10 text-[#003f87] text-[10px] font-black uppercase tracking-widest rounded-lg border border-[#003f87]/20 flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          {new Date(summary.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">County Board Meeting</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#003f87] transition-colors leading-tight">Board of Commissioners</h3>
                    </div>
                    {summary.tags && (
                      <div className="flex flex-wrap gap-2">
                        {summary.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-500 border border-slate-100 group-hover:bg-[#003f87]/5 group-hover:text-[#003f87] group-hover:border-[#003f87]/20 transition-colors">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <p className="text-slate-600 mb-8 leading-relaxed line-clamp-2 italic font-serif text-lg">"{summary.overview}"</p>

                  <div className="grid md:grid-cols-2 gap-8 border-t border-slate-50 pt-6">
                    <div>
                      <h4 className="font-black text-[#003f87] mb-4 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                         Key Decisions
                      </h4>
                      <ul className="space-y-3">
                        {summary.bullets?.slice(0, 3).map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                            <div className="h-1.5 w-1.5 bg-[#ffd700] rounded-full mt-1.5 shrink-0"></div>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col justify-end items-end">
                       <div className="flex items-center gap-1 text-[#003f87] font-bold text-sm group-hover:gap-2 transition-all">
                         Read Full Summary <ChevronRight className="h-4 w-4" />
                       </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Official County Badge */}
          <div className="bg-[#003f87] rounded-2xl shadow-lg p-6 text-white text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
              <Wheat className="h-8 w-8 text-[#ffd700]" />
            </div>
            <h3 className="text-lg font-bold mb-1">Official County Service</h3>
            <p className="text-xs text-white/70">Ashtabula County Government</p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-[10px] text-[#ffd700] uppercase tracking-wider font-semibold">Since 1807</p>
            </div>
          </div>

          {/* County Calendar Widget */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#003f87] px-6 py-5 border-b border-[#ffd700]/30 text-white">
              <h3 className="font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#ffd700]" />
                County Meetings
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              <div className="p-5 hover:bg-slate-50 transition">
                <div className="flex justify-between items-start mb-2">
                   <div className="font-bold text-slate-900 text-sm">Board of Commissioners</div>
                   <div className="text-[10px] font-black text-[#003f87] bg-[#003f87]/10 px-2 py-0.5 rounded uppercase">Mar 02</div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                  <MapPin className="h-3 w-3" /> County Courthouse, 9:00 AM
                </div>
              </div>
              <div className="p-5 hover:bg-slate-50 transition">
                <div className="flex justify-between items-start mb-2">
                   <div className="font-bold text-slate-900 text-sm">Planning Commission</div>
                   <div className="text-[10px] font-black text-[#003f87] bg-[#003f87]/10 px-2 py-0.5 rounded uppercase">Mar 12</div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                  <MapPin className="h-3 w-3" /> County Office Building, 7:00 PM
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-gray-50 bg-gray-50/50">
              <a href="#" className="w-full flex items-center justify-center py-2.5 text-xs font-bold text-[#003f87] hover:text-[#002d66] transition gap-2">
                Official County Calendar <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* County Budget Widget */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="bg-[#ffd700] px-6 py-5 flex items-center justify-between text-[#003f87]">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  <h3 className="font-bold">County Budget</h3>
                </div>
                <div className="px-2 py-0.5 bg-[#003f87]/10 rounded text-[10px] font-black uppercase tracking-widest">2026</div>
             </div>
             <div className="p-6">
               <div className="space-y-5 mb-6">
                 <div>
                   <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                     <span>General Fund</span>
                     <span className="text-[#003f87]">$42.8M</span>
                   </div>
                   <div className="w-full bg-slate-100 rounded-full h-3">
                     <div className="bg-[#003f87] h-3 rounded-full shadow-sm" style={{ width: '68%' }}></div>
                   </div>
                 </div>
                 <div>
                   <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                     <span>Roads & Bridges</span>
                     <span className="text-[#b8860b]">$18.2M</span>
                   </div>
                   <div className="w-full bg-slate-100 rounded-full h-3">
                     <div className="bg-[#ffd700] h-3 rounded-full shadow-sm" style={{ width: '42%' }}></div>
                   </div>
                 </div>
               </div>
               <p className="text-[10px] text-slate-400 mb-6 italic leading-relaxed">County fiscal year 2026. All figures represent allocated county funds.</p>
               <a 
                 href="https://checkbook.ohio.gov" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="w-full bg-[#003f87] text-white py-3 rounded-xl text-xs font-bold hover:bg-[#002d66] transition flex items-center justify-center gap-2 shadow-lg"
               >
                 View Ohio Checkbook <ExternalLink className="h-3 w-3" />
               </a>
             </div>
          </div>

          {/* Community Issues Widget */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-[#003f87]" />
                County Issues
              </h3>
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <div className="divide-y divide-gray-50">
              {recentIssues.length === 0 ? (
                <div className="p-10 text-center text-xs text-gray-400">No issues reported recently.</div>
              ) : (
                recentIssues.map(issue => (
                  <Link to={`/issue/${issue.id}`} key={issue.id} className="p-5 hover:bg-slate-50 transition block">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#003f87] transition">{issue.title}</h4>
                      <span className={`text-[9px] uppercase tracking-wider font-black px-2 py-0.5 rounded-md border ${
                         issue.status === 'open' ? 'bg-red-50 text-red-600 border-red-100' :
                         issue.status === 'in_progress' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                         issue.status === 'resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                         'bg-gray-50 text-gray-500 border-gray-100'
                      }`}>
                        {issue.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                      <MapPin className="h-3 w-3" /> {issue.location}
                    </div>
                  </Link>
                ))
              )}
            </div>
            <div className="p-5 border-t border-gray-50 bg-gray-50/50">
              <Link to="/report" className="w-full flex items-center justify-center py-2.5 text-xs font-bold text-[#003f87] hover:text-[#002d66] transition">
                Report County Issue <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          
          {/* Subscribe Widget */}
          <div className="bg-[#003f87] rounded-2xl shadow-xl p-8 text-white">
             <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
               <Wheat className="h-5 w-5 text-[#ffd700]" />
               County Updates
             </h3>
             <p className="text-white/80 text-sm leading-relaxed mb-6">
               Get county meeting summaries and official updates delivered to your inbox.
             </p>
             {subscribed ? (
               <div className="bg-white/20 p-6 rounded-2xl text-center animate-in zoom-in-95 duration-300">
                  <CheckCircle2 className="h-10 w-10 text-[#ffd700] mx-auto mb-3" />
                  <p className="font-bold text-white text-sm">You're Subscribed!</p>
                  <p className="text-white/70 text-[10px] mt-1 font-medium">Check your inbox for confirmation.</p>
               </div>
             ) : (
               <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="your@email.com" 
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 text-sm focus:ring-2 focus:ring-[#ffd700]/50 outline-none transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button 
                    onClick={() => email.trim() && setSubscribed(true)}
                    className="w-full py-3 bg-[#ffd700] text-[#003f87] rounded-xl font-bold hover:bg-[#e6c200] transition shadow-lg"
                  >
                    Subscribe to County Updates
                  </button>
               </div>
             )}
             <p className="text-[10px] text-white/50 mt-4 text-center">Official Ashtabula County Communications</p>
          </div>
        </div>
      </div>
    </div>
  );
}
