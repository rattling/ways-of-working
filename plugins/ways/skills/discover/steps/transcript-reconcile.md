---
name: transcript-reconcile
description: Cleans and merges one or two auto-generated transcripts of the same call into a single trustworthy transcript with correct speaker attribution, glossary fixes, numbered turn IDs and a log of every judgment call. Use before any interview synthesis, when transcripts come from Zoom, Meet, Otter, Granola or similar, when speaker labels look wrong, when two transcripts of one call disagree, or when a transcript needs translating.
---

# Transcript reconcile (pipeline step 1)

Auto-transcripts lie in two ways. Speaker diarization puts one person's words in another's mouth, and speech-to-text mangles product names and claims. If you synthesize a raw transcript, the synthesis inherits both errors, and you won't see them because the summary looks confident. This step produces the one file every later step quotes from.

## Inputs

- One or two transcripts of the **same call** in `raw/`. Formats vary (Zoom `.txt`/`.vtt`, Otter export, Meet doc, pasted text).
- The glossary from `context/brief.md` (product names, tool names, acronyms, people's names).
- Optional: a speaker code for each person (default: first three letters of the interviewee's first name, uppercase, e.g. `TAM`). The interviewer is always `INT`.

If you're handed transcripts of two different calls, process each call separately and produce one merged file per call.

**One source only, or a source that is already merged.** Sometimes there is no second transcript to reconcile (a single export, or a merge someone did in an earlier session). Don't invent a second source. Diagnose the one you have, say in the diagnosis that it is single-source or pre-merged, keep any merge notes it carries, add turn IDs, apply the glossary and log every change. If the source has no timestamps, number the turns without them and say so in the header. If it contains a translation, see step 8.

## Process

### 1. Inventory and diagnose (don't assume which source is better)

For each source, sample at least 8 turns spread across the call and check:
- **Attribution:** Are questions attributed to the interviewer? Are there turns where one "speaker" asks a question and answers it in the same breath? Does a turn switch from "you" to "I" mid-way? Are first-person stories ("my walk-in", "my partner") ever attributed to the interviewer?
- **Wording:** Glossary terms spelled right? Sentences that don't make sense in context? `[inaudible]` gaps?
- **Coverage:** Start and end times. Does one source stop early or skip a stretch?

Write a two-line diagnosis per source, e.g. "Source A: labels reliable, wording poor (glossary terms mangled, 3 inaudible gaps). Source B: wording reliable, labels wrong in at least 4 places, recording ends at 07:45."

### 2. Align

Match turns across sources by timestamp first, then by content. Timestamps drift by a few seconds between tools; match on content when they disagree.

### 3. Merge, turn by turn

- **Speaker:** take it from the source with reliable labels. Where both are unreliable, decide from content (who would plausibly say "I do the walk-in at eleven thirty"?), and log it as a judgment call.
- **Words:** take them from the source with reliable wording.
- **Where the sources disagree on content** (not just spelling), keep the more specific version and log the disagreement.
- **Where only one source covers a stretch**, use it, apply glossary fixes, and log that the stretch is single-source.
- **Split turns** that a diarizer merged (a question and its answer in one turn). **Join turns** it split mid-sentence.

### 4. Fix terms with the glossary

Replace mangled glossary terms ("harvest lime" → "Harvest Line", "stock wise" → "Stockwise"). If no glossary was given, infer likely terms from context, apply them, and mark each inferred term in the merge notes as `inferred`. Never "fix" a word that isn't clearly a glossary term.

Watch for **meaning-changing** errors: words that are real words but wrong ("energy table" for "allergy table"). These matter more than spelling. Flag every one.

### 5. Mark reconstructions

- Anything you reconstructed (filled an `[inaudible]` from the other source, or repaired a garbled phrase from context) goes in square brackets: `[sous-chef]`.
- Anything you can't recover stays `[inaudible]`. Don't guess silently.

### 6. Light cleanup only

- Remove pure stutters ("the the") and transcription artifacts.
- **Keep** hedges, fillers that carry meaning, laughs, pauses and self-corrections: "Maybe half? Maybe less, if I'm honest." Hedges are data for step 2.
- Don't correct the speaker's grammar. Don't summarize. Don't drop small talk; it's short and sometimes revealing.

### 7. Number the turns

Give every turn an ID: speaker code + three-digit sequence over the whole call, e.g. `[INT-001]`, `[TAM-002]`, `[INT-003]`. Sequence numbers are shared across speakers so IDs sort in call order. Keep the original timestamp after the ID. The interviewer's code `INT` repeats in every call, so `INT-025` can mean a different turn in each. In any file that covers more than one call (collisions, problem, scope, audit, deck), cite an interviewer turn with its call: `INT-025 (TAM)`. A per-persona extract may cite it bare.

### 8. Translate if needed

If the call isn't in the working language, produce the merged transcript in the working language and keep the original wording of any turn longer than a sentence or containing a key claim in a collapsible line under it (`> Original: …`). Log translations of idioms as judgment calls.

### 9. Self-check before writing

- Count turns per speaker in each source and in the merge. Explain any difference (splits, joins, single-source stretches).
- Search the merge for every glossary term in its mangled forms. None should remain.
- Read every interviewee turn and confirm it's first-person-plausible for that speaker.

## Output: `out/01-merged-<CODE>.md`

```
# Merged transcript — <Interviewee name>, <role> — <date>
Sources: <file A> (<diagnosis>), <file B> (<diagnosis>)
Speakers: INT = <interviewer>, <CODE> = <interviewee>
Turns: <n> (INT <n>, <CODE> <n>)

[INT-001] 00:00:03 Thanks for making the time...
[TAM-002] 00:00:11 Sure. I have until the fish guy comes...

---
## Merge notes
| # | Turn | Type | What I did | Confidence |
|---|------|------|-----------|------------|
| 1 | TAM-041 | attribution | Source B gave this to the interviewer; it's a first-person story and Source A has it as Tamar | high |
| 2 | TAM-029 | meaning | "energy table" → "allergy table"; context is the sesame-free bread | high |
| 3 | TAM-056..062 | coverage | Source B ends at 06:55; these turns are single-source from A with glossary fixes | medium |

Types: attribution, wording, glossary, glossary (inferred), meaning, reconstruction, split/join, coverage, conflict, translation.

## Check these first
The 3 notes where a wrong call would change what we conclude, with one line each on why.
```

Put attribution and meaning fixes at the top of the merge notes. Those are the ones that change conclusions.

## Stop here: show the results and ask how to continue

This step always ends with a stop, including when it runs inside a full pipeline or the user said "run everything". Never start the next step, and never apply a decision, until the user answers. The one exception is a delegated run, as the orchestrator defines it: show the results, log the delegated decision and continue.

1. **Show the results in the chat**, not only the file path: the two-line diagnosis of each source, the turn counts, and every note in "Check these first" with the original text and the merged text side by side. Then say where the full file is.
2. **Ask the decisions below.** Give your recommended answer for each, clearly marked as a recommendation.
3. **Ask how to continue**, offering: Continue to step 2, `persona-extract` · redo this step with changes · edit the output together · stop here.

Then wait for the user.

### Decisions for you

- "These three judgment calls change what the interview says. Confirm or correct them." (List them from "Check these first".)
- If a glossary was inferred: "I assumed these terms. Right?"
