# <Project>

<One paragraph: what this repo is and what it's part of.>

This repo uses Matt Pocock's skills with the `ways` plugin on top. The `## Agent skills` section below says where issues, labels and domain docs live; `docs/agents/issue-tracker.md` has this repo's conventions for specs, PRs and closing work.

## Where things are

This file is the only one read every time. Open the rest when the work needs them:

| | When |
|---|---|
| `README.md` | How to run it |
| `specs/operating-context.md` | Choosing or planning work: what matters this phase |
| `specs/charter.md` | Anything that touches scope or an invariant |
| `specs/prd/` | The spec an issue points to |
| `docs/ARCHITECTURE.md`, then `docs/adr/` | A change that crosses a part's boundary or a contract |
| `GLOSSARY.md` | Naming things: use its terms |
| `CODING_STANDARDS.md`, then `docs/standards/` | Writing or reviewing code: this repo's rules, then the shared standards and what checks each |

<Add the two or three files worth knowing before touching code, with when.>

## Gate

`<command>`: the same command CI runs, and the one in `.claude/ways.json`.

## How work goes

Pick the path by the size of the work. A person types each command; when a step finishes, say which command comes next.

| The work | Path |
|---|---|
| New and not sized yet: a report, a request, an idea | `/triage`. It briefs it as one ticket, or says it's big work |
| Typo-sized | Just do it: a PR labelled `no-issue` |
| One ticket: a bug, a small enhancement | `/ways:work <issue>` |
| **Big work:** more than one ticket, or it changes an invariant or a contract | **1 Requirements:** `/grill-with-docs` → `/to-spec` (the PRD)<br>**2 Design:** `/ways:design` (parts, contracts, data, seams, NFRs)<br>**3 Build:** `/to-tickets` → `/implement-spec` |

Skips, and only these:

- **Requirements already written and agreed** (a brief someone wrote): skip the grill. Share the brief, then `/to-spec`.
- **Big work that stays inside one part and touches no contract, schema or data store:** skip `/ways:design`. `/to-spec`'s seam sketch is enough; the PRD says "Design: no change of shape".
- Nothing else is skipped. If a step feels unnecessary, the work is probably one ticket, not big work.

Also: `/ways:explain` before working in code you don't know; `/ways:arch-review` at the start of a repo, before a big change, and every so often.

## Working an issue

Use `/ways:work <issue>`. It runs interactively for `ready-for-human` and autonomously for `ready-for-agent`. For a whole spec at once, `/implement-spec`, with `.claude/ways/autonomous` created first so the gate holds.

## Merging

**Dial:** learning <!-- learning | default | trusted: see the plugin's REVIEW-AND-MERGE reference. The engineering lead moves it. -->

- **Learning:** a person reviews every PR before it merges.
- High-risk paths are in `.github/CODEOWNERS` and need a code owner's approval whatever the dial says.

## Rules for this repo

<Only facts an agent can't infer: environment quirks, commands, invariants and the tests that prove them, things that must not be touched.>
