<!-- Step 5 of /ways:discover. Adapted from `mvp-scope-cutlist` in discovery-to-mvp 1.2.0 by Ofer Regev (MIT; see ../LICENSE-discovery-to-mvp). -->

# MVP scope and cut list (pipeline step 5)

This is the step where the PM argues with the model. The first scope any model proposes includes too much: it adds the dashboard, the AI assistant and the integrations because they appeared somewhere in the evidence. A useful v1 is defined as much by what it refuses to do, and every refusal needs a reason someone can disagree with.

## Inputs

- `out/04-problem.md` and the chosen framing from `out/decisions.md` (required)
- `out/03-collisions.md`, `out/02-extract-*.md` (required)
- `context.md` constraints: team, time, budget, data and integrations that exist or don't. If constraints are missing, ask once: "What can the team build in the next 4–6 weeks, and what data or integrations do we definitely not have?"
- Every `Parked ideas` line from earlier outputs
- `out/01-built.md`, if something has already been built

## Process

### 1. Build the candidate list
**Start with the option that builds nothing** (added by ways). Before any feature: is there a change to how people work, using what they already have, that would move the business outcome or test its weakest link? A habit, a rule, a shared folder, a person doing a step by hand for a few weeks. Often the evidence holds one already: someone who doesn't have the problem because they work differently. Write it as candidate zero with the evidence for it, and say what it would and wouldn't fix. It usually doesn't replace v1. It goes first in the order of work, because it's free and it tests the bet. If there's honestly none, say why.

Collect every possible feature from:
- Each severity-2 and severity-3 pain (one or more candidates per pain).
- Each collision's "what v1 must choose".
- Workflow-map gaps (unowned steps, relays).
- Parked ideas.
- **The obvious features stakeholders will expect**, even if the evidence is weak: the brief's original solution, a dashboard, an AI chat assistant, integrations, notifications, analytics. They go on the list so they get cut on the record rather than coming back later.

For each candidate: one line, which persona it serves, evidence IDs (or "no evidence: stakeholder expectation").

### 2. Apply the scoping rules
A candidate is **in v1** only if it passes all of these:
1. **Serves the framed problem**, not just a pain nearby.
2. **Has evidence**: at least one severity-2+ pain or a top collision behind it.
3. **Replaces a workaround** someone described, or removes a relay step. If nobody would stop doing anything, it's not v1.
4. **Lives where users already are.** If the extracts contain "no new logins" or a failed previous attempt at a separate tool, v1's entry point must be inside the existing channel (a link in the message they already get, a reply that works by email). A separate destination needs a reason that beats that evidence.
5. **Doesn't depend on data or integrations the team doesn't have.**
6. **Fits the constraint** (team × time).
7. **Moves the business outcome.** The capability sits on the chain in `out/04-problem.md` ("Business case"), and you can say which link it strengthens. A capability that serves a real pain but sits on no link is either a different problem (park it) or a sign the chain is wrong (say so).

Where a top collision forces a choice, make it, and write which side v1 favors and why.

**Re-check step 3's defaults.** The defaults the PM accepted at step 3 are provisional until they pass these rules. For each, run rules 1 to 7 on the capability it implies. If one fails (it sits on no link of the business chain, or depends on data the team doesn't have), say so before locking the scope and ask the PM whether to keep the default or reverse it.

**Centrality check.** Take each persona's `Named top pain` from the extracts. The key persona's (see `SKILL.md`) has to be one of the core capabilities of v1, with the effort and depth to actually address it. If it appears only as a small field, a label or a "later", stop and decide on the record: (a) promote it to the core and cut something else, or (b) keep it small and write what the small version cannot prove (for example, "a one-line reason tells us whether clients read it, not whether they understand why the concept was built"). Never shrink the customer's biggest complaint to make room for the easiest-to-build items without saying so in the "Collisions decided" or "Argue with me" section. Any other persona's Named top pain is either addressed by a capability or written here as unaddressed, with the reason and what that costs; it does not get to disappear.

