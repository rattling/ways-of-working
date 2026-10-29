---
name: feedback
description: Send feedback on how ways worked in this session back to the ways-of-working repo, as a GitHub issue. Drafts it from the session, strips anything about this repo the person doesn't want shared, shows the text, and opens the issue only after a yes.
disable-model-invocation: true
---

# Feedback on ways

How the method worked in practice is what improves it: where the flow stopped, what a skill got wrong, what worked better than expected. This turns a session's experience into an issue on the ways-of-working repo, without leaking anything from the repo it happened in.

Input, optional: what the person wants to say. Start from the `[ways]` notes in `.ways/feedback.md` if there are any (`${CLAUDE_PLUGIN_ROOT}/reference/FEEDBACK.md` says how they're kept), and from the session. If there's nothing in either, ask the person what they'd change rather than drafting from vague memory.

When the notes are being offered at the end of a command, the person has already picked which to keep: draft only those, with what they added folded in. Once they're sent or dropped, remove them from `.ways/feedback.md`, and delete the file if nothing's left. `[repo]` notes aren't this skill's: leave them for the end of the next command, or offer them now as `FEEDBACK.md` says.

## 1. Draft it

Write it the way `.github/ISSUE_TEMPLATE/session-feedback.md` in the ways-of-working repo lays it out:

- **Title:** the finding, not the session ("`/ways:build` stops at Pocock's typed-only skills"), or "Session feedback: <what was run>" for several.
- **What was run:** the commands and the ways version (`${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json`), how long, roughly what it cost if known.
- **What worked**, in a few lines.
- **Friction, worst first:** each one what happened, what it cost, and a suggestion if there is one. Name the ways skill or file it's about.

Only what the session actually showed. No guesses dressed as findings.

## 2. Strip what isn't to be shared

The ways-of-working repo is public. Take out, or replace with something generic:

- client and company names, people's names, product and system names that identify them;
- repo names, URLs, issue and PR links in the person's repos (say "a client repo", "the integration PR");
- code, data, file contents, paths that reveal the domain, error text with real values;
- numbers that are the business's own.

Keep what's about ways: which skill, which step, what it did, the version.

## 3. Show it, then send it on a yes

Show the full title and body, and say plainly: "This goes to a public repo, rattling/ways-of-working. Anything to take out?" Send nothing until the person says yes.

On a yes, the repo is the `repository` in `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json`:

```bash
gh issue create --repo <owner>/<repo> --title "<title>" --body-file <file> --label enhancement
```

If the label doesn't exist there, create the issue without it. If `gh` isn't installed or signed in, or the person has no GitHub account, write the text to `ways-feedback.md` in the session's scratch folder, give the path, and say where to send it: a new issue at `https://github.com/<owner>/<repo>/issues/new`, pasted in. Don't put the feedback in a URL.

Give the issue's link when it's created.
