---
name: setup
description: Set up a new repo, or retrofit an existing one, to work the ways-of-working way on top of Matt Pocock's skills. Re-run it to pick up a newer version.
disable-model-invocation: true
---

# Set up a repo

Seed the files, labels and settings the method expects, without losing anything already here. The result is a PR a person reviews.

As you go, note anything that pops out worth improving, in this repo or in ways, and when you hand over, log the run and offer the repo findings: `${CLAUDE_PLUGIN_ROOT}/reference/FEEDBACK.md`. Setup is often the first ways command run in a repo, so it's where the method's rough edges show most, and where the repo's gaps first come to light.

## 1. Look before writing

- Plugin version: the `version` in `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json`.
- Repo stamp: `.claude/ways.json`. If its `version` matches the plugin's, say the repo is current and stop, unless the person asked for something specific.
- Pocock's config: `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, `docs/agents/domain.md`, and an `## Agent skills` section in `AGENTS.md` or `CLAUDE.md`. Whatever is missing, this skill writes in step 4; the person doesn't need to run `/setup-matt-pocock-skills`. Note what's already there: someone may have run Pocock's setup with other choices, and those stay.
- The remote: `git remote -v` should point at GitHub. If it doesn't, stop: PRs and their checks run on GitHub, whatever the tracker.
- Where issues live, from `docs/agents/issue-tracker.md`. A `## Where issues live: ` heading names the choice (GitHub, local markdown or other), and this run keeps it. A file with the ways conventions but no such heading is from before the choice existed: it's GitHub. Otherwise it's a first run, and step 2 asks.
- Existing material: `AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/`, `specs/`, `GLOSSARY.md`, any charter, roadmap, milestones file, ADRs, PR or issue templates, CI workflows, `Makefile` or other gate commands.
- `gh repo view` and `gh label list`, to confirm the CLI works and see what labels exist.

## 2. Propose, then act

**On a first run, ask where issues live** before anything else, in one question: GitHub Issues (the default), local markdown files under `.scratch/`, committed with the code, or other (Linear, Jira, anything Claude can reach). If Pocock's setup already wrote `docs/agents/issue-tracker.md`, offer its choice as the default instead. A re-run never asks.

**Other** takes a paragraph from the person: the tracker, the project or team, the CLI or connector Claude reaches it through (already signed in), and how an ID is written. Try one read through it: list a few open issues. If it works, say what came back. If it fails, say plainly what failed (the command and its error, or the connector that isn't there) and ask whether to record the tracker anyway. On no, stop here until they've fixed it or chosen another tracker.

Tell the person, in one short list, what you will add, what you will move, and what you will leave alone. Wait for a yes. Then work on a branch named after the version it sets up, `chore/ways-<version>` (for example `chore/ways-0.30.0`), so a later run never trips over an earlier run's branch. If that branch already exists, an earlier run of this same version was cut short: carry on from it rather than starting again.

## 3. Seed from the templates

Templates live in `${CLAUDE_PLUGIN_ROOT}/templates/`. For each one, except `overlays/` and `labels.txt` (and `.github/ISSUE_TEMPLATE/` when issues aren't in GitHub):

- **Missing:** copy it in.
- **Present:** never overwrite. Merge what's missing into it, or leave it and list it in the report.
- **Equivalent content elsewhere** (for example `docs/CHARTER.md`, `docs/MILESTONES.md`, `arch/ARCHITECTURE.md`): propose moving it with `git mv` into the expected place, keeping its content. Content that mixes durable and phase-specific material, such as a charter with this quarter's goals in it, gets split: durable parts to `specs/charter.md`, the rest to `specs/operating-context.md`. If unsure, ask.

`specs/` belongs to people. Fill only what you can take from existing material, mark anything you drafted with `<!-- draft: confirm -->`, and leave the rest as the template's prompts. Don't invent purpose, invariants or priorities.

`docs/ARCHITECTURE.md`: draft it from the code as it is, marked as a draft. An empty repo keeps the template.

`.github/workflows/gate.yml`: set its runner and add the stack's steps before the gate, from `docs/standards/delivery.md`, "CI by stack", for the stack the code shows or the person names (in a repo with no code yet, ask). An existing `gate.yml` on the wrong runner for its stack (`ubuntu-latest` for .NET Framework, which can't build there) is changed the same way, or, if it does more than the template, listed in the report with the change written out.

`docs/standards/`: copy the shared files and only the stack files this repo uses (`php.md`, `dotnet.md`); if its stack has none, say so in the report. Fill a stack file's **Today** line from the code, marked as a draft, and leave **Moving to** for people. A repo that already has standards keeps them: list what overlaps in the report rather than merging. The one addition: what the plugin's shared files have and the repo's lack, since the commands point at it. A section, by its `##` heading (`architecture.md`'s "Proportion", say, for a repo set up before it existed), is appended to the repo's file; a rule, by its bold lead ("**In proportion.**" in `code.md`), goes at the end of its list; a row of the standards README's tables, at the end of its table. Leave every section that's there as it is, and list what was added in the report so the team can edit or drop it.

