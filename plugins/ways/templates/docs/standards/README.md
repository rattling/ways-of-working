# Engineering standards

Copied in by `/ways:setup`. Just enough to be useful. This repo's copy is the one that counts: change it by PR, and put rules that only this repo needs in `CODING_STANDARDS.md`.

| File | Covers |
|---|---|
| [architecture.md](architecture.md) | Diagrams, contracts, decoupling, proportion, decisions, the NFR walkthrough |
| [code.md](code.md) | Writing code: size, errors, config, linting |
| [testing.md](testing.md) | What to test, where, and with what |
| [security.md](security.md) | Secrets, data, checks at each stage |
| [delivery.md](delivery.md) | Branches, the gate, CI, environments, deploys |
| [php.md](php.md) / [dotnet.md](dotnet.md) | The stack: where it is, where it's going, its tools. Only the ones this repo uses |

## Every rule says where it's checked

A rule nothing checks is advice. This is the list of what's enforced and by what. Anything else in these files is guidance that review applies with judgement.

| Rule | Checked by | When |
|---|---|---|
| The gate is green before merge | CI, as a required check on `main` | PR |
| Formatting, lint and static analysis pass, and the static-analysis baseline only shrinks | The gate | Every commit the agent makes; PR |
| Tests pass; every charter invariant has a named test | The gate; review | PR |
| A file past ~500 lines is a prompt to split | The `ways` hook (tells the agent once per file); review | While editing; PR |
| No secrets in the repo | GitHub push protection; secret scan in CI; the agent can't read `.env` | Push; PR; while editing |
| No dependency with a known high-severity vulnerability | Dependabot alerts and updates; the dependency audit in the gate | Daily; PR |
| Code scanning finds nothing new at high | CodeQL (C#, JavaScript), Psalm taint analysis or Semgrep (PHP) | PR |
| Hard-to-reverse decisions have an ADR | Review: `CODEOWNERS` on `docs/adr/` | PR |
| Public contracts change by addition only, unless a PRD says otherwise | A contract test in the gate; `CODEOWNERS` on the contract | PR |
| High-risk paths get a second person and `/security-review` | `CODEOWNERS`; the risk tier in `REVIEW.md` | PR |
| A new service, integration or data-store change gets an NFR walkthrough | The architecture owner reviews the spec PR | Spec |
| A feature is in proportion: its size is estimated against the closest feature, and the build compared with the estimate | The PRD's **Size**, agreed with the spec; `/ways:build`'s hand-over; review | Spec; integration PR |

Required checks and code-owner review need branch protection. GitHub only offers that on private repos with a paid plan; without it, those rows hold by agreement.
