import type { Project } from "ts-morph"
import type { Block } from "../../models/block.ts"
import type { Partition } from "../../models/partition.ts"
import { createProject } from "../project/create.ts"

/**
 * Assemble the final vitest test module from parsed blocks and their
 * partitioned code. Imports are deduped and hoisted to module scope.
 */
export function renderTestModule(
  blocks: (Block & Partition)[],
  filename: string,
  project?: Project,
): string {
  if (blocks.length === 0) return "export {}\n"

  project ??= createProject()
  const file = project.createSourceFile("__out.ts", "", { overwrite: true })

  const seen = new Set<string>([
    `import { describe, expect, it } from "vitest"`,
  ])
  for (const block of blocks) {
    for (const imp of block.imports) seen.add(imp)
  }
  for (const imp of seen) file.addStatements(imp)

  const fallback = filename.replace(/\.md$/, "")
  const names = assignNames(blocks, fallback)
  const itStatements = blocks
    .map((block, index) => renderIt(names[index] ?? fallback, block.body))
    .join("\n")
  file.addStatements(
    `describe(${JSON.stringify(filename)}, () => {\n${itStatements}\n})`,
  )

  file.formatText({ indentSize: 2, convertTabsToSpaces: true })
  return file.getFullText()
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
  const safeName = JSON.stringify(name)
  if (body.length === 0) {
    return `it(${safeName}, async () => {})`
  }
  return `it(${safeName}, async () => {\n${body}\n})`
}
