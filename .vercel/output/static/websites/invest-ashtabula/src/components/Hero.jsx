import React from 'react';
import { ArrowRight, MapPin, TrendingUp, Building2, Network } from 'lucide-react';

const Hero = ({ onViewSites }) => {
  return (
    <div className="relative bg-gradient-to-br from-[#003366] via-[#004080] to-[#003366] text-white overflow-hidden">
      {/* Background Pattern - Network connections */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="network-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="50" r="3" fill="#d4af37" fillOpacity="0.3"/>
              <circle cx="40" cy="30" r="3" fill="#d4af37" fillOpacity="0.3"/>
              <circle cx="60" cy="50" r="3" fill="#d4af37" fillOpacity="0.3"/>
              <circle cx="80" cy="40" r="3" fill="#d4af37" fillOpacity="0.3"/>
              <path d="M20 50 L40 30 L60 50 L80 40" stroke="#d4af37" strokeOpacity="0.2" strokeWidth="0.5" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#network-pattern)" />
        </svg>
      </div>

      <div className="relative max-w-[850px] mx-auto px-6 pt-16 pb-20">
        {/* Logo Header */}
        <div className="flex items-center gap-3 mb-8">
          <svg className="h-10 w-auto" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <path d="M15 25 L35 15 L55 25 L75 20 L95 25" stroke="#d4af37" strokeWidth="2" strokeLinecap="round"/>
              <path d="M35 15 L35 35" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M55 25 L55 35" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="15" cy="25" r="6" fill="#003366" stroke="#d4af37" strokeWidth="2"/>
              <circle cx="35" cy="15" r="6" fill="#003366" stroke="#d4af37" strokeWidth="2"/>
              <circle cx="55" cy="25" r="6" fill="#003366" stroke="#d4af37" strokeWidth="2"/>
              <circle cx="75" cy="20" r="5" fill="#003366" stroke="#d4af37" strokeWidth="2"/>
              <circle cx="95" cy="25" r="6" fill="#003366" stroke="#d4af37" strokeWidth="2"/>
            </g>
          </svg>
          <div>
            <div className="text-white font-bold text-lg leading-tight">Ashtabula</div>
            <div className="text-[#d4af37] text-xs tracking-wider">CHAMBER OF COMMERCE</div>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-[#d4af37]/30 rounded-full px-4 py-1.5 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-[#27ae60] animate-pulse"></span>
            <span className="text-sm font-semibold text-[#d4af37]">Investment Opportunities Available</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Invest in
            <span className="block text-[#d4af37]">Ashtabula's Future</span>
          </h1>

          <p className="text-lg text-white/85 mb-8 max-w-2xl mx-auto leading-relaxed">
            Prime industrial sites with rail, port, and highway access. 
            Shovel-ready properties with competitive incentives and 
            dedicated economic development support from your Chamber.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button
              onClick={onViewSites}
              className="inline-flex items-center justify-center gap-2 bg-[#d4af37] hover:bg-[#e5c158] text-[#003366] font-bold px-8 py-4 rounded-lg transition-all duration-200 group shadow-lg"
            >
              View Available Sites
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/40 hover:border-white/70 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200"
            >
              Contact Chamber
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-6 justify-center text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#d4af37]" />
              <span>Lake Erie Access</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#d4af37]" />
              <span>Opportunity Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#d4af37]" />
              <span>Foreign Trade Zone</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#f5f7fa"/>
        </svg>
      </div>
    </div>
  );
};

export default Hero;