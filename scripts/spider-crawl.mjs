#!/usr/bin/env node
// Sitemap fetch + Playwright spider crawl.
// Writes to 01-discovery/crawl-raw/ and 01-discovery/sitemap-urls.txt

import 'dotenv/config';
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITE = process.env.SITE_URL.replace(/\/$/, '');
const siteHost = new URL(SITE).hostname;
const OUT = path.join(ROOT, '01-discovery', 'crawl-raw');
fs.mkdirSync(OUT, { recursive: true });

const MAX_PAGES = 300;

// --- 1. Sitemap discovery ---
async function fetchSitemaps() {
  const candidates = ['/sitemap.xml', '/sitemap_index.xml', '/wp-sitemap.xml', '/wp-sitemap-posts-post-1.xml', '/wp-sitemap-posts-page-1.xml'];
  const seen = new Set();
  const allUrls = new Set();
  const toFetch = candidates.map(c => `${SITE}${c}`);
  while (toFetch.length) {
    const url = toFetch.shift();
    if (seen.has(url)) continue;
    seen.add(url);
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const xml = await res.text();
      // Save the first raw sitemap we find
      const name = 'sitemap-' + url.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '_') + '.xml';
      fs.writeFileSync(path.join(ROOT, '01-discovery', name), xml);
      // Extract all <loc> contents
      const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
      for (const loc of locs) {
        if (loc.endsWith('.xml')) {
          if (!seen.has(loc)) toFetch.push(loc);
        } else {
          try {
            const u = new URL(loc);
            if (u.hostname === siteHost || u.hostname === siteHost.replace(/^www\./, '')) {
              allUrls.add(u.pathname + (u.search || ''));
            }
          } catch {}
        }
      }
      console.log(`  sitemap ${url}: +${locs.length} entries`);
    } catch (err) {
      // skip
    }
  }
  const sorted = [...allUrls].sort();
  fs.writeFileSync(path.join(ROOT, '01-discovery', 'sitemap-urls.txt'), sorted.join('\n'));
  console.log(`  total sitemap URLs: ${sorted.length}`);
  return sorted;
}

// --- 2. Spider crawl ---
async function spiderCrawl(seedUrls) {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  const visited = new Set();
  const queue = ['/', ...seedUrls.filter(u => u.startsWith('/'))];
  const allUrls = [];

  while (queue.length > 0 && visited.size < MAX_PAGES) {
    const urlPath = queue.shift();
    if (visited.has(urlPath)) continue;
    visited.add(urlPath);

    const page = await context.newPage();
    try {
      const fullUrl = `${SITE}${urlPath}`;
      const response = await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
      const status = response?.status() || 0;
      await page.waitForTimeout(300);

      const data = await page.evaluate(() => {
        const getText = (sel) => document.querySelector(sel)?.textContent?.trim() || '';
        const getMeta = (n) => document.querySelector(`meta[name="${n}"]`)?.content || document.querySelector(`meta[property="${n}"]`)?.content || '';
        const getAll = (sel) => [...document.querySelectorAll(sel)].map(el => ({ tag: el.tagName, text: el.textContent.trim().substring(0, 160) }));

        const mainSelectors = ['main', 'article', '.content', '.entry-content', '#content', '.page-content', '#main'];
        let bodyContent = '';
        for (const sel of mainSelectors) {
          const el = document.querySelector(sel);
          if (el) { bodyContent = el.innerText; break; }
        }
        if (!bodyContent) bodyContent = document.body?.innerText || '';

        const links = [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(Boolean);
        const images = [...document.querySelectorAll('img')].map(img => ({
          src: img.getAttribute('src') || img.getAttribute('data-src') || '',
          alt: img.getAttribute('alt') || '',
          width: img.naturalWidth, height: img.naturalHeight,
        }));
        const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => s.textContent);

        return {
          title: document.title,
          metaDescription: getMeta('description'),
          ogTitle: getMeta('og:title'),
          ogDescription: getMeta('og:description'),
          canonical: document.querySelector('link[rel="canonical"]')?.href || '',
          h1: getText('h1'),
          headings: getAll('h1, h2, h3, h4'),
          bodyContent,
          wordCount: bodyContent.split(/\s+/).filter(Boolean).length,
          links,
          images,
          schemas,
        };
      });

      const slug = urlPath === '/' ? 'homepage' : urlPath.replace(/^\/|\/$/g, '').replace(/\//g, '_').replace(/[^a-z0-9_-]/gi, '_') || 'root';
      fs.writeFileSync(path.join(OUT, `${slug}.json`), JSON.stringify({ url: urlPath, status, ...data }, null, 2));
      allUrls.push({ url: urlPath, title: data.title, status, wordCount: data.wordCount });

      // Queue internal links
      for (const href of data.links) {
        try {
          const resolved = new URL(href, fullUrl);
          if (resolved.hostname === siteHost || resolved.hostname === siteHost.replace(/^www\./, '')) {
            const clean = (resolved.pathname.replace(/\/+$/, '') || '/') + (resolved.search || '');
            // Skip admin/asset/feed urls
            if (/\.(jpg|jpeg|png|webp|svg|gif|pdf|css|js|zip|xml)(\?|$)/i.test(clean)) continue;
            if (clean.startsWith('/wp-admin') || clean.startsWith('/wp-login') || clean.startsWith('/wp-content') || clean.startsWith('/wp-json')) continue;
            if (clean.startsWith('/feed') || clean.includes('/feed/')) continue;
            if (!visited.has(clean) && !queue.includes(clean)) queue.push(clean);
          }
        } catch {}
      }

      console.log(`  [${visited.size}] ${status} ${urlPath} (${data.wordCount}w)`);
    } catch (err) {
      console.error(`  FAIL ${urlPath}: ${err.message}`);
      allUrls.push({ url: urlPath, title: 'ERROR', status: 0, wordCount: 0, error: err.message });
    }
    await page.close();
  }

  fs.writeFileSync(path.join(OUT, '_crawl-urls.txt'), allUrls.map(u => u.url).join('\n'));
  fs.writeFileSync(path.join(OUT, '_crawl-summary.json'), JSON.stringify({ totalPages: allUrls.length, pages: allUrls }, null, 2));
  await browser.close();
  console.log(`Crawl complete: ${allUrls.length} pages`);
}

(async () => {
  console.log('Fetching sitemaps...');
  const sitemapUrls = await fetchSitemaps();
  console.log('Spider-crawling...');
  await spiderCrawl(sitemapUrls);
})().catch(err => { console.error(err); process.exit(1); });
