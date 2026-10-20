---
name: explain
description: Build a visual explainer of how this repo works and how work flows through it, from what's true today. For someone new to the repo or to the method.
disable-model-invocation: true
---

# Explain this repo

Make a one-page explainer for someone new: to this repo, to the method, or both. Build it fresh from what's there now; never copy a stored explainer, because it would be stale.

Input, optional: who it's for or what they want to understand ("new PHP developer", "how a bug gets fixed here", "I'm reviewing my first agent PR"). Without one, aim at a developer joining the team this week.

## 1. Read what's true now

- `AGENTS.md`, `specs/operating-context.md`, `specs/charter.md`, `specs/roadmap.md`, `docs/ARCHITECTURE.md`, `GLOSSARY.md`, `docs/adr/` (titles), `README.md`.
- `docs/agents/issue-tracker.md`, for how this repo publishes specs and closes work.
- The merge dial in `AGENTS.md`, `REVIEW.md` and `.github/CODEOWNERS`, with `${CLAUDE_PLUGIN_ROOT}/reference/REVIEW-AND-MERGE.md` for what the tiers mean.
- Live state: `gh issue list --state open --limit 20`, `gh pr list`, open milestones, and the last ten merged PRs (`gh pr list --state merged --limit 10`).
- The code's top-level layout, only as far as the architecture needs.

Don't explain what you couldn't find. A missing file is worth one line ("no glossary yet"), not a guess.

## 2. Build the page

One page, readable in five minutes. In this order:

1. **What this is**, in two sentences from the charter.
2. **How work flows**, as a diagram: (a problem not understood yet: `/ways:discover` → a brief in `specs/brief/` and an intake issue) → raw report → `/triage` → brief → (big work, in three parts: requirements `/grill-with-docs` → (`/ways:mock` for a visual result) → `/to-spec` → PRD; design `/ways:design` → architecture, ADRs, the PRD's design sections; build `/to-tickets`) → `/ways:work` or `/implement-spec` → PR → review → merge, with the human decision points marked.
3. **Where things live**: specs, glossary, decisions, architecture, issues, PRs. Who owns each.
4. **Interactive or autonomous**: what each means here, what the gate is, what holds an autonomous run.
5. **Who merges what**: the dial's current setting and what it means for each risk tier.
6. **What's happening now**: the current milestone, what's in flight, what's waiting on a person.
7. **Your first hour**: three concrete things to do, taken from the real backlog (a `ready-for-human` issue to try, a recent PR worth reading, the command that runs the gate).

Use the glossary's terms. Link every claim to the file, issue or PR it comes from.

## 3. Deliver it

If the Artifact tool is available, publish the page as an artifact and give the link. Otherwise write it to a file outside the repo (it's derived, so it doesn't belong in git) and give the path. Say what date it reflects: it goes stale, and the fix is to run this again.
