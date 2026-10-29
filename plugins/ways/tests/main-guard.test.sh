#!/usr/bin/env bash
# Tests for scripts/main-guard.sh. Run: bash plugins/ways/tests/main-guard.test.sh
# Each case feeds the hook the PreToolUse input Claude Code sends for a Bash command,
# in a throwaway repo on a feature branch, and checks whether it was refused.

set -u
script="$(cd "$(dirname "$0")/.." && pwd)/scripts/main-guard.sh"
failures=0

# A repo in autonomous mode on branch $1, with the merge dial on $2.
repo() {
  dir="$(mktemp -d)"
  git -C "$dir" init -q -b main
  git -C "$dir" -c user.name=t -c user.email=t@t commit -q --allow-empty -m init
  [[ "$1" == main ]] || git -C "$dir" switch -q -c "$1"
  mkdir -p "$dir/.ways"; echo 3 > "$dir/.ways/autonomous"
  printf '## Merging\n\n**Dial:** %s <!-- learning | default | trusted -->\n' "$2" > "$dir/AGENTS.md"
}

# A stand-in gh that says every PR's base is $1.
bin="$(mktemp -d)"
fake_gh() { printf '#!/usr/bin/env bash\necho %s\n' "$1" > "$bin/gh"; chmod +x "$bin/gh"; }

# Run the hook on command $1 in the current repo. Sets code and err.
run() {
  local e cmd
  e="$(mktemp)"
  cmd="${1//\/\\}"; cmd="${cmd//\"/\\\"}"
  printf '{"hook_event_name": "PreToolUse", "tool_name": "Bash", "cwd": "%s", "tool_input": {"command": "%s"}}' "$dir" "$cmd" \
    | PATH="$bin:$PATH" bash "$script" 2>"$e" >/dev/null
  code=$?
  err="$(cat "$e")"; rm -f "$e"
}

check() { # description, then a test expression
  if eval "$2"; then echo "ok    $1"; else echo "FAIL  $1"; failures=$((failures + 1)); fi
}

repo feat/3-thing learning
run "git push -u origin feat/3-thing"
check "pushing the feature branch is allowed" '[[ $code == 0 ]]'
run "git push"
check "a bare push from a feature branch is allowed" '[[ $code == 0 ]]'
run "git push origin main"
check "pushing to main is refused" '[[ $code == 2 && $err == *"pushes to \`main\`"* ]]'
run "git push origin HEAD:main"
check "pushing HEAD to main is refused" '[[ $code == 2 ]]'
run "git push --force origin +feat/3-thing:refs/heads/main"
check "a forced refspec onto main is refused" '[[ $code == 2 ]]'
run "git add -A && git commit -m \"x\" && git push origin main"
check "a push to main at the end of a chain is refused" '[[ $code == 2 ]]'
run "git push --all origin"
check "push --all is refused" '[[ $code == 2 ]]'
run "git status"
check "other commands are untouched" '[[ $code == 0 ]]'

repo main learning
run "git push"
check "a bare push while on main is refused" '[[ $code == 2 && $err == *"which is \`main\`"* ]]'
run "git push origin HEAD"
check "pushing HEAD while on main is refused" '[[ $code == 2 ]]'

repo feat/3-thing learning
fake_gh main
run "gh pr merge 12 --merge"
check "on learning, merging a PR into main is refused" '[[ $code == 2 && $err == *"learning"* ]]'
fake_gh feature/9-allergens
run "gh pr merge 12 --merge"
check "merging a ticket into an integration branch is allowed" '[[ $code == 0 ]]'
printf '#!/usr/bin/env bash\nexit 1\n' > "$bin/gh"
run "gh pr merge 12"
check "a merge whose base can't be read is refused" '[[ $code == 2 ]]'

repo feat/3-thing default
fake_gh main
run "gh pr merge 12 --squash"
check "on the default dial, the agent's own merges are left to the dial" '[[ $code == 0 ]]'
run "git push origin main"
check "but a push to main is refused whatever the dial" '[[ $code == 2 ]]'

repo main learning
rm "$dir/.ways/autonomous"
run "git push origin main"
check "interactive (no marker): nothing is refused" '[[ $code == 0 ]]'

echo
if (( failures )); then echo "$failures failed"; exit 1; fi
echo "all passed"
