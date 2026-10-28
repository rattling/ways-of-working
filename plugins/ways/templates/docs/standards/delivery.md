# Delivery

- **Short-lived branches from `main`, one PR each, squash-merged.** Integration branches for a multi-ticket spec are the exception: their PR keeps its slice commits.
- **`main` is protected:** a PR, the gate check, `CODEOWNERS` review, and the approvals the repo's merge dial sets. Where the GitHub plan can't enforce that, it holds by agreement.
- **The gate is one command**, recorded in `.claude/ways.json`: the same locally, in CI, and in the agent's Stop hook. Format, lint, static analysis, dependency audit, tests.
  - **One command that runs as it is in PowerShell and bash**: no `&&`, no shell-specific syntax. Anything more goes in a script the command calls.
  - **Its programs exist on every machine the team uses.** Passing the syntax rule isn't enough: `make check` has no `&&` and still fails on Windows, which doesn't ship `make`. Prefer a runner the repo already depends on (an npm or Composer script, `dotnet test`, `uv run`) that doesn't itself call `bash`.
  - **A bash script goes through git, not bare `bash`:** `git -c alias.gate='!bash scripts/check.sh' gate`. On Windows, `bash` typed in PowerShell or cmd (or called from an npm script) is often WSL's launcher, not Git's: with no Linux distribution it fails at once (`execvpe(/bin/bash) failed`), and with one it runs the gate in a different system. Git runs an alias in its own shell, so the same command finds Git's bash in PowerShell, Git Bash, Claude Code's hooks and CI. Hooks and CI never show the problem, so test the command in PowerShell once.
  - **It runs on its own fresh state, never the running app's.** The tests build a throwaway database from the schema files on every run, under a name of their own, and drop it at the end. So the gate gives the same answer whatever someone has clicked in the browser, after any schema change, and when two gates run at once. Sharing the app's database makes a laptop disagree with CI with nothing wrong in the code.
- **The docs move with the code.** A PR that changes how the system runs, its parts, a contract or a term updates what the repo says about itself in the same PR: `docs/ARCHITECTURE.md`, the README's setup and run instructions, `GLOSSARY.md`, the stack lines in these standards. A hard-to-reverse decision gets an ADR. Docs that describe a system that no longer exists are worse than none: the next agent reads them first.
- **CI is sized on purpose.** Each Actions job bills rounded up to the whole minute, and private repos on the free plan get 2,000 a month, so a workflow that runs on every PR into every branch can use them up in a fortnight of `/ways:build`. The seeded `gate.yml` runs on PRs into `main` (not drafts, cancelling superseded runs, passing documentation-only PRs at once) and on every push to `main`. Add jobs to it with that in mind.
- **Local development runs in containers** where the stack allows, so a new starter, CI and the agent all have the same environment.
- **A dev seed from early on, grown with every feature:** realistic demo data that lets a person try every user story by hand, with the awkward rows (the longest name, the empty list, the missing value, the one with fifty children). People judge screens, mocks and style choices far better against data that looks real, and builders can screenshot the same thing every time. Its rules:
  - **One command loads it, and the same command resets it,** so everyone starts from the same state.
  - **Made-up data only,** never a copy of production, and nothing personal.
  - **Separate from test fixtures.** Tests build their own data for each run; the seed is for people, demos and screenshots, and no test depends on it.
  - **Local and test environments only.** It never runs against production.
  - **A test account for each role**, with a made-up password, and `AGENTS.md` says how an agent signs in locally as each, so screenshots behind sign-in need no improvising.
  - **Records worth naming have stable names** ("Harbour Lettings: three engagements, one overdue"), so a ticket can say which one to open.
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
