import { describe, expect, it } from "vite-plus/test"
import { renderTestModule } from "./render.ts"

describe("renderTestModule", () => {
  it("returns export {} for empty input", () => {
    expect(renderTestModule([], "foo.md")).toBe("export {}\n")
  })

  it("wraps a single block in describe + async it", () => {
    const out = renderTestModule(
      [
        {
          heading: "Adds",
          code: "",
          imports: [],
          body: "expect(1).toBe(1)",
        },
      ],
      "foo.md",
    )
    expect(out).toContain(`describe("foo.md", () =>`)
    expect(out).toContain(`it("Adds", async () =>`)
    expect(out).toContain("expect(1).toBe(1)")
    expect(out).toContain(`import { describe, it } from "vitest"`)
  })

  it("suffixes duplicate headings with #N", () => {
    const out = renderTestModule(
      [
        { heading: "Adds", code: "", imports: [], body: "a" },
        { heading: "Adds", code: "", imports: [], body: "b" },
      ],
      "foo.md",
    )
    expect(out).toContain(`it("Adds #1"`)
    expect(out).toContain(`it("Adds #2"`)
  })

  it("dedupes imports across blocks", () => {
    const out = renderTestModule(
      [
        {
          heading: "A",
          code: "",
          imports: [`import { sum } from "lib"`],
          body: "sum(1, 2)",
        },
        {
          heading: "B",
          code: "",
          imports: [`import { sum } from "lib"`],
          body: "sum(3, 4)",
        },
      ],
      "foo.md",
    )
    const matches = out.match(/import \{ sum \} from "lib"/g) ?? []
    expect(matches).toHaveLength(1)
  })

  it("falls back to filename basename when heading is empty", () => {
    const out = renderTestModule(
      [{ heading: "", code: "", imports: [], body: "ok()" }],
      "configuration.md",
    )
    expect(out).toContain(`it("configuration"`)
  })

  it("emits empty it body cleanly", () => {
    const out = renderTestModule(
      [
        {
          heading: "X",
          code: "",
          imports: [`import "side-effect"`],
          body: "",
        },
      ],
      "foo.md",
    )
    expect(out).toContain(`it("X", async () => {})`)
    expect(out).toContain(`import "side-effect"`)
  })
})
