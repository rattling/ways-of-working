# QA standards

Copied in by `ways-qa` the first time `/ways-qa:triage` or `/ways-qa:reproduce` runs in a repo. This repo's copy is the one that counts: change it by PR. Both skills read it every time, so a rule written here is a rule they follow. Until the sections marked **fill in** are filled in, triage hands every call to a person.

## The app under test

<!-- fill in -->
- **URL:** <https://staging.example.com>
- **Test accounts:** where they are (a password manager entry, a seed file), never the passwords themselves.
- **Environments:** which ones testers may use, and which they must not (production, a shared demo).

## Domain rules

Rules about this app's domain that decide severity or what "correct" means, whatever any one report says. Triage and reproduce treat them as part of the spec.

<!-- fill in. For example: "A wrong total on an invoice is always S1." "Dates show in the user's time zone." -->
- 

## Severity

How bad it is for the person using it. Separate from priority, which is when it gets fixed and belongs to whoever owns the backlog. Triage proposes a severity; it never sets priority.

| Severity | Label | Means | Examples |
|---|---|---|---|
| S1 critical | `severity:1-critical` | Wrong results someone could act on, data lost or exposed, or a core flow blocked for everyone, with no workaround | |
| S2 major | `severity:2-major` | A core flow broken for some people, or with a workaround that's hard to find | |
| S3 minor | `severity:3-minor` | Wrong or awkward, with an easy workaround | |
| S4 cosmetic | `severity:4-cosmetic` | Looks wrong, works right | |

<!-- fill in the examples column from this app -->

## Routing

Who takes a confirmed bug or request, by area. Triage routes to one row, or to the triage owner if it can't tell.

<!-- fill in -->
| Area | Covers | Goes to | Label | Takes agent work |
|---|---|---|---|---|
| | | | `team:` | yes / no |

**Triage owner** (gets anything below the threshold, and anything that doesn't fit a row): <!-- fill in: a GitHub handle or team -->

## Confidence

Triage states a confidence for each call it makes: **high**, **medium** or **low**. These are levels with criteria, not probabilities (`/ways-qa:triage` says what each one needs).

- **Applied without asking:** calls at **high** <!-- the agreed threshold; raise or lower it by PR -->
- **Everything below goes to a person:** the call is written into the triage comment as a recommendation, and the label isn't applied.
- **Always a person, whatever the confidence:** closing anything, marking a duplicate, and S1.

Review the threshold after the first few weeks: compare the calls the agent made with the ones people made, and move it.

## Patterns

**A pattern is** <!-- default: three bugs in the same area with the same kind of failure, open or closed, in the last six months --> When a new bug makes one, triage proposes an improvement issue for engineering.

## Labels

The label strings triage uses. Change the right-hand column to match this tracker; triage creates a missing label only after asking.

| Role | Label |
|---|---|
| Waiting for triage | `needs-triage` |
| Waiting on the reporter | `needs-info` |
| Ready for an agent to fix | `ready-for-agent` |
| Ready for a person to fix | `ready-for-human` |
| Won't be done | `wontfix` |
| Something is broken | `bug` |
| New or changed behaviour | `enhancement` |
| Behaves as designed | `working-as-designed` |
| Probably the same as another issue | `possible-duplicate` |
| Was fixed, and is back | `regression` |
| Improvement proposed from a pattern of bugs | `improvement` |
| Has a failing test | `has-test` |

## Evidence

- **Where it goes:** `evidence/issue-<n>/` in this repo, ignored by git. The triage comment names the path; attach a screenshot to the issue by hand when the issue needs it.
- **What never goes in an issue:** passwords, tokens, personal data from the app. Cut them from console and network output before posting.
