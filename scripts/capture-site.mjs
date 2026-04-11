#!/usr/bin/env node
// Capture screenshots of the live Regtek site + extract computed CSS.
// Writes to 01-discovery/screenshots/ and 01-discovery/extracted-styles.json

import 'dotenv/config';
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITE = process.env.SITE_URL.replace(/\/$/, '');
const SHOT_DIR = path.join(ROOT, '01-discovery', 'screenshots');
fs.mkdirSync(SHOT_DIR, { recursive: true });

const PAGES_TO_CAPTURE = [
  { url: '/', name: 'homepage' },
  { url: '/about/', name: 'about' },
  { url: '/contact/', name: 'contact' },
  { url: '/services/', name: 'services' },
  { url: '/google-ads/', name: 'google-ads' },
  { url: '/meta-ads/', name: 'meta-ads' },
  { url: '/website-design/', name: 'website-design' },
  { url: '/tips-tricks/', name: 'tips-tricks' },
  { url: '/blog/cro-optimization-healthcare-practices/', name: 'blog-sample' },
];

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (compatible; RegtekMigration/1.0)',
  });
  const page = await context.newPage();

  // --- Desktop screenshots ---
  for (const p of PAGES_TO_CAPTURE) {
    try {
      await page.goto(`${SITE}${p.url}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(SHOT_DIR, `${p.name}-desktop-full.png`), fullPage: true });
      await page.screenshot({ path: path.join(SHOT_DIR, `${p.name}-desktop-fold.png`), fullPage: false });
      console.log(`  desktop: ${p.name}`);
    } catch (err) {
      console.error(`  desktop FAIL ${p.name}: ${err.message}`);
    }
  }

  // --- Mobile screenshots (homepage + 2 interiors) ---
  await page.setViewportSize({ width: 390, height: 844 });
  for (const p of PAGES_TO_CAPTURE.slice(0, 3)) {
    try {
      await page.goto(`${SITE}${p.url}`, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(SHOT_DIR, `${p.name}-mobile-full.png`), fullPage: true });
      console.log(`  mobile:  ${p.name}`);
    } catch (err) {
      console.error(`  mobile FAIL ${p.name}: ${err.message}`);
    }
  }

  // --- Computed style extraction (homepage) ---
  console.log('Extracting computed styles from homepage...');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${SITE}/`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  const styles = await page.evaluate(() => {
    const pick = (el, props) => {
      if (!el) return null;
      const cs = window.getComputedStyle(el);
      return Object.fromEntries(props.map(p => [p, cs.getPropertyValue(p)]));
    };

    const cssColorToHex = (c) => c; // leave as-is, rgb() is fine for downstream parsing

    const body = pick(document.body, ['font-family','color','background-color','font-size','line-height']);
    const h1 = pick(document.querySelector('h1'), ['font-family','font-size','font-weight','color','line-height','text-transform','letter-spacing']);
    const h2 = pick(document.querySelector('h2'), ['font-family','font-size','font-weight','color','line-height','text-transform','letter-spacing']);
    const h3 = pick(document.querySelector('h3'), ['font-family','font-size','font-weight','color','line-height']);
    const a = pick(document.querySelector('a'), ['color','text-decoration-line','font-weight']);

    // Font link discovery
    const fontLinks = [...document.querySelectorAll('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]')].map(l => l.href);
    const fontFaces = [...document.styleSheets].flatMap(ss => {
      try { return [...ss.cssRules].filter(r => r.type === 5).map(r => r.cssText); }
      catch { return []; }
    }).slice(0, 30);

    // Section-by-section extraction
    const sectionSelector = 'header, section, footer, main > div, [class*="hero"], [class*="cta"], [class*="banner"]';
    const rawSections = [...document.querySelectorAll(sectionSelector)];
    // Filter out nested duplicates and tiny containers
    const sections = rawSections.filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 200 && rect.height > 50;
    }).slice(0, 30).map((section, i) => {
      const cs = window.getComputedStyle(section);
      const rect = section.getBoundingClientRect();
      const heading = section.querySelector('h1, h2, h3');
      const paragraph = section.querySelector('p');
      const buttons = [...section.querySelectorAll('a.button, a.btn, button, a[class*="button"], a[class*="cta"], a[class*="btn"]')]
        .filter(el => el.textContent.trim().length < 60)
        .slice(0, 3);
      const images = [...section.querySelectorAll('img')].slice(0, 3).map(img => ({
        src: img.getAttribute('src') || img.getAttribute('data-src') || '',
        alt: img.getAttribute('alt') || '',
        width: img.naturalWidth, height: img.naturalHeight,
      }));

      return {
        index: i,
        tag: section.tagName,
        classes: (section.className || '').toString().substring(0, 200),
        rect: { top: Math.round(rect.top), width: Math.round(rect.width), height: Math.round(rect.height) },
        text: section.textContent.trim().substring(0, 140),
        styles: pick(section, ['background-color','background-image','color','padding','margin','border-radius','box-shadow']),
        heading: heading ? {
          tag: heading.tagName,
          text: heading.textContent.trim().substring(0, 120),
          styles: pick(heading, ['font-family','font-size','font-weight','color','text-transform','letter-spacing','line-height']),
        } : null,
        paragraph: paragraph ? {
          text: paragraph.textContent.trim().substring(0, 180),
          styles: pick(paragraph, ['font-family','font-size','color','line-height']),
        } : null,
        buttons: buttons.map(btn => ({
          text: btn.textContent.trim().substring(0, 40),
          styles: pick(btn, ['background-color','color','border','border-radius','font-weight','padding','text-transform','box-shadow']),
        })),
        images,
      };
    });

    // CSS custom properties (design tokens) from :root
    const rootStyles = window.getComputedStyle(document.documentElement);
    const tokens = {};
    for (let i = 0; i < rootStyles.length; i++) {
      const name = rootStyles[i];
      if (name.startsWith('--')) tokens[name] = rootStyles.getPropertyValue(name).trim();
    }

    return { body, h1, h2, h3, a, fontLinks, fontFaces, tokens, sections };
  });

  fs.writeFileSync(path.join(ROOT, '01-discovery', 'extracted-styles.json'), JSON.stringify(styles, null, 2));
  console.log(`  wrote extracted-styles.json (${styles.sections.length} sections, ${Object.keys(styles.tokens).length} tokens)`);

  await browser.close();
  console.log('Capture complete.');
}

main().catch(err => { console.error(err); process.exit(1); });
