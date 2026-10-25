---
name: setup
description: Set up a new repo, or retrofit an existing one, to work the ways-of-working way on top of Matt Pocock's skills. Re-run it to pick up a newer version.
disable-model-invocation: true
---

# Set up a repo

Seed the files, labels and settings the method expects, without losing anything already here. The result is a PR a person reviews.

## 1. Look before writing

- Plugin version: the `version` in `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json`.
- Repo stamp: `.claude/ways.json`. If its `version` matches the plugin's, say the repo is current and stop, unless the person asked for something specific.
- Pocock's config: `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, `docs/agents/domain.md`, and an `## Agent skills` section in `AGENTS.md` or `CLAUDE.md`. If they're missing, stop and ask the person to run `/setup-matt-pocock-skills` first, accepting GitHub, the default labels and single-context, and choosing `AGENTS.md` if asked which file to edit. Then run this again.
- Existing material: `AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/`, `specs/`, `GLOSSARY.md`, any charter, roadmap, milestones file, ADRs, PR or issue templates, CI workflows, `Makefile` or other gate commands.
- `gh repo view` and `gh label list`, to confirm the CLI works and see what labels exist.

## 2. Propose, then act

Tell the person, in one short list, what you will add, what you will move, and what you will leave alone. Wait for a yes. Then work on a branch, `chore/ways-setup`.

## 3. Seed from the templates

Templates live in `${CLAUDE_PLUGIN_ROOT}/templates/`. For each one, except `overlays/` and `labels.txt`:

- **Missing:** copy it in.
- **Present:** never overwrite. Merge what's missing into it, or leave it and list it in the report.
- **Equivalent content elsewhere** (for example `docs/CHARTER.md`, `docs/MILESTONES.md`, `arch/ARCHITECTURE.md`): propose moving it with `git mv` into the expected place, keeping its content. Content that mixes durable and phase-specific material, such as a charter with this quarter's goals in it, gets split: durable parts to `specs/charter.md`, the rest to `specs/operating-context.md`. If unsure, ask.

`specs/` belongs to people. Fill only what you can take from existing material, mark anything you drafted with `<!-- draft: confirm -->`, and leave the rest as the template's prompts. Don't invent purpose, invariants or priorities.

`docs/ARCHITECTURE.md`: draft it from the code as it is, marked as a draft. An empty repo keeps the template.

`docs/standards/`: copy the shared files and only the stack files this repo uses (`php.md`, `dotnet.md`); if its stack has none, say so in the report. Fill a stack file's **Today** line from the code, marked as a draft, and leave **Moving to** for people. A repo that already has standards keeps them: list what overlaps in the report rather than merging.

**A new repo starts with a walking skeleton.** If there's no code yet, the roadmap's first milestone is the walking skeleton, and the report suggests its issue: the thinnest end-to-end path through the real stack, showing one real thing from the real data store, with the gate running locally and in CI. If the app has screens, the skeleton also sets its look (`docs/standards/code.md`, "One look, set once"): the design tokens for light and dark, `color-scheme`, the page background and a styled shell, so the first visual feature builds on a frame instead of inventing one.

**Existing code without a working gate starts with a gate skeleton.** If there's code but no gate that can run (no tests, no way to run it locally, no CI), the first milestone is the gate skeleton, and the report suggests its issue. Its outcome: the app runs locally (containerised, if today it only runs on a hand-built server); characterisation tests pin the behaviour that matters most, as it is now, bugs included, with suspected bugs listed as issues rather than fixed; and the gate runs locally and in CI. Until then the gate is a placeholder, and the report says so.

**The look.** If the app has screens but no shared design tokens, no `color-scheme` or no styled shell (`docs/standards/code.md`, "One look, set once"), list it as a gap in the report and suggest its issue: a "theme and shell" ticket, done before the next visual feature. If the repo's `docs/standards/code.md` came from ways and lacks that bullet, add it.

**Containers and worktrees.** If the repo has a `docker-compose.yml` (or `compose.yaml`), check it against the worktree rules in `${CLAUDE_PLUGIN_ROOT}/templates/docs/standards/delivery.md` ("Every worktree runs its own containers"): no fixed `name:`, published ports from a variable with a default, a gate that needs no host port. Don't change it in the setup PR: where it falls short, file one issue with the fix (or add to an open one that already covers it), labelled `ready-for-agent`, and list it in the report. Do this on every run, not only the first. If the repo's `docs/standards/delivery.md` came from ways and lacks that bullet, add it: it's new since the repo was set up, and the builders' instructions point to it.

`.github/CODEOWNERS`: fill in the high-risk paths this repo actually has, matching `REVIEW.md`. Owners are a judgement call: leave `@owner` and list it as `needs-human` unless the person names them.

`AGENTS.md`: Pocock's setup may already have created it with only the `## Agent skills` section. Add the template's sections around that section; never remove or rewrite it. Fill in the gate command, the read order and the merge policy from what the repo shows. Leave genuine judgement calls as placeholders and list them.

