import type { SinglePart as SinglePartType } from '../../../types'
import { GraphFigure } from '../../GraphFigure'
import { Tex } from '../../Tex'

type Props = {
  part: SinglePartType
  picked: number | null
  evaluated: boolean
  onChange: (picked: number) => void
}

/** Exactly one option is correct: dual objective, "continues / does not continue", ... */
export function SinglePart({ part, picked, evaluated, onChange }: Props) {
  if (part.variant === 'inline') {
    return (
      <div className="flex flex-wrap gap-2">
        {part.options.map((option, i) => {
          let tone = 'border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
          if (evaluated) {
            if (i === part.correct) tone = 'border-[#9cc23e] bg-[#b6d957] text-gray-900'
            else if (i === picked) tone = 'border-[#e07272] bg-[#ef8a8a] text-gray-900'
          }
          return (
            <button
              key={i}
              type="button"
              disabled={evaluated}
              onClick={() => onChange(i)}
              className={`rounded-full border-2 px-4 py-1.5 text-[14px] font-semibold transition-colors ${tone} ${
                evaluated ? 'cursor-default' : 'cursor-pointer hover:border-gray-500'
              }`}
            >
              <Tex text={option.text} />
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {part.options.map((option, i) => {
        let card = 'border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
        if (evaluated) {
          if (i === part.correct) card = 'border-[#9cc23e] bg-[#b6d957] text-gray-900'
          else if (i === picked) card = 'border-[#e07272] bg-[#ef8a8a] text-gray-900'
        }

        return (
          <button
            key={i}
            type="button"
            disabled={evaluated}
            onClick={() => onChange(i)}
            className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-left shadow-sm transition-colors ${card} ${
              evaluated ? 'cursor-default' : 'cursor-pointer hover:border-gray-500'
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-gray-800 text-[13px] font-bold ${
                picked === i ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              }`}
            >
              {String.fromCharCode(65 + i)}
            </span>
            {option.figure ? (
              <GraphFigure id={option.figure} className="max-h-40" />
            ) : (
              <span className="flex-1 text-[15px] leading-snug">
                <Tex text={option.text} />
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
