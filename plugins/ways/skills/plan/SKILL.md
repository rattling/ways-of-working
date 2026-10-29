---
name: plan
description: Plan big work in one sitting, between discovery and build. Requirements by prototyping, grilling or both, switching as the questions change (or written requirements as they are), the agreed prototype kept as the mock, then the system-level design, ending in one spec PR that the person merges once. Sizes an untriaged issue first.
disable-model-invocation: true
---

# Plan

Big work is planned in one sitting: what it should do (requirements), then how the system changes (design), in one PRD and one spec PR. `/ways:build` comes after; `/ways:discover` comes before, when the problem isn't understood.

Input: the issue, `#<n>`. Without one, use the issue the conversation is about, or ask for it once.

Follow `${CLAUDE_PLUGIN_ROOT}/reference/PARTS.md`: look for the output first, open with where you are, end with the merge sentence. This runs in one session: don't clear it during a plan.

## 1. Requirements

Follow `${CLAUDE_PLUGIN_ROOT}/skills/requirements/SKILL.md`, steps 1 to 4: look for an existing PRD, size an untriaged issue first, ask about written requirements, work the requirements out by prototyping, grilling or both (switching as the questions change, with an "Agreed so far" list on the issue), keep the agreed prototype as the mock, and write the PRD with `/to-spec`. Skip its step 5: there's no hand-on in the middle of a plan.

**Write it to disk as soon as the grill ends**, before design starts: the PRD's requirements sections, committed and pushed on the `spec/<feature-slug>` branch, as `/to-spec` does. An auto-compaction mid-plan then loses nothing, because design reads the file, not the conversation. Don't make this a step the person sees.

## 2. Design

Follow `${CLAUDE_PLUGIN_ROOT}/skills/design/SKILL.md`, steps 1 to 3, reading the PRD from the file just written: grill the system-level how outside in, update `docs/ARCHITECTURE.md` and the ADRs, and fill the PRD's design sections on the same branch. If the work stays inside one part and touches no contract, schema or data store, say so and write "Design: no change of shape" instead.

## 3. Hand on

Mark the spec PR ready. Say in a few lines what the PRD settles (what, and how), its size beside the closest feature, what went on the Later list, and what's still open. Delete `.ways/part`. Then:

> To agree the spec, merge PR #<m>: that's what it should do and how the system changes. Next: `/ways:build #<n>`.
