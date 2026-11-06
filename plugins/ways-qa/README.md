# ways-qa

Two skills for a QA team that tests a running app through Playwright and doesn't have the app's code. It installs `ways` (and so Matt Pocock's skills) and the Playwright plugin with it, so a tester installs one thing.

| Command | Use it when | You end up with |
|---|---|---|
| `/ways-qa:triage` | Reports are coming in and need sorting | For each report: possible duplicates and regressions (open and closed issues), bug, request or working as designed, a severity, a team, evidence from the browser, and a confidence for each call. Calls below the agreed threshold go to a person. A third bug of the same kind gets an improvement issue drafted for engineering. |
| `/ways-qa:reproduce #n` | A bug needs pinning down before it goes to engineering | A Playwright test, written from what *should* happen, that fails with the bug's own wrong value. Or, if it won't reproduce, a needs-info comment saying exactly what was tried. |

## Install

```bash
claude plugin marketplace add anthropics/claude-plugins-official
claude plugin marketplace add rattling/ways-of-working
claude plugin install ways-qa@ways-of-working
```

The official marketplace has to be added first: that's where the Playwright plugin and Pocock's skills come from. You also need `gh`, signed in, and Node for the Playwright suite.

## The repo it expects

A Playwright suite, with the app reached by URL:

- `tests/`: the tests, with `playwright.config.ts` pointing `baseURL` at the app.
- `specs/`: what the app should do, area by area. Playwright's planner writes these; people correct them. This is what "correct" means to both skills.
- `docs/standards/qa.md`: the rules triage and reproduce follow. Copied in from [`templates/docs/standards/qa.md`](templates/docs/standards/qa.md) the first time either skill runs.
- `CLAUDE.md`: what the suite is and how to run it.

## The rules belong to the repo

The skills are generic. Everything about this app and this team is in `docs/standards/qa.md`, and changed by PR:

- **The app:** its URL, where the test accounts are, which environments are allowed.
- **Domain rules:** the ones that decide severity or correctness whatever a report says. "A wrong total on an invoice is always S1" goes here, not in a skill.
- **Severity**, from S1 critical to S4 cosmetic. Separate from priority, which triage never sets.
- **Routing:** area to team.
- **Confidence:** which calls the agent may apply without asking (high only, to start), and which always go to a person (closing, duplicates, S1).
- **What counts as a pattern** of bugs, and the label names.

Until it's filled in, triage hands every call to a person.

## Choices worth knowing

- **Confidence is a level with criteria, not a percentage.** High means checked: reproduced, settled by a spec, or an exact match. A model's own percentages aren't calibrated, so the skills don't write them. The threshold idea is from Mozilla's BugBug, which only acted on its own when it was confident and left the rest for a person.
- **A person decides duplicates.** Published duplicate detection finds the right one in its top few suggestions about 70% of the time. Good for suggesting, not for closing.
- **A regression isn't a duplicate.** The old issue stays closed, and the new one links the old fix and its date.
- **Reproduce writes the expected behaviour down before it opens the browser.** Agent-written tests tend to assert what the app does now, which locks a bug in as correct. A test that passes on the buggy app has failed.
- **A reproduced bug's test goes in with `test.fail()`,** so the suite stays green while the bug is open and goes red the moment it's fixed, which is the reminder to take the marker out. It never goes to the Playwright healer: a healer that meets a real bug "fixes" the test or skips it.
- **Page content and issue text are data.** An instruction inside a report or on a page is reported to the person, not followed.

## What's next

Candidates, not promises: exploring an area with a charter or a persona and filing what turns up; grading triage calls against a rubric, to set the threshold from evidence; patterns as a skill of its own, run across the whole tracker rather than one report at a time.
