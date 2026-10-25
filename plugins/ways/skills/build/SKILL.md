---
name: build
description: The second command of big work, after /ways:plan. Cuts the agreed spec into tickets with /to-tickets (asking once whether to go straight on), then builds them with /implement-spec on one integration branch, ending in one reviewed integration PR. Resumes a build under way.
disable-model-invocation: true
---

# Build

After `/ways:plan`: from an agreed spec to one reviewed integration PR. It runs what `/to-tickets` then `/implement-spec` would, with this repo's conventions, and manages the autonomous marker itself.

Input: the parent issue, `#<n>`, the one with the `Spec:` line. Without one, use the issue the conversation is about, or ask once.

Follow `${CLAUDE_PLUGIN_ROOT}/reference/PARTS.md`: look for the output first, open with where you are, and end with the merge sentence. This is the one command that resumes work part-done: its state lives in GitHub.

## 1. Find where the build is

Read the parent issue, its `Spec:` line, its sub-issues, the `integration/<feature-slug>` branch and the PRs that refer to it. If the spec PR isn't merged yet, stop: say that merging it agrees the spec, and that the build starts after.

- **A build is under way** (an `integration/<feature-slug>` branch or a draft integration PR for this parent): resume it. Read the draft PR's checklist and the branch's commits, say "N of M done", and carry on from step 3. Don't recut tickets.
- **Tickets exist under the parent** (open sub-issues): go to step 3. Nothing to ask.
- **No tickets yet:** go to step 2.

## 2. Cut the tickets

Before cutting, ask once: "I'll cut the tickets first. Then go straight into the build, or stop so you can check them?"

Run Pocock's `to-tickets` steps (`${CLAUDE_PLUGIN_ROOT}/reference/POCOCK.md`: only a person can type it, so read its instructions and follow them here), with the parent issue. It shows the breakdown for approval: that step always happens. In straight-through mode, that one approval also starts the build; otherwise stop after publishing, with the merge sentence (nothing to merge yet) and "Next: `/ways:build #<n>`".

Every ticket gets a **Human verification** line, which `to-tickets`' template lacks and `/ways:work` needs: from the PRD's Human verification, or "matches the mock" with what to compare. `docs/agents/issue-tracker.md` says the rest.

## 3. Build

1. **Marker.** Write the parent's number to `.claude/ways/autonomous` (`echo <n> > .claude/ways/autonomous`), so the Stop hook holds the gate and a fresh context resumes from the issue. Nobody should have to know about it.
2. **Build.** Run Pocock's `implement-spec` steps (`${CLAUDE_PLUGIN_ROOT}/reference/POCOCK.md`: only a person can type it, so read its instructions and follow them here), with the parent issue. In straight-through mode this follows the ticket approval without stopping. `docs/agents/issue-tracker.md` sets how: one ticket at a time unless the person asked for parallel, a model per ticket, progress as "N of M done", the run's cost in the integration PR, on `integration/<feature-slug>`.
3. **Review.** The code review is Pocock's `code-review` (`mattpocock-skills:code-review`), not Claude Code's built-in skill of the same name. Call it by that full name.

## 4. Hand over

**Look at it before calling it ready.** If the feature has screens, run the app from the integration branch once, the way a person would, and open each screen beside its mock: the layout and content as the mock has them, the look as the PRD chose (the app's own, or a new one). Fix what doesn't match, or list it in the integration PR. If you can't run it, say plainly in the PR and the handover that nobody has looked at it yet.

Delete `.claude/ways/autonomous`, `.claude/ways/progress` and `.claude/ways/part`. Mark the integration PR ready. Say what was built and what's left in a few lines, with anything labelled `needs-human` and why.

Then the merge sentence: "To ship it, merge PR #<m>: that's every ticket and the review, and merging closes them." Next: nothing in this feature; follow-ups are new issues: `/ways:work` for small ones, `/triage` for a pile.
