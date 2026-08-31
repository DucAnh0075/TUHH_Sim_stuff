import type { ChoiceTask as ChoiceTaskType } from '../../types'
import { Figure } from '../Figure'
import { Tex } from '../Tex'

type Props = {
  task: ChoiceTaskType
  picked: number | null
  evaluated: boolean
  onChange: (picked: number) => void
}

/**
 * Single choice A-F, all or nothing: C/E Net (flow relation strings) and
 * Real-Time Calculus (arrival curve figures).
 */
export function ChoiceTask({ task, picked, evaluated, onChange }: Props) {
  const imageOptions = task.options.some((option) => option.figure)

  // Scanned pages: show the printed option block and pick the letter below it.
  if (task.optionsFigure) {
    return (
      <div className="flex flex-col gap-4">
        <Figure id={task.optionsFigure} className="mx-auto block border border-gray-200" />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[14px] font-bold text-gray-900">Antwort:</span>
          {task.options.map((_, i) => {
            const isPicked = picked === i
            const isCorrect = task.correct === i
            let tone = 'border-gray-400 bg-white text-gray-800 hover:border-gray-700'
            if (isPicked) tone = 'border-gray-800 bg-gray-800 text-white'
            if (evaluated) {
              if (isCorrect) tone = 'border-[#9cc23e] bg-[#b6d957] text-gray-900'
              else if (isPicked) tone = 'border-[#e07272] bg-[#ef8a8a] text-gray-900'
            }
            return (
              <button
                key={i}
                type="button"
                disabled={evaluated}
                onClick={() => onChange(i)}
                className={`h-9 w-9 rounded-full border-2 text-[14px] font-bold transition-colors ${tone} ${
                  evaluated ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                {String.fromCharCode(65 + i)}
              </button>
            )
          })}
          {evaluated && picked === task.correct && (
            <span className="text-[14px] font-bold text-gray-900">{task.points} Punkte</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={imageOptions ? 'grid gap-4 md:grid-cols-2' : 'flex flex-col gap-3'}>
      {task.options.map((option, i) => {
        const isPicked = picked === i
        const isCorrect = task.correct === i
        // The report highlights only the picked option: green when right, red when wrong.
        let card = 'border-gray-300 bg-white'
        if (evaluated) {
          if (isPicked && isCorrect) card = 'border-[#9cc23e] bg-[#b6d957]'
          else if (isPicked) card = 'border-[#e07272] bg-[#ef8a8a]'
          else if (isCorrect) card = 'border-[#9cc23e] bg-[#eaf5cf]'
        }

        return (
          <button
            key={i}
            type="button"
            disabled={evaluated}
            onClick={() => onChange(i)}
            className={`flex w-full items-center gap-4 rounded-lg border-2 px-4 py-3.5 text-left shadow-sm transition-colors ${card} ${
              evaluated ? 'cursor-default' : 'cursor-pointer hover:border-gray-500'
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-gray-800 text-[13px] font-bold ${
                isPicked ? 'bg-gray-800 text-white' : 'text-gray-800'
              }`}
            >
              {String.fromCharCode(65 + i)}
            </span>

            <span className="flex-1">
              {option.text && (
                <span className="block font-mono text-[12px] leading-snug break-all text-gray-900">
                  {option.text}
                </span>
              )}
              {option.figure && <Figure id={option.figure} className="mx-auto block" />}
            </span>

            {evaluated && isPicked && isCorrect && (
              <span className="shrink-0 text-[14px] font-bold text-gray-900">{task.points} Punkte</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/** Small helper so the prompt of the C/E Net task can carry KaTeX. */
export function ChoiceHint({ text }: { text: string }) {
  return (
    <p className="mb-4 text-[14px] leading-snug text-gray-700">
      <Tex text={text} />
    </p>
  )
}
