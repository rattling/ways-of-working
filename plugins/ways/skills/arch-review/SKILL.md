---
name: arch-review
description: A guided architecture walkthrough, pillar by pillar in the shape of a Well-Architected Review, at the start of a repo, before a big change, or at intervals. Ends in a critique (what holds, the one that would sink it, the gaps) for a person to turn into tickets.
disable-model-invocation: true
---

# Architecture review

Walk the architecture through the Well-Architected pillars, question by question, so the gaps show. Run it at the start of a repo, at design time before a big change, or at intervals (a milestone, a quarter). What comes out is a critique a person turns into tickets, not a document to keep.

Input, optional: the scope ("before we add menus", "just security", "the whole system"). Without one, the whole system as it is today.

## 1. Read first

Finding facts is your job, never the person's. Read, with subagents for anything large:

- `specs/charter.md` (its invariants), `specs/operating-context.md`, `specs/roadmap.md`, `docs/ARCHITECTURE.md`, `docs/adr/`, `GLOSSARY.md`, `README.md`.
- `docs/standards/`, mainly `architecture.md` (and its NFR walkthrough), `security.md` and `delivery.md`.
- The code, as far as the pillars need: entry points, the data store and schema, dependencies and their versions, containers, CI, infrastructure files, how it's deployed.
- Open issues (`gh issue list --state open`), so you don't report as new what's already known.

## 2. Fit, first

Two or three lines before the pillars: does the shape still serve what the charter says this is for, and do the invariants still hold in the code? Drift here outranks anything a pillar finds.

## 3. Walk the pillars

One pillar at a time, in this order, skipping any the scope doesn't touch. For each: say in two or three lines what you found, then ask about what's missing, unclear or drifted, in rounds as Pocock's `grilling` does: numbered questions, each with your recommended answer, worded so "yes" accepts it. A pillar with nothing to find gets one line, and you move on.

| Pillar | Ask about |
|---|---|
| **Reliability** | What fails when a dependency is down or slow. Backups and restore, tried or not. Migrations that only go forward. The single points of failure, and which ones matter |
| **Security** | Who can reach what, and how they prove it. Secrets. The data it holds (personal, safety, money) and where it goes. Input that crosses a boundary. Dependencies with known holes |
| **Cost** | What it costs to run and what makes that grow. What runs when nobody's using it. For an agent-built system, the tokens too |
| **Operational excellence** | How it's deployed and rolled back. How you'd know it's broken before a customer tells you. Whether the gate in CI is the gate people run. What a new person needs to run it |
| **Performance** | The expected load, the slowest acceptable response, and what grows: rows, users, files. Where the first bottleneck will be |

These are the Azure Well-Architected names; AWS and Google use nearly the same. They apply to a system that isn't hosted yet: for something that only runs locally, reliability and operations are about backups, migrations and how it will be deployed.

Keep it moving. A whole review is about an hour of the person's time; a scoped one, less.

## 4. The critique

When the pillars are done, write it up in this order:

1. **What holds.** The two or three things the design gets right, and why they matter. Say what's strong so it isn't undone later.
2. **The one that would sink it.** The single risk that matters most, stated plainly, with what you saw and where, and the questions it raises. If nothing is that serious, say so.
3. **Gaps.** By pillar. Each with a title that would work as an issue title, what you saw and where (file, line, issue), and why it matters.
4. **Smaller questions to ask yourself.** Trade-offs that may be deliberate: ask rather than assert.
5. **Open going into the next review**, and what should trigger it.

Don't file issues and don't write documents: the person turns the critique into tickets, by hand or through `/triage`. Where a decision was made during the review, say so and suggest an ADR.
