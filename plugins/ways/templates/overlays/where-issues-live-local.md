
## Where issues live: local markdown

Issues are markdown files under `.scratch/`, committed with the code. These rules override the conventions at the top of this file where they differ.

**Every issue is a folder.** Standalone work (a bug, a small enhancement) is `.scratch/<slug>/issue.md`, and its ID is the folder name: `login-timeout`. Big work's request is the same kind of file, and becomes the parent when it's planned. Its tickets are `.scratch/<slug>/issues/NN-<slug>.md`, numbered from `01`, and a ticket's ID is `<slug>/<NN>`: `billing/03`. The spec stays in `specs/prd/`, never in `.scratch/<slug>/spec.md`. The parent's `Spec:` line goes at the top of its `issue.md`.

| Operation | Here |
|---|---|
| **Read an issue** | Read its file. A parent's tickets are the files in its `issues/` folder. |
| **Comment on it** | Append under `## Comments` at the bottom of the file, starting with the date: the plan, the brief, a question left for a person. |
| **Set its state** | The `Status:` line near the top: a triage role, `needs-human`, or `done`, one at a time. The category (`bug`, `enhancement`) is the brief's `Category:` line. |
| **Create an issue** | Write the file, with `Status:` near the top. A ticket's blockers go on a `Blocked by: 01, 02` line. |
| **List open issues** | The `Status:` lines under `.scratch/`, in the checkout the command runs in. A parent's frontier is its tickets not `done` whose blockers are all `done`. |
| **Claim it** | Cut its branch. A branch carrying its ID (`git branch -a --list "*/billing-03-*"`) means someone has it. |
| **Close it through a PR** | The PR sets `Status: done` in the file and says `Closes <id>`. It's closed when that reaches `main`. |

**Nothing writes to `main`.** A change to an issue file (a state, a comment, a new ticket) is committed on the work's branch and reaches `main` when its PR merges. One made before the branch exists, such as sizing or the plan comment, is carried onto it when it's cut. One made with no work to carry it, such as a `/triage` pass or a note for the repo, goes in a small PR of its own. Until then, a session on `main` sees the old state.

**A build** cuts its tickets onto the integration branch: the ticket step creates `integration/<slug>` from `main` and commits the ticket files there, even when it stops for the tickets to be checked. A resumed build reads them there, and keeps their states there: each ticket's PR sets its `Status: done` there, and a resumed build reads them there. The integration PR carries them to `main`.

**Ticket numbers** come only from `/ways:build`'s ticket step. If two branches add the same number anyway, the second to merge renumbers its ticket.
