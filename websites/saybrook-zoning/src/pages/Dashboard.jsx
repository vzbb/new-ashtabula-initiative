import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Search, 
  Info, 
  MessageSquare, 
  AlertTriangle,
  ExternalLink,
  Map as MapIcon,
  Clock,
  Phone
} from 'lucide-react';

export function Dashboard() {
  const cards = [
    {
      title: 'Property Lookup',
      description: 'Search for properties by address to find saybrook-zoning districts and parcel details.',
      icon: Search,
      path: '/lookup',
      color: 'bg-blue-50 text-ashtabula-primary border-blue-100',
    },
    {
      title: 'Use Eligibility',
      description: 'Check what types of construction or business activities are permitted in your zone.',
      icon: MapIcon,
      path: '/eligibility',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
    {
      title: 'Permit Wizard',
      description: 'Step-by-step guidance on which permits you need for your project.',
      icon: Info,
      path: '/permits',
      color: 'bg-amber-50 text-ashtabula-secondary border-amber-100',
    },
    {
      title: 'Zoning Assistant',
      description: 'Ask our AI any questions about Ashtabula saybrook-zoning codes and procedures.',
      icon: MessageSquare,
      path: '/chat',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="bg-ashtabula-primary rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl border border-white/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-ashtabula-secondary/20 rounded-full text-ashtabula-secondary text-xs font-bold uppercase tracking-widest mb-6 border border-ashtabula-secondary/30">
            <span className="w-2 h-2 rounded-full bg-ashtabula-secondary animate-pulse" />
            Digital Clerk Active
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">How can we help you with saybrook-zoning today?</h1>
          <p className="text-xl text-white/70 mb-8 leading-relaxed">
            Navigate through the city's official tools to find information 
            about property regulations, permits, and saybrook-zoning codes.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/chat"
              className="bg-ashtabula-secondary text-ashtabula-primary px-8 py-3 rounded-xl font-bold hover:bg-white transition-all transform hover:-translate-y-1 shadow-lg shadow-ashtabula-secondary/20"
            >
              Start Chatting
            </Link>
            <Link 
              to="/lookup"
              className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-all"
            >
              Lookup Address
            </Link>
          </div>
        </div>
        <div className="absolute right-[-10%] top-[-20%] w-[50%] h-[150%] bg-gradient-to-l from-ashtabula-secondary/10 to-transparent rotate-12 pointer-events-none" />
        <div className="absolute right-10 bottom-10 opacity-10">
          <MapIcon size={240} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <Link
            key={idx}
            to={card.path}
            className={`flex flex-col p-8 rounded-2xl border text-left hover:shadow-xl transition-all group relative overflow-hidden ${card.color}`}
          >
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <card.icon size={120} />
            </div>
            <card.icon className="mb-6 relative z-10" size={36} />
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2 relative z-10">
              {card.title}
              <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
            </h3>
            <p className="text-sm opacity-80 leading-relaxed relative z-10">
              {card.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-bold mb-6 text-ashtabula-primary flex items-center gap-3">
              <div className="p-2 bg-ashtabula-bg rounded-lg">
                <Clock size={24} className="text-ashtabula-secondary" />
              </div>
              Latest Updates & Notices
            </h3>
            <div className="space-y-4">
              <div className="flex gap-6 p-4 hover:bg-ashtabula-bg rounded-xl border border-transparent hover:border-slate-100 transition-all cursor-pointer group">
                <div className="bg-ashtabula-secondary/10 p-3 h-fit rounded-xl text-ashtabula-secondary font-bold text-xs uppercase text-center min-w-[60px]">
                  Feb 14
                </div>
                <div>
                  <h4 className="font-bold text-ashtabula-primary group-hover:text-ashtabula-secondary transition-colors">New Historic District Guidelines</h4>
                  <p className="text-sm text-slate-500 mt-1">The Harbor Historical District guidelines have been updated for 2026. Review changes to exterior alterations.</p>
                </div>
              </div>
              <div className="flex gap-6 p-4 hover:bg-ashtabula-bg rounded-xl border border-transparent hover:border-slate-100 transition-all cursor-pointer group">
                <div className="bg-slate-100 p-3 h-fit rounded-xl text-slate-500 font-bold text-xs uppercase text-center min-w-[60px]">
                  Jan 20
                </div>
                <div>
                  <h4 className="font-bold text-ashtabula-primary group-hover:text-ashtabula-secondary transition-colors">Permit Fee Schedule Update</h4>
                  <p className="text-sm text-slate-500 mt-1">Commercial permit fees have been adjusted for the new fiscal year. Residential fees remain unchanged.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-ashtabula-secondary/20 p-8 rounded-2xl relative overflow-hidden">
            <div className="flex gap-6 relative z-10">
              <div className="bg-white p-3 rounded-full shadow-sm h-fit">
                <AlertTriangle className="text-ashtabula-secondary" size={28} />
              </div>
              <div>
                <h4 className="font-bold text-ashtabula-primary mb-2 text-lg">Legal Disclaimer</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  This digital assistant provides general information only. Zoning determinations and permit 
                  approvals are subject to official review by the Planning & Community Development Department. 
                  Always verify information with city staff before beginning construction or signing contracts.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-ashtabula-primary">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Official City Website', href: '#' },
                { label: 'Online Permit Portal', href: '#' },
                { label: 'Zoning Code (Part 11)', href: '#' },
                { label: 'City GIS Map', href: '#' },
              ].map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="flex items-center justify-between p-3 hover:bg-ashtabula-bg rounded-xl group transition-colors">
                    <span className="text-slate-600 font-medium group-hover:text-ashtabula-primary">{link.label}</span>
                    <ExternalLink size={16} className="text-slate-300 group-hover:text-ashtabula-secondary transition-colors" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-ashtabula-primary p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <Phone size={24} className="text-ashtabula-secondary" />
                Contact Us
              </h3>
              <div className="space-y-6 text-sm">
                <div>
                  <p className="font-bold text-ashtabula-secondary uppercase tracking-widest text-[10px] mb-2">Location</p>
                  <p className="text-white/80 leading-relaxed">4717 Main Avenue<br />Ashtabula, OH 44004</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <Phone size={14} className="text-ashtabula-secondary" />
                    </div>
                    <p className="font-semibold">(440) 992-7125</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <MessageSquare size={14} className="text-ashtabula-secondary" />
                    </div>
                    <p className="font-semibold">PCD@cityofashtabula.com</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-[10px] opacity-60 italic uppercase tracking-wider">Office Hours: Mon–Fri, 8:00 AM – 4:30 PM</p>
                </div>
              </div>
            </div>
            <Building2 size={120} className="absolute -right-10 -bottom-10 opacity-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
