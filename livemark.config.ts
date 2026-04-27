import { defineConfig } from "livemark"

export default defineConfig({
  site: "https://testdocs.dev",
  title: "Testdocs",
  description: "Testdocs description",
  logo: "/logo.svg",
  include: ["docs/**/*.md", "README.md"],
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
  ],
})