**Rank by evidence and outcome, not just pain score.** Operational pains (relays, lost requests) score high because they leave workarounds. Confidence pains (not understanding why, feeling it's random) leave none. Before locking the in-scope list, look at the ranking once without the severity scores and ask which capability moves the business outcome the most. If that differs from the severity order, say so.

### 3. Write v1
- **One sentence**: who does what, where, and what changes for them.
- **In scope**: 3 to 6 capabilities, each with persona served, evidence IDs, and the workaround or relay it removes.
- **v1 does not**: explicit list, in plain sentences. "v1 does not show performance data." "v1 does not replace the account manager's message."
- **What v1 is the first step of**: two sentences on where it leads, taken from the business case. A v1 with no direction reads as a fix for the current process. Write which parts of today's cut list are the next steps along that direction.
- **The to-be workflow** (added by ways): step 3's as-is diagram redrawn with v1 in place, as a Mermaid `flowchart LR` with the same node names where a step doesn't change. Then **the gap**, in a few lines: which steps change, which disappear, which stay exactly as they are, and who does something new. If the gap is wider than the framed problem (v1 redraws steps nobody had a pain with), that's scope creep: say so and narrow it.

### 4. Write the cut list
Every candidate not in v1 goes here. The cut list should be at least as long as the in-scope list; if it isn't, you haven't considered enough.

| Feature | Why it was considered [IDs] | Why it's cut (which rule) | What we lose by cutting it | Revisit when |

"What we lose" must be honest. If the honest answer is "a client who wanted it will be disappointed", write that. "Revisit when" is a trigger, not a date: "when we have read access to client ad accounts", "when 3+ clients ask unprompted".

### 4b. What's already built: keep, rework or delete
Only if `out/01-built.md` exists (added by ways). For each part it lists: **keep** (serves v1 as it is), **rework** (the idea serves v1 but the code doesn't, say what's wrong), or **delete** (serves something cut, or is unsafe). Delete is the default for anything that serves a cut feature. Name the risky things plainly (secrets in the code, a path that loses data, personal data in the wrong place), because whoever built it will want to keep it. The table goes in the cut list's spirit: every verdict has a reason, and "it already exists" is not one.

| Part [BLT] | Verdict | Why | What it costs to keep it anyway |

### 5. Adoption plan
- **Current channel:** where each persona does this today.
- **Why they'd switch**, in one sentence per persona, tied to a workaround they'd drop.
- **Entry point:** exactly how they arrive at v1 the first time (e.g. a WhatsApp message they already get carries the link or the buttons).
- **When they don't use it:** what happens to the work if a user ignores v1 entirely. v1 must degrade to today's process, not break it. Who does what in that case.
- **Adoption signal:** the one behavior that tells you it's working within the first two weeks.
- **Business signal:** the leading indicator, within a quarter, that the number from the business case is moving, and what you would see if it isn't. Behavior metrics alone (time to answer, tickets without follow-up) show that the flow works. They don't show that the business gains.

### 6. Assumptions
List every assumption v1 depends on, one line each, typed as desirability (will they want it), usability (can they do it), feasibility (can we build it), viability (does it make sense for the business). Step 6 ranks these.

### 7. Argue with me
End with the three scope calls you're least sure about, each with the strongest argument for the opposite choice. This invites the pushback the PM should be giving.

## Handling pushback

When the PM disagrees ("cut the dashboard, we have no data", "you're missing the sous-chef who receives on her days off"):
1. Make the change.
2. Re-run the scoping rules on anything affected. A cut can pull something else in, or push it out.
3. Show a short diff: moved in, moved out, changed. Then the revised table.
4. Log the pushback and the change in `out/decisions.md`.
Don't defend the original scope beyond one sentence. If you think the PM is wrong, say so once with evidence, then do what they decided.

## Output: `out/05-scope.md`

```
# v1 scope
## v1 in one sentence
## In scope
| Capability | Serves | Evidence [IDs] | Removes workaround / relay | Business link |
## Centrality check
Named top pain: ... / Where it sits in v1: core | small | later / If small, what the small version can't prove: ...
## First step of
## Candidate zero: what changes without building anything
## To-be
(a Mermaid flowchart LR: the as-is with v1 in place)
### The gap
## v1 does not
## Cut list
| Feature | Considered because [IDs] | Cut because | What we lose | Revisit when |
## What's already built
| Part [BLT] | Verdict (keep / rework / delete) | Why | What it costs to keep it anyway |
## Collisions decided
| Collision | v1 favors | Why |
## Adoption plan
## Assumptions
| # | Assumption | Type |
## Argue with me
```

## Stop here: show the results and ask how to continue

In deep mode this step always ends with a stop, including when the user said "run everything". Never start the next step, and never apply a decision, until the user answers. Two exceptions, both defined in `SKILL.md`: a delegated run (show the results, log the delegated decision and continue), and quick mode (no stop here; carry this step's decisions to the next quick-mode checkpoint).

1. **Show the results in the chat**, not only the file path: v1 in one sentence, candidate zero, the to-be diagram and the gap, the in-scope table, the centrality check, the full cut list table, the keep/rework/delete table and the "Argue with me" items. Then say where the full file is.
2. **Ask the decisions below.** Give your recommended answer for each, clearly marked as a recommendation.
3. **Ask how to continue**, offering: Continue to step 5b, `cost-and-order` · redo this step with changes · edit the output together · stop here.

Then wait for the user.

### Decisions for you

- "Push back on at least one cut or one inclusion. Which?" (If the PM accepts the first scope as-is, say plainly that a first scope is almost never right and ask which item they'd defend least.)
- "The customer's biggest complaint is <X>. It sits <core / small / later> in v1. Do you agree, or do you promote it?" (Recommend promoting it unless the effort is out of reach, and then recommend writing what the small version cannot prove.)
- "Is the 'when they don't use it' fallback acceptable for the account team?"
