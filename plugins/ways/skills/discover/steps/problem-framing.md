<!-- Step 4 of /ways:discover. Adapted from `problem-framing` in discovery-to-mvp 1.2.0 by Ofer Regev (MIT; see ../LICENSE-discovery-to-mvp). -->

# Problem framing (pipeline step 4)

Briefs usually arrive with a solution baked in ("customers keep complaining about mistakes, should we build an ordering app?"). The interviews often say the problem is somewhere else. This step writes down the problem the evidence supports, shows how it differs from the brief, and forces a choice between framings before anyone scopes features.

## Inputs

- `out/03-collisions.md` (required)
- `out/02-extract-*.md` (required)
- `context.md` (required, for the original framing)
- The PM's answers at the step 3 checkpoint, from `out/decisions.md`

## Process

### 1. Restate the brief's framing
In one or two sentences, what problem did the brief assume, and what solution did it imply? Quote the brief.

### 1b. Audit the premises before drafting
List every claim the brief, the PM or the earlier chat made about the customer or the business ("clients trust our deliveries", "this will increase wins", "they rarely ask for changes"). For each, mark it **supported**, **contradicted** or **untested** against the extracts, with turn IDs. Use the trust table from step 2: a premise about "trust" is only supported for the object (person, process, output, reasoning) the evidence is about.

Rules for this audit:
- **Raise contradictions yourself, first.** Don't wait for the PM to push. Say "the brief assumes X; the evidence says Y [ID]" in the first paragraph you show.
- Show the PM which premises the proposed solution depends on. A contradicted premise under the favorite solution is the top issue of the step.
- If the PM defends a contradicted premise, ask what evidence would change their mind. Log it. Don't drop the finding to keep the peace.

### 2. Draft three candidate framings
- **The brief's framing**, stated as fairly as possible.
- **The evidence framing**: built from the highest-severity pains, the top collisions and the workflow gaps in step 3.
- **A narrower or broader framing**: one level down (a single step of the workflow) or one level up (the whole relationship).

