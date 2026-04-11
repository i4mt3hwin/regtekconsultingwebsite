import { config, fields, collection, singleton } from "@keystatic/core";

export default config({
  storage: {
    kind: "github",
    repo: "i4mt3hwin/regtekconsultingwebsite",
    pathPrefix: "05-build",
  },
  ui: {
    brand: { name: "Regtek Consulting" },
    navigation: {
      Content: ["posts", "services", "testimonials"],
      Site: ["siteSettings", "homepage"],
    },
  },
  collections: {
    posts: collection({
      label: "Blog Posts",
      slugField: "title",
      path: "src/content/posts/*",
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["title", "publishDate", "category"],
      schema: {
        title: fields.slug({
          name: { label: "Title", validation: { length: { min: 1 } } },
        }),
        publishDate: fields.date({
          label: "Publish Date",
          validation: { isRequired: true },
        }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "Case Studies & Results", value: "case-studies-results" },
            { label: "Website & Conversion Optimization", value: "website-conversion-optimization" },
            { label: "General", value: "general" },
          ],
          defaultValue: "general",
        }),
        excerpt: fields.text({
          label: "Excerpt",
          description: "Shown on the blog index and in meta descriptions",
          multiline: true,
          validation: { length: { min: 1, max: 300 } },
        }),
        heroImage: fields.image({
          label: "Hero Image",
          directory: "public/images/posts",
          publicPath: "/images/posts/",
        }),
        metaTitle: fields.text({
          label: "SEO Meta Title",
          description: "Overrides the title in <title> and Open Graph. Leave blank to use Title.",
        }),
        metaDescription: fields.text({
          label: "SEO Meta Description",
          multiline: true,
        }),
        featured: fields.checkbox({
          label: "Featured Post",
          description: "Featured posts get prominent placement on the homepage and blog index",
          defaultValue: false,
        }),
        content: fields.markdoc({
          label: "Content",
          options: {
            image: {
              directory: "public/images/posts",
              publicPath: "/images/posts/",
            },
          },
        }),
      },
    }),

    services: collection({
      label: "Services",
      slugField: "title",
      path: "src/content/services/*",
      format: { contentField: "content" },
      columns: ["title", "order"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        shortTitle: fields.text({
          label: "Short Title",
          description: "Used in nav menus and cards (e.g., 'Google Ads')",
        }),
        order: fields.number({
          label: "Display Order",
          description: "Lower numbers show first",
          defaultValue: 1,
          validation: { isRequired: true, min: 1, max: 99 },
        }),
        tagline: fields.text({
          label: "One-line Tagline",
          description: "Short punchy line for service cards",
        }),
        description: fields.text({
          label: "Short Description",
          description: "2-3 sentences used on homepage service grid",
          multiline: true,
        }),
        heroEyebrow: fields.text({ label: "Hero Eyebrow Text" }),
        heroHeadline: fields.text({
          label: "Hero Headline",
          description: "Main H1 on the service page",
          multiline: true,
        }),
        heroSubtitle: fields.text({
          label: "Hero Subtitle",
          multiline: true,
        }),
        metaTitle: fields.text({ label: "SEO Meta Title" }),
        metaDescription: fields.text({
          label: "SEO Meta Description",
          multiline: true,
        }),
        content: fields.markdoc({
          label: "Full Service Page Content",
          options: {
            image: {
              directory: "public/images/services",
              publicPath: "/images/services/",
            },
          },
        }),
      },
    }),

    testimonials: collection({
      label: "Testimonials",
      slugField: "author",
      path: "src/content/testimonials/*",
      columns: ["author", "role", "featured"],
      schema: {
        author: fields.slug({ name: { label: "Author Name" } }),
        role: fields.text({
          label: "Role / Practice",
          description: "e.g., 'Owner, Menon Regenerative Institute'",
        }),
        quote: fields.text({
          label: "Quote",
          multiline: true,
          validation: { length: { min: 1 } },
        }),
        featured: fields.checkbox({
          label: "Featured",
          description: "Show on homepage and contact page",
          defaultValue: false,
        }),
        photo: fields.image({
          label: "Photo (optional)",
          directory: "public/images/testimonials",
          publicPath: "/images/testimonials/",
        }),
      },
    }),
  },
  singletons: {
    siteSettings: singleton({
      label: "Site Settings",
      path: "src/content/site-settings",
      schema: {
        siteName: fields.text({ label: "Site Name", defaultValue: "Regtek Consulting" }),
        tagline: fields.text({
          label: "Tagline",
          defaultValue: "Data-Driven Marketing. Real Results.",
        }),
        description: fields.text({
          label: "Default Site Description (meta)",
          multiline: true,
        }),
        contactEmail: fields.text({
          label: "Contact Email",
          defaultValue: "kdillon@regtekconsulting.com",
        }),
        footerStory: fields.text({
          label: "Footer Story",
          description: "The little story line at the bottom of the footer",
          multiline: true,
          defaultValue: "Named after our founder's best friend. Founder-led digital marketing for healthcare practices.",
        }),
        proofStats: fields.array(
          fields.object({
            value: fields.text({ label: "Value", description: "e.g., '63%+' or '$100K+'" }),
            label: fields.text({ label: "Label", description: "e.g., 'Paid Search Growth'" }),
          }),
          {
            label: "Proof Stats",
            description: "The trust-strip stats shown on homepage and service pages",
            itemLabel: (props) => `${props.fields.value.value} ${props.fields.label.value}`,
          },
        ),
      },
    }),
    homepage: singleton({
      label: "Homepage",
      path: "src/content/homepage",
      schema: {
        heroEyebrow: fields.text({
          label: "Hero Eyebrow",
          defaultValue: "Small Business Digital Marketing",
        }),
        heroHeadlineLine1: fields.text({
          label: "Hero Headline Line 1",
          defaultValue: "Turn Your Marketing Into",
        }),
        heroHeadlineLine2: fields.text({
          label: "Hero Headline Line 2 (highlighted in brand color)",
          defaultValue: "Predictable Revenue",
        }),
        heroSubtitle: fields.text({
          label: "Hero Subtitle",
          multiline: true,
          defaultValue:
            "Work directly with a founder who scaled a healthcare business to Inc 5000 status. Get strategic guidance that goes beyond marketing — backed by proven results.",
        }),
        heroCtaText: fields.text({ label: "Hero CTA Button Text", defaultValue: "Book Your Free Consultation" }),
        heroCtaHref: fields.text({ label: "Hero CTA Link", defaultValue: "/contact" }),

        trustStripHeadline: fields.text({
          label: "Trust Strip Headline",
          defaultValue: "Trusted by growing healthcare practices to generate:",
        }),

        painHeadline: fields.text({
          label: "Pain Section Headline",
          multiline: true,
          defaultValue: "You've Built Something Great Through Word-of-Mouth. Now It's Time to Scale.",
        }),
        painContent: fields.markdoc({ label: "Pain Section Body" }),

        caseStudyEyebrow: fields.text({ label: "Case Study Eyebrow", defaultValue: "Real Results" }),
        caseStudyHeadlineLine1: fields.text({
          label: "Case Study Headline Line 1",
          defaultValue: "$37 Per Dermatology Lead.",
        }),
        caseStudyHeadlineLine2: fields.text({
          label: "Case Study Headline Line 2",
          defaultValue: "Industry Average: $120+.",
        }),
        caseStudySubtitle: fields.text({
          label: "Case Study Subtitle",
          multiline: true,
          defaultValue:
            "One dermatology practice brought their cost-per-lead down to $37 — 70% below industry benchmarks — by rebuilding their Google Ads strategy around operational reality, not vanity metrics.",
        }),
        caseStudyLink: fields.text({
          label: "Case Study Link",
          defaultValue: "/blog/dermatology-lead-cost-case-study",
        }),

        whyUsHeadline: fields.text({
          label: "Why Us Headline",
          multiline: true,
          defaultValue: "We Don't Just Do Marketing. We Understand Your Business.",
        }),
        whyUsContent: fields.markdoc({ label: "Why Us Body" }),

        servicesHeadline: fields.text({ label: "Services Section Headline", defaultValue: "What We Do" }),
        servicesSubtitle: fields.text({
          label: "Services Section Subtitle",
          multiline: true,
          defaultValue:
            "Discover how strategic marketing can transform your healthcare practice. Pick what you need — or let us build you a complete system.",
        }),

        finalCtaEyebrow: fields.text({ label: "Final CTA Eyebrow", defaultValue: "Let's Talk Growth" }),
        finalCtaHeadline: fields.text({
          label: "Final CTA Headline",
          defaultValue: "Ready to Stop Guessing and Start Growing?",
        }),
        finalCtaSubtitle: fields.text({
          label: "Final CTA Subtitle",
          multiline: true,
          defaultValue:
            "Book a free consultation. We'll dig into your business, your goals, and whether we're the right fit. No pressure, no pitch-deck theater.",
        }),
      },
    }),
  },
});
