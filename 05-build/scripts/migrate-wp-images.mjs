#!/usr/bin/env node
// One-off migration: download WP-hotlinked images in blog posts to public/images/posts/inline/
// and rewrite the .mdoc references to use local paths.
//
// Safe to re-run — skips files that already exist locally, regex replace is idempotent.

import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";
import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUILD_ROOT = resolve(__dirname, "..");
const POSTS_DIR = join(BUILD_ROOT, "src", "content", "posts");
const IMAGES_DIR = join(BUILD_ROOT, "public", "images", "posts", "inline");
const LOCAL_URL_PREFIX = "/images/posts/inline/";
const WP_URL_RE = /https:\/\/regtekconsulting\.com\/wp-content\/uploads\/[^\s)"']+/g;

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  if (!res.body) throw new Error(`${url} → empty body`);
  await finished(Readable.fromWeb(res.body).pipe(createWriteStream(dest)));
}

async function main() {
  await mkdir(IMAGES_DIR, { recursive: true });

  const files = (await readdir(POSTS_DIR)).filter((f) => f.endsWith(".mdoc"));
  let downloaded = 0;
  let skipped = 0;
  let rewritten = 0;

  for (const file of files) {
    const path = join(POSTS_DIR, file);
    const src = await readFile(path, "utf8");
    const matches = [...new Set(src.match(WP_URL_RE) ?? [])];
    if (matches.length === 0) continue;

    console.log(`\n[${file}] found ${matches.length} WP image URL(s)`);

    let updated = src;
    for (const url of matches) {
      const filename = decodeURIComponent(basename(new URL(url).pathname));
      const dest = join(IMAGES_DIR, filename);
      if (await exists(dest)) {
        console.log(`  ↷ skip ${filename} (already downloaded)`);
        skipped++;
      } else {
        try {
          await download(url, dest);
          console.log(`  ✓ downloaded ${filename}`);
          downloaded++;
        } catch (err) {
          console.error(`  ✗ failed ${url}: ${err.message}`);
          continue;
        }
      }
      updated = updated.split(url).join(LOCAL_URL_PREFIX + filename);
    }

    if (updated !== src) {
      await writeFile(path, updated, "utf8");
      rewritten++;
      console.log(`  → rewrote ${file}`);
    }
  }

  console.log(
    `\nDone. Downloaded: ${downloaded}. Skipped (already local): ${skipped}. Posts rewritten: ${rewritten}.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
