#!/usr/bin/env bash
# Orient a session in a repo that has opted in to ways of working.
# Opt-in is the presence of .claude/ways.json. Anywhere else this prints nothing,
# so enabling the plugin globally doesn't push the method into unrelated repos.
# Stdout from a SessionStart hook is added to Claude's context.

set -u
input="$(cat)"
# The session's own folder, from the hook input. Inside a git worktree, CLAUDE_PROJECT_DIR
# can point at the main checkout, which would share .ways/ state between sessions.
# sed -E, so the pattern works in GNU and BSD sed alike.
cwd="$(printf '%s' "$input" | sed -nE 's/.*"cwd"[[:space:]]*:[[:space:]]*"(([^"\\]|\\.)*)".*/\1/p' | head -1 | sed 's/\\\\/\\/g')"
project=""
[[ -n "$cwd" ]] && project="$(git -C "$cwd" rev-parse --show-toplevel 2>/dev/null)"
project="${project:-${CLAUDE_PROJECT_DIR:-$PWD}}"
stamp="$project/.claude/ways.json"
root="${CLAUDE_PLUGIN_ROOT:?}"

[[ -f "$stamp" ]] || exit 0

# This checkout's state (markers, notes, the last gate) lives in .ways/, not .claude/ways/:
# Claude Code asks before the agent writes anything under .claude/, whatever the allow rules,
# so a marker there stopped an autonomous run for a person. The folder ignores itself, so a
# repo set up before needs no .gitignore change. A hook isn't asked, so it moves old state over.
state="$project/.ways"
mkdir -p "$state"
[[ -f "$state/.gitignore" ]] || echo '*' > "$state/.gitignore"
if [[ -d "$project/.claude/ways" ]]; then
  for f in "$project/.claude/ways"/*; do
    [[ -f "$f" && ! -e "$state/${f##*/}" ]] && mv "$f" "$state/"
  done
  rmdir "$project/.claude/ways" 2>/dev/null
fi

json_field() { sed -n "s/.*\"$1\"[[:space:]]*:[[:space:]]*\"\([^\"]*\)\".*/\1/p" "$2" | head -1; }

repo_version="$(json_field version "$stamp")"
plugin_version="$(json_field version "$root/.claude-plugin/plugin.json")"
gate="$(json_field gate "$stamp")"

echo "This repo works the ways-of-working way on Matt Pocock's skills (ways ${plugin_version}, repo set up at ${repo_version:-unknown})."
echo
echo "- Read AGENTS.md first. Specs: specs/ (charter, roadmap, operating-context, brief/, prd/). Language: GLOSSARY.md. Decisions: docs/adr/. Status lives in GitHub issues, not in files."
# The flow is written once, in the repo's AGENTS.md ("How work goes"): print that section, not a copy of it.
flow=""
[[ -f "$project/AGENTS.md" ]] && flow="$(awk '/^## How work goes/{f=1; next} /^## /{f=0} f && !/^<!--.*-->$/' "$project/AGENTS.md" | sed '/./,$!d')"
if [[ -n "$flow" ]]; then
  echo "- How work goes, from AGENTS.md. docs/agents/issue-tracker.md says how this repo publishes specs and closes work."
  echo
  echo "$flow"
  echo
else
  echo "- Flow: AGENTS.md has no \"How work goes\" section. New and unsorted, or a pile: /triage (optional). Problem not understood: /ways:discover, then /ways:plan. Known to be big: /ways:plan #n, then /ways:build #n. Known to be small: /ways:work #n. Say which command comes next when a step finishes. Suggest running /ways:setup to restore the section."
fi
echo "- The flow commands' rules (look for the output first, open with where you are, end with the one merge): ${root}/reference/PARTS.md"
part="$project/.ways/part"
if [[ -f "$part" ]]; then
  echo "- Big work in progress: $(head -1 "$part"). If you don't remember it, look for its output as PARTS.md says before suggesting anything."
fi
echo "- Merge policy and risk tiers: ${root}/reference/REVIEW-AND-MERGE.md"
echo "- When something worth improving pops out, in this repo or in ways, note it in .ways/feedback.md as it happens, and offer the findings at the end: ${root}/reference/FEEDBACK.md"
if [[ -s "$project/.ways/feedback.md" ]]; then
  echo "- There are notes from an earlier session in .ways/feedback.md. Offer them at the end of this one."
fi
echo "- Gate: ${gate:-not set in .claude/ways.json}"
marker="$project/.ways/autonomous"
if [[ -f "$marker" ]]; then
  # One issue number for a single run; several, space-separated, for a batch.
  read -ra issues <<< "$(tr -cs '0-9' ' ' < "$marker")"
  echo "- Autonomous mode is ON (.ways/autonomous exists): the Stop hook runs the gate before a turn can end. Delete the marker at handover."
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
