/** `.ways/goal`: the piece of work under way and its steps. */
export type Goal = {
  goal: string
  kind?: string
  ref?: string
  steps: string[]
  /** Index of the current step; equal to steps.length when done. */
  at: number
  started?: string
}

export type MilestoneIssue = { number: number; title: string; note?: string }

export type Milestone = {
  title: string
  url: string
  done: number
  total: number
  inProgress: MilestoneIssue[]
  waiting: MilestoneIssue[]
  free: MilestoneIssue[]
  next?: string
  checkedAt: number
  error?: string
}

export type GoToCommand = { label: string; text: string; what: string }
export type GoToDoc = { label: string; href: string }

/** From the repo's learning record for this person (`learning` in `.claude/compass.json`). */
export type Learning = {
  name: string
  topicsAtOne: number
  topics: number
  challengesDone: number
  challenges: number
  toursDone: number
  tours: number
  badges: string[]
  /** The first challenge not yet complete, to suggest. */
  nextChallenge?: string
}

/** `.claude/compass.json` in the repo. */
export type Config = {
  /** owner/name on GitHub; absent, Compass asks `gh repo view`. */
  repo?: string
  /** Where each person's learning record is, with `{login}` for their GitHub login (`learning/people/{login}.md`); absent, no learning section. */
  learning?: string
  commands: GoToCommand[]
  docs: GoToDoc[]
}

declare module 'claude-code' {
  interface PluginState {
    'ways-compass': {
      goal: Shaped<Goal | null>
      milestone: Shaped<Milestone | null>
      config: Shaped<Config | null>
      learning: Shaped<Learning | null>
      open: Shaped<boolean>
      compact: Shaped<boolean>
      showIssues: Shaped<boolean>
    }
  }
}
