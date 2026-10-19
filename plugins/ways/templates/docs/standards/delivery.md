# Delivery

- **Short-lived branches from `main`, one PR each, squash-merged.** Integration branches for a multi-ticket spec are the exception: their PR keeps its slice commits.
- **`main` is protected:** a PR, the gate check, `CODEOWNERS` review, and the approvals the repo's merge dial sets. Where the GitHub plan can't enforce that, it holds by agreement.
- **The gate is one command**, recorded in `.claude/ways.json`: the same locally, in CI, and in the agent's Stop hook. Format, lint, static analysis, dependency audit, tests.
  - **One command that runs as it is in PowerShell and bash**: no `&&`, no shell-specific syntax. Anything more goes in a script the command calls.
  - **It runs on its own fresh state, never the running app's.** The tests build a throwaway database from the schema files on every run, under a name of their own, and drop it at the end. So the gate gives the same answer whatever someone has clicked in the browser, after any schema change, and when two gates run at once. Sharing the app's database makes a laptop disagree with CI with nothing wrong in the code.
- **Local development runs in containers** where the stack allows, so a new starter, CI and the agent all have the same environment.

## Environments and deploys

<!-- confirm: this team's environments and hosting -->

| Environment | What | Deployed |
|---|---|---|
| Local | Containers on the developer's machine | By the developer |
| Test | Shared, synthetic data | From `main`, by the pipeline |
| Production | | From `main`, by the pipeline, with approval |

- **Deploys come from `main`, by pipeline, never by hand.** Infrastructure is code (Bicep, Terraform).
- **Every deploy can be rolled back** to the previous version (a slot swap or the previous image), and the PR's merge-danger section says how.
- **Database migrations go forward only, and stay compatible with the previous release** (expand, then contract), so a rollback doesn't need a down-migration.
