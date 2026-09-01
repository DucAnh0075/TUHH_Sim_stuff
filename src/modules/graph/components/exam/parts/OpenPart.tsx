import type { OpenPart as OpenPartType } from '../../../types'
import { SelfCheck } from '../../SelfCheck'

type Props = {
  part: OpenPartType
  selfPoints: number | null
  evaluated: boolean
  onChange: (selfPoints: number | null) => void
}

/** Self-graded part: drawn flows, written proofs/reductions, every no-key subtask. */
export function OpenPart({ part, selfPoints, evaluated, onChange }: Props) {
  if (!evaluated) {
    return (
      <p className="text-[14px] leading-snug text-gray-700 italic dark:text-gray-300">
        (Offene Aufgabe: auf Papier lösen, dann „Confirm" zeigt die Lösung.)
      </p>
    )
  }

  return (
    <SelfCheck
      points={part.points}
      value={selfPoints}
      onChange={onChange}
      solution={part.solution}
      solutionFigure={part.solutionFigure}
      noKey={part.noKey}
    />
  )
}
