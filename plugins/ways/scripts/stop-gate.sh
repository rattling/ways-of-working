#!/usr/bin/env bash
# In autonomous mode, don't let a turn end on a red gate.
# Active only while .claude/ways/autonomous exists (the work skill creates it at the start
# of an autonomous run and deletes it at handover). Interactive sessions are untouched.
# Exit 2 blocks the stop; stderr goes back to Claude as the reason.

set -u
project="${CLAUDE_PROJECT_DIR:-$PWD}"
marker="$project/.claude/ways/autonomous"
stamp="$project/.claude/ways.json"

cat >/dev/null  # hook input on stdin isn't needed
[[ -f "$marker" && -f "$stamp" ]] || exit 0

gate="$(sed -n 's/.*"gate"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$stamp" | head -1)"
if [[ -z "$gate" ]]; then
  echo "Autonomous mode is on but .claude/ways.json has no \"gate\" command, so nothing checks the work. Add one, or delete .claude/ways/autonomous." >&2
  exit 2
fi

cd "$project" || exit 0
log="$(mktemp)"
# Record the result for anything that shows gate state, such as the ways-band mod.
record() { echo "$1 $(date +%s)" > "$project/.claude/ways/last-gate"; }
if bash -c "$gate" >"$log" 2>&1; then
  rm -f "$log"
  record pass
  exit 0
fi
record fail

{
  echo "The gate failed (\`$gate\`), and autonomous mode doesn't end a turn on red."
  echo "Fix the cause, not the symptom. If it can't be made green without a person, label the issue needs-human, say why, and delete .claude/ways/autonomous."
  echo
  echo "Last lines of output:"
  tail -n 40 "$log"
} >&2
rm -f "$log"
exit 2
