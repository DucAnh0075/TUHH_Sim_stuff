import type { Answer, Exam } from '../types'

const VERSION = 1
const PREFIX = 'es-exam-trainer'

export type Progress = {
  version: number
  index: number
  answers: Answer[]
  confirmed: boolean[]
  done: boolean[]
  /** Unix ms of the last change, shown as "fortsetzen" hint on the start screen. */
  updatedAt: number
}

function key(examId: string): string {
  return `${PREFIX}:${examId}`
}

/** Mixed exams are assembled fresh every time, so they are never persisted. */
function persistable(examId: string): boolean {
  return examId !== 'mixed'
}

export function loadProgress(examId: string, exam?: Exam): Progress | null {
  if (!persistable(examId)) return null
  try {
    const raw = localStorage.getItem(key(examId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as Progress
    if (parsed.version !== VERSION) return null
    // A data change (added task, edited answer key) invalidates the stored shape.
    if (exam && parsed.answers.length !== exam.tasks.length) return null
    return parsed
  } catch {
    return null
  }
}

export function saveProgress(examId: string, progress: Omit<Progress, 'version' | 'updatedAt'>): void {
  if (!persistable(examId)) return
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
