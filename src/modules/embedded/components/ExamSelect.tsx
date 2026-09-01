import { EXAMS } from '../data'
import { loadProgress } from '../lib/storage'
import type { ExamId } from '../types'

type Props = {
  onStart: (id: ExamId | 'mixed') => void
  onLeave: () => void
}

/** Start screen: pick an exam (sorted by semester) or the mixed one. */
export function ExamSelect({ onStart, onLeave }: Props) {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <button
        type="button"
        onClick={onLeave}
        className="mb-6 cursor-pointer text-[13px] text-gray-500 underline underline-offset-2 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
      >
        ← Zurück
      </button>
      <h1 className="mb-8 text-[32px] font-bold text-gray-900 dark:text-gray-100">Klausuren</h1>

      <div className="flex flex-col gap-3">
        {EXAMS.map((exam) => {
          const progress = loadProgress(exam.id)
          const doneCount = progress?.done.filter(Boolean).length ?? 0

          return (
            <button
              key={exam.id}
              type="button"
              onClick={() => onStart(exam.id as ExamId)}
              className="cursor-pointer rounded-lg border-2 border-gray-300 bg-white px-5 py-4 text-left shadow-sm transition-colors hover:border-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-500"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[19px] font-bold text-gray-900 dark:text-gray-100">{exam.term}</span>
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

        <button
          type="button"
          onClick={() => onStart('mixed')}
          className="cursor-pointer rounded-lg border-2 border-gray-800 bg-gray-900 px-5 py-4 text-left shadow-sm transition-colors hover:bg-gray-700 dark:border-gray-600"
        >
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-[19px] font-bold text-white">Mixed Exam</span>
            <span className="shrink-0 text-[13px] font-semibold text-gray-300">zufällig zusammengestellt</span>
          </div>
          <p className="mt-1 text-[13px] leading-snug text-gray-300">
            Eine vollständige Klausur, bei der jede Aufgabe aus einem zufälligen Semester gezogen wird.
          </p>
        </button>
      </div>
    </div>
  )
}
