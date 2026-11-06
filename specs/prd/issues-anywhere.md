# Issues anywhere: GitHub, local markdown, or your own tracker

**Tracking:** #58 · **Status:** draft · **Owner:** John

## Problem Statement

Ways only works with GitHub Issues. `/ways:setup` writes the GitHub tracker file without asking, and stops if the remote isn't GitHub, because "the method keeps its status in GitHub". The skills, the hooks, the band and the `pr-hygiene` check all assume an issue is `#<digits>` and that `gh issue` reaches it.

Teams change trackers, and some are moving to Linear. A team on another tracker has to choose between that tracker and the method, and they shouldn't have to. Pocock's own setup already offers GitHub, GitLab, local markdown and "other"; ways overrides the choice.

The code staying in git and PRs staying on GitHub is a reasonable opinion: nearly everyone is on git, and the autonomous build needs it. The tracker is where people really differ.

## Solution

Where issues live becomes a choice made once, at setup, out of three:

- **GitHub Issues**, as now, and the default when the remote is GitHub.
- **Local markdown** in the repo, following Pocock's `.scratch/` convention, with one rule added: every issue is a folder.
- **Other**: the person describes their tracker (Linear, Jira) in a paragraph, setup tries one read through the CLI or connector they name, and the commands follow the description.

Every ways convention that's written in GitHub terms today (the parent issue, sub-issues, labels, the plan comment, `Closes #n`, the `Spec:` line) gets a local-markdown form, and a line telling "other" to map it onto the described tracker. Code stays in git, PRs stay on GitHub, and specs stay in `specs/prd/` whatever the tracker. A repo already on GitHub sees no change.

## User Stories

### Choosing the tracker

1. As a person setting up ways in a repo, I want setup to ask where issues live, with GitHub as the default when the remote is GitHub, so that I can keep the tracker my team already uses.
2. As a person setting up a repo with local markdown, I want setup to write `docs/agents/issue-tracker.md` from Pocock's local template plus the ways conventions, so that every command and Pocock skill reads the same rules.
3. As a person setting up a repo with local markdown, I want setup to skip the `gh issue` check and the label creation, so that it doesn't fail or clutter GitHub with labels nobody uses.
4. As a person setting up a repo whose remote is GitHub, I want setup to keep checking the remote for PRs whatever tracker I choose, so that the parts that need GitHub still work.
5. As a person on Linear or Jira, I want to describe my tracker in a paragraph and have setup record it, so that I can use ways without waiting for it to support my tracker by name.
6. As a person choosing "other", I want setup to try one read through the CLI or connector I named (a few open issues) before recording it, so that I know straight away whether Claude can reach my tracker.
7. As a person whose tracker setup can't reach, I want setup to say plainly what failed and ask whether to record it anyway, with a line in the file saying it wasn't reached at setup, so that nobody later assumes it was checked.
8. As a person re-running setup on a repo set up before this change, I want it to keep GitHub without asking and only refresh the overlay text, so that an update never moves my issues.
9. As a person re-running setup on a repo with local markdown or "other", I want it to read the choice from `docs/agents/issue-tracker.md` and not ask again, so that a re-run is as quick as it is now.

### Local issues

