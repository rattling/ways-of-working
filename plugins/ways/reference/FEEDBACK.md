# Notes for ways, as you go

By the end of a long run, nobody remembers what went wrong in the middle of it, so a closing "anything worth sending back?" gets nothing. Notice it when it happens instead, and at the end offer the person the specific findings.

## Note it when it pops out

The bar is high. A note is about **ways itself**: a skill, a template, a hook, a reference, the flow between commands. Note it when:

- a step didn't fit what was in front of you, and you adapted it, skipped it or worked around it;
- the person corrected or overrode what a skill said to do;
- the instructions contradicted each other, or said nothing about a case that came up;
- the flow stopped, or sent the person somewhere else, for no good reason;
- something cost far more time or tokens than it should have;
- rarely, something worked much better than expected, worth keeping as it is.

Not a note: anything about this repo's code, data or people; an ordinary choice the skill left open; a step that went as written. Most runs have none, and that's fine.

Write each as one line, appended to `.claude/ways/feedback.md`, as it happens:

```
- setup, step 1: stopped to send the person to /setup-matt-pocock-skills, whose four answers ways already fixes. Cost a second setup run.
```

The skill and step, what happened, what it cost, and a suggestion if one is obvious. Say it in ways' terms, not the repo's. Don't interrupt the work to mention it. `.claude/ways/` is gitignored once setup has run; never stage the file, even before then.

## Offer them at the end

When the command hands over, after its last sentence (the merge sentence, where it has one):

- **No notes:** say nothing about feedback.
- **Notes:** list them, numbered, one line each, and ask: "These look worth sending back to ways. For each: send it, drop it, or tell me what you think and I'll fold that in." Then follow `${CLAUDE_PLUGIN_ROOT}/skills/feedback/SKILL.md` with the ones the person keeps, from its step 1: it strips what's not to be shared, shows the issue text, and sends nothing without a yes.

Once they're sent or dropped, delete `.claude/ways/feedback.md`. If the person ends the session first, the file stays, and `/ways:feedback` starts from it next time.
