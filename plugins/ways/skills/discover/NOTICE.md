# Where this skill comes from

`/ways:discover` is built on **discovery-to-mvp** by Ofer Regev: <https://github.com/oferregev81pt/discovery-to-mvp>, version 1.2.0 (commit `ac080f6`), under the MIT licence in `LICENSE-discovery-to-mvp`.

The files in `steps/` started as that plugin's step skills, copied unchanged in one commit so the history shows every change since. Most of their text is still his.

## What ways changed

- **One skill, two modes.** His orchestrator became `SKILL.md`, with a quick mode (three checkpoints, lighter checking) beside his step-by-step mode, which is deep mode here. Each step's "stop here" says so.
- **Layout.** Everything for one discovery lives in `specs/brief/<slug>/`; `context/brief.md` became `context.md`.
- **Sources beyond transcripts** (step 1): typed notes, the ask itself, data worked into numbers, and what's already been built.
- **Data beside what people said** (step 2): stated numbers set against measured ones.
- **The as-is workflow as a diagram** (step 3), and **the to-be workflow and the gap** (step 5).
- **The outcome's value today and its target** (step 4).
- **Candidate zero** (step 5): what would change without building anything, first in the order of work.
- **Keep, rework or delete** for what's already been built (step 5).
- **Cost, benefit, size, risks and order of work**: a new step, 5b, `cost-and-order.md`.
- **Prototype defaults**: static files that open from disk, no deploy by default.
- **The hand-off**: a new last step, `hand-off.md`, writing the front page from `brief-template.md` and opening an intake issue for `/triage`.

## Left out

His optional later steps are not here: `future-ideas`, `mvp-story-deck` and `pipeline-audit`. Install his plugin alongside if you want them.
