# The flow commands

Where work goes:

| The work | Command |
|---|---|
| New and unsorted, or a pile of it | `/triage` (optional: the commands below size an untriaged issue themselves) |
| Problem not understood | `/ways:discover`, then `/ways:plan` |
| Known to be big | `/ways:plan #n`, then `/ways:build #n` |
| Known to be small | `/ways:work #n` (one issue, or several) |

Big work is two commands, with discovery before them when it's needed:

| Command | What it does | Ends in | The person merges |
|---|---|---|---|
| `/ways:discover` (optional, separate: its input can take days) | Works out what the problem is | A brief in `specs/brief/<slug>/` and an intake issue | The discovery PR: the brief agreed |
| `/ways:plan #n` | Requirements, a mock if the result is visual, then design, in one sitting | The PRD, what and how, and one spec PR | The spec PR: what it should do and how the system changes, agreed together |
| `/ways:build #n` | Tickets, then the code | One integration PR | The integration PR: the feature shipped |

`/ways:plan` is `/ways:requirements` then `/ways:design` in one session. Those two stay as commands of their own for when different people do the halves (a product person grills, an engineer designs): the PRD file between them is the hand-off.

Pocock's skills run underneath (`grilling`, `domain-modeling`, `to-spec`, `to-tickets`, `implement-spec`, `code-review`, `triage`) and can still be typed on their own. These commands call them; they don't copy them.

Every flow command follows the three rules below.

## 1. Look for the output before starting

Before doing anything, check whether this command's output is already there, and say so rather than redo it:

| Command | Its output |
|---|---|
| `/ways:discover` | `specs/brief/<slug>/README.md`, or an open `discovery/` PR |
| `/ways:plan`, `/ways:requirements` | A `Spec:` line on the issue, or `specs/prd/<feature-slug>.md` |
| `/ways:design` | The PRD's Implementation Decisions filled, or "Design: no change of shape" |
| `/ways:build` | Sub-issues under the parent, an `integration/<feature-slug>` branch, or a draft integration PR |

If it's there, say what's there and offer to revise it, or say what's next. Only `/ways:build` resumes work part-done, because its state lives in GitHub (the tickets, the integration branch, the draft PR's checklist). The others run in one sitting: don't clear the session during a plan.

## 2. Open with where you are

The first line says the command, the feature and its issue, and what's done:

> Planning the allergen chart (#12). Discovery is done: `specs/brief/allergen-chart/README.md`.

Then write the same to `.claude/ways/part` as one line, `<feature> · <command>` (for example `allergen chart · plan`, or `allergen chart · build`), so the `ways-band` mod can show it and the SessionStart hook can name it after a compaction. Delete the file when the command hands over.

## 3. End with one merge sentence, then the next command

The last thing said is one plain sentence about what to merge and what merging means, then the next command:

> To agree the spec, merge PR #14: that's what it should do and how the system changes. Next: `/ways:build #12`.

Ask for no other merges: the command's own PR is the only one a person merges, and tickets merge into the integration branch without anyone being asked. When a command ends with nothing to merge (`/ways:requirements` alone), say so in the same sentence and name the next command.
