# Testing

Tests are the agent's feedback loop and the reviewer's evidence. Test **behaviour at public boundaries**, not implementation, so a refactor doesn't break them.

## Where the weight goes

| Level | What | How many |
|---|---|---|
| **End-to-end** | A few journeys that matter most to the business, through the real UI or API (Playwright) | Few, slow, worth it |
| **Integration** | Each boundary against its real dependencies: the database in a container, the HTTP API, the file format | The bulk |
| **Unit** | Pure logic with many cases (a roll-up, a price rule) | Where the logic is |

Working with agents shifts the weight towards the top two. Writing and running tests is cheap for an agent. What agents most often get wrong is how the pieces fit together, and only tests at that level catch it. Those tests also survive the refactors an agent makes. The cost is speed and flakiness, so keep end-to-end small and the whole gate under ten minutes.

**Mock only what you don't own** (a third-party API, the clock). Never mock our own database: run it, as a fresh one the test run builds from the schema (`delivery.md`, the gate).

## Rules

- **Every invariant in the charter is a named test.**
- **A bug starts as a failing test** that reproduces it.
- **Untested legacy code gets characterisation tests before it changes**: pin what it does today, bugs included, and file the bugs as issues.
- **A flaky test is a bug.** Fix it or delete it. Never retry until green.
- **Each test creates the data it needs.** No dependence on shared data someone else changes.
