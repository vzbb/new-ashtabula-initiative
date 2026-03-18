import React from 'react';

interface CardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  image?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  href?: string;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  icon,
  image,
  children,
  footer,
  href,
  className = '',
  variant = 'default'
}) => {
  const baseClasses = 'rounded-xl overflow-hidden transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-white shadow-sm border border-slate-200 hover:shadow-md',
    outlined: 'bg-white border-2 border-slate-200 hover:border-blue-300',
    elevated: 'bg-white shadow-lg hover:shadow-xl'
  };
  
  const content = (
    <>
      {image && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={image} 
            alt={title || ''} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        {(icon || title) && (
          <div className="flex items-start gap-4 mb-4">
            {icon && (
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                {icon}
              </div>
            )}
            <div className="flex-1">
              {title && (
                <h3 className="font-semibold text-lg text-slate-900 mb-1">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-slate-600 text-sm leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
        )}
        
        {children}
      </div>
      
      {footer && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          {footer}
        </div>
      )}
    </>
  );
  
  if (href) {
    return (
      <a 
        href={href}
        className={`${baseClasses} ${variantClasses[variant]} block hover:-translate-y-1 ${className}`}
      >
        {content}
      </a>
    );
  }
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {content}
    </div>
  );
};
