/**
 * scrollReveal.js — Intersection Observer-based reveal utility
 * Used by the Ashtabula County Data Board site for scroll-triggered animations.
 * Subtle, respectful, accessibility-aware.
 */

/**
 * Initialize scroll-reveal on elements matching the given selector.
 * @param {string} selector - CSS selector for elements to reveal
 * @param {number} threshold - Intersection ratio (0-1) to trigger reveal
 * @param {string} rootMargin - Margin around the root (default: '0px 0px -40px 0px')
 */
export function initScrollReveal(selector = '.reveal', threshold = 0.15, rootMargin = '0px 0px -40px 0px') {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold, rootMargin }
  );

  elements.forEach((el) => observer.observe(el));
}
