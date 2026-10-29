#!/usr/bin/env bash
# Tests for scripts/stop-gate.sh. Run: bash plugins/ways/tests/stop-gate.test.sh
# Each case builds a throwaway repo with a gate of `true` or `false`, feeds the hook
# the Stop input Claude Code sends, and checks the exit code and what it said.

set -u
script="$(cd "$(dirname "$0")/.." && pwd)/scripts/stop-gate.sh"
failures=0

# A repo in autonomous mode on #3 whose gate is $1 (`true` or `false`).
repo() {
  local dir
  dir="$(mktemp -d)"
  mkdir -p "$dir/.claude" "$dir/.ways"
  echo "{\"version\": \"0.4.0\", \"gate\": \"$1\"}" > "$dir/.claude/ways.json"
  echo 3 > "$dir/.ways/autonomous"
  echo "$dir"
}

# Run the hook in repo $1; $2 is stop_hook_active. Sets code, out and err.
stop() {
  local o e
  o="$(mktemp)"; e="$(mktemp)"
  echo "{\"hook_event_name\": \"Stop\", \"stop_hook_active\": $2}" \
    | CLAUDE_PROJECT_DIR="$1" bash "$script" >"$o" 2>"$e"
  code=$?
  out="$(cat "$o")"; err="$(cat "$e")"
  rm -f "$o" "$e"
}

# A git repo with ways set up and a gate of $1, with a worktree beside it. Sets main and wt.
# .ways/ isn't committed, so each checkout has its own markers, as in a real repo.
pair() {
  main="$(mktemp -d)"; wt="$main-wt"
  git -C "$main" init -q
  mkdir -p "$main/.claude"
  echo "{\"version\": \"0.4.0\", \"gate\": \"$1\"}" > "$main/.claude/ways.json"
  echo '.ways/' > "$main/.gitignore"
  git -C "$main" -c core.autocrlf=false add -A
  git -C "$main" -c user.name=t -c user.email=t@t commit -qm init
  git -C "$main" worktree add -q --detach "$wt"
}

# Run the hook as a session whose cwd is $1 (as the hook input spells it), with
# CLAUDE_PROJECT_DIR at the main checkout, as Claude Desktop sets it. Sets code, out and err.
stop_in() {
  local o e
  o="$(mktemp)"; e="$(mktemp)"
  printf '{"hook_event_name": "Stop", "stop_hook_active": false, "cwd": "%s"}' "$1" \
    | CLAUDE_PROJECT_DIR="$main" bash "$script" >"$o" 2>"$e"
  code=$?
  out="$(cat "$o")"; err="$(cat "$e")"
  rm -f "$o" "$e"
}

check() { # description, then a test expression
  if eval "$2"; then echo "ok    $1"; else echo "FAIL  $1"; failures=$((failures + 1)); fi
}

r="$(repo false)"; rm "$r/.ways/autonomous"
stop "$r" false
check "interactive (no marker): the turn ends" '[[ $code == 0 ]]'

r="$(repo true)"
stop "$r" false
check "green gate: the turn ends" '[[ $code == 0 ]]'
check "green gate: recorded as a pass" '[[ $(cat "$r/.ways/last-gate") == pass* ]]'

r="$(repo false)"
stop "$r" false
check "red gate: the stop is blocked" '[[ $code == 2 ]]'
check "red gate: Claude is told why" '[[ $err == *"The gate failed"* ]]'
check "red gate: the environment is named as a possible cause" '[[ $err == *"environment"* && $err == *"only if the code is at fault"* ]]'
stop "$r" true
check "second block in a row: still blocked" '[[ $code == 2 && $err != *"third"* ]]'
stop "$r" true
check "third block in a row: blocked, and told to hand over now" '[[ $code == 2 && $err == *"third"* && $err == *"needs-human"* ]]'
stop "$r" true
check "fourth stop in a row: let through" '[[ $code == 0 ]]'
check "fourth stop: the person is told the gate is still red on #3" '[[ $out == *systemMessage* && $out == *"#3"* && $out == *"still red"* ]]'
check "fourth stop: the marker stays, so the state is visible" '[[ -f "$r/.ways/autonomous" ]]'

r="$(repo false)"
stop "$r" false; stop "$r" true; stop "$r" true
stop "$r" false
check "a new turn starts the count again" '[[ $code == 2 && $err != *"third"* ]]'

r="$(repo false)"
stop "$r" false; stop "$r" true
sed -i 's/"false"/"true"/' "$r/.claude/ways.json"
stop "$r" true
sed -i 's/"true"/"false"/' "$r/.claude/ways.json"
stop "$r" true
check "a green gate resets the count" '[[ $code == 2 && $err != *"third"* ]]'

r="$(repo no-such-gate-program-xyz)"
stop "$r" false
check "a gate whose program isn't installed lets the turn end" '[[ $code == 0 ]]'
check "and says it can't run here, naming the program" '[[ $out == *"can'"'"'t run on this machine"* && $out == *no-such-gate-program-xyz* ]]'
check "and records it as unrunnable, not failed" '[[ $(cut -d" " -f1 "$r/.ways/last-gate") == unrunnable ]]'

# Worktrees. Claude Desktop sets CLAUDE_PROJECT_DIR to the main checkout even for a session
# in a worktree, so the hook takes the project from the session's cwd instead.
pair false
mkdir -p "$main/.ways"; echo 3 > "$main/.ways/autonomous"
stop_in "$wt"
check "a worktree session isn't held by the main checkout's autonomous run" '[[ $code == 0 && ! -f $main/.ways/last-gate ]]'

mkdir -p "$wt/.ways"; echo 5 > "$wt/.ways/autonomous"
stop_in "$wt"
check "a worktree's own run is held by its own gate" '[[ $code == 2 ]]'
check "and its state is written in the worktree, not the main checkout" '[[ -f $wt/.ways/last-gate && -f $wt/.ways/stop-blocks && ! -f $main/.ways/stop-blocks ]]'

stop_in "$main"
check "the main checkout behaves as before" '[[ $code == 2 && -f $main/.ways/last-gate ]]'

if command -v cygpath >/dev/null; then
  rm -f "$wt/.ways/last-gate" "$wt/.ways/stop-blocks"
  win="$(cygpath -w "$wt")"
  stop_in "${win//\\/\\\\}"
  check "a Windows cwd, backslashes escaped as in the hook's JSON, resolves" '[[ $code == 2 && -f $wt/.ways/last-gate ]]'
else
  echo "skip  a Windows cwd (no cygpath here)"
fi
git -C "$main" worktree remove --force "$wt"; rm -rf "$main"

echo
if (( failures )); then echo "$failures failed"; exit 1; fi
echo "all passed"
