import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../store';
import { Home, FileText, AlertCircle, Search, ShieldCheck, Menu, X } from 'lucide-react';
import { useState } from 'react';
import CityOfAshtabulaLogo from './CityOfAshtabulaLogo';

export default function Layout() {
  const { user } = useAppStore();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentDistrict, setCurrentDistrict] = useState('Countywide');

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
        <span className="text-[#d4af37]">CIVIC INSIGHT ENGINE — County Transparency, Searchable Records, Resident Reporting</span>
        <div className="h-1 w-1 bg-[#d4af37] rounded-full"></div>
        <select 
          className="bg-transparent border-none text-white focus:ring-0 cursor-pointer hover:text-[#d4af37] transition text-[10px] font-semibold uppercase"
          value={currentDistrict}
          onChange={(e) => setCurrentDistrict(e.target.value)}
        >
          <option className="bg-[#1e3a5f]" value="Countywide">Countywide</option>
          <option className="bg-[#1e3a5f]" value="District 1">District 1 - Bridge Street Corridor</option>
          <option className="bg-[#1e3a5f]" value="District 2">District 2 - Main Avenue Area</option>
          <option className="bg-[#1e3a5f]" value="District 3">District 3 - Harbor District</option>
          <option className="bg-[#1e3a5f]" value="District 4">District 4 - West Side</option>
          <option className="bg-[#1e3a5f]" value="District 5">District 5 - East Side</option>
        </select>
      </div>

      {/* Header with City Lighthouse Shield */}
      <header className="bg-white border-b-[3px] border-[#d4af37] sticky top-0 z-50 shadow-md">
        <div className="max-w-[850px] mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="min-w-[160px] h-12 flex-shrink-0 overflow-hidden">
                  <CityOfAshtabulaLogo size={50} showText={false} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-[#1e3a5f] tracking-tight leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    Ashtabula County Government
                  </span>
                  <span className="text-[10px] font-semibold text-[#d4af37] uppercase tracking-wider">
                    Transparency Portal
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
                  County Service Prototype
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
              <div className="min-w-[128px] h-10 overflow-hidden">
                <CityOfAshtabulaLogo size={40} showText={false} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Ashtabula County Government</p>
                <p className="text-xs text-white opacity-70">Your County Government, Working For You</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <a href="https://www.ashtabulacounty.us/" target="_blank" rel="noreferrer" className="text-xs text-white opacity-80 hover:text-[#d4af37] transition">County Website</a>
              <a href="https://www.ashtabulacounty.us/232/Transparency-Portal" target="_blank" rel="noreferrer" className="text-xs text-white opacity-80 hover:text-[#d4af37] transition">Transparency Portal</a>
              <a href="https://www.ashtabulacounty.us/ContactUs.aspx" target="_blank" rel="noreferrer" className="text-xs text-white opacity-80 hover:text-[#d4af37] transition">County Contact</a>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-white border-opacity-20 text-center">
            <p className="text-xs text-white opacity-60">
              © 2026 Ashtabula County Government | Official Transparency Portal | Serving Ashtabula residents since 1807
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
