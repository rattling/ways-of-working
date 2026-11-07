
## Where issues live: other

**The tracker:** <the person's description: its name (Linear, Jira), the project or team, how Claude reaches it (the CLI or connector, already signed in), and how an ID is written, such as `ENG-123`.>

**Reached at setup:** <yes, on <date>, by reading a few open issues | no: <what failed>>

Map each operation onto the tracker described above, and follow it whenever a convention or a command names one. Where the tracker has no direct match, do the nearest thing and say what you did.

| Operation | Here |
|---|---|
| **Read an issue** | The issue, its comments, and its child issues. |
| **Comment on it** | A comment on the issue. |
| **Set its state** | The tracker's status or label nearest the role (`needs-triage`, `ready-for-agent`, `needs-human`, done). |
| **Create an issue** | A new issue. A ticket is a child of the parent (a sub-issue, or a link), with its blockers as the tracker records them. |
| **List open issues** | The tracker's search, by status or label, or the parent's open children. |
| **Claim it** | Assign yourself. |
| **Close it through a PR** | `Closes <id>` in the PR body. If the tracker doesn't close it when the PR merges into `main`, set its state to done once it has merged. |
