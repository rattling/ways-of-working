// ways-band: a status band above the prompt for repos that work the ways-of-working way,
// and a /gate command that runs the gate at once, without a Claude turn.
//
// It reads: .claude/ways.json (version, gate), .claude/ways/autonomous (the issue or
// issues an autonomous run is on), .claude/ways/progress (a spec run's tickets done, of total),
// .claude/ways/part (the big work under way and its command, written by the flow commands),
// .claude/ways/last-gate (written by the ways Stop hook and by /gate),
// the Dial line in AGENTS.md, and the current git branch. In a repo without .claude/ways.json
// it draws nothing.
//
// It writes .claude/ways/usage: the plan's usage windows (five-hour, weekly) as JSON, whenever
// they move. The agent can't read them itself, and an autonomous run reports them in its
// integration PR at the start and after each ticket.

let view = null // what the band shows; null means "not a ways repo"
let gateRunning = false
let lastUsage = null // the windows last written, so the file only changes when they move

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
  // `<done> <total>`, written by the lead of a spec run after each ticket merges.
  const [done, total] = ((await readText($, '.claude/ways/progress')) || '').match(/\d+/g) || []
  const agents = await readText($, 'AGENTS.md')
  // `<feature> · <command>`, written by /ways:discover, plan, requirements, design and build.
  const part = ((await readText($, '.claude/ways/part')) || '').split('\n')[0].trim() || null

  let branch = null
  try {
    const r = await $.process.run(['git', 'branch', '--show-current'])
    if (r.exitCode === 0) branch = r.stdout.trim() || null
  } catch {}

  let context = null
  const windows = {}
  try {
    const usage = await $.session.usage()
    context = usage.context.percent
    for (const w of usage.rateLimits || []) windows[w.kind] = { percentUsed: w.percentUsed, resetsAt: w.resetsAt }
  } catch {}
  // Empty off a subscription, or before the first response: then there's nothing to write.
  const usage = JSON.stringify(windows)
  if (usage !== '{}' && usage !== lastUsage) {
    try {
      await $.fs.write('.claude/ways/usage', JSON.stringify({ ...windows, at: new Date().toISOString() }, null, 2) + '\n')
      lastUsage = usage
    } catch {}
  }

  const [result, at] = (lastGate || '').trim().split(/\s+/)
  view = {
    version: field(stamp, 'version'),
    gate: field(stamp, 'gate'),
    autonomous: marker !== null,
    // One number for a single run; several, space-separated, for a batch the lead is running.
    issues: marker ? marker.match(/\d+/g) || [] : [],
    progress: marker && total ? done + ' of ' + total : null,
    part,
    gateResult: result === 'pass' || result === 'fail' ? result : null,
    gateAt: at ? Number(at) : null,
    dial: agents ? (agents.match(/\*\*Dial:\*\*\s*([a-z]+)/i) || [])[1] || null : null,
    branch,
    context,
    windows,
  }
}

// The bash to run the gate in. On Windows, `bash` on PATH is usually WSL's
// (C:\Windows\System32\bash.exe), which fails with no distro installed, so use Git Bash,
// as Claude Code's hooks and Bash tool do: CLAUDE_CODE_GIT_BASH_PATH if set, else the
// bash.exe of the Git for Windows that `git` comes from.
async function findBash($) {
  if ((await $.env.get('OS')) !== 'Windows_NT') return 'bash'
  const configured = await $.env.get('CLAUDE_CODE_GIT_BASH_PATH')
  if (configured) return configured
  try {
    const r = await $.process.run(['git', '--exec-path'])
    // C:/Program Files/Git/mingw64/libexec/git-core -> C:/Program Files/Git/bin/bash.exe
    const root = r.exitCode === 0 && r.stdout.trim().replace(/\\/g, '/').match(/^(.*?)\/(?:mingw64|mingw32|clangarm64|usr)\/libexec\/git-core\/?$/i)
    if (root) return root[1] + '/bin/bash.exe'
  } catch {}
  return 'bash'
}

async function runGate($) {
  const gate = view && view.gate
  if (!gate) return 'No gate in .claude/ways.json.'
  gateRunning = true
  $.ui.invalidate('ui.render')
  let line
  try {
    const r = await $.process.run([await findBash($), '-c', gate], { timeoutMs: 600_000 })
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
      ? Text({ color: 'yellow', bold: true, children: ['autonomous' + (view.issues.length > 1 ? ' batch ' : view.issues.length ? ' ' : '') + view.issues.map((n) => '#' + n).join(' ') + (view.progress ? ' · ' + view.progress : '')] })
      : Text({ color: 'cyan', children: ['interactive'] })

    let gate
    if (gateRunning) gate = Text({ color: 'yellow', children: ['gate running…'] })
    else if (view.gateResult === 'pass') gate = Text({ color: 'green', children: ['gate ✔ ' + ago(view.gateAt)] })
    else if (view.gateResult === 'fail') gate = Text({ color: 'red', bold: true, children: ['gate ✘ ' + ago(view.gateAt)] })
    else gate = Text({ dimColor: true, children: ['gate not run (/gate)'] })

    const parts = [Text({ bold: true, children: ['ways' + (view.version ? ' ' + view.version : '')] }), sep(), mode, sep(), gate]
    if (view.part) parts.splice(1, 0, sep(), Text({ color: 'magenta', children: [view.part] }))
    if (view.dial) parts.push(sep(), Text({ children: ['dial ' + view.dial] }))
    if (view.branch) parts.push(sep(), Text({ dimColor: true, children: [view.branch] }))
    if (typeof view.context === 'number') {
      const pct = Math.round(view.context)
      parts.push(sep(), Text({ color: pct >= 75 ? 'red' : pct >= 50 ? 'yellow' : undefined, dimColor: pct < 50, children: ['context ' + pct + '%'] }))
    }
    // The plan's windows: amber from 75%, red from 90%, when a run may hit the limit.
    const five = view.windows.five_hour
    const week = view.windows.seven_day
    if (five || week) {
      const shown = [five && '5h ' + Math.round(five.percentUsed) + '%', week && 'wk ' + Math.round(week.percentUsed) + '%'].filter(Boolean)
      const top = Math.max(five ? five.percentUsed : 0, week ? week.percentUsed : 0)
      parts.push(sep(), Text({ color: top >= 90 ? 'red' : top >= 75 ? 'yellow' : undefined, dimColor: top < 75, children: ['usage ' + shown.join(' · ')] }))
    }

    // Keep whatever other mods draw in the band.
    const others = await next(e)
    return Box({ flexDirection: 'column', children: [Box({ flexDirection: 'row', children: parts }), others].filter(Boolean) })
  })
}
