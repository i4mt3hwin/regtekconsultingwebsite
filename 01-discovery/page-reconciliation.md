# Page Reconciliation Report — Regtek Consulting

**Generated:** 2026-04-10
**Sources used:**

| Source | Count | Notes |
|--------|-------|-------|
| WordPress REST (pages) | 11 | 10 published + 1 draft (Privacy Policy) |
| WordPress REST (posts) | 17 | 8 published + 9 drafts — 8 of the drafts are duplicates of one "SEO Strategy Basics" post |
| WordPress REST (categories) | 13 | Only 3 have actual posts attached — rest are unused taxonomy entries |
| Sitemap (`/sitemap_index.xml`, `/wp-sitemap.xml`) | 20 URLs | Two sitemap infrastructures present (likely Yoast + WP core) |
| Playwright spider crawl | 38 entries (~20 unique) | Doubled due to trailing-slash variants |
| Search index (`site:regtekconsulting.com`) | Not run — small site, CMS export is authoritative |

**Union of all sources: 33 unique URLs** (excluding query-string draft URLs that resolve to the homepage).

---

## Master Inventory — Union of All Sources

### 1. Core Pages (KEEP — rebuild as-is or refresh)

| URL | In CMS | In Sitemap | In Crawl | Status | Title | Rebuild Action |
|-----|--------|------------|----------|--------|-------|----------------|
| `/` | ✓ (page: Home) | ✓ | ✓ | publish | Home | **Keep** — homepage is the hero asset, rebuild 1:1 |
| `/about/` | ✓ | ✓ | ✓ | publish | About | **Keep + expand** — only 301 words, thin |
| `/services/` | ✓ | ✓ | ✓ | publish | Services | **Keep** — services overview |
| `/contact/` | ✓ | ✓ | ✓ | publish | Contact | **Keep** — wire up Resend form |
| `/google-ads/` | ✓ | ✓ | ✓ | publish | Google Ads | **Keep** — service landing page |
| `/meta-ads/` | ✓ | ✓ | ✓ | publish | Meta Ads | **Keep** — service landing page |
| `/website-design/` | ✓ | ✓ | ✓ | publish | Website Design | **Keep** — service landing page |
| `/tips-tricks/` | ✓ | ✓ | ✓ | publish | Tips & Tricks | **Review** — thin content (37 words crawl) — decide: expand or cut |

### 2. Blog Posts (KEEP — all published posts migrate per operator direction)

| URL | In CMS | In Sitemap | In Crawl | Chars | Action |
|-----|--------|------------|----------|-------|--------|
| `/blog/cro-optimization-healthcare-practices/` | ✓ | ✓ | ✓ | 6,495 | **Migrate** |
| `/blog/dermatology-lead-cost-case-study/` | ✓ | ✓ | ✓ | 10,230 | **Migrate** |
| `/blog/google-business-profile-optimization-medical-practices/` | ✓ | ✓ | ✓ | 12,820 | **Migrate** |
| `/blog/healthcare-website-conversion-killers/` | ✓ | — | ✓ | 13,208 | **Migrate** — missing from sitemap (recent publish?) |
| `/blog/marketing-leads-not-converting/` | ✓ | ✓ | ✓ | 15,718 | **Migrate** |
| `/blog/medical-spa-marketing-roi-lifetime-value-case-study/` | ✓ | ✓ | ✓ | 11,715 | **Migrate** |
| `/blog/provider-intro-videos-medical-practices/` | ✓ | ✓ | ✓ | 13,470 | **Migrate** |
| `/blog/seo-strategy-basics-h1-meta-titles-descriptions-healthcare-6/` | ✓ | — | ✓ | 12,986 | **Migrate** — missing from sitemap (this is the canonical "winner" of the 9 drafts) |
| `/blog/why-i-started-regtek-consulting/` | ✓ | ✓ | ✓ | 11,443 | **Migrate** |

**Published blog posts to migrate: 9** (all from 2025, healthcare-marketing-focused)

### 3. Draft Content — Operator Decision Required

| Title | Post ID | Chars | Notes |
|-------|---------|-------|-------|
| Privacy Policy (page) | 3 | 4,544 | **Action:** Publish — needed for compliance. If outdated, rewrite. |
| Healthcare Landing Page Design: What Makes Patients Pick Up the Phone (post) | 906 | 12,710 | **Action:** ? — standalone draft, not a duplicate. Publish or discard? |
| SEO Strategy Basics (post, v894) | 894 | 12,984 | Duplicate iteration — **discard** |
| SEO Strategy Basics (post, v890) | 890 | 12,761 | Duplicate iteration — **discard** |
| SEO Strategy Basics (post, v886) | 886 | 12,575 | Duplicate iteration — **discard** |
| SEO Strategy Basics (post, v878) | 878 | 12,812 | Duplicate iteration — **discard** |
| SEO Strategy Basics (post, v866) | 866 | 12,170 | Duplicate iteration — **discard** |
| SEO Strategy Basics (post, v864) | 864 | 13,811 | Duplicate iteration — **discard** |
| SEO Strategy Basics (post, v862) | 862 | 15,462 | Duplicate iteration — **discard** |

**Recommendation:** The published `seo-strategy-basics-h1-meta-titles-descriptions-healthcare-6` post is the final/canonical version. The 7 drafts are iteration revisions that never got cleaned up. Delete after Kevin confirms.

### 4. Clutter to Cut

| URL | Reason | Action |
|-----|--------|--------|
| `/sample-page/` | Default WordPress sample page — never deleted after install | **Cut** — redirect to `/` |
| `/coming-soon/` | Placeholder page, 3,221 chars — not linked in nav | **Ask operator** — was this for a future service launch? If yes, keep and rebuild. If abandoned, cut. |
| `/home` | Crawler caught this as an alias — it's the same as `/` | **Cut** — redirect to `/` (not a real distinct page) |

### 5. Blog Categories (Taxonomy Cleanup)

**Used categories (have posts):**
- Case Studies & Results
- General
- Website & Conversion Optimization

**Unused categories (no posts, should be cleaned up in new build):**
Article, Conversion Rate Optimization, CRO, Google Ads (cat), Healthcare Marketing, Local SEO, Medical Spa Marketing, Practice Growth, Uncategorized, Web Design (cat)

**Recommendation:** In the Astro rebuild, build categories only for the 3 actively used ones. Don't migrate empty taxonomies. Urls to preserve as redirects: the 3 active category index pages.

---

## Critical Observations

1. **Small site = easy migration.** Only 8 real content pages + 9 blog posts. Entire content migration is ~20 canonical URLs.
2. **Duplicate blog drafts** — the SEO post was iterated 8 times during drafting. Cleanup should happen on the WP side (or ignored if WP is being retired entirely).
3. **Two sitemap systems present** — `/sitemap_index.xml` (Yoast format) and `/wp-sitemap.xml` (WordPress core). Both return the same pages. Only one should be generated in the Astro rebuild.
4. **No orphan pages found** — every CMS page also appears in the crawl. Every crawl URL traces back to the CMS (or is a dup like `/home`). Good sign that nothing is hidden.
5. **No custom post types with content** — the `rm_content_editor` CPT has 1 entry and is a Bricks internal content store, not user-facing content. Safe to ignore.
