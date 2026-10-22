---
name: requirements
description: The first half of /ways:plan, on its own, for when different people do requirements and design. Grills the what and why with Pocock's grilling and domain-modeling (or takes written requirements as they are), offers a mock when the result is visual, then writes the PRD with /to-spec in the same session. Sizes an untriaged issue first.
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

## 2. Grill

Read the issue and its comments. If it has a `Brief:` line, read the brief (`specs/brief/<slug>/README.md` and what it links): the grill starts from what discovery settled, and asks only what's still open.

**Requirements that already exist.** They live in the issue body, or in a file the issue links to, in the repo (a document dropped into `specs/prd/` or `specs/brief/`, say). A link to an outside system doesn't count: ask for it to be copied into the repo first, so it's versioned with the PRD it becomes. If the body or a linked file already reads as requirements (who it's for, what it should do, what's out of scope), say so and ask once:

> These look like written requirements. Write them up as the PRD as they are, or grill them first?

Recommend grilling only if they have gaps that would change the build, and name the gaps. Whether they're agreed is the person's call: don't assume it. **As they are** skips the grill and goes to step 3, with the written requirements as `/to-spec`'s input instead of a conversation.

Otherwise, or if the person says grill, call the Skill tool for Pocock's `grilling`, and for `domain-modeling` (as `/grill-with-docs` does). Terms settled on the way go into `GLOSSARY.md`, and hard-to-reverse decisions into ADRs, as `domain-modeling` says.

## 3. Mock, if the result is visual

When the result is something people look at (a page, a screen, a printout, a chart), offer a mock before the PRD is written: follow `${CLAUDE_PLUGIN_ROOT}/skills/mock/SKILL.md`. If discovery left a test prototype that passed, the mock starts from it. Skip it if the person says no.

## 4. Write the PRD

Call the Skill tool for Pocock's `to-spec`, in this session, so it synthesises the grill above (or the written requirements, read in full, when the grill was skipped). `docs/agents/issue-tracker.md` says how this repo publishes it: a file in `specs/prd/` on a `spec/<feature-slug>` branch, the request issue becoming the parent with a `Spec:` line, and a draft spec PR.

Two checks after it:

- **The parent keeps one state label.** Don't add `ready-for-agent` beside triage's `ready-for-human`. If both are on it, remove `ready-for-agent`.
- **The PRD has Human verification and Must not exist yet**, as the tracker conventions say, and links the mock if there is one.

## 5. Hand on

Say in a few lines what the PRD settles and what's still open. Delete `.claude/ways/part`. Then: "Nothing to merge yet: design goes into the same draft spec PR (#<m>). Next: `/ways:design #<n>`."
