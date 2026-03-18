import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../store';
import { Home, FileText, AlertCircle, Search, ShieldCheck, Menu, X } from 'lucide-react';
import { useState } from 'react';

// City of Ashtabula Lighthouse Shield Logo
const CitySealLogo = () => (
  <svg className="seal-logo" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    {/* Shield background */}
    <path d="M25 2L6 10V22C6 35 25 48 25 48C25 48 44 35 44 22V10L25 2Z" fill="#1e3a5f" stroke="#d4af37" strokeWidth="2"/>
    {/* Lighthouse body */}
    <rect x="21" y="15" width="8" height="18" fill="white"/>
    {/* Lighthouse top */}
    <polygon points="25,8 17,15 33,15" fill="#d4af37"/>
    {/* Light beam */}
    <path d="M25 12 L35 8 L25 15" fill="#d4af37" opacity="0.7"/>
    {/* Waves at bottom */}
    <path d="M12 38 Q18 35 25 38 Q32 41 38 38" stroke="white" strokeWidth="1.5" fill="none"/>
  </svg>
);

export default function Layout() {
  const { user } = useAppStore();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentWard, setCurrentWard] = useState('Citywide');

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/issues', label: 'Community Issues', icon: AlertCircle },
    { path: '/report', label: 'Report Issue', icon: AlertCircle },
    { path: '/property', label: 'Property Lookup', icon: Search },
    { path: '/budget', label: 'Budget Explorer', icon: FileText },
    { path: '/admin', label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#f8f6f0] flex flex-col" style={{ fontFamily: "'Open Sans', system-ui, sans-serif" }}>
      {/* Heritage Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ 
        opacity: 0.5,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cg opacity='0.06'%3E%3Cpath d='M10 160 Q30 140 50 160 L50 180 L10 180 Z' fill='%23003f87'/%3E%3Cpath d='M120 140 Q140 120 160 140 L160 180 L120 180 Z' fill='%23003f87'/%3E%3Cpath d='M80 180c0-25 5-50 10-70M90 180c0-25 5-50 10-70' stroke='%2327ae60' stroke-width='1.5' fill='none'/%3E%3Cpath d='M0 190 Q25 185 50 190 T100 190 T150 190 T200 190' stroke='%23003f87' stroke-width='1' fill='none' opacity='0.6'/%3E%3C/g%3E%3C/svg%3E")`
      }} />

      {/* Top Banner - Official Gold Bar */}
      <div className="bg-[#1e3a5f] text-white py-2 px-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-center flex items-center justify-center gap-4 relative z-10">
        <span className="text-[#d4af37]">CIVIC INSIGHT ENGINE — Official City of Ashtabula Service</span>
        <div className="h-1 w-1 bg-[#d4af37] rounded-full"></div>
        <select 
          className="bg-transparent border-none text-white focus:ring-0 cursor-pointer hover:text-[#d4af37] transition text-[10px] font-semibold uppercase"
          value={currentWard}
          onChange={(e) => setCurrentWard(e.target.value)}
        >
          <option className="bg-[#1e3a5f]" value="Citywide">Citywide</option>
          <option className="bg-[#1e3a5f]" value="Ward 1">Ward 1 - Bridge Street District</option>
          <option className="bg-[#1e3a5f]" value="Ward 2">Ward 2 - Main Avenue Area</option>
          <option className="bg-[#1e3a5f]" value="Ward 3">Ward 3 - Harbor District</option>
          <option className="bg-[#1e3a5f]" value="Ward 4">Ward 4 - West Side</option>
          <option className="bg-[#1e3a5f]" value="Ward 5">Ward 5 - East Side</option>
        </select>
      </div>

      {/* Header with City Lighthouse Shield */}
      <header className="bg-white border-b-[3px] border-[#d4af37] sticky top-0 z-50 shadow-md">
        <div className="max-w-[850px] mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 flex-shrink-0">
                  <CitySealLogo />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-[#1e3a5f] tracking-tight leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    City of Ashtabula
                  </span>
                  <span className="text-[10px] font-semibold text-[#d4af37] uppercase tracking-wider">
                    Civic Insight Engine
                  </span>
                </div>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-1 ml-6">
                {navItems.slice(0, 4).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                      location.pathname === item.path
                        ? 'bg-[#1e3a5f] text-white'
                        : 'text-[#1e3a5f] hover:bg-[#f8f6f0]'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              {user.isAdmin && (
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#1e3a5f] bg-opacity-10 text-[#1e3a5f] rounded border border-[#d4af37] text-[10px] font-semibold uppercase">
                  <ShieldCheck className="h-3 w-3" />
                  Official City Service
                </div>
              )}
              
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-[#1e3a5f] hover:bg-[#f8f6f0] rounded transition"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#e8e4dc] p-3 space-y-1 shadow-lg">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-semibold transition-all ${
                  location.pathname === item.path
                    ? 'bg-[#1e3a5f] text-white'
                    : 'text-[#1e3a5f] hover:bg-[#f8f6f0]'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-[850px] mx-auto w-full px-4 py-8 relative z-10">
        <Outlet />
      </main>

      {/* Official City Footer */}
      <footer className="bg-[#1e3a5f] text-white border-t-[3px] border-[#d4af37] py-8 relative z-10">
        <div className="max-w-[850px] mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10">
                <CitySealLogo />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">City of Ashtabula</p>
                <p className="text-xs text-white opacity-70">Your Municipal Government, Working For You</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="text-xs text-white opacity-80 hover:text-[#d4af37] transition">Privacy Policy</a>
              <a href="#" className="text-xs text-white opacity-80 hover:text-[#d4af37] transition">Terms of Use</a>
              <a href="#" className="text-xs text-white opacity-80 hover:text-[#d4af37] transition">Contact</a>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-white border-opacity-20 text-center">
            <p className="text-xs text-white opacity-60">
              © 2026 City of Ashtabula | Official Municipal Service | Serving Ashtabula residents since 1831
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
