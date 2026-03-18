import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin';
  href: string;
}

interface FooterProps {
  brand: string;
  tagline?: string;
  columns?: FooterColumn[];
  socials?: SocialLink[];
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  legalLinks?: FooterLink[];
  variant?: 'light' | 'dark';
}

const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin
};

export const Footer: React.FC<FooterProps> = ({
  brand,
  tagline,
  columns = [],
  socials = [],
  contact,
  legalLinks = [],
  variant = 'dark'
}) => {
  const bgClass = variant === 'light' 
    ? 'bg-slate-50 border-t border-slate-200' 
    : 'bg-slate-900';
  
  const textClass = variant === 'light' ? 'text-slate-600' : 'text-slate-400';
  const headingClass = variant === 'light' ? 'text-slate-900' : 'text-white';
  const borderClass = variant === 'light' ? 'border-slate-200' : 'border-slate-800';

  return (
    <footer className={`${bgClass} pt-16 pb-8`}>
      <div className="nai-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <span className="text-white font-bold text-sm">NAI</span>
              </div>
              <span className={`font-bold text-xl ${headingClass}`}>{brand}</span>
            </a>
            {tagline && (
              <p className={`${textClass} text-sm leading-relaxed mb-6 max-w-xs`}>
                {tagline}
              </p>
            )}
            
            {/* Social Links */}
            {socials.length > 0 && (
              <div className="flex gap-4">
                {socials.map((social) => {
                  const Icon = socialIcons[social.platform];
                  return (
                    <a
                      key={social.platform}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg ${variant === 'light' ? 'bg-white hover:bg-slate-100' : 'bg-slate-800 hover:bg-slate-700'} transition-colors`}
                      aria-label={social.platform}
                    >
                      <Icon size={18} className={variant === 'light' ? 'text-slate-600' : 'text-slate-400'} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation Columns */}
          {columns.map((column, index) => (
            <div key={column.title} className="lg:col-span-2">
              <h3 className={`font-semibold text-sm uppercase tracking-wider ${headingClass} mb-4`}>
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={`text-sm ${textClass} hover:text-blue-600 transition-colors`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          {contact && (
            <div className="lg:col-span-4">
              <h3 className={`font-semibold text-sm uppercase tracking-wider ${headingClass} mb-4`}>
                Contact
              </h3>
              <ul className="space-y-3">
                {contact.email && (
                  <li className="flex items-start gap-3">
                    <Mail size={18} className={`${textClass} mt-0.5 flex-shrink-0`} />
                    <a 
                      href={`mailto:${contact.email}`}
                      className={`text-sm ${textClass} hover:text-blue-600 transition-colors`}
                    >
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.phone && (
                  <li className="flex items-start gap-3">
                    <Phone size={18} className={`${textClass} mt-0.5 flex-shrink-0`} />
                    <a 
                      href={`tel:${contact.phone}`}
                      className={`text-sm ${textClass} hover:text-blue-600 transition-colors`}
                    >
                      {contact.phone}
                    </a>
                  </li>
                )}
                {contact.address && (
                  <li className="flex items-start gap-3">
                    <MapPin size={18} className={`${textClass} mt-0.5 flex-shrink-0`} />
                    <span className={`text-sm ${textClass}`}>
                      {contact.address}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className={`mt-12 pt-8 border-t ${borderClass}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className={`text-sm ${textClass}`}>
              © {new Date().getFullYear()} {brand}. All rights reserved.
            </p>
            {legalLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-6">
                {legalLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`text-sm ${textClass} hover:text-blue-600 transition-colors`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
