import { formatPoints } from '../../lib/format'
import type { ExamAnswer, GraphExam } from '../../types'
import { gradeFor, scoreExamTask } from '../../types'

type Props = {
  exam: GraphExam
  answers: ExamAnswer[]
  confirmed: boolean[]
  onBack: () => void
  onRestart: () => void
  onLeave: () => void
}

/** Rebuild of page 1 of the Auswertungsbericht: Übersicht, Notenschlüssel, Ergebnis. */
export function ExamResultView({ exam, answers, confirmed, onBack, onRestart, onLeave }: Props) {
  const scores = exam.tasks.map((task, i) => (confirmed[i] ? scoreExamTask(task, answers[i]) : 0))
  const total = scores.reduce((sum, s) => sum + s, 0)
  const grade = gradeFor(exam, total)
  const worst = exam.grades[exam.grades.length - 1]

  return (
    <div className="mx-auto w-full max-w-4xl px-8 py-10">
      <h1 className="text-[30px] font-bold text-gray-900 dark:text-gray-100">Graphentheorie</h1>
      <h2 className="mt-1 text-[20px] font-bold text-gray-900 dark:text-gray-100">{exam.title}</h2>

      {exam.note && (
        <p className="mt-3 rounded border-2 border-amber-300 bg-amber-50 px-3 py-2 text-[13px] text-amber-900">
          {exam.note}
        </p>
      )}

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-[17px] font-bold text-gray-900 dark:text-gray-100">Übersicht</h3>
          <table className="w-full border-collapse text-[13px] text-gray-900 dark:text-gray-100">
            <thead>
              <tr>
                <th className="border border-gray-800 px-2 py-1 text-left font-bold dark:border-gray-600">Aufgabe</th>
                <th className="border border-gray-800 px-2 py-1 text-right font-bold dark:border-gray-600">Punkte</th>
                <th className="border border-gray-800 px-2 py-1 text-right font-bold dark:border-gray-600">Ergebnis</th>
              </tr>
            </thead>
            <tbody>
              {exam.tasks.map((task, i) => (
                <tr key={task.id}>
                  <td className="border border-gray-800 px-2 py-1 dark:border-gray-600">{task.title}</td>
                  <td className="border border-gray-800 px-2 py-1 text-right dark:border-gray-600">{task.points}</td>
                  <td className="border border-gray-800 px-2 py-1 text-right dark:border-gray-600">{scores[i].toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td className="border border-gray-800 px-2 py-1 font-bold dark:border-gray-600">Summe</td>
                <td className="border border-gray-800 px-2 py-1 text-right font-bold dark:border-gray-600">{exam.totalPoints}</td>
                <td className="border border-gray-800 px-2 py-1 text-right font-bold dark:border-gray-600">{total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h3 className="mb-2 text-[17px] font-bold text-gray-900 dark:text-gray-100">Notenschlüssel</h3>
          <table className="w-full border-collapse text-[13px] text-gray-900 dark:text-gray-100">
            <thead>
              <tr>
                <th className="border border-gray-800 px-2 py-1 text-left font-bold dark:border-gray-600">Note</th>
                <th className="border border-gray-800 px-2 py-1 text-right font-bold dark:border-gray-600">Prozent</th>
                <th className="border border-gray-800 px-2 py-1 text-right font-bold dark:border-gray-600">Punktzahl</th>
              </tr>
            </thead>
            <tbody>
              {exam.grades.map((row) => (
                <tr key={row.grade} className={row.grade === grade ? 'bg-[#b6d957] font-bold text-gray-900' : undefined}>
                  <td className="border border-gray-800 px-2 py-1 dark:border-gray-600">{row.grade}</td>
                  <td className="border border-gray-800 px-2 py-1 text-right dark:border-gray-600">{row.percent} %</td>
                  <td className="border border-gray-800 px-2 py-1 text-right dark:border-gray-600">{row.points.toFixed(1)}</td>
                </tr>
              ))}
              <tr className={grade === '5.0' ? 'bg-[#ef8a8a] font-bold text-gray-900' : undefined}>
                <td className="border border-gray-800 px-2 py-1 dark:border-gray-600">5.0</td>
                <td className="border border-gray-800 px-2 py-1 text-right dark:border-gray-600">&lt; 50 %</td>
                <td className="border border-gray-800 px-2 py-1 text-right dark:border-gray-600">&lt; {worst.points.toFixed(1)}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-8 mb-2 text-[17px] font-bold text-gray-900 dark:text-gray-100">Ergebnis</h3>
          <p className="text-[14px] leading-relaxed text-gray-900 dark:text-gray-100">
            Sie haben {formatPoints(total)} Punkte erreicht und erhalten die Note {grade}. Dieses Ergebnis ist
            unverbindlich - es ist eine Selbsteinschätzung mit diesem Trainer, keine offizielle Bewertung.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer rounded-lg border-2 border-gray-300 px-6 py-2.5 font-semibold text-gray-700 transition-colors hover:border-gray-500 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-gray-100"
        >
          Zurück zur Klausur
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="cursor-pointer rounded-lg border-2 border-gray-300 px-6 py-2.5 font-semibold text-gray-700 transition-colors hover:border-gray-500 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-gray-100"
        >
          Neu starten
        </button>
        <button
          type="button"
          onClick={onLeave}
          className="cursor-pointer rounded-lg bg-gray-900 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Andere Klausur
        </button>
      </div>
    </div>
  )
}
