# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

All commands run from `05-build/`:

```bash
npm run dev      # Astro dev server at localhost:4321
npm run build    # Static build to dist/
npm run preview  # Preview built output
```

Node >= 22.12.0 required.

## Architecture

This is a WordPress-to-Astro rebuild for regtekconsulting.com (healthcare digital marketing consultancy).

**Project phases (directories):**
- `01-discovery/` — WP crawl data, screenshots, brand notes, visual spec
- `03-design/` — design tokens
- `04-architecture/` — site structure, URL redirect map
- `05-build/` — **The Astro project** (all source code)
- `06-content/` — Client-provided images (144 files, source assets)

**05-build/src/ structure:**
- `pages/` — Astro page routes (static + dynamic `[slug]` routes)
- `components/` — Header, Footer, SEO, SchemaOrg
- `layouts/BaseLayout.astro` — Master layout wrapping all pages, includes client-side JS for animations (count-up, parallax, scroll reveals, sticky case studies)
- `content/` — Markdoc content collections (posts, services, testimonials) defined in `content.config.ts`
- `lib/site.ts` — All site constants: SITE, NAV, SERVICES, PROOF_STATS, TESTIMONIAL
- `styles/global.css` — Tailwind v4 theme, custom properties, prose styling, animation CSS

## Key Decisions

- **No CMS** — Content is hardcoded in `.astro` templates or in Markdoc `.mdoc` files. No Keystatic, no admin UI.
- **Static output** — `output: 'static'` in astro.config. All pages pre-rendered. Targeting GitHub Pages.
- **No React** — Pure Astro components + vanilla JS for interactivity.
- **System fonts only** — No Google Fonts. Uses `system-ui` stack for performance.
- **Content in templates** — Page-level content (homepage, about, contact, services hub) is hardcoded directly in `.astro` files. Blog posts and service detail body content live in `src/content/` as Markdoc.

## Brand / Design

- **Colors:** `--color-brand: #06B6D4` (cyan-500), `--color-brand-dark: #0E7490` (cyan-700), `--color-brand-darker: #155E75` (cyan-800), `--color-ink: #0A0A0B`
- **Trust strip stats:** 3 values (63%+, 2,000+, $100K+) — displayed as white cards on teal with count-up animation
- **Social proof:** 3 face thumbnails + gold stars + "5 Star Client Reviews" — reused on homepage, services hub, service detail heroes
- **Service detail pages** use a shared `[slug].astro` template with conditional sections per service ID (e.g., `service.id === "google-ads"` for process timeline, case study cards, FAQ)

## Content Collections

Defined in `src/content.config.ts`:
- **posts** — `src/content/posts/*.mdoc` — Blog posts with category enum (`case-studies-results`, `website-conversion-optimization`, `general`)
- **services** — `src/content/services/*.mdoc` — 3 service pages with order field for sorting
- **testimonials** — `src/content/testimonials/*.yaml`

## Animations (in BaseLayout.astro)

All client-side JS lives in a `<script>` block in BaseLayout:
- **Count-up** — Elements with `data-countup` attribute animate numbers on scroll intersection
- **Sticky case studies** — `.cs-scroll-container` sections pin content and animate heading/text/image based on scroll progress
- **Scroll reveals** — `[data-reveal]` elements fade/slide in when visible, reverse when scrolled away
- **Underline scribble** — `.cs-underline-animate` triggers a back-and-forth underline animation
- **Parallax backgrounds** — `[data-parallax-bg]` sections with `.parallax-bg-img` get scroll-linked transform

## Redirects

Old WordPress URLs redirect via `astro.config.mjs` redirects object (e.g., `/google-ads` → `/services/google-ads`, `/tips-tricks` → `/blog`).

## Images

- `public/images/brand/` — Logo files
- `public/images/hero/` — Hero illustrations, Kevin selfie, growth background
- `public/images/services/` — Per-service hero images and illustrations
- `public/images/case-studies/` — Case study dashboard screenshots
- `public/images/posts/` — Blog post featured images
- `public/images/testimonials/` — Social proof face thumbnails
- `06-content/images/client-provided/` — Source assets (not served directly)
