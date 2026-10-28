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

- **A build is under way** (an `integration/<feature-slug>` branch or a draft integration PR for this parent): resume it. Read the draft PR's checklist and the branch's commits, say "N of M done", and carry on from step 3, in the integration branch's worktree (step 3.1). Don't recut tickets.
- **Tickets exist under the parent** (open sub-issues): go to step 3. Nothing to ask.
- **No tickets yet:** go to step 2.

## 2. Cut the tickets

Before cutting, ask once: "I'll cut the tickets first. Then go straight into the build, or stop so you can check them?"

Run Pocock's `to-tickets` steps (`${CLAUDE_PLUGIN_ROOT}/reference/POCOCK.md`: only a person can type it, so read its instructions and follow them here), with the parent issue. It shows the breakdown for approval: that step always happens. With it, show which tickets are independent of the main chain (no blocking edge between them, and they touch different parts), and offer parallel as an explicit choice: "Tickets 4, 6 and 9 don't depend on the main chain. Build them alongside it? That saves roughly <time>, but runs a stack per worktree at once (more memory) and is harder to follow. Default: one at a time." Take the answer with the approval. In straight-through mode, that one approval also starts the build; otherwise stop after publishing, with the merge sentence (nothing to merge yet) and "Next: `/ways:build #<n>`".

Every ticket gets a **Human verification** line, which `to-tickets`' template lacks and `/ways:work` needs: from the PRD's Human verification, or "matches the mock" with what to compare. `docs/agents/issue-tracker.md` says the rest.

## 3. Build

0. **Check what the build will need to push.** If any ticket, or the PRD's design, touches `.github/workflows/`, check the GitHub token can push workflow changes (`gh auth status` lists a `workflow` scope). If it can't, ask before starting: "Ticket 11 changes `.github/workflows/deploy.yml`, and your GitHub token can't push workflow files. Run `gh auth refresh -s workflow`, then say go." Don't find out at the last push.

1. **Its own worktree, never the person's checkout.** Their checkout is where their dev server runs: switch it to the integration branch and it serves half-built code, and its database gets migrated under them. So the lead works in a worktree of its own: enter one (Claude Code's `EnterWorktree`), and in it check out `integration/<feature-slug>`, or create it from an up-to-date `main`. Resuming: if `git worktree list` shows a worktree already on that branch, work in that one if you can enter it; otherwise, once `git -C <path> status` shows nothing uncommitted there, remove it (`git worktree remove <path>`) and enter a fresh one. The marker, the progress file, the final gate and the hand-over walk all happen in this worktree, on its own containers and ports (`docs/standards/delivery.md`): move `.claude/ways/part` across with you. The person's checkout stays on whatever branch they left it on.
2. **Run the gate once, before the marker.** A red gate before any code is written is the environment, not the build: a service that isn't running (Docker Desktop after a restart, say), generated files left stale by a running dev server, a missing dependency. Fix what you can; for anything else, tell the person exactly what's needed and wait. Write no marker until the gate is green here: a red one only makes the Stop hook block turns for a cause nobody can fix in code.
3. **Marker.** Write the parent's number to `.claude/ways/autonomous` (`echo <n> > .claude/ways/autonomous`), so the Stop hook holds the gate and a fresh context resumes from the issue. Nobody should have to know about it.
4. **Build.** Run Pocock's `implement-spec` steps (`${CLAUDE_PLUGIN_ROOT}/reference/POCOCK.md`: only a person can type it, so read its instructions and follow them here), with the parent issue. In straight-through mode this follows the ticket approval without stopping. `docs/agents/issue-tracker.md` sets how: one ticket at a time unless the person asked for parallel, a model per ticket, progress as "N of M done", the run's cost in the integration PR, on `integration/<feature-slug>`.
5. **Review.** The code review is Pocock's `code-review` (`mattpocock-skills:code-review`), not Claude Code's built-in skill of the same name. Call it by that full name.

## 4. Hand over

**Look at it before calling it ready.** If the feature has screens, reset the dev seed, run the app from the integration worktree once, on its own port, and walk each user story the way a person would, with the seeded records the tickets name. If a story can't be tried with the seeded data, say so in the integration PR. Open each screen beside its mock: the layout and content as the mock has them, the look as the PRD chose (the app's own, or a new one). Fix what doesn't match, or list it in the integration PR. If you can't run it, say plainly in the PR and the handover that nobody has looked at it yet. If the person's reaction to it is about taste, offer style directions as screenshots of the running app (`${CLAUDE_PLUGIN_ROOT}/skills/mock/SKILL.md`, step 3); the pick becomes a theme ticket for `/ways:work`.

**Check the docs across the whole feature.** Each ticket kept the docs true to its own diff, but drift can show only across tickets (three of them together moving a responsibility to another part), and the build may have landed somewhere other than the design. Read the whole `main...integration/<feature-slug>` diff against `/ways:work`'s step 4.2 list, and against the PRD's design. Fix what's untrue on the integration branch; where the build departed from the design, say so in the integration PR and update the PRD's Implementation Decisions to what was built.

Delete `.claude/ways/autonomous`, `.claude/ways/progress` and `.claude/ways/part`, and stop the integration worktree's containers. Mark the integration PR ready. Say what was built and what's left in a few lines, with anything labelled `needs-human` and why.

Then the merge sentence: "To ship it, merge PR #<m>: that's every ticket and the review, and merging closes them." Next: nothing in this feature; follow-ups are new issues: `/ways:work` for small ones, `/triage` for a pile. Then the notes, for this repo and for ways, if there are any (`${CLAUDE_PLUGIN_ROOT}/reference/FEEDBACK.md`).
