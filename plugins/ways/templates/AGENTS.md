# <Project>

<One paragraph: what this repo is and what it's part of.>

This repo uses Matt Pocock's skills with the `ways` plugin on top. The `## Agent skills` section below says where issues, labels and domain docs live; `docs/agents/issue-tracker.md` has this repo's conventions for specs, PRs and closing work.

## Where things are

This file is the only one read every time. Open the rest when the work needs them:

| | When |
|---|---|
| `README.md` | How to run it |
| `specs/operating-context.md` | Choosing or planning work: what matters this phase |
| `specs/charter.md` | Anything that touches scope or an invariant |
| `specs/brief/` | The discovery behind big work: what the problem is, and why this scope |
| `specs/prd/` | The spec an issue points to |
| `docs/ARCHITECTURE.md`, then `docs/adr/` | A change that crosses a part's boundary or a contract |
| `GLOSSARY.md` | Naming things: use its terms |
| `CODING_STANDARDS.md`, then `docs/standards/` | Writing or reviewing code: this repo's rules, then the shared standards and what checks each |
| `docs/standards/architecture.md`, "Proportion" | Designing or building a feature: how big it should be, measured against the closest one already here |

<Add the two or three files worth knowing before touching code, with when.>

## Gate

`<command>`: the same command CI runs, and the one in `.claude/ways.json`.

## How work goes

<!-- Owned by the ways plugin: /ways:setup replaces this section on every run. Change the flow in the plugin, not here; put repo-specific rules under "Rules for this repo". -->

Pick the path by what's known about the work. A person types each command; when one finishes, say which comes next.

| The work | Command |
|---|---|
| New and unsorted, or a pile of it | `/triage`. Optional: the commands below size an untriaged issue themselves |
| Problem not understood: a wish list of solutions, an idea, a half-built app nobody's sure about | `/ways:discover`, quick or deep, then `/ways:plan`. Documents go in `specs/brief/inbox/` |
| Known to be big: more than one ticket, or it changes an invariant or a contract | `/ways:plan #<n>`, then `/ways:build #<n>` |
| Known to be small: a bug, a small enhancement | `/ways:work #<n>`, for one issue or several (one at a time by default) |
| Typo-sized | Just do it: a PR labelled `no-issue` |

Big work is two commands, each ending in one PR a person merges:

- **`/ways:plan #<n>`**: requirements (from the discovery brief if there is one), worked out by prototyping, grilling or both, then the system-level design, in one sitting. The agreed prototype is kept as the mock. Ends in one spec PR: merging it agrees what it should do and how the system changes. Don't clear the session during a plan.
- **`/ways:build #<n>`**: tickets, then the code on one integration branch. Ends in the integration PR: merging it ships the feature. It resumes a build under way.

When different people do the two halves of a plan, `/ways:requirements` and `/ways:design` run them separately, with the PRD file as the hand-off. Pocock's skills run underneath (`grilling`, `domain-modeling`, `to-spec`, `to-tickets`, `implement-spec`, `code-review`, `triage`) and can still be typed on their own.

Skips, and only these:

- **No grill when the requirements are already written and agreed:** put them in the issue, or in a file it links to, and `/ways:plan` will ask.
- **Big work that stays inside one part and touches no contract, schema or data store:** the plan says so and writes "Design: no change of shape" into the PRD.
- Nothing else is skipped. If a step feels unnecessary, the work is probably one ticket, not big work.

Also: `/ways:explain` before working in code you don't know; `/ways:arch-review` at the start of a repo, before a big change, and every so often. The commands note what's worth improving as it happens, in this repo or in the method, and offer those findings at the end: repo ones as issues here, method ones as feedback to ways, each for you to accept, drop or add to. `/ways:feedback` sends feedback to ways any time.

**Working here with another agent** (Codex, say). The `/ways:*` commands are Claude Code skills, but everything they rely on is in this repo and GitHub, and holds for any agent: this file, the specs and standards, the tracker conventions in `docs/agents/issue-tracker.md`, the labels, one PR per ticket with `Closes #n` and a How to check, and the gate before every push. To run a command's steps, read its `SKILL.md` from the ways plugin (the folder for `ways:plan` is `skills/plan/`) and follow its intent, adapting what's Claude Code specific: the Skill tool, subagents, `${CLAUDE_PLUGIN_ROOT}` paths. No hook holds the gate for you, so run it yourself before each push. Say in the PR what you adapted or skipped.

## Working an issue

<!-- Owned by the ways plugin: /ways:setup replaces this section on every run. Put repo-specific rules under "Rules for this repo". -->

Use `/ways:work #<n>`. It runs interactively for `ready-for-human` and autonomously for `ready-for-agent`. An untriaged issue is fine: it sizes it, reproduces a bug, and posts the brief it will work to before you say go. For a whole spec at once, `/ways:build #<parent>`: it sets the autonomous marker itself so the gate holds, and builds one ticket at a time unless you ask for parallel (`docs/agents/issue-tracker.md` says why).

## Merging

**Dial:** learning <!-- learning | default | trusted: see the plugin's REVIEW-AND-MERGE reference. The engineering lead moves it. -->

- **Learning:** a person reviews every PR before it merges.
- High-risk paths are in `.github/CODEOWNERS` and need a code owner's approval whatever the dial says.

## Agent skills

### Issue tracker

Issues live in this repo's GitHub Issues, worked with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default roles, each label named as its role (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the root. See `docs/agents/domain.md`.

## Rules for this repo

<Only facts an agent can't infer: environment quirks, commands, invariants and the tests that prove them, things that must not be touched.>
