# Security

## Rules

- **No secrets in the repo, ever.** They come from the environment or a secret store. A pushed secret is leaked even if the commit is deleted: rotate it.
- **No production or customer data in dev, test or prompts.** Test data is synthetic. Customer data goes only into tools the org has approved.
- **Parameterised queries only**, never string-built SQL. Output is encoded for where it's going (HTML, JSON, SQL).
- **Every endpoint authenticates**, and authorises against what's being touched, not just who's logged in.
- **Data where an error causes harm** (safety, health, money) makes the code that computes or shows it high risk. `REVIEW.md` names it and a code owner reviews it.

## Checks, by stage

| Stage | Check | Tool | Notes |
|---|---|---|---|
| While the agent works | Can't read `.env` or secret files; high-risk changes get `/security-review` | Claude Code settings; the risk tier in `REVIEW.md` | |
| Commit | Secret scan | gitleaks, as a pre-commit hook | Convenience: can be skipped |
| Push | Secret push protection | GitHub | Blocks the push |
| PR | Dependency audit | `composer audit`; NuGet audit | In the gate |
| PR | Code scanning | **CodeQL** for C# and JavaScript. **CodeQL doesn't support PHP**: Psalm `--taint-analysis` or Semgrep | Required check; new high findings block |
| PR | Secret scan | gitleaks in CI | Catches what pre-commit missed |
| Daily | Vulnerable dependencies | **Dependabot** alerts and security updates (Composer, NuGet, Actions) | Updates arrive as PRs and go through the gate |

**Cost:** Dependabot is free. On private repos, code scanning and push protection need GitHub's paid add-ons (Code Security, Secret Protection), priced per active committer. Check the price before committing to them. Semgrep and gitleaks in CI are the free fallback.

## AI-specific

- An agent never approves its own high-risk change: `CODEOWNERS` makes a person do it.
- Plugins, MCP servers and mods come from a marketplace the team trusts. On a Teams or Enterprise plan, managed settings say which run.
