<!-- Last step of /ways:discover. Written for ways. -->

# Hand-off (last step)

Discovery is finished when someone who wasn't there can read one page and decide what happens next, and when the work is in the tracker where the rest of the flow picks it up. This step writes that page and opens that issue. It adds nothing new: every claim on the page comes from `out/`.

## Inputs

- Everything in `out/`, at least `04-problem.md`, `05-scope.md` and `05b-case.md`.
- `out/decisions.md`.
- `${CLAUDE_PLUGIN_ROOT}/skills/discover/brief-template.md`.

## Process

### 1. Write the front page
Fill the template into `specs/brief/<slug>/README.md`. Take each section from the step that made it: problem and outcome from step 4, the diagrams and personas from steps 3 and 5 (as-is from 3, to-be and the gap from 5), scope from 5, risks, cost, benefit and order from 5b, the riskiest assumption from 6 if it ran, otherwise from 5b. Open questions come from every step's "neither mentioned", unanswered decisions and assumptions that need a person to check.

Rules for the page:
- **Readable alone in five minutes.** Someone who reads only this page knows the problem, the recommendation and the first step. Cut detail that lives in `out/`; link to it.
- **Nothing new.** If writing the page shows a gap (a number with no source, a capability with no evidence), fix it in the step's file first, log the fix in `out/decisions.md`, then copy it across.
- **The numbers match.** Every number on the page is the one in `out/`.
- **The diagrams render.** Mermaid `flowchart LR`, quoted labels where they contain punctuation.
- **Plain words.** No IDs in the opening paragraph; IDs are fine in the sections below it.

### 2. Check it with fresh eyes
Give a subagent only the front page and this question: "What would you decide from this, and what's missing for you to decide it?" Fix what it finds that the evidence supports, and when you show the page, say what it found and what you changed. In quick mode, do this check yourself if there's no subagent, and say so.

### 3. Agree it
Show the page in the chat, or its path and its opening paragraph if it's long, and ask the person to approve it or say what to change. This stop holds in every mode, including a delegated run: the page goes into the tracker next, where other people see it. Ask about `raw/` (below) in the same message. One approval covers the page, the commit, the issue and the PR.

### 4. Commit and open the intake issue
1. **Check what's in `raw/` before committing.** Interview notes and exports can hold personal data or another company's material. Ask whether `raw/` belongs in this repo. If it doesn't, leave it out (add it to `.gitignore`), and say in `context.md` where the sources are kept instead.
2. On a branch `discovery/<slug>`, commit `specs/brief/<slug>/`.
3. Open the intake issue, labelled `needs-triage`, titled with the problem (not a feature). The body is short:
   ```
   <The problem statement.>

   **Recommendation:** <go | test first | stop>. **First step:** <step 1 of the order>. **v1 size:** <size>.

   Brief: specs/brief/<slug>/README.md
   ```
   If an issue already asks for this work (the request discovery started from), use it instead of a new one: put the lines above at the top of its body, keep the original below, and add `needs-triage`.
4. Put the issue number in the page's **Intake** line, commit, and open a PR titled `discovery: <title>`, with `Refs #<n>` and a `## How to check` section: read the front page, and check its numbers against `out/`. A person merges it; that's the brief agreed.
5. With no GitHub remote, skip the issue and the PR, write `not filed yet` on the **Intake** line, and give the person the issue text to file.

### 5. Say what's next
`/triage #<n>`. Triage sizes it from the brief. Big work goes on to `/grill-with-docs`, which starts from this brief instead of from scratch, then `/to-spec`, `/ways:design` and the build. If the first step in the order of work needs no code (candidate zero), say so: it's a change for the team to try, not a ticket.

## Output

`specs/brief/<slug>/README.md`, the intake issue and the PR. Log the approval in `out/decisions.md`.
