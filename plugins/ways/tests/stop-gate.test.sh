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
  mkdir -p "$dir/.claude/ways"
  echo "{\"version\": \"0.4.0\", \"gate\": \"$1\"}" > "$dir/.claude/ways.json"
  echo 3 > "$dir/.claude/ways/autonomous"
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

check() { # description, then a test expression
  if eval "$2"; then echo "ok    $1"; else echo "FAIL  $1"; failures=$((failures + 1)); fi
}

r="$(repo false)"; rm "$r/.claude/ways/autonomous"
stop "$r" false
check "interactive (no marker): the turn ends" '[[ $code == 0 ]]'

r="$(repo true)"
stop "$r" false
check "green gate: the turn ends" '[[ $code == 0 ]]'
check "green gate: recorded as a pass" '[[ $(cat "$r/.claude/ways/last-gate") == pass* ]]'

r="$(repo false)"
stop "$r" false
check "red gate: the stop is blocked" '[[ $code == 2 ]]'
check "red gate: Claude is told why" '[[ $err == *"The gate failed"* ]]'
stop "$r" true
check "second block in a row: still blocked" '[[ $code == 2 && $err != *"third"* ]]'
stop "$r" true
check "third block in a row: blocked, and told to hand over now" '[[ $code == 2 && $err == *"third"* && $err == *"needs-human"* ]]'
stop "$r" true
check "fourth stop in a row: let through" '[[ $code == 0 ]]'
check "fourth stop: the person is told the gate is still red on #3" '[[ $out == *systemMessage* && $out == *"#3"* && $out == *"still red"* ]]'
check "fourth stop: the marker stays, so the state is visible" '[[ -f "$r/.claude/ways/autonomous" ]]'

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

echo
if (( failures )); then echo "$failures failed"; exit 1; fi
echo "all passed"
