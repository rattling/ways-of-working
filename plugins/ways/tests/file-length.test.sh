#!/usr/bin/env bash
# Tests for scripts/file-length.sh. Run: bash plugins/ways/tests/file-length.test.sh
# Each case writes a long file at a path and checks whether the hook prompts to split it.

set -u
script="$(cd "$(dirname "$0")/.." && pwd)/scripts/file-length.sh"
failures=0
root="$(mktemp -d)"

# Run the hook on a 600-line file at $1 (relative to a throwaway root). Sets code.
run() {
  local file="$root/$1"
  mkdir -p "$(dirname "$file")"
  seq 600 > "$file"
  printf '{"session_id":"test-%s","tool_input":{"file_path":"%s"}}' "$RANDOM" "$file" \
    | TMPDIR="$root" WAYS_FILE_LINES=500 bash "$script" 2>/dev/null
  code=$?
}

check() { # description, then a test expression
  if eval "$2"; then echo "ok    $1"; else echo "FAIL  $1"; failures=$((failures + 1)); fi
}

run "repo/src/orders.js"
check "a long source file prompts a split" '[[ $code == 2 ]]'

run "repo/specs/prd/allergen-chart-mock.html"
check "a mock beside its PRD doesn't" '[[ $code == 0 ]]'

run "repo/specs/brief/unbilled-jobs/prototype/index.html"
check "discovery's prototype doesn't" '[[ $code == 0 ]]'

run "repo/src/routes/settings-prototype.tsx"
check "a prototype route doesn't" '[[ $code == 0 ]]'

run "repo/examples/mocks/approval-workflow.html"
check "an example mock doesn't" '[[ $code == 0 ]]'

run "Temp/claude/session/scratchpad/check.py"
check "a scratch file doesn't" '[[ $code == 0 ]]'

run "repo/.scratch/orders/issues/01-slice.js"
check "a .scratch file doesn't" '[[ $code == 0 ]]'

rm -rf "$root"
echo
if (( failures )); then echo "$failures failed"; exit 1; fi
echo "all passed"
