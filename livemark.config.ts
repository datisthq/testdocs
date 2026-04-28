import { defineConfig } from "livemark"

export default defineConfig({
  site: "https://testdocs.dev",
  title: "Testdocs",
  description: "Test codeblocks in Vitest/Jest",
  logo: "/logo.svg",
  favicon: "/logo.png",
  include: ["docs/**/*.md", "README.md", "CONTRIBUTING.md"],
  sections: [
    { title: "Docs", prefix: "/" },
    {
      title: "Changelog",
      prefix: "/changelog/",
      type: "changelog",
      source: "https://github.com/datisthq/testdocs",
      version: true,
    },
  ],
  links: [
    {
      url: "https://github.com/datisthq/testdocs",
      title: "GitHub",
      icon: "github",
    },
  ],
  patches: [
    {
      file: "README.md",
      article: {
        title: "Introduction",
        description: "Install testdocs and get started.",
        icon: "rocket",
        order: 1,
        path: "/introduction/",
      },
    },
    {
      file: "CONTRIBUTING.md",
      article: {
        title: "Contributing",
        description:
          "How to set up testdocs locally, propose changes, and ship a release.",
        icon: "heart-handshake",
        order: -1,
        path: "/contributing/",
      },
    },
  ],
})
