/**
 * Data model for a complete Embedded Systems exam, mirroring the structure of the
 * official "Auswertungsbericht" PDFs: an overview page with a conversion table plus
 * 14 exercises, each on its own page.
 */

export type ExamId = 'ws2122' | 'ss2022' | 'ss2023' | 'ss2024' | 'ws2425'

/** One row of the exam's "Conversion Table". */
export type GradeRow = { grade: string; percent: number; points: number }

export type Exam = {
  id: ExamId | 'mixed'
  /** Verbatim from the report, e.g. 'ES Winter Term 2024/2025'. */
  term: string
  /** Chronological order for the start screen. */
  order: number
  /** Sum of the exercise points, as printed in the overview table. */
  totalPoints: number
  grades: GradeRow[]
  tasks: Task[]
}

/** Sub-entries shown indented in the sidebar (only where the report scores parts). */
export type Subtask = { id: string; label: string }

type TaskBase = {
  id: string
  /** Exercise name as in the overview table, e.g. 'Scheduling (Priority, PIP) 2'. */
  title: string
  points: number
  /** Bold text inside the light blue box. `$...$` is typeset with KaTeX. */
  prompt: string
  /** Further bold paragraphs inside the blue box. */
  promptExtra?: string[]
  /** Grey note below the box ('A correct entry is worth 1 point ...'). */
  note?: string
  /** Figure id, resolved against figures.manifest.json / public/figures. */
  figure?: string
  subtasks?: Subtask[]
}

// ---------------------------------------------------------------- multiple choice

export type Statement = {
  text: string
  /** true = the statement is TRUE ("✓") */
  answer: boolean
  /** true when the report left it unanswered, so the key is derived. */
  derived?: boolean
}

export type MultiTask = TaskBase & {
  kind: 'multi'
  pointsPerStatement: number
  statements: Statement[]
}

// ------------------------------------------------------------------------- cloze

/** One numbered sentence; `{}` marks the gap. */
export type ClozeItem = { text: string; answer: string }

export type ClozeTask = TaskBase & {
  kind: 'cloze'
  pointsPerGap: number
  items: ClozeItem[]
  /** Wrong words offered besides the correct ones; the pool is shared by all gaps. */
  distractors: string[]
}

// ------------------------------------------------------ single choice (C/E, RTC)

export type ChoiceOption = {
  /** Option text, e.g. a flow relation. Omitted when the option is a figure. */
  text?: string
  /** Figure id for image options (Real-Time Calculus arrival curves). */
  figure?: string
}

export type ChoiceTask = TaskBase & {
  kind: 'choice'
  options: ChoiceOption[]
  /** Index of the single correct option. All-or-nothing scoring. */
  correct: number
  /**
   * One figure showing the whole option block, with plain A-F buttons below it.
   * Used where the report page is a scan and the options cannot be cut apart.
   */
  optionsFigure?: string
}

// ---------------------------------------------- free text fields (VHDL, ADC, ...)

export type Field = {
  id: string
  /** Row label, e.g. 'h(t) = 2.2V' or 'Platform A:'. */
  label?: string
  /**
   * Question printed above the field. Consecutive fields sharing the same text are
   * drawn inside one blue box - that is how the Pareto task is laid out.
   */
  group?: string
  expected: string
  /**
   * 'exact'  - normalised string compare (default)
   * 'set'    - comma separated list, order irrelevant ('A0,A1' == 'a1,a0')
   * 'number' - numeric compare, tolerates '80', '80.0', '80 kHz'
   */
  compare?: 'exact' | 'set' | 'number'
  /** Fixed cells printed before the input, e.g. the VHDL input columns. */
  inputs?: string[]
  /** Small suffix after the field, e.g. 'kHz'. */
  unit?: string
  points?: number
}

export type FieldsTask = TaskBase & {
  kind: 'fields'
  /** Controls the rendering, not the scoring. */
  layout: 'vhdl' | 'adc' | 'pareto' | 'cache' | 'single'
  pointsPerField: number
  fields: Field[]
  /** VHDL: input column headers, e.g. ['F', 'ena', 'E']. */
  columns?: string[]
  /** Caches: the "Before the control flow join" table. */
  before?: { label: string; cells: string[] }[]
  /** Caches: column headers c0 ... cN, shared by both tables. */
  cacheColumns?: string[]
}

// ------------------------------------------------------- grids (Gantt, StateChart)

export type GridState = { label: string; color: string }

export type GridTask = TaskBase & {
  kind: 'grid'
  variant: 'gantt' | 'statechart'
  /** gantt: ['T1','T2','T3'] - statechart: ['(Reset)','s','a', ...] */
  rows: string[]
  /** gantt: tick labels '0'...'33' - statechart: state names ['A','B', ...] */
  cols: string[]
  /** Index 0 is the initial state of every cell. */
  states: GridState[]
  /** Task table printed above the grid. */
  table?: { headers: string[]; rows: string[][] }
  /** Figure of the official solution, revealed on Confirm. */
  solutionFigure?: string
}

export type Task = MultiTask | ClozeTask | ChoiceTask | FieldsTask | GridTask

// ------------------------------------------------------------------------ answers

export type Choice = 'skip' | 'true' | 'false'

