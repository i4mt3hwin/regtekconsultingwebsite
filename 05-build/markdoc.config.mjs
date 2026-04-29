import { defineMarkdocConfig, component, nodes } from "@astrojs/markdoc/config";

export default defineMarkdocConfig({
  tags: {
    faqItem: {
      render: component("./src/components/FaqItem.astro"),
      attributes: {
        question: { type: String, required: true },
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
