export type Block = { heading: string; code: string }

/**
 * Extract runnable code blocks from markdown. A block is runnable when its
 * fence info string starts with `ts` or `tsx` and includes the token `test`.
 */
export function parseMarkdown(source: string): Block[] {
  const lines = source.split("\n")
  const blocks: Block[] = []
  let currentHeading = ""
  let inFence = false
  let isRunnable = false
  let fenceLines: string[] = []

  for (const line of lines) {
    if (inFence) {
      if (/^```\s*$/.test(line)) {
        if (isRunnable) {
          blocks.push({
            heading: currentHeading,
            code: fenceLines.join("\n"),
          })
        }
        inFence = false
        isRunnable = false
        fenceLines = []
      } else {
        fenceLines.push(line)
      }
    } else {
      const fenceMatch = line.match(/^```([^\s`]*)\s*(.*)$/)
      if (fenceMatch) {
        const lang = fenceMatch[1] ?? ""
        const info = (fenceMatch[2] ?? "").trim()
        const tokens = info.length > 0 ? info.split(/\s+/) : []
        isRunnable =
          (lang === "ts" || lang === "tsx") && tokens.includes("test")
        inFence = true
      } else {
        const headingMatch = line.match(/^#{1,6}\s+(.+?)\s*$/)
        if (headingMatch) {
          currentHeading = headingMatch[1] ?? ""
        }
      }
    }
  }
  return blocks
}
