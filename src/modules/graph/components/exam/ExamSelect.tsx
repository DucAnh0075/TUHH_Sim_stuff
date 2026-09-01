import { availableExams } from '../../data'
import { loadProgress } from '../../lib/storage'
import { validateExam } from '../../types'

type Props = {
  onStart: (id: string) => void
  onLeave: () => void
}

if (import.meta.env.DEV) {
  for (const exam of availableExams()) {
    for (const problem of validateExam(exam)) console.warn(problem)
  }
}

/** The "Klausuren" page: pick one of the transcribed GTOP exams. */
export function ExamSelect({ onStart, onLeave }: Props) {
  const exams = availableExams()

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <button
        type="button"
        onClick={onLeave}
        className="cursor-pointer text-[12px] text-gray-500 underline underline-offset-2 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
      >
        ← Zurück
      </button>
      <h1 className="mt-2 mb-8 text-[32px] font-bold text-gray-900 dark:text-gray-100">Klausuren</h1>

      {exams.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Noch keine Klausuren erfasst.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {exams.map((exam) => {
            const progress = loadProgress(exam.id, exam)
            const doneCount = progress?.done.filter(Boolean).length ?? 0

            return (
              <button
                key={exam.id}
                type="button"
                onClick={() => onStart(exam.id)}
                className="cursor-pointer rounded-lg border-2 border-gray-300 bg-white px-5 py-4 text-left shadow-sm transition-colors hover:border-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-500"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[19px] font-bold text-gray-900 dark:text-gray-100">{exam.title}</span>
                  <span className="shrink-0 text-[13px] font-semibold text-gray-500 dark:text-gray-400">
                    {exam.tasks.length} Aufgaben · {exam.totalPoints} Punkte
                  </span>
                </div>
                {doneCount > 0 && (
                  <p className="mt-1 text-[13px] text-[#5f9c1e]">
                    Fortschritt gespeichert: {doneCount} von {exam.tasks.length} Aufgaben erledigt
                  </p>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
