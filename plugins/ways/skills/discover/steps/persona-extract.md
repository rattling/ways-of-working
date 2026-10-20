---
name: persona-extract
description: Pulls one persona's evidence out of a merged interview transcript — pains with verbatim quotes and severity, workarounds, numbers, prompted vs unprompted signals, stated vs revealed gaps, what must not change, and conspicuous silences — every line tied to a turn ID. Use after transcripts are cleaned, when someone asks what a customer or stakeholder "really said", or before comparing personas.
---

# Persona extract (pipeline step 2)

A summary tells you what someone said. An extract tells you what you can rely on. The difference: it separates what came up on its own from what the interviewer put in their mouth, it separates the person's stated priorities from what their stories show, and it records what they never mentioned.

Run once per persona. If several interviews share a persona, run once over all of them and note which interview each line comes from.

## Inputs

- `out/01-merged-<CODE>.md` for this persona (required). If only raw transcripts exist, stop and suggest running `transcript-reconcile` first; quoting raw transcripts carries their attribution errors forward.
- `context/brief.md`, for what the team expected to hear, the beliefs it lists, and whether the call was real or roleplayed. If it was roleplayed, add a line at the top of the extract: `Roleplayed call: accounts are plausible, not representative.` Scores stay evidence-based, and nothing counts as prevalence.

## Process

Read the whole transcript once without writing. Then go through it turn by turn.

### 1. Who they are
Role, team size, how long they've been in the relationship, scale numbers (volumes, frequencies). Only what they said. Then the call: its recorded length and how it was captured (one source or two). A booked slot is not the recorded length; later steps and the deck quote the recorded length.

### 2. Mark every interviewer question as open or leading
A leading question names an answer ("Would a dashboard help with that?"). Any answer to a leading question is **prompted**. A pain the person raised before being asked about that topic is **unprompted**. Unprompted signals weigh more. List the leading questions you found; the PM needs to know.

### 3. Pains
For each pain:
- One-line description in plain words.
- The best verbatim quote and its turn ID. Add a second ID if they came back to it.
- **Prompted / unprompted.** Write `prompted (INT-nnn, leading)` for a pain raised only in answer to a leading question. **Hard cap: such a pain scores 1, whatever else the evidence says.** Check every row of the table against this before writing the file.
- **Severity 1–3**, scored from evidence, not tone:
  - 3 = they built a workaround, OR it cost money/time they can name, OR it happened and had a consequence (a launch missed, a fine, a complaint made to them). A consequence has to be an event the person reports first-hand: who did what, about what, at least once. A habit ("he complains", "they get annoyed") is not an event; with no workaround or named cost it scores 2 at most. Say which in the evidence.
  - 2 = recurring and they can say how often, but no workaround or named cost.
  - 1 = mentioned once, no frequency, no consequence, or only in answer to a leading question.
- **Pain type: operational or confidence.** Operational pains (lost requests, manual relays, missing status) leave workarounds and costs, so the scale above finds them. Confidence pains (they don't understand why something was done, can't tell if it's the right thing, feel it's random) rarely produce a workaround, so the scale under-scores them. Tag each pain with its type. **Override:** a pain the person raised unprompted and named as their biggest problem, or came back to without being asked, scores at least 2, and the extract flags it `Named top pain` so steps 4 and 5 can't bury it. State the override in the evidence for severity.
- Evidence for the score in a few words ("keeps a private sheet since month two").

### 4. Workarounds
The strongest signal in discovery. Anything they built or do by hand to cope: a spreadsheet, DMing instead of using the thread, copy-pasting between tools, checking things nobody asked them to check. For each: what it is, how long they've done it, what it costs them, and the turn ID.

### 5. Numbers
Table of every number, count, frequency, duration or percentage they said, with the turn ID and the exact words. Keep their hedges ("maybe half, maybe less").

### 6. Stated vs revealed
Where what they **say** differs from what their **stories** show. Typical patterns:
- Says something is rare or fine, then describes it happening a lot ("the quality is good" vs "I just eat it, four hundred a month").
- Names one thing as the biggest problem, but most of the call is about another.
- Uses a solution word ("visibility", "a dashboard") whose meaning, from their stories, is something else.
- Says they're on top of something, then hedges ("mostly").

Each row: Stated (quote + ID) | Revealed (quote + ID) | Interpretation (labelled as such).

### 7. Their own "biggest problem"
Quote it in full with its ID. Then one line: does the rest of the interview support it, contradict it, or sharpen it?

