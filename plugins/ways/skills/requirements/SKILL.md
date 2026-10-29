---
name: requirements
description: The first half of /ways:plan, on its own, for when different people do requirements and design. Works out the what and why by prototyping, grilling (Pocock's grilling and domain-modeling) or both, switching as the questions change (or takes written requirements as they are), keeps the agreed prototype as the mock, then writes the PRD with /to-spec in the same session. Sizes an untriaged issue first.
disable-model-invocation: true
---

# Requirements

What to build and why, written as a PRD. `/ways:plan` runs this and then `/ways:design` in one sitting, and is what most people use. Run this on its own when someone else will do the design: the PRD file is the hand-off.

Input: the issue, `#<n>`. Without one, use the issue the conversation is about, or ask for it once.

Follow `${CLAUDE_PLUGIN_ROOT}/reference/PARTS.md`: look for the output first, open with where you are, and end with the merge sentence.

## 1. Look first

- **The PRD exists already** (a `Spec:` line, or `specs/prd/<feature-slug>.md`): say so, with its status, and offer to revise it: grill only what's open or changed, then update the file on its branch. Don't grill from scratch.
- **Nobody has sized it** (no state label, or only `needs-triage`): size it first, as `/triage` would, by the sizing rules in `docs/agents/issue-tracker.md`. Big work: label it as triage would and carry on. One ticket: say so and offer `/ways:work #<n>` instead. The problem isn't understood: offer `/ways:discover`. Don't carry on for work that isn't big.
- **The problem isn't understood** (labelled `needs-info` for discovery, or nobody can say who it's for): say `/ways:discover` comes first.

## 2. Work them out: prototype, grill, or both

Read the issue and its comments. If it has a `Brief:` line, read the brief (`specs/brief/<slug>/README.md` and what it links): the grill starts from what discovery settled, and asks only what's still open.

**Requirements that already exist.** They live in the issue body, or in a file the issue links to, in the repo (a document dropped into `specs/prd/` or `specs/brief/`, say). A link to an outside system doesn't count: ask for it to be copied into the repo first, so it's versioned with the PRD it becomes. If the body or a linked file already reads as requirements (who it's for, what it should do, what's out of scope), say so and ask once:

> These look like written requirements. Write them up as the PRD as they are, or grill them first?

Recommend grilling only if they have gaps that would change the build, and name the gaps. Whether they're agreed is the person's call: don't assume it. **As they are** skips the grill and goes to step 3, with the written requirements as `/to-spec`'s input instead of a conversation.

Otherwise, **ask how to start**, with a recommendation:

- **Prototype** when the open questions are about shape and flow: what a screen holds, what comes first, how a task feels to do.
- **Grill** when they're about rules: edge cases, invariants, who may do what, what happens when it goes wrong.
- **Both** when it's a mix, which is usual. Start with whichever holds the bigger questions.

**Grilling:** call the Skill tool for Pocock's `grilling`, and for `domain-modeling` (as `/grill-with-docs` does). Terms settled on the way go into `GLOSSARY.md`, and hard-to-reverse decisions into ADRs, as `domain-modeling` says.

**Lean small, and say so.** Pocock's grill recommends an answer to every question, and accepting the recommendations accepts whatever they add, so the recommendation is always the smaller one (`docs/standards/architecture.md`, "Proportion"). When an answer would add scope or future-proofing (keeping history, a second way in, a warning on every page, a confirmation on every save, a preview of a side effect), put it as two options:

> **Minimal (recommended):** what delivers this well now.
> **If you know you'll need X:** the extra pieces it adds now (1, 2, 3), and roughly what they cost.

The person can always choose more. Answer the request as asked: when it says "tell us when the copy is wrong", the minimal answer tells them, in one place, not everywhere a person might look. What's declined goes on a **Later** list in the "Agreed so far" comment, one line each, and the PRD's Out of Scope links it. It doesn't go into the spec.

**Prototyping:** rounds of a clickable prototype, built and shown as `${CLAUDE_PLUGIN_ROOT}/skills/mock/SKILL.md` says, finished-looking from the first round, with real data. **Use the app's look by default:** find its stylesheet, colour and spacing tokens, component library or style guide, build the prototype in it, and say so: "I'll use the app's current look. Say if you want to try something different." Trying a new look is the person's call, and the design step then asks whether to adopt it. When the person judges a round, give it the guided tour: step N of M, a line on what they're looking at, the part that matters highlighted. Use side-by-side variants only for a narrow "A or B?" question, and keep the words on screen to a minimum. When the feedback is about taste, offer style directions as screenshots, as the mock skill's step 3 says. For several radically different directions at once, Pocock's `prototype` is the tool; bring its pick back here. If discovery left a test prototype that passed, start from it. Draw the minimal answer, not every option: a screen that shows an extra invites it into the spec.

**Switch when the questions change.** After a few prototype rounds, if what's left is rules: "A few rules are still open (…). Shall I grill those?" Partway through a grill, if a question is about how something looks or flows: "This is about the screen. Shall I prototype it?" Either way it ends in the same place: agreed requirements, then the PRD.

**Keep an "Agreed so far" list on the issue** as you go: one comment, edited after each round or each settled question, a line per decision, with the **Later** list under it. It's what `/to-spec` writes the PRD from, it survives a compaction, and the person can see what they've agreed without scrolling back.

## 3. The mock

The prototype is evidence, not the spec. When it's agreed, it becomes the mock kept with the PRD: tidy it, give it the full guided tour (a step per decision, Show architecture, Reset demo), and save it as `/ways:mock`'s step 4 says. If there was no prototype and the result is something people look at (a page, a screen, a printout, a chart), offer a mock now, from the agreed decisions. Skip it if the person says no.

## 4. Write the PRD

Run Pocock's `to-spec` steps (`${CLAUDE_PLUGIN_ROOT}/reference/POCOCK.md`: only a person can type it, so read its instructions and follow them here), in this session, so it synthesises the "Agreed so far" list, the grill and the prototype rounds (or the written requirements, read in full, when they went in as they are). `docs/agents/issue-tracker.md` says how this repo publishes it: a file in `specs/prd/` on a `spec/<feature-slug>` branch, the request issue becoming the parent with a `Spec:` line, and a draft spec PR.

Two checks after it:

- **The parent keeps one state label.** Don't add `ready-for-agent` beside triage's `ready-for-human`. If both are on it, remove `ready-for-agent`.
- **The PRD has Human verification and Must not exist yet**, as the tracker conventions say, and links the mock if there is one.

## 5. Hand on

Say in a few lines what the PRD settles and what's still open. Delete `.ways/part`. Then: "Nothing to merge yet: design goes into the same draft spec PR (#<m>). Next: `/ways:design #<n>`."
