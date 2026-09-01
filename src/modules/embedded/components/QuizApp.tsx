import { useState } from 'react'
import { MC_PROBLEMS } from '../data'
import { shuffle } from '../lib/shuffle'
import type { Answer } from '../types'
import { emptyAnswer, isComplete, scoreTask } from '../types'
import { TaskView } from './TaskView'

type Props = {
  onLeave: () => void
}

export function QuizApp({ onLeave }: Props) {
  const [tasks] = useState(() => shuffle(MC_PROBLEMS))
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>(() => tasks.map(emptyAnswer))
  const [confirmed, setConfirmed] = useState<boolean[]>(() => tasks.map(() => false))
  const [finished, setFinished] = useState(false)

  const totalMax = tasks.reduce((sum, t) => sum + t.points, 0)
  const scores = tasks.map((task, i) => (confirmed[i] ? scoreTask(task, answers[i]) : 0))
  const totalScored = scores.reduce((sum, s) => sum + s, 0)

  const setAnswer = (answer: Answer) => {
    const updated = [...answers]
    updated[index] = answer
    setAnswers(updated)
  }

  const confirm = () => {
    const updated = [...confirmed]
    updated[index] = true
    setConfirmed(updated)
  }

  const back = () => {
    if (index > 0) setIndex(index - 1)
  }

  const next = () => {
    if (index + 1 >= tasks.length) setFinished(true)
    else setIndex(index + 1)
  }

  const restart = () => {
    setIndex(0)
    setAnswers(tasks.map(emptyAnswer))
    setConfirmed(tasks.map(() => false))
    setFinished(false)
  }

  if (finished) {
    const pct = totalMax === 0 ? 0 : Math.round((totalScored / totalMax) * 100)
    return (
      <Shell>
        <div className="rounded-lg border-2 border-gray-300 bg-white px-8 py-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-[26px] font-bold text-gray-900 dark:text-gray-100">Ergebnis</h2>
          <p className="mt-4 text-5xl font-extrabold text-gray-900 dark:text-gray-100">
            {totalScored.toFixed(2)}
            <span className="text-2xl font-semibold text-gray-400 dark:text-gray-500"> / {totalMax.toFixed(2)}</span>
          </p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{pct}% der erreichbaren Punkte</p>

          <ul className="mx-auto mt-8 flex max-w-md flex-col gap-2 text-left">
            {tasks.map((task, i) => (
              <li
                key={task.id}
                className="flex items-center justify-between gap-4 rounded border border-gray-200 px-3 py-2 text-[14px] dark:border-gray-700"
              >
                <span className="text-gray-800 dark:text-gray-200">
                  {task.kind === 'multi' ? 'Multiple Choice: ' : 'Lückentext: '}
                  {task.title}
                </span>
                <span className="shrink-0 font-bold text-gray-900 dark:text-gray-100">
                  {scores[i].toFixed(2)} / {task.points}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setFinished(false)}
              className="rounded-lg border-2 border-gray-300 px-6 py-2.5 font-semibold text-gray-700 transition-colors hover:border-gray-500 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-gray-100"
            >
              Zurück
            </button>
            <button
              type="button"
              onClick={restart}
              className="rounded-lg bg-gray-900 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Neu starten
            </button>
          </div>
        </div>
      </Shell>
    )
  }

  const task = tasks[index]
  const answer = answers[index]
  const evaluated = confirmed[index]
  const isLast = index + 1 >= tasks.length

  return (
    <Shell>
      <div className="mb-4">
        <button
          type="button"
          onClick={onLeave}
          className="cursor-pointer text-[12px] text-gray-500 underline underline-offset-2 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ← Zur Auswahl
        </button>
      </div>

      <div className="mb-6 flex items-center justify-between text-[13px] text-gray-500 dark:text-gray-400">
        <span>
          Aufgabe {index + 1} von {tasks.length}
        </span>
        <span>Bisher: {totalScored.toFixed(2)} Punkte</span>
      </div>

      <TaskView
        task={task}
        answer={answer}
        evaluated={evaluated}
        onChange={setAnswer}
      />

      <div className="mt-8 flex justify-between gap-3">
        <button
          type="button"
          disabled={index === 0}
          onClick={back}
          className="rounded-lg border-2 border-gray-300 px-6 py-2.5 font-semibold text-gray-700 transition-colors hover:border-gray-500 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:text-gray-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-gray-100"
        >
          Zurück
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            disabled={evaluated || !isComplete(answer)}
            onClick={confirm}
            className={
              evaluated
                ? 'rounded-lg border-2 border-gray-300 px-6 py-2.5 font-semibold text-gray-400 dark:border-gray-700 dark:text-gray-500'
                : 'rounded-lg bg-gray-900 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-gray-700 dark:hover:bg-gray-600'
            }
          >
            {evaluated ? 'Bestätigt' : 'Bestätigen'}
          </button>

          <button
            type="button"
            onClick={next}
            className={
              evaluated
                ? 'rounded-lg bg-gray-900 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600'
                : 'rounded-lg border-2 border-gray-300 px-6 py-2.5 font-semibold text-gray-700 transition-colors hover:border-gray-500 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-gray-100'
            }
          >
            {isLast ? 'Ergebnis anzeigen' : 'Weiter'}
          </button>
        </div>
      </div>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10">{children}</div>
}
