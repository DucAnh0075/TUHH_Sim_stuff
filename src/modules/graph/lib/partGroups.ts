import type { Part } from '../types'

/**
 * Runs of consecutive parts that share the same `group` - each run renders as one
 * bordered block with one sidebar entry (e.g. the TSP exercise: a `fields` part for
 * `B(P_i)` and a `single` part for "continues?" sharing one partial-tour group).
 * A part without `group`, or one whose `group` differs from its predecessor's, starts
 * its own single-part run.
 */
export function groupParts(parts: Part[]): Part[][] {
  const runs: Part[][] = []
  for (const part of parts) {
    const last = runs[runs.length - 1]
    if (last && part.group && last[0].group === part.group) last.push(part)
    else runs.push([part])
  }
  return runs
}
