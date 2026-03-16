# Plan: Bootstrap testblock from livemark template

## Context
Copy the bootstrapped livemark monorepo into testblock, replacing all occurrences of "livemark" with "testblock" and "Livemark" with "Testblock". The testblock directory already has `.git` and `.tmuxp.yml` (already renamed), so we skip those.

## Files to Create

All paths relative to `/home/roll/projects/testblock/`.

### Root config files
1. **package.json** — copy as-is (no "livemark" references)
2. **tsconfig.json** — copy as-is
3. **vite.config.ts** — copy as-is
4. **pnpm-workspace.yaml** — copy as-is
5. **.releaserc.json** — copy as-is
6. **.mcp.json** — `{}` (empty)
7. **LICENSE.md** — copy as-is
8. **README.md** — replace: `# Livemark` → `# Testblock`, `Livemark description` → `Testblock description`
9. **CONTRIBUTING.md** — copy as-is (no livemark references)
10. **AGENTS.md** — copy as-is (no livemark references)

### Library package
11. **library/package.json** — replace: name `livemark` → `testblock`, repo URL `datisthq/livemark` → `datisthq/testblock`, description `Livemark` → `Testblock`, keyword `livemark` → `testblock`
12. **library/index.ts** — replace: `export const livemark = "livemark"` → `export const testblock = "testblock"`
13. **library/tsconfig.json** — copy as-is

### Website package
14. **website/package.json** — replace: title `Livemark` → `Testblock`, description, repo URL, homepage `livemark.dev` → `testblock.dev`
15. **website/astro.config.ts** — copy as-is (reads from package.json dynamically)
16. **website/content.config.ts** — copy as-is (reads from package.json dynamically)
17. **website/tsconfig.json** — copy as-is
18. **website/styles/general.css** — copy as-is
19. **website/components/builtin/SocialIcons.astro** — copy as-is
20. **website/content/docs/index.md** — replace: `Livemark` → `Testblock`, repo URLs `datisthq/livemark` → `datisthq/testblock`
21. **website/public/favicon.png** — copy binary file
22. **website/assets/hero.png** — copy binary file
23. **website/assets/logo.svg** — copy file

### GitHub config
24. **.github/codecov.yaml** — copy as-is
25. **.github/workflows/general.yaml** — copy as-is
26. **.github/ISSUE_TEMPLATE/01-bug-report.yaml** — copy as-is
27. **.github/ISSUE_TEMPLATE/02-general-issue.yaml** — copy as-is
28. **.github/ISSUE_TEMPLATE/config.yml** — replace all `datisthq/livemark` → `datisthq/testblock`, `Livemark` → `Testblock`

### Skip
- `.tmuxp.yml` — already exists with correct name
- `.git/` — already exists
- `node_modules/`, `coverage/`, `build/`, `.astro/`, `pnpm-lock.yaml` — generated files, not part of bootstrap

## Name Replacement Rules
| Original | Replacement |
|----------|-------------|
| `livemark` (lowercase) | `testblock` |
| `Livemark` (capitalized) | `Testblock` |
| `livemark.dev` | `testblock.dev` |
| `datisthq/livemark` | `datisthq/testblock` |

## Verification
1. Run `pnpm install` to verify package resolution
2. Run `pnpm build` to verify library builds
3. Run `pnpm test` to verify tests pass
4. Grep for any remaining "livemark" references: `grep -ri livemark --include='*.{ts,json,md,yaml,yml,css,astro}'`
