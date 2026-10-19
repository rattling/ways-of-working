# Coding standards

The `code-review` skill reviews every change against this file. Start from these defaults; tighten them for this repo, and add a line when a review or an incident teaches something. Anything a linter or test can enforce belongs in the gate instead.

- **Clear contracts at module boundaries.** Public interfaces are explicit and versioned when they cross a system boundary.
- **Small, cohesive modules.** A file past about 500 lines is a smell.
- **Explicit over clever.**
- **Test behaviour at public boundaries, not implementation.** Expected values come from an independent source, never recomputed the way the code does.
- **Invariants are named tests.** If it must never regress, a test with its name says so.
- **Reversible by default.** Small changes, feature flags for unfinished work, one-step rollback. Database migrations move forward only: expand, migrate, contract.
- **Secure by default.** No secrets in the repo or in logs. Routes require authentication unless explicitly allowlisted. Config that would be unsafe in production stops the app starting.
- **Fail loudly.** Unsupported input is an error that names itself, not a silent skip.
- **The gate is the truth.** Lint, types, tests and build, the same command locally and in CI.
