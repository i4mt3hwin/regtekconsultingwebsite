# Design Tokens — Regtek Consulting

> Derived from `01-discovery/visual-spec.md` + `01-discovery/extracted-styles.json`. This is the brand-preservation rebuild of the existing cyan/near-black/gray identity. Maps cleanly to stock Tailwind v4 — no custom palette required.

---

## Color Palette

### Primary (Cyan)
- **cyan-500** `#06B6D4` — brand accent, headings-on-white, links, hover states
- **cyan-700** `#0E7490` — primary CTA buttons, dark section backgrounds
- **cyan-800** `#155E75` — active/pressed button state
- **cyan-100** `#CFFAFE` — subtle hover background

### Neutrals (Gray scale — stock Tailwind)
- **near-black** `#0A0A0B` — body text, dark headings
- **gray-900** `#111827` — alternative dark surfaces
- **gray-800** `#1F2937` — footer background
- **gray-500** `#6B7280` — secondary / muted text
- **gray-300** `#D1D5DB` — borders, dividers
- **gray-100** `#F3F4F6` — alternating section backgrounds, light text on dark bg
- **gray-50** `#F7F7F7` — hero background
- **white** `#FFFFFF` — page default

### Functional
- **success** `#047857` (emerald-700) — form success states
- **warning** `#B45309` (amber-700)
- **error** `#B91C1C` (red-700)
- **info** `#0369A1` (sky-700)

