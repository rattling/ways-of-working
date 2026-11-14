---
name: handover
description: Before /clear, write down where the work stands while this session still remembers it, so the next session picks up from the repo instead of the conversation. Writes a short handover note to .ways/handover.md (replaced each time; the next session reads it on start) and appends a note on how the session went to ~/.ways/sessions.md. The person types /clear afterwards.
disable-model-invocation: true
---

# Hand over before /clear

A shift change, not losing a colleague. Losing the session should cost nothing as long as the repo says where things stand. What usually isn't written down is what the conversation holds: the decisions, the dead ends, the thing you were about to try. This writes it down, in two short notes, then the person types `/clear` themselves (nothing can type it for them).

Only in a repo set up with ways: if `.claude/ways.json` isn't there, say this repo isn't set up with ways and stop.

Two notes, nothing else. No transcript, no summary of the whole session, no issue comments or other files.

## 1. The handover note: `.ways/handover.md`

Look first, so the note says what's true now and not what you remember: `git status`, `git log --oneline -10`, the branch, and the issue and PR you were on, if any.

Then **replace** `.ways/handover.md` with the note (create `.ways/` if it isn't there, with a `.gitignore` holding `*`, as the SessionStart hook does). It's local to this checkout and never committed, so each worktree has its own. The old note is gone: don't append, don't archive.

```
# Handover · 2026-11-14 16:40 · branch 84-handover @ 3f2a9c1

Working on #84, draft PR #85.

## Where it stands
## Decided, and why
## Next
## Open questions
## Watch out for
```

- **Where it stands:** what's done, what's half-done, and anything uncommitted (say which files). What the gate said last.
- **Decided, and why:** the choices made in the conversation that aren't written anywhere yet, and the dead ends: what was tried, why it didn't work, so it isn't tried again.
- **Next:** the next one or two concrete steps, as you'd do them. If something agreed belongs in the issue, an ADR or `AGENTS.md`, say so here; don't write it now.
- **Open questions:** what's waiting on the person, and what you'd recommend.
- **Watch out for:** what would trip up someone starting cold: a flaky test, a service to start by hand, a file that looks wrong and isn't.

Short: a few lines per section, and leave out any section with nothing in it. Point to what's already in the repo or the tracker (the issue, the PR, a commit) instead of repeating it. Write for a reader who has the repo and nothing else.

## 2. The meta note: what the session taught

How the session went: what went wrong, what was slow, which approaches worked, what to do differently next time. Each lesson goes where it will be used, so sort them first:

- **About this repo** (a gate that needs a service started by hand, a doc that was wrong): a `[repo]` line in `.ways/feedback.md`, as `${CLAUDE_PLUGIN_ROOT}/reference/FEEDBACK.md` says. It becomes an issue or a rule in `AGENTS.md`, and every later session here benefits.
- **About ways** (a step that was heavy, missing or broken): a `[ways]` line in the same file, for the ways log and `/ways:feedback`.
- **About how the work went** (scoped too loosely, should have checked the tests first, an approach worth repeating): this is the meta note. It's the person's own, not the repo's or the plugin's, and nothing in ways reads it.

The person's lessons go in `~/.ways/sessions.md`. It builds up across sessions and repos, so **append**; create the folder and file if they aren't there.

```
## 2026-11-14 16:40 · ways-of-working · 84-handover
- Slow: three rounds on the hook's output format before checking what the other bullets look like.
- Worked: writing the test cases first made the opt-in edge obvious.
- Next time: read the existing test file before designing the change.
```

A few bullets, honest, about the work rather than the code. Nothing that names a client, a person or a secret beyond what the repo's own name says.

If the person's own instructions (their CLAUDE.md, say) name somewhere else for notes on how sessions went, a journal, write it there instead, or as well if they say so. If no lesson is about how the work went, write nothing here.

## 3. Hand back

Show the handover note as written, so the person can correct it, and say in one line where the meta note went. Then:

> Type `/clear` when you're ready. The next session reads `.ways/handover.md` before anything else.
