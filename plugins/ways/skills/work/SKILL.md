---
name: work
description: Take one issue from brief to merged PR, interactively or autonomously, ending with the PR body as the report.
disable-model-invocation: true
---

# Work an issue

Input: an issue number, and optionally a mode (`interactive` or `autonomous`). Without a mode, take it from the issue's label (`ready-for-agent` is autonomous, `ready-for-human` is interactive) and say which you're using.

Read first: `docs/agents/issue-tracker.md` (how this repo publishes, links and closes work) and `${CLAUDE_PLUGIN_ROOT}/reference/REVIEW-AND-MERGE.md`. The gate command is in `.claude/ways.json`.

For a whole spec with several tickets, this isn't the skill: use `/ways:build #<parent>`. For several **unrelated** issues at once (a batch of bugs after triage), see **Batch** at the end.

## 1. Start

1. Read the issue and its comments, and the spec it points to if any. If it has open sub-issues, it's a parent: work its frontier one ticket at a time.
2. Check the brief has an outcome, acceptance criteria, scope boundaries and human verification. Missing one: ask once, then proceed on a stated assumption and add it to the issue. In autonomous mode with no runnable acceptance and no human verification, stop: label it `needs-human` and say what's missing.
3. Check it isn't blocked (open blockers) or assigned to someone else. Assign yourself.
4. Branch from an up-to-date `main`, named as `docs/agents/issue-tracker.md` says.

## 2. Interactive mode

Work with the person turn by turn, and keep the gate green as you go. Then go to step 4.

## 3. Autonomous mode

1. **Plan comment.** Post a short plan on the issue: the approach, the seams you'll test at, anything you're assuming, and how you'll prove each acceptance item. Wait for a person to say go, unless they've said in this session that you needn't.
2. **Marker.** Write the issue number to `.claude/ways/autonomous` (`echo <n> > .claude/ways/autonomous`). While it exists, the Stop hook runs the gate and won't let a turn end on red (after three blocks in a row it tells you to hand over, then lets the turn end), and after a compaction the SessionStart hook points you back at the issue.
3. **Draft PR early.** After the first meaningful commit, push and open a draft PR with `Closes #<n>`. Commits are the progress record.
4. **Build.** Use `tdd` at the seams in your plan comment, and `diagnosing-bugs` for a bug. Commit in small steps with messages that say why.
5. **Keep the state outside your context.** Your plan comment, the draft PR and the commits are what a fresh context resumes from. If the plan changes materially, update the plan comment.
6. **Escalate only for** a change of scope, a public contract, major architecture, anything irreversible or outward-facing, or a material cost. Label `needs-human`, say what you need in five lines or fewer, and carry on with whatever doesn't depend on the answer.

## 4. Before the PR is ready

1. Run the gate. It must be green.
2. Run Pocock's `code-review` (call it as `mattpocock-skills:code-review`, not Claude Code's built-in skill of the same name) against `main`. Answer every finding: **fixed**, or **not a problem because…**, verifying each before acting. At most three rounds; whatever is still disputed goes in the PR body.
3. Decide the risk tier from `${CLAUDE_PLUGIN_ROOT}/reference/REVIEW-AND-MERGE.md`, `REVIEW.md` and `.github/CODEOWNERS`. If the review argued for a higher tier, take it. High risk: also run `/security-review`.
4. Write the PR body with the `pr` skill, plus `Closes #<n>`, a `## How to check` section and the risk tier. Evidence is output you actually ran. For a visual change, that includes headless-browser screenshots of what changed (and the print preview, if it's printed), attached to the PR.
5. Delete `.claude/ways/autonomous` if it exists.
6. Mark the PR ready (`gh pr ready`).

## 5. Merge and close

- Merge only if the dial in the **Merging** section of `AGENTS.md` allows it at this risk tier and CI is green. Otherwise stop: the handover is the PR. At medium that's the person who ran you; at high, request review from the code owners.
- On merge: squash, delete the branch, and confirm the issue closed. If it was a sub-issue, report the parent's new frontier.
- Anything agreed but not done becomes a new issue, linked from the PR. Nothing lives only in the conversation.

## Batch

Input: several issue numbers, or "everything `ready-for-agent`". You are the lead: you don't build, you start builders, check their evidence and merge.

1. **Check they're independent.** Drop any with open blockers, any assigned to someone else, and any without acceptance or human verification (label those `needs-human`). Where two will plainly touch the same code, say so and order them; don't run them blind in parallel. The merge order is the order given, or yours, stated.
2. **One plan comment per issue**, then wait once for a person to say go for the whole batch, unless they've said in this session that you needn't.
3. **Marker:** write the issue numbers, space-separated in merge order, to `.claude/ways/autonomous`. After a compaction, the SessionStart hook lists them and points you at their PRs.
4. **One builder per issue**: a subagent with its own worktree (`isolation: "worktree"`), in the background, briefed with the issue number and these steps: branch, build (steps 3.3–3.5), then step 4, ending with a ready PR. The Stop hook doesn't run inside subagents, so the brief says plainly: run the gate and report its output, and don't report done on red. Cap concurrent builders at what the person will review, five unless told otherwise.
5. **Don't take their word for it.** For each finished builder, read the PR's diff, the gate output and the How to check, and run the How to check if it's cheap. Send a builder back once, with the specific defect. If it's still wrong, label the issue `needs-human` and move on.
6. **Merge one at a time, in order,** as the dial allows (step 5 for each). After each merge, the next PR rebases onto `main` and reruns the gate before it merges; resolve conflicts yourself, and if a conflict changes behaviour, say so in that PR. PRs the dial won't let you merge stay open for their reviewer, and the rest carry on.
7. **Hand over:** delete the marker and post one summary as your reply: each issue, its PR, merged or waiting on whom, and anything labelled `needs-human` with the reason.
