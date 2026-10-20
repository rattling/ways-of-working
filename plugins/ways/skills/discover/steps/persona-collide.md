<!-- Step 3 of /ways:discover. Adapted from `persona-collide` in discovery-to-mvp 1.2.0 by Ofer Regev (MIT; see ../LICENSE-discovery-to-mvp). -->

# Persona collide (pipeline step 3)

In B2B, the person who pays, the person who uses the product and the person who runs the process on your side want different things. Summaries average them into "users want visibility". The product decision lives where they disagree, so this step goes looking for disagreement on purpose.

## Inputs

- Two or more `out/02-extract-*.md` files (required).
- The matching `out/01-merged-*.md` files, to check quotes and look for context the extracts didn't carry.
- `context.md`, and `out/01-data.md` and `out/01-built.md` if step 1 wrote them.

## Process

### 1. Map the workflow end to end
From both interviews, reconstruct the actual sequence of steps the work goes through: order → confirmation → picking → substitution → delivery → check → return → credit → invoice, or whatever this domain's real sequence is. For each step record:
- What happens, in a few words.
- **Who owns it according to persona A** (with ID) and **according to persona B** (with ID).
- The channel or tool it happens in.

Then flag every step where:
- **Nobody** is named as owner.
- **Each side thinks the other** owns it.
- **Someone acts as a relay** (copies words from one person to another without adding to them).
- The step is **invisible to one side** (one persona describes it, the other doesn't know it exists).

The map usually produces the most important findings of the whole pipeline. Spend time here.

**Draw it as-is** (added by ways). Under the table, draw the same workflow as a Mermaid `flowchart LR`: one node per step, labelled with who does it, the channel on each edge where it matters, and a dotted edge for where work gets lost or waits (`-. lost or late .->`). Mark flagged steps in the node text. Keep it to what happens today, from the evidence; it's the "before" picture step 5 draws the "after" against. Put the data's numbers on the waits where `out/01-data.md` has them ("pad in the van: median 4 days [DAT-02]").

### 2. Find collisions
Go through every pain, workaround, stated-vs-revealed row and silence in each extract and ask whether the other persona says something that conflicts with it, explains it, or is silent about it. Classify each collision:

- **Opposing needs:** they want things that pull in different directions (one wants to approve every substitution, the other needs the van to leave at six).
- **Same event, two stories:** both describe the same moment and the accounts don't match (one says no answer means yes; the other says no answer means "I was asleep").
- **Shared pain, different cause:** both hurt, but each blames a different link.
- **One-sided:** a major pain for one persona that the other never mentions. Check whether they were asked.
- **Hidden agreement:** they say different words but want the same thing. Worth knowing; it's where v1 is safest.

### 3. For each collision, write what a v1 would have to choose
Not the answer. The choice. "A v1 either gets an explicit answer on substitutions before the van leaves, or stops treating silence as a yes. It can't keep both."

### 4. List what neither mentioned
From the workflow map gaps, the brief's expectations, and the extracts' silence sections. For each: why it matters and whether it's a question for the next interview or a risk to carry into scoping.

### 5. Shared ground
Things both personas want, with IDs from both. This is the safe core of any v1.

## Rules

- Every cell that says what someone said or did carries a turn ID.
- Don't resolve collisions. Present the choice; the PM resolves it in step 4 or 5.
- Severity of a collision = the higher severity of the pains involved (from step 2), +1 if it touches money, legal or a missed deadline.
- Prefer fewer, sharper rows. Eight strong collisions beat twenty weak ones.

## Output: `out/03-collisions.md`

```
# Collisions — <persona A> × <persona B>
## Workflow map
| Step | What happens | Owner per A [ID] | Owner per B [ID] | Channel | Flag |
### As-is
(a Mermaid flowchart LR of the map, with the waits and losses dotted)
## Collisions
| # | Topic | Type | <A> says [ID] | <B> says [ID] | What v1 must choose | Severity |
## Same event, two stories
Short narrative for each, with IDs — these are the best demo material and the best interview follow-ups.
## Neither mentioned
| Gap | Why it matters | Next interview question or risk |
## Shared ground
## Top 3 tensions to decide
Parked ideas: ...
```

## Stop here: show the results and ask how to continue

In deep mode this step always ends with a stop, including when the user said "run everything". Never start the next step, and never apply a decision, until the user answers. Two exceptions, both defined in `SKILL.md`: a delegated run (show the results, log the delegated decision and continue), and quick mode (no stop here; carry this step's decisions to the next quick-mode checkpoint).

1. **Show the results in the chat**, not only the file path: the as-is diagram, the flagged rows of the workflow map, the collisions table (at most 6 rows), the "same event, two stories" items and the "neither mentioned" list. Then say where the full file is.
2. **Ask the decisions below.** Give your recommended answer for each, clearly marked as a recommendation.
3. **Ask how to continue**, offering: Continue to step 4, `problem-framing` · redo this step with changes · edit the output together · stop here.

Then wait for the user.

### Decisions for you

- "These are the top three tensions. For each, which side does v1 favor, or does v1 avoid the question?" (Give a recommended default for each, with one line why. Before offering a default, run it through the scoping rules in `mvp-scope-cutlist`: evidence, replaces a workaround, lives where users are, no missing data, fits the constraint, moves the business outcome. A default that fails a rule is marked `provisional`, and step 5 re-checks it first.)
- "Which 'neither mentioned' gap should we treat as a known risk, and which need another interview first?"
