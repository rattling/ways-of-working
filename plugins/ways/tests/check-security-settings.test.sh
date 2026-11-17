#!/usr/bin/env bash
# Tests for scripts/check-security-settings.sh. Run: bash plugins/ways/tests/check-security-settings.test.sh
# A fake `gh` on PATH answers the three API calls from the variables each case sets.

set -u
here="$(cd "$(dirname "$0")/.." && pwd)"
script="$here/scripts/check-security-settings.sh"
failures=0
bin="$(mktemp -d)"

cat > "$bin/gh" <<'EOF'
#!/usr/bin/env bash
# gh api <path> [--jq <filter>]: print REPO_JSON through jq, or answer the Dependabot endpoints.
path="$2"; filter="."; [ "${3:-}" = --jq ] && filter="$4"
case "$path" in
  */vulnerability-alerts) [ "$ALERTS" = on ] ;;
  */automated-security-fixes) printf '{"enabled":%s,"paused":false}' "$UPDATES" | jq -r "$filter" ;;
  repos/*) printf '%s' "$REPO_JSON" | jq -r "$filter" ;;
esac
EOF
chmod +x "$bin/gh"

run() { # REPO_JSON, alerts on|off, updates true|false
  out="$(REPO_JSON="$1" ALERTS="$2" UPDATES="$3" PATH="$bin:$PATH" bash "$script" o/r)"; code=$?
}

check() { # description, then a test expression
  if eval "$2"; then echo "ok    $1"; else echo "FAIL  $1"; failures=$((failures + 1)); echo "$out" | sed 's/^/      /'; fi
}

on='{"status":"enabled"}'; off='{"status":"disabled"}'

run "{\"permissions\":{\"admin\":true},\"visibility\":\"public\",\"security_and_analysis\":{\"secret_scanning\":$on,\"secret_scanning_push_protection\":$on}}" on true
check "a public repo with everything on passes" '[[ $code == 0 && $out != *off* && $out == *"code-scanning: on"* ]]'

run "{\"permissions\":{\"admin\":true},\"visibility\":\"public\",\"security_and_analysis\":{\"secret_scanning\":$off,\"secret_scanning_push_protection\":$off}}" off false
check "everything off is reported" '[[ $code == 1 && $out == *"dependabot-alerts: off"* && $out == *"dependabot-security-updates: off"* && $out == *"secret-scanning: off"* && $out == *"push-protection: off"* ]]'

run '{"permissions":{"admin":true},"visibility":"private","security_and_analysis":{}}' on true
check "a private repo without the add-ons says unavailable, not off" '[[ $code == 0 && $out == *"secret-scanning: unavailable"* && $out == *"code-scanning: unavailable"* ]]'

run "{\"permissions\":{\"admin\":true},\"visibility\":\"private\",\"security_and_analysis\":{\"code_security\":$on,\"secret_scanning\":$on,\"secret_scanning_push_protection\":$on}}" on true
check "a private repo with Code Security can upload CodeQL" '[[ $out == *"code-scanning: on"* ]]'

run '{"permissions":{"admin":false},"visibility":"private"}' on true
check "without admin, the settings are unknown" '[[ $code == 0 && $out == *"dependabot-alerts: unknown"* && $out == *"secret-scanning: unknown"* && $out == *"code-scanning: unknown"* ]]'

[[ $failures == 0 ]] && echo "all passed" || { echo "$failures failed"; exit 1; }
