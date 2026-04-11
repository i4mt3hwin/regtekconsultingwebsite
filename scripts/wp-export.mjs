#!/usr/bin/env node
// WordPress REST API exporter — Node replacement for the bash+jq version in P1B.
// Pulls pages, posts, media, taxonomies, CPTs, menus, settings, and downloads media.

import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, '01-discovery', 'wp-export');
const IMAGES = path.join(ROOT, '06-content', 'images', 'client-provided');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(IMAGES, { recursive: true });

const SITE = process.env.SITE_URL?.replace(/\/$/, '');
const USER = process.env.WP_USER;
const PASS = process.env.WP_APP_PASSWORD;
if (!SITE || !USER || !PASS) {
  console.error('Missing SITE_URL / WP_USER / WP_APP_PASSWORD in .env');
  process.exit(1);
}

const AUTH = 'Basic ' + Buffer.from(`${USER}:${PASS}`).toString('base64');
const headers = { Authorization: AUTH, 'User-Agent': 'regtek-migration/1.0' };

async function apiGet(endpoint) {
  const url = `${SITE}/wp-json/wp/v2/${endpoint}`;
  const res = await fetch(url, { headers });
  const text = await res.text();
  if (!res.ok) {
    return { ok: false, status: res.status, body: text };
  }
  try { return { ok: true, status: res.status, data: JSON.parse(text), headers: res.headers }; }
  catch { return { ok: false, status: res.status, body: text }; }
}

async function fetchAll(endpoint, label) {
  const all = [];
  let page = 1;
  const sep = endpoint.includes('?') ? '&' : '?';
  while (true) {
    const { ok, status, data, body, headers: h } = await apiGet(`${endpoint}${sep}per_page=100&page=${page}`);
    if (!ok) {
      // WP returns 400 with code rest_post_invalid_page_number when you go past the last page.
      if (status === 400 && body && body.includes('rest_post_invalid_page_number')) break;
      console.error(`  [${label}] page ${page} failed: ${status} ${body?.slice(0, 200)}`);
      break;
    }
    if (!Array.isArray(data) || data.length === 0) break;
    all.push(...data);
    const totalPages = parseInt(h.get('x-wp-totalpages') || '0', 10);
    if (totalPages && page >= totalPages) break;
    page++;
    if (page > 100) { console.error(`  [${label}] safety break at page 100`); break; }
  }
  return all;
}

function save(name, data) {
  const file = path.join(OUT, name);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  const count = Array.isArray(data) ? data.length : (typeof data === 'object' ? Object.keys(data).length : 1);
  console.log(`  wrote ${name} (${count} ${Array.isArray(data) ? 'items' : 'keys'})`);
}

async function downloadMedia(mediaItems) {
  let ok = 0, fail = 0, skip = 0;
  for (const m of mediaItems) {
    const src = m.source_url;
    if (!src) { fail++; continue; }
    const filename = path.basename(new URL(src).pathname);
    if (!filename) { fail++; continue; }
    const dest = path.join(IMAGES, filename);
    if (fs.existsSync(dest)) { skip++; continue; }
    try {
      const res = await fetch(src);
      if (!res.ok) { fail++; continue; }
      await pipeline(res.body, fs.createWriteStream(dest));
      ok++;
    } catch (err) {
      fail++;
    }
  }
  console.log(`  media: downloaded ${ok}, skipped ${skip}, failed ${fail}`);
}

function csvEscape(v) {
  if (v == null) return '';
  const s = String(v).replace(/"/g, '""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
}

function buildMasterList(all) {
  const rows = [['URL','Title','Type','Status','ID','Parent','ContentLength']];
  for (const [type, items] of Object.entries(all)) {
    if (!Array.isArray(items)) continue;
    for (const it of items) {
      if (!it || typeof it !== 'object') continue;
      rows.push([
        it.link || '',
        it.title?.rendered || '',
        type,
        it.status || '',
        it.id || '',
        it.parent ?? '',
        (it.content?.rendered || '').length,
      ]);
    }
  }
  const csv = rows.map(r => r.map(csvEscape).join(',')).join('\n');
  fs.writeFileSync(path.join(OUT, 'master-page-list.csv'), csv);
  console.log(`  wrote master-page-list.csv (${rows.length - 1} entries)`);
}

(async () => {
  console.log(`Exporting from ${SITE}`);

  // 1. Verify auth
  const me = await apiGet('users/me');
  if (!me.ok) {
    console.error(`Auth failed: ${me.status} ${me.body?.slice(0, 300)}`);
    console.error('Check WP_USER (WP username, may not be the email) and WP_APP_PASSWORD in .env');
    process.exit(1);
  }
  console.log(`  authed as: ${me.data.name} (id ${me.data.id}, roles ${me.data.roles?.join(',') || '?'})`);

  // 2. Core content types
  const collected = {};
  for (const ep of ['pages', 'posts', 'media', 'categories', 'tags', 'users']) {
    const endpoint = ep === 'media' ? 'media' : `${ep}?status=any`.replace('users?status=any', 'users');
    console.log(`Fetching ${ep}...`);
    const items = await fetchAll(endpoint, ep);
    save(`${ep}.json`, items);
    collected[ep] = items;
  }

  // 3. Discover CPTs
  console.log('Discovering custom post types...');
  const types = await apiGet('types');
  if (types.ok) {
    save('post-types.json', types.data);
    const builtIn = new Set(['post', 'page', 'attachment', 'nav_menu_item', 'wp_block', 'wp_template', 'wp_template_part', 'wp_navigation', 'wp_global_styles', 'wp_font_family', 'wp_font_face']);
    for (const [key, info] of Object.entries(types.data)) {
      if (builtIn.has(key)) continue;
      if (!info.rest_base) continue;
      console.log(`Fetching CPT: ${key} (rest_base=${info.rest_base})`);
      const items = await fetchAll(`${info.rest_base}?status=any`, `cpt:${key}`);
      if (items.length) {
        save(`cpt-${info.rest_base}.json`, items);
        collected[`cpt_${info.rest_base}`] = items;
      }
    }
  }

  // 4. Taxonomies + settings + menus
  console.log('Fetching taxonomies/settings/menus...');
  for (const ep of ['taxonomies', 'settings', 'menus', 'menu-items']) {
    const r = await apiGet(ep);
    if (r.ok) save(`${ep}.json`, r.data);
    else console.log(`  ${ep}: ${r.status} (skipped)`);
  }

  // 5. Master list
  console.log('Building master page list...');
  buildMasterList(collected);

  // 6. Download media
  console.log('Downloading media library...');
  await downloadMedia(collected.media || []);

  console.log('Export complete.');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
