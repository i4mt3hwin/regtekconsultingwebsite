# Visual Spec — www.regtekconsulting.com

> Source of truth for the rebuild. Every value here was extracted from the live site's computed CSS on 2026-04-10 (`extracted-styles.json`) plus Playwright screenshots. When the new build diffs against this document, these are the target values.

**Stack detected:** WordPress + Bricks Builder (`bde-*` class prefix)
**Font strategy:** System-font stack only — no Google Fonts or custom webfonts loaded. Fast-loading intentional choice. Preserve in rebuild.

---

## Global

| Property | Value |
|----------|-------|
| Body font family | `system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` |
| Body font size | 16px |
| Body line-height | 1.4 (22.4px) |
| Body text color | `#0A0A0B` |
| Page background | `#FFFFFF` |
| Heading font family | Same system-ui stack |
| Heading weight | 700 |
| Link color | `#06B6D4` (cyan-500) |
| Link decoration | `underline` |

### Brand Color Palette (from CSS custom properties)

| Token | Hex | Role |
|-------|-----|------|
| `--bde-brand-primary-color` | `#06B6D4` | Primary brand (cyan-500) — logo, headings, links |
| Button primary bg (observed) | `#0E7490` | Darker cyan-700 — all primary CTA buttons |
| Dark section bg (observed) | `#0E7490` | Case-study + CTA band backgrounds |
| Neutral dark | `#0A0A0B` | Body text, dark headings |
| Neutral gray 900 | `#111827` | Footer / dark surfaces |
| Neutral gray 800 | `#1F2937` | Footer background |
| Neutral gray 500 | `#6B7280` | Secondary text |
| Neutral gray 300 | `#D1D5DB` | Borders / dividers |
| Neutral gray 100 | `#F3F4F6` | Section backgrounds (alt) |
| Neutral gray 50 | `#F7F7F7` | Hero section background |
| Light text (on dark) | `#F3F4F6` | Text on cyan/dark backgrounds |
| Success | `#047857` | Form success states |

**In Tailwind v4 terms:** this is the default `cyan-500` / `cyan-700` + `gray-*` palette with near-black body text. Map cleanly to stock Tailwind tokens in the rebuild.

---

## Header / Navigation

| Property | Value |
|----------|-------|
| Background color | `#FFFFFF` |
| Height | ~130px |
| Position | sticky (`bde-header-builder--sticky`) |
| Logo | Image — `cropped-Regtek-Consulting-Logo.png` (available in `06-content/images/client-provided/`) |
| Nav items | Services, Google Ads, Meta Ads, Website Design, Tips & Tricks, About, Contact (+ dropdown "Close") |
| Nav link color | `#0A0A0B` |
| Nav link weight | 400 |
| CTA button | "Book Your Free Consultation" — bg `#0E7490`, text `#FFFFFF` |

---

## Section: Hero

| Property | Value |
|----------|-------|
| Background | `#F7F7F7` (light gray) |
| Layout | Single column, centered |
| Eyebrow | "Small Business Digital Marketing" |
| H1 text | "Turn Your Marketing Into…" (rest of heading uses a display span) |
| H1 color | `#0A0A0B` |
| H1 font | system-ui, 700, large display size (~48-64px rendered) |
| Subtitle | Marketing pitch copy (~2-3 lines) |
| CTA button | "Book Your Free Consultation Today" — bg `#0E7490`, text white, radius ~6px |
| Height | ~582px |

**Note:** The Bricks hero has a decorative display heading element that doesn't map to `<h1>` — the computed styles show h1 at 16px, which means the visible large heading is a styled `<span>` or `<div>`. Rebuild the hero with a real semantic `<h1>` carrying the display-size styles.

---

## Section: Trust Strip

| Property | Value |
|----------|-------|
| Background | `#0E7490` (cyan-700) |
| H2 text | "Trusted by Small Businesses" |
| H2 color | `#F3F4F6` |
| H2 size | 32px / 700 |
| Layout | Horizontal logo row (client logos) |
| Height | ~251px |

---

## Section: Pain / Transition

| Property | Value |
|----------|-------|
| Background | `#F3F4F6` |
| H2 text | "You've Built Something Great Through Word-of-Mouth. Now It's Time to Scale." |
| H2 color | `#0A0A0B` |
| H2 size | 42px / 700 |
| Body color | `#0A0A0B` |
| Height | ~911px |

---

