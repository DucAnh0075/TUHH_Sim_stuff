import type { SingleTask as SingleTaskType } from '../types'
import { maxPoints, scoreTask } from '../types'
import { PromptBox } from './PromptBox'
import { TaskHeader } from './TaskHeader'
import { Tex } from './Tex'
import { VipsNotice } from './VipsNotice'

type Props = {
  task: SingleTaskType
  /** Index of the picked option, `null` = not answered yet. Owned by QuizApp. */
  picked: number | null
  /** true once "Confirm" was pressed: reveal the result and lock the options. */
  evaluated: boolean
  onChange: (picked: number) => void
}

/** Exam format with radio buttons: exactly one option is correct, a wrong pick costs nothing. */
export function SingleTask({ task, picked, evaluated, onChange }: Props) {
  const total = scoreTask(task, { kind: 'single', picked })

  return (
    <div>
      <TaskHeader
        title={task.title}
        scored={evaluated ? total : null}
        max={maxPoints(task)}
        vips={task.source === 'vips'}
      />

      {task.source === 'vips' && <VipsNotice />}

      <PromptBox prompt={task.prompt} extra={task.promptExtra} />

      <p className="mt-4 mb-4 text-[14px] leading-snug text-gray-700 italic">
        (Exactly one answer is correct. Correct answer: {task.points} points, wrong answer: 0 points.)
      </p>

      <div className="flex flex-col gap-3">
        {task.options.map((option, i) => {
          // Exam colour scheme: after evaluating, the correct option turns green and a
          // wrong pick turns red. Untouched options stay white.
          let card = 'border-gray-300 bg-white'
          if (evaluated) {
            if (option.correct) card = 'border-[#9cc23e] bg-[#b6d957]'
            else if (i === picked) card = 'border-[#e07272] bg-[#ef8a8a]'
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

              <span className="flex-1 text-[15px] leading-snug text-gray-900">
                <Tex text={option.text} />
              </span>

              {evaluated && i === picked && (
                <span className="shrink-0 text-[14px] font-bold text-gray-900">
                  {total.toFixed(2)} points
                </span>
              )}
            </button>
          )
        })}
      </div>

      {evaluated && (
        <p className="mt-4 text-[14px] font-bold text-gray-900">Total: {total.toFixed(2)} points</p>
      )}
    </div>
  )
}
