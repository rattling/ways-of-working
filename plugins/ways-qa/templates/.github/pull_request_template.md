Closes #

## Summary

<!-- One or two lines: what changed in the suite, and why. -->

## How to check

<!--
You don't need to read code to review this. The agent ran the technical checks and pasted
the results below. You check the parts that need a person's judgement.

For a test that pins down a bug (from /ways-qa:reproduce), keep the four checks below.
For any other change, replace them with: what changed, how it was checked (the command and
its last lines), and what the reviewer should look at.
-->

1. **What should happen.** The line at the top of the test:

   > <!-- the expected behaviour, as written in the test -->

   **Source:** <!-- a spec or acceptance note in specs/, a rule in specs/domain-rules.md, or the report's own words -->

   *Check:* it comes from a rule, an acceptance note or the report, not from what the app happens to do now.

2. **Why it fails.** The failure from a run without the known-to-fail marker:

   ```
   <!-- pasted from the run -->
   ```

   *Check:* the message states the bug in plain words.

3. **The CI check.** Known to fail on: <!-- the environments where the bug is, e.g. "beta and live", or "live only: fixed on beta" -->

   *Check:* the check on this PR is green. If it's red with **"Expected to fail, but passed"**, the bug is already fixed on the environment CI runs against: ask for the marker to cover only the environments where the bug still is. Don't merge past a red check.

4. **Only the test changed.** Files in this PR: <!-- the list -->

   *Check:* nothing else is in it.

**Happy? Approve, then merge.**

## Evidence

<!-- The run of `npx playwright test`: the command and its last lines. Screenshots and notes stay in evidence/, which isn't in git. -->

## Merge danger

**Risk:** low / medium / high <!-- a new test is low; a change to the config, CI, environments.json or the standards is higher -->
**Rollback:** <!-- usually: revert this PR -->