**A new repo starts with a walking skeleton.** If there's no code yet, the roadmap's first milestone is the walking skeleton, and the report suggests its issue: the thinnest end-to-end path through the real stack, showing one real thing from the real data store, with the gate running locally and in CI, on the runner its stack needs (`docs/standards/delivery.md`, "CI by stack": `windows-latest` for .NET Framework). If the app has screens, the skeleton also sets its look (`docs/standards/code.md`, "One look, set once"): the design tokens, `color-scheme: light` (light by default; dark or a toggle only if someone asks), the page background and a styled shell, so the first visual feature builds on a frame instead of inventing one. It also brings a dev seed with realistic demo data (`docs/standards/delivery.md`).

**Existing code without a working gate starts with a gate skeleton.** If there's code but no gate that can run (no tests, no way to run it locally, no CI), the first milestone is the gate skeleton, and the report suggests its issue. Its outcome: the app runs locally (containerised, if today it only runs on a hand-built server); characterisation tests pin the behaviour that matters most, as it is now, bugs included, with suspected bugs listed as issues rather than fixed; and the gate runs locally and in CI. Until then the gate is a placeholder, and the report says so.

**A dev seed.** If the app has screens or an API a person tries by hand, but no dev seed (`docs/standards/delivery.md`), list it as a gap in the report and suggest its issue: a seed that lets someone try the existing features, worked by `/ways:work`. If the repo's `delivery.md` came from ways with the shorter seed rule, replace that bullet with the current one.

**Signing in.** If the app has sign-in, check that `AGENTS.md` or the README says how an agent signs in locally with test credentials (`docs/standards/delivery.md`, the dev seed). If neither does, list it as a gap in the report and suggest its issue: test accounts in the seed, and a line in `AGENTS.md` saying how to sign in as each. If the repo's `docs/standards/delivery.md` came from ways and lacks the test-account bullet, add it, and likewise the "docs move with the code" bullet.

**The look.** If the app has screens but no shared design tokens, no `color-scheme` or no styled shell (`docs/standards/code.md`, "One look, set once"), list it as a gap in the report and suggest its issue: a "theme and shell" ticket, done before the next visual feature. If the repo's `docs/standards/code.md` came from ways and lacks that bullet, add it.

**CI that burns minutes.** If the repo already has `.github/workflows/gate.yml` (or another workflow running the gate) that runs on every `pull_request` with no `branches: [main]`, runs on drafts, or has no `concurrency` cancelling, say so in the report and suggest the template's version: under `/ways:build` it runs 25 to 40 times a feature instead of 3 to 5 (`docs/standards/delivery.md`, "CI is sized on purpose"). Don't change the workflow in the setup PR; list it, with the diff, for a person to take.

