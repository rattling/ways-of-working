---
name: discover
description: Part 1 of 4 of big work, before requirements, for when the problem isn't understood yet (a wish list, an idea, interview notes, a half-built app). Works out who hurts and how we'd know it's fixed, the as-is and to-be workflows, personas, the MVP and what to cut or throw away, risks, cost and benefit, a T-shirt size and an order of work. Quick or deep. Ends in a brief in specs/brief/ and an intake issue for /triage.
disable-model-invocation: true
---

# Discover

Big work goes in four parts: discovery, requirements, design and build. This is the first, and the only one that's optional: for when nobody can yet say what the problem is. The usual sign is that the ask is a list of solutions ("a portal, a dashboard, an app like the big firms have"), or that something has been built and nobody is sure it's the right thing. Requirements written from that are a guess written down carefully.

Discovery works from evidence: what people said, what the data shows, what's already been built. It ends in a one-page brief in `specs/brief/<slug>/` and an intake issue labelled `needs-triage`, and the usual flow takes over: `/triage`, then `/ways:requirements`, `/ways:design` and `/ways:build`.

The steps are adapted from [discovery-to-mvp](https://github.com/oferregev81pt/discovery-to-mvp) 1.2.0 by Ofer Regev (MIT; licence in `LICENSE-discovery-to-mvp`, changes in `NOTICE.md`). Its hard parts are unchanged: separating what people said from what their stories show, finding where people collide, framing the problem without a solution in it, and a cut list you can defend. ways adds a quick mode, sources beyond transcripts, as-is and to-be workflows, a keep-or-delete pass over what's already built, cost and benefit with an order of work, and the hand-off.

Discovery is part 1 of 4 of big work: follow `${CLAUDE_PLUGIN_ROOT}/reference/PARTS.md`. Check state first (a brief or an open `discovery/` PR for this problem means carry on, not start again), open with where you are, and end, at the hand-off, with the merge sentence.

## Pick a mode

`/ways:discover [quick|deep] [where the sources are]`

Both modes produce the same front page, from the same steps, with the same decisions. Quick does the thinking and skips the paperwork: fewer files, shorter tables, fewer stops. Aim for under an hour of the person's time and a working file they can read in ten minutes.

| | Quick | Deep |
|---|---|---|
| Stops for decisions | Three checkpoints (below) | After every step |
| Working files | Two: `out/q1-heard.md` and `out/q2-decide.md` (below) | One per step, as each step file says |
| Sources | Cited where they are, as `[CODE:line]` into `raw/`; no merged copies | Numbered into merged files; two transcripts of a call reconciled into one |
| Checking quotes and IDs | By reading | Mechanically, with a script (step 2's self-check) |
| Rows per table | Capped (below) | As many as the evidence holds |
| Fresh-eyes check at hand-off | Do it yourself | A subagent |
| Prototype | Offered at checkpoint 2; built only if the person says yes | Brief, build and an independent critique |

With no sources given, ask for the mode first, then point at the inbox (Where things go, below).

If the person didn't say, recommend one and ask once. **Deep** when there are recordings, more than two personas, a contested problem with real money at stake, or a reader senior enough to pick holes. **Quick** otherwise, and for a first pass that a deep run can follow.

### Quick mode

Read the step files for what each part means and how to judge it, then write the results into two files instead of one per step. Where a step file says to write its own file, quick mode writes the matching section of these instead.

- **`out/q1-heard.md`** (steps 1–3), in this order: the data's numbers with how each was worked out (`[DAT-nn]`); what's already built, one line per part (`[BLT-nn]`); for each persona: who, their top pains (three at most, each with a quote, severity and whether it was prompted), their workarounds, their numbers set against the data, what must not change, and their silences; then where they collide (four rows at most), what neither mentioned, the as-is diagram, and the top three tensions.
- **`out/q2-decide.md`** (steps 4, 5 and 5b): the premise audit (contradicted premises only), the problem statement, the framing rejected in a line each, what solved looks like (a line per persona), the business case (outcome today and target, chain, weakest link, why now); candidate zero, v1 in a sentence, in scope (five rows at most), the centrality check in a line, v1 does not, the to-be diagram and the gap, the cut list (eight rows at most), keep or delete for what's built, the adoption plan (entry point and what happens if people ignore it), assumptions (six at most), "Argue with me" (two items); then benefit with its working, cost, sizes, the riskiest assumption, risks (four rows at most), order of work and the recommendation.

**Citing in quick mode.** List each source in `context.md` with a short code (`ASK`, `PRI`, `DAT`); a code can name a person, so two people in one file get a code each, pointing at the same file. Cite a line by its code and line number in `raw/` or `private/` (`[PRI:12]`), and data and what's built by their `DAT` and `BLT` IDs. Every rule about IDs in the step files is met by these.

**Checkpoints.** Run the steps in order without stopping, then stop at:

1. **After `q1-heard.md`** (what we heard): the as-is diagram, each persona's top pain with its evidence, where people collide, where what was said and the data disagree, and any premise of the ask that the evidence already contradicts. Decisions: who the key persona is, which side v1 favours in each top tension, and which gaps to carry as assumptions.
2. **After `q2-decide.md`** (what to do): the problem statement and the framing rejected, the business number today and its target, candidate zero, v1 and the to-be diagram, the cut list, what to keep or delete from what's built, the benefit, the sizes and the recommendation. Decisions: the framing, one push back on the scope, go, test first or stop, and **whether to prototype**. Always offer it, so the person knows it's on the table: name the riskiest assumption, say whether a clickable prototype could test it (and if not, what would), and offer a prototype brief (step 6) or a brief and a build (step 7). When v1's result is something people look at, also offer a mock of the to-be screens with `/ways:mock`'s method: one clickable page with real data, often the quickest way to agree the to-be. Recommend one only when the assumption is about whether people can or will use it.
3. **The hand-off's approval** of the front page, which holds in every mode.

At a checkpoint, ask its decisions above, plus any step decision whose answer would change the outcome; the rest stand as your recommendations, logged as such. Log each checkpoint as one entry, headed `## Checkpoint N`.

## Where things go

```
specs/brief/inbox/   where the person drops documents. Git-ignored except its README; empty once sorted
specs/brief/<slug>/
  README.md        the front page, written last by the hand-off
  context.md       what we're exploring, who we heard from, the sources, glossary, constraints
  raw/             shareable sources as given (committed). Read-only: never edit, rename or delete
  private/         personal sources as given (git-ignored), and deep mode's merged copies of them. Read-only too
  out/             the working: one file per step in deep mode, two in quick
  out/decisions.md who decided what, and why
  prototype/       only if step 7 runs
```

`<slug>` names the problem area in a few words, not a feature, and is never `inbox`. Wherever a step file says `raw/`, it means `raw/` or `private/`, whichever the source is in. Before step 1:

- **Find the sources.** If the person didn't give them, say: "Put your documents in `specs/brief/inbox/` and tell me when they're there, or give me a folder and I'll try to read it from there." Sources are interview notes or transcripts, the ask (an email, a brief, a wish list), data (exports, reports), and anything already built. If a folder outside the repo can't be read (a permission prompt refused, or blocked by settings), give the inbox instruction once and wait; don't retry in a loop.
- **Sort each source as it leaves the inbox**, once the slug is known. Move it, so the inbox ends empty apart from its README:
  - **Shareable** (data exports, a written-up ask, notes with no names, code): to `raw/`, which is committed.
  - **Personal** (interview notes or transcripts with names, customer data): to `private/`, which is git-ignored.

  When it isn't obvious, ask once per file: "This one has names in it. Keep it private?" Before moving anything to `private/`, check that `.gitignore` has `specs/brief/*/private/` and `specs/brief/inbox/*` (a repo set up before ways 0.12 won't); add what's missing and say so. A source given as a folder elsewhere is copied in and sorted the same way. Material too sensitive to copy at all (another company's documents, say) can stay where it is: list where in `context.md`.
