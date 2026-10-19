---
name: arch-review
description: A guided walkthrough of the architecture, lens by lens in the shape of TOGAF's ADM, at the start of a repo, before a big change, or at intervals. Produces findings for a person to turn into tickets.
disable-model-invocation: true
---

# Architecture review

Walk the architecture through a fixed set of lenses, so the gaps show. The lenses are TOGAF's ADM phases; the paperwork isn't. Run it at the start of a repo, at design time before a big change, or at intervals (a milestone, a quarter). What comes out is findings: a short list a person turns into tickets.

Input, optional: the scope ("before we add menus", "just the data", "the whole system"). Without one, the whole system as it is today.

## 1. Read first

Finding facts is your job, never the person's. Read, with subagents for anything large:

- `specs/charter.md`, `specs/operating-context.md`, `specs/roadmap.md`, `docs/ARCHITECTURE.md`, `docs/adr/`, `GLOSSARY.md`, `README.md`.
- `docs/standards/`, mainly `architecture.md`, `security.md` and `delivery.md`.
- The code, as far as the lenses need: entry points, the data store and schema, dependencies and their versions, containers, CI, infrastructure files.
- Open issues (`gh issue list --state open`), so you don't report as new what's already known.

## 2. Walk the lenses

One lens at a time, in this order, skipping any the scope doesn't touch. For each: say in two or three lines what you found, then grill on what's missing, unclear or drifted, in rounds as Pocock's `grilling` does: numbered questions, each with your recommended answer, worded so "yes" accepts it. A lens with nothing to find gets one line, and you move on.

| Lens (ADM phase) | Ask about |
|---|---|
| **Vision** (A) | Who it's for, what success looks like, what it must never become. Does the charter still say so? Constraints and stakeholders |
| **Business** (B) | The capabilities and processes it supports. Where the code's words and the glossary's differ |
| **Data** (C) | Entities, ownership, sources of truth. Sensitive data (personal, safety, money), retention, migrations |
| **Application** (C) | The parts and their boundaries. Contracts with other systems. What's coupled that shouldn't be |
| **Technology** (D) | Runtime, hosting, versions and their end of support, environments, how it's built and deployed |
| **Gaps and migration** (E, F) | Today against where the charter and roadmap say it's going: what's in between, in what order, what's hard to reverse |
| **Governance** (G, H) | Which decisions have ADRs and which don't. What enforces the standards. How change is approved. What should trigger the next review |

For a hosted system, add the Well-Architected pillars to Technology: reliability, security, cost, operational excellence, performance. Those are Azure's names; AWS and Google use much the same.

Keep it moving. A whole review is about an hour of the person's time; a scoped one, less.

## 3. Findings

When the lenses are done, give one list, grouped by when it matters: **now**, **next**, **later**. Each finding:

- a title that would work as an issue title;
- the lens, what you saw and where (file, line, issue), and why it matters;
- a suggested next step.

Don't file issues and don't write documents: the person turns findings into tickets, by hand or through `/triage`. Where a decision was made during the review, say so and suggest an ADR. End with when to run this again, if the review surfaced a trigger.