**Containers and worktrees.** If the repo has a `docker-compose.yml` (or `compose.yaml`), check it against the worktree rules in `${CLAUDE_PLUGIN_ROOT}/templates/docs/standards/delivery.md` ("Every worktree runs its own containers"): no fixed `name:`, published ports from a variable with a default, a gate that needs no host port. Don't change it in the setup PR: where it falls short, create one issue with the fix (or add to an open one that already covers it), in the state `ready-for-agent`, and list it in the report. Do this on every run, not only the first. If the repo's `docs/standards/delivery.md` came from ways and lacks that bullet, add it: it's new since the repo was set up, and the builders' instructions point to it.

`.github/CODEOWNERS`: fill in the high-risk paths this repo actually has, matching `REVIEW.md`. Owners are a judgement call: leave `@owner` and list it as `needs-human` unless the person names them.

`AGENTS.md`: Pocock's setup may already have created it with only the `## Agent skills` section. Add the template's sections around that section; never remove or rewrite it. If the `## Agent skills` section is in `CLAUDE.md` instead, it moves to `AGENTS.md` with the rest of `CLAUDE.md`'s content (below), unchanged. Fill in the gate command, the read order and the merge policy from what the repo shows. Leave genuine judgement calls as placeholders and list them. The `### Issue tracker` line under `## Agent skills` says where this repo's issues live. The template's line is GitHub's. For local markdown it's "Issues live as markdown files under `.scratch/`, committed with the code. See `docs/agents/issue-tracker.md`.", and for other it names the tracker and how Claude reaches it. Change the line only when it names a tracker other than this repo's.

`.github/pull_request_template.md` starts `Closes #` for GitHub. For local markdown or other, the first line is `Closes ` with no `#`.

The one exception to "never overwrite": `## How work goes` and `## Working an issue` belong to the plugin, since they name its commands and files, and go stale when it changes. On every run, replace each section, from its heading to the next `## `, with the template's current one, so the SessionStart hook (which prints it) shows the flow this plugin version has. If the repo's copy had changes of its own, say so in the report and point them to `## Rules for this repo`; the setup PR's diff shows what was replaced.

`CLAUDE.md`: should contain `@AGENTS.md`. If it has other content, move that content into `AGENTS.md` and leave the import.

`GLOSSARY.md` and `docs/adr/` are not seeded: Pocock's `domain-modeling` creates them when the first term or decision is settled.

## 4. Pocock's config

This is what `/setup-matt-pocock-skills` would write, with the tracker from step 2 and the answers the method fixes: the default triage labels, single-context, `AGENTS.md`. Ways writes it itself rather than asking questions whose answers are settled.

**Find Pocock's templates** in the installed plugin, not in a copy of ours, so they follow his updates. The newest version is the last line of:

```bash
ls -d ~/.claude/plugins/cache/*/mattpocock-skills/*/skills/*/setup-matt-pocock-skills | sort -V | tail -1
```

If that finds nothing, try `find ~/.claude/plugins -type d -path '*mattpocock-skills*' -name setup-matt-pocock-skills`. If there's still nothing, fall back: ask the person to run `/setup-matt-pocock-skills`, choosing the same tracker, the default labels and single-context, and choosing `AGENTS.md` if asked; then run this again.

**Write each file that's missing**, from that folder, as it is:

| File | From |
|---|---|
| `docs/agents/issue-tracker.md` | `issue-tracker-github.md` (leave its "PRs as a request surface" flag off) or `issue-tracker-local.md`. Other has no template: start the file with `# Issue tracker: <its name>` |
| `docs/agents/triage-labels.md` | `triage-labels.md` |
| `docs/agents/domain.md` | `domain.md` |

A file that's already there stays as it is, whatever it says: a repo that chose other labels or a multi-context layout keeps them.

