# Code

- **Small, cohesive files.** Around 500 lines is a prompt to split by responsibility. It's crude, and it works: big files are where agents and people both lose track. If a file stays big, say why in the PR.
- **Names from the glossary.** The domain's words, used the same way in code, UI and conversation.
- **Comments say why, not what.** No commented-out code, no dead code.
- **Fail loudly, at the boundary.** Never swallow an error. Users see a plain message; logs get the detail. Never show secrets, connection strings, stack traces or SQL to a user.
- **Configuration comes from the environment.** Nothing environment-specific in code, and no secrets in config files that are committed.
- **Structured logs, no personal data.**
- **One look, set once.** The default for an app with screens; the team can choose otherwise. It has one set of design tokens (colours, type, spacing, radius) in one shared stylesheet, for light and dark, with `color-scheme` declared and the page background set, and one styled shell (header, navigation, page frame) that every screen sits in. Screens use the tokens; they don't invent colours. Without this, every visual ticket makes up its own, and unstyled browser defaults show through: in dark mode, near-black form fields on a white page.
- **Change what the work needs.** Tidy what you touch, within the change's scope. A refactor is its own PR.

## Tooling

Every repo has, in its gate:

- a **formatter**, checked, not just run;
- a **linter**;
- **static analysis with a baseline**: existing findings are recorded and the baseline may only shrink. New code meets the bar; old code improves as it's touched.

**Pre-commit hooks** run the formatter and a secret scan locally. They're a convenience: they can be skipped, so CI is where the rules are enforced.

The stack files say which tools.
