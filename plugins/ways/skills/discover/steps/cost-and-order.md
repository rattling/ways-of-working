<!-- Step 5b of /ways:discover. Written for ways, in the shape of the discovery-to-mvp steps around it. -->

# Cost, benefit and order of work (pipeline step 5b)

Scope says what v1 is. Nobody can decide to build it until they know roughly what it costs, what it's worth, what could sink it and what to do first. Teams skip this because the numbers feel made up. They are rough, and that's fine, as long as each one says where it came from. A rough number with its working shown can be argued with. A missing one can't.

## Inputs

- `out/05-scope.md` (required): v1, candidate zero, the cut list, what's already built, the assumptions.
- `out/04-problem.md` (required): the business case, its chain, outcome, weakest link and why now.
- `out/01-data.md`, if it exists, for the inputs to the arithmetic.
- `context.md`: budget, team, deadlines.

## Process

### 1. Benefit, in numbers
Take the business case's outcome and chain, and put a number on each link that has one. Show the arithmetic in a line each ("about 40 orders a day [ASK-014] × 1 in 20 sent to the wrong address [DAT-03] × £35 to send again [DAT-04] ≈ £70 a day"). Label every input `evidence [ID]`, `brief` or `assumption`. Give a range when an input is shaky, and say which input moves the answer most. Count time saved only if someone would do something useful with it; say what.

### 2. Cost
Three kinds, each rough:
- **Build:** v1's T-shirt size (below), and what it's mostly made of.
- **Run:** hosting, licences, a service it depends on, and whose time keeps it going each week.
- **Change:** what people have to learn or stop doing, and how long the old way and the new way run side by side.

### 3. T-shirt size
For v1, and for the whole of the original ask, so the gap is visible:

| Size | Means |
|---|---|
| XS | No build: a change to how people work, or a few hours |
| S | Days of one person's work |
| M | One to four weeks for one developer |
| L | One to three months, or more than one developer |
| XL | More than that, or too uncertain to size: split it first |

Say what would move each size up or down.

### 4. Risks
Not the assumptions again: those are tested in step 6. These are the things that hurt even if every assumption holds:
- **People:** who loses something by this (status, a habit, control), and who has to change most.
- **Data and security:** personal data, where it will live, who can see it, what happens when a phone or a laptop is lost. Secrets or unsafe code in what's already built.
- **Running it:** who operates it, and what happens when they're away.
- **Timing:** a busy season, a deadline, a person leaving.
- **Dependencies:** a single person, vendor or integration everything rests on.

For each: what could happen, how likely, how bad, what reduces it, and who owns it. Five rows at most; more are a list nobody reads.

### 4b. Riskiest assumption
The one assumption that, if wrong, makes v1 pointless: usually step 4's weakest link, or the scope's assumption with the highest impact and least evidence. Say how to test it, and the kill signal. Step 6 builds a prototype for it if a prototype can test it; otherwise the order of work tests it some other way (a pilot, a measurement, a conversation).

### 5. Order of work
A numbered list, smallest useful step first. Candidate zero comes first unless there's a reason it can't. Then the prototype test from step 6, then v1 in slices, then what the cut list's "revisit when" triggers might bring in. For each step: what it proves or delivers, what decision it unlocks, and its size. A step that unlocks no decision is in the wrong place.

### 6. Recommendation
One line, one of: **go** (build v1 now), **test first** (do the first steps in the order and decide again), or **stop** (the benefit doesn't cover the cost, or the problem isn't the one worth solving). Then the one reason.

## Rules

- Every number carries its source: an ID, `brief` or `assumption`. No source, no number.
- Ranges over false precision. "£50 to £90 a day" beats "£71.40".
- The benefit counts what people would gain, not what the business would like to be true. If nobody named a cost (step 4's business case says so), the benefit is an assumption, and the recommendation is at most "test first".

## Output: `out/05b-case.md`

```
# Cost, benefit and order of work
## Benefit
| Link | Number | Working | Source |
Range: ... Most sensitive to: ...
## Cost
Build: ... Run: ... Change: ...
## Size
v1: <size>, because ... The whole original ask: <size>, because ...
## Riskiest assumption
<the assumption> · test: ... · kill signal: ...
## Risks
| Risk | Likelihood | Impact | What reduces it | Owner |
## Order of work
1. <step> — proves/delivers ... — unlocks ... — <size>
## Recommendation
go | test first | stop: <one reason>
```

## Stop here: show the results and ask how to continue

In deep mode this step always ends with a stop, including when the user said "run everything". Never start the next step, and never apply a decision, until the user answers. Two exceptions, both defined in `SKILL.md`: a delegated run (show the results, log the delegated decision and continue), and quick mode (no stop here; carry this step's decisions to the next quick-mode checkpoint).

1. **Show the results in the chat**, not only the file path: the benefit range with its most sensitive input, the sizes, the riskiest assumption, the risks table, the order of work and the recommendation. Then say where the full file is.
2. **Ask the decisions below.** Give your recommended answer for each, clearly marked as a recommendation.
3. **Ask how to continue**, offering: Continue to step 6, `prototype-brief` · skip the prototype and go to the hand-off · redo this step with changes · stop here.

Then wait for the user.

### Decisions for you

- "The benefit rests most on <input>. Is that believable, or should we check it first?"
- "Start with <first step in the order>?" (Recommend candidate zero when there is one.)
- "Go, test first, or stop? I recommend <X> because <one line>."
