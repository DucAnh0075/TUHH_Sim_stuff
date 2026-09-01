import type { Task } from '../types'

/** In-place Fisher-Yates on a copy; returns the shuffled copy. */
export function shuffle<T>(items: readonly T[]): T[] {
  const out = items.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * Shuffles the task order and, within each task, the statements/options - so that the
 * position of an answer carries no information. The correctness flags travel with the
 * objects, so scoring stays correct.
 */
export function shuffleTasks(tasks: readonly Task[]): Task[] {
  return shuffle(tasks).map((task) => {
    if (task.kind === 'multi') return { ...task, statements: shuffle(task.statements) }
    if (task.kind === 'single') return { ...task, options: shuffle(task.options) }
    return task // open problems have nothing to shuffle
  })
}
