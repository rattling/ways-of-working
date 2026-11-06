# Local issues live on branches

**Status:** accepted, November 2026 (#58)

## Context

With the local-markdown tracker, an issue is a file under `.scratch/`, and its state is a `Status:` line. A change of state made on a feature branch, or during a build on the integration branch, only reaches `main` when that PR merges. Until then, a fresh session on `main` sees the old state.

## Options

- **Status changes go straight to `main`**, in their own commits, so `main` is always current.
- **Status changes travel with the work**, on the branch, and reach `main` with the merge.

## Decision

Status changes travel with the work. Nothing a ways command does writes to `main`. Ways already guards `main` against autonomous pushes, and a second path onto it would undo that. The branch is the claim: a branch whose name carries the issue's ID means someone has it. Closing shows in the PR's diff (`Status: done`), the local version of `Closes #n`. A build keeps its ticket statuses on the integration branch, which is where a resumed build reads them anyway.

## What would make us revisit it

A team running several people's work against local issues finds that the state on `main` lags enough to cause double work: two people starting the same issue because neither saw the other's branch.