**The `## Agent skills` section** comes with the `AGENTS.md` template (step 3). If `AGENTS.md` already has one, or `CLAUDE.md` had one that moved, keep it as it is and don't add a second.

**Then the ways conventions:** append `${CLAUDE_PLUGIN_ROOT}/templates/overlays/issue-tracker.md` to the end of `docs/agents/issue-tracker.md`, and after it the tracker's section from the same folder: `where-issues-live-github.md`, `where-issues-live-local.md` or `where-issues-live-other.md`. Exactly one. For other, fill in its two lines: **The tracker:** with the person's paragraph, and **Reached at setup:** with "yes, on <date>, by reading a few open issues", or "no: <what failed>" if they chose to record it anyway.

On a re-run, replace the `## This repo's conventions (ways)` section (from its heading to the next `## `) with the current one. Replace a GitHub or local section the same way, and add the GitHub one if an older run left none. Leave an other section as it is: it holds the person's description. Leave the rest of the file alone.

## 5. Labels

With local markdown or other, the states live in the tracker, not in GitHub labels: create only `no-issue`, the PR label, as below, and run no `gh issue` command. The rest of this step is for GitHub.

Create the labels in `${CLAUDE_PLUGIN_ROOT}/templates/labels.txt` with `gh label create <name> --color <hex> --description "<text>" --force`, except the ones it marks *if missing*: create those only where no label of that name exists, without `--force`, so a repo's own colours stay.

- The triage roles are what `/triage` applies. If `docs/agents/triage-labels.md` maps a role to another name, that repo's name is the label: don't create the default one beside it.
- `/triage` needs `bug` or `enhancement`, and they exist only where GitHub's defaults came with the repo.

Leave other labels alone.

## 6. Settings and stamp

- `.claude/settings.json`: merge in the template's `extraKnownMarketplaces`, `enabledPlugins` and `permissions.deny` entries. Keep everything already there.
- `.claude/ways.json`: write the plugin version and the gate command, for example `{"version": "0.2.0", "gate": "npm run check"}`. Use a runner the repo already depends on (an npm or Composer script, `dotnet test`, `uv run`). If the gate is a bash script, record it as `git -c alias.gate='!bash scripts/check.sh' gate`, not `bash scripts/check.sh`: on Windows, `bash` in PowerShell or cmd is often WSL's, not Git's, and fails there while hooks and CI pass (`docs/standards/delivery.md`). The same goes for an npm or Composer script that calls `bash`: point it at the git form. Where the repo already records a bare `bash …` gate, switch it and say why in the report. Avoid `make` unless every machine the team uses has it: Windows doesn't, in PowerShell or Git Bash. **Run the gate once before recording it**, and on Windows once more through PowerShell (`powershell -NoProfile -Command "<gate>"`), since that's where a person types it. If a program it calls isn't installed here ("command not found"), list it as `needs-human` with the install command (for example `winget install ezwinports.make`), or pick a runner this machine has. The Stop hook runs this command in autonomous mode, so it must be the same command CI runs. It must also run as it is in PowerShell and bash (no `&&`), and on its own fresh state, not the running app's database (`docs/standards/delivery.md`). Where tests use the app's database today, list that as a gap in the report and suggest the fix as an issue: tests build a throwaway database from the schema each run. In a repo with no code yet, use a gate that passes trivially and list it as `needs-human`.
- `.gitignore`: add each of these lines that's missing, and nothing twice:
  ```
  .ways/
  .claude/settings.local.json
  specs/brief/inbox/*
  !specs/brief/inbox/README.md
  specs/brief/*/private/
  ```
  The first is this checkout's state: the autonomous-mode marker, notes, the last gate. It's at the root, not under `.claude/`, because Claude Code asks before the agent writes there, which would stop an autonomous run. The SessionStart hook also gives it its own `.gitignore`, and moves anything an older version left in `.claude/ways/`. The last three keep `/ways:discover`'s sources out of git: the inbox is ignored except its README (seeded from the template, so the folder exists in every clone), and each brief's `private/` holds the personal ones.

