import type { OpenTask as OpenTaskType } from '../types'
import { GraphFigure } from './GraphFigure'
import { PromptBox } from './PromptBox'
import { SelfCheck } from './SelfCheck'
import { TaskHeader } from './TaskHeader'

type Props = {
  task: OpenTaskType
  /** Points the user assigned themselves, `null` = not graded yet. Owned by QuizApp. */
  selfPoints: number | null
  /** true once "Confirm" was pressed: reveal the official solution. */
  evaluated: boolean
  onChange: (selfPoints: number | null) => void
}

/**
 * A self-graded open exam problem (proofs, constructions, ...). The user works it out on
 * paper, Confirm reveals the official solution, and the points are entered by hand -
 * there is no machine-readable key. Mirrors the Embedded module's self-graded grids.
 */
export function OpenTask({ task, selfPoints, evaluated, onChange }: Props) {
  return (
    <div>
      <TaskHeader
        title={task.title}
        scored={evaluated ? (selfPoints ?? 0) : null}
        max={task.points}
        vips={task.source === 'vips'}
      />

      <PromptBox prompt={task.prompt} extra={task.promptExtra} />

      {task.figure && (
        <div className="my-5 flex justify-center">
          <GraphFigure id={task.figure} />
        </div>
      )}

      {!evaluated ? (
        <p className="mt-4 text-[14px] leading-snug text-gray-700 italic dark:text-gray-300">
          (Offene Aufgabe: auf Papier lösen, dann „Confirm" zeigt die Lösung.)
        </p>
      ) : (
        <SelfCheck
          points={task.points}
          value={selfPoints}
          onChange={onChange}
          solution={task.solution}
          solutionFigure={task.solutionFigure}
        />
      )}
    </div>
  )
}
