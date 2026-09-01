/**
 * Data model for the Graph Theory practice quiz: a flat pool of questions, each either
 * a multiple-choice statement block ('multi') or a single-choice question ('single').
 * Separate from the Embedded Systems module - the two type systems do not mix.
 */

export type Choice = 'skip' | 'true' | 'false'

type TaskBase = {
  id: string
  /** Short heading, e.g. 'Chromatic number'. */
  title: string
  /** The question. `$...$` is typeset with KaTeX. */
  prompt: string
  /** Further paragraphs (problem definitions) shown below the question. */
  promptExtra?: string[]
  /** 'vips' marks practice questions without an official key (AI-derived answers). */
  source?: 'vips'
  /**
   * Which exam this question belongs to (id in GRAPH_EXAMS). Absent for VIPS practice
   * questions and for the ungrouped 'Altfragen' pool.
   */
  exam?: string
}

/** One selectable exam in the Graph module, shown in GraphSelect. */
export type GraphExam = { id: string; title: string; order: number }

// ------------------------------------------------------------------- multiple choice

export type Statement = {
  text: string
  /** true = the statement is TRUE ("✓"). */
  answer: boolean
}

export type MultiTask = TaskBase & {
  kind: 'multi'
  pointsPerStatement: number
  statements: Statement[]
}

// ---------------------------------------------------------------------- single choice

export type Option = {
  text: string
  correct: boolean
}

export type SingleTask = TaskBase & {
  kind: 'single'
  points: number
  options: Option[]
}

export type Task = MultiTask | SingleTask

// -------------------------------------------------------------------------- answers

export type Answer =
  | { kind: 'multi'; choices: (Choice | null)[] }
  | { kind: 'single'; picked: number | null }

export function emptyAnswer(task: Task): Answer {
  return task.kind === 'multi'
    ? { kind: 'multi', choices: task.statements.map(() => null) }
    : { kind: 'single', picked: null }
}

/** Whether "Confirm" may be pressed. */
export function isComplete(answer: Answer): boolean {
  return answer.kind === 'multi'
    ? answer.choices.every((c) => c !== null)
    : answer.picked !== null
}

// -------------------------------------------------------------------------- scoring

export function maxPoints(task: Task): number {
  return task.kind === 'multi' ? task.pointsPerStatement * task.statements.length : task.points
}

/**
 * Per statement: a correct choice scores +pointsPerStatement, a wrong one costs the same,
 * skip/unanswered is 0. The task total is floored at 0 (see scoreTask).
 */
export function statementPoints(task: MultiTask, index: number, choice: Choice | null): number {
  if (choice === null || choice === 'skip') return 0
  const said = choice === 'true'
  return said === task.statements[index].answer ? task.pointsPerStatement : -task.pointsPerStatement
}

export function scoreTask(task: Task, answer: Answer): number {
  if (task.kind === 'multi') {
    if (answer.kind !== 'multi') return 0
    const sum = answer.choices.reduce((acc, c, i) => acc + statementPoints(task, i, c), 0)
    return Math.max(0, sum)
  }
  if (answer.kind !== 'single') return 0
  return answer.picked !== null && task.options[answer.picked]?.correct ? task.points : 0
}