10. As a person with local issues, I want each piece of standalone work (a bug, a small enhancement) to be its own folder, `.scratch/<slug>/issue.md`, so that it has an ID and a place for its comments.
11. As a person with local issues, I want big work's request to be the same kind of file, becoming the parent when it's planned, with its tickets in `.scratch/<slug>/issues/NN-<slug>.md`, so that a parent and its tickets sit together the way a GitHub parent and its sub-issues do.
12. As a person with local issues, I want a standalone issue's ID to be its folder name (`login-timeout`) and a ticket's to be `<feature>/<NN>` (`billing/03`), so that I can type them into commands.
13. As a person with local issues, I want to run `/ways:work login-timeout`, `/ways:work billing/03`, `/ways:plan billing` and `/ways:build billing` the way I'd type `#12`, so that the commands feel the same.
14. As a person with local issues, I want branch names to carry the ID with `/` turned into `-` (`fix/billing-03-<slug>`), so that a branch for an issue can be found from its ID.
15. As a person with local issues, I want a branch for the issue to mean it's claimed, so that two people don't start the same work without a lock file.
16. As a person with local issues, I want the triage labels and `needs-human` to be values of a `Status:` line near the top of the file, plus `done` for closed work, one at a time, so that an issue's state is in one obvious place.
17. As a person with local issues, I want `/triage` to size and label local issues by setting their `Status:` line, so that triage works the same whatever the tracker.
18. As a person with local issues, I want the plan comment, the brief and any questions left for me appended under `## Comments` in the issue file, with the date, and committed on the work's branch, so that the conversation travels with the issue.
19. As a person with local issues, I want work to close when its PR sets `Status: done` and merges, so that closing an issue shows in the PR's diff, the local version of `Closes #n`.
20. As a person with local issues, I want to accept that a status change made on a branch only reaches `main` when its PR merges, so that nothing ever writes straight to `main`.
21. As a person running `/ways:build` with local issues, I want the lead to keep ticket statuses on the integration branch, so that a resumed build reads them where it left them.
22. As a person with local issues, I want "everything `ready-for-agent`", the open issues and a build's frontier found from the `Status:` lines under `.scratch/` in the checkout the command runs in, so that the queues need no index file.
23. As a person with local issues, I want ticket numbers given out only by the ticket step of `/ways:build`, and a clash between two branches settled at merge by the second one renumbering, so that there's no counter or lock to maintain.

### Specs, briefs and backfill

24. As a person planning big work on any tracker, I want the PRD to stay in `specs/prd/<slug>.md` on `spec/<slug>`, so that specs live where people look for them, versioned with the code.
25. As a person planning with local issues, I want the `Spec:` line at the top of the parent's `issue.md`, so that `/ways:build` finds the spec the same way it does from a GitHub parent.
26. As a person running `/ways:discover` with local issues, I want the intake issue written as `.scratch/<slug>/issue.md` and committed on the `discovery/` branch, so that it merges with the brief.
27. As a person setting up an existing codebase with local issues, I want setup's "Adopt the ways of working" parent written as `.scratch/adopt-ways/issue.md`, with its items as tickets, in the setup PR, so that the backfill is tracked the same way as everything else.

### PRs and checks

28. As a person on any tracker, I want a PR to name its issue in the tracker's own form (`Closes #12`, `Closes billing/03`, `Closes ENG-123`), so that a reader can find the issue behind it.
29. As a person on any tracker, I want the `pr-hygiene` check to accept all three forms, so that a local or Linear repo isn't blocked by a check written for GitHub numbers.
30. As a person on any tracker, I want the PR template's first line to suit the repo's tracker, so that a new PR doesn't start with `Closes #` when there are no GitHub issues.
31. As a person with a PR that has no issue behind it, I want the `no-issue` label to keep working, so that chores still skip the check.

### Autonomous runs, the hook and the band

32. As a person running `/ways:work` autonomously with local issues, I want the marker to hold the ID as written (`billing/03`), so that the SessionStart hook and the band name the right issue.
33. As a person leading a batch, I want the marker to hold several IDs, space-separated, in merge order, whatever the tracker, so that a batch resumes after a compaction.
34. As a person watching the band, I want it to show IDs as written, with a `#` only for GitHub numbers, so that `billing/03` and `ENG-123` read the way the tracker writes them.
35. As a person mid-run when the context is compacted, I want the SessionStart hook to point back at the issue file with local issues (or at the described tracker with "other"), not at `gh issue view`, so that the run resumes from the right place.
36. As a person with a marker an older version wrote (bare numbers), I want it still read as GitHub issues, so that upgrading ways doesn't break a run in progress.
37. As an agent starting a session, I want the SessionStart hook's line about where status lives to say what this repo's tracker is, not "GitHub issues", so that I don't look in the wrong place.

### The other readers

38. As a person on any tracker, I want `/ways:explain` and `/ways:arch-review` to list open issues from the repo's tracker, so that they don't miss known work or report it as new.
39. As a person on any tracker, I want the "an issue here" step of the feedback notes to file into the repo's tracker, so that a repo finding lands where the team looks.
40. As a person using `/ways:feedback`, I want it to keep filing to ways' own GitHub repo, so that feedback about the method reaches its maintainers whatever my tracker.
41. As a person reading `AGENTS.md` in a set-up repo, I want its "Issues live in…" line to say where this repo's issues live, so that it's true for local and "other" repos.
42. As a person reading the ways README, I want it to say the build commands need git, and GitHub for PRs, with issues in GitHub, in files, or in my own tracker, so that I know what ways asks of my setup before I install it.

