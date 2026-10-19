# Delivery

- **Short-lived branches from `main`, one PR each, squash-merged.** Integration branches for a multi-ticket spec are the exception: their PR keeps its slice commits.
- **`main` is protected:** a PR, the gate check, `CODEOWNERS` review, and the approvals the repo's merge dial sets. Where the GitHub plan can't enforce that, it holds by agreement.
- **The gate is one command**, recorded in `.claude/ways.json`: the same locally, in CI, and in the agent's Stop hook. Format, lint, static analysis, dependency audit, tests.
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
