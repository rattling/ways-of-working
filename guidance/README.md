# Guidance

Templates for the documents a repo might want: a charter, an architecture note, ADRs, a lore
file, an operating context, a seed spec.

None of them are required. Each says when it's worth having, and that condition matters more
than the template.

| | Worth having |
|---|---|
| [charter](charter.md) | when scope keeps drifting, or you're briefing work to run unattended |
| [architecture](architecture.md) | when someone new would put things in the wrong place |
| [adr](adr.md) | when a decision is expensive to reverse |
| [lore](lore.md) | when something surprised you that the code doesn't explain |
| [operating-context](operating-context.md) | when someone other than you is triaging the backlog |
| [seed-spec](seed-spec.md) | starting a new project, before any code exists |

A list of recommended documents gets ignored. A recommendation with a trigger gets used at the
point it's needed.

Adopt at most two at a time. A repo that takes on six in week one has dropped all six by week
three.
