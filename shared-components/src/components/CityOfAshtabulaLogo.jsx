/**
 * CityOfAshtabulaLogo.jsx
 * Municipal Shield Logo with Lighthouse Silhouette
 * 
 * Props:
 * - size: number (default: 50)
 * - showText: boolean (default: true)
 * - className: string
 */

export default function CityOfAshtabulaLogo({ size = 50, showText = true, className = '' }) {
  const scale = size / 50;
  
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Shield Logo SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Shield Background */}
        <path
          d="M25 2 L5 10 V22 C5 35 25 48 25 48 C25 48 45 35 45 22 V10 L25 2Z"
          fill="#1e3a5f"
          stroke="#d4af37"
          strokeWidth="1.5"
        />
        
        {/* Inner Shield Border */}
        <path
          d="M25 5 L8 12 V22 C8 33 25 44 25 44 C25 44 42 33 42 22 V12 L25 5Z"
          fill="none"
          stroke="#d4af37"
          strokeWidth="0.5"
          opacity="0.6"
        />
        
        {/* Lighthouse Base */}
        <rect x="20" y="28" width="10" height="12" fill="#ffffff" />
        
        {/* Lighthouse Tower */}
        <rect x="22" y="16" width="6" height="12" fill="#ffffff" />
        
        {/* Lighthouse Top */}
        <path
          d="M21 16 L25 10 L29 16 Z"
          fill="#d4af37"
        />
        
        {/* Light Beam */}
        <path
          d="M25 12 L35 8 L25 10 Z"
          fill="#d4af37"
          opacity="0.8"
        />
        <path
          d="M25 12 L15 8 L25 10 Z"
          fill="#d4af37"
          opacity="0.6"
        />
        
        {/* Lighthouse Door */}
        <rect x="23" y="34" width="4" height="6" fill="#1e3a5f" />
        
        {/* Lighthouse Window */}
        <rect x="24" y="20" width="2" height="3" fill="#1e3a5f" />
        
        {/* Waves at bottom */}
        <path
          d="M8 38 Q14 35 20 38 T32 38 T42 36"
          stroke="#d4af37"
          strokeWidth="1"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M10 42 Q16 39 22 42 T34 42 T40 40"
          stroke="#d4af37"
          strokeWidth="0.8"
          fill="none"
          opacity="0.6"
        />
      </svg>
      
      {/* Text beside logo */}
      {showText && (
        <div className="flex flex-col">
          <span className="font-semibold text-lg text-[#1e3a5f] leading-tight tracking-tight">
            City of Ashtabula
          </span>
          <span className="text-xs text-[#64748b] uppercase tracking-wider font-medium">
            Official Government Portal
          </span>
        </div>
      )}
    </div>
  );
}
