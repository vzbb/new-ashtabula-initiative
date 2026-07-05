# Photography and Asset References

## Source Files
All photography and pattern assets originate from `branding_research/compassionate/` and are copied to `public/` at build time.

## Image Assets in `public/`

| File | Source | Usage |
|------|--------|-------|
| `hero.webp` | `branding_research/compassionate/hero.webp` | Hero section background — Lake Erie shoreline at golden hour |
| `hero-1280.webp` | `branding_research/compassionate/hero-1280.webp` | Hero background mobile/tablet fallback |
| `chapel.webp` | `branding_research/compassionate/chapel.webp` | Trust section image — warm chapel interior |
| `chapel-1280.webp` | `branding_research/compassionate/chapel-1280.webp` | Trust section mobile/tablet fallback |
| `pattern-warm.webp` | `branding_research/compassionate/assets/pattern-warm.webp` | Feature card background overlay (12% opacity) |
| `pattern-navy.webp` | `branding_research/compassionate/assets/pattern-navy.webp` | Footer background pattern (92% opacity navy overlay blend) |
| `favicon.ico` | `branding_research/compassionate/favicon.ico` | Browser tab icon |

## Image Constants (App.jsx)
All image paths use `import.meta.env.BASE_URL` prefix for Vite base path resolution:
```js
const HERO_SRC = `${import.meta.env.BASE_URL}hero.webp`;
const CHAPEL_SRC = `${import.meta.env.BASE_URL}chapel.webp`;
const PATTERN_SRC = `${import.meta.env.BASE_URL}pattern-warm.webp`;
const PATTERN_NAVY_SRC = `${import.meta.env.BASE_URL}pattern-navy.webp`;
```

## Maintainer Notes
- Images are in WebP format — no fallback PNGs are provided. All modern browsers support WebP.
- The hero image receives a CSS gradient overlay (`.hero-gradient-overlay`) for text readability.
- Hero image `object-position: center 30%` ensures the Lake Erie shoreline visible above text.
- The trust section uses `chapel.webp` inside a flex layout — image is 280px wide on desktop, full-width on mobile.
- Footer applies `pattern-navy.webp` as a CSS `background-image` with a `::before` pseudo-element navy overlay at 92% opacity for readability.
- To add or replace imagery: drop the new WebP into `public/`, update the constant in `App.jsx`, and add the CSS as needed.
