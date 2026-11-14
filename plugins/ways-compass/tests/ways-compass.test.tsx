import { expect, mock, test } from 'claude-code/testing'

// Paths reach the stubs resolved against the working directory, with `\` on Windows;
// compare them repo-relative, with `/`.
const rel = (p: string) => p.replace(/\\/g, '/').replace(/^.*?(?=(\.claude\/|\.ways\/|learning\/))/, '')

const MILESTONES = [{ number: 1, title: '1: CRM live', state: 'open', html_url: 'https://github.com/o/r/milestone/1' }]
const ISSUES = [
  { number: 7, title: 'Deploy', state: 'open', assignees: [{ login: 'ana' }] },
  { number: 8, title: 'Import', state: 'open', assignees: [] },
  { number: 9, title: 'Demo data', state: 'closed', assignees: [] },
]

// A GitHub repo signed in as `ana`. `runs` collects the argv of every command the mod starts.
function stubRepo(on: any, files: Record<string, string>, { runs = [] as string[][], ghRepo = 'o/r' } = {}) {
  on('fs.read', ($: any, e: any) => {
    const text = files[rel(e.path)]
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
  mock.clock(on)
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
  expect(await ui.find({ type: 'Text', text: /Challenges 1 of 2/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: 'Your go-to' })).toBeDefined()
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
