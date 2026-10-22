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
| `specs/brief/` | The discovery behind big work: what the problem is, and why this scope |
| `specs/prd/` | The spec an issue points to |
| `docs/ARCHITECTURE.md`, then `docs/adr/` | A change that crosses a part's boundary or a contract |
| `GLOSSARY.md` | Naming things: use its terms |
| `CODING_STANDARDS.md`, then `docs/standards/` | Writing or reviewing code: this repo's rules, then the shared standards and what checks each |

<Add the two or three files worth knowing before touching code, with when.>

## Gate

`<command>`: the same command CI runs, and the one in `.claude/ways.json`.

## How work goes

<!-- Owned by the ways plugin: /ways:setup replaces this section on every run. Change the flow in the plugin, not here; put repo-specific rules under "Rules for this repo". -->

Pick the path by the size of the work. A person types each command; when a step finishes, say which command comes next.

| The work | Path |
|---|---|
| The problem isn't understood yet: a wish list of solutions, an idea, a half-built app nobody's sure about | `/ways:discover` first, quick or deep. It ends in a brief in `specs/brief/` and an intake issue for `/triage` |
| New and not sized yet: a report, a request, an idea | `/triage`. It briefs it as one ticket, or says it's big work |
| Typo-sized | Just do it: a PR labelled `no-issue` |
| One ticket: a bug, a small enhancement | `/ways:work <issue>` |
| **Big work:** more than one ticket, or it changes an invariant or a contract | One command per part, each typed by a person:<br>**2 Requirements:** `/ways:requirements #<n>`: the PRD's what and why, from the discovery brief if there is one, with a mock if the result is visual<br>**3 Design:** `/ways:design #<n>`: the PRD's how. The person merges the spec PR: requirements and design agreed together<br>**4 Build:** `/ways:build #<n>`: tickets, then the code on one integration branch. The person merges the integration PR |

Discovery is part 1 when it runs. Each part command says where you are when it starts, and ends with the one PR to merge, what merging means, and the next command. Pocock's skills run underneath (`grilling`, `domain-modeling`, `to-spec`, `to-tickets`, `implement-spec`, `code-review`) and can still be typed on their own.

Skips, and only these:

- **Requirements already written and agreed** (a brief someone wrote): `/ways:requirements` skips the grill and writes the PRD from them.
- **Big work that stays inside one part and touches no contract, schema or data store:** `/ways:design` says so and writes "Design: no change of shape" into the PRD.
- Nothing else is skipped. If a step feels unnecessary, the work is probably one ticket, not big work.

Also: `/ways:explain` before working in code you don't know; `/ways:arch-review` at the start of a repo, before a big change, and every so often.

## Working an issue

Use `/ways:work <issue>`. It runs interactively for `ready-for-human` and autonomously for `ready-for-agent`. For a whole spec at once, `/ways:build #<parent>`: it sets the autonomous marker itself so the gate holds, and builds one ticket at a time unless you ask for parallel (`docs/agents/issue-tracker.md` says why).

## Merging

**Dial:** learning <!-- learning | default | trusted: see the plugin's REVIEW-AND-MERGE reference. The engineering lead moves it. -->

- **Learning:** a person reviews every PR before it merges.
- High-risk paths are in `.github/CODEOWNERS` and need a code owner's approval whatever the dial says.

## Rules for this repo

<Only facts an agent can't infer: environment quirks, commands, invariants and the tests that prove them, things that must not be touched.>
