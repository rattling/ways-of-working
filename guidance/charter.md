> **Worth having when scope keeps drifting, or you're briefing work to run unattended.**
>
> Adapt it. It's a starting point, not a form to fill in. If it doesn't earn its keep here, don't add it.

# <Project> Charter

## 1. Purpose

<What this is, why it exists, what it becomes part of. 1–2 paragraphs. "The product is X;
deployment/UI/… is someone else's."

## 2. Success criteria (the first useful version)

1. <Observable, testable statement.>
2. …

## 3. Scope ladder

| Rung | Capabilities |
|---|---|
| **Supported now** (<milestone>) | <…> |
| **Planned next** (<milestones>) | <…>. Which of these, and in what order, is decided deliberately rather than assumed. |
| **Deliberately deferred** | <…> |
| **Out of scope** | <…>. Anything that turns "<this>" into "<everything>". |

Moving a capability up a rung is a consequential decision: it needs a card, usually a domain-model
update, and sometimes an ADR.

## 4. Invariants

- **<Name>.** <What must never regress; each is a named test.>
- **Deterministic construction.** <Outputs and any model/artifact are built in input order; no
  dict/set iteration decides anything; two runs of one input yield identical text (tested).>
- **Errors are collected, ids are opaque, unsupported input is an error.** Validation reports every
  issue together; external ids are opaque byte-exact strings never used for ordering; input this
  version doesn't support is a typed error naming it, never a silent skip.

## 5. Non-goals

<Not a general platform. Not a UI. Not a … in disguise.>

## 6. Relationship to <sibling systems>

<Who consumes this, who it sits beside. Live state lives in the issues; this charter and
`AGENTS.md` hold the durable frame; the seed spec in `specs/` is historical.>
