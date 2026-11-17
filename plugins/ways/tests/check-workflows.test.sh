#!/usr/bin/env bash
# Tests for scripts/check-workflows.sh. Run: bash plugins/ways/tests/check-workflows.test.sh
# Each case writes a workflow into a throwaway .github/workflows and checks what's reported.

set -u
here="$(cd "$(dirname "$0")/.." && pwd)"
script="$here/scripts/check-workflows.sh"
failures=0

# Write stdin as the only workflow, run the check. Sets out and code.
run() {
  local root; root="$(mktemp -d)"
  mkdir -p "$root/.github/workflows"
  cat > "$root/.github/workflows/ci.yml"
  out="$(bash "$script" "$root/.github/workflows")"; code=$?
}

check() { # description, then a test expression
  if eval "$2"; then echo "ok    $1"; else echo "FAIL  $1"; failures=$((failures + 1)); echo "$out" | sed 's/^/      /'; fi
}

run <<'EOF'
on: push
permissions:
  contents: read
jobs:
  a:
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - uses: ./.github/actions/local
      - uses: docker://alpine:3.20
EOF
check "pinned, local and docker actions with permissions pass" '[[ $code == 0 && -z $out ]]'

run <<'EOF'
on: push
permissions: read-all
jobs:
  a:
    steps:
      - uses: actions/checkout@v4
      - name: x
        uses: "astral-sh/setup-uv@main"
      - uses: org/repo/sub/path@abc123 # short SHA
EOF
check "a tag is reported" '[[ $code == 1 && $out == *"ci.yml:6: unpinned: actions/checkout@v4"* ]]'
check "a quoted branch is reported" '[[ $out == *"unpinned: astral-sh/setup-uv@main"* ]]'
check "a short SHA is reported" '[[ $out == *"unpinned: org/repo/sub/path@abc123"* ]]'
check "permissions: read-all counts as set" '[[ $out != *no-permissions* ]]'

run <<'EOF'
on: push
jobs:
  a:
    permissions:
      contents: read
    steps:
      - run: echo hi
EOF
check "job-level permissions only is reported" '[[ $code == 1 && $out == *"ci.yml:1: no-permissions"* ]]'

run <<'EOF'
# permissions: would go here
on: push
jobs: {}
EOF
check "a commented-out permissions doesn't count" '[[ $out == *no-permissions* ]]'

run <<'EOF'
on:
  pull_request_target:
    types: [opened]
permissions:
  contents: read
jobs:
  a:
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          ref: ${{ github.event.pull_request.head.sha }}
EOF
check "pull_request_target checking out the head is reported" '[[ $code == 1 && $out == *"ci.yml:11: pr-target-checkout"* ]]'

run <<'EOF'
on: pull_request_target
permissions:
  pull-requests: write
jobs:
  label:
    steps:
      - uses: actions/labeler@8558fd74291d67161a8a78ce36a881fa63b766a9 # v5.0.0
EOF
check "pull_request_target without a checkout of the PR passes" '[[ $code == 0 ]]'

run <<'EOF'
on: pull_request
permissions:
  contents: read
jobs:
  a:
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          ref: ${{ github.event.pull_request.head.sha }}
EOF
check "pull_request checking out the head passes" '[[ $code == 0 ]]'

for f in "$here"/templates/.github/workflows/*.yml "$here"/../ways-qa/templates/.github/workflows/*.yml; do
  out="$(bash "$script" "$(dirname "$f")")"; code=$?
  check "the template $(basename "$f") passes" '[[ $code == 0 ]]'
done

[[ $failures == 0 ]] && echo "all passed" || { echo "$failures failed"; exit 1; }
