import { expect, mock, test } from 'claude-code/testing'

// Paths reach the stubs resolved against the working directory; compare them repo-relative.
const rel = (p: string) => p.replace(/^.*?(?=(\.claude\/|AGENTS\.md$))/, '')

// A repo mid-way through an autonomous run on #3, whose last gate passed.
function stubRepo(on: any, files: Record<string, string>, written: Record<string, string> = {}) {
  on('fs.exists', ($: any, e: any) => ({ value: rel(e.path) in files }))
  on('fs.read', ($: any, e: any) => ({ value: files[rel(e.path)] }))
  on('fs.write', ($: any, e: any) => {
    written[rel(e.path)] = e.text
    return { value: undefined }
  })
  on('ui.render', ($: any, e: any) => $.ui.resolve(e).Box({ children: [] }))
  on('process.run', ($: any, e: any) =>
    e.argv?.[0] === 'git' || e.args?.[0] === 'git' || JSON.stringify(e).includes('"git"')
      ? { value: { exitCode: 0, stdout: 'feature/3-walking-skeleton\n', stderr: '' } }
      : { value: { exitCode: 0, stdout: 'OK (2 tests, 3 assertions)\n', stderr: '' } },
  )
  on('session.usage', () => ({ value: { startedAt: 0, context: { tokens: 1, window: 2, percent: 41.6 }, rateLimits: [], cost: 0 } }))
  on('command.register', () => ({ value: undefined }))
  mock.clock(on)
  on('session.start', ($: any, e: any) => ({ cwd: e.cwd }))
}

const BAND = {
  plugin: 'ways-band',
  component: 'AbovePrompt',
  surface: 'terminal',
  viewport: { columns: 120, rows: 30 },
  props: {},
} as const

const REPO = {
  '.claude/ways.json': '{"version":"0.3.0","gate":"make check"}',
  '.claude/ways/autonomous': '3\n',
  '.claude/ways/last-gate': `pass ${Math.round(Date.now() / 1000) - 120}\n`,
  'AGENTS.md': '## Merging\n\n**Dial:** default <!-- … -->\n',
}

test('the band shows mode, issue, gate, dial, branch and context', async ($, on) => {
  stubRepo(on, REPO)
  await $.session.start({ cwd: '/repo' })
  const ui = await $.ui.mount(BAND as any)
  expect(await ui.find({ type: 'Text', text: 'ways 0.3.0' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: 'autonomous #3' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /^gate ✔ 2m ago$/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: 'dial default' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: 'feature/3-walking-skeleton' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: 'context 42%' })).toBeDefined()
  await ui.unmount()
})

test('a batch shows every issue the lead is running, in merge order', async ($, on) => {
  stubRepo(on, { ...REPO, '.claude/ways/autonomous': '12 14 17\n' })
  await $.session.start({ cwd: '/repo' })
  const ui = await $.ui.mount(BAND as any)
  expect(await ui.find({ type: 'Text', text: 'autonomous batch #12 #14 #17' })).toBeDefined()
  await ui.unmount()
})

test('the band draws nothing in a repo that has not opted in', async ($, on) => {
  stubRepo(on, {})
  await $.session.start({ cwd: '/repo' })
  const ui = await $.ui.mount(BAND as any)
  expect(await ui.find({ type: 'Text', text: /^ways/ })).toBeUndefined()
  await ui.unmount()
})

test('/gate runs the gate and records the result', async ($, on) => {
  const written: Record<string, string> = {}
  stubRepo(on, { '.claude/ways.json': '{"version":"0.3.0","gate":"make check"}' }, written)
  await $.session.start({ cwd: '/repo' })
  const answer = await $.command.run({ command: 'gate', args: '' })
  expect(answer.text).toContain('✔ gate passed (make check)')
  expect(written['.claude/ways/last-gate']).toMatch(/^pass \d+\n$/)
})
