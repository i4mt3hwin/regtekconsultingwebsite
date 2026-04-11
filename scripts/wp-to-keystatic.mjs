#!/usr/bin/env node
// Convert WordPress REST export posts into Keystatic markdoc files.
// Only migrates published posts (skips all drafts per operator decision).
// Output: ../05-build/src/content/posts/{slug}/index.mdoc

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import TurndownService from 'turndown';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_JSON = path.join(ROOT, '01-discovery', 'wp-export', 'posts.json');
const CATEGORIES_JSON = path.join(ROOT, '01-discovery', 'wp-export', 'categories.json');
const OUT_DIR = path.join(ROOT, '05-build', 'src', 'content', 'posts');
const PAGE_TRACKER = path.join(ROOT, '04-architecture', 'page-tracker.csv');

fs.mkdirSync(OUT_DIR, { recursive: true });

const posts = JSON.parse(fs.readFileSync(POSTS_JSON, 'utf8'));
const categories = JSON.parse(fs.readFileSync(CATEGORIES_JSON, 'utf8'));
const catById = new Map(categories.map(c => [c.id, c.slug]));

// Map WP category slugs to our Keystatic category enum
const CATEGORY_MAP = {
  'case-studies-results': 'case-studies-results',
  'website-conversion-optimization': 'website-conversion-optimization',
  'general': 'general',
};

// Slug rename for the SEO post (strip the -6 iteration suffix)
const SLUG_RENAMES = {
  'seo-strategy-basics-h1-meta-titles-descriptions-healthcare-6': 'seo-strategy-basics',
};

// Parse page-tracker.csv to grab our hand-written meta titles/descriptions
const trackerText = fs.readFileSync(PAGE_TRACKER, 'utf8');
const trackerRows = trackerText.split('\n').slice(1);
const metaBySlug = new Map();
for (const row of trackerRows) {
  // Crude CSV parse — good enough for our tracker
  const parts = [];
  let inQuote = false, cur = '';
  for (const ch of row) {
    if (ch === '"') inQuote = !inQuote;
    else if (ch === ',' && !inQuote) { parts.push(cur); cur = ''; }
    else cur += ch;
  }
  parts.push(cur);
  if (parts.length < 7) continue;
  const url = parts[1];
  if (!url || !url.startsWith('/blog/') || url.includes('/category/')) continue;
  const slug = url.replace('/blog/', '');
  metaBySlug.set(slug, {
    metaTitle: parts[5]?.replace(/^"|"$/g, '').replace(/""/g, '"'),
    metaDescription: parts[6]?.replace(/^"|"$/g, '').replace(/""/g, '"'),
    h1: parts[4]?.replace(/^"|"$/g, '').replace(/""/g, '"'),
  });
}

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
  emDelimiter: '_',
});

// Keep basic formatting; strip WP-Bricks wrapper clutter
turndown.addRule('removeBricksWrappers', {
  filter: (node) => {
    const cls = (node.getAttribute && node.getAttribute('class')) || '';
    return /(^|\s)(bde-|brxe-|elementor-)/.test(cls);
  },
  replacement: (content) => content, // unwrap but keep text
});
turndown.remove(['script', 'style']);

function decodeEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rsquo;/g, '’')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–');
}

function plainExcerpt(html, chars = 200) {
  const stripped = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const decoded = decodeEntities(stripped);
  if (decoded.length <= chars) return decoded;
  const cut = decoded.slice(0, chars);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 100 ? cut.slice(0, lastSpace) : cut) + '…';
}

function yamlEscape(v) {
  if (v == null) return '';
  const s = String(v).replace(/\s+/g, ' ').trim();
  // Use single-quoted YAML if string contains special chars
  if (/[:#\-'\"\n\[\]{}|>&*!%@`,]/.test(s)) {
    return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return s;
}

let written = 0;
for (const post of posts) {
  if (post.status !== 'publish') continue;

  const wpSlug = post.slug;
  const finalSlug = SLUG_RENAMES[wpSlug] || wpSlug;
  const title = decodeEntities(post.title.rendered);
  const html = post.content.rendered;
  const markdown = turndown.turndown(html);
  const publishDate = post.date ? new Date(post.date).toISOString().slice(0, 10) : '';
  const catSlugs = (post.categories || []).map(id => catById.get(id)).filter(Boolean);
  const matchedCategory = catSlugs.find(s => CATEGORY_MAP[s]) || 'general';
  const category = CATEGORY_MAP[matchedCategory] || 'general';
  const metaInfo = metaBySlug.get(finalSlug) || {};
  const excerpt = plainExcerpt(html, 220);

  const frontmatter = [
    '---',
    `title: ${yamlEscape(title)}`,
    `publishDate: ${publishDate}`,
    `category: ${category}`,
    `excerpt: ${yamlEscape(excerpt)}`,
    metaInfo.metaTitle ? `metaTitle: ${yamlEscape(metaInfo.metaTitle)}` : null,
    metaInfo.metaDescription ? `metaDescription: ${yamlEscape(metaInfo.metaDescription)}` : null,
    'featured: false',
    '---',
    '',
  ].filter(Boolean).join('\n');

  // Keystatic collection format uses `path: "src/content/posts/*"` with contentField
  // That means each entry is a single file named {slug}.mdoc
  const filePath = path.join(OUT_DIR, `${finalSlug}.mdoc`);
  fs.writeFileSync(filePath, frontmatter + markdown.trim() + '\n');
  console.log(`  wrote ${finalSlug}.mdoc (${markdown.length} chars, category=${category})`);
  written++;
}

console.log(`Done. Wrote ${written} published posts to ${OUT_DIR}`);
