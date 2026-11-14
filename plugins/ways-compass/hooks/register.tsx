import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, RenderChildren } from 'claude-code'

import type { Config, Goal, Learning, Milestone, MilestoneIssue } from '../types'

const PANE = 'compass'
const TITLE = 'Compass'

const goal = atom({ plugin: 'ways-compass', key: 'goal' } as const, null, { shape: 'goal-1' })
const milestone = atom({ plugin: 'ways-compass', key: 'milestone' } as const, null, { shape: 'milestone-1' })
const config = atom({ plugin: 'ways-compass', key: 'config' } as const, null, { shape: 'config-1' })
const learning = atom({ plugin: 'ways-compass', key: 'learning' } as const, null, { shape: 'learning-1' })
/** Whether the pane is up; when it isn't, a row above the prompt offers it back. */
const isOpen = atom({ plugin: 'ways-compass', key: 'open' } as const, false, { shape: 'open-1' })
/** Minimised: the pane stays put but shows only the two bars and Expand. */
const isCompact = atom({ plugin: 'ways-compass', key: 'compact' } as const, false, { shape: 'compact-1' })
/** The project's issue lists, folded away by default to leave room below. */
const showIssues = atom({ plugin: 'ways-compass', key: 'showIssues' } as const, false, { shape: 'show-issues-1' })

type Dollar = EngineInterface

async function readJson<T>($: Dollar, path: string): Promise<T | null> {
  try {
    return JSON.parse(await $.fs.read(path)) as T
  } catch {
    return null
  }
}

async function gh($: Dollar, args: string[]): Promise<unknown> {
  const { exitCode, stdout, stderr } = await $.process.run(['gh', ...args], { timeoutMs: 30000 })
  if (exitCode !== 0) throw new Error(stderr.trim().split('\n')[0] || 'gh failed')
  return JSON.parse(stdout)
}

const short = (title: string) => (title.length > 48 ? title.slice(0, 46) + '…' : title)

async function loadMilestone($: Dollar, repo: string): Promise<Milestone | null> {
  const now = await $.clock.now()
  try {
    const all = (await gh($, ['api', `repos/${repo}/milestones?state=all&per_page=100`])) as Array<{
      number: number; title: string; state: string; html_url: string
    }>
    const ordered = [...all].sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }))
    const current = ordered.find(m => m.state === 'open')
    if (!current) return null
    const next = ordered.find(m => m.state === 'open' && m.number !== current.number)
    const issues = (await gh($, ['api', `repos/${repo}/issues?milestone=${current.number}&state=all&per_page=100`])) as Array<{
      number: number; title: string; state: string; assignees: { login: string }[]
      pull_request?: unknown; issue_dependencies_summary?: { blocked_by?: number }
    }>
    const prs = (await gh($, ['pr', 'list', '--repo', repo, '--state', 'open', '--json', 'number,author,closingIssuesReferences'])) as Array<{
      number: number; author: { login: string }; closingIssuesReferences: { number: number }[]
    }>
    const prFor = new Map<number, { number: number; author: string }>()
    for (const pr of prs) for (const ref of pr.closingIssuesReferences) prFor.set(ref.number, { number: pr.number, author: pr.author.login })

    const real = issues.filter(i => !i.pull_request)
    const open = real.filter(i => i.state === 'open')
    const inProgress: MilestoneIssue[] = []
    const waiting: MilestoneIssue[] = []
    const free: MilestoneIssue[] = []
    for (const i of open) {
      const pr = prFor.get(i.number)
      const who = i.assignees.map(a => a.login)
      const blocked = i.issue_dependencies_summary?.blocked_by ?? 0
      const item = { number: i.number, title: short(i.title) }
      if (pr || who.length) inProgress.push({ ...item, note: pr ? `PR #${pr.number}, ${pr.author}` : who.join(', ') })
      else if (blocked > 0) {
        const on = (await gh($, ['api', `repos/${repo}/issues/${i.number}/dependencies/blocked_by`])) as Array<{ number: number; state: string }>
        waiting.push({ ...item, note: 'waits on ' + on.filter(b => b.state === 'open').map(b => '#' + b.number).join(', ') })
      } else free.push(item)
    }
    return {
      title: current.title,
      url: current.html_url,
      done: real.length - open.length,
      total: real.length,
      inProgress, waiting, free,
      next: next?.title,
      checkedAt: now,
    }
  } catch (err) {
    return { title: 'Milestone', url: `https://github.com/${repo}/milestones`, done: 0, total: 0, inProgress: [], waiting: [], free: [], checkedAt: now, error: String((err as Error).message ?? err) }
  }
}

const NL = String.fromCharCode(10)