### 3. Write the chosen-by-default problem statement
Default to the evidence framing unless the evidence is thin. The statement:
- Is **under 80 words**.
- Says **who** (both personas if it's a seam problem), **what's broken**, **what it costs** (time, money, a missed outcome, trust), and cites **turn IDs** for the evidence.
- Contains **no solution words**. Banned: platform, portal, dashboard, app, tool, feature, AI, automate, build, integrate, system, interface, page, view, bot. If one slips in, rewrite.
- Uses the personas' own words where they're sharper than yours (from the "Their words" section of each extract).

### 4. Test it
Run each check and write pass/fail with a line of reasoning:
- **Evidence:** every claim traces to an ID.
- **Both sides:** if it's a seam problem, both personas would recognize it.
- **Not a feature in disguise:** you can name at least two different solutions that would solve it.
- **Explains the workarounds:** the shadow spreadsheets, DMs and relays from step 2 make sense if this problem is true.
- **Explains the silences:** the things nobody mentioned are consistent with it.
- **Names every Named top pain:** for each extract with a `Named top pain`, the statement covers it, in that person's words. If one can't fit, write which is dropped and why, and treat this check as failed until the PM agrees. The key persona's (see `SKILL.md`) can't be the one dropped.

### 5. Reject the alternatives, in writing
For each of the other two framings: why it's tempting and why you'd reject it (or keep it as a fallback). Cite evidence. "The brief's framing would produce an ordering app; the vendor already built a web portal that 8% of customers used [AVI-031], and the customer asked for no new apps [TAM-036]."

### 6. What "solved" looks like
For each persona, 2 to 3 observable changes in behavior if the problem were gone. Observable means you could watch it happen: "Tamar stops screenshotting every order", "Avi spends his evenings selling instead of retyping voice notes." Not metrics wishlists, not feelings.

### 6b. Business case
Say why the company should care, in terms of one number. Without this, step 5 will rank by who complained loudest.
- **Outcome:** the one business number this should move (retention or renewal, revenue per client, cost to serve, time to deliver, win rate). Take it from the brief if it names one, unless the premise audit contradicts it; otherwise propose one, mark it `proposed`, and say why the brief's doesn't fit. Don't write two outcomes to be safe. Give its value **today**, from `out/01-data.md` where it can (or an estimate, labelled), and a **target** v1 should reach, so success is a number someone can check later (added by ways).
- **Chain:** the links from "solved looks like" to that number, in order, each labelled `evidence [ID]` or `assumption`. Example: "restaurant sees why an item was substituted (assumption) → stops phoning the rep to check (assumption) → fewer calls per order (evidence [AVI-031]) → rep time freed for selling (stated) → more accounts per rep." If a link is a leap (cost savings in one link, a different benefit in the next), say it. Two different outcomes in one chain is two bets.
- **Consequence named by people:** the lines from the business-consequence sections of the extracts. If none, write "nobody named a cost" and treat it as a risk for step 5.
- **Weakest link:** the link with the least evidence. It goes to step 6 as the leading candidate for the riskiest assumption.
- **Kill signal:** what number or behavior, in what time, would tell us the chain is wrong.
- **Why now:** the trigger that makes this worth doing this quarter and not next year. Name the kind: customers changed (behavior or expectations), our situation changed (pressure, a new target, a failed attempt), what is possible changed (a channel, data or tool that wasn't there), or a cost of waiting. Take triggers from the "Recent changes" sections of the extracts and from the brief. Label each `evidence [ID]`, `brief` (the team said it) or `assumption`. Say what happens if we wait a year. If nothing supports a trigger, write `no why-now evidence` and treat it as a risk for step 5: it argues for a cheap test before a build.

### 7. Non-goals
Problems that are real but not this one, so step 5 doesn't scope them in by accident.

## Output: `out/04-problem.md`

```
# Problem
## The brief said
## Premise audit
| Premise | Source | Status (supported / contradicted / untested) | Evidence [ID] |
## Problem statement (<n> words)
## Checks
| Check | Pass/fail | Why |
## Framings considered
| Framing | Why it's tempting | Why rejected / kept as fallback |
## What solved looks like
### <Persona A>
### <Persona B>
## Business case
Outcome: ... (given | proposed). Today: ... [DAT-nn | estimate]. Target: ...
Chain: link → link → link (each marked evidence [ID] | assumption)
Consequence named by people: ...
Weakest link: ...
Kill signal: ...
Why now: trigger (kind) — evidence [ID] | brief | assumption. If we wait a year: ...
## Non-goals
Parked ideas: ...
```

## Stop here: show the results and ask how to continue

In deep mode this step always ends with a stop, including when the user said "run everything". Never start the next step, and never apply a decision, until the user answers. Two exceptions, both defined in `SKILL.md`: a delegated run (show the results, log the delegated decision and continue), and quick mode (no stop here; carry this step's decisions to the next quick-mode checkpoint).

1. **Show the results in the chat**, not only the file path: the premise audit (contradicted premises first), the brief's framing, the proposed problem statement with its word count, the checks table, each rejected framing in one line, and the business case with its weakest link. Then say where the full file is.
2. **Ask the decisions below.** Give your recommended answer for each, clearly marked as a recommendation.
3. **Ask how to continue**, offering: Continue to step 5, `mvp-scope-cutlist` · redo this step with changes · edit the output together · stop here.

Then wait for the user.

### Decisions for you

- "Which framing do we scope against? I recommend <X> because <one line>." This is the most consequential decision in the pipeline; don't let it pass as a formality.
- "Which contradicted premise do we drop, and which do we keep and test? I recommend <X>." (If the PM keeps one, log the evidence that would change their mind.)
- "Is this the one business number? I recommend <X> because <one line>." (If the chain mixes two outcomes, say which link breaks.)
- "Anything in the problem statement you'd say differently to the client's face?" (If the PM would soften it for the client, the softened version often hides the real problem; note both.)
