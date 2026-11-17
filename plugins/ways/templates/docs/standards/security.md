# Security

## Rules

- **No secrets in the repo, ever.** They come from the environment or a secret store. A pushed secret is leaked even if the commit is deleted: rotate it.
- **No production or customer data in dev, test or prompts.** Test data is synthetic. Customer data goes only into tools the org has approved.
- **Parameterised queries only**, never string-built SQL. Output is encoded for where it's going (HTML, JSON, SQL).
- **Every endpoint authenticates**, and authorises against what's being touched, not just who's logged in.
- **Data where an error causes harm** (safety, health, money) makes the code that computes or shows it high risk. `REVIEW.md` names it and a code owner reviews it.
- **New releases wait 14 days** before this repo takes them (below).

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

## Checks, by stage

| Stage | Check | Tool | Notes |
|---|---|---|---|
| While the agent works | Can't read `.env` or secret files; high-risk changes get `/security-review` | Claude Code settings; the risk tier in `REVIEW.md` | |
| Commit | Secret scan | gitleaks, as a pre-commit hook | Convenience: can be skipped |
| Push | Secret push protection | GitHub | Blocks the push |
| Install, any time | No version younger than 14 days | uv `exclude-newer`; pnpm `minimumReleaseAge` | The 14-day hold, above |
| PR | Dependency audit | `composer audit`; NuGet audit | In the gate |
| PR | Code scanning | **CodeQL** for C# and JavaScript. **CodeQL doesn't support PHP**: Psalm `--taint-analysis` or Semgrep | Required check; new high findings block |
| PR | Secret scan | gitleaks in CI | Catches what pre-commit missed |
| Daily | Vulnerable dependencies | **Dependabot** alerts and security updates (uv, npm/pnpm, Composer, NuGet, Actions) | Updates arrive as PRs and go through the gate |
| Monthly | Routine upgrades | **Dependabot** version updates, `cooldown` 14 days | `.github/dependabot.yml`, from the ways template |

**Cost:** Dependabot is free. On private repos, code scanning and push protection need GitHub's paid add-ons (Code Security, Secret Protection), priced per active committer. Check the price before committing to them. Semgrep and gitleaks in CI are the free fallback.

## AI-specific

- An agent never approves its own high-risk change: `CODEOWNERS` makes a person do it.
- Plugins, MCP servers and mods come from a marketplace the team trusts. On a Teams or Enterprise plan, managed settings say which run.
