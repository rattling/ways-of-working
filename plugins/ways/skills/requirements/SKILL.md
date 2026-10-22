---
name: requirements
description: Part 2 of 4 of big work, the what and why. Grills the requirements with Pocock's grilling and domain-modeling, offers a mock when the result is visual, then writes the PRD with /to-spec in the same session, so nothing decided is lost between them.
disable-model-invocation: true
---

# Requirements

Part 2 of 4 of big work: what to build and why, written as a PRD. It runs what `/grill-with-docs` then `/to-spec` would, in one session, so the grill's decisions can't be lost in between.

Input: the issue, `#<n>`, usually the intake that `/triage` labelled big work. Without one, use the issue the conversation is about, or ask for it once. New and unsorted work starts with `/triage`; work already known to be big starts here, and an unsized issue is sized here first (step 1).

Follow `${CLAUDE_PLUGIN_ROOT}/reference/PARTS.md`: check state first, open with where you are, and end with the merge sentence.

## 1. Check state

As PARTS.md says. Then:

- **Nobody has sized it** (the issue has no triage labels): size it first, as `/triage` would, by the sizing rules in `docs/agents/issue-tracker.md`. Big work: label it as triage would and carry on. One ticket: say so and offer `/ways:work #<n>` instead. The problem isn't understood: offer `/ways:discover`. Don't carry on with requirements for work that isn't big.
- **The PRD exists already** (a `Spec:` line, or `specs/prd/<feature-slug>.md`): say so, with its status, and offer to revise it: grill only what's open or changed, then update the file on its branch. Don't grill from scratch.
- **The problem isn't understood** (the issue is labelled `needs-info` for discovery, or nobody can say who it's for): say `/ways:discover` comes first.

## 2. Grill

Read the issue and its comments. If it has a `Brief:` line, read the brief (`specs/brief/<slug>/README.md` and what it links): the grill starts from what discovery settled, and asks only what's still open.

**Requirements that already exist.** They live in the issue body, or in a file the issue links to, in the repo (a document dropped into `specs/prd/` or `specs/brief/`, say). A link to an outside system doesn't count: ask for it to be copied into the repo first, so it's versioned with the PRD it becomes. If the body or a linked file already reads as requirements (who it's for, what it should do, what's out of scope), say so and ask once:

> These look like written requirements. Write them up as the PRD as they are, or grill them first?

Recommend grilling only if they have gaps that would change the build, and name the gaps. Whether they're agreed is the person's call: don't assume it. **As they are** skips the grill and goes to step 3, with the written requirements as `/to-spec`'s input instead of a conversation.

Otherwise, or if the person says grill, call the Skill tool for Pocock's `grilling`, and for `domain-modeling` (as `/grill-with-docs` does). Terms settled on the way go into `GLOSSARY.md`, and hard-to-reverse decisions into ADRs, as `domain-modeling` says.

## 3. Mock, if the result is visual

When the result is something people look at (a page, a screen, a printout, a chart), offer a mock before the PRD is written: follow `${CLAUDE_PLUGIN_ROOT}/skills/mock/SKILL.md`. If discovery left a test prototype that passed, the mock starts from it. Skip it if the person says no.

## 4. Write the PRD

Call the Skill tool for Pocock's `to-spec`, in this session, so it synthesises the grill above (or the written requirements, read in full, when the grill was skipped). `docs/agents/issue-tracker.md` says how this repo publishes it: a file in `specs/prd/` on a `spec/<feature-slug>` branch, the request issue becoming the parent with a `Spec:` line, and a spec PR.

Two checks after it:

- **The parent keeps one state label.** Don't add `ready-for-agent` beside triage's `ready-for-human`. If both are on it, remove `ready-for-agent`.
- **The PRD has Human verification and Must not exist yet**, as the tracker conventions say, and links the mock if there is one.

## 5. Hand on

Say in a few lines what the PRD settles and what's still open. Then end, since this part has no merge of its own:

> The spec PR (#<m>) stays open: `/ways:design` adds to it, and you merge it after. Next: `/ways:design #<n>`. You can clear the session before it: each part starts fresh from what's in the repo and the issue.
