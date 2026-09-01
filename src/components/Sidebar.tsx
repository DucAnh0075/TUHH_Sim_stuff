import type { Answer, Exam } from '../types'
import { isStarted, scoreTask } from '../types'
import { formatPoints } from '../lib/format'

type Props = {
  exam: Exam
  index: number
  answers: Answer[]
  confirmed: boolean[]
  done: boolean[]
  totalScored: number
  onSelect: (index: number) => void
  onSelectSubtask: (index: number, subtaskId: string) => void
  onShowResult: () => void
  onLeave: () => void
}

/**
 * The vertical task bar: every exercise of the exam with its state.
 * grey = untouched, blue = started, green = done.
 */
export function Sidebar({
  exam,
  index,
  answers,
  confirmed,
  done,
  totalScored,
  onSelect,
  onSelectSubtask,
  onShowResult,
  onLeave,
}: Props) {
  const doneCount = done.filter(Boolean).length
  const progress = Math.round((doneCount / exam.tasks.length) * 100)

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
      <div className="border-b border-gray-300 px-4 py-4 dark:border-gray-700">
        <button
          type="button"
          onClick={onLeave}
          className="cursor-pointer text-[12px] text-gray-500 underline underline-offset-2 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ← Klausur wechseln
        </button>
        <h1 className="mt-2 text-[16px] leading-tight font-bold text-gray-900 dark:text-gray-100">{exam.term}</h1>
        <p className="mt-1 text-[13px] text-gray-600 dark:text-gray-400">
          <strong className="text-gray-900 dark:text-gray-100">{formatPoints(totalScored)}</strong> / {exam.totalPoints} Punkte
        </p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
          <div className="h-full bg-[#9cc23e] transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-1 text-[12px] text-gray-500 dark:text-gray-400">
          {doneCount} von {exam.tasks.length} erledigt
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2">
        <ol className="flex flex-col gap-1">
          {exam.tasks.map((task, i) => {
            const active = i === index
            const isDone = done[i]
            const started = isStarted(answers[i])

            let tone = 'border-transparent bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            if (isDone) tone = 'border-[#9cc23e] bg-[#b6d957] text-gray-900'
            else if (started) tone = 'border-[#7fb8d4] bg-[#dff0f8] text-gray-900'
            if (active) tone += ' ring-2 ring-gray-800 dark:ring-gray-300'

            return (
              <li key={task.id}>
                <button
                  type="button"
                  onClick={() => onSelect(i)}
                  className={`flex w-full cursor-pointer items-start gap-2 rounded border-2 px-2.5 py-2 text-left transition-colors ${tone}`}
                >
                  <span className="w-5 shrink-0 text-[13px] font-bold">{i + 1}.</span>
                  <span className="flex-1 text-[13px] leading-snug font-semibold">{task.title}</span>
                  <span className="shrink-0 text-[12px] font-bold whitespace-nowrap">
                    {confirmed[i] ? `${formatPoints(scoreTask(task, answers[i]))}/${task.points}` : `${task.points} P`}
                  </span>
                </button>

                {task.subtasks && (
                  <ul className="mt-1 mb-1 ml-7 flex flex-col gap-0.5 border-l border-gray-300 pl-2 dark:border-gray-700">
                    {task.subtasks.map((subtask) => (
                      <li key={subtask.id}>
                        <button
                          type="button"
                          onClick={() => onSelectSubtask(i, subtask.id)}
                          className="w-full cursor-pointer rounded px-1.5 py-1 text-left text-[12px] leading-snug text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                        >
                          {subtask.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      <div className="border-t border-gray-300 px-4 py-3 dark:border-gray-700">
        <button
          type="button"
          onClick={onShowResult}
          className="w-full cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Ergebnis anzeigen
        </button>
      </div>
    </aside>
  )
}
