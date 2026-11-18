#!/usr/bin/env bash
# Reads a GitHub repo's security settings (docs/standards/security.md, "The supply chain") and
# says which are off. Read-only: /ways:setup turns settings on, with the person's go-ahead.
#
#   bash check-security-settings.sh [owner/repo]     (default: the current repo, via gh)
#
# One line per setting, `<setting>: <state>`, where setting is
#   dependabot-alerts, dependabot-security-updates, secret-scanning, push-protection,
#   code-scanning (whether CodeQL results can be uploaded: public, or a paid add-on)
# and state is on, off, unavailable (the plan doesn't include it), or unknown (not an admin,
# so GitHub won't say). Exit 0 when nothing is off, 1 when something is, 2 when gh fails.

set -u
repo="${1:-$(gh repo view --json nameWithOwner --jq .nameWithOwner 2>/dev/null)}"
[ -n "$repo" ] || { echo "no repo: pass owner/repo, or run inside a GitHub checkout" >&2; exit 2; }

info="$(gh api "repos/$repo" --jq '[
  (.permissions.admin // false),
  .visibility,
  (.security_and_analysis.secret_scanning.status // "unavailable"),
  (.security_and_analysis.secret_scanning_push_protection.status // "unavailable"),
  (.security_and_analysis.advanced_security.status // .security_and_analysis.code_security.status // "unavailable")
] | map(tostring) | join(" ")' 2>/dev/null)" || { echo "gh api repos/$repo failed" >&2; exit 2; }
read -r admin visibility scanning push codesec <<< "$info"

state() { case "$1" in enabled) echo on ;; disabled) echo off ;; *) echo "$1" ;; esac; }

if [ "$admin" = true ]; then
  # 204 when on, 404 when off.
  if gh api "repos/$repo/vulnerability-alerts" >/dev/null 2>&1; then alerts=on; else alerts=off; fi
  updates="$(gh api "repos/$repo/automated-security-fixes" --jq 'if .enabled then "on" else "off" end' 2>/dev/null || echo off)"
else
  alerts=unknown; updates=unknown
fi

# Without admin, GitHub leaves security_and_analysis out, which reads as unavailable.
if [ "$admin" != true ]; then scanning=unknown; push=unknown; fi

if [ "$visibility" = public ]; then code=on
elif [ "$codesec" = enabled ]; then code=on
elif [ "$admin" != true ]; then code=unknown
else code=unavailable
fi

out="dependabot-alerts: $alerts
dependabot-security-updates: $updates
secret-scanning: $(state "$scanning")
push-protection: $(state "$push")
code-scanning: $code"
printf '%s\n' "$out"
case "$out" in *": off"*) exit 1 ;; *) exit 0 ;; esac
