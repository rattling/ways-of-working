# Ways of working

How I set up and run software projects. Repo structure, light architecture, the delivery loop,
and the engineering standards worth writing down once and reusing.

Most of this predates coding agents and would be worth doing without them. It is written for an
agent to read, for two reasons. An agent reads it at the start of every session, where a person
reads it once and then works from memory, so it has to be accurate rather than aspirational. And
writing it for something that cannot infer context forced me to make explicit a lot of things I
had been carrying in my head.

## What's here

**Project setup.** What a repo needs so someone arriving cold can work in it: what the project
is for, where the architectural lines are, what the gate is, what to read first.

**The working contract.** How work is specified, delegated, verified and handed back. Who
decides what. What "done" means.

**The delivery loop.** Issues, branches, PRs, reports. Light, and the same everywhere.

**Light architecture.** A charter, an architecture note, ADRs for the decisions that are
expensive to reverse. Enough to stop the same argument happening twice, not enough to become a
documentation project.

**Engineering standards.** Currently a couple of lines in the AGENTS section: clear contracts at
module boundaries, small cohesive modules, tests for behaviour rather than implementation. This
is the part I expect to grow, general stances on contracts, interfaces, and how much structure
a system actually needs. Not language or cloud specifics; those go in
[lore](https://github.com/rattling/lore).

## The two things a repo needs

| # | What | Where |
|---|---|---|
| 1 | An entry point read at the start of every session | `AGENTS.md`, see [`AGENTS-SECTION.md`](AGENTS-SECTION.md) |
| 2 | Work tracked as issues, kept true as part of doing it | GitHub Issues |

Everything in [`guidance/`](guidance/) is optional and says when it's worth having. Declining
any of it is fine.

## The parts that do most of the work

**Split ownership explicitly.** The human owns outcomes, problem semantics, product intent,
architectural boundaries and acceptance. The agent owns planning, implementation, refactoring,
tests, docs, tooling and git hygiene. Neither asks permission inside its own half. Most of the
wasted turns I see are one of two mistakes: asking about something you own, or quietly deciding
something you don't.

**Make the brief the unit of work.** Five fields: outcome, context, guardrails, acceptance,
human verification. If one is missing, ask once and then proceed on a stated assumption. If it
is written as a *how*, push back, because the how belongs to whoever is building it.

**Have one definition of done.** The PR is merged, the issue is closed, and a session report is
posted. Not "ready when you are".

## Using it

Tell your agent:

> Read `https://raw.githubusercontent.com/rattling/ways-of-working/main/INITIATE.md`
> and follow it for this repo.

Works on a new repo or an existing one. [`INITIATE.md`](INITIATE.md) has merge rules, so
existing content is folded in rather than replaced. Run it again later to pick up changes; it
stamps a version so a session can tell whether a repo is behind.

No install, no package, no server. It is markdown at a URL. Anything that depends on a local
path only works for the person who wrote it.

## The files

| | |
|---|---|
| [`WORKING-CONTRACT.md`](WORKING-CONTRACT.md) | Ownership, the brief, escalation, verification, done, documentation altitude. Cross-repo: symlink it to `~/.claude/CLAUDE.md` or `~/.codex/AGENTS.md`. |
| [`AGENTS-SECTION.md`](AGENTS-SECTION.md) | The section that goes in a repo's `AGENTS.md`: issues, labels, branches, PRs, reports, standards. |
| [`INITIATE.md`](INITIATE.md) | What an agent reads to apply this to a repo. |
| [`guidance/`](guidance/) | Charter, architecture, ADRs, lore, seed spec, operating context. Optional. |
| [`enforcement/`](enforcement/) | A GitHub Action and label conventions for the parts worth enforcing. |

## Where it came from

About 14 projects and 550 work items run this way, including a delivery tool built specifically
to enforce it. That tool is now parked. The practices did not need it.

Four things I got wrong the first time:

I put enforcement in the tracker. It refused to mark work done until the PR was merged and the
checklist ticked, which sounds strict but achieves very little, because the PR merges whenever
it likes. The tracker's opinion arrives after the only irreversible step. A required CI check on
the PR is harder to skip and does not care which tool produced the diff.

I listed the documents a project ought to have. Nobody wrote them, including me. Each optional
document now says when it is worth having, and that version gets used, because the trigger
arrives at the moment the document would help.

I distributed the pack by local path. Repos were told to read from a directory in my home
folder, which worked for exactly one person and silently rotted for everyone else.

I relied on rules rather than reports. An agent will skip work it can skip invisibly, and so
will a person. The obligation that actually holds is to say what you did and did not do, at the
moment someone is deciding whether to accept it.

## Related

[**lore**](https://github.com/rattling/lore) is the technical counterpart: patterns, gotchas and
architectural lessons that outlive the project that taught them.

If it is about running a project it belongs here. If it is about building the thing it belongs
there.

## Licence

[MIT](LICENSE).
