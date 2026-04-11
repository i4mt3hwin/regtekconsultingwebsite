# Content Inventory — Regtek Consulting

**Generated:** 2026-04-10 from the WordPress REST export (`wp-export/pages.json` + `wp-export/posts.json`) and Playwright crawl data.

---

## Site Statistics

| Metric | Value |
|--------|-------|
| Published pages | 10 |
| Draft pages | 1 (Privacy Policy) |
| Published blog posts | 9 |
| Draft blog posts | 9 (8 are duplicate iterations of one post — see reconciliation) |
| Blog categories (with content) | 3 |
| Blog categories (empty, unused) | 10 |
| Media library items | 144 |
| Media total size | ~33 MB |
| Custom post types | 1 (`rm_content_editor` — Bricks internal, not user-facing) |

**Total canonical URLs to migrate:** ~18 (8 core pages + 9 blog posts + possibly Privacy Policy)

---

## Page-by-Page Content Quality Assessment

### Core Pages

| Page | URL | Chars | Words (approx) | Title | Meta Desc | H1 | Quality | Recommendation |
|------|-----|-------|----------------|-------|-----------|-----|---------|----------------|
| Home | `/` | 37,694 | ~5,000 | ✓ | ✓ | ⚠ (display span, not semantic) | Excellent | **Keep** — rebuild 1:1 with semantic H1 fix |
| About | `/about/` | 4,728 | ~700 | ✓ | ✓ | ✓ | Thin but focused | **Keep + expand** — add founder timeline, more specific credentials, testimonials |
| Services | `/services/` | 45,412 | ~6,000 | ✓ | ✓ | ✓ | Excellent | **Keep** — hub page with service cards |
| Google Ads | `/google-ads/` | 55,800 | ~6,500 | ✓ | ✓ | ✓ | Excellent | **Keep** — rebuild, move to `/services/google-ads` |
| Meta Ads | `/meta-ads/` | 56,632 | ~8,200 | ✓ | ✓ | ✓ | Excellent | **Keep** — rebuild, move to `/services/meta-ads` |
| Website Design | `/website-design/` | 22,862 | ~2,800 | ✓ | ✓ | ✓ | Good | **Keep + expand** — shorter than the other service pages, add CRO proof and case study |
| Contact | `/contact/` | 9,885 | ~900 | ✓ | ✓ | ✓ | Good | **Keep** — wire Resend form, preserve budget dropdown |
| Tips & Tricks | `/tips-tricks/` | 38,016 | ~3,200 | ✓ | ✓ | ✓ | Good | **Keep** — this is the blog index page, not a content page. Rename to `/blog` or keep as-is? |

### Clutter Pages (recommend cutting)

| Page | URL | Chars | Why | Recommendation |
|------|-----|-------|-----|----------------|
| Sample Page | `/sample-page/` | 1,146 | Default WP install placeholder | **Cut** — redirect to `/` |
| Coming Soon | `/coming-soon/` | 3,221 | Not linked in nav, purpose unclear | **Operator decision** — cut unless it's for a real upcoming launch |
| Privacy Policy | `/?page_id=3` (draft) | 4,544 | Draft, never published | **Publish** (required for compliance) — review content first |

### Published Blog Posts (all migrate)

