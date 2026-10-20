---
name: interview-guide
description: Writes a discovery interview guide before customer or stakeholder calls — learning goals, the riskiest assumption behind each, and event-anchored questions per persona, plus recording setup that makes later synthesis reliable. Use when someone is about to run discovery interviews, asks "what should I ask them", or wants to prep calls with clients, users or internal teams.
---

# Interview guide (pipeline step 0)

Good synthesis starts before the call. Most bad discovery data comes from hypothetical questions ("would you use…"), leading questions ("would a dashboard help?"), and pitching. This skill writes a guide that avoids those and sets up the recording so step 1 has something to reconcile.

## Inputs

- `context/brief.md`: the problem space, who will be interviewed, what the team already believes. If it's missing, ask for these three things in one message.
- Optional: an existing solution idea the team is attached to. Ask for it explicitly. It's better to know the bias than to have it leak into the questions.
- Whether the calls are **real or roleplayed** (a colleague playing the client, a mock stakeholder). Ask once if the brief doesn't say. Roleplayed calls are still useful for practice and for finding questions, but their answers are plausible accounts, not behavior of real customers. Record the answer in the brief; later steps carry it into their caveats.

## Process

0. **Why are we doing this? Write it down before any question.** Two lines in the guide:
   - The **business outcome** this work should move for the company (retention, revenue per client, cost to serve, win rate, time to deliver) and how we would notice it moved. If the team can't name one, that is the first finding: say so, and add "what does this cost or earn the business?" to the learning goals.
   - The **customer outcome**: what the person on the other side is trying to get done.
   - The **why now**: what changed recently, or what happens if the team waits a year. If nobody can say, that is a finding: add "what changed?" to the learning goals.
   Calls that start without these end with a list of annoyances and no way to rank them.
1. **List what we need to learn.** Write 4 to 6 learning goals. Each is a question about the world, not about a feature. Good: "How does a client know a request was seen?" Bad: "Do clients want a status page?"
2. **Name the assumption behind each goal** and how bad it is if wrong (high / medium / low). Order goals by that.
2b. **Write the team's beliefs and try to break them.** List 3 to 5 things the team currently believes about the relationship, in plain statements ("clients trust our deliveries", "clients rarely ask for changes", "our account manager is the bottleneck"). For each, write one question that would reveal the opposite if it were true. Ask what the team would be surprised to hear. The most expensive mistake in discovery is a belief nobody wrote down, because nobody checks it. Split vague words like "trust": trust in a person, in the process, in the output, and in the reasoning behind the output are four different things.
3. **Map goals to personas.** For each persona, mark which goals they can actually speak to. A client can't tell you how production schedules work; an account manager can't tell you what the client does on Sunday.
4. **Write questions per persona, 6 to 8 each.** Rules:
   - Anchor in a specific recent event: "Walk me through the last time…", "Tell me about last night's order."
   - Ask about behavior and workarounds: "What did you do then?", "Where do you keep track of that?"
   - Ask for numbers when they'd naturally exist: how often, how many, how long.
   - **Dig into the pain, don't test the idea.** The call exists to hear their problem in their words, not to find out whether your solution would work. Never ask "would this work for you?", "would you use…?", "what would you want?" or "what would help?" Hypotheticals get polite yeses. Instead ask what happened the last time, what it cost, what they did about it, and what they tried before. If you want a reaction to an idea, save it for step 7 and a prototype.
   - **Follow the strongest complaint.** When they name something as the biggest problem, or say it twice, or say it with feeling, stop and go three questions deep before moving on: when did it last happen, what did you do, what did it cost, who else noticed. Do this even when it isn't in the guide, and even when it isn't what the team came to build.
   - **Ask for the business consequence per persona.** "What happened to the project when that went wrong?" "Would that change how much work you give us?" "Who else decides whether you keep working with us?" Not every answer will have a number. Notice when none does.
   - **Ask what changed.** "What is different this month or season compared with last?" Triggers (a new menu, a season, a rule, a new competitor, a failed earlier attempt) are the raw material for the why-now argument later.
   - One "what do you like / what must not change" question. People protect things you'd otherwise break.
   - One "what's the biggest problem, if you had to pick one" question, late in the call, after they've told stories. Compare their answer to their stories in step 2.
   - Close with "What should I have asked and didn't?"
5. **Write probes** the interviewer can use anywhere: "What happened next?", "How did you know?", "What did you do instead?", "Can you show me?", "How often?"
6. **List what not to ask** for this specific project, including the leading version of the team's favorite solution (e.g. "Would a dashboard help?"). Explain that if it slips out, the answer must be marked as prompted in step 2. Add a rewrite table for the phrasings the interviewer is most likely to fall into:

   | Instead of | Ask |
   |---|---|
   | "Would a status page help?" | "Last time you wanted to know where something stood, what did you do?" |
   | "What would you want from us?" | "What was the last thing from us that didn't land? What happened next?" |
   | "Would this work for you?" | "How do you handle that today? What breaks?" |
   | "Do you trust our work?" | "Tell me about the last delivery you weren't sure about. How did you decide what to do?" |
7. **Listen-for list.** Things worth noting live: workarounds people built themselves (spreadsheets, DMs, screenshots), emotional words, numbers, things they say twice, things they hedge.
8. **Recording setup.** Recommend:
   - Record with two transcription sources if possible (e.g. the meeting tool's transcript plus a second recorder). One usually gets speaker labels right and the other gets wording right; step 1 merges them.
   - Write the glossary (product names, internal tool names, acronyms) into the brief before the call; transcription tools mangle exactly these.
   - Note the interviewer's name as it will appear in the transcript.

9. **After-call self-check.** Add three lines the interviewer fills in within an hour of each call, before reading any transcript: how many times I proposed or described an idea; the one thing I heard that contradicts a belief on the list; the strongest complaint, in their words, and whether the guide covered it. Hand these to step 2, which marks the leading questions and weighs the answers.

## Output: `out/00-interview-guide.md`

```
# Interview guide — <project>
## Why we're doing this
Business outcome: ... / Customer outcome: ... / Why now: ...
Calls are: real | roleplayed
## Beliefs to break
| Belief | Question that would show the opposite |
## Learning goals (ordered by risk)
| # | Goal | Assumption behind it | Risk if wrong | Personas who can answer |
## Questions — <Persona A>
1. ...
## Questions — <Persona B>
## Probes
## Don't ask
## Listen for
## Recording setup
## After-call self-check
```

Keep it to two pages. An interviewer has to be able to glance at it mid-call.

## Stop here: show the results and ask how to continue

This step always ends with a stop, including when it runs inside a full pipeline or the user said "run everything". Never start the next step, and never apply a decision, until the user answers. The one exception is a delegated run, as the orchestrator defines it: show the results, log the delegated decision and continue.

1. **Show the results in the chat**, not only the file path: the business and customer outcome lines, the beliefs-to-break table, the learning goals table and the first three questions for each persona. Then say where the full file is.
2. **Ask the decisions below.** Give your recommended answer for each, clearly marked as a recommendation.
3. **Ask how to continue**, offering: Continue to step 1, `transcript-reconcile` (once the calls are recorded) · redo this step with changes · edit the output together · stop here.

Then wait for the user.

### Decisions for you

End with:
- "Which persona do you talk to first?" (Recommend the one closest to the money or the pain; the second call can then probe what the first revealed.)
- "Is there a solution the team is already attached to? I've put its leading question on the don't-ask list; tell me if I named the wrong one."
- "Which belief on the list would hurt most if it were wrong? I put the question for it first." (Recommend the belief the proposed solution depends on.)
