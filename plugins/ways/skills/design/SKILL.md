---
name: design
description: The second half of /ways:plan, on its own, for when an engineer designs from a PRD someone else wrote. Grills the system-level how (shape, parts, contracts, data, seams, NFRs), updates docs/ARCHITECTURE.md and the ADRs, and fills the PRD's design sections on the spec branch.
disable-model-invocation: true
---

# Design

How the system takes the PRD, at system level, before anything is sliced. `/ways:plan` runs requirements and then this in one sitting, and is what most people use. Run this on its own when the requirements were written by someone else with `/ways:requirements`: the PRD file is the hand-off. `/ways:build` then cuts tickets along the seams decided here.

Input: the parent issue, `#<n>`, or the PRD's path. Without one, use the PRD written in this conversation; with none, stop and say `/ways:plan` (or `/ways:requirements`) comes first.

Follow `${CLAUDE_PLUGIN_ROOT}/reference/PARTS.md`: look for the output first, open with where you are, and end with the merge sentence. If the PRD's design sections are already filled, say so and offer to revise them, not to start again.

If the work stays inside one part and touches no contract, schema or data store, there's no design to do: say so, add "Design: no change of shape" to the PRD, commit it to the spec branch, and hand on (step 4).

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

8. **The look**, when the feature has screens. Raise it as a decision, not a rule. Compare the look the prototype or mock used with the app's own (its stylesheet, colour and spacing tokens, component library or style guide), and say which case this is:
   - **The same look.** The usual case: the prototype used the app's look. Say so in one line; no extra ticket.
   - **The prototype tried a new look.** Ask: adopt it (a ticket changes the theme, for this part of the app or all of it, before the screens that need it), or keep the current look and take only the prototype's layout and content. Record the choice in the PRD.
   - **The app has no shared look yet** (each screen styles itself, or browser defaults show through, as in dark mode): recommend a first "theme and shell" ticket (`docs/standards/code.md`, "One look, set once") that the screen tickets wait for.
9. **Demo data**, when a person will try the feature by hand. What does someone need in the dev seed to try every user story, the awkward cases included: the record with none, the one with fifty, the closed one, the longest name? Check the seed (`docs/standards/delivery.md`). If it lacks them, say what's missing in the PRD's Implementation Decisions, and recommend how it gets built: a **seed ticket first** (the default: the screens can be tried from the first slice), or **each ticket adds its own records** (spread out, never stale). Name the records people will use to check it, so the tickets can point at them. If the repo has no seed at all, the seed ticket starts it.

Recommend the simplest design that keeps the charter's invariants. Where two designs are close and the choice is hard to reverse, compare them in a few lines before recommending.

## 3. Write it down as it settles

- **`docs/ARCHITECTURE.md`**: update the diagrams (Mermaid), the parts table and the contracts when the shape changes. Not for a feature that changes no shape.
- **ADRs** in `docs/adr/` for each hard-to-reverse choice: the context, the options, the choice, what would make us revisit it. Use the `domain-modeling` skill's conventions; new terms go in `GLOSSARY.md`.
- **The PRD**: fill its **Implementation Decisions** (parts, interfaces, schema, contracts) and **Testing Decisions** (the seams, what's tested through them), and add an **NFRs** section if the walkthrough ran. Link the ADRs. No file paths or code.

Commit to the spec's branch, so the spec PR carries requirements and design together; approving it agrees both.

## 4. Hand on

Mark the spec PR ready. Say what changed in a few lines (the PRD sections, the diagram, the ADRs) and what's still open. Delete `.claude/ways/part`. Then the merge sentence: "To agree the spec, merge PR #<m>: that's what it should do and how the system changes." Next: `/ways:build #<n>`, which cuts slices along the seams decided here.
