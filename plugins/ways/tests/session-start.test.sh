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
  out="$(echo '{}' | CLAUDE_PROJECT_DIR="$repo" CLAUDE_PLUGIN_ROOT="$plugin" bash "$script")"
  rm -rf "$repo" "$plugin"
}

# A git repo set up for ways, with a worktree beside it. Sets main and wt.
# .claude/ways/ isn't committed, so each checkout has its own markers, as in a real repo.
pair() {
  main="$(mktemp -d)"; wt="$main-wt"
  git -C "$main" init -q
  mkdir -p "$main/.claude"
  echo '{"version": "0.5.0", "gate": "true"}' > "$main/.claude/ways.json"
  echo '.claude/ways/' > "$main/.gitignore"
  git -C "$main" -c core.autocrlf=false add -A
  git -C "$main" -c user.name=t -c user.email=t@t commit -qm init
  git -C "$main" worktree add -q --detach "$wt"
}

# Run the hook as a session in folder $1 would be, with CLAUDE_PROJECT_DIR at the main checkout.
start_in() {
  local plugin
  plugin="$(mktemp -d)"; mkdir -p "$plugin/.claude-plugin"
  echo '{"name": "ways", "version": "0.5.0"}' > "$plugin/.claude-plugin/plugin.json"
  out="$(printf '{"cwd":"%s"}' "$1" | CLAUDE_PROJECT_DIR="$main" CLAUDE_PLUGIN_ROOT="$plugin" bash "$script")"
  rm -rf "$plugin"
}

check() { # description, then a test expression
  if eval "$2"; then echo "ok    $1"; else echo "FAIL  $1"; failures=$((failures + 1)); fi
}

start "" 0.5.0
check "a repo that hasn't opted in hears nothing" '[[ -z $out ]]'

start 0.5.0 0.5.0
check "orients Claude: the gate and the routing rule" '[[ $out == *"Gate: make check"* && $out == */ways:plan* && $out == */ways:build* && $out == */ways:work* && $out == *PARTS.md* ]]'
check "no part file: no work in progress line" '[[ $out != *"Big work in progress"* ]]'
check "the flow comes from AGENTS.md, skips included" '[[ $out == *"/ways:discover"* && $out == *"Skips, and only these"* ]]'
check "and stops at the next section" '[[ $out != *"## Working an issue"* ]]'
check "without the template's ownership comment" '[[ $out != *"<!--"* ]]'
check "same version: no setup nudge" '[[ $out != *"/ways:setup"* ]]'

start 0.5.0 0.5.0 agents "allergen chart · plan"
check "a part under way is named, with where to check its state" '[[ $out == *"Big work in progress: allergen chart · plan"* && $out == *PARTS.md* ]]'

start 0.5.0 0.5.0 no-agents
check "no flow section: a short fallback and a setup nudge" '[[ $out == *"has no \"How work goes\" section"* && $out == *"/ways:discover"* && $out == *"/ways:plan #n"* && $out == *"/ways:setup"* ]]'

start 0.5.0 0.5.1
check "a patch release doesn't nudge setup" '[[ $out != *"/ways:setup"* ]]'

start 0.4.0 0.5.0
check "a minor release nudges setup" '[[ $out == *"Suggest running /ways:setup"* ]]'

start 0.5.0 1.0.0
check "a major release nudges setup" '[[ $out == *"Suggest running /ways:setup"* ]]'

# Claude Desktop sets CLAUDE_PROJECT_DIR to the main checkout even for a session in a worktree.
pair
mkdir -p "$main/.claude/ways"; echo 7 > "$main/.claude/ways/autonomous"
start_in "$wt"
check "a worktree session ignores the main checkout's autonomous marker" '[[ $out == *"ways"* && $out != *"Autonomous mode is ON"* ]]'
mkdir -p "$wt/.claude/ways"; echo 9 > "$wt/.claude/ways/autonomous"
start_in "$wt"
check "and reports its own" '[[ $out == *"Autonomous mode is ON"* && $out == *"#9"* && $out != *"#7"* ]]'
start_in "$main"
check "the main checkout still sees its own" '[[ $out == *"#7"* ]]'
git -C "$main" worktree remove --force "$wt"; rm -rf "$main"

echo
if (( failures )); then echo "$failures failed"; exit 1; fi
echo "all passed"
