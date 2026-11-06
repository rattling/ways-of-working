# Building software with Claude: balancing speed and quality

By enterprise software we mean software that has to work reliably, to specification, in production, for many users, over time. That takes a certain amount of good architecture and good development practice. How much is up for debate, and it depends on what the software has to do. A bank processing hundreds of millions of transactions a day needs more than a CRM built for a team of seven. Even so, the field has converged on a few basics.

## What it opens up

The way to think about it: you work like a tech lead with a very fast team. You and Claude work out what to build and how, with your engineering judgement in every decision. Claude builds it, one small piece at a time, tests first. Your attention goes on the two ends, design and checking. The middle goes to Claude.

Some of what changes is speed. More of it is what becomes cheap enough to do:

- **The work teams never had time for.** Tests around legacy code, an architecture page that's actually true, an upgrade off an unsupported PHP, the docs updated in the same change, a proper description on every PR. These were always good ideas. Now they cost minutes.
- **Planning with something in front of you.** A finished-looking screen with real data settles in minutes what pages of questions don't. Claude asks the questions you'd have missed, each with a recommended answer.
- **Reading code nobody remembers.** Claude explains an unfamiliar codebase, maps it, and finds things. A cold read of the 900-line .NET app, with no hints, named all three bugs we had planted in it, including one in how a cache and a culture setting interact.
- **Review with fresh eyes.** A reviewer with no stake in the code, checking it against your standards and against the spec, on every change.
- **More of the job.** Developers taking on their own DevOps and deploys, because Claude writes and explains the infrastructure code.
- **Your software, used by agents.** An app with an API or an MCP server beside its screens can be used by an agent as well as a person. A routine reads a calendar and offers the time entries; a person checks them. Five minutes, and now it gets done.

At the far end, software that changes itself when its users ask. Patrick Collison has shown his own hobby apps working this way. That won't do for enterprise software (Stripe would go down), but the production version already works: feedback becomes a triaged issue and a ready PR, and a person decides what ships.

## What good looks like

**Application architecture: decoupled, but pragmatic.** Whether it's microservices or a modular monolith, the parts are reasonably separated. Each owns its own job and talks to the others through a clear contract, and the inside of each part is the simplest thing that works. There's a great deal more you could say, and the Gang of Four said much of it. For most teams, a clear picture of the parts and the boundaries between them does most of the work.

**Solution architecture: coherent, and written as code.** Which database, which services, serverless or not: there are well-worn patterns and real trade-offs, and the choices just need to fit together. What we've found matters most is infrastructure as code. It's consistent, you can replicate it, and you can change it without starting again. It also means an AI assistant can read it, explain it and work on it like any other code. For the non-functional side (reliability, security, cost, operations, performance), AWS's and Azure's Well-Architected frameworks are a good checklist.

**Development practice: enough structure, little ceremony.** Some degree of spec-driven development now pays off well. It used to be hard to do. With all the hand-offs and timelines, by the time the spec was agreed the thing was due. With an AI assistant the loop is tight: a spec takes five minutes, or an hour for something genuinely complex, and you can go back and change it just as fast. How much spec you need depends on how complex the work is. Around that, the usual things hold. Short-lived branches and small changes. Tests with real coverage of what matters, often written first. One check that has to pass before anything merges.

**Standards and documentation, in and out.** Some documents inform the build: the team's standards, the architecture, the spec. Others come out of it: the PR that says what changed and how to check it, the decision record, the architecture page updated in the same change. Both kinds stay short, and both stay true.

## Why bother

Because problems multiply. Skip these things and you might get one feature out fast, but every shortcut leaves an opening, and the openings compound until each change is riskier than the last. That was true long before AI. Good practice is a running effort to close those openings at each step, so quality goes up instead of draining away.

What you get back is software you can keep changing. New features go in, customers stay happy, and you can swap out a piece underneath without breaking everything else. You also get consistency, repeatable quality, and a codebase other people can work in.

## Two extremes that don't work

**Prompt faster.** Use the AI to go faster and skip the rest. It's great for a quick prototype. For software people will actually use, the problems multiply faster than ever: the agent guesses what you meant, builds far more than you asked for, forgets everything between sessions, says it's done when nothing proves it, and leaves a diff too big to review. That's the list we come back to throughout.

**Hand it all over.** At the other end, some developers push autonomy as far as it goes. Steve Yegge's Gas Town and Beads are the best-known example: swarms of agents building and tracking their own work, with very little human control. It's worth watching, because it shows where this can go. But you give up control, the costs climb, and by his own account he doesn't know how much of what was built works inside. That's fine at the frontier. It's not where you want software your customers depend on, and it's where many teams vibe coding today are running into trouble.

## What goes wrong, and what fixes it

Prompting is fine for small things. These are what break as the work gets bigger or runs longer, and the method answers each one:

| What goes wrong | What fixes it | In the method |
|---|---|---|
| **It guesses** instead of asking, and builds the wrong thing well | Plan first, with a mock, questions or both, then a spec you approve. When unsure, it asks | Features; How work flows |
| **It over-builds:** each step adds a little, and a modest feature comes out at six times the size | Decide the size at the plan, against the closest thing already built | Features |
| **It forgets:** every session starts from zero, and long sessions lose the thread | The repo holds what it needs to know. Progress lives in the tracker, not the chat | Working with the agent; Standards and the repo |
| **The architecture erodes,** one sensible-looking change at a time | One architecture page, each part's limits written down, and review against it | Architecture |
| **It says "done"** and nothing proves it | One gate, the same on your laptop, in CI, and before Claude may stop | Testing and the gate |
| **It follows rules most of the time,** not always | What must hold is held by something other than its judgement | Standards and the repo; Testing and the gate |
| **A huge diff,** with no idea what's risky | Small PRs, a description that says how to check it, review sized to risk | How work flows |
| **It reads things you didn't write,** and some of them try to give it orders | Layers: permissions, review, and no live secrets where it runs | Security |

None of these is a reason not to use it. They're the cost of the opportunities, and each one is solvable.

## Where we land

In between: the engineering basics above, with the AI doing most of the work inside a process that keeps quality up. Plenty of tools help with parts of this. There are spec-driven tools, and Matt Pocock's skills cover the core disciplines well. We wanted something more complete and coherent, and opinionated enough to use out of the box. That's ways.

It's for pragmatic engineers who want to stop either vibe coding or babysitting the agent line by line, and move to a way of working where the AI helps run the process as well as write the code. You end up with better, more modern software, instead of worrying whether it meets the most basic bar.

Give it clear standards and a decent process, and the structure carries the weight instead of the prompt. You don't explain your architecture, your branching or your review rules every time. You say what you want, and it works to the team's way, confidently, interactively or on its own. The autonomy is safe because of what's around it: a precise spec, a check it can't argue with, and the merge stays yours.

[The method](method/) is that structure, area by area, and [ways](ways/) is one way to put it in place.

---

New to software engineering? Start with [software engineering in one page](basics/).
