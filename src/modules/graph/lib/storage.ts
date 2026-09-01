import type { ExamAnswer, GraphExam } from '../types'

const VERSION = 1
/** Own prefix so it never collides with the Embedded module's `es-exam-trainer:*` keys. */
const PREFIX = 'gt-exam-trainer'

export type Progress = {
  version: number
  index: number
  answers: ExamAnswer[]
  confirmed: boolean[]
  done: boolean[]
  /** Unix ms of the last change, shown as "fortsetzen" hint on the exam list. */
  updatedAt: number
}

function key(examId: string): string {
  return `${PREFIX}:${examId}`
}

export function loadProgress(examId: string, exam?: GraphExam): Progress | null {
  try {
    const raw = localStorage.getItem(key(examId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as Progress
    if (parsed.version !== VERSION) return null
    if (!exam) return parsed
    // A data change (added task, edited part count) invalidates the stored shape.
    if (parsed.answers.length !== exam.tasks.length) return null
    if (exam.tasks.some((t, i) => parsed.answers[i]?.parts.length !== t.parts.length)) return null
    return parsed
  } catch {
    return null
  }
}

export function saveProgress(examId: string, progress: Omit<Progress, 'version' | 'updatedAt'>): void {
  try {
    const payload: Progress = { ...progress, version: VERSION, updatedAt: Date.now() }
    localStorage.setItem(key(examId), JSON.stringify(payload))
  } catch {
    // Private windows and blocked site data: progress is simply not remembered.
  }
}

export function clearProgress(examId: string): void {
  try {
    localStorage.removeItem(key(examId))
  } catch {
    // ignore
  }
}
