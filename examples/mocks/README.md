# Example mocks

Three clickable mocks made the `/ways:mock` way, to show what a good one looks like. Everything in them is made up: the organisations, the people and the numbers.

Open any of them by double-clicking: each is one HTML file, with no install and no network. Each has a **demo guide** that walks through it step by step, **Show architecture** to label which parts are standard and which are custom, and **Reset demo** to start again.

| File | The use case | What it shows off |
|---|---|---|
| [`field-job-record.html`](field-job-record.html) | An engineer records a finished job on their phone, with no signal, and the office invoices it | A phone flow beside an office view, working offline, a signature pad. Built from the [Brightwater sample pack](../discovery/) |
| [`approval-workflow.html`](approval-workflow.html) | A small grants trust reviews, scores and approves applications | A standard business app with one custom screen: the architecture toggle doing its job |
| [`printed-timetable.html`](printed-timetable.html) | A leisure centre edits its weekly pool timetable and prints it as a poster | Print CSS: one A3 landscape page, a key that works in mono. Check it with Chrome, Ctrl+P |

## What makes them work

- **They came after the decisions.** Each screen shows something already decided, and the guide has a step per decision. That's why a mock is the easiest way to explain the decisions, and why one built first is only a nice-looking guess.
- **They look finished.** People judge the decisions by what they see. A wireframe makes good decisions look unfinished and leaves people flat, even when it's only meant to show a flow.
- **They're full of realistic data,** awkward rows included: the longest name, the missing value, the clash, plus the empty and error states.
- **They skip the engineering, not the look.** No framework, no backend, no tests. They're never the build: the build matches them.

To start a new one, copy [`plugins/ways/skills/mock/guided-tour.html`](../../plugins/ways/skills/mock/guided-tour.html), the skeleton these are built on.
