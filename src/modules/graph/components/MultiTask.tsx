import type { Choice, MultiTask as MultiTaskType } from '../types'
import { maxPoints, scoreTask, statementPoints } from '../types'
import { ChoiceButton } from './ChoiceButton'
import { PromptBox } from './PromptBox'
import { TaskHeader } from './TaskHeader'
import { Tex } from './Tex'
import { VipsNotice } from './VipsNotice'

type Props = {
  task: MultiTaskType
  /** One entry per statement, `null` = not answered yet. Owned by QuizApp. */
  choices: (Choice | null)[]
  /** true once "Confirm" was pressed: reveal the result and lock the buttons. */
  evaluated: boolean
  onChange: (choices: (Choice | null)[]) => void
}

export function MultiTask({ task, choices, evaluated, onChange }: Props) {
  const perStatement = choices.map((choice, i) => statementPoints(task, i, choice))
  const total = scoreTask(task, { kind: 'multi', choices })

  const pick = (i: number, choice: Choice) => {
    if (evaluated) return
    const updated = [...choices]
    updated[i] = choice
    onChange(updated)
  }

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

      <p className="mt-4 mb-4 text-[14px] leading-snug text-gray-700 italic dark:text-gray-300">
        (Correct answer: 1 point, wrong answer: -1 point, skipped (?): 0 points. The subtask cannot score
        less than 0 points.)
      </p>

      <div className="flex flex-col gap-3">
        {task.statements.map((statement, i) => {
          const points = perStatement[i]
          // Exam colour scheme: green = answered correctly, red = answered wrongly,
          // white = skipped ("?", 0 points).
          // Text colour rides with the card: dark on the light accents, light on the
          // neutral card in dark mode.
          let card = 'border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'
          if (evaluated) {
            if (points > 0) card = 'border-[#9cc23e] bg-[#b6d957] text-gray-900'
            else if (points < 0) card = 'border-[#e07272] bg-[#ef8a8a] text-gray-900'
          }

          return (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 shadow-sm transition-colors ${card}`}
            >
              <span className="w-4 shrink-0 text-[14px] font-bold">
                {String.fromCharCode(65 + i)}
              </span>

              <div className="flex shrink-0 items-center gap-1.5">
                <ChoiceButton
                  label="?"
                  title="Skip"
                  tone="skip"
                  active={choices[i] === 'skip'}
                  disabled={evaluated}
                  onClick={() => pick(i, 'skip')}
                />
                <ChoiceButton
                  label="✓"
                  title="True"
                  tone="true"
                  active={choices[i] === 'true'}
                  disabled={evaluated}
                  onClick={() => pick(i, 'true')}
                />
                <ChoiceButton
                  label="✗"
                  title="False"
                  tone="false"
                  active={choices[i] === 'false'}
                  disabled={evaluated}
                  onClick={() => pick(i, 'false')}
                />
              </div>

              <p className="flex-1 text-[15px] leading-snug">
                <Tex text={statement.text} />
              </p>

              {evaluated && (
                <span className="shrink-0 text-[14px] font-bold">
                  {points.toFixed(2)} points
                </span>
              )}
            </div>
          )
        })}
      </div>

      {evaluated && (
        <p className="mt-4 text-[14px] font-bold text-gray-900 dark:text-gray-100">Total: {total.toFixed(2)} points</p>
      )}
    </div>
  )
}
