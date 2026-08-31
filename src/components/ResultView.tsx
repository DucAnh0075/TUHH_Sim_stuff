import type { Answer, Exam } from '../types'
import { gradeFor, scoreTask } from '../types'
import { formatPoints } from '../lib/format'

type Props = {
  exam: Exam
  answers: Answer[]
  confirmed: boolean[]
  onBack: () => void
  onRestart: () => void
  onLeave: () => void
}

/** Rebuild of page 1 of the report: overview table, conversion table, grade. */
export function ResultView({ exam, answers, confirmed, onBack, onRestart, onLeave }: Props) {
  const scores = exam.tasks.map((task, i) => (confirmed[i] ? scoreTask(task, answers[i]) : 0))
  const total = scores.reduce((sum, s) => sum + s, 0)
  const grade = gradeFor(exam, total)
  const worst = exam.grades[exam.grades.length - 1]

  return (
    <div className="mx-auto w-full max-w-4xl px-8 py-10">
      <h1 className="text-[30px] font-bold text-gray-900">Embedded Systems</h1>
      <h2 className="mt-1 text-[20px] font-bold text-gray-900">{exam.term}</h2>
      <p className="mt-1 text-[15px] font-bold text-gray-700">Prof. Dr. Heiko Falk</p>

      <div className="mt-8 grid gap-10 md:grid-cols-2">
        <div>
          <h3 className="mb-2 text-[17px] font-bold text-gray-900">Overview</h3>
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="border border-gray-800 px-2 py-1 text-left font-bold">Exercise</th>
                <th className="border border-gray-800 px-2 py-1 text-right font-bold">Points</th>
                <th className="border border-gray-800 px-2 py-1 text-right font-bold">Result</th>
              </tr>
            </thead>
            <tbody>
              {exam.tasks.map((task, i) => (
                <tr key={task.id}>
                  <td className="border border-gray-800 px-2 py-1">{task.title}</td>
                  <td className="border border-gray-800 px-2 py-1 text-right">{task.points}</td>
                  <td className="border border-gray-800 px-2 py-1 text-right">{scores[i].toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td className="border border-gray-800 px-2 py-1 font-bold">Sum</td>
                <td className="border border-gray-800 px-2 py-1 text-right font-bold">{exam.totalPoints}</td>
                <td className="border border-gray-800 px-2 py-1 text-right font-bold">{total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h3 className="mb-2 text-[17px] font-bold text-gray-900">Conversion Table</h3>
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                <th className="border border-gray-800 px-2 py-1 text-left font-bold">Grade</th>
                <th className="border border-gray-800 px-2 py-1 text-right font-bold">Percent</th>
                <th className="border border-gray-800 px-2 py-1 text-right font-bold">Points</th>
              </tr>
            </thead>
            <tbody>
              {exam.grades.map((row) => (
                <tr key={row.grade} className={row.grade === grade ? 'bg-[#b6d957] font-bold' : undefined}>
                  <td className="border border-gray-800 px-2 py-1">{row.grade}</td>
                  <td className="border border-gray-800 px-2 py-1 text-right">{row.percent} %</td>
                  <td className="border border-gray-800 px-2 py-1 text-right">{row.points.toFixed(1)}</td>
                </tr>
              ))}
              <tr className={grade === '5.0' ? 'bg-[#ef8a8a] font-bold' : undefined}>
                <td className="border border-gray-800 px-2 py-1">5.0</td>
                <td className="border border-gray-800 px-2 py-1 text-right">&lt; 50 %</td>
                <td className="border border-gray-800 px-2 py-1 text-right">&lt; {worst.points.toFixed(1)}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-8 mb-2 text-[17px] font-bold text-gray-900">Result</h3>
          <p className="text-[14px] leading-relaxed text-gray-900">
            You obtained {formatPoints(total)} points. Therefore, you received the grade {grade}. This
            result is not binding. Please check for the grade that has been entered into TUNE.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer rounded-lg border-2 border-gray-300 px-6 py-2.5 font-semibold text-gray-700 transition-colors hover:border-gray-500 hover:text-gray-900"
        >
          Zurück zur Klausur
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="cursor-pointer rounded-lg border-2 border-gray-300 px-6 py-2.5 font-semibold text-gray-700 transition-colors hover:border-gray-500 hover:text-gray-900"
        >
          Neu starten
        </button>
        <button
          type="button"
          onClick={onLeave}
          className="cursor-pointer rounded-lg bg-gray-900 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-gray-700"
        >
          Andere Klausur
        </button>
      </div>
    </div>
  )
}
