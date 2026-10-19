
## This repo's conventions (ways)

These override the defaults above where they differ.

### When a skill says "publish a spec" (for example `/to-spec`)

A spec is a PRD, and it lives in the repo, not in an issue.

1. Write it to `specs/prd/<feature-slug>.md` on a branch `spec/<feature-slug>`.
2. Put a line at the top: `**Tracking:** #<n> · **Status:** draft · **Owner:** <person>`.
3. Add two sections if the template lacks them: **Must not exist yet** (things a builder might reasonably add that we don't want now) and **Human verification** (how someone who didn't build it confirms it).
4. The parent issue. **If an issue already asks for this work** (the request that was triaged or grilled, or one the person names), it becomes the parent: add a short summary and `Spec: specs/prd/<feature-slug>.md` at the top of its body, keeping the original request below. Don't create a second issue. Only when no issue asks for it, create the parent with the summary and the `Spec:` line. Either way, fill in its number on the Tracking line.
5. Open a PR titled `spec: <feature>` with `Refs #<n>`. A person merges it; that is the spec being agreed.

A feature needs a PRD only if it needs more than one ticket or changes an invariant or a contract between systems. Otherwise the issue is the spec.

### When a skill says "fetch the spec"

Read the parent issue, follow its `Spec:` line, and read the file.

### When implementing a whole spec (`/implement-spec`)

**One ticket at a time**, in the order the blocking edges allow: one implementer at a time, merged to the integration branch before the next starts. Go parallel only when the person asks for it in this session. Parallel implementers each run the gate, so each brings up its own containers and database, and the run is harder to follow and costs more.

**A model per ticket.** You, the lead, stay on the session's model. Give each implementer the cheapest model that will get it right, and say which and why in one line:

- **Sonnet** for a slice that's fully specified, follows a pattern the code already has, and isn't on a high-risk path.
- **Opus** for the rules that must never be wrong (the charter's invariants), a high-risk path in `REVIEW.md` or `CODEOWNERS`, a contract other systems read, or a ticket that leaves judgement calls.
- The code review and its fixes stay on the session's model.

**What the run cost, in the integration PR.** People need to know whether a spec is a sensible size for their usage. The plan's usage windows are in `.claude/ways/usage` (five-hour and weekly, as percentages, written by the `ways-band` mod). If the file isn't there, ask the person to run `/usage` and tell you the two figures.

- **At the start**, in the draft PR body: the usage windows now, and a rough estimate (the number of tickets, and what one ticket has cost so far in this repo, if a previous run says).
- **As each ticket merges**, a row in the PR body: the ticket, the model, the agent's time, tokens and tool calls (from its completion notice), and both usage windows at that point.
- **At the end**, the PR's evidence section: that table, a row for the review and fixes, the totals, how far each window moved, and the wall-clock time from start to ready for review.

### When a skill says "resolve a ticket the way the tracker closes work"

Work closes through a PR, never by closing the issue directly.

- One ticket, one branch, one PR: `<type>/<issue>-<slug>`, where type is `feature`, `fix`, `chore` or `docs`.
- The PR body has `Closes #<n>` and a `## How to check` section (the `pr-hygiene` check fails without both), plus what the `pr` skill asks for.
- Merging follows the **Merging** section of `AGENTS.md`.

### Briefs

An agent brief also has a **Human verification** line: how someone who didn't build it confirms it.

### Sizing, when triaging

Say which path an issue takes, using the table in `AGENTS.md` under **How work goes**:

- **One ticket** (fits one PR, changes no invariant or contract): brief it as usual. It's worked with `/ways:work`.
- **Big work** (more than one ticket, or it changes an invariant or a contract): don't brief it as a ticket. Label it `ready-for-human`, and say in the comment that it needs the three parts, starting with `/grill-with-docs`.

### Labels beyond the triage roles

- `needs-human`: a run is waiting on a decision, an acceptance or information only a person has.
- `no-issue`: a PR deliberately has no issue behind it (skips `pr-hygiene`).
