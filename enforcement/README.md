# Enforcement

A GitHub Action that blocks a PR unless it references an issue and that issue has been broken
down, plus the label conventions the rest of these documents assume.

Worth having when the conventions start getting ignored. Don't add it on day one. Add it the
first time a PR merges with no issue behind it and nobody notices.

## Where the gate belongs

I built a delivery tool to enforce these practices, and the useful thing it taught me was that
the gate was in the wrong place.

The tool gated the card. It refused to mark work Done until the PR was merged and the checklist
ticked. That sounds strict but does very little, because the PR could merge anyway. The
tracker's opinion arrived after the only irreversible step.

Gate the merge instead. A required CI check on the PR is harder to skip than a tracker state,
works whatever agent produced the diff, and runs at the point the change becomes real.

## The layers, and what each should carry

| Layer | Carries | Why |
|---|---|---|
| **GitHub Actions** | anything load-bearing | Blocks the merge. Same for every agent and every human. |
| **Agent hooks** (Claude Code `settings.json`, equivalents elsewhere) | ergonomics: fast nudges in-session | Per-tool by definition, so a rule here is enforced on exactly the tool that least needs it |
| **The docs** | judgement, and everything that can't be mechanised | Most of it. Machines can check that a task list exists; they can't check it was a sensible breakdown |

The middle row is a trap. Hooks are easy and immediate, so it's tempting to put the real rules
there. But a rule that only fires for one tool gives you false coverage the moment someone
switches tools, and it'll be the other tool where the discipline was thinner anyway.

## What's here

[`issue-hygiene.yml`](issue-hygiene.yml) checks that a PR references an issue and that the
issue has been broken down. Copy it to `.github/workflows/` and make it a required check in
branch protection. It does nothing until you do.

It checks two things and no more. A gate that fails for six reasons gets disabled.

## Labels

The conventions the workflow and the docs both assume:

| Label | Means |
|---|---|
| `in-progress` | someone is actively on it |
| `blocked` | has an unmet dependency, so not ready to pick up |
| `needs-human` | needs a decision, an acceptance, or information only a person has |
| `p1` `p2` `p3` | coarse priority within the current focus, not a global ranking |

`needs-human` is the one that pays off straight away, because it makes a cross-repo queue
possible:

```
https://github.com/issues?q=is:open+label:needs-human
```

One page, every repo you own. That is the reason the ask is a label.

## Create the labels

```bash
gh label create in-progress  --color 0E8A16 --description "Actively being worked"
gh label create blocked      --color B60205 --description "Unmet dependency; not ready to pick up"
gh label create needs-human  --color FBCA04 --description "Needs a decision, acceptance, or info"
gh label create p1 --color 5319E7 --description "Priority within current focus"
gh label create p2 --color 8B6FE8
gh label create p3 --color C5B3F5
```
