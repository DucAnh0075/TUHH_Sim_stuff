/**
 * Data model for the Graph Theory module. Separate from the Embedded Systems module -
 * the two type systems do not mix, not even for the grade table.
 *
 * The file has two halves:
 *
 *   1. The MULTIPLE CHOICE POOL (`Task` = 'multi' | 'single' | 'open', `Answer`), one
 *      question per screen, run by `QuizApp`.
 *   2. The EXAM TRAINER (`GraphExam` > `ExamTask` > `Part`, `ExamAnswer`), one exam
 *      exercise per screen, run by `GraphExamApp`.
 *
 * They are deliberately disjoint: an exam exercise is composite (numbers + a single
 * choice + a true/false block + ...), a pool question never is. Adding a fourth member
 * to `Task` would break the exhaustive switches below and force `QuizApp` to change.
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
}

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

// ----------------------------------------------------- open / self-graded (exam problems)

export type OpenTask = TaskBase & {
  kind: 'open'
  points: number
  /** Figure shown with the prompt (image id under public/figures/). */
  figure?: string
  /** Official solution, revealed on Confirm. `solution` is KaTeX text, `solutionFigure` an image id. */
  solution?: string
  solutionFigure?: string
}

export type Task = MultiTask | SingleTask | OpenTask

// -------------------------------------------------------------------------- answers

export type Answer =
  | { kind: 'multi'; choices: (Choice | null)[] }
  | { kind: 'single'; picked: number | null }
  | { kind: 'open'; selfPoints: number | null }

export function emptyAnswer(task: Task): Answer {
  switch (task.kind) {
    case 'multi':
      return { kind: 'multi', choices: task.statements.map(() => null) }
    case 'single':
      return { kind: 'single', picked: null }
    case 'open':
      return { kind: 'open', selfPoints: null }
  }
}

/** Whether "Confirm" may be pressed. Open problems are always confirmable (reveals solution). */
export function isComplete(answer: Answer): boolean {
  switch (answer.kind) {
    case 'multi':
      return answer.choices.every((c) => c !== null)
    case 'single':
      return answer.picked !== null
    case 'open':
      return true
  }
}

/** Open problems are self-graded - the user assigns the points after seeing the solution. */
export function isSelfGraded(task: Task): boolean {
  return task.kind === 'open'
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
  switch (task.kind) {
    case 'multi': {
      if (answer.kind !== 'multi') return 0
      const sum = answer.choices.reduce((acc, c, i) => acc + statementPoints(task, i, c), 0)
      return Math.max(0, sum)
    }
    case 'single':
      if (answer.kind !== 'single') return 0
      return answer.picked !== null && task.options[answer.picked]?.correct ? task.points : 0
    case 'open':
      return answer.kind === 'open' ? (answer.selfPoints ?? 0) : 0
  }
}

// =====================================================================================
//  EXAM TRAINER
//
//  One exam exercise (as printed in the Auswertungsbericht) is one screen, run by
//  GraphExamApp. An exercise is composite: it is made of several heterogeneous `Part`s
//  (a fields block, a single choice, a true/false block, an ordering puzzle, an open
//  self-graded part, ...), unlike a pool `Task`, which is always exactly one thing.
// =====================================================================================

export type GradeRow = { grade: string; percent: number; points: number }

/** One selectable exam in the Graph module, shown in the exam list. */
export type GraphExam = {
  /** 'gt-ws2021' - also the figure namespace (public/figures/<id>/...) and the storage key. */
  id: string
  title: string
  order: number
  language: 'de' | 'en'
  /** Sum of the printed exercise points - kept explicit so it survives a data typo. */
  totalPoints: number
  grades: GradeRow[]
  /** Exam-level banner, e.g. "Mock Exam: keine offiziellen Loesungen im Bericht." */
  note?: string
  tasks: ExamTask[]
}

/** One exercise of an exam, e.g. "Ford-Fulkerson", 12 points, made of several parts. */
export type ExamTask = {
  id: string
  title: string
  points: number
  prompt: string
  promptExtra?: string[]
  /** KaTeX *display* blocks between the prompt and the parts (a D^3 matrix, an LP, ...). */
  display?: string[]
  /** Grey scoring note under the blue box. */
  note?: string
  figure?: string
  parts: Part[]
}

// ------------------------------------------------------------------------------- parts

