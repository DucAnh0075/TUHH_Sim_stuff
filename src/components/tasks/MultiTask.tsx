import type { Choice, MultiTask as MultiTaskType } from '../../types'
import { statementPoints } from '../../types'
import { Tex } from '../Tex'

type Props = {
  task: MultiTaskType
  choices: (Choice | null)[]
  evaluated: boolean
  onChange: (choices: (Choice | null)[]) => void
}

/** Multiple Choice: statements A-J, answered with ? / ✓ / ✗. */
export function MultiTask({ task, choices, evaluated, onChange }: Props) {
  const pick = (i: number, choice: Choice) => {
    if (evaluated) return
    const updated = [...choices]
    updated[i] = choice
    onChange(updated)
  }

  return (
    <div className="flex flex-col gap-3">
      {task.statements.map((statement, i) => {
        const points = statementPoints(task, i, choices[i])
        // Exam colours: green = answered correctly, red = answered wrongly,
        // white = skipped ("?", 0 points).
        let card = 'border-gray-300 bg-white'
        if (evaluated) {
          if (points > 0) card = 'border-[#9cc23e] bg-[#b6d957]'
          else if (choices[i] === 'true' || choices[i] === 'false') card = 'border-[#e07272] bg-[#ef8a8a]'
        }

        return (
          <div
            key={i}
            className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 shadow-sm transition-colors ${card}`}
          >
            <span className="w-4 shrink-0 text-[14px] font-bold text-gray-900">
              {String.fromCharCode(65 + i)}
            </span>

            <div className="flex shrink-0 items-center gap-1.5">
              <ChoiceButton label="?" title="Skip" tone="skip" active={choices[i] === 'skip'} disabled={evaluated} onClick={() => pick(i, 'skip')} />
              <ChoiceButton label="✓" title="True" tone="true" active={choices[i] === 'true'} disabled={evaluated} onClick={() => pick(i, 'true')} />
              <ChoiceButton label="✗" title="False" tone="false" active={choices[i] === 'false'} disabled={evaluated} onClick={() => pick(i, 'false')} />
            </div>

            <p className="flex-1 text-[15px] leading-snug text-gray-900">
              {statement.derived && <span title="Answer derived, no official key">⚠️ </span>}
              <Tex text={statement.text} />
            </p>

            {evaluated && (
              <span className="shrink-0 text-[14px] font-bold text-gray-900">
                {points.toFixed(2)} Punkte
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

const TONES: Record<Choice, string> = {
  skip: 'text-gray-700',
  true: 'text-green-700',
  false: 'text-red-700',
}

const ACTIVE_TONES: Record<Choice, string> = {
  skip: 'bg-amber-200 text-gray-900',
  true: 'bg-[#9cc23e] text-white',
  false: 'bg-[#e07272] text-white',
}

type ChoiceButtonProps = {
  label: string
  title: string
  tone: Choice
  active: boolean
  disabled: boolean
  onClick: () => void
}

function ChoiceButton({ label, title, tone, active, disabled, onClick }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-800 text-[13px] font-bold transition-transform ${
        active ? ACTIVE_TONES[tone] : `bg-white ${TONES[tone]}`
      } ${disabled ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
    >
      {label}
    </button>
  )
}
