# Architecture

## Draw it

`docs/ARCHITECTURE.md` is one page, in Mermaid, so it lives in the repo and diffs in review:

- **System context** (C4 level 1): the system, its users, and the systems it talks to.
- **Containers** (C4 level 2): the deployable parts and data stores, and what flows between them.
- **A parts table** with columns *Part · Owns · Must not*. The "must not" column is what keeps boundaries from eroding.
- **A sequence diagram for each flow that crosses a boundary**: a request through the layers, a sync between systems.

Stop at level 2. Component and code diagrams go stale faster than they help; the code is that level. Detail lives next to the part it describes, linked from the table.

## Clean, but pragmatic

- **Stable contracts at the boundaries; the simplest thing inside them.** APIs, schemas, events and files other systems read are contracts: versioned, documented, and changed by addition. Inside a boundary, refactor freely.
- **Integrate through the contract, never the tables.** A new consumer doesn't read another system's database.
- **Dependencies point inward where it's cheap.** Business rules don't call the database, HTTP or the UI directly. Don't build layers for their own sake in a small codebase.
- **Deep modules:** a small interface with real work behind it. A module you can't describe in one sentence is two modules.
- **Explicit over clever.** Visible wiring beats a container or a factory graph. Someone joining in six months should be able to follow it.
- **No abstraction until the second use.** Duplication is cheaper than the wrong abstraction.

## Decisions

Hard-to-reverse choices get an ADR in `docs/adr/`: the context, the options considered, the choice, and what would make us revisit it. Datastores, frameworks, hosting, contracts, auth. An inherited decision whose reason nobody knows gets an ADR that says so.

## The NFR walkthrough

A lightweight architecture review, in the spirit of an architecture board without the board. Triggered by a spec (PRD) for a new service, a new integration, a change to a data store or public contract, or anything at the high risk tier.

The author walks the architecture owner through the spec for 30 minutes, against this list:

| | Question |
|---|---|
| Security and data | Who can reach it, what data does it hold, where does it go? |
| Failure | What happens when a dependency is down or slow? |
| Performance and capacity | Expected load, the slowest acceptable response, what grows |
| Observability | How will we know it's broken before a customer tells us? |
| Operability | How does it deploy, roll back, migrate? |
| Cost | What does it cost to run, and what makes that grow? |
| Compliance | Personal data; data where an error causes harm (safety, health, money) |

The answers go in the spec's NFR section, or an ADR if they decide something hard to reverse. The review is the spec PR's approval.
