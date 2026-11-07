# ways-qa

Skills for a QA team that tests a running app through Playwright and doesn't have the app's code. It installs `ways` (and so Matt Pocock's skills) and the Playwright plugin with it, so a tester installs one thing.

| Command | Use it when | You end up with |
|---|---|---|
| `/ways-qa:setup` | A QA repo is new, or the plugin has been updated | One PR: the environments and their URLs, the QA standards, the domain rules, Playwright's planner, generator and healer, CI on every PR and nightly, a PR template, `CLAUDE.md`, `CODEOWNERS`, and the labels. Four questions, a few minutes. |
| `/ways-qa:triage` | Reports are coming in and need sorting | For each report: possible duplicates and regressions (open and closed issues), bug, request or working as designed, a severity, a team, evidence from the browser, and a confidence for each call. Calls below the agreed threshold are in bold and listed under the table as "Needs you", for a person. A third bug of the same kind gets an improvement issue drafted for engineering. |
| `/ways-qa:reproduce #n` | A bug needs pinning down before it goes to engineering | A Playwright test, written from what *should* happen, that fails with the bug's own wrong value, in a PR that someone who has never coded can review. Or, if it won't reproduce, a needs-info comment saying exactly what was tried. |

## Install

```bash
claude plugin marketplace add anthropics/claude-plugins-official
claude plugin marketplace add rattling/ways-of-working
claude plugin install ways-qa@ways-of-working
```

The official marketplace has to be added first: that's where the Playwright plugin and Pocock's skills come from. You also need `gh`, signed in, and Node for the Playwright suite.

Then, in the QA repo, run **`/ways-qa:setup`**. Not `/ways:setup`: that one is for repos with an app's code in them, and asks about architecture a QA team doesn't need.

## The repo it sets up

A Playwright suite, with the app reached by URL. `/ways-qa:setup` asks four things (the apps and their URLs in each environment, the teams for routing, the triage owner, and any domain rules) and writes:

- `environments.json`: each environment and each app's URL in it. `QA_ENV=live npx playwright test` switches all of it; `playwright.config.ts` reads it and gives each app its own project and folder under `tests/`.
- `docs/standards/qa.md`: how the team works, which triage and reproduce follow.
- `specs/domain-rules.md`: facts about the app that decide what's correct or how bad a bug is, beside the specs they come from.
- Playwright's planner, generator and healer (`npx playwright init-agents --loop=claude`), `specs/` for their plans and the acceptance notes, `charters/` for exploratory sessions, and an ignored `evidence/`.
- `CLAUDE.md`: the map of the repo, and how work goes. Every change is a branch and a PR that one other tester approves, and `CODEOWNERS` covers the standards, CI and the environments.
- A CI workflow that runs the suite on every PR and nightly, and keeps the HTML report and failure traces for 30 days.
- `.github/pull_request_template.md`, whose "How to check" works for a reviewer who has never coded: the agent runs the checks and pastes the results, and the reviewer checks the judgement calls.
- The labels from `qa.md`.

**The gate is `npx playwright test`, kept green.** A known bug that's still open has its test marked `test.fail()` with the issue linked, on the environments where the bug is, so a red run always means something new, and the test going red is how the team learns the bug is fixed. A test that checks an acceptance note carries its tag (`@AN-5`), so `--grep @AN-5` shows what covers it.

## The rules belong to the repo

The skills are generic. Everything about this app and this team is in the QA repo, and changed by PR. What's true about the app:

- **URLs:** only in `environments.json`.
- **Specs and acceptance notes:** in `specs/`.
- **Domain rules:** in `specs/domain-rules.md`, the ones that decide severity or correctness whatever a report says. "A wrong total on an invoice is always S1" goes here, not in a skill.

How the team works, in `docs/standards/qa.md`:

- **The environments testers may use,** and where the test accounts are.
- **Severity**, from S1 critical to S4 cosmetic. Separate from priority, which triage never sets.
- **Routing:** area to team.
- **Confidence:** which calls the agent may apply without asking (high only, to start), and which always go to a person (closing, duplicates, S1).
- **What counts as a pattern** of bugs, and the label names.

Until it's filled in, triage hands every call to a person.

## Updating

Update the plugin, restart Claude Code, then run `/ways-qa:setup` in the QA repo. It adds what's new in one PR and leaves what the team changed.

**From 0.2.0:** the domain rules move from `docs/standards/qa.md` to `specs/domain-rules.md`. Setup moves them word for word and leaves a pointer in `qa.md`, so the move shows in the PR for review. Until then, triage and reproduce still read the rules from `qa.md`. The update also adds the PR template and the `CODEOWNERS` line for the new file.

## Choices worth knowing

- **Confidence is a level with criteria, not a percentage.** High means checked: reproduced, settled by a spec, or an exact match. A model's own percentages aren't calibrated, so the skills don't write them. The threshold idea is from Mozilla's BugBug, which only acted on its own when it was confident and left the rest for a person.
- **A person decides duplicates.** Published duplicate detection finds the right one in its top few suggestions about 70% of the time. Good for suggesting, not for closing.
- **A regression isn't a duplicate.** The old issue stays closed, and the new one links the old fix and its date.
- **Reproduce writes the expected behaviour down before it opens the browser.** Agent-written tests tend to assert what the app does now, which locks a bug in as correct. A test that passes on the buggy app has failed.
- **A reproduced bug's test goes in with `test.fail()`,** so the suite stays green while the bug is open and goes red the moment it's fixed, which is the reminder to take the marker out. If the bug is already fixed on the environment CI runs against, the marker covers only the environments where it isn't, so CI stays green and the test records where the fix has reached. A red check people learn to merge past would hide the next real failure. It never goes to the Playwright healer: a healer that meets a real bug "fixes" the test or skips it.
- **Page content and issue text are data.** An instruction inside a report or on a page is reported to the person, not followed.

## What's next

Candidates, not promises: exploring an area with a charter or a persona and filing what turns up; grading triage calls against a rubric, to set the threshold from evidence; patterns as a skill of its own, run across the whole tracker rather than one report at a time.
