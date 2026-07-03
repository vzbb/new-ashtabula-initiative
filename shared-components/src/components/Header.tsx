import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps {
  title: string;
  logo?: React.ReactNode;
  navItems: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
  variant?: 'light' | 'dark' | 'transparent';
}

export const Header: React.FC<HeaderProps> = ({
  title,
  logo,
  navItems,
  ctaLabel,
  ctaHref,
  variant = 'light'
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const bgClass = {
    light: 'bg-white border-b border-slate-200',
    dark: 'bg-slate-900',
    transparent: 'bg-transparent'
  }[variant];

  const textClass = {
    light: 'text-slate-900',
    dark: 'text-white',
    transparent: 'text-white'
  }[variant];

  const logoTextClass = {
    light: 'text-blue-800',
    dark: 'text-white',
    transparent: 'text-white'
  }[variant];

  return (
    <header className={`${bgClass} sticky top-0 z-50`}>
      <nav className="nai-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            {logo || (
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center`}>
                <span className="text-white font-bold text-sm">NAI</span>
              </div>
            )}
            <span className={`font-bold text-xl ${logoTextClass}`}>{title}</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm font-medium ${textClass} hover:text-blue-600 transition-colors`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            {ctaLabel && ctaHref && (
              <a
                href={ctaHref}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors shadow-sm"
              >
                {ctaLabel}
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={`lg:hidden p-2 rounded-lg ${variant === 'light' ? 'text-slate-600 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200/20">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-base font-medium ${textClass} hover:text-blue-600 transition-colors px-2 py-1`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              {ctaLabel && ctaHref && (
                <a
                  href={ctaHref}
                  className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {ctaLabel}
                </a>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
