# The four part commands

Big work goes in four parts, one command each. One ticket stays `/ways:work`.

| Part | Command | Ends in | The person merges |
|---|---|---|---|
| 1 of 4, discovery (only when the problem isn't understood) | `/ways:discover` | A brief in `specs/brief/<slug>/` and an intake issue | The discovery PR: that's the brief agreed |
| 2 of 4, requirements | `/ways:requirements [#issue]` | The PRD's what, on the spec branch | Nothing yet: the spec PR stays open for design |
| 3 of 4, design | `/ways:design [#parent]` | The PRD's how, on the same branch | The spec PR: requirements and design agreed together |
| 4 of 4, build | `/ways:build [#parent]` | Tickets, then the code on one integration branch | The integration PR: that's the feature shipped |

Pocock's skills run underneath (`grilling`, `domain-modeling`, `to-spec`, `to-tickets`, `implement-spec`, `code-review`) and can still be typed on their own. The part commands call them; they don't copy them.

Every part command follows the three rules below.

## 1. Check state before suggesting anything

Before the first message, find where this piece of work is, so you never suggest a step that's already done. Read:

- **The issue** (the argument, or the one the conversation is about): its labels, comments, sub-issues, and its `Brief:` and `Spec:` lines.
- **The files:** `specs/brief/<slug>/README.md`, `specs/prd/<feature-slug>.md` and its Status line.
- **Git and GitHub:** `gh pr list --state all --search "<n> in:body"`, and the `discovery/`, `spec/` and `integration/` branches for this work, local and remote.

From those, the part this work is in:

| What's there | Where it is |
|---|---|
| An open `discovery/` PR | Discovery done, waiting for its merge |
| A `Brief:` line, no `Spec:` line | Ready for requirements |
| A `Spec:` line, the PRD has no Implementation Decisions yet | Requirements done, design next |
| The PRD's design sections filled (or "Design: no change of shape"), spec PR open | Waiting for the spec PR to be merged |
| Spec PR merged, no sub-issues | Ready for build: tickets first |
| Sub-issues, no `integration/` branch | Ready for build: tickets cut |
| An `integration/` branch or draft integration PR | Build under way: resume it |

If the command typed is for a part that's already done, say so and say what's next instead. If it's for a part whose earlier one isn't done, say which comes first and offer to run it. Don't run it unasked.

## 2. Open with where you are

The first line says the part, the feature and its issue, and what's done:

> Part 3 of 4, design, for the allergen chart (#12). Requirements are done: `specs/prd/allergen-chart.md`.

Then write the same to `.claude/ways/part` as one line, `<feature> · part <n> of 4 · <part>` (for example `allergen chart · part 3 of 4 · design`), so the `ways-band` mod can show it. Delete the file when the build hands over.

## 3. End with one merge sentence, then the next command

The last thing said is one plain sentence about what to merge and what merging means, then the next command:

> To agree the spec, merge PR #14: that's the requirements and the design together. Next: `/ways:build #12`.

When nothing is to be merged yet, say so: "The spec PR (#14) stays open: `/ways:design` adds to it, and you merge it after. Next: `/ways:design #12`." Ask for no other merges: the part's own PR is the only one a person merges, and tickets merge into the integration branch without anyone being asked.

Each part can start in a fresh session, because everything it needs is in the repo and the issue. Clear the session between parts, never within one: a part's decisions live in the conversation until its file is written.
