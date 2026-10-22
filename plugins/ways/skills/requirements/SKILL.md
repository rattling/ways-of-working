---
name: requirements
description: Part 2 of 4 of big work, the what and why. Grills the requirements with Pocock's grilling and domain-modeling, offers a mock when the result is visual, then writes the PRD with /to-spec in the same session, so nothing decided is lost between them.
disable-model-invocation: true
---

# Requirements

Part 2 of 4 of big work: what to build and why, written as a PRD. It runs what `/grill-with-docs` then `/to-spec` would, in one session, so the grill's decisions can't be lost in between.

Input: the issue, `#<n>`, usually the intake that `/triage` labelled big work. Without one, use the issue the conversation is about, or ask for it once.

Follow `${CLAUDE_PLUGIN_ROOT}/reference/PARTS.md`: check state first, open with where you are, and end with the merge sentence.

## 1. Check state

As PARTS.md says. Two cases stop here:

- **The PRD exists already** (a `Spec:` line, or `specs/prd/<feature-slug>.md`): say so, with its status, and offer to revise it: grill only what's open or changed, then update the file on its branch. Don't grill from scratch.
- **The problem isn't understood** (the issue is labelled `needs-info` for discovery, or nobody can say who it's for): say `/ways:discover` comes first.

## 2. Grill

Read the issue and its comments. If it has a `Brief:` line, read the brief (`specs/brief/<slug>/README.md` and what it links): the grill starts from what discovery settled, and asks only what's still open.

**If the requirements are already written and agreed** (a brief someone wrote, in the issue or shared in chat), skip the grill: say so once, and go to step 3.

Otherwise call the Skill tool for Pocock's `grilling`, and for `domain-modeling` (as `/grill-with-docs` does). Terms settled on the way go into `GLOSSARY.md`, and hard-to-reverse decisions into ADRs, as `domain-modeling` says.

## 3. Mock, if the result is visual

When the result is something people look at (a page, a screen, a printout, a chart), offer a mock before the PRD is written: follow `${CLAUDE_PLUGIN_ROOT}/skills/mock/SKILL.md`. If discovery left a test prototype that passed, the mock starts from it. Skip it if the person says no.

## 4. Write the PRD

Call the Skill tool for Pocock's `to-spec`, in this session, so it synthesises the grill above. `docs/agents/issue-tracker.md` says how this repo publishes it: a file in `specs/prd/` on a `spec/<feature-slug>` branch, the request issue becoming the parent with a `Spec:` line, and a spec PR.

Two checks after it:

- **The parent keeps one state label.** Don't add `ready-for-agent` beside triage's `ready-for-human`. If both are on it, remove `ready-for-agent`.
- **The PRD has Human verification and Must not exist yet**, as the tracker conventions say, and links the mock if there is one.

## 5. Hand on

Say in a few lines what the PRD settles and what's still open. Then the merge sentence: nothing to merge yet, because design adds to the same spec PR. Next: `/ways:design #<n>`.
