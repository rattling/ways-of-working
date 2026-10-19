# Review and merge

## Layers

1. **Before the PR:** the gate is green and Pocock's `code-review` has run: standards and spec, in fresh-context subagents.
2. **On the PR:** CI runs the gate. It is the required check.
3. **People:** approval scaled to risk.

An agent's approval never counts as a person's.

## Risk tiers

By type of change, not by who wrote it. Each repo lists its high-risk areas in `REVIEW.md` and its owners in `.github/CODEOWNERS`.

| Tier | Typical changes | People |
|---|---|---|
| Low | Docs, tests, internal tooling, isolated fixes | None once CI is green |
| Medium | Ordinary product changes | The person who ran the agent reviews it. Their own PR is fine |
| High | Authentication, permissions, payments, data migrations, CI and deploy workflows, anything in `REVIEW.md`'s high list | A second person, a code owner, approves. Plus a rollback plan, and `/security-review` run before the PR |

- **The agent's judgement can raise a tier, never lower it.** When the builder and the reviewer disagree, the higher tier wins.
- **High is enforced by GitHub, not by the agent.** `CODEOWNERS` covers the high-risk paths, and a branch rule requires a code owner's approval when they change. Everything else is the person's and the agent's judgement.
- **A second person is for what matters.** Requiring one on every PR builds a queue and teaches people to rubber-stamp.

## Calibrating

The engineering lead sets the dial per repo, in the **Merging** section of `AGENTS.md`, and moves it as trust builds:

1. **Learning:** every PR is reviewed by a person before merging, whatever its tier. Use this while a team is new to the method.
2. **Default:** low merges itself once CI is green; medium waits for the person who ran it; high waits for a code owner.
3. **Trusted:** as default, and medium merges itself too where the repo's track record supports it.

A revert or an incident in an area moves that area up a tier, and can move the repo back a step.

## Findings

- Every finding gets an answer: **fixed**, or **not a problem because…**. Verify a finding before acting on it.
- At most three review rounds. After the first, re-review only the new diff.
- Flag a class of bug once, not every instance.

## Branching

- One short-lived branch per issue off `main`, named `<type>/<issue>-<slug>`. One PR, squash-merged, branch deleted. Hours to a couple of days.
- No long-lived per-person branches. No stacked PRs.
- Multi-slice autonomous runs: low risk, merge each slice to `main` as its gate goes green and branch the next from the updated `main`. Medium or high risk: one short-lived integration branch per feature (`/implement-spec`), refreshed from `main` as it goes.
- **Merges into an integration branch are the agent's.** Each slice merges once its gate is green, with no person involved. The review and the people's approval happen once, on the integration PR to `main`, after `code-review` has run over the whole branch.
- **Integration PRs are not squashed.** They keep one commit per slice, so the PR can be reviewed slice by slice and a slice can be reverted alone. Sub-issues close when it lands on `main`.
- An unfinished slice can merge behind a feature flag (off) instead of waiting on an integration branch.

## When something goes wrong

A revert or an incident adds a regression test. If the lesson is a judgement call rather than something a check can catch, it becomes a line in `CODING_STANDARDS.md` (how code is written) or `REVIEW.md` (what's risky here).
