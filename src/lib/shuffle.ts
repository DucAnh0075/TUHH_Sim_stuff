import type { Task } from '../types'

/** Fisher-Yates, returns a new array. */
export function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
/**
 * Shuffles the task order only. The statements keep their A-E order, just like
 * in the exam.
 */
export function shuffleTasks(tasks: readonly Task[]): Task[] {
  return shuffle(tasks)
}
