import { groupParts } from '../../lib/partGroups'
import type { ExamAnswer, ExamTask, PartAnswer } from '../../types'
import { emptyPartAnswer, hasUngradedOpenPart, scoreExamTask } from '../../types'
import { GraphFigure } from '../GraphFigure'
import { PromptBox } from '../PromptBox'
import { TaskHeader } from '../TaskHeader'
import { TexBlock } from '../TexBlock'
import { PartView } from './PartView'

type Props = {
  task: ExamTask
  answer: ExamAnswer
  evaluated: boolean
  onChange: (answer: ExamAnswer) => void
}

/** One exam exercise: headline, blue box, note, figure, then its parts. */
export function ExamTaskView({ task, answer, evaluated, onChange }: Props) {
  const scored = evaluated ? scoreExamTask(task, answer) : null
  const provisional = evaluated && hasUngradedOpenPart(task, answer)

  const setPart = (index: number, next: PartAnswer) => {
    const parts = answer.parts.slice()
    parts[index] = next
    onChange({ parts })
  }

  // Precompute each run's start index into `task.parts`/`answer.parts` (runs are
  // consecutive, so this is a running sum) - done up front, not mutated during render.
  const runs = groupParts(task.parts)
  const runsWithStart: { run: (typeof runs)[number]; startIndex: number }[] = []
  {
    let cursor = 0
    for (const run of runs) {
      runsWithStart.push({ run, startIndex: cursor })
      cursor += run.length
    }
  }

  return (
    <div>
      <TaskHeader title={task.title} scored={scored} max={task.points} unit="Punkte" provisional={provisional} />

      <PromptBox prompt={task.prompt} extra={task.promptExtra} />

      {task.note && <p className="mt-4 text-[14px] leading-snug text-gray-700 dark:text-gray-300">{task.note}</p>}

      {task.display?.map((block, i) => <TexBlock key={i} text={block} />)}

      {task.figure && (
        <div className="my-5 flex justify-center">
          <GraphFigure id={task.figure} />
        </div>
      )}

      <div className="mt-5 flex flex-col gap-4">
        {runsWithStart.map(({ run, startIndex }) => {
          if (run.length === 1 && !run[0].group) {
            const index = startIndex
            return (
              <PartView
                key={run[0].id}
                part={run[0]}
                answer={answer.parts[index] ?? emptyPartAnswer(run[0])}
                evaluated={evaluated}
                onChange={(next) => setPart(index, next)}
              />
            )
          }

          return (
            <div
              key={run[0].id}
              id={run[0].id}
              className="rounded-lg border-2 border-gray-200 px-4 py-3 dark:border-gray-700"
            >
              {run[0].group && (
                <p className="mb-3 text-[14px] font-bold text-gray-900 dark:text-gray-100">{run[0].group}</p>
              )}
              <div className="flex flex-col gap-3">
                {run.map((part, offset) => {
                  const index = startIndex + offset
                  return (
                    <PartView
                      key={part.id}
                      part={part}
                      answer={answer.parts[index] ?? emptyPartAnswer(part)}
                      evaluated={evaluated}
                      onChange={(next) => setPart(index, next)}
                      bare
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {evaluated && scored !== null && (
        <p className="mt-4 text-[14px] font-bold text-gray-900 dark:text-gray-100">Total: {scored.toFixed(2)} Punkte</p>
      )}
    </div>
  )
}
