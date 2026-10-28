# Notes as you go: for this repo, and for ways

By the end of a long run, nobody remembers what went wrong in the middle of it, so a closing "anything to improve?" gets nothing. Notice it when it happens instead, and at the end offer the person the specific findings.

A finding is about one of two things, and goes to a different place:

- **This repo**: its code, architecture, tests, gate, environment or docs. It becomes an issue in this repo, or a line in its `AGENTS.md`.
- **Ways**: a skill, a template, a hook, a reference, the flow between commands. It goes back to the ways-of-working repo through `/ways:feedback`.

Some are both. "No way for an agent to sign in locally" is a gap in this repo (write it down) and in ways (nothing asked for it): note it twice.

## Note it when it pops out

The bar is high: something you'd want fixed, noticed in passing, outside what the command is doing. What's inside the task, fix as part of it; what's agreed but not done already becomes an issue. Most runs have no notes, and that's fine.

**This repo**, watch for:

- a bug or a smell in code you read but weren't there to change;
- a test that's missing where it plainly matters, flaky, or slow; a gate that's fragile or slow;
- environment friction: a service that had to be started by hand, a setup step nobody wrote down, how an agent signs in locally;
- docs that were wrong or missing when you needed them: `AGENTS.md`, the README, `docs/ARCHITECTURE.md`;
- code drifting from `docs/ARCHITECTURE.md`, an ADR or the standards, beyond the lines you touched;
- a manual step you did more than once that a script would do;
- the person telling you a rule of the repo you couldn't have known ("we never touch the legacy schema"): that's a line for `## Rules for this repo` in `AGENTS.md`, not an issue.

**Ways**, watch for:

- a step that didn't fit what was in front of you, and you adapted it, skipped it or worked around it;
- the person correcting or overriding what a skill said to do;
- instructions that contradicted each other, or said nothing about a case that came up;
- the flow stopping, or sending the person somewhere else, for no good reason;
- something costing far more time or tokens than it should have;
- rarely, something that worked much better than expected, worth keeping as it is.

Not a note: an ordinary choice a skill left open, or a step that went as written.

Write each as one line, appended to `.claude/ways/feedback.md` as it happens, tagged with where it goes:

```
- [repo] gate: tests need Postgres from Docker Desktop, and nothing says to start it. Cost two failed turns.
- [ways] setup, step 1: stopped to send the person to /setup-matt-pocock-skills, whose four answers ways already fixes.
```

What happened, what it cost, and a suggestion if one is obvious. A `[ways]` line is said in ways' terms, not the repo's. Don't interrupt the work to mention it. `.claude/ways/` is gitignored once setup has run; never stage the file, even before then.

## Offer them at the end

When the command hands over, after its last sentence (the merge sentence, where it has one):

- **No notes:** say nothing about them.
- **Notes:** list them, numbered, one line each, under **For this repo** and **For ways** (leave out a heading with nothing under it). Say what each becomes: an issue here (with its title), a line in `AGENTS.md`, or feedback to ways. Then ask: "For each: go ahead, drop it, or tell me what you think and I'll fold that in."

Then, for the ones the person keeps:

- **An issue here:** first check the open issues (`gh issue list --search "<words>"`); if one already covers it, comment on that one instead. Otherwise `gh issue create` with a short body (what was seen, where, why it matters, what the person added) and `needs-triage`, so `/triage` sizes it with the rest. Give the links.
- **A line in `AGENTS.md`:** add it under `## Rules for this repo`, in the command's own PR if it has one still open, or as a `no-issue` PR of its own.
- **For ways:** follow `${CLAUDE_PLUGIN_ROOT}/skills/feedback/SKILL.md` with those, from its step 1: it strips what's not to be shared, shows the issue text, and sends nothing without a yes.

Once they're done or dropped, delete `.claude/ways/feedback.md`. If the person ends the session first, the file stays, and the next session offers them.
