<!-- ways-of-working: v1 -->

## How work is tracked

Work for this repo lives in **GitHub Issues**. Issues own what is being done and where it
stands. The repo owns the code. Neither restates the other.

Keeping the tracker true is your job, not the human's. You're doing the work, so you update it
as you go. Nobody hand-updates it afterwards.

### Rehydrate

Starting cold, the current state is in the issues, not your memory.

- `gh issue list --state open` for the board, `gh issue view <n> --comments` for the history
- `docs/CHARTER.md` for purpose and scope, `arch/` for shape and decisions
- _<repo owner: add the two or three files worth reading first>_

### The spine

- **Real work has an issue.** Before building anything of consequence, make sure one exists
  (`gh issue create`, or find it). Trivial and exploratory work doesn't need one.

- **Break it down before you build.** Fill the issue's task list first. It is the to-do list:
  one item per meaningful piece, plus a plain acceptance item. Don't write code against an
  empty issue.

- **Agreed scope goes somewhere tracked.** If you're about to write "we can do that later",
  either add the task-list item or open a separate issue. Open a separate issue when the work
  is large or a distinct concern. Separate tracked issues are fine; lost scope isn't.

- **Big chunks get their own PR.** Several reviewable diffs beat one large one. The task list
  is the running order.

- **Move and tick as you go.** Starting means the `in-progress` label. Tick each item when it's
  actually done, not in a batch at the end. If this session ended right now, a fresh agent
  should be able to read the issue and know what's done and what's next.

- **Link the PR to the issue.** `Closes #<n>` in the PR body, or `Refs #<n>` if it only partly
  satisfies it. GitHub tracks merge state itself, so you don't have to report it.

- **Close honestly.** On merge: tick anything outstanding, post the session report as a
  comment, close the issue. An issue isn't done because the code exists. It's done when the PR
  is merged, the list is ticked and the report is posted.

### Anything needing a human

Label it **`needs-human`** and say what you need in five lines or fewer, with the one command
to run. The detail goes in a comment. The label is what makes it findable.

These get cleared in one sitting across every repo:

```
https://github.com/issues?q=is:open+label:needs-human
```

A label works across repos in a way a paragraph in a session report does not.

### Labels

`in-progress` · `blocked` · `needs-human` · `p1` `p2` `p3`

Ready to pick up means open and not `blocked`. Use milestones when there's a dated outcome,
skip them when there isn't.

### Gitflow

One issue, one unit of work. `main` → `feature/<slug>` → PR → squash-merge.

Gate before opening the PR: `<make check, replace with this repo's gate>`.

_<repo owner: say whether an agent may merge its own PR once the gate is green, and the
tag/release policy.>_

### Engineering standards

Clear contracts at module boundaries. Small cohesive modules, and a file past ~500 lines is a
smell. Explicit over clever. Tests for behaviour, not implementation.

These are the cross-repo defaults. Tighten or replace them in this repo's own rules below;
anything language- or platform-specific belongs there rather than here.

### Structural changes get a second reader

A change to a public contract, a data model or a core formulation gets read by something that
didn't write it before merging. A habit, not a gate. If you're unsure whether a change
qualifies, it qualifies.

_<repo owner: name the command that does this for the tool you use.>_
