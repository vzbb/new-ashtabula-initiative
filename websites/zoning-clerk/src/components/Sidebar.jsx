import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  CheckCircle, 
  FileText, 
  MessageSquare, 
  Info,
  Building2,
  Menu,
  X
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/lookup', label: 'Property Lookup', icon: Search },
  { path: '/eligibility', label: 'Use Eligibility', icon: CheckCircle },
  { path: '/permits', label: 'Permit Wizard', icon: Info },
  { path: '/documents', label: 'Documents & Forms', icon: FileText },
  { path: '/chat', label: 'Zoning Assistant', icon: MessageSquare },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className={cn(
      "h-screen bg-ashtabula-primary text-white transition-all duration-300 flex flex-col shadow-xl z-20",
      isOpen ? "w-64" : "w-20"
    )}>
      <div className="p-4 flex items-center justify-between border-b border-white/10 h-16">
        {isOpen && (
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-ashtabula-secondary">
            <Building2 />
            <span className="text-white">Zoning Clerk</span>
          </div>
        )}
        {!isOpen && <Building2 className="mx-auto text-ashtabula-secondary" size={28} />}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-ashtabula-secondary"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
              isActive 
                ? "bg-ashtabula-secondary text-ashtabula-primary font-bold shadow-lg" 
                : "hover:bg-white/5 text-white/70 hover:text-white"
            )}
          >
            <item.icon size={22} className={cn(
              "shrink-0 transition-colors",
              "group-hover:text-ashtabula-secondary"
            )} />
            {isOpen && <span className="truncate">{item.label}</span>}
            {isActive && <div className="absolute right-0 top-0 bottom-0 w-1 bg-white" />}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-white/10 text-[10px] text-white/40 uppercase tracking-widest font-bold">
        {isOpen ? (
          <div className="flex flex-col gap-1">
            <p>© 2026 City of Ashtabula</p>
            <p className="text-ashtabula-secondary/60">Community Development</p>
          </div>
        ) : (
          <p className="text-center">2026</p>
        )}
      </div>
    </div>
  );
}
