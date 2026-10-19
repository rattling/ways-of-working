# Ways of working

How I run software projects with Claude Code, packaged as a plugin: Matt Pocock's skills for the engineering disciplines, and on top of them the operating model a team needs to agree once. Specs in the repo, status in GitHub, interactive and autonomous modes with a gate that holds, merge policy by risk, and the PR body as the report.

## Install

```bash
claude plugin marketplace add anthropics/claude-plugins-official   # if you haven't already
claude plugin marketplace add rattling/ways-of-working
claude plugin install ways@ways-of-working
```

Installing `ways` also installs [`mattpocock-skills`](https://github.com/mattpocock/skills) from Anthropic's official marketplace, at the version that marketplace currently lists.

Then, in a repo, run `/setup-matt-pocock-skills` (accept GitHub, the default labels and single-context), then `/ways:setup`. It seeds the files and labels below, never overwrites what's there, and opens a PR. Run it again later to pick up a newer version; the repo is stamped with the version it was set up at.

A repo set up this way declares both marketplaces and plugins in `.claude/settings.json`, so anyone who opens it in Claude Code is offered the same setup.

## The flow

Big work goes in three parts: **requirements** (what and why), **design** (how, at system level), then **build**. Small work skips to build: the issue is the spec.

| Part | Skill | What comes out |
|---|---|---|
| | `/triage` | Each incoming issue briefed, or a precise request for information |
| **1. Requirements** | `/grill-with-docs`, then `/to-spec` | A PRD in `specs/prd/` (problem, user stories, scope) with a parent issue; terms in `GLOSSARY.md` |
| **2. Design** | `/ways:design` | The PRD's design sections (parts, contracts, data, seams, NFRs), `docs/ARCHITECTURE.md` updated, ADRs where earned. On the spec's branch, so one PR agrees both |
| **3. Build** | `/to-tickets`, then `/implement-spec` | Slices cut along the seams, one integration branch, one reviewed PR |
| | `/ways:work <issue> [interactive\|autonomous]` | One ticket: a PR whose body is the report, reviewed by `code-review` first |

The flow commands are typed by a person: Claude doesn't start them itself, because each is a point where someone decides to move on.

A feature needs a PRD only if it needs more than one ticket or changes an invariant or a contract between systems. Otherwise the issue is the spec.

## What a repo holds

| Where | What | Who owns it |
|---|---|---|
| `specs/` | `charter.md`, `roadmap.md`, `operating-context.md`, `prd/` | People |
| `GLOSSARY.md`, `docs/adr/`, `docs/ARCHITECTURE.md` | Language, decisions, shape | People decide; Claude drafts |
| `docs/agents/` | Where Pocock's skills find the tracker, labels and domain docs, plus this repo's conventions | Setup writes it |
| `docs/standards/` | Engineering standards: architecture, code, testing, security, delivery, the stack, and what checks each rule | Starts as the plugin's; the team makes it its own |
| Everything else | `AGENTS.md`, `CODING_STANDARDS.md`, `REVIEW.md`, `.github/`, `.claude/`, issues, PR bodies, tests | Claude builds; people review |

## What `ways` adds to Pocock's skills

- **`/ways:setup`:** the files above, including the standards, labels, a `pr-hygiene` CI check, settings, and this repo's conventions appended to Pocock's tracker config: PRDs as files, closing work through PRs.
- **`/ways:work`:** one issue in interactive or autonomous mode: branch, plan comment, early draft PR, `tdd`, `code-review` with every finding answered, risk tier, PR body, merge policy.
- **`/ways:design`:** the design part, which Pocock's flow goes from requirements to slicing without: the system-level how, grilled outside in (C4 context and containers, parts, contracts, data, seams, NFRs), written into the PRD, `docs/ARCHITECTURE.md` and ADRs.
- **`/ways:arch-review`:** a guided architecture walkthrough, lens by lens in the shape of TOGAF's ADM (plus the Well-Architected pillars for hosted systems), at the start of a repo, before a big change or at intervals. It ends in findings for people to turn into tickets, not documents.
- **Hooks:** a SessionStart hook that orients Claude in an opted-in repo, a Stop hook that won't let an autonomous run end on a red gate, and a nudge when the agent grows a file past about 500 lines.
- **Reference:** risk tiers, branching and merge policy, in `plugins/ways/reference/`.

## `ways-band`: a mod

An optional second plugin, and a small worked example of a [mod](https://code.claude.com/docs/en/plugins/mods/overview): JavaScript that runs inside Claude Code and can draw in its interface.

- **A band above the prompt** in an opted-in repo: `ways 0.3.0 · autonomous #3 · gate ✔ 2m ago · dial default · feature/3-walking-skeleton · context 42%`.
- **`/gate`** runs the repo's gate at once, without a Claude turn or any tokens, and records the result for the band.

`claude plugin install ways-band@ways-of-working`. Its code is one file, `plugins/ways-band/hooks/register.js`, with tests beside it (`claude plugin test` in that directory). Mods run unsandboxed with your permissions; this one reads a few files under `.claude/` and `AGENTS.md`, runs `git branch` and, on `/gate`, the gate.

[`WORKING-CONTRACT.md`](WORKING-CONTRACT.md) is the reasoning behind it: who owns what, and why.

## Make it yours

The standards are a starting point, and a team should end up owning its own. Pick one:

- **Edit the repo's copy.** `docs/standards/` belongs to the repo once setup has copied it. Enough for one repo or a small team.
- **Fork this repo.** Rewrite the standards and templates, point your repos' `.claude/settings.json` at your fork, and change it by PR with a version bump.
- **Add your own plugin on top.** Keep `ways` as it is and add a plugin for what's yours: your standards, and skills for your deploys, environments and internal services, loaded when needed. Distribute both through managed settings on a Teams or Enterprise plan.

Whichever you choose, keep the rule from `docs/standards/README.md`: a rule nothing checks is advice, so every rule you add says what enforces it.

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

## Licence

[MIT](LICENSE).
