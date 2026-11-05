---
name: feedback
description: Review the ways log, every so often, for what keeps coming up across runs and repos, and send only the recurring themes the person agrees to back to the ways-of-working repo as issues. Also logs a note the person wants to make now. Strips anything about their repos, shows the text, and opens nothing without a yes.
disable-model-invocation: true
---

# Feedback on ways

One session is not evidence: a step that felt heavy once may be right nine times out of ten, and changing ways after every run steers it all over the place. So every command logs its run to `~/.ways/log.md`, fine or not, with notes on what was heavy, missing or broken (`${CLAUDE_PLUGIN_ROOT}/reference/FEEDBACK.md` says how). This skill reads that log, every so often, and brings back what recurs.

Input, optional: something the person wants to say about ways now. Log it as a note under a run line for this session (`/ways:feedback` as the command, `(person)` on the note), say it's logged, and stop, unless they ask for the review too or say it can't wait. Something that can't wait (a skill that's plainly broken, say) goes straight to step 4 as a theme of its own.

## 1. Read the log

Read `~/.ways/log.md` from the last `## Reviewed` line, or from the top if there isn't one. Read the earlier notes too, but only to count with: a one-off from before that comes up again now makes a theme. Pick up stray notes too: `[ways]` lines left in `.ways/feedback.md` here, from a session that ended before it logged them. Log those first, under a run line for the command they came from if it's clear, or `unknown`.

If the log isn't there, or has fewer than about ten runs since the last review, say so and stop: there isn't enough yet to tell a pattern from a one-off.

## 2. Group it

- **Runs:** how many of each command, in how many repos, and how many were `fine`.
- **Gate time:** for each command and repo with gate fields, the median gate runs per run and the gate's share of the run's time ("build in one repo: 14 gate runs, 20% of the time"). A share that's high in several runs is a theme of its own, even with no note saying so.
- **Notes:** grouped by skill and step, then by kind (heavy, missing, broken, good). Notes in different words about the same thing are one theme: say which you merged.

A **recurring theme** is one that came up in three or more runs, or in two or more repos. Fewer than that is a one-off. A `(person)` note counts double. A theme that's mostly about one repo's quirks is that repo's, not ways'.

## 3. Show it

A short report, recurring themes first:

```
Since 2026-10-01: 23 runs in 4 repos. /ways:work 14 (11 fine), /ways:plan 5 (2 fine), /ways:build 4 (3 fine).

Recurring
1. heavy · plan, step 1: grilled on requirements already written down. 3 runs, 2 repos, 1 person.
2. missing · work, step 4.6: no word on containers when the repo has none. 4 runs, 1 repo.

One-offs (left in the log)
- broken · setup, step 3: …
```

Give each recurring theme a suggestion only if the notes point to one, and lean towards taking a step away over adding one: a theme that says "heavy" is rarely fixed by a new rule. Then ask: "For each recurring one: send it to ways, drop it, or tell me what you think and I'll fold that in." One-offs aren't sent; they stay in the log and count next time.

## 4. Draft the issues

One issue per theme the person keeps, the way `.github/ISSUE_TEMPLATE/session-feedback.md` in the ways-of-working repo lays it out:

- **Title:** the finding ("`/ways:plan` grills on requirements already written down").
- **How often:** runs and repos it came up in, out of how many runs of that command, and the ways versions.
- **What happens:** the notes behind it, said in ways' terms, worst first, and what it cost.
- **Suggestion**, if there is one.

Only what the log shows. No guesses dressed as findings.

## 5. Strip what isn't to be shared

The ways-of-working repo is public. Take out, or replace with something generic:

- client and company names, people's names, product and system names that identify them;
- repo names (say "a client repo", "two repos"), URLs, issue and PR links in the person's repos;
- code, data, file contents, paths that reveal the domain, error text with real values;
- numbers that are the business's own.

Keep what's about ways: which skill, which step, what it did, the version, the counts.

## 6. Show it, then send it on a yes

Show each full title and body, and say plainly: "This goes to a public repo, rattling/ways-of-working. Anything to take out?" Send nothing until the person says yes.

On a yes, the repo is the `repository` in `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json`:

```bash
gh issue create --repo <owner>/<repo> --title "<title>" --body-file <file> --label enhancement
```

If the label doesn't exist there, create the issue without it. If `gh` isn't installed or signed in, or the person has no GitHub account, write the text to `ways-feedback.md` in the session's scratch folder, give the path, and say where to send it: a new issue at `https://github.com/<owner>/<repo>/issues/new`, pasted in. Don't put the feedback in a URL.

Give each issue's link when it's created.

## 7. Mark the review

Append `## Reviewed <date>` to the log, with a line under it per theme sent (its issue link) or dropped. The log keeps everything before it: next time starts from here.
