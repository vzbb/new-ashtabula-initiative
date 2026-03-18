import { DollarSign, ExternalLink, TrendingUp, ArrowUpRight, ArrowDownRight, PieChart, BarChart3, Info } from 'lucide-react';

export default function Budget() {
  const budgetItems = [
    { name: 'Public Works & Roads', allocated: 1850000, spent: 1240000, color: 'bg-blue-500' },
    { name: 'Police & Public Safety', allocated: 2100000, spent: 1850000, color: 'bg-red-500' },
    { name: 'Parks & Recreation', allocated: 450000, spent: 310000, color: 'bg-emerald-500' },
    { name: 'General Government', allocated: 850000, spent: 720000, color: 'bg-amber-500' },
    { name: 'Zoning & Development', allocated: 250000, spent: 180000, color: 'bg-purple-500' }
  ];

  const totalBudget = budgetItems.reduce((acc, item) => acc + item.allocated, 0);
  const totalSpent = budgetItems.reduce((acc, item) => acc + item.spent, 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="text-center">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Township Budget Explorer</h1>
        <p className="text-slate-500 font-medium mt-2">Real-time transparency for Ashtabula Township tax dollars.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Total 2026 Budget</div>
           <div className="text-4xl font-black text-slate-900 mb-2">${(totalBudget / 1000000).toFixed(1)}M</div>
           <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
              <TrendingUp className="h-3 w-3" /> +4.2% from 2025
           </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">YTD Expenditures</div>
           <div className="text-4xl font-black text-slate-900 mb-2">${(totalSpent / 1000000).toFixed(1)}M</div>
           <div className="w-full bg-slate-100 h-2 rounded-full mt-2">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(totalSpent / totalBudget * 100).toFixed(0)}%` }}></div>
           </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-200">
           <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Reserve Fund</div>
           <div className="text-4xl font-black mb-2">$1.4M</div>
           <div className="text-slate-400 text-xs font-medium">Restricted for emergency use only.</div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2rem] p-10 lg:p-16 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
           <DollarSign className="w-full h-full text-white" strokeWidth={0.5} />
        </div>
        <div className="max-w-3xl relative z-10">
           <h2 className="text-3xl lg:text-4xl font-black mb-6 tracking-tight">Where does my $1 of property tax go?</h2>
           <p className="text-slate-400 text-lg mb-12 leading-relaxed">
             Transparency means knowing exactly how your contribution supports the township. Here is the breakdown of every dollar collected in Ashtabula Township.
           </p>
           
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-8">
              <div className="space-y-4 group">
                 <div className="h-1 bg-blue-500 w-full group-hover:h-2 transition-all"></div>
                 <div className="text-3xl font-black text-blue-400">42¢</div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Public Safety</div>
                 <p className="text-[10px] text-slate-400 leading-tight">Police, Fire, and Emergency Dispatch services.</p>
              </div>
              <div className="space-y-4 group">
                 <div className="h-1 bg-emerald-500 w-full group-hover:h-2 transition-all"></div>
                 <div className="text-3xl font-black text-emerald-400">28¢</div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Infrastructure</div>
                 <p className="text-[10px] text-slate-400 leading-tight">Road paving, bridge repair, and storm drains.</p>
              </div>
              <div className="space-y-4 group">
                 <div className="h-1 bg-amber-500 w-full group-hover:h-2 transition-all"></div>
                 <div className="text-3xl font-black text-amber-400">12¢</div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Parks & Rec</div>
                 <p className="text-[10px] text-slate-400 leading-tight">Maintenance of 8 township parks and community trails.</p>
              </div>
              <div className="space-y-4 group">
                 <div className="h-1 bg-purple-500 w-full group-hover:h-2 transition-all"></div>
                 <div className="text-3xl font-black text-purple-400">10¢</div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">General Admin</div>
                 <p className="text-[10px] text-slate-400 leading-tight">Township hall operations, legal, and clerk's office.</p>
              </div>
              <div className="space-y-4 group">
                 <div className="h-1 bg-slate-500 w-full group-hover:h-2 transition-all"></div>
                 <div className="text-3xl font-black text-slate-300">08¢</div>
                 <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Debt & Reserve</div>
                 <p className="text-[10px] text-slate-400 leading-tight">Emergency rainy-day fund and historical bond payments.</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
           <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <PieChart className="h-5 w-5 text-blue-500" />
                Department Allocation
              </h3>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fiscal Year 2026</div>
           </div>
           <div className="p-8 space-y-8">
              {budgetItems.map(item => (
                <div key={item.name}>
                   <div className="flex justify-between items-end mb-3">
                      <div>
                         <div className="text-sm font-bold text-slate-900">{item.name}</div>
                         <div className="text-[10px] text-slate-400 font-medium">${(item.spent / 1000).toFixed(0)}k spent of ${(item.allocated / 1000).toFixed(0)}k</div>
                      </div>
                      <div className="text-sm font-black text-slate-700">{(item.spent / item.allocated * 100).toFixed(0)}%</div>
                   </div>
                   <div className="w-full bg-slate-50 h-3 rounded-full">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.spent / item.allocated * 100).toFixed(0)}%` }}></div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Revenue Sources
              </h3>
              <div className="space-y-6">
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-900">
                          <DollarSign className="h-5 w-5" />
                       </div>
                       <div>
                          <div className="text-sm font-bold">Property Taxes</div>
                          <div className="text-[10px] text-slate-400 font-medium">Levied annually</div>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="font-black text-slate-900">$3.2M</div>
                       <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">65% of Total</div>
                    </div>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-900">
                          <BarChart3 className="h-5 w-5" />
                       </div>
                       <div>
                          <div className="text-sm font-bold">State & Fed Grants</div>
                          <div className="text-[10px] text-slate-400 font-medium">Infrastructure/Safety</div>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="font-black text-slate-900">$1.1M</div>
                       <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">22% of Total</div>
                    </div>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-900">
                          <Info className="h-5 w-5" />
                       </div>
                       <div>
                          <div className="text-sm font-bold">Fees & Permits</div>
                          <div className="text-[10px] text-slate-400 font-medium">Zoning/Administrative</div>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="font-black text-slate-900">$0.6M</div>
                       <div className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">13% of Total</div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
              <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                 <DollarSign className="h-5 w-5 text-emerald-600" />
                 Official Ohio Checkbook
              </h3>
              <p className="text-emerald-700 text-sm leading-relaxed mb-6">
                For a complete, item-level audit of every transaction made by the township, please visit the Ohio Checkbook portal.
              </p>
              <a 
                href="https://checkbook.ohio.gov" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
              >
                Launch Checkbook <ExternalLink className="h-4 w-4" />
              </a>
           </div>
        </div>
      </div>
      
      <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center">
         <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Want more detail?</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              We publish quarterly financial reports and independent audit results. You can download the full 2026 Budget Proposal (PDF) for a deep dive into our fiscal planning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition">
                  Download 2026 Budget
               </button>
               <button className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition">
                  View 2025 Audit
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
