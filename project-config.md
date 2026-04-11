# Project Config — Regtek Consulting

## Basics
- **Client:** Regtek Consulting
- **Project Type:** Existing Site Rebuild (WordPress → Cloudflare)
- **Current Domain:** www.regtekconsulting.com
- **Current Stack:** WordPress
- **Target Stack:** Astro + Tailwind CSS v4 + Cloudflare Pages/Workers
- **WP Admin Email:** kdillon@regtekconsulting.com
- **WP App Password:** stored separately (do not commit) — see `.env` / secrets

## Settings (CONFIRMED 2026-04-10)
- **Target Launch:** within next few days
- **Blog Needed:** YES — migrate all existing posts AND keep blogging on new site
- **Contact Form:** YES — Resend, delivers to kdillon@regtekconsulting.com
- **Cloudflare:** account ready, wrangler authenticated on this machine
- **Routing Target:** P1B — Existing Site Migration

## Notes
- Pipeline location: `../Site Builder/pipeline-v2/prompts/`
- WP REST API export is the canonical content source for migration.
- All URLs should be redirect-mapped to prevent 404s post-launch.

## P1B Operator Decisions (confirmed 2026-04-10)

### Drafts
- **Ignore ALL drafts.** Do not migrate any draft content, including:
  - `/coming-soon/` page → cut, redirect to `/`
  - Privacy Policy draft → skip (Kevin will handle separately if needed)
  - "Healthcare Landing Page Design" post draft → discard
  - All 7 "SEO Strategy Basics" iteration drafts → discard
- Only migrate published content.

### New pages (scope cut for now)
- **Do NOT add** Who We Serve, Case Studies hub, FAQ, Process, or /services/seo pages
- Rebuild only maps to existing published pages. Additions are post-launch work.

### Brand
- **Preserve** current brand identity (cyan `#06B6D4` primary, near-black text, gray neutrals)
- **Keep system-font stack** — no Google Fonts, no custom webfonts
- Palette maps to stock Tailwind v4 — no custom tokens beyond what's in the visual spec

### URL Structure
- **Move service pages under `/services/`:**
  - `/google-ads` → `/services/google-ads`
  - `/meta-ads` → `/services/meta-ads`
  - `/website-design` → `/services/website-design`
  - All with 301 redirects from old paths
- Rename `/tips-tricks` → `/blog` (kept as blog index; old URL 301 redirects)

### Infrastructure
- **Newsletter:** none — skip signup wiring (remove or stub out any "Join 2,500+" forms)
- **Contact form:** build markup + fields + validation, but Kevin will wire the Resend backend himself after launch. Leave form submit handler as a TODO stub.
- **Cloudflare/wrangler:** ready on this machine

### Scope
- **Full refresh (Option 3):** rebuild all published content + expand About page + content polish + SEO pass + launch
- Timeline: next few days

### Pages to build in rebuild (final list)
1. `/` — Home
2. `/about` — About (expand with founder timeline, credentials, testimonial rotation)
3. `/services` — Services hub
4. `/services/google-ads`
5. `/services/meta-ads`
6. `/services/website-design`
7. `/contact` — with form markup (Resend backend stubbed)
8. `/blog` — blog index (replaces `/tips-tricks`)
9. `/blog/cro-optimization-healthcare-practices`
10. `/blog/dermatology-lead-cost-case-study`
11. `/blog/google-business-profile-optimization-medical-practices`
12. `/blog/healthcare-website-conversion-killers`
13. `/blog/marketing-leads-not-converting`
14. `/blog/medical-spa-marketing-roi-lifetime-value-case-study`
15. `/blog/provider-intro-videos-medical-practices`
16. `/blog/seo-strategy-basics` (renamed from `...-healthcare-6`)
17. `/blog/why-i-started-regtek-consulting`
18. 3 blog category pages (Case Studies & Results, General, Website & Conversion Optimization)

**Total: ~18 canonical URLs**
