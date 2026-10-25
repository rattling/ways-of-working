
## This repo's conventions (ways)

These override the defaults above where they differ.

### When a skill says "publish a spec" (for example `/to-spec`)

A spec is a PRD, and it lives in the repo, not in an issue.

1. Write it to `specs/prd/<feature-slug>.md` on a branch `spec/<feature-slug>`.
2. Put a line at the top: `**Tracking:** #<n> · **Status:** draft · **Owner:** <person>`.
3. Add two sections if the template lacks them: **Must not exist yet** (things a builder might reasonably add that we don't want now) and **Human verification** (how someone who didn't build it confirms it).
4. The parent issue. **If an issue already asks for this work** (the request that was triaged or grilled, or one the person names), it becomes the parent: add a short summary and `Spec: specs/prd/<feature-slug>.md` at the top of its body, keeping the original request below. Don't create a second issue. Only when no issue asks for it, create the parent with the summary and the `Spec:` line. Either way, fill in its number on the Tracking line.
5. **The parent keeps one state label.** Don't apply `ready-for-agent` to it (where `/to-spec` says to): it keeps triage's `ready-for-human` until it's built. The tickets cut from it are what's `ready-for-agent`.
6. Open a **draft** PR titled `spec: <feature>` with `Refs #<n>`. The design goes onto the same branch, and whoever finishes the design (`/ways:plan` or `/ways:design`) marks it ready. A person merges it once, and that is the spec, what and how, being agreed.

### When a skill says "publish the tickets" (`/to-tickets`)