The one exception to "never overwrite": `## How work goes` belongs to the plugin. On every run, replace that section, from its heading to the next `## `, with the template's current one, so the SessionStart hook (which prints it) shows the flow this plugin version has. If the repo's copy had changes of its own, say so in the report and point them to `## Rules for this repo`; the setup PR's diff shows what was replaced.

`CLAUDE.md`: should contain `@AGENTS.md`. If it has other content, move that content into `AGENTS.md` and leave the import.

`GLOSSARY.md` and `docs/adr/` are not seeded: Pocock's `domain-modeling` creates them when the first term or decision is settled.

## 4. Pocock's config

Append `${CLAUDE_PLUGIN_ROOT}/templates/overlays/issue-tracker.md` to the end of `docs/agents/issue-tracker.md`. If a `## This repo's conventions (ways)` section is already there, replace it with the current one. Leave the rest of the file alone.

## 5. Labels

Create the labels in `${CLAUDE_PLUGIN_ROOT}/templates/labels.txt` with `gh label create <name> --color <hex> --description "<text>" --force`, except `bug` and `enhancement`: create those only if they're missing, without `--force`, so a repo's own colours stay. `/triage` needs one of the two, and they exist only where GitHub's defaults came with the repo. Leave other labels alone.

## 6. Settings and stamp

- `.claude/settings.json`: merge in the template's `extraKnownMarketplaces`, `enabledPlugins` and `permissions.deny` entries. Keep everything already there.
- `.claude/ways.json`: write the plugin version and the gate command, for example `{"version": "0.2.0", "gate": "make check"}`. The Stop hook runs this command in autonomous mode, so it must be the same command CI runs. It must also run as it is in PowerShell and bash (no `&&`), and on its own fresh state, not the running app's database (`docs/standards/delivery.md`). Where tests use the app's database today, list that as a gap in the report and suggest the fix as an issue: tests build a throwaway database from the schema each run. In a repo with no code yet, use a gate that passes trivially and list it as `needs-human`.
- `.gitignore`: add each of these lines that's missing, and nothing twice:
  ```
  .claude/ways/
  .claude/settings.local.json
  specs/brief/inbox/*
  !specs/brief/inbox/README.md
  specs/brief/*/private/
  ```
  The first is where the autonomous-mode marker lives. The last three keep `/ways:discover`'s sources out of git: the inbox is ignored except its README (seeded from the template, so the folder exists in every clone), and each brief's `private/` holds the personal ones.

## 7. Open the PR and report

Open a PR titled `chore: set up ways of working`, using `.github/pull_request_template.md`, with `no-issue` as its label unless an issue asked for the setup. Then report, sorted by who can finish each item:

| | |
|---|---|
| `applied` | Done in the PR. |
| `needs-reload` | Settings changed; takes effect when the session or the plugin reloads. |
| `needs-human` | Outside the repo or a judgement call. Name it and give the command. |

Always list as `needs-human`, with the command to run:

- **Workflows:** pushing `.github/workflows/` needs a token with the `workflow` scope (`gh auth refresh -s workflow`). If the push is refused, leave the workflows out of the PR and list them here.
- **Branch protection on `main`:** a ruleset requiring a PR, the `Gate` check, code-owner review, and the approval count the Merging dial implies (one while it's on learning). Linear history, except that integration PRs merge with their slice commits.
- **The `pr-hygiene` check:** make it required once the first PR has passed it.
- **`specs/charter.md` and `specs/roadmap.md`:** a person needs to write or confirm them.

## 8. Existing code: file the backfill

Setup installs the method. On an established repo, the backfill takes days and more than one person, so its state goes in GitHub as issues, not into this skill. Once the setup PR is open, file a parent issue, **"Adopt the ways of working"**, with one sub-issue per item that applies, each a brief that names the skill that does it:

| Sub-issue | Done by | Label |
|---|---|---|
| Gate skeleton (only if there's no working gate; blocks the rest except the charter) | `/ways:work`, autonomous | `ready-for-agent` |
| Charter, scope ladder and invariants, from the code, the README and the people who know why | `/grill-with-docs` | `ready-for-human` |
| Confirm the drafted `docs/ARCHITECTURE.md`, and say where it's wrong | a person reading it, then `/improve-codebase-architecture` when there's time | `ready-for-human` |
| Glossary: the names the code already uses, and the ones it uses inconsistently | `/grill-with-docs` (often the same session as the charter) | `ready-for-human` |
| ADR candidates: the hard-to-reverse choices visible in the code (database, framework or lack of one, hosting). A person supplies the reasons, or records "inherited, reason unknown" | `domain-modeling` | `ready-for-human` |
| The existing backlog: open items from the old tracker, `TODO`/`FIXME` comments, the suspected bugs found during setup | `/triage` | `needs-triage` |

Leave out what the repo already has. With no remote yet, list them in the report as the first issues to file instead.
