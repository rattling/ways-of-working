import { expect, mock, test } from 'claude-code/testing'

// Paths reach the stubs resolved against the working directory, with `\` on Windows.
// Find the stubbed file the path ends with. Don't cut at the first `.claude/` or `.ways/`:
// the checkout itself may sit under one (a worktree in `.claude/worktrees/`).
const lookup = (files: Record<string, string>, p: string) => {
  const path = p.replace(/\\/g, '/')
  const key = Object.keys(files).find(k => path === k || path.endsWith('/' + k))
  return key === undefined ? undefined : files[key]
}

const MILESTONES = [{ number: 1, title: '1: CRM live', state: 'open', html_url: 'https://github.com/o/r/milestone/1' }]
const ISSUES = [
  { number: 7, title: 'Deploy', state: 'open', assignees: [{ login: 'ana' }] },
  { number: 8, title: 'Import', state: 'open', assignees: [] },
  { number: 9, title: 'Demo data', state: 'closed', assignees: [] },
]

// A GitHub repo signed in as `ana`. `runs` collects the argv of every command the mod starts.
function stubRepo(on: any, files: Record<string, string>, { runs = [] as string[][], ghRepo = 'o/r', now = 0 } = {}) {
  on('fs.read', ($: any, e: any) => {
    const text = lookup(files, e.path)
    if (text === undefined) throw new Error('ENOENT ' + e.path)
    return { value: text }
  })
  on('process.run', ($: any, e: any) => {
    const argv: string[] = [...e.argv]
    runs.push(argv)
    const ok = (out: unknown) => ({ value: { exitCode: 0, stdout: typeof out === 'string' ? out : JSON.stringify(out), stderr: '' } })
    if (argv.join(' ').startsWith('gh api user')) return ok('ana\n')
    if (argv[1] === 'repo') return ghRepo ? ok(ghRepo + '\n') : { value: { exitCode: 1, stdout: '', stderr: 'not a git repository' } }
    if (argv[1] === 'pr') return ok([])
    if (argv[2]?.includes('/milestones')) return ok(MILESTONES)
    if (argv[2]?.includes('/issues?milestone=')) return ok(ISSUES)
    return ok([])
  })
  on('command.register', () => ({ value: undefined }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('ui.panes', () => ({ value: [] }))
  on('ui.toast', () => ({ value: undefined }))
  mock.clock(on, { now })
  on('session.start', ($: any, e: any) => ({ cwd: e.cwd }))
}

const PANE = {
  plugin: 'ways-compass',
  component: 'Pane',
  requestId: 'compass',
  surface: 'desktop',
  props: { title: 'Compass', isFocused: false, bodyColumns: 60, placement: 'dock', scroll: { offset: 0, bodyRows: 40 }, view: {} },
} as const

const GOAL = '{"goal":"Fix #8 import","steps":["Understand it","Build","PR"],"at":1}'
const RECORD = `# Ana (ana)

## Topics

| Topic | Level |
|---|---|
| Flow | 1 |
| Checks | 0 |

## Challenges

| # | Challenge | Done | Understood | Again |
|---|---|---|---|---|
| 1 | Run it | 2026-11-10 | 2026-11-10 | 2026-11-11 |
| 2 | Read an issue | | | |

## Tours

| Tour | Done |
|---|---|
| 0 | 2026-11-09 |
| 1 | |

## Badges

- **Up and running**: ran mick
`

// The refreshes run in the background: let them settle before drawing.
const settle = async () => {
  for (let i = 0; i < 20; i++) await Promise.resolve()
}

test('the pane shows the goal, the milestone and the learning record the config points to', async ($, on) => {
  stubRepo(on, {
    '.ways/goal': GOAL,
    '.claude/compass.json': JSON.stringify({
      repo: 'o/r',
      learning: 'learning/people/{login}.md',
      commands: [{ label: '/learn', text: '/learn', what: 'what next' }],
      docs: [],
    }),
    'learning/people/ana.md': RECORD,
  })
  await $.session.start({ cwd: '/repo', surface: 'desktop', isInteractive: true })
  await settle()
  const ui = await $.ui.mount(PANE as any)
  expect(await ui.find({ type: 'Text', text: 'Fix #8 import' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /1 of 3 steps done/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /1 of 3 issues done/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: 'Your learning' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /Challenges of 2: done 1 · understood 1 · again 1/ })).toBeDefined()
  // An older record, without the review columns: no mastered bar or reviews line.
  expect(await ui.find({ type: 'Text', text: /Mastered/ })).toBeUndefined()
  expect(await ui.find({ type: 'Text', text: /Reviews due/ })).toBeUndefined()
  expect(await ui.find({ type: 'Button', text: /Quiz me/ })).toBeUndefined()
  expect(await ui.find({ type: 'Text', text: 'Your go-to' })).toBeDefined()
  await ui.unmount()
})

const NL = String.fromCharCode(10)

// A record with the review columns, read on 2026-11-15: challenge 1's review is due,
// 2's is not yet, 3 is mastered, 4 is done but not understood, 5 not started.
const REVIEW_RECORD = `# Ana (ana)

## Challenges

| # | Challenge | Do | Understood | Again | Next review | Rung | Mastered |
|---|---|---|---|---|---|---|---|
| 1 | Run it | 2026-11-01 | 2026-11-01 | 2026-11-02 | 2026-11-14 | 2 | |
| 2 | Read an issue | 2026-11-10 | 2026-11-10 | 2026-11-12 | 2026-11-20 | 1 | |
| 3 | Change a label | 2026-09-01 | 2026-09-01 | 2026-09-02 | | 4 | 2026-11-01 |
| 4 | Write a test | 2026-11-14 | | | | | |
| 5 | Ship it | | | | | | |
`

test('a record with reviews shows partial progress, mastered, reviews due and a quiz button', async ($, on) => {
  const fills: string[] = []
  stubRepo(
    on,
    {
      '.claude/compass.json': JSON.stringify({ repo: 'o/r', learning: '.ways/learning/{login}.md', commands: [], docs: [] }),
      '.ways/learning/ana.md': REVIEW_RECORD,
    },
    { now: new Date(2026, 10, 15, 12).getTime() },
  )
  on('prompt.fill', ($: any, e: any) => {
    fills.push(e.text)
    return { isFilled: true }
  })
  await $.session.start({ cwd: '/repo', surface: 'desktop', isInteractive: true })
  await settle()
  const ui = await $.ui.mount(PANE as any)
  expect(await ui.find({ type: 'Text', text: /Challenges of 5: done 4 · understood 3 · again 3/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: 'Mastered 1 of 5' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: 'Reviews due: 1' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: 'Next: Write a test' })).toBeDefined()
  expect(await ui.find({ type: 'Button', text: 'Quiz me (2 waiting)' })).toBeDefined()
  await ui.press({ key: 'quiz' })
  expect(fills).toEqual(["Quiz me on what's due"])
  await ui.unmount()
})

test('with nothing due and nothing waiting to be understood, there is no quiz button', async ($, on) => {
  stubRepo(
    on,
    {
      '.claude/compass.json': JSON.stringify({ repo: 'o/r', learning: '.ways/learning/{login}.md', commands: [], docs: [] }),
      '.ways/learning/ana.md': REVIEW_RECORD.split(NL).filter(l => !/^\| [14] /.test(l)).join(NL),
    },
    { now: new Date(2026, 10, 15, 12).getTime() },
  )
  await $.session.start({ cwd: '/repo', surface: 'desktop', isInteractive: true })
  await settle()
  const ui = await $.ui.mount(PANE as any)
  expect(await ui.find({ type: 'Text', text: 'Reviews due: 0' })).toBeDefined()
  expect(await ui.find({ type: 'Button', text: /Quiz me/ })).toBeUndefined()
  await ui.unmount()
})

test('without a compass.json, the repo comes from gh and there is no learning or go-to', async ($, on) => {
  const runs: string[][] = []
  stubRepo(on, { '.ways/goal': GOAL, 'learning/people/ana.md': RECORD }, { runs })
  await $.session.start({ cwd: '/repo', surface: 'desktop', isInteractive: true })
  await settle()
  const ui = await $.ui.mount(PANE as any)
  expect(runs.some(argv => argv[1] === 'repo' && argv[2] === 'view')).toBe(true)
  expect(await ui.find({ type: 'Text', text: /1 of 3 issues done/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: 'Your learning' })).toBeUndefined()
  expect(await ui.find({ type: 'Text', text: 'Your go-to' })).toBeUndefined()
  await ui.unmount()
})

test('outside a GitHub repo, the project says so', async ($, on) => {
  stubRepo(on, { '.ways/goal': GOAL }, { ghRepo: '' })
  await $.session.start({ cwd: '/repo', surface: 'desktop', isInteractive: true })
  await settle()
  const ui = await $.ui.mount(PANE as any)
  expect(await ui.find({ type: 'Text', text: /Not a GitHub repo/ })).toBeDefined()
  await ui.unmount()
})
