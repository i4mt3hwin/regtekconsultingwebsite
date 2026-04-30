import { defineMarkdocConfig, component, nodes } from "@astrojs/markdoc/config";

export default defineMarkdocConfig({
  tags: {
    faqItem: {
      render: component("./src/components/FaqItem.astro"),
      attributes: {
        question: { type: String, required: true },
      },
    },
    cta: {
      render: component("./src/components/Cta.astro"),
      attributes: {
        href:  { type: String, required: true },
        style: { type: String, default: "primary" },
      },
    },
    callout: {
      render: component("./src/components/Callout.astro"),
      attributes: {
        type:  { type: String, default: "info" },
        title: { type: String },
      },
    },
    pullQuote: {
      render: component("./src/components/PullQuote.astro"),
      attributes: {
        attribution: { type: String },
      },
    },
  },
  nodes: {
    link: {
      attributes: nodes.link.attributes,
      render: component("./src/components/MarkdocLink.astro"),
    },
  },
});
