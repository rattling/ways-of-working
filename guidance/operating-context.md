> **Worth having when someone other than you is triaging the backlog.**
>
> Adapt it. It is a starting point, not a form to fill in. If it doesn't earn its keep here, don't add it.

# <Project>: Operating Context

> A compact, **self-contained** frame for an **auto-triage agent**. Given a work item, decide
> **(1) in scope for the current phase or deferred, (2) priority, (3) how to route it**, using only
> this doc plus the ticket. No engineering judgment, no other docs, so keep it self-contained.
>
> **Current phase:** <name>. Last reviewed: <date>.

## 1. What this project is (durable frame)
What it's for; the parties (who accepts the work, who builds it, who "the client" is); the **core
invariants** that must never regress in any phase. A ticket threatening a core invariant is **always
in scope, high priority**.

## 2. Current phase
**Done already (context):** what's shipped and now just being proven/maintained.

**In scope (now):** the small set of outcomes this phase is actually about.

**Out / deferred ("not this phase", not "never"):** name the tempting-but-parked work
explicitly so the agent defers it instead of ranking it.

> **Phase done when:** <the acceptance gate, in one sentence>.

## 3. Priority heuristics (phase-scoped)
- **P1:** acceptance-blocking: the work without which the phase can't close.
- **P2:** now: correctness-adjacent / trust-protecting.
- **P3:** now if capacity: in-scope polish, housekeeping.
- **Deferred:** don't rank against this phase's work.

**Tie-breakers:** more users/impact → higher; client-visible > internal; silent failure > loud; …

**"Feature hiding a bug" check:** if a "new feature" is really a correctness gap in delivered scope,
triage it as the bug, not as deferred capability.

## 4. Routing
- **needs-client-confirm / blocked-on-client**: can't move until someone decides → route out, mark
  blocked. Urgency ≠ readiness: a high-impact question is high-urgency *and* awaiting-client.
- **accepted-for-dev**: confirmed in scope → rank per §3.
- **housekeeping / process**: keep, low priority, don't jump the queue.
- **deferred**: label future-phase, drop from active ranking, leave a one-line reason.

## 5. Worked archetypes
| Ticket shape | In scope? | Tier | Why |
|---|---|---|---|
| … | | | |

## 6. One-liner
*A single sentence a tired human or agent can act on: the phase, what to prize, what to park.*

---

<!--
  Worked example, in a maintenance phase. Delete this block in your own copy. It is here to show
  the shape and level of specificity a useful operating context reaches.

  # <Product>: Operating Context
  > Current phase: Warranty (customer acceptance testing). Last reviewed: <date>.
  1. What it is: reporting and decision support over a customer's own operational data.
     Parties: the customer accepts, we build. Invariants: deterministic and explainable
     outputs, data lineage, tenant isolation, auth and audit baseline.
  2. Phase, Warranty: prove and tighten already-delivered scope (data matches spec, basics
     work, presentation, robustness). Deferred: new channels, further AI, new dashboards.
     Done when the customer accepts.
  3. P1 acceptance-blocking correctness (wrong figures, silent data gaps); P2 presentation and
     robustness; P3 polish; deferred means new capability.
  4. Route rule ambiguities to the customer (high urgency, blocked-on-client); housekeeping P3.
  6. "In warranty. Prize correctness and trust in what is delivered; park new capability."
-->