### 7b. Trust and satisfaction, split by object
When the person says they trust, like or are happy with something, find out what it is attached to. Trust in a **person** ("I just trust my rep"), in the **process** (things arrive on time), in the **output** (the deliveries are good) and in the **reasoning** (I understand why you made this) are different claims, and one can sit next to a complaint about another. For each trust or satisfaction statement write: object | quote [ID] | any complaint about a different object [ID]. Don't summarize it as "trusts us". If the only trust is in one person, note that the trust doesn't transfer to the product or to anyone else on the team.

### 7c. Business consequence
For each pain scored 2 or 3: did the person say what it costs the business or the relationship (work moved elsewhere, a renewal at risk, a launch missed, hours, money)? Quote it with an ID, or write `none named`. Don't infer a consequence from tone. This feeds the business case in step 4.

### 8. Likes / must not change
What they explicitly value. Include warnings ("please don't replace Avi with a robot", "no new apps"). These become constraints in step 5.

### 9. Other people they mention
Anyone else in the loop (a partner who pays the invoices, a sous-chef who receives deliveries, a warehouse picker). Who they are, what they do in the workflow, how their input travels. Hidden relays matter.

### 10. Silences
Topics the brief expected, or that the workflow obviously includes, that this person never raised. For each: what was expected, and whether the interviewer asked (if asked and dodged, quote it). Only list silences that matter for the problem space; don't pad.

### 11. Their words
5 to 10 short verbatim phrases worth reusing in problem statements and product copy ("evidence folder", "a lottery every morning").

### 12. Recent changes (triggers)
Anything the person says has changed lately, is about to change, or forces a decision soon: a season, a volume, a new menu, a new rule, a new competitor, a failed earlier attempt, a deadline. One row each: what changed, when, why it makes this problem worse or more urgent for them, and the turn ID. Don't infer a trigger the person didn't mention. If there is none, write `none named`. This feeds the "why now" in step 4 and the deck.

## Rules

- Every line from sections 3–9, 11 and 12 has a turn ID. No ID, no line.
- Interpretations are allowed only inside fields labelled `Interpretation:`.
- No solutions. If one occurs to you, add it to a `Parked ideas` line at the end.
- Don't merge two different pains because they sound alike. "I can't find my old orders" and "my late change wasn't seen" are different problems with different fixes.

## Self-check before showing it

Don't trust your own quoting. After writing the extract, check it mechanically (a short script is fine):
- Every turn ID exists in `out/01-merged-<CODE>.md` and is the turn that says the thing. Count and cite by the ID printed there, not by position.
- Every quoted string is a substring of the merged transcript (allowing `...` for a cut). Paraphrases go without quote marks.
- Every "unprompted" label has an earlier turn ID showing no question about the topic came first, and every "prompted" label names the leading question (`INT-nnn`).
Fix what fails, then say in the chat how many quotes and IDs you checked. In a test run of this plugin, a first draft had wrong turn IDs and non-verbatim quotes that only this check caught.

## Output: `out/02-extract-<CODE>.md`

```
# Extract — <Name>, <role>
Source: out/01-merged-<CODE>.md
## Who
## Leading questions in this interview
## Pains
| # | Pain | Type | Quote [ID] | Prompted? | Severity | Evidence for severity |
## Workarounds
## Numbers
## Stated vs revealed
## Their biggest problem, in their words
## Trust and satisfaction, by object
| Object (person / process / output / reasoning) | Quote [ID] | Complaint about another object [ID] |
## Business consequence
| Pain # | What it costs the business or relationship [ID] |
## Must not change
## Other people in the loop
## Silences
## Recent changes (triggers)
| What changed | When | Why it makes this worse or more urgent [ID] |
## Their words
Parked ideas: ...
```

## Stop here: show the results and ask how to continue

This step always ends with a stop, including when it runs inside a full pipeline or the user said "run everything". Never start the next step, and never apply a decision, until the user answers. The one exception is a delegated run, as the orchestrator defines it: show the results, log the delegated decision and continue.

1. **Show the results in the chat**, not only the file path: the top three pains with quote, turn ID and severity (and any `Named top pain`); the leading questions you found; the stated-vs-revealed rows; the trust table; and the silences. Then say where the full file is.
2. **Ask the decisions below.** Give your recommended answer for each, clearly marked as a recommendation.
3. **Ask how to continue**, offering: Continue to step 3, `persona-collide` (or extract the next persona first) · redo this step with changes · edit the output together · stop here.

Then wait for the user.

### Decisions for you

- "Here's the one pain I scored highest and why. Does that match your read of the call?"
- If any leading questions were found: "These answers were prompted, so I've down-weighted them. Agree?"