Each ticket is a sub-issue of the parent, labelled `ready-for-agent`, as `/to-tickets` says. Add a **Human verification** section to each, after its acceptance criteria: how someone who didn't build it confirms it, from the PRD's Human verification, or "matches the mock" with what to compare. `/ways:work` won't build a ticket autonomously without it. If the PRD's design chose a new look, or says the app has no shared look yet, the first ticket builds the theme (and the styled shell, if there's none), and the screen tickets are blocked by it. If it keeps the app's current look, there's no such ticket.

A feature needs a PRD only if it needs more than one ticket or changes an invariant or a contract between systems. Otherwise the issue is the spec.

### When a skill says "fetch the spec"

Read the parent issue, follow its `Spec:` line, and read the file.

### When implementing a whole spec (`/implement-spec`)

`/ways:build` runs this, and writes the marker first. The integration branch is `integration/<feature-slug>`, so a re-run can find it and resume. The code review is Pocock's `code-review`: call it as `mattpocock-skills:code-review`, not Claude Code's built-in skill of the same name.

**One ticket at a time**, in the order the blocking edges allow: one implementer at a time, merged to the integration branch before the next starts. Go parallel only when the person chooses it: `/ways:build` offers it at the ticket approval, naming the independent tickets and what parallel costs. Parallel implementers each run the gate, so each brings up its own containers and database, and the run is harder to follow and costs more.

**A model per ticket.** You, the lead, stay on the session's model. Give each implementer the cheapest model that will get it right, and say which and why in one line:

- **Sonnet** for a slice that's fully specified, follows a pattern the code already has, and isn't on a high-risk path.
- **Opus** for the rules that must never be wrong (the charter's invariants), a high-risk path in `REVIEW.md` or `CODEOWNERS`, a contract other systems read, or a ticket that leaves judgement calls.
- The code review and its fixes stay on the session's model.

**Screenshots of visual changes.** Each implementer attaches headless-browser screenshots of what it changed on screen, each beside the matching mock screen, to its PR's evidence. It compares layout and content with the mock, and the look with the one the PRD chose, which may be the app's own rather than the mock's, and says where they differ. The integration PR collects them. A screenshot alone proves the page renders, not that it looks right. For printed work a headless PDF isn't enough: the human verification names the real browser's print dialog.

**Containers.** Each implementer passes its worktree's own values (its ports, its project name) as environment variables on each command, from the first command: `.env` files are closed to agents (the repo's settings deny them, to keep secrets out), so don't try to read or write `.env.local`. It runs the stack under its worktree's own Compose project and, if it publishes ports, on a port other than the default (`docs/standards/delivery.md`). It stops the containers it started (and any dev server or watcher) before reporting done. After each merge, check with `docker ps` that none of that worktree's are still running, and stop any that are: left running, they hold memory and their ports (8080, say) and block the next ticket.

**Progress, without being asked.** The draft PR's body opens with a checklist of the tickets in build order, plus the code review, and you tick each one as it merges. Every update you post starts with "N of M done", saying what's building and what's next. After each merge, write `<done> <total>` to `.claude/ways/progress` (for example `2 9`), and the band shows it. Delete the file at handover, with the marker.

**What the run cost, in the integration PR.** People need to know whether a spec is a sensible size for their usage. Read the plan's usage windows (five-hour and weekly, as percentages) with the `ways-band` mod's tool, `mcp__ways-band__usage`: it answers for this session's own account. Don't read `.claude/ways/usage`: older versions of the mod wrote it from every session in the repo, so it can hold another session's numbers. If the tool isn't there, ask the person to run `/usage` and tell you the two figures.

- **At the start**, in the draft PR body: the usage windows now, and a rough estimate (the number of tickets, and what one ticket has cost so far in this repo, if a previous run says).
- **As each ticket merges**, a row in the PR body: the ticket, the model, the agent's time, tokens and tool calls (from its completion notice), and both usage windows at that point.
- **At the end**, the PR's evidence section: that table, a row for the review and fixes, the totals, how far each window moved, and the wall-clock time from start to ready for review.

### When a skill says "resolve a ticket the way the tracker closes work"

Work closes through a PR, never by closing the issue directly.

- One ticket, one branch, one PR: `<type>/<issue>-<slug>`, where type is `feature`, `fix`, `chore` or `docs`.
- The PR body has `Closes #<n>` and a `## How to check` section (the `pr-hygiene` check fails without both), plus what the `pr` skill asks for.
- Merging follows the **Merging** section of `AGENTS.md`.

### Briefs

An agent brief also has a **Human verification** line: how someone who didn't build it confirms it. For visual work, say what to look at, not just "the page renders". For printed work, name the real browser's print dialog, not a headless PDF: for example, "Chrome, Ctrl+P, A3 landscape, mono, 1 page". Or "matches `specs/prd/<slug>-mock.html`: same columns, same empty state".

### Sizing, when triaging

Triage is optional: `/ways:plan`, `/ways:requirements` and `/ways:work` size an untriaged issue themselves, by these same rules. `/triage` is for new and unsorted work, or a pile of it. Say which path an issue takes, using the table in `AGENTS.md` under **How work goes**:

- **The problem isn't understood yet** (the ask is a list of solutions, or nobody can say who it's for or how we'd know it worked): don't size it. Label it `needs-info`, and say in the comment that it needs `/ways:discover` first, then `/ways:plan`.
- **One ticket** (fits one PR, changes no invariant or contract): brief it as usual. It's worked with `/ways:work #<n>`.
- **One ticket in disguise:** if every part of big work except the build would be skipped (no real requirements question, nothing to design), it's one ticket. Brief it as one, or say what's missing; often it's the real-world problem the work is meant to fix.
- **Big work** (more than one ticket, or it changes an invariant or a contract): don't brief it as a ticket. Label it `ready-for-human`, and say in the comment that it's big work and next is `/ways:plan #<n>`, then `/ways:build #<n>`. An intake from `/ways:discover` has a `Brief:` line: read the brief and size from it, and the plan starts from it.

### Labels beyond the triage roles

- `needs-human`: a run is waiting on a decision, an acceptance or information only a person has.
- `no-issue`: a PR deliberately has no issue behind it (skips `pr-hygiene`).
