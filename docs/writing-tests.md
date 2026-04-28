# Writing tests

Mark a code block in any `.md` file as a runnable test by adding `test` to its fence info string.

```ts test
expect(1 + 1).toBe(2)
```

The fence above is now a test. Untagged `ts` blocks render normally and are not run.

## Test names

The test name comes from the nearest preceding heading. Two blocks under the same heading are suffixed `#1`, `#2`, etc. A block with no preceding heading uses the file basename.

## Imports

`describe`, `it`, and `expect` are injected automatically — you don't need to import them. Any other `import` statements inside a runnable block are hoisted to the module top and shared across every test in the same `.md` file. Multi-line imports work.

## Setup (vitest / vite-plus)

Add the plugin to your vite config and include `.md` files in vitest's discovery. The same plugin works for both `vitest` and `vite-plus` projects — the generated test modules import from whichever runner is installed.

```ts
import testdocs from "testdocs/vite"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [testdocs()],
  test: {
    include: ["**/*.test.ts", "docs/**/*.md"],
  },
})
```

## Setup (jest)

Use the jest transformer entry instead. Generated tests rely on jest's globals (`describe`/`it`/`expect`), so no extra import is injected.

```ts
export default {
  transform: { "\\.md$": "testdocs/jest" },
  testMatch: ["**/*.test.ts", "**/docs/**/*.md"],
}
```

testdocs is published as ESM, so default-CJS jest setups may need `--experimental-vm-modules` or equivalent ESM config.
