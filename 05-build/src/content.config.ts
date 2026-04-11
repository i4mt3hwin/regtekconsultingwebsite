import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro:content";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdoc}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    publishDate: z.coerce.date(),
    category: z.enum([
      "case-studies-results",
      "website-conversion-optimization",
      "general",
    ]),
    excerpt: z.string(),
    heroImage: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdoc}", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    order: z.number(),
    tagline: z.string(),
    description: z.string(),
    heroEyebrow: z.string().optional(),
    heroHeadline: z.string().optional(),
    heroSubtitle: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.{md,yaml,yml}", base: "./src/content/testimonials" }),
  schema: z.object({
    author: z.string(),
    role: z.string(),
    quote: z.string(),
    featured: z.boolean().default(false),
    photo: z.string().optional(),
  }),
});

export const collections = { posts, services, testimonials };
