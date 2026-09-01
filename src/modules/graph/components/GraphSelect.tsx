import type { Task } from '../types'
import { MC_PROBLEMS, availableExams, examTasks } from '../data'

export type Selection = { title: string; tasks: Task[]; shuffle: boolean }

type Props = {
  onSelect: (selection: Selection) => void
}

/** Graph module landing: pick the practice pool or one of the exams. */
export function GraphSelect({ onSelect }: Props) {
  const exams = availableExams()

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-[32px] font-bold text-gray-900 dark:text-gray-100">Graphentheorie</h1>

      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => onSelect({ title: 'Multiple Choice Problems', tasks: MC_PROBLEMS, shuffle: true })}
          className="cursor-pointer rounded-lg border-2 border-gray-300 bg-white px-5 py-4 text-left shadow-sm transition-colors hover:border-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-500"
        >
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-[19px] font-bold text-gray-900 dark:text-gray-100">Multiple Choice Problems</span>
            <span className="shrink-0 text-[13px] font-semibold text-gray-500 dark:text-gray-400">
              {MC_PROBLEMS.length} Fragen · gemischt
            </span>
          </div>
        </button>
      </div>

      {exams.length > 0 && (
        <>
          <h2 className="mt-8 mb-3 text-[15px] font-semibold text-gray-500 dark:text-gray-400">Klausuren</h2>
          <div className="flex flex-col gap-3">
            {exams.map((exam) => {
              const tasks = examTasks(exam.id)
              return (
                <button
                  key={exam.id}
                  type="button"
                  onClick={() => onSelect({ title: exam.title, tasks, shuffle: false })}
                  className="cursor-pointer rounded-lg border-2 border-gray-300 bg-white px-5 py-4 text-left shadow-sm transition-colors hover:border-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-500"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[19px] font-bold text-gray-900 dark:text-gray-100">{exam.title}</span>
                    <span className="shrink-0 text-[13px] font-semibold text-gray-500 dark:text-gray-400">
                      {tasks.length} Aufgaben
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
