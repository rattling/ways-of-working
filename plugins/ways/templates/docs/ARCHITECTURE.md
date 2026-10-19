# Architecture

**Status:** <what exists today, in one line; what doesn't exist yet.> Update this when the shape changes, not when files move.

One page. It shows the shape and links out: detail lives next to the part it describes, and the reasons live in `docs/adr/`.

## The boundary that matters

```text
<3–6 boxes: inputs → core → outputs, and the one line nothing may cross>
```

<One paragraph: what sits on each side, and the ADR that fixes it.>

## Parts

| Part | Owns | Detail |
|---|---|---|
| `<module or service>` | <…> | <link to the part's own README or doc, if it needs one> |

## Contracts

<Where the public contracts live (schema, API definition), their format, and the versioning rule.>

## Stack and deployment

<Languages, frameworks, database, where it runs, how it deploys. One line each, linking ADRs for anything hard to reverse.>

## Decisions

Recorded in `docs/adr/`, one file per decision.
