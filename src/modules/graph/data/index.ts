import type { GraphExam, Task } from '../types'
import { GT_SS2021 } from './exams/gt-ss2021'
import { GT_SS2023 } from './exams/gt-ss2023'
import { GT_SS2024 } from './exams/gt-ss2024'
import { GT_SS2025 } from './exams/gt-ss2025'
import { GT_WS2021 } from './exams/gt-ws2021'
import { GT_WS2223 } from './exams/gt-ws2223'
import { GT_WS2425 } from './exams/gt-ws2425'
import { TASKS } from './questions'

/**
 * The "Multiple Choice Problems" pool: every question, VIPS and exam-derived alike, in one
 * set. The VIPS marker (`source: 'vips'`) is kept so the badge/notice still shows per task.
 */
export const MC_PROBLEMS: Task[] = TASKS

/**
 * The GTOP exams, in list order. Populated exam by exam as the reports are transcribed
 * (see src/modules/graph/data/exams/).
 */
export const GRAPH_EXAMS: GraphExam[] = [
  GT_WS2021,
  GT_SS2021,
  GT_WS2223,
  GT_SS2023,
  GT_SS2024,
  GT_WS2425,
  GT_SS2025,
].sort((a, b) => a.order - b.order)

export function findExam(id: string): GraphExam | undefined {
  return GRAPH_EXAMS.find((exam) => exam.id === id)
}

/** Only exams that actually have tasks - hides empty ones during transcription. */
export function availableExams(): GraphExam[] {
  return GRAPH_EXAMS.filter((exam) => exam.tasks.length > 0)
}