type PartBase = {
  /** Unique within the exam - also the DOM id the sidebar scrolls to. */
  id: string
  /** Presence puts this part in the sidebar's subtask list. */
  label?: string
  /** Consecutive parts sharing a `group` render as one bordered block with one sidebar entry. */
  group?: string
  intro?: string
  display?: string[]
  note?: string
  figure?: string
  /** The key was reconstructed (not printed in the report), like the MC pool's `source: 'vips'`. */
  derived?: boolean
}

export type FieldCompare = 'auto' | 'number' | 'exact' | 'set'

export type ExamField = {
  id: string
  /** KaTeX allowed, e.g. '$d^3_{2,4} =$'. */
  label?: string
  expected: string
  /** Further accepted spellings, e.g. ['0.5'] for an expected '1/2'. */
  alternatives?: string[]
  /** Default 'auto': numeric compare when both sides parse as a number, else exact text match. */
  compare?: FieldCompare
  /** Numeric compare tolerance, default 1e-6. */
  tolerance?: number
  unit?: string
  /** Overrides the part's pointsPerField, for a field worth a different amount. */
  points?: number
  placeholder?: string
}

export type FieldsPart = PartBase & {
  kind: 'fields'
  pointsPerField: number
  fields: ExamField[]
  layout?: 'rows' | 'inline'
}

export type SinglePart = PartBase & {
  kind: 'single'
  points: number
  options: { text: string; figure?: string }[]
  correct: number
  /** 'inline' renders two small pill buttons on one line, for e.g. "continues / does not". */
  variant?: 'cards' | 'inline'
}

export type ExamStatement = { text: string; answer: boolean; derived?: boolean }

export type MultiPart = PartBase & {
  kind: 'multi'
  pointsPerStatement: number
  statements: ExamStatement[]
}

export type OrderItem = { id: string; text: string }

export type OrderPart = PartBase & {
  kind: 'order'
  points: number
  /** All offered blocks, distractors included. */
  items: OrderItem[]
  /** Item ids in the correct order - a subset of `items` when there are distractors. */
  solution: string[]
  /** Deduction per wrong slot: 1 for the proof puzzle, 0.5 for Landau notation. */
  penalty: number
}

export type OpenPart = PartBase & {
  kind: 'open'
  points: number
  solution?: string
  solutionFigure?: string
  /** No solution at all is printed in the report (e.g. the Mock Exam). */
  noKey?: boolean
}

export type InfoPart = PartBase & { kind: 'info'; text?: string }

export type Part = FieldsPart | SinglePart | MultiPart | OrderPart | OpenPart | InfoPart

// ------------------------------------------------------------------------------ answers

export type PartAnswer =
  | { kind: 'fields'; values: string[] }
  | { kind: 'single'; picked: number | null }
  | { kind: 'multi'; choices: (Choice | null)[] }
  | { kind: 'order'; slots: string[] }
  | { kind: 'open'; selfPoints: number | null }
  | { kind: 'info' }

/** An object, not a bare array, so a per-task field can be added later without a storage bump. */
export type ExamAnswer = { parts: PartAnswer[] }

export function emptyPartAnswer(part: Part): PartAnswer {
  switch (part.kind) {
    case 'fields':
      return { kind: 'fields', values: part.fields.map(() => '') }
    case 'single':
      return { kind: 'single', picked: null }
    case 'multi':
      return { kind: 'multi', choices: part.statements.map(() => null) }
    case 'order':
      return { kind: 'order', slots: [] }
    case 'open':
      return { kind: 'open', selfPoints: null }
    case 'info':
      return { kind: 'info' }
  }
}

export function emptyExamAnswer(task: ExamTask): ExamAnswer {
  return { parts: task.parts.map(emptyPartAnswer) }
}

export function isPartStarted(answer: PartAnswer): boolean {
  switch (answer.kind) {
    case 'fields':
      return answer.values.some((v) => v.trim() !== '')
    case 'single':
      return answer.picked !== null
    case 'multi':
      return answer.choices.some((c) => c !== null)
    case 'order':
      return answer.slots.length > 0
    case 'open':
      return answer.selfPoints !== null
    case 'info':
      return false
  }
}

/**
 * Whether Confirm may be pressed for the whole exercise. `multi` stays strict (every
 * statement decided - the "?" button makes skipping explicit, same rule as the MC pool);
 * `fields`/`order` are lax (one entry suffices - requiring all ten residual-network
 * fields would make Confirm practically unreachable); `open`/`info` are always complete.
 */
