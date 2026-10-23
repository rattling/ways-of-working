---
name: mock
description: A clickable HTML mock of a visual result (a page, a screen, a flow, a printout, a chart), with real sample data, iterated with a person until it's agreed, then kept with the PRD as the picture the build must match. For big work inside /ways:plan (after the grill, before the PRD), and for /ways:discover's to-be screens. Throwaway, never the build.
disable-model-invocation: true
---

# Mock

Spec text is bad at saying what something looks like. A ten-minute mock with real data settles questions a page of prose leaves open: what an empty or unknown value looks like, whether the layout survives the real number of rows, whether the thing is even the right shape. Make one whenever the result of the work is something people look at, before the spec is written, so the spec can point at it.

Input: what the work is (the issue, or the requirements just grilled), and where the real data is. Called from `/ways:discover` (its step 7, or the to-be screens at quick mode's checkpoint 2): the to-be workflow, the prototype brief if there is one, and the brief so far, from `out/`. Discover's step 7 uses only section 2 below: its test prototype is run with users, not iterated with one person.

In requirements, if discovery left a test prototype that passed (`specs/brief/<slug>/prototype/index.html`), start from it: it's the first draft, so the rounds begin from what users already tried.

This isn't Pocock's `prototype`. That one answers a design question by exploring options (several UI variations, or a state machine you can drive) and stays off main. A mock is the one agreed picture, kept with the spec. If the person doesn't yet know which of several directions they want, run `prototype` first and mock the one they pick.

## 1. Read first

- The requirements: the issue, the grill's notes, `GLOSSARY.md` for the words on screen.
- **Real data.** Seeds, fixtures, a sample export, the schema. Use real rows wherever the repo has them, including the awkward ones: the longest name, the missing value, the most rows. Invented data hides exactly the cases a mock is for. Never use personal data: use the repo's seed or sample data, or make realistic data from the schema and say so.
- Anything already on screen today that this sits beside, so the mock matches its look.

## 2. Build it

One HTML file that opens from disk with a double-click.

- **Clickable.** The buttons, links and tabs that matter move between the screens and states the work involves: the main path, the empty state, an error, the edge case the grill argued about. A picture that can't be clicked doesn't show a flow.
- **Self-contained.** Inline CSS and JavaScript, the data embedded as a JSON block, no build step, no backend, nothing fetched. State lives in memory.
- **Printed results get print CSS.** If the result is printed, add `@media print` and `@page` (the real paper size and orientation) and check it in the real browser's print dialog (Chrome, Ctrl+P), in mono if it will be printed in mono: a headless PDF can paginate differently.
- **Marked as a mock.** A small fixed label: "Mock: not the build". At the top of the file, an HTML comment saying what it's for, where the data came from, and the decisions it settles.
- **Skip the polish.** No framework, no tests, no handling beyond what keeps it clickable.

## 3. Iterate with the person

Show it: open it in the browser pane if there is one, or give the path to double-click, with a screenshot. Then ask about what the mock decides, in Pocock's rounds: numbered questions, each with your recommended answer, worded so "yes" accepts it. Ask about the decisions, not the colours: what an unknown value looks like, what happens at the most rows, what's shown first, what's left out.

Change it and show it again. Two or three rounds is normal. Keep a short list in the top comment of what changed each round and why: those are the decisions, and they're what the spec needs.

## 4. Agree it and keep it

When the person says it's right:

- **Save it with the spec.** Big work: `specs/prd/<feature-slug>-mock.html`, on the spec's branch, which `/to-spec` then creates or reuses. From `/ways:discover`: `specs/brief/<slug>/prototype/index.html`, and the brief's front page links it.
- **Hand the decisions on.** `/to-spec` references the mock in the PRD (Pocock's PRD allows a prototype snippet where it says a decision better than prose) and copies the decisions it settled into the PRD's text, so they don't live only in the picture.
- **Tickets check against it.** A ticket's **Human verification** becomes "matches the mock" plus what to compare: "open `specs/prd/<slug>-mock.html` beside the built page; same columns, same empty and unknown states; Chrome, Ctrl+P, A3, mono, 1 page".
- **It's never the build.** The build matches it. It doesn't copy its code.

Say what was agreed in a few lines and what comes next: back to `/ways:plan` (or `/ways:requirements`), which writes the PRD with `/to-spec`, or back to `/ways:discover`'s next step.
