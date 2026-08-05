export type Statement = {
  /** Verbatim statement text. `$...$` is typeset with KaTeX, see Tex. */
  text: string
  /** true = the statement is TRUE ("✓"), false = FALSE ("✗") */
  answer: boolean
}

/**
 * Where a task comes from.
 *   'exam' - a real exam with the official answer key (the default).
 *   'vips' - a VIPS practice quiz. Those come without a key, so the answers are
 *            derived by an AI and are flagged as such in the UI.
 */
export type Source = 'exam' | 'vips'

export type MultiTask = {
  kind: 'multi'
  id: string
  /** Short headline above the task, e.g. "Trees". */
  title: string
  /** Defaults to 'exam' when omitted. */
  source?: Source
  /** Verbatim question text (bold, inside the blue box). */
  prompt: string
  /** Further paragraphs inside the blue box, e.g. long problem definitions. */
  promptExtra?: string[]
  pointsPerStatement: number
  statements: Statement[]
}

export type Option = {
  /** Verbatim option text. `$...$` is typeset with KaTeX, see Tex. */
  text: string
  /** true = this is the one correct option */
  correct: boolean
}

/** Single choice ("A/B/C/D", exactly one correct, no penalty for a wrong pick). */
export type SingleTask = {
  kind: 'single'
  id: string
  title: string
  /** Defaults to 'exam' when omitted. */
  source?: Source
  prompt: string
  promptExtra?: string[]
  points: number
  options: Option[]
}

/** Union so that further task formats can be added later. */
export type Task = MultiTask | SingleTask

/** Exam scheme: correct +1, wrong -1 (i.e. the full points are deducted). */
export const WRONG_PENALTY_FACTOR = 1

export function maxPoints(task: Task): number {
  return task.kind === 'single' ? task.points : task.pointsPerStatement * task.statements.length
}

/** What the user ticked for a single statement of a MultiTask. */
export type Choice = 'skip' | 'true' | 'false'

/**
 * The answers given for one task. Kept in QuizApp (not in the task components) so
 * that they survive navigating back and forth.
 */
export type Answer =
  | { kind: 'multi'; choices: (Choice | null)[] }
  | { kind: 'single'; picked: number | null }

export function emptyAnswer(task: Task): Answer {
  return task.kind === 'single'
    ? { kind: 'single', picked: null }
    : { kind: 'multi', choices: task.statements.map(() => null) }
}

/** Whether the task is fully answered, i.e. whether "Confirm" may be pressed. */
export function isComplete(answer: Answer): boolean {
  return answer.kind === 'single'
    ? answer.picked !== null
    : answer.choices.every((c) => c !== null)
}

export function statementPoints(task: MultiTask, index: number, choice: Choice | null): number {
  if (choice === null || choice === 'skip') return 0
  const said = choice === 'true'
  return said === task.statements[index].answer
    ? task.pointsPerStatement
    : -task.pointsPerStatement * WRONG_PENALTY_FACTOR
}

export function scoreTask(task: Task, answer: Answer): number {
  if (task.kind === 'single') {
    if (answer.kind !== 'single' || answer.picked === null) return 0
    return task.options[answer.picked].correct ? task.points : 0
  }
  if (answer.kind !== 'multi') return 0
  const sum = answer.choices.reduce((acc, c, i) => acc + statementPoints(task, i, c), 0)
  /** "The subtask cannot score less than 0 points." */
  return Math.max(0, sum)
}
