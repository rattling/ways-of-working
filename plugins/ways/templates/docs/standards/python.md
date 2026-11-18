# Python stack

**Today:** <!-- Python version, framework if any, database, where it runs -->
**Moving to:** <!-- e.g. a supported Python 3.x, uv for everything, type checking on new code. Framework changes only by ADR. -->

A Python version past the end of security support ([devguide.python.org/versions](https://devguide.python.org/versions/)) makes the upgrade a security item, not polish.

| Concern | Tool | In the gate as |
|---|---|---|
| Environment and packages | uv, with `uv.lock` committed | `uv sync --locked` |
| Formatting and lint | Ruff | `uv run ruff format --check` and `uv run ruff check` |
| Types | A type checker per repo (mypy or pyright), strict on new modules, the strict list only growing | `uv run mypy` / `uv run pyright` |
| Tests | pytest | `uv run pytest` |
| Dependencies | `pip-audit` on the locked set; Dependabot for uv | Below |
| Security analysis | CodeQL for Python (`codeql.yml`) | A code scanning rule on `main` |

## Supply chain

`security.md` has the rules. In a Python repo they are:

```toml
# pyproject.toml (the workspace root)
[tool.uv]
exclude-newer = "14 days"   # the 14-day hold
no-build = true             # wheels only: building a source distribution runs its code
```

- **Frozen installs:** `uv sync --locked` in the gate and CI. It fails if `uv.lock` doesn't match `pyproject.toml`, so nobody changes one without the other.
- **Wheels only.** With `no-build`, a package that ships only a source distribution fails the install, saying so. The repo's own packages still build. uv has no way to allow one package past `no-build` (`no-build-package` does the opposite: it adds packages to the list), so when a dependency has no wheel for a platform the repo runs on, in order:
  1. use a version or an alternative package that has wheels;
  2. otherwise set `no-build = false`, with a comment naming the package that needs it, why, and the end condition. The lockfile's hashes and the 14-day hold still apply; only the build-time check is gone, so the next routine update tries turning it back on.
- **The audit**, in the gate, against exactly what's locked:

  ```bash
  uv export --frozen --no-emit-project --format requirements-txt -o "$tmp/requirements.txt"
  uvx pip-audit@2.10.1 -r "$tmp/requirements.txt" --disable-pip --require-hashes --strict
  ```

  Pin `pip-audit`'s version: `uvx` otherwise fetches the newest, which the project's 14-day hold doesn't cover. Dependabot doesn't update it, so bump it at the routine upgrade. `pip-audit` has no severity filter, so it fails on any known vulnerability, not only high ones.
- **Exceptions** are `--ignore-vuln <ID>` flags in the gate script, each on its own line with a comment above: the package, why it doesn't apply or can't be fixed yet, and when it comes out.

## Rules

- Parameterised queries, through the driver or an ORM, never f-strings or `%` into SQL.
- No `pickle`, `yaml.load` (use `safe_load`), `eval` or `exec` on anything that came from outside the process.
- `subprocess` with a list of arguments, never `shell=True` with input in it.
- Configuration from environment variables, read in one place; no secrets committed.

## Gotchas

- Adding or changing `exclude-newer` needs a `uv lock`: uv stores the hold in `uv.lock`, and `uv sync --locked` fails until it's there. Commit the lockfile with the setting. (`no-build` isn't stored, so it needs nothing.)
- `uv run` syncs before running. In the gate, run `uv sync --locked` first so a stale lockfile fails there and not as a confusing import error later.
- `uvx` runs tools outside the project, so `[tool.uv]` settings (the hold, `no-build`) don't reach it. Pin tool versions, or set the hold in `~/.config/uv/uv.toml` as well.