export function isPartComplete(part: Part, answer: PartAnswer): boolean {
  if (part.kind === 'multi' && answer.kind === 'multi') return answer.choices.every((c) => c !== null)
  if (part.kind === 'open' || part.kind === 'info') return true
  return isPartStarted(answer)
}

export function isExamStarted(answer: ExamAnswer): boolean {
  return answer.parts.some(isPartStarted)
}

export function isExamComplete(task: ExamTask, answer: ExamAnswer): boolean {
  return task.parts.every((part, i) => isPartComplete(part, answer.parts[i] ?? emptyPartAnswer(part)))
}

/** An exercise with at least one open part waits for the user's self-assigned points. */
export function isExamSelfGraded(task: ExamTask): boolean {
  return task.parts.some((p) => p.kind === 'open')
}

/** True once confirmed while an open part still has no self-assigned points - shown as "(vorläufig)". */
export function hasUngradedOpenPart(task: ExamTask, answer: ExamAnswer): boolean {
  return task.parts.some((part, i) => {
    if (part.kind !== 'open') return false
    const a = answer.parts[i]
    return !a || a.kind !== 'open' || a.selfPoints === null
  })
}

// ------------------------------------------------------------------------------ scoring

const INFINITE = /^([+-]?)(inf(inity)?|infty|unendlich|\\infty|∞)$/i

