---
name: setup
description: Set up a QA team's Playwright repo for ways-qa in one short run - environments and URLs, the QA standards, domain rules, Playwright's agents, CI, a PR template, CLAUDE.md, CODEOWNERS and labels - ending in a PR. For a QA repo instead of /ways:setup, which is for app repos. Re-run it to pick up a newer version.
disable-model-invocation: true
---

# Set up a QA repo

Turn a Playwright repo into one triage and reproduce can work in straight away, in one short run: look, ask a few questions in one go, write everything on a branch, show the suite green, and open a PR. Aim for under five minutes of the person's time.

This is the QA team's setup. Don't run or suggest `/ways:setup`: that one is for repos holding an app's code, and its questions (architecture, code layers, the stack) don't apply here. Don't ask about the app's internals at all.

## 1. Look, without asking

- **Version.** The plugin's is the `version` in `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json`; the repo's is in `.claude/ways-qa.json`. If they match, say the repo is current and stop, unless the person asked for something specific. If the repo has an older one, this run brings it up to date: add what's new, and leave what the team has changed. Some versions also move something; see "Updating from an older version" at the end.
- **GitHub.** `git remote -v` points at GitHub, and `gh repo view` works. `gh label list --limit 200` for the labels already there.
- **What's here:** `CLAUDE.md`, `README.md`, `package.json` (is `@playwright/test` in it?), `playwright.config.*`, `tests/`, `specs/` (anything in it, such as acceptance notes or planner plans), `charters/`, `.claude/agents/playwright-test-*.md`, `.github/workflows/`, `.github/CODEOWNERS`, `.github/pull_request_template.md`, `.gitignore`, `docs/standards/qa.md` (and whether it still has a `## Domain rules` section with rules in it), `specs/domain-rules.md`, `environments.json`.

## 2. Ask, once

One message with the questions below. Fill in what you could already tell from the repo, so the person only confirms it. Don't ask anything else. The confidence threshold defaults to high, so don't ask about it.

