#!/usr/bin/env bash
# Lists GitHub Actions workflows that break the supply-chain rules (docs/standards/security.md,
# "The supply chain"). /ways:setup runs it on every run and puts what it finds in the report.
#
#   bash check-workflows.sh [workflows-dir]     (default .github/workflows)
#
# One line per finding, `<file>:<line>: <kind>: <detail>`, where kind is
#   unpinned            an action used by tag or branch, not a full commit SHA
#   no-permissions      no top-level `permissions:`, so jobs get the repo's default token
#   pr-target-checkout  a pull_request_target workflow checking out the PR's code: it runs
#                       with the base repo's secrets and a write token. The serious one.
# Exit 0 when there's nothing to report, 1 when there is.
#
# It reads the YAML line by line, not with a parser, so it can't follow anchors or reusable
# workflows' inputs. It errs towards reporting: a person reads the list.

set -u
dir="${1:-.github/workflows}"
[ -d "$dir" ] || exit 0

found=0
for f in "$dir"/*.yml "$dir"/*.yaml; do
  [ -f "$f" ] || continue
  out="$(awk -v file="$f" '
    { line = $0; sub(/[ \t]+#.*$/, "", line); sub(/^#.*$/, "", line) }

    # uses: owner/repo[/path]@ref. Local actions (./) and docker:// images are left alone.
    match(line, /uses:[ \t]*["\x27]?[^ \t"\x27]+/) {
      ref = substr(line, RSTART, RLENGTH); sub(/uses:[ \t]*["\x27]?/, "", ref)
      if (ref !~ /^\.\// && ref !~ /^docker:\/\//) {
        at = index(ref, "@"); sha = at ? substr(ref, at + 1) : ""
        if (length(sha) != 40 || sha ~ /[^0-9a-f]/)   # no {40}: older mawk lacks intervals
          printf "%s:%d: unpinned: %s\n", file, NR, ref
      }
    }

    line ~ /^permissions:/ { perms = 1 }
    line ~ /pull_request_target/ { prt = 1 }
    # A checkout of the PR head: by ref, by SHA, or the merge ref.
    line ~ /(ref|repository):.*(github\.event\.pull_request\.head\.|github\.head_ref|refs\/pull\/)/ {
      heads[NR] = line
    }

    END {
      if (!perms) printf "%s:1: no-permissions: no top-level permissions:, so jobs get the default token\n", file
      if (prt) for (n in heads) printf "%s:%d: pr-target-checkout: pull_request_target checks out the PR code:%s\n", file, n, heads[n]
    }
  ' "$f")"
  if [ -n "$out" ]; then printf '%s\n' "$out"; found=1; fi
done
exit "$found"