## 7. Open the PR and report

Open a PR titled `chore: set up ways of working`, using `.github/pull_request_template.md`, with `no-issue` as its label unless an issue asked for the setup. Then report, sorted by who can finish each item:

| | |
|---|---|
| `applied` | Done in the PR. |
| `needs-reload` | Settings changed; takes effect when the session or the plugin reloads. |
| `needs-human` | Outside the repo or a judgement call. Name it and give the command. |

Always list as `needs-human`, with the command to run:

- **Workflows:** pushing `.github/workflows/` needs a token with the `workflow` scope (`gh auth refresh -s workflow`). If the push is refused, leave the workflows out of the PR and list them here.
- **Branch protection on `main`:** a ruleset requiring a PR, the `Gate` check, code-owner review, and the approval count the Merging dial implies (one while it's on learning). Linear history, except that integration PRs merge with their slice commits. Check what's there first with `gh api repos/<owner>/<repo>/rules/branches/main`, and report which of three it is:
  - **Rules listed:** name any of the above that's missing.
  - **`[]`:** nothing protects `main`. Give the ruleset to add.
  - **403, "Upgrade to GitHub Pro":** a private repo on GitHub's free plan, where GitHub can't protect `main`. Say so plainly, and that ways guards it instead: in autonomous runs its hook refuses a push to `main`, and a merge into it while the dial is on learning, so keep the dial on learning here (GitHub can't hold high-risk PRs for a code owner either). If anything deploys from `main`, add the deploy check from `docs/standards/delivery.md`. A paid plan (Pro, or Team for an organisation) brings GitHub's rules back.
- **The `pr-hygiene` check:** make it required once the first PR has passed it.
- **`specs/charter.md` and `specs/roadmap.md`:** a person needs to write or confirm them.

## 8. Existing code: file the backfill

Setup installs the method. On an established repo, the backfill takes days and more than one person, so its state goes in the tracker as issues, not into this skill. Create a parent issue, **"Adopt the ways of working"**, with one ticket per item that applies, each a brief that names the skill that does it, in the state the table gives. On GitHub, file them once the setup PR is open. With local markdown, the parent is `.scratch/adopt-ways/issue.md` and the tickets are `.scratch/adopt-ways/issues/NN-<slug>.md`, committed on the setup branch so they arrive in the setup PR. With another tracker, file them there; if setup couldn't reach it, list them in the report for the person to file.

| Ticket | Done by | State |
|---|---|---|
| Gate skeleton (only if there's no working gate; blocks the rest except the charter) | `/ways:work`, autonomous | `ready-for-agent` |
| Charter, scope ladder and invariants, from the code, the README and the people who know why | `/grill-with-docs` | `ready-for-human` |
| Confirm the drafted `docs/ARCHITECTURE.md`, and say where it's wrong | a person reading it, then `/improve-codebase-architecture` when there's time | `ready-for-human` |
| Glossary: the names the code already uses, and the ones it uses inconsistently | `/grill-with-docs` (often the same session as the charter) | `ready-for-human` |
| ADR candidates: the hard-to-reverse choices visible in the code (database, framework or lack of one, hosting). A person supplies the reasons, or records "inherited, reason unknown" | `domain-modeling` | `ready-for-human` |
| The existing backlog: open items from the old tracker, `TODO`/`FIXME` comments, the suspected bugs found during setup | `/triage` | `needs-triage` |

Leave out what the repo already has. With no remote yet, list them in the report as the first issues to file instead.

## 9. Notes

After the report and the backfill, log the run and offer the repo notes, if there are any (`${CLAUDE_PLUGIN_ROOT}/reference/FEEDBACK.md`). `.ways/feedback.md` may exist before this run's `.gitignore` line does: keep it out of the setup PR. A repo finding that's already a backfill ticket is covered: drop the note.
