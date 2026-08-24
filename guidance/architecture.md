> **Worth having when someone new to the repo would put things in the wrong place.**
>
> Adapt it. It's a starting point, not a form to fill in. If it doesn't earn its keep here, don't add it.

# Architecture

**Status:** <what exists today in one line; what does not exist yet.> Update this when the shape
changes, not when files move.

## The boundary that matters

```text
<the 3–6 box diagram: inputs → core → outputs, with the one line nothing may cross>
```

<One paragraph: what sits on each side, and the ADR that fixes it.>

## Packages / modules

| Package | Owns |
|---|---|
| `<x.core>` | <…> |
| `<x.io>` | <…> |
| `<x.cli>` | <…> |
| `<x.later>` *(later)* | <…> |

## Contracts

<Where the public contracts live (schema file, API module), what format (JSON, …), versioning rule.>

## Data flow worth a diagram (later)

<Name it; draw it once the pieces exist.>
