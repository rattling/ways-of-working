# Notes as you go: for this repo, and for ways

By the end of a long run, nobody remembers what went wrong in the middle of it, so a closing "anything to improve?" gets nothing. Notice it when it happens instead.

A finding is about one of two things, and goes to a different place:

- **This repo**: its code, architecture, tests, gate, environment or docs. It becomes an issue in this repo, or a line in its `AGENTS.md`, offered at the end of the command.
- **Ways**: a skill, a template, a hook, a reference, the flow between commands. It goes into the ways log, which `/ways:feedback` reviews every so often. One run is not evidence: a change to ways waits until the same thing comes up again.

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

**Ways**, watch for, and tag each with its kind:

- **heavy**: a step that cost more than it gave, that you skipped or worked around because it didn't fit, or that cost far more time or tokens than it should have;
- **missing**: the instructions said nothing about a case that came up, or the person had to ask for something ways should have done;
- **broken**: instructions that contradicted each other, a step that was wrong, the flow stopping or sending the person elsewhere for no good reason;
- **good**, rarely: something that worked much better than expected, worth keeping as it is.

The person correcting or overriding what a skill said is one of these, usually heavy or broken. When the person says how ways felt ("that was heavy", "this bit was missing"), note it in their words and mark it `(person)`: it weighs more than your own reading.

Not a note: an ordinary choice a skill left open, or a step that went as written.

Write each as one line, appended to `.ways/feedback.md` as it happens, tagged with where it goes:

```
- [repo] gate: tests need Postgres from Docker Desktop, and nothing says to start it. Cost two failed turns.
- [ways] heavy: setup, step 1: stopped to send the person to /setup-matt-pocock-skills, whose four answers ways already fixes.
```

What happened, what it cost, and a suggestion if one is obvious. A `[ways]` line is said in ways' terms, not the repo's, and names the skill and step. Don't interrupt the work to mention it. `.ways/` is gitignored once setup has run; never stage the file, even before then.

## At the end: log the run, offer the repo notes

When the command hands over, after its last sentence (the merge sentence, where it has one):

**1. Log the run, always, even with no notes.** Append it to the ways log, `~/.ways/log.md` (create the folder and file if they aren't there). It's outside every repo, so it outlives worktrees and gathers every repo's runs in one place, and it stays on this machine. One line for the run, then the run's `[ways]` notes under it, without the tag:

```
- 2026-11-05 · ways 0.32.0 · acme-api · /ways:work · autonomous · fine
- 2026-11-05 · ways 0.32.0 · acme-api · /ways:plan · interactive · notes
  - heavy: plan, step 1: grilled on requirements the issue already answered. (person)
  - missing: plan, step 2: nothing on a change that only adds a column.
```

The fields: the date, the ways version (`${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json`), the repo's name, the command, the mode (`interactive`, `autonomous`, or `batch`), and `fine` when there are no notes or `notes` when there are. The `fine` lines matter as much as the notes: they're what says how often something goes wrong. Then remove the `[ways]` lines from `.ways/feedback.md`.

Don't ask the person about it. If there were notes, name them in one line ("Logged for ways: plan felt heavy at step 1.") so they can correct it; with none, say nothing.

**2. Offer the repo notes.**

- **No `[repo]` notes:** say nothing about them.
- **Notes:** list them, numbered, one line each, under **For this repo**. Say what each becomes: an issue here (with its title), or a line in `AGENTS.md`. Then ask: "For each: go ahead, drop it, or tell me what you think and I'll fold that in."

For the ones the person keeps:

- **An issue here:** first check the open issues (`gh issue list --search "<words>"`); if one already covers it, comment on that one instead. Otherwise `gh issue create` with a short body (what was seen, where, why it matters, what the person added) and `needs-triage`, so `/triage` sizes it with the rest. Give the links.
- **A line in `AGENTS.md`:** add it under `## Rules for this repo`, in the command's own PR if it has one still open, or as a `no-issue` PR of its own.

Once they're done or dropped, delete `.ways/feedback.md`. If the person ends the session first, the file stays, and the next session offers the repo notes and logs the ways ones.

## Reviewing the log

`/ways:feedback` reads the log every so often, a month or so, groups the notes by skill and step beside how many runs each command had, and brings back only what recurs. That's where a ways change starts: `${CLAUDE_PLUGIN_ROOT}/skills/feedback/SKILL.md`.