### Usage Rules
- Primary CTA buttons: `cyan-700` bg, white text (never `cyan-500` — it's lower contrast)
- Links in body copy: `cyan-500`, underlined
- Section alternation: `white` → `gray-100` → `white` → `cyan-700 (dark band)` → repeat
- Text on dark backgrounds: `gray-100` (not pure white — matches the source site)
- **Never** put dark text on `cyan-700` (fixes the existing site's contrast bug)

---

## Typography

### Font Families

**Strategy: system fonts only. No Google Fonts. No custom webfonts.**
Preserves the existing site's fast-load characteristic — this is intentional, not a fallback.

```css
--font-sans: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif,
  "Apple Color Emoji", "Segoe UI Emoji";
```

All text uses `--font-sans`. No serif pairing.

### Type Scale

| Token | Size | Line-height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `text-xs` | 12px | 1.5 | 400 | Fine print, form helper text |
| `text-sm` | 14px | 1.5 | 400 | Meta info, labels, captions |
| `text-base` | 16px | 1.6 | 400 | Body copy (default) |
| `text-lg` | 18px | 1.5 | 400 | Lead paragraphs |
| `text-xl` | 20px | 1.4 | 600 | Small headings, card titles |
| `text-2xl` | 24px | 1.3 | 700 | H4 |
| `text-3xl` | 32px | 1.2 | 700 | H3 (trust strip) |
| `text-4xl` | 40px | 1.15 | 700 | H2 (section headings) |
| `text-5xl` | 48px | 1.1 | 700 | H1 (interior pages) |
| `text-6xl` | 60px | 1.05 | 700 | H1 (homepage hero) |

### Weights
- `400` — body text
- `600` — subheadings, labels, buttons
- `700` — headings, CTA buttons

### Heading Color Rules
- H1/H2 on white or `gray-100`: `#0A0A0B` (near-black)
- H2/H3 on `cyan-700` (dark band): `gray-100` light or `cyan-500` accent
- **Never** `near-black` on `cyan-700` (fixes source-site contrast bug)

---

## Spacing

Base unit: 4px (Tailwind default)

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | icon gaps |
| `space-2` | 8px | tight inline spacing |
| `space-3` | 12px | small padding |
| `space-4` | 16px | standard padding, gaps |
| `space-6` | 24px | card padding, paragraph gaps |
| `space-8` | 32px | section inner padding |
| `space-12` | 48px | section gaps (tight) |
| `space-16` | 64px | major section vertical rhythm |
| `space-20` | 80px | large section vertical rhythm |
| `space-24` | 96px | hero section padding |

**Section vertical rhythm:** `py-20` (80px) on most sections, `py-24` (96px) on the hero.

**Container:** `max-w-6xl mx-auto px-6` (1152px max width, 24px horizontal padding on mobile).

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 4px | form inputs |
| `rounded-md` | 6px | buttons, small cards |
| `rounded-lg` | 8px | cards |
| `rounded-xl` | 12px | feature blocks, hero cards |
| `rounded-2xl` | 16px | large image containers |
| `rounded-full` | 9999px | pills, avatars |

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | subtle lift |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.07)` | cards at rest |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | cards on hover |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | modals, high-elevation |

Used sparingly. The source site uses almost no shadows — mostly flat design.

---

## Component Patterns

### Buttons

**Primary CTA** (most common — homepage hero, contact CTAs, service CTAs)
```
bg-cyan-700 text-white font-semibold
px-6 py-3 rounded-md
hover:bg-cyan-800 transition
shadow-sm
```

**Secondary** (on dark cyan band — inverted)
```
bg-white text-cyan-700 font-semibold
px-6 py-3 rounded-md
hover:bg-gray-100 transition
```

**Ghost / text link** (tertiary actions, footer)
```
text-cyan-500 font-semibold
hover:text-cyan-700
underline-offset-4 hover:underline
```

### Cards

**Service card** (homepage + services hub)
```
bg-white rounded-lg shadow-md
p-8 hover:shadow-lg transition
border border-gray-100
```

**Blog post card**
```
bg-white rounded-lg overflow-hidden
border border-gray-100 hover:border-cyan-500
transition
```

### Hero Section (homepage)

```
bg-gray-50
py-24
Single-column centered
max-w-4xl
Eyebrow text (uppercase, cyan-500, tracking-wide)
H1 text-6xl font-bold text-near-black
Subtitle text-lg gray-600 max-w-2xl
CTA button (primary)
```

### Trust Strip (dark cyan band)

```
bg-cyan-700 py-12
text-gray-100
H2 text-3xl centered
Logo row below
```

### Alt Section (light gray)

```
bg-gray-100 py-20
Centered content max-w-5xl
H2 near-black
```

### CTA Band (before footer)

```
bg-cyan-700 py-20
text-gray-100
H2 gray-100 (NOT near-black — contrast fix)
CTA button (bg-white, text-cyan-700)
```

### Navigation Header

```
Sticky, bg-white, shadow-sm on scroll
h-20 (80px tall)
Logo left, nav center/right, CTA button far right
Mobile: hamburger → full-screen overlay
```

### Footer

```
bg-gray-800 text-gray-100
py-16
4-column grid on desktop, stacked on mobile
Brand column | Services | Company | Get Started
```

---

## Accessibility Targets

- **Contrast:** all body text ≥ 7:1 on its background (AAA for body, AA for large text)
- **Focus rings:** `ring-2 ring-cyan-500 ring-offset-2` on interactive elements
- **Skip link:** "Skip to main content" visible on `:focus`
- **Reduced motion:** respect `prefers-reduced-motion` — disable scroll animations

---

## Tailwind v4 Theme Config (to go in `global.css`)

```css
@import "tailwindcss";

@theme {
  --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --color-brand: #06B6D4;
  --color-brand-dark: #0E7490;
  --color-brand-darker: #155E75;
  --color-ink: #0A0A0B;
}

/* Semantic tokens map to stock Tailwind gray/cyan */
/* No custom scale needed — all other colors are used via Tailwind's built-in cyan-* and gray-* utilities */
```

---

## What Changes from the Source Site (intentional upgrades)

1. **Real semantic `<h1>`** — Bricks uses a display span; rebuild uses proper `<h1>`
2. **Fix dark-on-dark contrast** — CTA band headings become `gray-100` instead of `near-black`
3. **Consistent section rhythm** — all sections get `py-20` or `py-24`; source site is inconsistent
4. **No underline on nav/button links** — reserve underline for body copy links
5. **Slight card treatment upgrade** — add subtle shadow + border for visual separation (source is flat)
