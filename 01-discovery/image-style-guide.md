# Image Style Guide — Regtek Consulting

## Strategy
Technical, data-driven, founder-human. Imagery should reinforce three signals: *we measure everything*, *we understand healthcare*, *you work with a real person*.

## Three image categories

### 1. Data & Dashboard Imagery (~40% of imagery)
Charts, funnels, attribution diagrams, KPI screenshots, conversion-tracking examples.

- Sources: real client dashboards (anonymized), Looker Studio / GA / ad platform screenshots, custom diagrams
- Existing examples in library: `CRO-Conversion-Funnel.webp`, `Cost-Per-Lead-Dermatology.webp`, `First-Visit-Metrics.webp`, `Channel-Performance.webp`, `Accurate-Lead-Tracking.webp`
- **Use on:** service pages (Google Ads, Meta Ads, Website Design), case-study sections, blog posts
- **Tone:** clean, labeled, legible at small sizes

### 2. Healthcare Environment Imagery (~40%)
Clean medical offices, modern clinics, provider-at-work scenes.

- Sources: client photos (preferred), curated stock (Unsplash medical/healthcare), AI-generated where stock feels generic
- Existing examples: `Busy-Medical-Office.webp`, `CRO-Optimization-For-Healthcare-scaled.webp`, `Derm-Leads.png`
- **Style rules:** natural lighting, no stiff posed shots, no dated stock (no 2010-era "doctor with clipboard")
- **Avoid:** overly stocky hospital imagery, generic lab coats, tech-bro "startup office" scenes

### 3. Founder / Human Imagery (~20%)
Kevin Dillon headshots, behind-the-scenes, founder-as-operator framing.

- Kevin's headshot is the primary human face — use on About, Contact, and at least one homepage section
- Existing examples: founder headshot (find in media library), `Elise-Basinger.webp` (testimonial)
- **No generic stock humans** in hero sections — if a real photo isn't available, lean on dashboard imagery instead

## AI-generated imagery policy
**Acceptable** — precedent exists (`Gemini_Generated_Image_*` files in library). Use for:
- Abstract concept illustrations (funnels, data flows, scaling metaphors)
- Backgrounds and decorative overlays
- Situations where stock feels generic and a custom shoot isn't feasible

**Not acceptable:**
- Fake client headshots
- Fake medical imagery that could mislead
- AI imagery that contradicts healthcare regulatory tone

## Color treatment
Images should not fight the cyan/near-black palette. When in doubt:
- Apply a subtle cyan overlay (`#06B6D4` at 10-15% opacity) for brand consistency
- Desaturate overly warm stock photos slightly
- Use `#0E7490` or `#1F2937` as background tints for image composites

## Sizing / formats
- Export WebP with AVIF fallback
- Max width 1920px for hero images, 1200px for content images
- `loading="lazy"` on everything below the fold
- `alt` text must describe the image meaningfully (SEO + accessibility)

## What's already in the library
**144 media files, 33MB total**, including:
- Logo + variants
- Kevin headshot (find it)
- Multiple dashboard/chart images
- Several healthcare environment photos
- A few AI-generated concept images
- Decorative overlays and backgrounds

**Action:** during P03/P04, pull from `06-content/images/client-provided/` first before going to stock.