| Post | URL | Chars | Status | Notes |
|------|-----|-------|--------|-------|
| 7 Conversion Killers on Healthcare Websites | `/blog/healthcare-website-conversion-killers/` | 13,208 | Publish | Strong listicle — evergreen |
| SEO Strategy Basics: H1/Meta Titles/Descriptions (v6) | `/blog/seo-strategy-basics-h1-meta-titles-descriptions-healthcare-6/` | 12,986 | Publish | **Rename slug** in rebuild (drop `-6`) |
| What Should Dermatology Leads Cost? ($37/Lead Case Study) | `/blog/dermatology-lead-cost-case-study/` | 10,230 | Publish | Strong case study — hero post for Google Ads service |
| CRO Optimization: Why Healthcare Sites Lose 97% of Visitors | `/blog/cro-optimization-healthcare-practices/` | 6,495 | Publish | Shorter — consider expanding |
| Medical Spa Marketing ROI: 4x ROAS via LTV | `/blog/medical-spa-marketing-roi-lifetime-value-case-study/` | 11,715 | Publish | Strong case study |
| Why Your Half-Finished GBP Is Costing You Patients | `/blog/google-business-profile-optimization-medical-practices/` | 12,820 | Publish | Strong how-to |
| Why Your Best Marketing Asset Is Already Walking Around Your Clinic (provider intro videos) | `/blog/provider-intro-videos-medical-practices/` | 13,470 | Publish | Unique angle |
| Why Your Marketing Leads Aren't Converting (It's Not What You Think) | `/blog/marketing-leads-not-converting/` | 15,718 | Publish | Longest post — strong pillar piece |
| Why I Started Regtek Consulting | `/blog/why-i-started-regtek-consulting/` | 11,443 | Publish | Founder story — strong for brand |

**Editorial observation:** all 9 published posts are strongly healthcare-vertical focused. This reinforces the "healthcare marketing specialist" positioning. No off-topic content to cut.

### Draft Posts — Decision Required

| Post | ID | Chars | Recommendation |
|------|-----|-------|----------------|
| Healthcare Landing Page Design: What Makes Patients Pick Up the Phone | 906 | 12,710 | **Operator decision** — standalone draft, finish and publish, or discard? |
| SEO Strategy Basics drafts (v862, v864, v866, v878, v886, v890, v894) | various | ~12-15k each | **Discard all 7** — these are iteration revisions of the published v6 post |

---

## Pages MISSING from the current site (recommend adding in rebuild)

Based on the business positioning and industry norms, the rebuild should consider adding:

| New Page | Why | Priority |
|----------|-----|----------|
| **Who We Serve** (verticals: dermatology, med spa, regen medicine, etc.) | Reinforces specialization, creates internal-link targets for SEO | **High** |
| **Case Studies / Results** (index page) | Currently case studies are scattered in blog. A dedicated hub converts better. | **High** |
| **`/services/seo`** or **Local SEO** service page | Heavy blog presence on SEO but no service page — leaving money on table | **Medium — confirm with operator if offered** |
| **FAQ** | Common for consulting services — addresses pricing, process, timeline objections before the call | **Medium** |
| **Process / How We Work** | Shows the engagement flow — common ask before booking a consult | **Medium** |
| **Privacy Policy** (finish the draft) | Legal requirement | **Must-have for launch** |
| **Terms of Service** | Legal baseline | **Nice-to-have** |

---

## Content Gaps to Address in Rebuild

1. **About page is thin (~700 words).** Expand with founder timeline, specific healthcare ops credentials, and 2-3 testimonials.
2. **Services pages lack internal links to blog posts.** Each service page should link to the 2-3 most relevant blog case studies. This boosts SEO and conversion.
3. **Blog index page (`/tips-tricks`) shows only 1 post in preview.** The rebuild should dynamically list all 9 posts with proper cards, categories, and filtering.
4. **No visible testimonial rotation.** One testimonial (Dr. Menon) appears everywhere. Gather 2-3 more and rotate across pages.
5. **No email newsletter gate.** "Join 2,500+ healthcare marketers" claim needs a working signup — confirm with Kevin what ESP to connect (ConvertKit? Beehiiv? Mailchimp?).
6. **No pricing indicator.** Contact form has a budget dropdown ($300–$5,000+) — consider a pricing page or at least a "Starting at $X/mo" indicator to self-qualify leads.

---

## Migration Priority

**P0 (must migrate before launch):** Homepage, Services, Google Ads, Meta Ads, Website Design, About, Contact, all 9 published blog posts, Privacy Policy (published version)

**P1 (new pages to add during rebuild):** Who We Serve, Case Studies hub

**P2 (nice-to-have):** FAQ, Process page, `/services/seo` (pending Kevin confirmation)

**Cut entirely:** Sample Page, Coming Soon (pending confirmation), the 7 duplicate SEO drafts
