> **Worth having starting a brand-new project, before any code exists.**
>
> Adapt it. It's a starting point, not a form to fill in. If it doesn't earn its keep here, don't add it.

# <Project>: Seed Specification

## 1. Purpose
What this is, what it becomes part of, and why it exists. 1–3 paragraphs.

## 2. Core outcome
Bulleted: what the finished first version *does*. Written so each bullet is verifiable.

## 3. Known decisions
Language, key libraries, deployment boundary, integrations, non-negotiable principles.
"Current decisions unless strong evidence emerges", not a design.

## 4. Scope ladder
Every capability named as one of: **supported now · planned next · deliberately deferred · out of
scope.** Confirming this ladder is the first setup activity. The charter inherits it.

## 5. Workstreams
One short section per durable bundle of work: what it covers, the boundary, what "good" looks like.
No task lists, those become issues.

## 6. Milestones (provisional)
For each: **Outcome** (one sentence, user-visible) · **Likely contents** (bullets, non-binding) ·
**Human-verifiable completion** (what a person runs, inspects, expects; what must *not* exist yet).
Say they are provisional; the agent reviews and proposes changes at setup.

## 7. Project-specific engineering rules
Only what goes beyond the working contract and the AGENTS section: invariants that must be tested,
boundaries that must hold (e.g. "solver objects never leak past module X"), when ADRs are required.

## 8. Setup task
The first session's job, roughly: read this · read the agent and git conventions · open the first
issues and any milestone · write `AGENTS.md`, the charter, an arch skeleton and any ADR the
decisions justify · recommend where to start · agree outcome + guardrails + acceptance + human
verification for the first issue · flag material ambiguity · mark this spec historical.

## 9. Opening question
The single question the first conversation should answer, e.g. *"Which milestone/workstream do we
start with, and what are the acceptance and human-verification criteria before you run
autonomously?"*
