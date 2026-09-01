import type { GraphExam, Task } from '../types'
import { TASKS } from './questions'

/** VIPS practice questions - the "Multiple Choice Problems" pool. */
export const MC_PROBLEMS: Task[] = TASKS.filter((t) => t.source === 'vips')

/** The exams, in list order. GTOP appears once its questions are added. */
export const GRAPH_EXAMS: GraphExam[] = [
  { id: 'altfragen', title: 'Altfragen (gemischt)', order: 1 },
  { id: 'gtop-sose25', title: 'GTOP SoSe 2025', order: 2 },
].sort((a, b) => a.order - b.order)

/** The tasks of one exam. 'altfragen' = all real exam questions without an exam tag. */
export function examTasks(id: string): Task[] {
  if (id === 'altfragen') return TASKS.filter((t) => t.source !== 'vips' && !t.exam)
  return TASKS.filter((t) => t.exam === id)
}

/** Only exams that actually have questions - hides empty ones (e.g. GTOP before import). */
export function availableExams(): GraphExam[] {
  return GRAPH_EXAMS.filter((exam) => examTasks(exam.id).length > 0)
}
