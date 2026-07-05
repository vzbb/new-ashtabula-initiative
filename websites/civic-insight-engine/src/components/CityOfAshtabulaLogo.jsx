/**
 * CityOfAshtabulaLogo.jsx
 * Ashtabula County Transparency Portal logo lockup
 *
 * Props:
 * - size: number (default: 50) controls the rendered height of the logo
 * - showText: boolean (default: true)
 * - className: string
 */

export default function CityOfAshtabulaLogo({ size = 50, showText = true, className = '' }) {
  const imageWidth = Math.round(size * 3.2);
  const logoSrc = `${import.meta.env.BASE_URL}county-logo.png`;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={logoSrc}
        alt="Ashtabula County Government"
        width={imageWidth}
        height={size}
        className="flex-shrink-0 object-contain"
        style={{ width: `${imageWidth}px`, height: `${size}px` }}
      />

      {showText && (
        <div className="flex flex-col">
          <span className="font-semibold text-lg text-[#1e3a5f] leading-tight tracking-tight">
            Ashtabula County Government
          </span>
          <span className="text-xs text-[#64748b] uppercase tracking-wider font-medium">
            Transparency Portal
          </span>
        </div>
      )}
    </div>
  );
}
