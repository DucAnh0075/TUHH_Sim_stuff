import type { Answer, Task } from '../types'
import { isSelfGraded, scoreTask } from '../types'
import { Figure } from './Figure'
import { PromptBox } from './PromptBox'
import { TaskHeader } from './TaskHeader'
import { ClozeTask } from './tasks/ClozeTask'
import { ChoiceTask } from './tasks/ChoiceTask'
import { FieldsTask } from './tasks/FieldsTask'
import { GridTask } from './tasks/GridTask'
import { MultiTask } from './tasks/MultiTask'

type Props = {
  task: Task
  answer: Answer
  evaluated: boolean
  onChange: (answer: Answer) => void
}

/** One exercise page of the report: headline, blue box, note, figure, content. */
export function TaskView({ task, answer, evaluated, onChange }: Props) {
  const scored = evaluated && !(isSelfGraded(task) && answer.kind === 'grid' && answer.selfPoints === null)
    ? scoreTask(task, answer)
    : null

  return (
    <div>
      <TaskHeader title={task.title} scored={scored} max={task.points} />

      <PromptBox prompt={task.prompt} extra={task.promptExtra} />

      {task.note && <p className="mt-4 text-[14px] leading-snug text-gray-700">{task.note}</p>}

      {task.figure && (
        <div className="my-5 flex justify-center">
          <Figure id={task.figure} />
        </div>
      )}

      <div className="mt-5">
        <Body task={task} answer={answer} evaluated={evaluated} onChange={onChange} />
      </div>

      {evaluated && scored !== null && (
        <p className="mt-4 text-[14px] font-bold text-gray-900">Total: {scored.toFixed(2)} Punkte</p>
      )}
    </div>
  )
}

function Body({ task, answer, evaluated, onChange }: Props) {
  switch (task.kind) {
    case 'multi':
      return (
        <MultiTask
          task={task}
          choices={answer.kind === 'multi' ? answer.choices : []}
          evaluated={evaluated}
          onChange={(choices) => onChange({ kind: 'multi', choices })}
        />
      )
    case 'cloze':
      return (
        <ClozeTask
          task={task}
          picks={answer.kind === 'cloze' ? answer.picks : []}
          evaluated={evaluated}
          onChange={(picks) => onChange({ kind: 'cloze', picks })}
        />
      )
    case 'choice':
      return (
        <ChoiceTask
          task={task}
          picked={answer.kind === 'choice' ? answer.picked : null}
          evaluated={evaluated}
          onChange={(picked) => onChange({ kind: 'choice', picked })}
        />
      )
    case 'fields':
      return (
        <FieldsTask
          task={task}
          values={answer.kind === 'fields' ? answer.values : []}
          evaluated={evaluated}
          onChange={(values) => onChange({ kind: 'fields', values })}
        />
      )
    case 'grid':
      return (
        <GridTask
          task={task}
          cells={answer.kind === 'grid' ? answer.cells : []}
          selfPoints={answer.kind === 'grid' ? answer.selfPoints : null}
          evaluated={evaluated}
          onChange={(cells, selfPoints) => onChange({ kind: 'grid', cells, selfPoints })}
        />
      )
  }
}
