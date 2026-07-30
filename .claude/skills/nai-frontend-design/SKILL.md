---
name: nai-frontend-design
description: The NAI aesthetic standard for MVP frontends — what "looks expensive enough to sell" means concretely, and what is deliberately out of scope. Use when implementing or verifying any NAI site UI, choosing layout/type/color, designing loading, empty, and error states, or judging whether a build's visual quality clears the pitch bar.
---

# NAI Frontend Design Standard

## What these products are

Unpaid demonstration MVPs built to convince one specific buyer that a real
product is possible and that we can build it. The buyer sees the site for perhaps
sixty seconds, often on a phone, often skeptical. So the bar is **credibility at a
glance**, not compliance completeness.

That cuts both ways, and both directions are enforced:

- An MVP that works perfectly but looks like an unstyled class project **fails**.
  Ugly is a product defect here, not a nitpick.
- An MVP held back over WCAG contrast ratios, screen-reader landmarks, or Safari
  15 flexbox quirks is **wasted effort**. Nobody is paying for that yet.

## The standard (all gating)

**First impression.** Within five seconds a stranger must understand what this
does and for whom. One clear headline in the buyer's own vocabulary, one obvious
primary action. No throat-clearing hero copy.

**Typography.** One or two families, deliberate scale (roughly 1.25–1.5 ratio),
body text 16px+, line-height ~1.5, line length ~60–80 characters. Headings
visibly distinct in weight and size, not just bigger. Consistent scale across
pages — no ad-hoc font sizes.

**Space and rhythm.** A consistent spacing unit (8px works). Generous whitespace
around the hero and between sections. Nothing crammed against a viewport edge —
real page padding on mobile. Aligned edges; a visible grid even if implicit.

**Color.** Take the palette from the brandkit. One dominant neutral, one brand
color, one accent for action. Backgrounds mostly neutral; saturated color used for
emphasis, not for decoration. Never leave default browser blue links or unstyled
form controls in a buyer-facing view.

**Surfaces.** Consistent border radius and one shadow language. Cards, inputs, and
buttons must look like members of the same family.

**Content.** Real, buyer-specific copy from the research. Every "Lorem ipsum",
"Your Company Here", stock placeholder, or generic AI phrasing ("Unlock the power
of…", "Seamlessly streamline…") is a defect. Numbers and examples should reflect
this buyer's actual county, forms, services, and costs.

**States are designed, not accidental.** Loading (skeleton or authored
transition — never a blank white flash), empty ("No permits filed yet" with a
next step, not an empty div), error (a human sentence, not a raw stack trace or
silent failure), success (visible confirmation). For long AI generation, an
authored waiting experience — see the shared-API guidance rather than pretending
transport streaming removes model latency.

**Imagery.** Purposeful, on-palette, and sharp. No stretched or pixelated assets,
no clip-art, no emoji standing in for icons in a civic or professional tool. Text
over imagery needs a scrim or it doesn't ship.

**Mobile is not broken.** One check at ~390px wide: no horizontal scroll, no
overlapping text, tap targets not microscopic, nav usable. That is the whole
mobile requirement.

**No leaked parent identity.** No other buyer's name, logo, palette, or copy
anywhere — in the UI, the title, the favicon, or the metadata. This is a
credibility failure, and it is a hard fail.

## Deliberately out of scope

Do not spend time on, and do not fail a gate for:

- WCAG AA/AAA contrast math (beyond text that is plainly hard to read), ARIA
  authoring beyond sane semantic HTML, or screen-reader walkthroughs;
- legacy or niche browser support, vendor prefixing, print stylesheets;
- exotic viewports beyond one phone and one desktop width;
- `prefers-reduced-motion`, i18n/RTL, SEO beyond a correct `<title>`;
- Lighthouse scores, bundle-size micro-optimization, pixel-perfect cross-browser
  font rendering;
- test coverage for a demo's presentational components.

Note such observations as **advisory** in the handoff if they are cheap to
mention. Never convert one into a blocker.

## Integrity limits (never negotiable)

No fabricated proof: no invented testimonials, no fake customer logos, no
made-up statistics presented as measured, no AI-generated headshots posing as
real staff, no claimed integrations that do not exist. A demo may be clearly
illustrative; it may not manufacture evidence about a real business or person.
Label sample data as sample where a buyer could mistake it for live data.

## Using it as an implementer

Read the brandkit first and treat it as the source of palette, type, and voice.
Build the smallest change that clears the standard above. Then look at your own
screenshots as a skeptical buyer would — `./nai screenshots --slugs <slug>` —
before claiming the interaction works.

## Using it as a verifier

Judge in this order, and report findings in this order:

1. **Credibility** — would this embarrass us in a live pitch? Be specific:
   "hero headline is generic, buyer's county never named", not "needs polish".
2. **Primary action** — does the main flow visibly work, with real output?
3. **Designed states** — validation, empty, error, loading.
4. **Mobile not broken** — the one 390px check.
5. **Identity hygiene** — no leaked parent, correct title and favicon.

Fail for aesthetic failures at the level of "a buyer would not believe this is a
real product". Do not fail for items in the out-of-scope list — list them as
advisory notes and move on. Quote what you saw, name the screenshot, and say
plainly what you could not test.
