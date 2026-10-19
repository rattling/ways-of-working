
## This repo's conventions (ways)

These override the defaults above where they differ.

### When a skill says "publish a spec" (for example `/to-spec`)

A spec is a PRD, and it lives in the repo, not in an issue.

1. Write it to `specs/prd/<feature-slug>.md` on a branch `spec/<feature-slug>`.
2. Put a line at the top: `**Tracking:** #<n> · **Status:** draft · **Owner:** <person>`.
3. Add two sections if the template lacks them: **Must not exist yet** (things a builder might reasonably add that we don't want now) and **Human verification** (how someone who didn't build it confirms it).
4. Create the parent issue with a short summary and `Spec: specs/prd/<feature-slug>.md`, then fill in its number on the Tracking line.
5. Open a PR titled `spec: <feature>` with `Refs #<n>`. A person merges it; that is the spec being agreed.

A feature needs a PRD only if it needs more than one ticket or changes an invariant or a contract between systems. Otherwise the issue is the spec.

### When a skill says "fetch the spec"

Read the parent issue, follow its `Spec:` line, and read the file.

### When a skill says "resolve a ticket the way the tracker closes work"

Work closes through a PR, never by closing the issue directly.

- One ticket, one branch, one PR: `<type>/<issue>-<slug>`, where type is `feature`, `fix`, `chore` or `docs`.
- The PR body has `Closes #<n>` and a `## How to check` section (the `pr-hygiene` check fails without both), plus what the `pr` skill asks for.
- Merging follows the **Merging** section of `AGENTS.md`.

### Briefs

An agent brief also has a **Human verification** line: how someone who didn't build it confirms it.

### Labels beyond the triage roles

- `needs-human`: a run is waiting on a decision, an acceptance or information only a person has.
- `no-issue`: a PR deliberately has no issue behind it (skips `pr-hygiene`).
