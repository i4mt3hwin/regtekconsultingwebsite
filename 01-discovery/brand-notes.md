# Brand Notes — Regtek Consulting

> Extracted from the live site's screenshots, computed CSS, and copy on 2026-04-10. This is the brand identity to preserve (or intentionally evolve) in the rebuild.

---

## Colors

| Role | Hex | Usage |
|------|-----|-------|
| **Primary brand** | `#06B6D4` | Logo, headings on white, links, hover states — Tailwind `cyan-500` |
| **Primary CTA** | `#0E7490` | All main buttons, dark section backgrounds — Tailwind `cyan-700` |
| **Near-black text** | `#0A0A0B` | Body copy, dark headings |
| **Footer dark** | `#1F2937` | Footer background — Tailwind `gray-800` |
| **Light gray (alt bg)** | `#F3F4F6` | Alternating section backgrounds — `gray-100` |
| **Hero gray** | `#F7F7F7` | Hero section background |
| **Secondary text** | `#6B7280` | Muted copy — `gray-500` |
| **Borders** | `#D1D5DB` | Dividers, form borders — `gray-300` |
| **Light text on dark** | `#F3F4F6` | Copy over cyan/dark backgrounds |
| **Success state** | `#047857` | Form success — `emerald-700` |

**Palette summary:** Cyan + near-black + grayscale. Clean, technical, data-forward. Zero warm accents. Maps 1:1 to stock Tailwind v4 tokens — no custom color config needed.

---

## Typography

**Strategy:** **System font stack only.** No Google Fonts loaded. No custom webfonts. This is a deliberate performance choice — preserve it in the rebuild.

```
system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif
```

| Element | Size | Weight | Notes |
|---------|------|--------|-------|
| Body | 16px | 400 | 1.4 line-height |
| H1 (display) | ~48-60px | 700 | Currently rendered via non-semantic span in Bricks — rebuild with real `<h1>` |
| H2 | 39-42px | 700 | Varies by section; `cyan-500` when on white, `near-black` on light gray |
| H3 | 32-45px | 700 | Case study blocks use 45px |
| Link | 16px | 400 | `cyan-500`, underlined |

---

## Logo

- **File:** `cropped-Regtek-Consulting-Logo.png` (available in `06-content/images/client-provided/`)
- **Alt variant found:** `cropped-Regtek-Consulting-Logo-1.png`
- **Treatment:** Image-based header logo, ~130px header height
- **No dark-mode variant found** in the media library — if rebuild uses dark hero sections, may need a white variant

---

## Voice & Tone

### Personality
- **Direct, plain-spoken, no-fluff.** "We don't do cookie-cutter marketing." "No jargon, just proven strategies."
- **Founder-first, personal.** First-person ("Hi, I'm Kevin Dillon…"), not corporate "we-speak"
- **Results-framed.** Every claim tied to a specific outcome (revenue, bookings, patients, ROAS)
- **Business-partner, not vendor.** "True strategic partner, not just an ad buyer."
- **Pain-aware.** Acknowledges the specific reader's pain ("word-of-mouth ceiling", "feast-or-famine", "clicks not customers")

### Recurring rhetorical patterns
- **"Most agencies do X. We do Y."** — frequent differentiation frame
- **Three-part proof triples** — "63%+ Growth · 2,000+ Conversions · $100K+ Managed" repeated across pages
- **Specific numbers over adjectives** — never says "a lot of conversions"; says "2,000+"
- **Healthcare-specific vocabulary** — "patients", "practices", "providers" used confidently; signals vertical credibility

### Taglines / recurring phrases
- "Data-Driven Marketing. Real Results." (footer)
- "Turn Your Marketing Into Predictable Revenue" (homepage H1)
- "Your Website Should Be Your Best Salesperson"
- "Stop Guessing. Start Growing." (final CTA)

### Voice guardrails for the rebuild
- **Keep:** first-person founder framing, specific numbers, pain-acknowledgment, healthcare vocabulary
- **Avoid:** corporate "we-speak", generic agency jargon ("leverage synergies"), vague superlatives ("best-in-class")
- **Upgrade opportunity:** some pages lean hard on the exact same proof triple — in the rebuild, rotate through different stats on different pages so it doesn't feel copy-pasted

---

## Image Style

### What's in the WP media library (144 files)
- **Founder photo** — Kevin Dillon headshot (look for in media library)
- **Testimonial photo** — Elise Basinger, others
- **Charts & data visualizations** — Channel Performance, CRO Conversion Funnel, Cost Per Lead Dermatology, First Visit Metrics, Accurate Lead Tracking, etc. (conversion/analytics dashboards)
- **AI-generated imagery** — several `Gemini_Generated_Image_*` files (indicates AI-image comfort, OK to use in rebuild)
- **Stock-style healthcare imagery** — Busy Medical Office, CRO Optimization For Healthcare
- **Logo variants** — Regtek logo + cropped versions
- **Decorative overlays** — Background White Overlay, CTA Pattern Overlay

### Style guardrails for the rebuild
- **Technical / data-driven imagery** (dashboards, charts, funnels) — the site leans into "we measure everything" proof
- **Healthcare environment imagery** — clean, modern medical office / provider scenes
- **Founder as protagonist** — Kevin's headshot is the primary human face; no generic stock people in the hero
- **AI-generated imagery is acceptable** — precedent exists in the media library
- **Avoid:** generic "handshake" agency stock, cliché "business meeting around laptop" shots, disembodied-hands-on-keyboard

---

## Brand Refresh or Preserve?

**Recommendation: PRESERVE, with polish.**

The existing brand identity is clean, cohesive, and intentional. The cyan + near-black palette, system fonts, founder-first voice, and data-driven imagery all work together. Nothing feels dated or off-brand.

What the rebuild should fix (not change):
1. **Fix the contrast issue on the CTA band** (dark heading on dark cyan)
2. **Use real semantic `<h1>`** instead of display spans
3. **Rotate proof triples** across pages so it doesn't feel copy-pasted
4. **Consolidate two logo variants** into one canonical file
5. **Add a dark-mode logo variant** if the new design uses dark hero sections

**Confirm with Kevin:** is there any element he wants to intentionally refresh (e.g., swap the cyan for a different color, introduce a serif display font, etc.), or should the rebuild match the current identity?
