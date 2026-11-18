# Security

## Rules

- **No secrets in the repo, ever.** They come from the environment or a secret store. A pushed secret is leaked even if the commit is deleted: rotate it.
- **No production or customer data in dev, test or prompts.** Test data is synthetic. Customer data goes only into tools the org has approved.
- **Parameterised queries only**, never string-built SQL. Output is encoded for where it's going (HTML, JSON, SQL).
- **Every endpoint authenticates**, and authorises against what's being touched, not just who's logged in.
- **Data where an error causes harm** (safety, health, money) makes the code that computes or shows it high risk. `REVIEW.md` names it and a code owner reviews it.
- **New releases wait 14 days** before this repo takes them (below).
- **Dependencies come in locked, audited and without running their code at install** (the supply chain, below).

## The 14-day hold

Supply-chain attacks (a hijacked maintainer account, a malicious version) are usually caught and pulled within days. So no dependency version younger than 14 days gets in, whoever adds it: Dependabot, a person or an agent. Dependabot's `cooldown` only covers Dependabot's own PRs, so the hold is set in the package tool as well:

| Tool | Setting | Where |
|---|---|---|
| Dependabot | `cooldown: default-days: 14` on every entry | `.github/dependabot.yml` |
| uv | `exclude-newer = "14 days"` under `[tool.uv]` | `pyproject.toml` (the workspace root) |
| pnpm | `minimumReleaseAge: 20160` (minutes) | `pnpm-workspace.yaml` |
| npm | None: npm only takes a fixed `before=` date | Node repos use pnpm. A repo still on npm says so in `CODING_STANDARDS.md` and relies on Dependabot alone until it moves |

**An urgent fix is the exception.** A security patch is often newer than 14 days. Take that one package past the hold and leave it on for everything else: in uv, `exclude-newer-package = { <package> = "<date after the fix>" }` under `[tool.uv]`; in pnpm, the package in `minimumReleaseAgeExclude`. The PR names the package and the advisory, and the exception comes out at the next routine update. Dependabot's security updates already ignore `cooldown`.

**On a dev machine** the same hold works as a backstop for scratch projects: `exclude-newer = "14 days"` in `~/.config/uv/uv.toml`, and `minimumReleaseAge` in pnpm's global config.

## The supply chain

Agents add and upgrade packages all day, so what a dependency can do on the way in matters as much as the code that uses it. Each rule says what checks it. The exact settings for each stack are in its stack file (`python.md`, `node.md`, `php.md`, `dotnet.md`).

- **Fewer dependencies is a goal in itself.** Before adding a package, check whether the standard library or something already in the repo does the job. Whoever adds a direct dependency, person or agent, names it in the PR body with the reason: "Dependencies added: x, because y". *Checked by:* review, against the lockfile diff.
- **Lockfiles are committed and installs are frozen.** CI and the gate install exactly what the lockfile says and fail if it's out of date with the manifest: `uv sync --locked`, `pnpm install --frozen-lockfile`, `npm ci`, `composer install` (never `update`), `dotnet restore --locked-mode`. So a dependency change always shows in the PR as a lockfile change. *Checked by:* the gate.
- **No install-time code by default.** Installing a package shouldn't run it. pnpm runs a dependency's build scripts only if it's on the `allowBuilds` list, and fails the install on any it hasn't been told about. uv's `no-build` refuses source distributions, because building one runs its `setup.py` or build backend; wheels don't run anything at install. *Checked by:* the package tool, on every install.
- **The gate audits dependencies.** `pnpm audit --audit-level high`, `pip-audit` (through `uvx`), `composer audit`, NuGet audit. *Checked by:* the gate; Dependabot alerts between PRs.
- **Every exception is named, with a reason and an end condition.** An ignored advisory, an allowed build script or a package past the 14-day hold sits next to a comment: the package, why, and when it comes out ("until 3.2 ships with the fix", "until we drop the PDF export"). An exception with no end condition is a decision and gets an ADR. *Checked by:* review; the exception lists are short enough to read at each routine update.
- **Dependabot on everywhere:** alerts and security updates on (repo settings, which `/ways:setup` checks), version updates monthly with the 14-day `cooldown`, one entry per ecosystem including `github-actions`. Its PRs go through the gate and a person merges them: no auto-merge. *Checked by:* setup; branch protection.
- **GitHub Actions can't run strangers' code with the repo's token.** Actions are pinned to a full commit SHA with the version in a comment (`uses: actions/checkout@<sha> # v4.2.2`), so a moved tag can't change what runs; Dependabot's `github-actions` entry keeps the SHAs current. Every workflow sets a minimal top-level `permissions:` and widens it per job only where needed. No `pull_request_target` workflow checks out the PR's code: it runs with the base repo's secrets. *Checked by:* `/ways:setup`, which lists any workflow that breaks these; review of `.github/workflows/`.

## Checks, by stage

| Stage | Check | Tool | Notes |
|---|---|---|---|
| While the agent works | Can't read `.env` or secret files; high-risk changes get `/security-review` | Claude Code settings; the risk tier in `REVIEW.md` | |
| Commit | Secret scan | gitleaks, as a pre-commit hook | Convenience: can be skipped |
| Push | Secret push protection | GitHub | Blocks the push |
| Install, any time | No version younger than 14 days | uv `exclude-newer`; pnpm `minimumReleaseAge` | The 14-day hold, above |
| Install, any time | No dependency code runs at install | pnpm `allowBuilds`; uv `no-build` | Exceptions named in the config |
| PR | Installs match the lockfile | `uv sync --locked`; `pnpm install --frozen-lockfile`; `npm ci` | In the gate |
| PR | Dependency audit | `pnpm audit --audit-level high`; `pip-audit`; `composer audit`; NuGet audit | In the gate |
| PR | New dependencies named, with a reason | Review, against the lockfile diff | "Dependencies added" in the PR body |
| PR | Actions pinned to SHAs, minimal `permissions:`, no `pull_request_target` checkout | `/ways:setup` lists breaches; review | |
| PR | Code scanning | **CodeQL** for Python, JavaScript/TypeScript and C#. **CodeQL doesn't support PHP**: Psalm `--taint-analysis` or Semgrep | Required check; new high findings block |
| PR | Secret scan | gitleaks in CI | Catches what pre-commit missed |
| Daily | Vulnerable dependencies | **Dependabot** alerts and security updates (uv, npm/pnpm, Composer, NuGet, Actions) | Updates arrive as PRs and go through the gate |
| Monthly | Routine upgrades | **Dependabot** version updates, `cooldown` 14 days | `.github/dependabot.yml`, from the ways template |

**Cost:** Dependabot is free. On private repos, code scanning and push protection need GitHub's paid add-ons (Code Security, Secret Protection), priced per active committer. Check the price before committing to them. Semgrep and gitleaks in CI are the free fallback.

## AI-specific

- An agent never approves its own high-risk change: `CODEOWNERS` makes a person do it.
- Plugins, MCP servers and mods come from a marketplace the team trusts. On a Teams or Enterprise plan, managed settings say which run.
