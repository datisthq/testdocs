import type { Block } from "../../models/block.ts"
import type { Partition } from "../../models/partition.ts"

/**
 * Assemble the final vitest test module from parsed blocks and their
 * partitioned code. Imports are deduped and hoisted to module scope.
 */
export function renderTestModule(
  blocks: (Block & Partition)[],
  filename: string,
): string {
  if (blocks.length === 0) return "export {}\n"

  const fallback = filename.replace(/\.md$/, "")
  const names = assignNames(blocks, fallback)

  const importSet = new Set<string>([`import { describe, it } from "vitest"`])
  for (const block of blocks) {
    for (const imp of block.imports) importSet.add(imp)
  }

  const itLines = blocks.map((block, index) =>
    renderIt(names[index] ?? fallback, block.body),
  )

  return `${[...importSet].join("\n")}

describe(${JSON.stringify(filename)}, () => {
${itLines.join("\n")}
})
`
}

function assignNames(
  blocks: { heading: string }[],
  fallback: string,
): string[] {
  const raw = blocks.map(block => block.heading || fallback)
  const totals = new Map<string, number>()
  for (const name of raw) {
    totals.set(name, (totals.get(name) ?? 0) + 1)
  }
  const seen = new Map<string, number>()
  return raw.map(name => {
    const total = totals.get(name) ?? 0
    if (total <= 1) return name
    const occurrence = (seen.get(name) ?? 0) + 1
    seen.set(name, occurrence)
    return `${name} #${occurrence}`
  })
}

function renderIt(name: string, body: string): string {
  if (body.length === 0) {
    return `  it(${JSON.stringify(name)}, async () => {})`
  }
  const indented = body
    .split("\n")
    .map(line => (line.length > 0 ? `    ${line}` : line))
    .join("\n")
  return `  it(${JSON.stringify(name)}, async () => {\n${indented}\n  })`
}
