#!/usr/bin/env bash
# Tests for scripts/session-start.sh. Run: bash plugins/ways/tests/session-start.test.sh
# Each case builds a throwaway repo stamped at one version and a plugin at another,
# and checks what the hook tells Claude.

set -u
root="$(cd "$(dirname "$0")/.." && pwd)"
script="$root/scripts/session-start.sh"
failures=0

# Run the hook for a repo stamped $1 (empty: not opted in) under a plugin at $2.
# The repo gets the AGENTS.md template unless $3 is "no-agents", and $4, if given, as .claude/ways/part. Sets out.
start() {
  local repo plugin
  repo="$(mktemp -d)"; plugin="$(mktemp -d)"
  mkdir -p "$plugin/.claude-plugin"
  echo "{\"name\": \"ways\", \"version\": \"$2\"}" > "$plugin/.claude-plugin/plugin.json"
  if [[ -n $1 ]]; then
    mkdir -p "$repo/.claude"
    echo "{\"version\": \"$1\", \"gate\": \"make check\"}" > "$repo/.claude/ways.json"
    [[ ${3:-} == no-agents ]] || cp "$root/templates/AGENTS.md" "$repo/AGENTS.md"
    [[ -z ${4:-} ]] || { mkdir -p "$repo/.claude/ways"; echo "$4" > "$repo/.claude/ways/part"; }
  fi
  out="$(CLAUDE_PROJECT_DIR="$repo" CLAUDE_PLUGIN_ROOT="$plugin" bash "$script")"
  rm -rf "$repo" "$plugin"
}

check() { # description, then a test expression
  if eval "$2"; then echo "ok    $1"; else echo "FAIL  $1"; failures=$((failures + 1)); fi
}

start "" 0.5.0
check "a repo that hasn't opted in hears nothing" '[[ -z $out ]]'

start 0.5.0 0.5.0
check "orients Claude: the gate and the part commands" '[[ $out == *"Gate: make check"* && $out == */ways:requirements* && $out == */ways:design* && $out == */ways:build* && $out == *PARTS.md* ]]'
check "no part file: no work in progress line" '[[ $out != *"Big work in progress"* ]]'
check "the flow comes from AGENTS.md, skips included" '[[ $out == *"/ways:discover"* && $out == *"Skips, and only these"* ]]'
check "and stops at the next section" '[[ $out != *"## Working an issue"* ]]'
check "without the template's ownership comment" '[[ $out != *"<!--"* ]]'
check "same version: no setup nudge" '[[ $out != *"/ways:setup"* ]]'

start 0.5.0 0.5.0 agents "allergen chart · part 3 of 4 · design"
check "a part under way is named, with where to check its state" '[[ $out == *"Big work in progress: allergen chart · part 3 of 4 · design"* && $out == *PARTS.md* ]]'

start 0.5.0 0.5.0 no-agents
check "no flow section: a short fallback and a setup nudge" '[[ $out == *"has no \"How work goes\" section"* && $out == *"/ways:discover"* && $out == *"/ways:setup"* ]]'

start 0.5.0 0.5.1
check "a patch release doesn't nudge setup" '[[ $out != *"/ways:setup"* ]]'

start 0.4.0 0.5.0
check "a minor release nudges setup" '[[ $out == *"Suggest running /ways:setup"* ]]'

start 0.5.0 1.0.0
check "a major release nudges setup" '[[ $out == *"Suggest running /ways:setup"* ]]'

echo
if (( failures )); then echo "$failures failed"; exit 1; fi
echo "all passed"
