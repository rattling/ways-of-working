<!-- Step 7 of /ways:discover. Adapted from `prototype-build-critique` in discovery-to-mvp 1.2.0 by Ofer Regev (MIT; see ../LICENSE-discovery-to-mvp). -->

# Prototype build and critique (pipeline step 7)

Two phases with different mindsets. Phase A builds exactly what the brief says and nothing more. Phase B forgets it built anything and reviews the work the way a demanding stakeholder would. Doing the critique in the same breath as the build produces a gentle grade; separate them.

## Inputs

- `out/06-prototype-brief.md` (required for phase A)
- `out/04-problem.md`, `out/05-scope.md` (required for phase B)
- `out/05b-case.md` (phase B).
- Optional for phase B: any proposal doc or slide deck the PM wrote from these outputs. If one exists, critique it too; it's what reviewers will actually read.

## Phase A — Build

1. **Read the brief's build prompt and screens.** Build only the flow described. If you think something is missing, write it in `prototype/NOTES.md` instead of building it.
2. **Build it the mock way, as a test** (added by ways): follow section 2 of `${CLAUDE_PLUGIN_ROOT}/skills/mock/SKILL.md`, so there's one way to build in ways, but not its iterate-until-agreed rounds. A mock converges on what one person likes; a test prototype is run with users as it is, and has to be able to fail. One clickable HTML file at `prototype/index.html` that opens from disk, the brief's mock data embedded in it exactly as specified, no backend, no auth, working at phone width if the persona is on a phone. Override only if the brief says otherwise. Pocock's `prototype` skill is an alternative when the question is about logic or state rather than a flow.
3. **Mock data first.** Write the data from the brief's spec before any UI. Check it contains the values that make the test bite (e.g. the items that are out of stock).
4. **Build the entry point first**, then the flow in order, then the second-persona view if specified.
5. **Make the end state obvious.** After the last action, the screen should show what changed in plain words.
6. **Walk the flow yourself.** Open it, go through every step of the brief's flow, and check each success criterion is something a user could actually do on screen. Fix what isn't.
6b. **Check it can fail** (added by ways). The script doesn't name the answer the user has to find; the facilitator does none of the user's steps (choosing, typing, signing); each kill signal is something that could happen on these screens; and invented data the persona would spot (part numbers, prices, product names) is marked to check with them first. Fix the script or the build where it can't fail.
7. **README.** `prototype/README.md`: what it tests (the test question), how to run it, what's faked, the test script copied from the brief, and what happens next: if the test passes, this file is `/ways:mock`'s first draft in requirements; if it fails, scope (step 5) is redone.
8. **Deploy only with the user's go-ahead.** Ask before deploying it anywhere, public or not. Don't put real client names or data in a public deploy.

Phase A ends with a stop: show the results and ask (see the end of this file) whether to run the critique now. Don't start phase B on your own.

## Phase B — Critique

Run this in a fresh context when possible: a subagent, or a new session, given only the files listed in Inputs plus the running prototype. It shouldn't see the build conversation. If neither is available, run it anyway and put `Not run in a fresh context.` as the first line of `out/07-critique.md`; the review will be gentler than an independent one, and the line says so.

Take the role of a head of product who has to approve this work and has ten minutes. Be specific and unsentimental. Praise only what deserves it, in one line.

Check, in this order:

1. **The why.** Can you find, in one sentence each, why the customer gets value and why the business gets value? Quote the sentences. If either is missing or vague ("improves the experience"), that's the top issue. Rewrite it from the evidence.
1b. **Is the story about the exercise or about the product?** Does the proposal take a position on where the product goes in a year and what it could become for the customer and the business, or does it only answer the brief? Quote the sentence that states the direction. If there isn't one, that is a top issue for a senior-level reviewer: recommend adding it to the scope's "First step of" section. Also check that nothing the proposal says about the customer ("they trust us", "they love it") is stronger than the evidence in the extracts.
2. **Evidence to scope.** Pick the three most important v1 capabilities. Does each trace back to a pain or collision with turn IDs? Flag any that don't.
3. **Does the prototype test the assumption?** Walk the flow against the test question. Could a user session actually produce the kill signal? A prototype that can't fail isn't a test.
4. **Adoption.** Does the entry point match the adoption plan? Would the persona who said "no new logins" have to log in?
5. **What's missing that a reviewer will ask about.** Cost to run, who operates it, what happens when users ignore it, the next step if the test passes. Check `out/05b-case.md`: is the benefit's arithmetic believable, and is the order of work smallest-first?
6. **What to cut.** Sections, slides, features or sentences that add length but not argument.
7. **AI-sounding writing.** Go sentence by sentence through any prose meant for people (proposal, deck, README, UI copy). Flag sentences that read as generated. Common tells:
   - Stock vocabulary: seamless, leverage, robust, empower, streamline, elevate, unlock, holistic, game-changer, delve, crucial, landscape.
   - "Not just X, but Y" and "It's not about X, it's about Y."
   - Groups of three adjectives or three parallel clauses used for rhythm, not content.
   - Em dashes as the default punctuation; colons introducing a reveal.
   - Throat-clearing: "It's important to note", "In today's fast-paced world".
   - Abstract nouns where a concrete example belongs ("friction" instead of "Tamar's sous-chef texts her photos of boxes at 7 a.m.").
   - Uniform sentence length; every paragraph the same shape.
   For each flagged sentence give the rewrite. Rewrites use the personas' own words where possible.

## Output: `out/07-critique.md`

```
# Critique
<If not run in a fresh context, one line saying so.>
## Verdict
Two sentences: would you approve this to go to a client test, and the single biggest reason.
## Top issues (ranked)
| # | Issue | Where | Why it matters | Fix |
## The why, rewritten
Customer value: ...
Business value: ...
## Does the prototype test the assumption?
## Cut
## Sentences to rewrite
| Original | Problem | Rewrite |
## What a reviewer will ask
```

Limit top issues to five. If there are more, the extra ones go in a short "also" list.

## Stop here: show the results and ask how to continue

In deep mode this step always ends with a stop, including when the user said "run everything". Never start the next step, and never apply a decision, until the user answers. Two exceptions, both defined in `SKILL.md`: a delegated run (show the results, log the delegated decision and continue), and quick mode (no stop here; carry this step's decisions to the next quick-mode checkpoint).

1. **Show the results in the chat**, not only the file path: after phase A: how to run the prototype and a short walk through the flow as built; after phase B: the verdict, the top issues table and the rewritten "why". Then say where the full file is.
2. **Ask the decisions below.** Give your recommended answer for each, clearly marked as a recommendation.
3. **Ask how to continue**, offering: After phase A: run the critique (phase B). After phase B: continue to the hand-off · redo this step with changes · edit the output together · stop here.

Then wait for the user.

### Decisions for you

- "Which of the top issues do you fix before showing this?" (Recommend fixing issue 1 and any AI-writing in the first page; the rest can wait.)
- If not yet deployed: "Deploy the prototype now?"
