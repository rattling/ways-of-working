# Running Pocock's typed-only skills from a ways command

Some of Pocock's skills can only be started by a person typing them (`disable-model-invocation: true`): `to-spec`, `to-tickets`, `implement-spec`, `grill-with-docs` and `triage`. The Skill tool refuses them. So when a ways command says to run one of these, don't call the Skill tool, and don't stop for the person to type it. Follow its instructions yourself, in this session:

1. **Find its instructions** in the installed plugin. The newest version is the last line of:

   ```bash
   ls -d ~/.claude/plugins/cache/*/mattpocock-skills/*/skills/*/<skill>/SKILL.md | sort -V | tail -1
   ```

   If that finds nothing, try the folder of any other installed copy (`find ~/.claude/plugins -path '*mattpocock-skills*' -name SKILL.md -path '*/<skill>/*'`).

2. **Read it, and any file it links to beside it, then follow it** as if the person had typed `/<skill>`, with the issue or spec the ways command was given as its argument. `docs/agents/issue-tracker.md` holds this repo's conventions on top of it, as it would for the typed command.

3. **Say so in one line** ("Running Pocock's `to-spec` steps"), so the person knows which part of the flow this is.

**If its instructions can't be found**, stop and give the person the exact command to type, with its argument (for example `/to-tickets #22`), and what to do after it: "then run `/ways:build #22` again: it picks up from the tickets."

`grilling`, `domain-modeling`, `code-review`, `tdd`, `prototype` and `diagnosing-bugs` can be called with the Skill tool as usual. Call `code-review` as `mattpocock-skills:code-review`, not Claude Code's built-in skill of the same name.
