# Event Permit Express — Brand Assets & Usage Guide

## Target
**Ashtabula County Fairgrounds** — Ashtabula, Ohio
**Slug:** event-permit

## Hero Photography Assets

4 high-quality hero photographs of the Ashtabula County Fairgrounds, generated for the Event Permit Express MVP. Images are web-optimized (WebP) and designed for use as backgrounds under glassmorphism overlays.

### Asset Inventory

| File | Subject | Format | Dimensions | Size |
|------|---------|--------|------------|------|
| `assets/expo-center-hero.png` | Expo Center exterior, wide establishing shot | PNG | 1693×929 | 2.6 MB |
| `assets/expo-center-hero.webp` | Expo Center exterior (web-optimized) | WebP | 1693×929 | 315 KB |
| `assets/grandstand-hero.png` | Grandstand seating with racetrack/arena | PNG | 1884×835 | 2.6 MB |
| `assets/grandstand-hero.webp` | Grandstand (web-optimized) | WebP | 1884×835 | 311 KB |
| `assets/pavilion-hero.png` | Covered pavilion with green grounds | PNG | 1536×1024 | 3.6 MB |
| `assets/pavilion-hero.webp` | Pavilion (web-optimized) | WebP | 1536×1024 | 513 KB |
| `assets/panoramic-hero.png` | Aerial fairgrounds panorama | PNG | 1920×819 | 2.8 MB |
| `assets/panoramic-hero.webp` | Aerial panorama (web-optimized) | WebP | 1920×819 | 336 KB |

### Image Subjects Covered
1. **Expo Center** — modern event building exterior, glass entrance, bright setting
2. **Grandstand** — classic fairground grandstand with arena/racetrack foreground
3. **Pavilion** — open-air covered pavilion with picnic grounds and mature trees
4. **Panoramic** — aerial view showing fairgrounds layout with all major structures

### Glassmorphism Usage
All images are intentionally **bright, wide, and with clear subjects** — optimized for glassmorphism overlay backgrounds. Recommended CSS pattern:

```css
.hero {
  background: url('/event-permit/assets/expo-center-hero.webp') center/cover no-repeat;
  position: relative;
}
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
```

### Visual Direction
- Bright, sunny daylight aesthetic
- Vibrant greens and blues
- Clear central subjects per image
- Wide composition allows text overlay on either side
- No stock-photo clichés — distinct midwestern fairgrounds character

### Recommended Hero Sections
- **`expo-center-hero.webp`** — main landing page hero (most recognizable fairgrounds building)
- **`grandstand-hero.webp`** — event listing/calendar section (evokes fairgrounds atmosphere)
- **`pavilion-hero.webp`** — picnic/permit application section (approachable outdoor feel)
- **`panoramic-hero.webp`** — about/location section (shows scale of venue)
