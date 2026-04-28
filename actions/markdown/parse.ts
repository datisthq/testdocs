import { toString } from "mdast-util-to-string"
import remarkParse from "remark-parse"
import { unified } from "unified"
import type { Block } from "../../models/block.ts"

/**
 * Extract runnable code blocks from markdown. A block is runnable when its
 * fence info string starts with `ts` or `tsx` and includes the token `test`.
 */
export function parseMarkdown(source: string): Block[] {
  const tree = unified().use(remarkParse).parse(source)
  const blocks: Block[] = []
  let currentHeading = ""

  for (const node of tree.children) {
    if (node.type === "heading") {
      currentHeading = toString(node)
    } else if (node.type === "code") {
      const lang = node.lang ?? ""
      const tokens = (node.meta ?? "").split(/\s+/).filter(Boolean)
      if ((lang === "ts" || lang === "tsx") && tokens.includes("test")) {
        blocks.push({ heading: currentHeading, code: node.value })
      }
    }
  }
  return blocks
}
