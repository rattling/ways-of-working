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

```
New and unsorted, or a pile of them   →  /triage            (optional: the commands below size an issue themselves)
Problem not understood                →  /ways:discover, then /ways:plan
Known to be big                       →  /ways:plan #n, then /ways:build #n
Known to be small                     →  /ways:work #n      (one or several, one at a time by default)

/ways:discover   → the brief                person merges the discovery PR    documents in specs/brief/inbox/
/ways:plan #n    → the PRD, what and how    person merges the spec PR          requirements, a mock if visual, then design
/ways:build #n   → tickets, then code       person merges the integration PR   resumes a build under way
/ways:work #n    → one reviewed PR          sizes, reproduces and briefs a raw issue, then waits for go

Any time         prototype (explore options) · /ways:explain (learn a repo) · /ways:arch-review (health check)
```

Each command is typed by a person: Claude doesn't start them itself, because each is a point where someone decides to move on. Each one looks for its own output before starting, so it never redoes a step, opens by saying where you are ("Planning the allergen chart (#12)"), and ends with the one PR to merge, what merging it means, and the next command.

A plan is one sitting: requirements then design, with one merge at the end. When different people do the halves (a product person grills, an engineer designs), `/ways:requirements` and `/ways:design` run them separately, with the PRD file as the hand-off.

Pocock's skills run underneath and can still be typed on their own: `/ways:plan` runs `grilling`, `domain-modeling` and `/to-spec`; `/ways:build` runs `/to-tickets`, `/implement-spec` and `code-review`. These commands call them and add this repo's conventions; they don't copy them.

The full table, with what counts as big work and the only two skips, is [How work goes](plugins/ways/templates/AGENTS.md#how-work-goes). It's written once: `/ways:setup` copies it into every repo's `AGENTS.md`, the SessionStart hook reads it from there, and `/triage` sizes against it.

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
- **`/ways:work`:** one small issue (or several, one at a time by default) in interactive or autonomous mode: branch, plan comment, early draft PR, `tdd`, Pocock's `code-review` with every finding answered, risk tier, PR body, merge policy. From a raw issue it sizes it first (big work goes to `/ways:plan`), reproduces a bug before anything else, and posts the brief it will work to before you say go.
- **The flow commands** (`/ways:discover`, `/ways:plan`, `/ways:build`, and `/ways:requirements` and `/ways:design` for split planning) share three rules in `plugins/ways/reference/PARTS.md`: look for the output before starting, open with where you are, end with the one merge and the next command.
- **`/ways:plan`:** requirements and design in one sitting. Sizes an untriaged issue first, asks whether written requirements should go in as they are or be grilled, runs Pocock's grill (`grilling` and `domain-modeling`) from the issue and its discovery brief, offers a mock when the result is visual, writes the PRD's what to disk before designing (so a compaction loses nothing), then designs: C4 context and containers, parts, contracts, data, seams, NFRs, into the PRD, `docs/ARCHITECTURE.md` and ADRs. One spec PR, merged once.
- **`/ways:requirements` and `/ways:design`:** the two halves of a plan, for when different people do them.
- **`/ways:build`:** with no tickets yet, asks once whether to go straight from cutting them into the build, then `/to-tickets` (every ticket gets a Human verification line) and `/implement-spec` on `integration/<feature>`, with the autonomous marker set for you. With tickets, it starts; with a build under way, it resumes.
- **`/ways:discover`:** before a plan, for the work that arrives as a list of solutions or a half-built app. It works from interviews, notes, data and whatever's been built (your documents in `specs/brief/inbox/`) to a one-page brief and an intake issue. Sources that name people go to a git-ignored `private/` folder; the rest are committed with the brief. Quick mode stops three times; deep mode stops after every step and checks every quote. Built on Ofer Regev's [discovery-to-mvp](https://github.com/oferregev81pt/discovery-to-mvp) (MIT), with ways adding the workflows, cost and benefit, the order of work and the hand-off. [`examples/discovery/`](examples/discovery/) is a sample case to practise on, with an answer key.
- **`/ways:mock`:** for work whose result people look at (a page, a flow, a printout, a chart): one clickable HTML page with the repo's real data, iterated with a person two or three times, then kept beside the PRD as the picture the build must match. A ticket's human check becomes "matches the mock". `/ways:discover`'s test prototype is built the same way but used the other way round: run with users against a kill signal, not iterated until someone likes it. If it passes, it's the mock's first draft. Mocks come after the decisions, look like the finished product, and carry a guided tour (a step per decision, an architecture toggle, a reset): [`examples/mocks/`](examples/mocks/) has three.
- **`/ways:arch-review`:** a guided architecture walkthrough, pillar by pillar in the shape of a Well-Architected Review (reliability, security, cost, operational excellence, performance), at the start of a repo, before a big change or at intervals. It ends in a critique for people to turn into tickets: what holds, the one that would sink it, the gaps by pillar, smaller questions.
- **Hooks:** a SessionStart hook that orients Claude in an opted-in repo, a Stop hook that won't let an autonomous run end on a red gate, and a nudge when the agent grows a file past about 500 lines.
- **Reference:** risk tiers, branching and merge policy, in `plugins/ways/reference/`.

## `ways-band`: a mod

An optional second plugin, and a small worked example of a [mod](https://code.claude.com/docs/en/plugins/mods/overview): JavaScript that runs inside Claude Code and can draw in its interface.

- **A band above the prompt** in an opted-in repo: `ways 0.7.0 · autonomous #9 · 2 of 9 · gate ✔ 2m ago · dial default · feature/3-walking-skeleton · context 42% · usage 5h 34% · wk 9%`.
- **`/gate`** runs the repo's gate at once, without a Claude turn or any tokens, and records the result for the band.
- **A `usage` tool for the agent** (`mcp__ways-band__usage`): this session's plan usage windows (five-hour and weekly), which the agent can't read itself, so an autonomous run can report them in its integration PR. It answers for its own session; up to 0.3.0 the mod wrote them to `.claude/ways/usage`, which every session in the repo overwrote. Where Claude Code has no reading (off a subscription, and possibly some plan types), the band leaves usage out.

`claude plugin install ways-band@ways-of-working`. Its code is one file, `plugins/ways-band/hooks/register.js`, with tests beside it (`claude plugin test` in that directory). Mods run unsandboxed with your permissions; this one reads a few files under `.claude/` and `AGENTS.md`, writes `.claude/ways/last-gate`, offers the agent its `usage` tool, runs `git branch` and, on `/gate`, the gate.

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
