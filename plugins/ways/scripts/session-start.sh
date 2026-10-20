#!/usr/bin/env bash
# Orient a session in a repo that has opted in to ways of working.
# Opt-in is the presence of .claude/ways.json. Anywhere else this prints nothing,
# so enabling the plugin globally doesn't push the method into unrelated repos.
# Stdout from a SessionStart hook is added to Claude's context.

set -u
project="${CLAUDE_PROJECT_DIR:-$PWD}"
stamp="$project/.claude/ways.json"
root="${CLAUDE_PLUGIN_ROOT:?}"

[[ -f "$stamp" ]] || exit 0

json_field() { sed -n "s/.*\"$1\"[[:space:]]*:[[:space:]]*\"\([^\"]*\)\".*/\1/p" "$2" | head -1; }

repo_version="$(json_field version "$stamp")"
plugin_version="$(json_field version "$root/.claude-plugin/plugin.json")"
gate="$(json_field gate "$stamp")"

echo "This repo works the ways-of-working way on Matt Pocock's skills (ways ${plugin_version}, repo set up at ${repo_version:-unknown})."
echo
echo "- Read AGENTS.md first. Specs: specs/ (charter, roadmap, operating-context, brief/, prd/). Language: GLOSSARY.md. Decisions: docs/adr/. Status lives in GitHub issues, not in files."
echo "- Flow: pick the path by size (AGENTS.md, How work goes). Problem not understood yet (a wish list, an idea, a half-built app): /ways:discover first. New and unsized: /triage. One ticket: /ways:work <issue>. Big work in three parts, each typed by a person: requirements (/grill-with-docs, /to-spec: the PRD), design (/ways:design), build (/to-tickets, /implement-spec). When a step finishes, say which command comes next. docs/agents/issue-tracker.md says how this repo publishes specs and closes work."
echo "- Merge policy and risk tiers: ${root}/reference/REVIEW-AND-MERGE.md"
echo "- Gate: ${gate:-not set in .claude/ways.json}"
marker="$project/.claude/ways/autonomous"
if [[ -f "$marker" ]]; then
  # One issue number for a single run; several, space-separated, for a batch.
  read -ra issues <<< "$(tr -cs '0-9' ' ' < "$marker")"
  echo "- Autonomous mode is ON (.claude/ways/autonomous exists): the Stop hook runs the gate before a turn can end. Delete the marker at handover."
  if [[ ${#issues[@]} -eq 1 ]]; then
    echo "- You are mid-run on issue #${issues[0]}. If you don't remember the details, the context was compacted or cleared: before doing anything else, re-read the issue and its comments (your plan comment is there), the draft PR, and \`git log main..HEAD\`. Don't redo what the commits show is done."
  elif [[ ${#issues[@]} -gt 1 ]]; then
    echo "- You are leading a batch: issues $(printf '#%s ' "${issues[@]}")in that merge order. If you don't remember the details, the context was compacted or cleared: before doing anything else, check each issue's state and its PR (\`gh pr list --search \"<n> in:body\"\`). Merged ones are done; for the rest, resume from the PR and its commits. Don't start a builder for an issue that already has a PR in progress."
  fi
fi
# Only a minor or major release changes what setup lays down; a patch release doesn't.
if [[ -n "$repo_version" && -n "$plugin_version" && "${repo_version%.*}" != "${plugin_version%.*}" ]]; then
  echo "- The repo was set up with ${repo_version}; the plugin is ${plugin_version}. Suggest running /ways:setup to update it."
fi
