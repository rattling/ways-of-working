#!/usr/bin/env bash
# In autonomous mode, don't let the agent change the default branch itself.
# Active only while .ways/autonomous exists, like the Stop gate. Interactive sessions are untouched.
# Refuses a git push that updates the default branch, and, while the merge dial is on learning,
# a gh pr merge into it. Where GitHub protects `main` this repeats its rules; where it can't
# (a private repo on the free plan), it's the only thing that does.
# It reads the command as written, so it stops mistakes, not an agent set on getting round it.
# Exit 2 refuses the tool call; stderr goes back to Claude as the reason.

set -u
input="$(cat)"
# Pull a JSON string field out of the hook input, unescaped. sed -E, so it works in GNU and BSD sed.
field() {
  printf '%s' "$input" | sed -nE "s/.*\"$1\"[[:space:]]*:[[:space:]]*\"(([^\"\\\\]|\\\\.)*)\".*/\1/p" | head -1 \
    | sed -e 's/\\"/"/g' -e 's/\\\\/\\/g'
}
cwd="$(field cwd)"
project=""
[[ -n "$cwd" ]] && project="$(git -C "$cwd" rev-parse --show-toplevel 2>/dev/null)"
project="${project:-${CLAUDE_PROJECT_DIR:-$PWD}}"
[[ -f "$project/.ways/autonomous" ]] || exit 0

command="$(field command)"
[[ "$command" == *"git"*"push"* || "$command" == *"gh"*"pr"*"merge"* ]] || exit 0

default="$(git -C "$project" symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null)"
default="${default#origin/}"
default="${default:-main}"
current="$(git -C "$project" branch --show-current 2>/dev/null)"

refuse() {
  echo "Refused: $1 Autonomous runs never change \`$default\` directly: push your branch and open a PR, and leave merging into \`$default\` to a person. If this is wrong, say so in your hand-over instead of finding another way round." >&2
  exit 2
}

# Each command in a chain on its own: split at ;, &&, || and |.
while IFS= read -r part; do
  read -ra words <<< "$part"
  for ((i = 0; i < ${#words[@]}; i++)); do
    if [[ "${words[i]}" == git && " ${words[*]:i+1} " == *" push "* ]]; then
      args=() seen=0
      for w in "${words[@]:i+1}"; do
        if (( seen )); then args+=("$w"); elif [[ "$w" == push ]]; then seen=1; fi
      done
      refspecs=() remote=""
      for a in "${args[@]}"; do
        case "$a" in
          --all|--mirror) refuse "\`git push $a\` pushes \`$default\` along with everything else." ;;
          -*) ;;
          *) if [[ -z "$remote" ]]; then remote="$a"; else refspecs+=("$a"); fi ;;
        esac
      done
      if (( ${#refspecs[@]} == 0 )); then
        [[ "$current" == "$default" ]] && refuse "this pushes the branch you're on, which is \`$default\`."
      fi
      for r in "${refspecs[@]}"; do
        dest="${r#+}"; dest="${dest##*:}"; dest="${dest#refs/heads/}"
        [[ "$dest" == HEAD ]] && dest="$current"
        [[ "$dest" == "$default" ]] && refuse "\`$r\` pushes to \`$default\`."
      done
      break
    fi
    if [[ "${words[i]}" == gh && "${words[i+1]:-}" == pr && "${words[i+2]:-}" == merge ]]; then
      dial="$(sed -nE 's/^\*\*Dial:\*\*[[:space:]]*([a-z]+).*/\1/p' "$project/AGENTS.md" 2>/dev/null | head -1)"
      [[ "${dial:-learning}" == learning ]] || break
      pr=""
      for w in "${words[@]:i+3}"; do [[ "$w" != -* ]] && { pr="$w"; break; }; done
      base="$(cd "$project" && gh pr view $pr --json baseRefName --jq .baseRefName 2>/dev/null)"
      # Fail closed: a merge whose base can't be read is treated as one into the default branch.
      [[ -n "$base" && "$base" != "$default" ]] && break
      refuse "this merges a PR into \`$default\`, and the merge dial in AGENTS.md is on learning, so a person reviews and merges every PR into it."
    fi
  done
done < <(printf '%s\n' "$command" | awk '{ gsub(/&&|\|\||;|\|/, "\n"); print }')
exit 0