export type Answer =
  | { kind: 'multi'; choices: (Choice | null)[] }
  | { kind: 'cloze'; picks: (string | null)[] }
  | { kind: 'choice'; picked: number | null }
  | { kind: 'fields'; values: string[] }
  | { kind: 'grid'; cells: number[][]; selfPoints: number | null }

export function emptyAnswer(task: Task): Answer {
  switch (task.kind) {
    case 'multi':
      return { kind: 'multi', choices: task.statements.map(() => null) }
    case 'cloze':
      return { kind: 'cloze', picks: task.items.map(() => null) }
    case 'choice':
      return { kind: 'choice', picked: null }
    case 'fields':
      return { kind: 'fields', values: task.fields.map(() => '') }
    case 'grid':
      return {
        kind: 'grid',
        cells: task.rows.map(() => task.cols.map(() => 0)),
        selfPoints: null,
      }
  }
}

/** Whether "Confirm" may be pressed. Grids are always confirmable (idle is an answer). */
export function isComplete(answer: Answer): boolean {
  switch (answer.kind) {
    case 'multi':
      return answer.choices.every((c) => c !== null)
    case 'cloze':
      return answer.picks.every((p) => p !== null)
    case 'choice':
      return answer.picked !== null
    case 'fields':
      // Some expected answers are legitimately empty (an empty cache entry), so one
      // filled field is enough to allow confirming.
      return answer.values.some((v) => v.trim() !== '')
    case 'grid':
      return true
  }
}

/** Whether the user has touched the task at all (drives the sidebar's "started" state). */
export function isStarted(answer: Answer): boolean {
  switch (answer.kind) {
    case 'multi':
      return answer.choices.some((c) => c !== null)
    case 'cloze':
      return answer.picks.some((p) => p !== null)
    case 'choice':
      return answer.picked !== null
    case 'fields':
      return answer.values.some((v) => v.trim() !== '')
    case 'grid':
      return answer.cells.some((row) => row.some((c) => c !== 0)) || answer.selfPoints !== null
  }
}

// ----------------------------------------------------------------------- scoring

/** Exam scheme everywhere: a right answer scores, a wrong or missing one is 0. */
export function statementPoints(task: MultiTask, index: number, choice: Choice | null): number {
  if (choice === null || choice === 'skip') return 0
  const said = choice === 'true'
  return said === task.statements[index].answer ? task.pointsPerStatement : 0
}

export function gapPoints(task: ClozeTask, index: number, pick: string | null): number {
  return pick !== null && pick === task.items[index].answer ? task.pointsPerGap : 0
}

function normalise(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

/** Compares one text field against its expected value, honouring `compare`. */
export function fieldCorrect(field: Field, value: string): boolean {
  const given = normalise(value)
  if (given === '') return normalise(field.expected) === ''

  if (field.compare === 'number') {
    const num = Number.parseFloat(given.replace(',', '.'))
    const want = Number.parseFloat(normalise(field.expected).replace(',', '.'))
    return Number.isFinite(num) && Number.isFinite(want) && num === want
  }

  if (field.compare === 'set') {
    const split = (s: string) =>
      s
        .split(',')
        .map((p) => p.trim())
        .filter((p) => p !== '')
        .sort()
        .join(',')
    return split(given) === split(normalise(field.expected))
  }

  return given === normalise(field.expected)
}

export function fieldPoints(task: FieldsTask, index: number, value: string): number {
  const field = task.fields[index]
  return fieldCorrect(field, value) ? (field.points ?? task.pointsPerField) : 0
}

export function scoreTask(task: Task, answer: Answer): number {
  switch (task.kind) {
    case 'multi':
      if (answer.kind !== 'multi') return 0
      return answer.choices.reduce((sum, c, i) => sum + statementPoints(task, i, c), 0)
    case 'cloze':
      if (answer.kind !== 'cloze') return 0
      return answer.picks.reduce((sum, p, i) => sum + gapPoints(task, i, p), 0)
    case 'choice':
      if (answer.kind !== 'choice') return 0
      return answer.picked === task.correct ? task.points : 0
    case 'fields': {
      if (answer.kind !== 'fields') return 0
      const sum = answer.values.reduce((acc, v, i) => acc + fieldPoints(task, i, v), 0)
      // The 2021/22 A/D converter has three 2-point questions but is capped at 4
      // points in the overview table, so a task never scores above its maximum.
      return Math.min(sum, task.points)
    }
    case 'grid':
      if (answer.kind !== 'grid') return 0
      return answer.selfPoints ?? 0
  }
}

/** Grids cannot be graded automatically - the user assigns the points themselves. */
export function isSelfGraded(task: Task): boolean {
  return task.kind === 'grid'
}

// ------------------------------------------------------------------------- grades

/**
 * The grade for a score, using the exam's own conversion table (best row that fits).
 * `grades` holds the rows 1.0 ... 4.0; everything below is 5.0, as in the report.
 */
export function gradeFor(exam: Exam, scored: number): string {
  for (const row of exam.grades) {
    if (scored >= row.points) return row.grade
  }
  return '5.0'
}

/** The standard percent steps of the reports, used to build a table for mixed exams. */
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
