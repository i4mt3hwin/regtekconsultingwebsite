// Load Keystatic singleton content via Vite's import.meta.glob so the YAML
// is inlined at build time. Works in dev, SSR, and Cloudflare Workers (no fs).

import yaml from "yaml";

// Vite inlines these as raw strings at build time.
const homepageRaw = import.meta.glob("/src/content/homepage/*.yaml", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const siteSettingsRaw = import.meta.glob("/src/content/site-settings/*.yaml", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function firstEntry(map: Record<string, string>): string {
  const keys = Object.keys(map);
  if (keys.length === 0) {
    throw new Error("No content file found in glob result");
  }
  return map[keys[0]];
}

export interface ProofStat {
  value: string;
  label: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  contactEmail: string;
  footerStory: string;
  proofStats: ProofStat[];
}

export interface HomepageContent {
  heroEyebrow: string;
  heroHeadlineLine1: string;
  heroHeadlineLine2: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaHref: string;
  trustStripHeadline: string;
  painHeadline: string;
  caseStudyEyebrow: string;
  caseStudyHeadlineLine1: string;
  caseStudyHeadlineLine2: string;
  caseStudySubtitle: string;
  caseStudyLink: string;
  whyUsHeadline: string;
  servicesHeadline: string;
  servicesSubtitle: string;
  finalCtaEyebrow: string;
  finalCtaHeadline: string;
  finalCtaSubtitle: string;
}

export function getSiteSettings(): SiteSettings {
  return yaml.parse(firstEntry(siteSettingsRaw)) as SiteSettings;
}

export function getHomepageContent(): HomepageContent {
  return yaml.parse(firstEntry(homepageRaw)) as HomepageContent;
}
