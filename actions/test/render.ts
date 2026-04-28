import type { Project } from "ts-morph"
import type { Block } from "../../models/block.ts"
import type { Partition } from "../../models/partition.ts"
import type { Plugin } from "../../models/plugin.ts"
import { createProject } from "../project/create.ts"

/**
 * Assemble the final test module from parsed blocks and their partitioned
 * code, using the plugin's `initialImport` (if any) as the seed for the
 * hoisted import set. Imports are deduped across all blocks.
 */
export function renderTestModule(
  blocks: (Block & Partition)[],
  filename: string,
  options: { plugin: Plugin; project?: Project },
): string {
  if (blocks.length === 0) return "export {}\n"

  const project = options.project ?? createProject()
  const file = project.createSourceFile("__out.ts", "", { overwrite: true })

  const seen = new Set<string>(
    options.plugin.initialImport ? [options.plugin.initialImport] : [],
  )
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