- **Deep mode's merged copy of a private source is private too**: write `01-merged-<CODE>.md` for it in `private/`, not `out/`. Later steps quote it as usual; the hand-off checks those quotes.
- **Write `context.md`** if it's missing. Ask for what the sources don't say: the problem space in two or three sentences; why it matters to the business and which number it should move (or "none named yet"); who was heard from (name, role, which side); whether each conversation was real or roleplayed; what the team currently believes about the people involved; why now (or "none named yet"); terms and product names (the glossary); constraints (team, time, budget, data you do or don't have); what's already built and where. List every source with its code and where it is (`raw/`, `private/`, or outside the repo), so a reader knows why they can't open the private ones. Half a page is enough. Read the sources first, so you only ask what they can't answer.

## The steps

Load each step's file when you reach it, from `${CLAUDE_PLUGIN_ROOT}/skills/discover/steps/`, and follow it. Its rules are stricter than this file and take precedence, except where the mode table above says quick mode does less.

| # | Step | File | Writes (deep mode) |
|---|---|---|---|
| 0 | Interview guide (optional: no sources yet) | `interview-guide.md` | `out/00-interview-guide.md` |
| 1 | Sources: number them, reconcile transcripts, read data and what's built | `transcript-reconcile.md` | `out/01-merged-<CODE>.md`, `out/01-data.md`, `out/01-built.md` |
| 2 | Each persona's evidence | `persona-extract.md` | `out/02-extract-<CODE>.md` |
| 3 | Where they collide, and the as-is workflow | `persona-collide.md` | `out/03-collisions.md` |
| 4 | The problem, its outcome and business case | `problem-framing.md` | `out/04-problem.md` |
| 5 | v1, candidate zero, to-be, cut list, keep or delete | `mvp-scope-cutlist.md` | `out/05-scope.md` |
| 5b | Cost, benefit, size, risks, order of work | `cost-and-order.md` | `out/05b-case.md` |
| 6 | Prototype brief: the riskiest assumption as a test | `prototype-brief.md` | `out/06-prototype-brief.md` |
| 7 | Build the prototype, then critique it | `prototype-build-critique.md` | `prototype/`, `out/07-critique.md` |
| | Hand-off: the front page and the intake issue | `hand-off.md` | `README.md`, the issue, the PR |

All steps append to `out/decisions.md`. The step files say "the PM": that's whoever is running discovery.

## How to run

1. **Find where we are.** If `specs/brief/<slug>/out/` exists, the highest-numbered complete file is the last finished step (in quick mode, `q1-heard.md` then `q2-decide.md`); carry on from there. If the person asked for a step, check its inputs exist first, and if one is missing, say which step makes it.
2. **Run one step**, from its file.
3. **Stop and show the results** (deep mode), or carry on to the next checkpoint (quick mode). At a stop, show the step's key results in the chat, then its decisions as numbered questions, each with your recommended answer, worded so that "yes" accepts it. Then wait. **Never go past a stop on your own**, even when the person asked to "run the whole thing": that means take me through it.
4. **Log the decision** in `out/decisions.md`:
   ```
   ## Step N: <step name> — <date> <time>
   - Decision: <what was decided>
   - Made by: <their name, or "the person running discovery">
   - Why: <one line, in their words when they gave a reason>
   - Changed in the output: <one line per file, `path: what changed`, or "nothing">
   ```
5. **Apply the decision** to the step's file before moving on.

There's no unattended mode. If nobody is there to answer, finish the current step, post its results and questions, and stop.

**Delegated run.** If the person says in chat to go on without asking ("take your recommendations", "run the rest without me"), that is an instruction, and the only way past a stop. Show each step's results anyway, take your own recommendation at each stop, and log it as `Made by: <person> (delegated: "<their words>")`, with "took its own recommendation" as the reason. Don't invent their reasons. Where a step says to ask and no source answers, assume, label it `assumption`, and log it. Where a decision asks for push back on your own work, take the "Argue with me" item you're least sure of, reconsider it against the scoping rules, and either change the scope or log why it stays. It ends when they send a message that changes the plan. It never covers the hand-off's approval, or anything outward-facing: opening issues or PRs, deploying, sharing, sending, spending.

## Rules that hold across every step

- **Finding facts is your job**, never the person's. Read every source, work out the data's numbers, read what's been built. Ask only for what no source holds.
- **Traceability.** Every claim about what a person said or did carries an ID from step 1, like `[PRI-006]` (or `[PRI:12]` in quick mode); every number from data carries a `DAT` ID. A claim with neither is labelled `Interpretation:`, or deleted.
- **Raw stays raw.** Never edit `raw/` or `private/`. Quotes are checked against the merged files (deep) or the sources (quick).
- **Private stays private.** Nothing from `private/` or the inbox is committed. Quotes in `out/` are the person's words, so the hand-off checks them for names and details that shouldn't go in git.
- **Verbatim means verbatim.** Quote marks are for a person's words or the ask's, copied exactly. Hedges ("maybe half, maybe less") are data: keep them.
- **No solutions before step 5.** Park them in a `Parked ideas` line; step 5 picks them up.
- **Challenge the starting point.** The ask's premises are checked against the evidence in step 4, and whenever a later step contradicts one. Say so as soon as you see it, before anyone has to push.
- **The key persona's biggest complaint is the spine.** It appears in the problem statement and as a core part of v1, or the scope says in writing why not.
- **Data beats memory.** Where what people said and what the data shows disagree, keep both and trust the data unless there's a reason not to. Which way people were wrong is a finding.
- **The model proposes, the person decides**, and the decision log shows who.
- **Plain writing.** Short sentences, concrete nouns, numbers over adjectives.
- **This repo might be public.** Client names and client material go only where the repo's owner has said they may.

## When it ends

The hand-off is the last step in both modes. After it, give three lines: the problem in one sentence, the recommendation and its first step, and the intake issue. Then say what's next: `/triage #<n>`.