/** The rows of the markdown table under `## <heading>`, as cells. */
function tableUnder(md: string, heading: string): string[][] {
  const start = md.indexOf('## ' + heading)
  if (start < 0) return []
  const rest = md.slice(start).split(NL).slice(1)
  const rows: string[][] = []
  for (const line of rest) {
    if (line.startsWith('## ')) break
    if (!line.startsWith('|') || /^\|\s*-/.test(line)) continue
    rows.push(line.split('|').slice(1, -1).map(c => c.trim()))
  }
  return rows.slice(1)
}

function parseLearning(md: string): Learning {
  const name = (md.match(/^# (.+?)(?: \(|$)/m)?.[1] ?? '').trim()
  const topics = tableUnder(md, 'Topics')
  const challenges = tableUnder(md, 'Challenges')
  const tours = tableUnder(md, 'Tours')
  const bStart = md.indexOf('## Badges')
  const bBlock = bStart < 0 ? '' : md.slice(bStart).split(NL).slice(1).join(NL).split(NL + '## ')[0] ?? ''
  const badges = bBlock.split(NL).filter(l => /^\s*[-*] /.test(l)).map(l => (l.replace(/^\s*[-*] /, '').replace(/\*\*/g, '').split(/[:(]/)[0] ?? '').trim()).filter(Boolean)
  const complete = (row: string[]) => row.slice(2, 5).length === 3 && row.slice(2, 5).every(c => c !== '')
  const next = challenges.find(r => !complete(r))
  return {
    name,
    topicsAtOne: topics.filter(r => Number(r[1]) >= 1).length,
    topics: topics.length,
    challengesDone: challenges.filter(complete).length,
    challenges: challenges.length,
    toursDone: tours.filter(r => (r[1] ?? '') !== '').length,
    tours: tours.length,
    badges,
    nextChallenge: next ? next[1] : undefined,
  }
}

async function refreshGoal($: Dollar) {
  const g = await readJson<Goal>($, '.ways/goal')
  const valid = g && Array.isArray(g.steps) && typeof g.at === 'number' ? g : null
  const before = await read($, goal)
  if (JSON.stringify(before) !== JSON.stringify(valid)) await update($, goal, () => valid)
}

let login: string | null | undefined
async function refreshLearning($: Dollar) {
  if (login === undefined) {
    try {
      const { exitCode, stdout } = await $.process.run(['gh', 'api', 'user', '--jq', '.login'], { timeoutMs: 15000 })
      login = exitCode === 0 ? stdout.trim() : null
    } catch {
      login = null
    }
  }
  let l: Learning | null = null
  if (login) {
    const path = (await read($, config))?.learning
    if (path) try {
      l = parseLearning(await $.fs.read(path.split('{login}').join(login)))
    } catch {
      l = null
    }
  }
  const before = await read($, learning)
  if (JSON.stringify(before) !== JSON.stringify(l)) await update($, learning, () => l)
}

/** The repo on GitHub, when `.claude/compass.json` doesn't name it; null when this isn't a GitHub repo. */
let ghRepo: string | null | undefined
async function repoFromGh($: Dollar): Promise<string | null> {
  if (ghRepo === undefined) {
    try {
      const { exitCode, stdout } = await $.process.run(['gh', 'repo', 'view', '--json', 'nameWithOwner', '--jq', '.nameWithOwner'], { timeoutMs: 15000 })
      ghRepo = exitCode === 0 && stdout.trim() ? stdout.trim() : null
    } catch {
      ghRepo = null
    }
  }
  return ghRepo
}

async function refreshAll($: Dollar) {
  const file = await readJson<Config>($, '.claude/compass.json')
  const repo = file?.repo ?? (await repoFromGh($)) ?? undefined
  const c: Config | null = file || repo ? { commands: [], docs: [], ...file, repo } : null
  await update($, config, () => c)
  await refreshGoal($)
  await refreshLearning($)
  if (c?.repo) {
    const m = await loadMilestone($, c.repo)
    await update($, milestone, () => m)
  }
}


/** Where the surface last drew the pane: `widget` is the desktop app's own minimised form, if it uses one. */
let seat: 'dock' | 'inline' | 'widget' | undefined

/**
 * The full pane, brought back however it went. The desktop app's close mark
 * can hide the pane without the engine hearing of it, so an open of an id it
 * thinks is still up would do nothing: close it first, then open it fresh.
 */
async function show($: Dollar) {
  if ((await $.ui.panes()).some(p => p.id === PANE)) await $.ui.close({ id: PANE })
  const { isPlaced } = await $.ui.open({ id: PANE, title: TITLE })
  await update($, isOpen, () => true)
  await update($, isCompact, () => false)
  void refreshAll($)
  return isPlaced
}

/** Shrinks the pane in place to its bars; nothing closes, so nothing has to come back. */
async function minimise($: Dollar) {
  await update($, isCompact, () => true)
}

// Started once per load: at session start, or, after a hot reload that ran
// no session start, at the first prompt.
let started = false
async function start($: Dollar) {
  if (started) return
  started = true
  await $.command.register({ name: 'compass', description: 'Open the Compass pane: this piece of work, the milestone, your go-to list' })
  const isPlaced = await show($)
  $.ui.toast(isPlaced ? 'Compass is open beside the chat.' : 'Compass started. Type /compass to open it.')
  $.clock.every(5000, () => refreshGoal($))
  $.clock.every(60 * 1000, () => refreshLearning($))
  $.clock.every(5 * 60 * 1000, async () => {
    const c = await read($, config)
    if (c?.repo) {
      const m = await loadMilestone($, c.repo)
      await update($, milestone, () => m)
    }
  })
}

const steps = (g: Goal) => Math.min(g.at, g.steps.length)

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const ran = await next(e)
    await start($)
    return ran
  })

  on('prompt.submit', async ($, e, next) => {
    await start($)
    if (e.text.trim() === '/compass') {
      await show($)
      return { drop: 'Compass opened.' }
    }
    return next(e)
  })

  on('command.run', { command: 'compass' }, async $ => {
    await show($)
    return { text: 'Compass opened.' }
  })

  // Closed outright (its close mark, a key), the row above the prompt takes over.
  on('ui.close', async ($, e, next) => {
    const result = await next(e)
    if (e.id === PANE) await update($, isOpen, () => false)
    return result
  })

  // While the pane is hidden: one line with where things stand, and Show.
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || (await read($, isOpen))) return next(e)
    const { Box, Text, Button } = $.ui.resolve(e)
    const g = await read($, goal)
    const m = await read($, milestone)
    const parts: string[] = []
    if (g) parts.push(g.at < g.steps.length ? `Now: ${g.steps[g.at]} (${steps(g)} of ${g.steps.length})` : `Done: ${g.goal}`)
    if (m && !m.error) parts.push(`${m.title}: ${m.done} of ${m.total}`)
    return (
      <Box>
        <Text dimColor>Compass{parts.length ? ' · ' + parts.join(' · ') : ''} </Text>
        <Button key="show" label="Show" onPress={() => void show($)} />
      </Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Button, Link } = $.ui.resolve(e)
    seat = e.props.placement
    const g = await read($, goal)
    const m = await read($, milestone)
    const c = await read($, config)
    const l = await read($, learning)

    // A bar drawn by hand: the whole track in grey, the part done in blue (green when all done).
    const meter = (key: string, done: number, total: number, text: string) => (
      <Box key={key} flexDirection="column" marginTop={1}>
        <Box flexDirection="row" height={1} backgroundColor="subtle">
          {done > 0 ? <Box key="done" flexGrow={done} height={1} backgroundColor={done >= total ? 'success' : 'suggestion'} /> : null}
          {total - done > 0 ? <Box key="left" flexGrow={total - done} height={1} /> : null}
        </Box>
        <Text dimColor>{text}</Text>
      </Box>
    )

    // Minimised: a glance at the two bars. A widget gets no button, as clicks may not reach it.
    if (seat === 'widget' || (await read($, isCompact))) {
      return (
        <Box flexDirection="column" paddingX={1}>
          <Box flexDirection="row" justifyContent="space-between">
            <Text bold>Compass</Text>
            {seat === 'widget' ? null : <Button key="expand" onPress={() => void show($)}>Expand</Button>}
          </Box>
          {g
            ? meter('w-work', steps(g), g.steps.length, g.at < g.steps.length ? `Now: ${g.steps[g.at]} (${steps(g)} of ${g.steps.length})` : 'All steps done')
            : <Text dimColor>No goal set</Text>}
          {m && !m.error ? meter('w-project', m.done, m.total, `${m.title}: ${m.done} of ${m.total} done`) : null}
        </Box>
      )
    }

    const fill = (text: string) => () => void $.prompt.fill({ text, mode: 'replace' })
    const section = (key: string, title: string, body: RenderChildren) => (
      <Box key={key} flexDirection="column" borderStyle="round" borderDimColor paddingX={1}>
        <Text bold>{title}</Text>
        {body}
      </Box>
    )

    // Two columns when the pane is wide enough, read down the first then the second.
    const twoCols = (key: string, items: RenderChildren[], minColumns: number) => {
      if (items.length < 3 || e.props.bodyColumns < minColumns) {
        return <Box key={key} flexDirection="column">{items}</Box>
      }
      const half = Math.ceil(items.length / 2)
      return (
        <Box key={key} flexDirection="row" gap={2}>
          <Box key="left" flexDirection="column" width="50%">{items.slice(0, half)}</Box>
          <Box key="right" flexDirection="column" width="50%">{items.slice(half)}</Box>
        </Box>
      )
    }

    const work = !g ? (
      <Box flexDirection="column">
        <Text dimColor>No goal set.</Text>
        <Button key="set-goal" onPress={fill('Set a goal for what we are doing, with its steps')}>Set a goal</Button>
      </Box>
    ) : (
      <Box flexDirection="column">
        <Text>{g.goal}</Text>
        {meter('work-bar', steps(g), g.steps.length, `${steps(g)} of ${g.steps.length} steps done`)}
        {twoCols(
          'steps',
          g.steps.map((step, i) => (
            <Text key={'step-' + i} dimColor={i !== g.at} bold={i === g.at}>
              {i < g.at ? '✓' : i === g.at ? '▶' : '○'} {step}
            </Text>
          )),
          50,
        )}
      </Box>
    )

    const list = (label: string, items: MilestoneIssue[]) =>
      items.length === 0 ? null : (
        <Box key={'list-' + label} flexDirection="column" marginTop={1}>
          <Text dimColor>{label}</Text>
          {twoCols(
            'issues',
            items.map(i => (
              <Text key={'issue-' + i.number}>
                #{i.number} {i.title}
                {i.note ? <Text dimColor> ({i.note})</Text> : null}
              </Text>
            )),
            80,
          )}
        </Box>
      )

    const issuesShown = await read($, showIssues)
    const project = !c?.repo ? (
      <Text dimColor>Not a GitHub repo, so no milestone to show.</Text>
    ) : !m ? (
      <Text dimColor>Checking GitHub…</Text>
    ) : m.error ? (
      <Text dimColor>Couldn't reach GitHub: {m.error}</Text>
    ) : (
      <Box flexDirection="column">
        <Link href={m.url}>{m.title}</Link>
        {meter('project-bar', m.done, m.total, `${m.done} of ${m.total} issues done`)}
        <Text dimColor>
          {m.inProgress.length} in progress · {m.waiting.length} waiting · {m.free.length} free to take
        </Text>
        {issuesShown ? (
          <Box key="issues" flexDirection="column">
            {list('In progress', m.inProgress)}
            {list('Waiting', m.waiting)}
            {list('Free to take', m.free)}
            {m.next ? <Text dimColor>Then: {m.next}</Text> : null}
          </Box>
        ) : null}
        <Button key="issues-toggle" onPress={() => void update($, showIssues, v => !v)}>
          {issuesShown ? '▾ Hide issues' : `▸ Show issues (${m.total - m.done} open)`}
        </Button>
      </Box>
    )

    return (
      <Box flexDirection="column" gap={1}>
        <Box flexDirection="row" justifyContent="flex-end" gap={1}>
          <Button key="refresh" onPress={() => void refreshAll($)}>Refresh</Button>
          <Button key="minimise" onPress={() => void minimise($)}>Minimise</Button>
        </Box>
        {section('work', 'This piece of work', work)}
        {section('project', 'The project', project)}
        {l
          ? section(
              'learning',
              'Your learning',
              <Box flexDirection="column">
                {meter('tours', l.toursDone, l.tours, `Tours ${l.toursDone} of ${l.tours}`)}
                {meter('topics', l.topicsAtOne, l.topics, `Level 1 in ${l.topicsAtOne} of ${l.topics} topics`)}
                {meter('challenges', l.challengesDone, l.challenges, `Challenges ${l.challengesDone} of ${l.challenges}`)}
                <Text dimColor={l.badges.length === 0}>{l.badges.length ? '★ ' + l.badges.join(' · ') : 'No badges yet'}</Text>
                {l.nextChallenge ? <Text dimColor>Next: {l.nextChallenge}</Text> : null}
                <Button key="learn" onPress={fill('/learn')}>/learn</Button>
              </Box>,
            )
          : null}
        {c && (c.commands.length || c.docs.length)
          ? section(
              'goto',
              'Your go-to',
              <Box flexDirection="column">
                {c.commands.map(cmd => (
                  <Button key={'cmd-' + cmd.label} onPress={fill(cmd.text)}>
                    {cmd.label} <Text dimColor>{cmd.what}</Text>
                  </Button>
                ))}
                {c.docs.map(doc => (
                  <Link key={'doc-' + doc.href} href={doc.href}>{doc.label}</Link>
                ))}
              </Box>,
            )
          : null}
      </Box>
    )
  })
}
