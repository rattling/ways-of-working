#!/usr/bin/env bash
# After the agent writes or edits a file: if the file is past the limit, tell the agent, once
# per file per session. Crude on purpose. Big files are where agents and people lose track,
# so it's a prompt to split by responsibility, not a block. Exit 2 shows stderr to Claude.

set -u
limit="${WAYS_FILE_LINES:-500}"
input="$(cat)"

field() { printf '%s' "$input" | sed -n "s/.*\"$1\"[[:space:]]*:[[:space:]]*\"\([^\"]*\)\".*/\1/p" | head -1; }
file="$(field file_path)"
session="$(field session_id)"
# Windows paths arrive JSON-escaped (C:\\Users\\...); Git Bash reads C:/Users/... reliably.
file="${file//\\\\/\\}"
file="${file//\\//}"
[[ -n "$file" && -f "$file" ]] || exit 0

case "$file" in
  *.lock|*.min.*|*.svg|*.json|*.csv|*.sql|*.md|*/vendor/*|*/node_modules/*) exit 0 ;;
esac
# Prototypes and mocks are one self-contained file on purpose, and scratch files are thrown away.
shopt -s nocasematch
case "$file" in
  *prototype*|*-mock.*|*/mocks/*|*/scratchpad/*|*/.scratch/*) exit 0 ;;
esac
shopt -u nocasematch

lines=$(wc -l < "$file")
(( lines > limit )) || exit 0

seen="${TMPDIR:-/tmp}/ways-file-length-${session:-nosession}"
grep -qxF "$file" "$seen" 2>/dev/null && exit 0
printf '%s\n' "$file" >> "$seen"

echo "$file is $lines lines (the prompt to split is $limit, in docs/standards/code.md). If this change belongs in a new module, put it there. If the file should stay as it is, carry on and say why in the PR." >&2
exit 2
