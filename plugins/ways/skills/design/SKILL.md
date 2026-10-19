---
name: design
description: The design part of a feature, after /to-spec and before /to-tickets. Grills the system-level how (shape, parts, contracts, data, seams, NFRs), updates docs/ARCHITECTURE.md and the ADRs, and fills the PRD's design sections.
disable-model-invocation: true
---

# Design

Big work goes in three parts: **requirements** (`/grill-with-docs`, then `/to-spec`: what and why, the PRD), **design** (this: how, at system level), and **build** (`/to-tickets`, then `/implement-spec` or `/ways:work`). This is the middle part: take an agreed-in-principle PRD and decide how the system takes it, before anything is sliced.

Input: the PRD, by path or parent issue. Without one, use the PRD written in this conversation; with none, stop and say to run `/to-spec` first.

If the work stays inside one part and touches no contract, schema or data store, there's no design to do: say so, add "Design: no change of shape" to the PRD, and hand on to `/to-tickets`.

## 1. Read first

Finding facts is your job, never the person's. Read:

- the PRD, and the parent issue's comments;
- `docs/ARCHITECTURE.md`, `docs/adr/`, `GLOSSARY.md`, `specs/charter.md` (its invariants);
- `docs/standards/architecture.md`: it says what the architecture page holds and when the NFR walkthrough applies;
- the code where the feature lands: the modules it touches, the schema, the existing tests and their seams.

Use the `codebase-design` skill's vocabulary for the code level (module, interface, depth, seam, adapter) and `GLOSSARY.md`'s for the domain.

## 2. Grill the design, outside in

Work in rounds, as Pocock's `grilling` does: number the questions, give your recommended answer to each, word them so "yes" accepts it, and wait. Go from the outside in, and skip a layer the feature doesn't touch with one line saying so.

1. **Context** (C4 level 1). New users or systems it talks to? Anything new crossing the system's edge?
2. **Containers** (C4 level 2). New deployable parts or data stores, or new flows between them?
3. **Parts.** Which part owns each new piece of behaviour, and what each part must not do. Where the feature would blur a boundary, say so.
4. **Contracts.** Anything another system reads (API, schema, event, file): its shape, how it's versioned, and that it changes by addition.
5. **Data.** Schema changes, the source of truth for each new fact, and the migration from what's there now.
6. **Seams.** Where the feature is tested and built behind: prefer existing seams, the highest one possible, as few as possible. Deep modules: what sits behind each interface.
7. **NFRs**, only when `architecture.md`'s walkthrough is triggered (new service, new integration, data store or public contract change, high risk): security and data, failure, performance, observability, operability, cost, compliance.

Recommend the simplest design that keeps the charter's invariants. Where two designs are close and the choice is hard to reverse, compare them in a few lines before recommending.

## 3. Write it down as it settles

- **`docs/ARCHITECTURE.md`**: update the diagrams (Mermaid), the parts table and the contracts when the shape changes. Not for a feature that changes no shape.
- **ADRs** in `docs/adr/` for each hard-to-reverse choice: the context, the options, the choice, what would make us revisit it. Use the `domain-modeling` skill's conventions; new terms go in `GLOSSARY.md`.
- **The PRD**: fill its **Implementation Decisions** (parts, interfaces, schema, contracts) and **Testing Decisions** (the seams, what's tested through them), and add an **NFRs** section if the walkthrough ran. Link the ADRs. No file paths or code.

Commit to the spec's branch, so the spec PR carries requirements and design together; approving it agrees both.

## 4. Hand on

Say what changed in a few lines (the PRD sections, the diagram, the ADRs) and what's still open. Next is `/to-tickets`, which should cut slices along the seams decided here.
