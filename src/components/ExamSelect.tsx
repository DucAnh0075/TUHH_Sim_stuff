import { EXAMS } from '../data'
import { loadProgress } from '../lib/storage'
import type { ExamId } from '../types'

type Props = {
  onStart: (id: ExamId | 'mixed') => void
}

/** Start screen: pick an exam (sorted by semester) or the mixed one. */
export function ExamSelect({ onStart }: Props) {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-[32px] font-bold text-gray-900">Embedded Systems</h1>
      <p className="mt-2 mb-8 text-[15px] text-gray-600">
        Wähle eine Klausur. Alle Aufgaben stammen wörtlich aus den Auswertungsberichten von
        Prof. Dr. Heiko Falk.
      </p>

      <div className="flex flex-col gap-3">
        {EXAMS.map((exam) => {
          const progress = loadProgress(exam.id)
          const doneCount = progress?.done.filter(Boolean).length ?? 0

          return (
            <button
              key={exam.id}
              type="button"
              onClick={() => onStart(exam.id as ExamId)}
              className="cursor-pointer rounded-lg border-2 border-gray-300 bg-white px-5 py-4 text-left shadow-sm transition-colors hover:border-gray-500"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[19px] font-bold text-gray-900">{exam.term}</span>
                <span className="shrink-0 text-[13px] font-semibold text-gray-500">
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
          className="cursor-pointer rounded-lg border-2 border-gray-800 bg-gray-900 px-5 py-4 text-left shadow-sm transition-colors hover:bg-gray-700"
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