### Testing it

43. As the maintainer, I want local markdown tried end to end in a throwaway repo (setup, `/ways:work` on a standalone bug, a two-ticket `/ways:build` through to the integration PR, `pr-hygiene` passing on `Closes billing/0N`) before the integration PR merges, so that the one new tracker anyone can try is known to work.
44. As the maintainer, I want a setup re-run on an existing GitHub ways repo to show no tracker change, and the plugin's tests to pass with numeric markers, so that the default path is known not to have regressed.
45. As the maintainer, I want "other" checked only as far as setup recording a description and reporting an unreachable tracker, so that we don't build against a tracker no real team has brought yet.

## Implementation Decisions

- **One file knows the tracker.** The ways overlay becomes tracker-neutral. It opens with a table of tracker operations: read an issue, comment on it, set its state, create a child ticket, list open issues by state, and close work through a PR. The conventions below the table are written in those terms. Setup appends one of three short sections that give the operations for this repo: GitHub (today's `gh` commands), local markdown (the `.scratch/` rules in the user stories) or other (map each operation onto the described tracker). Nothing else names the tracker.
- **The commands use the operations.** Work, build, plan, requirements, design, discover's hand-off, explain, arch-review, setup's backfill and the feedback notes' "an issue here" stop naming `gh issue`, sub-issues and labels. They name the operation and point at `docs/agents/issue-tracker.md`. `/ways:feedback` keeps `gh issue create`, because it files to ways' own repo.
- **The ID is the one contract** between the commands, the scripts and the PR check. An ID is a GitHub number (`12` or `#12`), a local `<slug>` or `<slug>/<NN>`, or a tracker key (`ENG-123`). It's written the same way in the marker, in commands, in branch names (`/` becomes `-`) and in PR bodies. It changes by addition: numeric markers and `#12` keep working.
- **The marker** `.ways/autonomous` holds IDs as written, space-separated, in merge order. The SessionStart hook and the band split it on whitespace instead of keeping digits, and add `#` only to bare numbers. The hook's resume line and its "where status lives" line name the repo's tracker. It reads which tracker from the section setup appended.
- **`pr-hygiene`** accepts `Closes`, `Fixes`, `Resolves` or `Refs` followed by any ID form. `no-issue` is unchanged.
- **Setup** asks where issues live (GitHub by default when the remote is GitHub), and asks only on a first run: a re-run reads the existing section. For local and other it skips `gh issue` checks and label creation, and writes the PR template's first line (`Closes `) and `AGENTS.md`'s tracker line to suit. For other it tries one read and records the result (user stories 6 and 7). The GitHub remote check stays, for PRs.
- **As built** (where the build settled what the spec left open):
  - The three tracker sections are files of their own beside the overlay (`templates/overlays/where-issues-live-*.md`), headed `## Where issues live: GitHub`, `local markdown` or `other`. Setup appends exactly one, and the hook reads that heading.
  - The operations table has a seventh row, **claim it**: assign yourself on GitHub and other, cut the branch for local.
  - A local issue's category goes on the brief's `Category:` line, as Pocock's brief writes it. Only the state is on `Status:`.
  - Setup still creates the `no-issue` PR label for local and other, since PRs stay on GitHub and `pr-hygiene` skips on it. It doesn't seed `.github/ISSUE_TEMPLATE/` for them.
  - A setup re-run on a repo set up before this change adds the GitHub section as well as refreshing the overlay, because the overlay points at it.
  - In the marker, a bare number always reads as a GitHub issue, so old markers keep working. An "other" tracker with numeric IDs would be misread.
  - `pr-hygiene` accepts a GitHub number anywhere in the body, as before, and any other ID on a line of its own after the keyword.
  - With local issues, `/ways:build`'s ticket step commits the ticket files on `integration/<slug>`, even when it stops for them to be checked.
- **Local issues live on branches** ([ADR 0001](../../docs/adr/0001-local-issues-live-on-branches.md)): nothing writes to `main`, and a status reaches it with the PR that changes it.
- **Context and containers:** nothing new, except that "other" reaches the person's tracker through a CLI or connector they're already signed into. Nothing is stored. The look and the dev seed don't apply: there are no screens, and the throwaway repo is the demo.

## Testing Decisions

- Test through the existing seams only, by what a person sees: what the SessionStart hook prints, and what the band shows.
- `session-start.test.sh` gets a local marker (`billing/03`), a batch of local IDs and a Linear-style key beside the numeric cases, and checks the resume line names the tracker. `ways-band.test.ts` does the same for what the band shows: `#12`, `billing/03`, `ENG-123`.
- `pr-hygiene` has no test today and gets none: the throwaway-repo run checks it, along with the prose in the commands (Human verification).
- The GitHub path is checked by the existing tests passing unchanged, and by a setup re-run on an existing repo.

## Size

| | Closest: guard `main` (#44) | This feature |
|---|---|---|
| Files added / changed | 7 | about 22 (1 ADR added) |
| New classes (or modules) | 1 script | none |
| Lines, code and prose | about 105 | about 200, a few lines in each command, about 60 in the overlay |
| Lines, tests | about 88 | about 55 |
| Tickets, rough build time | 1 | 4, about an afternoon |

The tickets: (1) the neutral overlay, the three tracker sections, and the commands moved onto its operations; (2) setup asks, tries "other", and writes the PR template and `AGENTS.md` lines to suit; (3) IDs in the marker, the hook and the band, with tests; (4) `pr-hygiene` and the README. Then the throwaway-repo check.

It's wider than #44 because it touches every command, not because it's deeper.

## Out of Scope

- Code outside git, or reviews outside GitHub PRs.
- Changing every GitHub mention in the skills: only the issue side changes.
- GitLab issues as a first-class choice. A person can describe GitLab under "other".
- Moving a repo from one tracker to another, open issues included.
- `pr-hygiene` checking that a local PR really sets `Status: done`.
- Building against a real Linear or Jira setup, until a team uses one.

The Later list is in the "Agreed so far" comment on #58.

## Must not exist yet

- A lock file, counter file or index of local issues. Branches mean claimed; `Status:` lines are the index.
- Any write to `main` from a command, to move a local issue's status.
- A tracker adapter layer, plugin interface or per-tracker scripts for "other". It's a paragraph the commands follow.
- A migration command between trackers.
- A second copy of the spec in `.scratch/<feature>/spec.md`. The PRD lives only in `specs/prd/`.
- New labels or label creation for local or "other" repos.

## Human verification

In a new, empty throwaway repo with a GitHub remote:

1. Run `/ways:setup` and choose local markdown. The setup PR has `docs/agents/issue-tracker.md` from Pocock's local template plus the ways conventions. No labels are created on GitHub, and `AGENTS.md` says issues live in `.scratch/`.
2. Write a small bug as `.scratch/login-timeout/issue.md` with `Status: needs-triage`, and run `/triage` on it. Its `Status:` becomes `ready-for-agent` and no GitHub issue is created.
3. Run `/ways:work login-timeout`. The branch is `fix/login-timeout-<slug>`, the band shows `login-timeout`, the plan is under `## Comments` in the file, and the PR says `Closes login-timeout`, sets `Status: done`, and passes `pr-hygiene`.
4. Write a request as `.scratch/billing/issue.md` and run `/ways:plan billing`, then `/ways:build billing` with two tickets. The parent gets a `Spec:` line, the tickets are `.scratch/billing/issues/01-…` and `02-…`, the band shows `billing` (the parent, as `/ways:build` writes it) during the run, each ticket PR says `Closes billing/0N` and sets `Status: done` on the integration branch, and the integration PR closes the parent and both tickets.
5. Re-run `/ways:setup` on an existing GitHub ways repo. It doesn't ask about the tracker, and its PR changes only the overlay text.
6. In another throwaway repo, choose "other" and describe a tracker Claude can't reach. Setup says what failed, asks whether to record it anyway, and on yes writes the description with a line saying it wasn't reached.

## Further Notes

- Pocock's skills already read the tracker from `docs/agents/issue-tracker.md` (`/triage` included), so most of the change is in ways' own overlay, commands, hooks and checks.
- The ID slot (`#12`, `billing/03`, `ENG-123`) is the one shape every part has to accept. Today the band and the SessionStart hook keep only the digits from the marker, and `pr-hygiene` matches only `#\d+`.
