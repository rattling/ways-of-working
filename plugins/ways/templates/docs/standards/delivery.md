# Delivery

- **Short-lived branches from `main`, one PR each, squash-merged.** Integration branches for a multi-ticket spec are the exception: their PR keeps its slice commits.
- **`main` is protected:** a PR, the gate check, `CODEOWNERS` review, and the approvals the repo's merge dial sets. Where the GitHub plan can't enforce that, it holds by agreement.
- **The gate is one command**, recorded in `.claude/ways.json`: the same locally, in CI, and in the agent's Stop hook. Format, lint, static analysis, dependency audit, tests.
  - **One command that runs as it is in PowerShell and bash**: no `&&`, no shell-specific syntax. Anything more goes in a script the command calls.
  - **It runs on its own fresh state, never the running app's.** The tests build a throwaway database from the schema files on every run, under a name of their own, and drop it at the end. So the gate gives the same answer whatever someone has clicked in the browser, after any schema change, and when two gates run at once. Sharing the app's database makes a laptop disagree with CI with nothing wrong in the code.
- **Local development runs in containers** where the stack allows, so a new starter, CI and the agent all have the same environment.
- **A dev seed from early on:** realistic demo data, loaded with one command, with the awkward rows (the longest name, the empty list, the missing value). People judge screens, mocks and style choices far better against data that looks real, and builders can screenshot the same thing every time.
- **Every worktree runs its own containers.** Agents build in worktrees (`.claude/worktrees/`), beside the main checkout, so the stack has to run more than once on one machine:
  - **No fixed project name.** Leave `name:` out of `docker-compose.yml` (and don't pass a fixed `-p`), so each worktree gets its own Compose project, named after its folder. A shared project lets one worktree's gate rebuild the database under another, or under the app someone is looking at.
  - **Published ports come from a variable with a default**, like `"${APP_PORT:-8080}:80"`. The main checkout keeps the default; a builder that needs the app in a browser runs on another port (`APP_PORT=8081`), so it never fights the main checkout for 8080. Agents pass these as environment variables on the command, not through `.env` files, which they can't read.
  - **The gate needs no host port.** It reaches the app and the database inside the Compose network, so two gates can run at once.
  - **Whatever starts containers stops them** before reporting done (`docker compose down -v` for a throwaway stack), and `docker ps` shows none of that worktree's left. A container left running holds memory and its port, and blocks the next run.

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
