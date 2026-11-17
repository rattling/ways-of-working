# Review guidance

Read at review time, not while building. Judgement calls that a check can't make; anything mechanical belongs in the gate instead.

## High-risk areas

Changes touching these are high risk: a senior approval, a rollback plan, and `/security-review` before the PR.

- Authentication and permissions
- Data migrations
- CI and deploy workflows
- <data where an error causes harm (safety, health, money), if this repo has any>
- <areas specific to this repo>

## Every PR

- **Dependencies added** names each new direct dependency with a reason, and the lockfile diff agrees with it. One that isn't named is a finding (`docs/standards/security.md`, "The supply chain").

## What we care about here

<Repo-specific judgement calls, one line each. Added when a review or an incident teaches something a check can't catch.>
