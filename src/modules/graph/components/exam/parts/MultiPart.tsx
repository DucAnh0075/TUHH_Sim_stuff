import type { Choice, MultiPart as MultiPartType } from '../../../types'
import { partStatementPoints } from '../../../types'
import { ChoiceButton } from '../../ChoiceButton'
import { Tex } from '../../Tex'

type Props = {
  part: MultiPartType
  choices: (Choice | null)[]
  evaluated: boolean
  onChange: (choices: (Choice | null)[]) => void
}

/** True/false statement block: Aussagen, min-cut vertex selection, DFS sequences, ... */
export function MultiPart({ part, choices, evaluated, onChange }: Props) {
  const pick = (i: number, choice: Choice) => {
    if (evaluated) return
    const updated = choices.slice()
    updated[i] = choice
    onChange(updated)
  }

  return (
    <div className="flex flex-col gap-3">
      {part.statements.map((statement, i) => {
        const points = partStatementPoints(part, i, choices[i] ?? null)
        let card = 'border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
        if (evaluated) {
          if (points > 0) card = 'border-[#9cc23e] bg-[#b6d957] text-gray-900'
          else if (choices[i] === 'true' || choices[i] === 'false') card = 'border-[#e07272] bg-[#ef8a8a] text-gray-900'
        }

        return (
          <div
            key={i}
            className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 shadow-sm transition-colors ${card}`}
          >
            <span className="w-4 shrink-0 text-[14px] font-bold">{String.fromCharCode(65 + i)}</span>

            <div className="flex shrink-0 items-center gap-1.5">
              <ChoiceButton
                label="?"
                title="Überspringen"
                tone="skip"
                active={choices[i] === 'skip'}
                disabled={evaluated}
                onClick={() => pick(i, 'skip')}
              />
              <ChoiceButton
                label="✓"
                title="Wahr"
                tone="true"
                active={choices[i] === 'true'}
                disabled={evaluated}
                onClick={() => pick(i, 'true')}
              />
              <ChoiceButton
                label="✗"
                title="Falsch"
                tone="false"
                active={choices[i] === 'false'}
                disabled={evaluated}
                onClick={() => pick(i, 'false')}
              />
            </div>

            <p className="flex-1 text-[15px] leading-snug">
              {statement.derived && <span title="Antwort abgeleitet, kein offizieller Schlüssel">⚠️ </span>}
              <Tex text={statement.text} />
            </p>

            {evaluated && <span className="shrink-0 text-[14px] font-bold">{points.toFixed(2)} Punkte</span>}
          </div>
        )
      })}
    </div>
  )
}
