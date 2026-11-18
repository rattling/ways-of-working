# Node stack

**Today:** <!-- Node version, package manager, framework if any, TypeScript or JavaScript, where it runs -->
**Moving to:** <!-- e.g. an active LTS Node, pnpm, TypeScript in strict mode for new code. Framework changes only by ADR. -->

A Node version past end of life ([nodejs.org/about/previous-releases](https://nodejs.org/en/about/previous-releases)) makes the upgrade a security item, not polish.

| Concern | Tool | In the gate as |
|---|---|---|
| Packages | pnpm, with `pnpm-lock.yaml` committed. npm only where a repo hasn't moved yet (below) | `pnpm install --frozen-lockfile` |
| Formatting and lint | One formatter and one linter per repo (Prettier and ESLint, or Biome) | Their check commands, through a `pnpm` script |
| Types | TypeScript, `strict` on new code | `pnpm tsc --noEmit` |
| Tests | One runner per repo (Vitest, Jest or `node --test`) | `pnpm test` |
| Dependencies | `pnpm audit`; Dependabot for npm/pnpm | `pnpm audit --audit-level high` |
| Security analysis | CodeQL for JavaScript/TypeScript (`codeql.yml`) | A code scanning rule on `main` |

## Supply chain

`security.md` has the rules. In a pnpm repo they live in `pnpm-workspace.yaml`:

```yaml
minimumReleaseAge: 20160      # the 14-day hold, in minutes

# Build scripts (preinstall, install, postinstall) run only for packages listed true.
# strictDepBuilds fails an install that meets an unlisted one, so every package is a decision.
# (pnpm 11 and later do this by default; 10.26 needs the line.)
strictDepBuilds: true
allowBuilds:
  esbuild: true               # downloads its platform binary; needed by the build
  # some-package: false       # has a script it doesn't need here

auditConfig:
  ignoreGhsas: []             # empty must be [], or pnpm can't read the file
  # ignoreGhsas:
  #   - GHSA-xxxx-xxxx-xxxx   # package: why it doesn't apply here; until <end condition>
```

- **Frozen installs:** `pnpm install --frozen-lockfile` in the gate and CI. It fails if the lockfile doesn't match `package.json`.
- **Build scripts.** pnpm runs none unless the package is in `allowBuilds`, and stops the install at one it hasn't been told about (`ERR_PNPM_IGNORED_BUILDS`). `pnpm approve-builds` asks about each one and writes the list. Allow only what the repo needs to work, with a comment saying why. Set `false` for the rest, so the next install doesn't ask again.
- **The audit:** `pnpm audit --audit-level high` in the gate. An advisory that doesn't apply goes in `auditConfig.ignoreGhsas` with a comment: the package, why, and when it comes out.
- **Exceptions to the 14-day hold** go in `minimumReleaseAgeExclude`, with the same kind of comment (`security.md`, "The 14-day hold").

### A repo still on npm

npm can't do the 14-day hold, can't allow build scripts one package at a time, and has no list of ignored advisories. Until the repo moves to pnpm, `CODING_STANDARDS.md` says it's on npm and:

- the gate uses `npm ci` and `npm audit --audit-level=high`;
- `.npmrc` has `ignore-scripts=true`. A package that needs its script gets it run by name in a `package.json` script (`npm rebuild esbuild`), with a comment;
- an advisory that doesn't apply means pinning around it with `overrides` in `package.json`, or moving to pnpm.

## Rules

- Parameterised queries or a query builder, never template strings into SQL.
- No `eval`, `new Function` or `child_process.exec` with input in it; `execFile` with an argument list.
- Validate input at the edge, against a schema (zod or similar), before it reaches the code.
- Configuration from environment variables, read in one place; no secrets committed, and none in the front-end bundle.

## Gotchas

- `pnpm dlx` and `npx` fetch the newest version of a tool, outside the lockfile and the hold. Put tools in `devDependencies` and run them through `pnpm`.
- Corepack picks pnpm's version from `packageManager` in `package.json`. Set it, so CI, the agent and every laptop use the same pnpm.
- `allowBuilds` needs pnpm 10.26 or later. Older pnpm ignores it without an error (10.12 just warns that it skipped the scripts), so on an older pnpm the list looks set and does nothing. Raise `packageManager` first.
