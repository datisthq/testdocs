import type { Plugin } from "vite"
import { partitionCode } from "../../actions/code/partition.ts"
import { parseMarkdown } from "../../actions/markdown/parse.ts"
import { createProject } from "../../actions/project/create.ts"
import { renderTestModule } from "../../actions/test/render.ts"

/**
 * Vite plugin that turns runnable code blocks in `.md` files into vitest tests.
 */
export default function testdocs(): Plugin {
  const project = createProject()
  return {
    name: "testdocs",
    transform(code, id) {
      if (!id.endsWith(".md")) return
      const blocks = parseMarkdown(code)
      const filename = id.split("/").pop() ?? id
      const enriched = blocks.map(block => ({
        ...block,
        ...partitionCode(block.code, project),
      }))
      return { code: renderTestModule(enriched, filename), map: null }
    },
  }
}
