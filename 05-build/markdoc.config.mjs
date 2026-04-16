import { defineMarkdocConfig, component } from "@astrojs/markdoc/config";

export default defineMarkdocConfig({
  tags: {
    faqItem: {
      render: component("./src/components/FaqItem.astro"),
      attributes: {
        question: { type: String, required: true },
      },
    },
  },
});