1. **The apps and their URLs in each environment.** For example: "recipes: live https://…, beta https://…". Then which environment a run on a laptop uses, which one CI uses (suggest the one that isn't production), and any environment testers mustn't use.
2. **Routing:** the areas of the app and the team each goes to, one line each, and whether that team takes work from an agent. "Not sure yet" is fine: routing then stays a recommendation for the triage owner.
3. **The triage owner:** a GitHub handle or team. They get calls below the threshold, and are the code owner for the standards and CI.
4. **Domain rules:** facts about the app that decide what's correct or how bad a bug is. They go in `specs/domain-rules.md`. If `specs/` has anything in it, offer to draft them from it for the person to confirm. If not, ask for any rules that decide severity ("a wrong total on an invoice is always critical"), or say they can add them later.

Then say, in a few lines, what you'll add, what you'll move ("Updating from an older version", at the end) and what you'll leave alone (step 3's list, against what's here), and that you'll create the missing labels now. Wait for a yes, which can come with the answers.

## 3. Write it, on a branch

Work on `chore/ways-qa-setup-<version>` from an up-to-date default branch. If that branch already exists, an earlier run was cut short: carry on from it. Templates are in `${CLAUDE_PLUGIN_ROOT}/templates/`. Never overwrite something the team wrote: merge into it, or leave it and say so in the report.

1. **Check the URLs** with a quick request each (`curl -s -o /dev/null -w "%{http_code}"`, or the Playwright MCP). A redirect to a sign-in page is fine. A URL that doesn't answer goes in the report, not into a question.
2. **`environments.json`** from the answers: `default`, `ci`, and `environments`, each environment mapping an app's name (lowercase, no spaces) to its URL.
3. **`playwright.config.ts`.** If it's the stock one (no `baseURL`, no projects of its own beyond a browser), replace it with the template. If the team has added to it (a setup or sign-in project, a reporter, timeouts), keep theirs and add the template's parts: reading `environments.json`, choosing by `QA_ENV`, one project per app with its `baseURL`, `trace: 'retain-on-failure'`, and the HTML reporter. Then run `npx playwright test --list`, and try `QA_ENV=<each environment>` once, so the config is known to load.
4. **App folders.** With more than one app, make `tests/<app>/` for each. Leave existing tests where they are: tests directly in `tests/` run once, with no `baseURL`.
5. **Playwright's agents.** If `.claude/agents/playwright-test-planner.md` (or the generator or healer) is missing, run `npx playwright init-agents --loop=claude`. It writes the agents, `.mcp.json`, `specs/README.md` and one empty seed test, in the first app's folder. The planner and generator start every session from a seed, so give **each app** a `seed.spec.ts` in `tests/<app>/` that opens it: `await page.goto('/')`, then `await expect(page).toHaveURL(/.+/)` or a heading you saw when you checked the URL. That also makes the gate notice an app that's down. Remove any `.gitkeep` a seed replaces. If the team uses both Windows and Mac, say in the report that the generated `.mcp.json` runs `npx` through `cmd /c`, which only works on Windows.
6. **Folders:** `specs/` (the agents make it; otherwise create it with the planner's README), `charters/` with the template's `README.md`, and `evidence/` in `.gitignore`.
7. **`docs/standards/qa.md`** from the template, filled in from the answers: which environments are allowed, the routing table (with "takes agent work"), the triage owner. Leave the severity rubric, threshold and labels as the template has them. An existing `qa.md` stays: add only the sections it lacks, by heading. URLs never go in `qa.md`: they're only in `environments.json`.
8. **`specs/domain-rules.md`** from the template, with the rules from the answers. Rules drafted from `specs/` are marked `<!-- draft: confirm -->` each, with the file they came from. An existing `domain-rules.md` stays: add only rules it doesn't have.
9. **`CLAUDE.md`.** Missing: copy the template. Present: keep every section that's there, and add the template's sections it lacks, by heading. A section the team wrote is never rewritten, even if the template says something similar: list the overlap in the report.
10. **`.github/CODEOWNERS`:** add the template's lines that are missing, with the triage owner in place of `@owner`. Replace an `@owner` placeholder already in the file the same way.
11. **CI:** if no workflow under `.github/workflows/` runs `playwright test`, copy the template's `playwright.yml`. It runs the suite on every PR, on pushes to the default branch, and nightly, and keeps the HTML report and failure traces as artifacts.
12. **`.github/pull_request_template.md`:** if missing, copy the template. Its "How to check" is written for a reviewer who has never coded: the agent runs the technical checks and pastes the results, and the reviewer checks the judgement calls. If the team has its own, keep it and say in the report that `/ways-qa:reproduce` fills in the template's checks, so they may want to add them.
13. **`.claude/settings.json`:** add the template's marketplaces, enabled plugins and `.env` deny rules to what's there, so anyone opening the repo is offered the same plugins. Claude Code asks the person before any write under `.claude/` (this, the stamp in step 15, the agents): say so before the first one, so the prompt isn't a surprise. If a write is refused, list the file and its contents in the report for the person to add.
14. **Labels,** straight away rather than in the PR: create every label `qa.md` names that the tracker lacks (the Labels table, the severity rows, the routing rows), with its meaning as the description, cut to GitHub's limit of 100 characters.
15. **Stamp** `.claude/ways-qa.json` with `{ "version": "<plugin version>" }`.

## 4. Show the gate green, and open the PR

1. `npm install` if `node_modules` is missing, then `npx playwright test`. It should pass. A test that fails against the real app isn't setup's to fix: say which, and that it's the first thing to triage. Don't mark it, skip it, or change it.
2. Commit, push, and open a PR, using the PR template's headings. Its body: what was added, what was merged into what was there, what was left alone, and the run of `npx playwright test` (the command and its last lines).
3. **Report** to the person, short:
   - the PR link;
   - what's left for people: the domain rules in `specs/domain-rules.md` marked for confirming, severity examples, the sections still marked `fill in`, test accounts;
   - **one other tester approving each PR** needs a branch rule on the default branch (Settings → Branches, or Rulesets: require a pull request with one approval and code-owner review). GitHub only enforces that on a paid plan for a private repo; without it, it holds by agreement. Say which applies if `gh api repos/<owner>/<repo>` shows it;
   - what to run next: `npx playwright test` to see it green, the planner on one area, or `/ways-qa:triage` on what's open.

## Updating from an older version

Do these as part of step 3, on the same branch, and list each in the PR and the report.

**From 0.2.0 or earlier: domain rules move out of `docs/standards/`.** `docs/standards/` is how the team works; the domain rules are facts about the app, so they now live in `specs/domain-rules.md`, beside the specs they come from.

- If `docs/standards/qa.md` has a `## Domain rules` section with rules in it (anything beyond the template's empty bullet and comment), move the rules, word for word, into `specs/domain-rules.md` under the template's introduction, and replace the section's body in `qa.md` with the template's pointer. If `specs/domain-rules.md` already exists, add only the rules it lacks. A rule that is really about how the team works (who decides, which label) stays in `qa.md`: say which you left and why.
- A URL written in `qa.md` that's also in `environments.json` comes out of `qa.md`. One that isn't in `environments.json` stays, and goes in the report as a question.
- In `CLAUDE.md`, if the map's `docs/standards/qa.md` row still has the template's old wording ("domain rules, severity, …"), replace it with the new row and add the `specs/domain-rules.md` row. If the team reworded it, leave it and say so.
- `CODEOWNERS` gets the `/specs/domain-rules.md` line (step 10), so a change to a rule still needs a code owner.

Until a suite is updated, triage and reproduce still read the rules from `qa.md` if `specs/domain-rules.md` is missing, and suggest this run.
