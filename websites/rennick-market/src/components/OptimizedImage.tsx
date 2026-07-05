import { useRef, useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
  /** For background-image mode (covers entire container) */
  asBackground?: boolean;
  /** Optional smaller version for mobile/slow connections */
  srcMed?: string;
  /** Fade-in duration in ms. 0 = instant */
  fadeIn?: number;
}

/**
 * OptimizedImage — responsive WebP with PNG fallback, lazy loading, fade-in.
 *
 * Two modes:
 *   1. Background image (asBackground=true): uses CSS background-image with
 *      lazy IntersectionObserver triggering the load.
 *   2. <picture> element (default): uses <picture> with WebP/PNG sources.
 */
export default function OptimizedImage({
  src,
  fallback,
  alt,
  className = '',
  asBackground = false,
  srcMed,
  fadeIn = 400,
}: OptimizedImageProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);

  // Lazy load observer
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Preload image once inView is true
  useEffect(() => {
    if (!inView) return;
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(true); // show PNG fallback even on error
    img.src = src;
  }, [inView, src]);

  if (asBackground) {
    // Background-image mode — used for hero banners, section backgrounds
    return (
      <div
        ref={ref}
        role="img"
        aria-label={alt}
        className={className}
        style={{
          backgroundImage: inView ? `url("${src}")` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: loaded ? 1 : 0,
          transition: `opacity ${fadeIn}ms ease-in-out`,
        }}
      />
    );
  }

  // <picture> element mode — for inline images
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: loaded ? 1 : 0,
        transition: `opacity ${fadeIn}ms ease-in-out`,
      }}
    >
      {inView && (
        <picture>
          {srcMed && (
            <source
              media="(max-width: 768px)"
              srcSet={fallback ? `${srcMed}, ${fallback} 2x` : srcMed}
            />
          )}
          <source srcSet={src} type="image/webp" />
          <img
            src={fallback}
            alt={alt}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </picture>
      )}
    </div>
  );
}