function normaliseText(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

/** Parses a field value as a number; `null` if it isn't one. Accepts inf/-inf spellings. */
export function parseNumeric(raw: string): number | null {
  const trimmed = raw.trim()
  if (trimmed === '') return null
  const infMatch = trimmed.match(INFINITE)
  if (infMatch) return infMatch[1] === '-' ? -Infinity : Infinity
  const cleaned = trimmed.replace(',', '.').replace(/[a-zA-Z°%]+$/, '').trim()
  if (cleaned === '') return null
  const value = Number(cleaned)
  return Number.isFinite(value) ? value : null
}

function fieldMatches(expected: string, tolerance: number, compare: FieldCompare, given: string): boolean {
  if (compare === 'set') {
    const split = (s: string) =>
      s
        .split(',')
        .map((p) => normaliseText(p))
        .filter((p) => p !== '')
        .sort()
        .join(',')
    return split(given) === split(expected)
  }

  if (compare === 'exact') return normaliseText(given) === normaliseText(expected)

  if (compare === 'number') {
    const a = parseNumeric(given)
    const b = parseNumeric(expected)
    if (a === null || b === null) return false
    if (!Number.isFinite(a) || !Number.isFinite(b)) return a === b
    return Math.abs(a - b) <= tolerance
  }

  // 'auto': numeric compare when both sides parse, else exact text match.
  const a = parseNumeric(given)
  const b = parseNumeric(expected)
  if (a !== null && b !== null) {
    if (!Number.isFinite(a) || !Number.isFinite(b)) return a === b
    return Math.abs(a - b) <= tolerance
  }
  return normaliseText(given) === normaliseText(expected)
}

export function fieldCorrect(field: ExamField, value: string): boolean {
  const compare = field.compare ?? 'auto'
  const tolerance = field.tolerance ?? 1e-6
  const candidates = [field.expected, ...(field.alternatives ?? [])]
  return candidates.some((expected) => fieldMatches(expected, tolerance, compare, value))
}

export function fieldPoints(part: FieldsPart, index: number, value: string): number {
  const field = part.fields[index]
  return fieldCorrect(field, value) ? (field.points ?? part.pointsPerField) : 0
}

/** Per statement: a correct choice scores +pointsPerStatement, a wrong one costs the same. */
export function partStatementPoints(part: MultiPart, index: number, choice: Choice | null): number {
  if (choice === null || choice === 'skip') return 0
  const said = choice === 'true'
  return said === part.statements[index].answer ? part.pointsPerStatement : -part.pointsPerStatement
}

/** Wrong slots up to the longer of what was placed and what the solution expects. */
export function orderWrongSlots(part: OrderPart, slots: string[]): number {
  const length = Math.max(slots.length, part.solution.length)
  let wrong = 0
  for (let i = 0; i < length; i++) {
    if ((slots[i] ?? null) !== (part.solution[i] ?? null)) wrong++
  }
  return wrong
}

export function partMax(part: Part): number {
  switch (part.kind) {
    case 'fields':
      return part.fields.reduce((sum, f) => sum + (f.points ?? part.pointsPerField), 0)
    case 'multi':
      return part.pointsPerStatement * part.statements.length
    case 'single':
    case 'order':
    case 'open':
      return part.points
    case 'info':
      return 0
  }
}

export function scorePart(part: Part, answer: PartAnswer): number {
  switch (part.kind) {
    case 'fields': {
      if (answer.kind !== 'fields') return 0
      return part.fields.reduce((sum, _f, i) => sum + fieldPoints(part, i, answer.values[i] ?? ''), 0)
    }
    case 'single':
      if (answer.kind !== 'single') return 0
      return answer.picked === part.correct ? part.points : 0
    case 'multi': {
      if (answer.kind !== 'multi') return 0
      const sum = part.statements.reduce(
        (acc, _s, i) => acc + partStatementPoints(part, i, answer.choices[i] ?? null),
        0,
      )
      return Math.max(0, sum)
    }
    case 'order': {
      if (answer.kind !== 'order') return 0
      return Math.max(0, part.points - part.penalty * orderWrongSlots(part, answer.slots))
    }
    case 'open':
      return answer.kind === 'open' ? (answer.selfPoints ?? 0) : 0
    case 'info':
      return 0
  }
}

export function maxExamPoints(task: ExamTask): number {
  return task.parts.reduce((sum, p) => sum + partMax(p), 0)
}

/** Capped at the exercise's printed points, protecting the grade table from a data typo. */
export function scoreExamTask(task: ExamTask, answer: ExamAnswer): number {
  const sum = task.parts.reduce((acc, part, i) => acc + scorePart(part, answer.parts[i] ?? emptyPartAnswer(part)), 0)
  return Math.min(task.points, sum)
}

// ------------------------------------------------------------------------------- grades
//
// Copied, not imported, from the Embedded module - the two type systems share nothing.

export function gradeFor(exam: GraphExam, scored: number): string {
  for (const row of exam.grades) {
    if (scored >= row.points) return row.grade
  }
  return '5.0'
}

export const GRADE_STEPS: { grade: string; percent: number }[] = [
  { grade: '1.0', percent: 95 },
  { grade: '1.3', percent: 90 },
  { grade: '1.7', percent: 85 },
  { grade: '2.0', percent: 80 },
  { grade: '2.3', percent: 75 },
  { grade: '2.7', percent: 70 },
  { grade: '3.0', percent: 65 },
  { grade: '3.3', percent: 60 },
  { grade: '3.7', percent: 55 },
  { grade: '4.0', percent: 50 },
]

export function conversionTable(totalPoints: number): GradeRow[] {
  return GRADE_STEPS.map(({ grade, percent }) => ({
    grade,
    percent,
    points: Math.round(totalPoints * percent) / 100,
  }))
}

// --------------------------------------------------------------------------- validation
//
// There is no test runner, so this is the safety net for transcription errors. Called
// from ExamSelect under `if (import.meta.env.DEV)` and printed with console.warn.

export function validateExam(exam: GraphExam): string[] {
  const problems: string[] = []
  const taskIds = new Set<string>()

  const printedTotal = exam.tasks.reduce((sum, t) => sum + t.points, 0)
  if (printedTotal !== exam.totalPoints) {
    problems.push(`${exam.id}: totalPoints is ${exam.totalPoints}, but tasks sum to ${printedTotal}.`)
  }

  for (const task of exam.tasks) {
    if (taskIds.has(task.id)) problems.push(`${exam.id}: duplicate task id "${task.id}".`)
    taskIds.add(task.id)

    const max = maxExamPoints(task)
    if (max !== task.points) {
      problems.push(`${exam.id}/${task.id}: task.points is ${task.points}, but parts sum to ${max}.`)
    }

    const partIds = new Set<string>()
    for (const part of task.parts) {
      if (partIds.has(part.id)) problems.push(`${exam.id}/${task.id}: duplicate part id "${part.id}".`)
      partIds.add(part.id)

      if (part.kind === 'single' && (part.correct < 0 || part.correct >= part.options.length)) {
        problems.push(`${exam.id}/${task.id}/${part.id}: correct index ${part.correct} out of range.`)
      }
      if (part.kind === 'multi' && part.statements.length === 0) {
        problems.push(`${exam.id}/${task.id}/${part.id}: multi part has no statements.`)
      }
      if (part.kind === 'order') {
        const itemIds = new Set(part.items.map((i) => i.id))
        for (const id of part.solution) {
          if (!itemIds.has(id)) {
            problems.push(`${exam.id}/${task.id}/${part.id}: solution id "${id}" not among items.`)
          }
        }
      }
    }
  }

  return problems
}
