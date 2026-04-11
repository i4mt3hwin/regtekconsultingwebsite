# Site Structure — Regtek Consulting

## Sitemap (final)

```
/
├── /about
├── /services
│   ├── /services/google-ads
│   ├── /services/meta-ads
│   └── /services/website-design
├── /contact
└── /blog
    ├── /blog/category/case-studies-results
    ├── /blog/category/general
    ├── /blog/category/website-conversion-optimization
    └── /blog/[post-slug]   (9 posts)
```

**Total: 20 URLs** (8 core + 1 blog index + 3 categories + 9 posts, with 3 redirect-only legacy paths: `/google-ads`, `/meta-ads`, `/website-design`, plus `/tips-tricks` → `/blog`)

## Navigation

### Main nav (desktop)
```
[Logo] | Services ▾ | About | Blog | Contact [CTA button]
```

**Services dropdown:**
- Google Ads
- Meta Ads
- Website Design & CRO
- (divider)
- All Services →

### Mobile nav
Hamburger → full-screen overlay with same items stacked. CTA button persistent at bottom.

### Footer
```
Column 1: Brand
  - Regtek logo
  - Tagline: "Data-Driven Marketing. Real Results."
  - Brief founder credit
  - Social links (if provided)

Column 2: Services
  - Google Ads
  - Meta Ads
  - Website Design & CRO

Column 3: Company
  - About
  - Blog
  - Contact
  - (Privacy Policy — placeholder, Kevin adds post-launch)

Column 4: Get Started
  - "Book a Free Consultation" CTA button
  - Email: kdillon@regtekconsulting.com
```

## Internal Linking Rules

| Page | Outbound Links |
|------|----------------|
| **Homepage** | All 3 service pages, About, 2-3 hero blog posts (dermatology case study, MedSpa ROI, Why I Started Regtek), Contact |
| **About** | Services hub, "Why I Started Regtek Consulting" blog post, Contact |
| **Services hub** | All 3 service pages, Contact |
| **/services/google-ads** | Dermatology lead case study (inline), "Marketing Leads Not Converting" post, Contact, Services hub (breadcrumb) |
| **/services/meta-ads** | MedSpa ROI case study (inline), Google Business Profile post, Contact, Services hub (breadcrumb) |
| **/services/website-design** | CRO Healthcare post, 7 Conversion Killers post, Contact, Services hub (breadcrumb) |
| **Contact** | About (trust-building), Services hub |
| **Blog index** | All 9 posts with category filters, About, Contact |
| **Blog posts** | 2-3 related posts (same category), the most relevant service page, Contact CTA |
| **Blog categories** | All posts in category, Blog index (breadcrumb), related services |

### Breadcrumb logic
- Service pages: Home › Services › {service name}
- Blog posts: Home › Blog › {category} › {post title}
- Blog categories: Home › Blog › {category}
- Core pages (About, Contact): no breadcrumbs (flat)

## URL Structure Rules

- All lowercase
- Hyphens for word separation
- **Trailing slashes:** decide once — **chosen: NO trailing slashes** (matches Astro default + cleaner redirects)
- No file extensions
- Max depth: 3 levels (`/blog/category/case-studies-results` is the deepest)

## Redirects (`public/_redirects` for Cloudflare Pages)

```
# Service page URL restructure
/google-ads        /services/google-ads        301
/google-ads/       /services/google-ads        301
/meta-ads          /services/meta-ads          301
/meta-ads/         /services/meta-ads          301
/website-design    /services/website-design    301
/website-design/   /services/website-design    301

# Blog rename
/tips-tricks       /blog                       301
/tips-tricks/      /blog                       301

# Blog post slug cleanup
/blog/seo-strategy-basics-h1-meta-titles-descriptions-healthcare-6   /blog/seo-strategy-basics   301
/blog/seo-strategy-basics-h1-meta-titles-descriptions-healthcare-6/  /blog/seo-strategy-basics   301

# Clutter cleanup
/sample-page       /                           301
/sample-page/      /                           301
/coming-soon       /                           301
/coming-soon/      /                           301

# Old home alias
/home              /                           301

# Strip trailing slashes globally (Astro default handles this too)
/*/ /:splat 301
```

## Schema Markup Plan

Business is `ProfessionalService` (marketing consultancy) — not `LocalBusiness` since Regtek is vertical-specialized, not location-based.

| Page Type | Schema Types |
|-----------|-------------|
| All pages | `Organization` (Regtek Consulting) in every `<head>` via the base layout |
| Homepage | `Organization` + `WebSite` with `SearchAction` (if blog search is added) |
| About | `AboutPage` + `Person` (Kevin Dillon, founder, with `jobTitle`, `worksFor`, `alumniOf` optional) |
| Services hub | `CollectionPage` with `hasPart` linking to each service |
| Service page | `Service` with `provider` = Regtek, `areaServed` = "United States", `serviceType` |
| Contact | `ContactPage` + `ContactPoint` (email) |
| Blog index | `Blog` + `ItemList` of recent posts |
| Blog post | `Article` (or `BlogPosting`) with `author` = Kevin Dillon, `datePublished`, `dateModified`, `image`, `headline`, `publisher` |
| Blog category | `CollectionPage` + `ItemList` |

### Organization schema (global)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Regtek Consulting",
  "url": "https://www.regtekconsulting.com",
  "logo": "https://www.regtekconsulting.com/images/regtek-logo.png",
  "founder": {
    "@type": "Person",
    "name": "Kevin Dillon",
    "jobTitle": "Founder"
  },
  "description": "Founder-led digital marketing for healthcare practices. Google Ads, Meta Ads, and conversion-optimized web design.",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "kdillon@regtekconsulting.com"
  },
  "areaServed": "United States",
  "knowsAbout": [
    "Healthcare Marketing",
    "Medical Practice Marketing",
    "Dermatology Marketing",
    "Medical Spa Marketing",
    "Google Ads",
    "Meta Ads",
    "Conversion Rate Optimization"
  ]
}
```

### Article schema template (per blog post)

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{post title}",
  "image": "{featured image URL}",
  "datePublished": "{ISO date}",
  "dateModified": "{ISO date}",
  "author": {
    "@type": "Person",
    "name": "Kevin Dillon",
    "url": "https://www.regtekconsulting.com/about"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Regtek Consulting",
    "logo": { "@type": "ImageObject", "url": "https://www.regtekconsulting.com/images/regtek-logo.png" }
  },
  "description": "{meta description}",
  "mainEntityOfPage": "{canonical URL}"
}
```

## Sitemap.xml + robots.txt

- Generate `sitemap.xml` via Astro's `@astrojs/sitemap` integration at build time
- `robots.txt` — allow all, point to sitemap:
```
User-agent: *
Allow: /

Sitemap: https://www.regtekconsulting.com/sitemap-index.xml
```

## Accessibility baseline

- All images have `alt` text (from WP export where available, manually added where missing)
- Real semantic `<h1>` on every page (fix the Bricks display-span issue)
- Contrast: fix the dark-on-dark services CTA band (identified in visual-spec.md)
- Forms: labels wired to inputs via `for`/`id`
- Keyboard navigation: skip-to-content link at top

## Performance budget

- LCP < 2.5s (helped by system fonts and Cloudflare CDN)
- CLS < 0.1
- TBT < 200ms
- Total page weight: <500KB for service pages, <1MB for homepage (hero imagery)
- WebP images with AVIF fallback
- Lazy-load below-the-fold images
- No blocking JS in `<head>`
