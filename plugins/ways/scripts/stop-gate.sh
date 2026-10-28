#!/usr/bin/env bash
# In autonomous mode, don't let a turn end on a red gate.
# Active only while .claude/ways/autonomous exists (the work skill creates it at the start
# of an autonomous run and deletes it at handover). Interactive sessions are untouched.
# Exit 2 blocks the stop; stderr goes back to Claude as the reason.
#
# It doesn't block forever: an agent that can't get to green would otherwise keep trying.
# The third block in a row tells it to hand over now, and the stop after that is let
# through, with a message to the person. "In a row" means within one turn: Claude Code
# sets stop_hook_active when a stop follows one this hook blocked.

set -u
input="$(cat)"
# The session's own folder, from the hook input. Inside a git worktree, CLAUDE_PROJECT_DIR
# can point at the main checkout, which would share .claude/ways/ state between sessions.
# sed -E, so the pattern works in GNU and BSD sed alike.
cwd="$(printf '%s' "$input" | sed -nE 's/.*"cwd"[[:space:]]*:[[:space:]]*"(([^"\\]|\\.)*)".*/\1/p' | head -1 | sed 's/\\\\/\\/g')"
project=""
[[ -n "$cwd" ]] && project="$(git -C "$cwd" rev-parse --show-toplevel 2>/dev/null)"
project="${project:-${CLAUDE_PROJECT_DIR:-$PWD}}"
marker="$project/.claude/ways/autonomous"
stamp="$project/.claude/ways.json"
blocks_file="$project/.claude/ways/stop-blocks"
max_blocks=3

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
bash -c "$gate" >"$log" 2>&1
status=$?
if (( status == 0 )); then
  rm -f "$log" "$blocks_file"
  record pass
  exit 0
fi
# 127 is "command not found": the gate can't run on this machine, which isn't a red gate.
# Blocking would only make the agent retry something it can't fix, so let the turn end and say so.
if (( status == 127 )); then
  record unrunnable
  missing="$(grep -m1 -o '[^ :]*: command not found' "$log" | sed 's/: command not found//')"
  rm -f "$log" "$blocks_file"
  echo "{\"systemMessage\": \"The gate (\`$gate\`) can't run on this machine: ${missing:-a program it calls} isn't installed. Autonomous mode can't check the work here until it is, or the gate in .claude/ways.json uses a runner this machine has.\"}"
  exit 0
fi
record fail

blocks=0
if [[ "$input" =~ \"stop_hook_active\"[[:space:]]*:[[:space:]]*true ]]; then
  blocks="$(tr -cd '0-9' < "$blocks_file" 2>/dev/null)"
  blocks="${blocks:-0}"
fi
blocks=$((blocks + 1))

if (( blocks > max_blocks )); then
  # Let the turn end, and tell the person. The marker stays, so the run's state is visible.
  rm -f "$log" "$blocks_file"
  issues="$(tr -cs '0-9' ' ' < "$marker" | xargs | sed 's/[0-9][0-9]*/#&/g')"
  echo "{\"systemMessage\": \"The gate is still red after ${max_blocks} attempts in autonomous mode${issues:+ on $issues}, so this turn was allowed to end. The cause may be the code (check whether the issue is labelled needs-human) or the environment (a service not running, say). Delete .claude/ways/autonomous when you take over.\"}"
  exit 0
fi
echo "$blocks" > "$blocks_file"

{
  echo "The gate failed (\`$gate\`), and autonomous mode doesn't end a turn on red."
  if (( blocks == max_blocks )); then
    echo "This is the third block in a row. Stop trying: say in five lines or fewer what you need from a person, delete .claude/ways/autonomous, and, if the code is at fault, label the issue needs-human. If you don't, the next stop is let through with the gate still red."
  else
    echo "Fix the cause, not the symptom. The cause may be the environment, not the code: a service that isn't running (Docker, a database), generated files left stale by a dev server, a missing dependency. Fix that if you can. If it can't be made green without a person, say exactly what's needed and delete .claude/ways/autonomous; label the issue needs-human only if the code is at fault."
  fi
  echo
  echo "Last lines of output:"
  tail -n 40 "$log"
} >&2
rm -f "$log"
exit 2
