# Initiate

**You're an agent reading this for a repo.** Work through it, then report.

Works on a new repo, one that already has an `AGENTS.md` or `CLAUDE.md`, and as a re-run to
pick up a newer version. Nothing here deletes anything.

## 1 · Check what's already here

```
cat AGENTS.md 2>/dev/null | head -40
cat CLAUDE.md 2>/dev/null | head -20
ls docs/ arch/ 2>/dev/null
```

If `AGENTS.md` has a `<!-- ways-of-working: vN -->` stamp matching the version at the top of
[`AGENTS-SECTION.md`](AGENTS-SECTION.md), this repo is current. Say so and stop.

## 2 · Write the required section

Fetch it:

```
https://raw.githubusercontent.com/rattling/ways-of-working/main/AGENTS-SECTION.md
```

Then merge by whichever case applies:

| Situation | What to do |
|---|---|
| No `AGENTS.md` | Create it. Put a one-paragraph description of the repo above the section. |
| `AGENTS.md` exists without the section | Append it. Leave the rest alone. |
| `AGENTS.md` has an older stamped version | Replace that section only. Keep every local edit outside it. |
| Only `CLAUDE.md` exists | Move its content into `AGENTS.md`, keeping all of it. Leave `CLAUDE.md` containing `See AGENTS.md`. |

Never delete existing content. If something conflicts, keep both and flag it in your report
rather than choosing silently.

Fill in the `_<repo owner: …>_` placeholders you can answer from the repo itself: the gate
command, the files worth reading first, the merge policy. Leave the ones that are genuinely
the human's call and list them in your report.

Keep the `<!-- ways-of-working: vN -->` stamp at the top of the section. That's how a later
session knows whether the repo is current.

## 3 · Confirm

```
gh issue list --state open --limit 5
```

If that fails, check `gh auth status`. A working GitHub CLI is the only dependency.

## 4 · Offer, don't install

Look at the repo and suggest only what it needs. Each of these is worth having under one
condition. If the condition doesn't hold, don't suggest it.

| Guidance | Worth having |
|---|---|
| [`charter`](guidance/charter.md) | when scope keeps drifting, or you're briefing work to run unattended |
| [`architecture`](guidance/architecture.md) | when someone new would put things in the wrong place |
| [`adr`](guidance/adr.md) | when a decision is expensive to reverse |
| [`lore`](guidance/lore.md) | when something surprised you that the code doesn't explain |
| [`operating-context`](guidance/operating-context.md) | when someone other than you is triaging the backlog |
| [`seed-spec`](guidance/seed-spec.md) | starting a new project, before any code exists |
| [`enforcement`](enforcement/) | when the conventions start being ignored |

Suggest at most two. A repo that adopts six documents on day one has abandoned all six by week
three.

## 5 · Report

Say what you did, and sort anything outstanding by who can finish it:

| | |
|---|---|
| `applied` | done, nothing further needed |
| `needs-reload` | you changed agent config, so it takes effect when the human reloads the session |
| `needs-human` | it's outside the repo, or it's a judgement call. Name it. |

The middle one is easy to get wrong. You can edit a config file, but you cannot make it take
effect, so say which of the two you did.
