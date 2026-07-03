import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from './Button';

interface HeroProps {
  headline: string;
  subheadline?: string;
  primaryCta?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  secondaryCta?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  backgroundImage?: string;
  showScrollIndicator?: boolean;
  variant?: 'centered' | 'split';
  children?: React.ReactNode;
}

export const Hero: React.FC<HeroProps> = ({
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  backgroundImage,
  showScrollIndicator = true,
  variant = 'centered',
  children
}) => {
  const bgStyle = backgroundImage 
    ? { backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.8)), url(${backgroundImage})` }
    : {};

  return (
    <section 
      className={`relative min-h-[80vh] flex items-center justify-center ${backgroundImage ? 'bg-cover bg-center bg-no-repeat' : 'bg-gradient-to-br from-slate-900 to-slate-800'}`}
      style={bgStyle}
    >
      <div className="nai-container py-20 lg:py-32">
        <div className={`max-w-4xl ${variant === 'centered' ? 'mx-auto text-center' : ''}`}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
            {headline}
          </h1>
          
          {subheadline && (
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl mx-auto">
              {subheadline}
            </p>
          )}
          
          {(primaryCta || secondaryCta) && (
            <div className={`flex flex-col sm:flex-row gap-4 ${variant === 'centered' ? 'justify-center' : ''}`}>
              {primaryCta && (
                primaryCta.onClick ? (
                  <Button 
                    size="lg" 
                    onClick={primaryCta.onClick}
                    rightIcon={<ArrowRight size={18} />}
                  >
                    {primaryCta.label}
                  </Button>
                ) : (
                  <a href={primaryCta.href}>
                    <Button 
                      size="lg" 
                      rightIcon={<ArrowRight size={18} />}
                    >
                      {primaryCta.label}
                    </Button>
                  </a>
                )
              )}
              
              {secondaryCta && (
                secondaryCta.onClick ? (
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={secondaryCta.onClick}
                    className="border-white text-white hover:bg-white hover:text-slate-900"
                  >
                    {secondaryCta.label}
                  </Button>
                ) : (
                  <a href={secondaryCta.href}>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-white text-white hover:bg-white hover:text-slate-900"
                    >
                      {secondaryCta.label}
                    </Button>
                  </a>
                )
              )}
            </div>
          )}
          
          {children}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-white/60" size={32} />
        </div>
      )}
    </section>
  );
};
