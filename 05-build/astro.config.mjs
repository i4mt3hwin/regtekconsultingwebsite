// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.regtekconsulting.com',
  output: 'server',
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  integrations: [react(), markdoc(), keystatic(), sitemap()],
  // 301 redirects from the old WordPress URL structure
  redirects: {
    '/google-ads': '/services/google-ads',
    '/meta-ads': '/services/meta-ads',
    '/website-design': '/services/website-design',
    '/tips-tricks': '/blog',
    '/sample-page': '/',
    '/coming-soon': '/',
    '/home': '/',
    '/blog/seo-strategy-basics-h1-meta-titles-descriptions-healthcare-6': '/blog/seo-strategy-basics',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    format: 'file',
  },
  trailingSlash: 'never',
});
