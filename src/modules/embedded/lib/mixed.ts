import { EXAMS } from '../data'
import type { Exam, Task } from '../types'
import { conversionTable } from '../types'
import { pick } from './shuffle'

/**
 * Builds a random exam: one task per slot (0 = the text task, 1 = StateCharts, ...),
 * each drawn from a random semester. Slot n of every report holds the same exercise
 * type, so the result is a well-formed exam of 14 exercises.
 */
export function buildMixedExam(): Exam {
  const slots = Math.max(...EXAMS.map((exam) => exam.tasks.length))
  const tasks: Task[] = []

  for (let slot = 0; slot < slots; slot++) {
    const candidates = EXAMS.filter((exam) => exam.tasks[slot] !== undefined)
    if (candidates.length === 0) continue
    const source = pick(candidates)
    const task = source.tasks[slot]
    // Prefix the id so progress keys and React keys stay unique across semesters.
    tasks.push({ ...task, id: `${source.id}-${task.id}`, title: `${task.title} · ${source.term}` })
  }

  const totalPoints = tasks.reduce((sum, task) => sum + task.points, 0)

  return {
    id: 'mixed',
    term: 'Mixed Exam',
    order: 99,
    totalPoints,
    grades: conversionTable(totalPoints),
    tasks,
  }
}
