---
name: setup
description: Set up a QA team's Playwright repo for ways-qa in one short run - environments and URLs, the QA standards, Playwright's agents, CI, CLAUDE.md, CODEOWNERS and labels - ending in a PR. For a QA repo instead of /ways:setup, which is for app repos. Re-run it to pick up a newer version.
disable-model-invocation: true
---

# Set up a QA repo

Turn a Playwright repo into one triage and reproduce can work in straight away, in one short run: look, ask a few questions in one go, write everything on a branch, show the suite green, and open a PR. Aim for under five minutes of the person's time.

This is the QA team's setup. Don't run or suggest `/ways:setup`: that one is for repos holding an app's code, and its questions (architecture, code layers, the stack) don't apply here. Don't ask about the app's internals at all.

## 1. Look, without asking

- **Version.** The plugin's is the `version` in `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json`; the repo's is in `.claude/ways-qa.json`. If they match, say the repo is current and stop, unless the person asked for something specific. If the repo has an older one, this run brings it up to date: add what's new, and leave what the team has changed.
- **GitHub.** `git remote -v` points at GitHub, and `gh repo view` works. `gh label list --limit 200` for the labels already there.
- **What's here:** `CLAUDE.md`, `README.md`, `package.json` (is `@playwright/test` in it?), `playwright.config.*`, `tests/`, `specs/` (anything in it, such as acceptance notes or planner plans), `charters/`, `.claude/agents/playwright-test-*.md`, `.github/workflows/`, `.github/CODEOWNERS`, `.gitignore`, `docs/standards/qa.md`, `environments.json`.

## 2. Ask, once

One message with the questions below. Fill in what you could already tell from the repo, so the person only confirms it. Don't ask anything else. The confidence threshold defaults to high, so don't ask about it.

1. **The apps and their URLs in each environment.** For example: "recipes: live https://…, beta https://…". Then which environment a run on a laptop uses, which one CI uses (suggest the one that isn't production), and any environment testers mustn't use.
2. **Routing:** the areas of the app and the team each goes to, one line each, and whether that team takes work from an agent. "Not sure yet" is fine: routing then stays a recommendation for the triage owner.
3. **The triage owner:** a GitHub handle or team. They get calls below the threshold, and are the code owner for the standards and CI.
4. **Domain rules.** If `specs/` has anything in it, offer to draft the domain rules from it for them to confirm. If not, ask for any rules that decide severity ("a wrong allergen is always critical"), or say they can add them later.

Then say, in a few lines, what you'll add and what you'll leave alone (step 3's list, against what's here), and that you'll create the missing labels now. Wait for a yes, which can come with the answers.

## 3. Write it, on a branch

Work on `chore/ways-qa-setup-<version>` from an up-to-date default branch. If that branch already exists, an earlier run was cut short: carry on from it. Templates are in `${CLAUDE_PLUGIN_ROOT}/templates/`. Never overwrite something the team wrote: merge into it, or leave it and say so in the report.

1. **Check the URLs** with a quick request each (`curl -s -o /dev/null -w "%{http_code}"`, or the Playwright MCP). A redirect to a sign-in page is fine. A URL that doesn't answer goes in the report, not into a question.
2. **`environments.json`** from the answers: `default`, `ci`, and `environments`, each environment mapping an app's name (lowercase, no spaces) to its URL.
3. **`playwright.config.ts`.** If it's the stock one (no `baseURL`, no projects of its own beyond a browser), replace it with the template. If the team has added to it (a setup or sign-in project, a reporter, timeouts), keep theirs and add the template's parts: reading `environments.json`, choosing by `QA_ENV`, one project per app with its `baseURL`, `trace: 'retain-on-failure'`, and the HTML reporter. Then run `npx playwright test --list`, and try `QA_ENV=<each environment>` once, so the config is known to load.
4. **App folders.** With more than one app, make `tests/<app>/` for each. Leave existing tests where they are: tests directly in `tests/` run once, with no `baseURL`.
5. **Playwright's agents.** If `.claude/agents/playwright-test-planner.md` (or the generator or healer) is missing, run `npx playwright init-agents --loop=claude`. It writes the agents, `.mcp.json`, `specs/README.md` and a seed test. If the team uses both Windows and Mac, say in the report that the generated `.mcp.json` runs `npx` through `cmd /c`, which only works on Windows.
6. **Folders:** `specs/` (the agents make it; otherwise create it with the planner's README), `charters/` with the template's `README.md`, and `evidence/` in `.gitignore`.
7. **`docs/standards/qa.md`** from the template, filled in from the answers: which environments are allowed, the routing table (with "takes agent work"), the triage owner. Leave the severity rubric, threshold and labels as the template has them. Domain rules drafted from `specs/` are marked `<!-- draft: confirm -->` each, with the file they came from. An existing `qa.md` stays: add only the sections it lacks, by heading.
8. **`CLAUDE.md`.** Missing: copy the template. Present: keep every section that's there, and add the template's sections it lacks, by heading. A section the team wrote is never rewritten, even if the template says something similar: list the overlap in the report.
9. **`.github/CODEOWNERS`:** add the template's lines that are missing, with the triage owner in place of `@owner`. Replace an `@owner` placeholder already in the file the same way.
10. **CI:** if no workflow under `.github/workflows/` runs `playwright test`, copy the template's `playwright.yml`. It runs the suite on every PR, on pushes to the default branch, and nightly, and keeps the HTML report and failure traces as artifacts.
11. **`.claude/settings.json`:** add the template's marketplaces, enabled plugins and `.env` deny rules to what's there, so anyone opening the repo is offered the same plugins.
12. **Labels,** straight away rather than in the PR: create every label `qa.md` names that the tracker lacks (the Labels table, the severity rows, the routing rows), with its meaning as the description.
13. **Stamp** `.claude/ways-qa.json` with `{ "version": "<plugin version>" }`.

## 4. Show the gate green, and open the PR

1. `npm install` if `node_modules` is missing, then `npx playwright test`. It should pass. A test that fails against the real app isn't setup's to fix: say which, and that it's the first thing to triage. Don't mark it, skip it, or change it.
2. Commit, push, and open a PR. Its body: what was added, what was merged into what was there, what was left alone, and the run of `npx playwright test` (the command and its last lines).
3. **Report** to the person, short:
   - the PR link;
   - what's left for people: the domain rules marked for confirming, severity examples, the sections still marked `fill in`, test accounts;
   - **one other tester approving each PR** needs a branch rule on the default branch (Settings → Branches, or Rulesets: require a pull request with one approval and code-owner review). GitHub only enforces that on a paid plan for a private repo; without it, it holds by agreement. Say which applies if `gh api repos/<owner>/<repo>` shows it;
   - what to run next: `npx playwright test` to see it green, the planner on one area, or `/ways-qa:triage` on what's open.
