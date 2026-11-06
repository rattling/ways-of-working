
## Where issues live: GitHub

Issues are this repo's GitHub issues, worked with `gh` as the conventions at the top of this file say. An ID is the issue number, `#12`.

| Operation | Here |
|---|---|
| **Read an issue** | `gh issue view <n> --comments`. A parent's tickets are its sub-issues. |
| **Comment on it** | `gh issue comment <n>`. |
| **Set its state** | Its one state label: a triage role or `needs-human`. Done is closed. |
| **Create an issue** | `gh issue create`. A ticket is a sub-issue of the parent, its blockers GitHub's issue dependencies. |
| **List open issues** | `gh issue list --state open --label <state>`, or the parent's open sub-issues. |
| **Claim it** | Assign yourself (`gh issue edit <n> --add-assignee @me`). Assigned to someone else means taken. |
| **Close it through a PR** | `Closes #<n>` in the PR body. GitHub closes it when the PR merges into `main`, so a ticket merged into an integration branch closes with the integration PR. |
