---
name: prototype-brief
description: Ranks a v1's assumptions by risk and testability, picks the single riskiest one a prototype can test, and writes a build-ready prototype brief — one flow, realistic mock data drawn from the interviews, what's real vs faked, success criteria, a user test script and a paste-ready build prompt. Use after scoping and before building, or when someone asks "what should we prototype first".
---

# Prototype brief (pipeline step 6)

The instinct is to prototype the whole v1, or the most fun screen. Both waste the prototype. A prototype is a test: it should answer the one question that, if the answer is no, kills or reshapes v1. Everything else can be faked.

## Inputs

- `out/05-scope.md` (required), especially the Assumptions and Adoption plan sections.
- `out/02-extract-*.md` and `out/01-merged-*.md`, for realistic mock data.
- Build constraints from the user if any (tool: Claude Code, v0, Lovable; deploy target; time box). Default: Claude Code, deploy to Vercel, half a day.

## Process

### 1. Score the assumptions
Add the **weakest link** from the business case in `out/04-problem.md` to the list if scope doesn't already hold it. It is usually the assumption the whole bet rests on ("a client who understands the why approves faster"), and a prototype that tests only a workflow can pass while this one stays untested. If the prototype can't test it, say what would (a metric, a pilot, another interview) and put that in the "What this won't tell us" section.

For each assumption in `out/05-scope.md`:
- **Impact if wrong (1–5):** 5 = v1 is pointless; 1 = minor tweak.
- **Uncertainty (1–5):** 5 = no evidence either way, or evidence points against it; 1 = interviews directly confirm it.
- **Prototype can test it (0–2):** 2 = a clickable prototype in front of the persona answers it; 1 = partially; 0 = needs real data, real volume or a real integration.

Priority = impact × uncertainty × testability. Show the table sorted by priority.

Desirability and usability assumptions usually win, because prototypes test them well. Feasibility assumptions usually need a technical spike instead; say so and recommend one rather than forcing a prototype.

### 2. Pick one
State the chosen assumption and turn it into a **test question** a session with one user can answer: "Will a chef answer a substitution question in WhatsApp before the van leaves, instead of finding out when she opens the boxes?"

Say what the prototype will **not** tell you (the next two assumptions on the list), so nobody over-reads the results.

### 3. Design the single flow
- **Entry point:** exactly where the user starts, matching the adoption plan (e.g. a mocked WhatsApp message with a link or reply buttons).
- **Steps:** 3 to 7 numbered actions from entry to end state.
- **End state:** what's visibly true when they're done.
- **Screens:** at most 4. Name each and list what's on it.
- **Second persona:** if the problem is a seam, include one screen or panel showing what the other side sees as a result of the first user's action (e.g. the account manager's view of the feedback that just arrived, already structured). This is often the "aha" for stakeholders.

### 4. Specify mock data
Realistic, from the interviews. Use real names of things the personas mentioned (brands, products, rules, dates, volumes), so a test user recognizes their world. Specify:
- Entities and counts (e.g. 1 restaurant, tonight's order of 32 items, 2 items out of stock with a suggested substitute).
- Specific values that make the test bite (e.g. the item the customer said matters most, and a substitution that breaks it).
- Format: a single JSON file in the prototype, described field by field.

### 5. Real vs faked
Two columns. Real = whatever the test question depends on (the click path, the feedback form, what happens after approve). Faked = everything else (auth, uploads, notifications, AI, the vendor's internal tools). Faking is a decision, not a shortcut; write why each fake is safe.

### 6. Success criteria
Observable in a 15-minute session, with thresholds, e.g.:
- Answers at least one substitution without asking how.
- Confirms the order, or explicitly changes it, within 3 minutes.
- Says, unprompted, what will arrive tomorrow.
- Doesn't ask to install anything or log in.
And one **kill signal**: the observation that would mean the assumption is wrong.

### 7. Test script
3 tasks phrased as goals, not instructions ("Batch 32 just arrived. Do whatever you'd normally do with it."), then 3 follow-up questions, including "What would you do if this link didn't exist?"

### 8. Build prompt
A paste-ready prompt for the builder containing: the flow, screens, mock data spec, real-vs-faked, stack constraints (single app, no backend unless the flow needs persistence, mock data in one JSON file, works on a phone, no login), visual direction in two lines, and "build only this flow; anything else is out of scope".

## Output: `out/06-prototype-brief.md`

```
# Prototype brief
## Assumptions ranked
| # | Assumption | Type | Impact | Uncertainty | Testable | Priority |
## The one we test
Test question:
What this won't tell us:
## Flow
Entry point / Steps / End state
## Screens
## Mock data
## Real vs faked
## Success criteria and kill signal
## Test script
## Build prompt
```

## Stop here: show the results and ask how to continue

This step always ends with a stop, including when it runs inside a full pipeline or the user said "run everything". Never start the next step, and never apply a decision, until the user answers. The one exception is a delegated run, as the orchestrator defines it: show the results, log the delegated decision and continue.

1. **Show the results in the chat**, not only the file path: the top three ranked assumptions, the test question, the flow steps, the success criteria and the kill signal. Then say where the full file is.
2. **Ask the decisions below.** Give your recommended answer for each, clearly marked as a recommendation.
3. **Ask how to continue**, offering: Continue to step 7, `prototype-build-critique` · redo this step with changes · edit the output together · stop here.

Then wait for the user.

### Decisions for you

- "I picked assumption #<n>. The runner-up is #<m> because <one line>. Test #<n>?"
- "Anything in the mock data a real client would find off?"
