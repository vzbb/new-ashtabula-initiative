import { useState } from 'react';
import { useAppStore } from '../store';
import { Search, Filter, AlertCircle, MapPin, Calendar, ChevronRight, MessageSquare, Clock, CheckCircle2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import IssueMap from '../components/IssueMap';

export default function Issues() {
  const issues = useAppStore((state) => state.issues);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = ['roads', 'utilities', 'zoning', 'safety', 'other'];
  const statuses = ['open', 'in_progress', 'resolved', 'closed'];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Community Issues</h1>
          <p className="text-slate-500 font-medium">Browse, track, and monitor local reports in real-time.</p>
        </div>
        <Link 
          to="/report" 
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center gap-2 w-fit"
        >
          <AlertCircle className="h-5 w-5" /> Report New Issue
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search issues by keyword or location..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
                 <Filter className="h-3.5 w-3.5 text-slate-400" />
                 <select 
                   className="text-xs font-bold text-slate-600 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                   value={statusFilter}
                   onChange={(e) => setStatusFilter(e.target.value)}
                 >
                    <option value="all">All Statuses</option>
                    {statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ').toUpperCase()}</option>)}
                 </select>
              </div>

              <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
                 <Filter className="h-3.5 w-3.5 text-slate-400" />
                 <select 
                   className="text-xs font-bold text-slate-600 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
                   value={categoryFilter}
                   onChange={(e) => setCategoryFilter(e.target.value)}
                 >
                    <option value="all">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                 </select>
              </div>

              {(statusFilter !== 'all' || categoryFilter !== 'all' || searchQuery !== '') && (
                <button 
                  onClick={() => { setStatusFilter('all'); setCategoryFilter('all'); setSearchQuery(''); }}
                  className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1"
                >
                  <X className="h-3 w-3" /> Clear Filters
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-4">
            {filteredIssues.length === 0 ? (
              <div className="bg-white rounded-3xl p-20 text-center border border-slate-100 shadow-sm">
                 <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-slate-300" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-900">No issues found</h3>
                 <p className="text-slate-500 text-sm mt-2">Adjust your filters to see more results.</p>
              </div>
            ) : (
              filteredIssues.map(issue => (
                <Link 
                  to={`/issue/${issue.id}`} 
                  key={issue.id} 
                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex gap-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        issue.status === 'open' ? 'bg-red-50 text-red-600' :
                        issue.status === 'in_progress' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                         <AlertCircle className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">{issue.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {issue.location}
                           </span>
                           <div className="h-1 w-1 bg-slate-200 rounded-full"></div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {new Date(issue.createdAt).toLocaleDateString()}
                           </span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                      issue.status === 'open' ? 'bg-red-50 text-red-600 border-red-100' :
                      issue.status === 'in_progress' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {issue.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-2 mb-6 leading-relaxed">{issue.description}</p>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <MessageSquare className="h-3.5 w-3.5" /> {issue.comments?.length || 0} Updates
                       </div>
                       <div className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest">
                          {issue.category}
                       </div>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 text-xs font-bold group-hover:gap-2 transition-all">
                       View Progress <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
           <IssueMap issues={filteredIssues} />
           
           <div className="bg-slate-900 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">How it works</h3>
              <div className="space-y-6">
                 <div className="flex gap-4">
                    <div className="h-8 w-8 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 font-black text-xs">1</div>
                    <div>
                       <p className="font-bold text-sm mb-1">Report</p>
                       <p className="text-xs text-slate-400 leading-relaxed">Submit a photo and location of the issue you've spotted.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="h-8 w-8 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 font-black text-xs">2</div>
                    <div>
                       <p className="font-bold text-sm mb-1">Review</p>
                       <p className="text-xs text-slate-400 leading-relaxed">Township clerks assign the ticket to the relevant department.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="h-8 w-8 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 font-black text-xs">3</div>
                    <div>
                       <p className="font-bold text-sm mb-1">Resolve</p>
                       <p className="text-xs text-slate-400 leading-relaxed">Track progress in real-time until the issue is fixed.</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
              <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                 <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Issue Resolution Rate</h3>
              <div className="text-4xl font-black text-slate-900 mb-2">92%</div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Average response time: 48 hours</p>
           </div>
        </div>
      </div>
    </div>
  );
}
