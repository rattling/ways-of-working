// ways-band: a status band above the prompt for repos that work the ways-of-working way,
// and a /gate command that runs the gate at once, without a Claude turn.
//
// It only reads: .claude/ways.json (version, gate), .claude/ways/autonomous (the issue or
// issues an autonomous run is on), .claude/ways/last-gate (written by the ways Stop hook and by /gate),
// the Dial line in AGENTS.md, and the current git branch. In a repo without .claude/ways.json
// it draws nothing.

let view = null // what the band shows; null means "not a ways repo"
let gateRunning = false

async function readText($, path) {
  try {
    if (!(await $.fs.exists(path))) return null
    return await $.fs.read(path)
  } catch {
    return null
  }
}

function field(json, name) {
  try {
    return JSON.parse(json)[name] ?? null
  } catch {
    return null
  }
}

function ago(epochSeconds) {
  const s = Math.max(0, Math.round(Date.now() / 1000 - epochSeconds))
  if (s < 60) return s + 's ago'
  if (s < 3600) return Math.round(s / 60) + 'm ago'
  if (s < 86400) return Math.round(s / 3600) + 'h ago'
  return Math.round(s / 86400) + 'd ago'
}

async function refresh($) {
  const stamp = await readText($, '.claude/ways.json')
  if (!stamp) {
    view = null
    return
  }
  const marker = await readText($, '.claude/ways/autonomous')
  const lastGate = await readText($, '.claude/ways/last-gate')
  const agents = await readText($, 'AGENTS.md')

  let branch = null
  try {
    const r = await $.process.run(['git', 'branch', '--show-current'])
    if (r.exitCode === 0) branch = r.stdout.trim() || null
  } catch {}

  let context = null
  try {
    context = (await $.session.usage()).context.percent
  } catch {}

  const [result, at] = (lastGate || '').trim().split(/\s+/)
  view = {
    version: field(stamp, 'version'),
    gate: field(stamp, 'gate'),
    autonomous: marker !== null,
    // One number for a single run; several, space-separated, for a batch the lead is running.
    issues: marker ? marker.match(/\d+/g) || [] : [],
    gateResult: result === 'pass' || result === 'fail' ? result : null,
    gateAt: at ? Number(at) : null,
    dial: agents ? (agents.match(/\*\*Dial:\*\*\s*([a-z]+)/i) || [])[1] || null : null,
    branch,
    context,
  }
}

async function runGate($) {
  const gate = view && view.gate
  if (!gate) return 'No gate in .claude/ways.json.'
  gateRunning = true
  $.ui.invalidate('ui.render')
  let line
  try {
    const r = await $.process.run(['bash', '-c', gate], { timeoutMs: 600_000 })
    const result = r.exitCode === 0 ? 'pass' : 'fail'
    await $.fs.write('.claude/ways/last-gate', result + ' ' + Math.round(Date.now() / 1000) + '\n')
    // On a pass, the end of stdout is the useful part (test totals); on a fail, show stderr too.
    const lastLines = (text, n) => text.trim().split('\n').slice(-n).join('\n')
    const detail = result === 'pass' ? lastLines(r.stdout, 3) : lastLines(r.stdout, 8) + '\n' + lastLines(r.stderr, 8)
    line = (result === 'pass' ? '✔ gate passed' : '✘ gate failed') + ' (' + gate + ')\n' + detail.trim()
  } catch (err) {
    line = '✘ gate did not finish: ' + String(err && err.message ? err.message : err)
  } finally {
    gateRunning = false
  }
  await refresh($)
  $.ui.invalidate('ui.render')
  return line
}

export function register(on) {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'gate',
      description: "Run this repo's gate now, without a Claude turn",
    })
    await refresh($)
    // Files change outside any event (the Stop hook, git checkout), so look again now and then.
    $.clock.every(10_000, async () => {
      await refresh($)
      $.ui.invalidate('ui.render')
    })
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    await refresh($)
    $.ui.invalidate('ui.render')
    return next(e)
  })

  on('command.run', { command: 'gate' }, async ($) => {
    return { text: await runGate($) }
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (!view) return next(e)
    const { Box, Text } = $.ui.resolve(e)
    const sep = () => Text({ dimColor: true, children: ['  ·  '] })

    const mode = view.autonomous
      ? Text({ color: 'yellow', bold: true, children: ['autonomous' + (view.issues.length > 1 ? ' batch ' : view.issues.length ? ' ' : '') + view.issues.map((n) => '#' + n).join(' ')] })
      : Text({ color: 'cyan', children: ['interactive'] })

    let gate
    if (gateRunning) gate = Text({ color: 'yellow', children: ['gate running…'] })
    else if (view.gateResult === 'pass') gate = Text({ color: 'green', children: ['gate ✔ ' + ago(view.gateAt)] })
    else if (view.gateResult === 'fail') gate = Text({ color: 'red', bold: true, children: ['gate ✘ ' + ago(view.gateAt)] })
    else gate = Text({ dimColor: true, children: ['gate not run (/gate)'] })

    const parts = [Text({ bold: true, children: ['ways' + (view.version ? ' ' + view.version : '')] }), sep(), mode, sep(), gate]
    if (view.dial) parts.push(sep(), Text({ children: ['dial ' + view.dial] }))
    if (view.branch) parts.push(sep(), Text({ dimColor: true, children: [view.branch] }))
    if (typeof view.context === 'number') {
      const pct = Math.round(view.context)
      parts.push(sep(), Text({ color: pct >= 75 ? 'red' : pct >= 50 ? 'yellow' : undefined, dimColor: pct < 50, children: ['context ' + pct + '%'] }))
    }

    // Keep whatever other mods draw in the band.
    const others = await next(e)
    return Box({ flexDirection: 'column', children: [Box({ flexDirection: 'row', children: parts }), others].filter(Boolean) })
  })
}
