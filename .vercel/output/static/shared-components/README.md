# NAI Shared Component Library

A reusable UI component library for all New Ashtabula Initiative websites.

## Quick Start

```bash
# Copy components to your project
cp -r shared-components/src/components/my-website/src/
cp shared-components/src/styles/design-tokens.css my-website/src/styles/
```

## Design System

### Colors
- **Primary:** `#1e40af` (Blue 800) — Trust, stability
- **Primary Light:** `#3b82f6` (Blue 500) — Hover states
- **Primary Dark:** `#1e3a8a` (Blue 900) — Active states
- **Accent:** `#16a34a` (Green 600) — Success, CTAs
- **Accent Light:** `#22c55e` (Green 500) — Hover states
- **Background:** `#f8fafc` (Slate 50) — Page background
- **Surface:** `#ffffff` — Cards, modals
- **Text Primary:** `#0f172a` (Slate 900)
- **Text Secondary:** `#475569` (Slate 600)

### Typography
- **Headings:** Inter, 700 weight
- **Body:** Inter, 400 weight
- **Scale:** xs (12px) → sm (14px) → base (16px) → lg (18px) → xl (20px) → 2xl (24px) → 3xl (30px) → 4xl (36px)

### Spacing
- **Component padding:** 16px (p-4) to 24px (p-6)
- **Section spacing:** 48px (py-12) to 96px (py-24)
- **Container max-width:** 1280px (max-w-7xl)

## Components

### Header
Responsive header with mobile hamburger menu, navigation links, and CTA button.

```tsx
import { Header } from './components/Header';

<Header 
  title="Invest Ashtabula"
  navItems={[
    { label: 'About', href: '#about' },
    { label: 'Opportunities', href: '#opportunities' },
    { label: 'Contact', href: '#contact' }
  ]}
  ctaLabel="Get Started"
  ctaHref="#contact"
/>
```

### Footer
Multi-column footer with navigation, social links, and copyright.

```tsx
import { Footer } from './components/Footer';

<Footer
  brand="Invest Ashtabula"
  tagline="Building tomorrow's community, today."
  columns={[
    {
      title: 'Resources',
      links: [
        { label: 'Permit Whisperer', href: '/permits' },
        { label: 'Business Guide', href: '/guide' }
      ]
    }
  ]}
  socials={[
    { platform: 'facebook', href: 'https://facebook.com/...' },
    { platform: 'twitter', href: 'https://twitter.com/...' }
  ]}
/>
```

### Button
Primary, secondary, and outline variants with loading state.

```tsx
import { Button } from './components/Button';

<Button variant="primary" size="lg">Get Started</Button>
<Button variant="outline" loading={isSubmitting}>Submit</Button>
```

### Card
Flexible card component with header, content, and footer slots.

```tsx
import { Card } from './components/Card';

<Card 
  title="Feature Title"
  description="Description text"
  icon={<Icon />}
  footer={<Button>Learn More</Button>}
/>
```

### Hero
Full-width hero section with headline, subheadline, and CTAs.

```tsx
import { Hero } from './components/Hero';

<Hero
  headline="Invest in Ashtabula's Future"
  subheadline="Join a growing community of innovators and entrepreneurs."
  primaryCta={{ label: 'Explore Opportunities', href: '#opportunities' }}
  secondaryCta={{ label: 'Learn More', href: '#about' }}
/>
```

## File Structure

```
shared-components/
├── README.md
├── src/
│   ├── styles/
│   │   └── design-tokens.css
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Hero.tsx
│   │   └── index.ts
│   └── hooks/
│       └── useMobileMenu.ts
└── examples/
    └── page-integration.tsx
```

## Integration Guide

See `examples/page-integration.tsx` for a complete page example using all components.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT — Created for Noirsys AI / New Ashtabula Initiative