## Section: Results 1 (Local Practice Case Study)

| Property | Value |
|----------|-------|
| Background | `#0E7490` (cyan-700, dark cyan band) |
| H3 text | "The Results Speak / Louder Than We Do" |
| H3 color | `#06B6D4` (cyan-500 — lighter cyan on darker cyan) |
| H3 size | 45px / 700 |
| Body text color | `#F3F4F6` |
| Height | ~591px |

---

## Section: Why Us

| Property | Value |
|----------|-------|
| Background | transparent over white |
| H2 text | "We Don't Just Do Marketing, We Understand Your Business." |
| H2 color | `#0A0A0B` |
| H2 size | 38px / 700 |
| Layout | Headline + 3-4 supporting paragraphs |
| Height | ~733px |

---

## Section: Results 2 (Growing Practice Case Study)

| Property | Value |
|----------|-------|
| Background | `#0E7490` |
| H3 text | "From Growing Practice / To Market Leader" |
| H3 color | `#06B6D4` |
| H3 size | 45px / 700 |
| CTA button | "Read The Case Study" — bg white, text `#0E7490` |
| Height | ~551px |

---

## Section: What We Do (Services Grid)

| Property | Value |
|----------|-------|
| Background | `#F3F4F6` |
| H2 text | "What We Do" |
| H2 color | `#0A0A0B` |
| H2 size | 39.0625px / 700 |
| Card layout | 3 service cards (Google Ads, Meta Ads, Web Design) |
| Card CTA buttons | "Read More About Google Ads / Meta Ads / Web Design" — bg `#0E7490`, text white |
| Height | ~1253px |

---

## Section: Services CTA Band

| Property | Value |
|----------|-------|
| Background | `#0E7490` |
| H2 text | "Want to know which services fit your goals?" |
| H2 color | `#0A0A0B` (note: dark text on dark bg is low-contrast — flag for rebuild) |
| H2 size | 39.0625px / 700 |
| CTA button | "Book Today!" — bg `#0E7490`, text white |
| Height | ~550px |

**⚠ Rebuild fix:** Dark heading on dark cyan band is a contrast issue. Change heading to `#FFFFFF` or `#F3F4F6` in the new build.

---

## Section: Founder Intro

| Property | Value |
|----------|-------|
| Background | `#D8D8D8` (medium gray) |
| H2 text | "You'll Work Directly With The Founder" |
| H2 color | `#0A0A0B` |
| H2 size | 39.0625px / 700 |
| Body copy | "Hi, I'm Kevin Dillon, the founder of Regtek Consulting…" |
| CTA | "LEARN MORE" (text-only button, uppercase) |
| Photo | Kevin Dillon headshot |
| Height | ~739px |

---

## Section: Final CTA + Contact Form

| Property | Value |
|----------|-------|
| Background | transparent / image |
| Eyebrow | "Let's Talk Growth" |
| H2 text | "Ready to Stop Guessing and Start Growing?" |
| H2 color | `#F3F4F6` |
| H2 size | 39.0625px / 700 |
| CTA button 1 | "Book A Free Consultation" — bg white, text dark |
| Form submit | "Submit" — bg `#0E7490`, text white |
| Height | ~575px |

---

## Footer

| Property | Value |
|----------|-------|
| Background | `#1F2937` (gray-800) |
| Text color | `#F3F4F6` |
| Brand heading | "Regtek" — color `#F3F4F6`, size 31.25px / 700 |
| Tagline | "Data-Driven Marketing. Real Results." |
| Story line | "Named after our founder's best friend…" |
| Layout | Multi-column footer |
| Height | ~439px |

---

## Known Rebuild Adjustments

1. **Hero H1 semantics** — Bricks renders the visible display heading in a non-`<h1>` element. Rebuild with a real semantic `<h1>` at ~60px font-size.
2. **Services CTA band contrast** — dark heading on dark cyan is low-contrast. Switch heading to light in rebuild.
3. **System-font stack preserved** — do NOT introduce a Google Font unless the operator explicitly wants a brand refresh. This site loads fast because it uses system fonts only.
4. **Link underline** — default underline on all `<a>` is a heavy look. Consider removing underline on nav/CTA buttons in the rebuild (keep for body copy links).
5. **Color palette maps to stock Tailwind v4** — `cyan-500`, `cyan-700`, `gray-800/900`, `gray-100/300/500`. No custom colors needed.
