export const SITE = {
  name: "Regtek Consulting",
  domain: "https://regtekconsulting.com",
  email: "kdillon@regtekconsulting.com",
  phone: "(908) 900-4799",
  founder: "Kevin Dillon",
  tagline: "Data-Driven Marketing. Real Results.",
  footerStory: "Named after our founder's best friend",
  description:
    "Founder-led digital marketing for healthcare practices. Google Ads, Meta Ads, and conversion-optimized web design, built by someone who scaled a healthcare business to Inc 5000.",
};

export const NAV = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Google Ads", href: "/services/google-ads" },
      { label: "Meta Ads", href: "/services/meta-ads" },
      { label: "Website Design", href: "/services/website-design" },
      { label: "Software Development", href: "/services/software-development" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Tips & Tricks", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const SERVICES = [
  {
    slug: "google-ads",
    title: "Google Ads Management",
    shortTitle: "Google Ads",
    tagline: "Turn search intent into booked appointments",
    description:
      "Most Google Ads campaigns chase clicks. We build campaigns that turn high-intent searchers into customers who actually show up and pay for your services.",
    href: "/services/google-ads",
  },
  {
    slug: "meta-ads",
    title: "Meta Ads Management",
    shortTitle: "Meta Ads",
    tagline: "Reach your ideal patients where they scroll",
    description:
      "Facebook and Instagram ads for healthcare practices. Compliance-native, laser-targeted, and built around your ideal patient, not broad-audience blasts.",
    href: "/services/meta-ads",
  },
  {
    slug: "website-design",
    title: "Website Design & CRO",
    shortTitle: "Website Design",
    tagline: "Your website should be your best salesperson",
    description:
      "Conversion-optimized websites for healthcare practices. Every element placed to guide visitors toward booking, not just look pretty.",
    href: "/services/website-design",
  },
  {
    slug: "software-development",
    title: "Custom Apps & Automations",
    shortTitle: "Software Development",
    tagline: "Custom software built around how your business actually works",
    description:
      "Internal dashboards, admin tools, and workflow automations that eliminate manual work. Built by someone who's run operations, not just a developer.",
    href: "/services/software-development",
  },
];

export const PROOF_STATS = [
  { value: "63%+", label: "Paid Search Growth" },
  { value: "2,000+", label: "Conversions Managed" },
  { value: "$250K", label: "Ad Spend Managed" },
];

export const TESTIMONIAL = {
  quote:
    "It feels like they are really part of the team with us, even though they're a separate agency, which is just not something we've experienced with anybody else.",
  author: "Dr. Aditi Menon",
  role: "Owner, Menon Regenerative Institute",
};
