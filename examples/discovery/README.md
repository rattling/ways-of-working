# Sample discovery pack: Brightwater

A made-up case for practising discovery: the step before requirements, where you work out what the problem is, who has it, and what's worth building. Brightwater, its people and its numbers are fictional.

It's for workshops, and it's the test case for `/ways:discover`: a run on this pack should find what `FACILITATOR.md` lists.

## The situation

Brightwater is a heating and plumbing firm with nine engineers and two office staff. The owner wants "an app" and has sent a wish list. A relative has already built part of it. You've been asked to pick it up.

## The objective

Come out with a brief someone could build from:

1. **Problem and outcome.** Whose problem, and how we'd know it's fixed.
2. **As-is and to-be workflows**, and the gap between them.
3. **Personas**, two or three, as far as they change decisions.
4. **Scope.** The MVP, what's explicitly out, and what to throw away from what's been built.
5. **Risks, cost and benefit**, a T-shirt estimate, and a rough order of work.

## What's here

| File | What it is |
|---|---|
| `brief.md` | The owner's email: a wish list, mostly solutions |
| `notes/office.md` | Interview notes with the office manager |
| `notes/engineer.md` | Interview notes with an engineer |
| `evidence/jobs-export.csv` | A sample of 30 of the roughly 240 jobs in two weeks, across four engineers, from the office spreadsheet |
| `evidence/job-sheet.md` | One paper job sheet, transcribed |
| `app/` | What's been built so far. Open `app/index.html` in a browser; the logins are in `app/auth.js` |
| `FACILITATOR.md` | What a good discovery finds. **Don't open it until you've done yours.** |

## Running it

1. Copy this folder into an empty repo, so the brief you write lands in that repo's `specs/brief/`.
2. Run `/ways:discover` and answer as the people in the notes would. Where the notes don't say, make a sensible call and write it down as an assumption.
3. Compare your brief with `FACILITATOR.md`.

About 90 minutes in a group: 15 to read, 60 to run discovery, 15 to compare.
