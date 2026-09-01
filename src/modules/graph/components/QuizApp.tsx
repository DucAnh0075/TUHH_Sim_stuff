import { useState } from 'react'
import { TASKS } from '../data/questions'
import { shuffleTasks } from '../lib/shuffle'
import type { Answer, Choice } from '../types'
import { emptyAnswer, isComplete, maxPoints, scoreTask } from '../types'
import { MultiTask } from './MultiTask'
import { SingleTask } from './SingleTask'
import { Tex } from './Tex'

export function QuizApp() {
  const [tasks, setTasks] = useState(() => shuffleTasks(TASKS))
  const [index, setIndex] = useState(0)
  /** Answers of every task, so that they survive going back and forth. */
  const [answers, setAnswers] = useState<Answer[]>(() => tasks.map(emptyAnswer))
  /** Which tasks have been confirmed, i.e. are evaluated and locked. */
  const [confirmed, setConfirmed] = useState<boolean[]>(() => tasks.map(() => false))
  const [finished, setFinished] = useState(false)

  const totalMax = tasks.reduce((sum, t) => sum + maxPoints(t), 0)
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
    const shuffled = shuffleTasks(TASKS)
    setTasks(shuffled)
    setIndex(0)
    setAnswers(shuffled.map(emptyAnswer))
    setConfirmed(shuffled.map(() => false))
    setFinished(false)
  }

  if (finished) {
    const pct = totalMax === 0 ? 0 : Math.round((totalScored / totalMax) * 100)
    return (
      <Shell>
        <div className="rounded-lg border-2 border-gray-300 bg-white px-8 py-10 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-[26px] font-bold text-gray-900 dark:text-gray-100">Result</h2>
          <p className="mt-4 text-5xl font-extrabold text-gray-900 dark:text-gray-100">
            {totalScored.toFixed(2)}
            <span className="text-2xl font-semibold text-gray-400 dark:text-gray-500"> / {totalMax.toFixed(2)}</span>
          </p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{pct}% of the achievable points</p>

          <ul className="mx-auto mt-8 flex max-w-md flex-col gap-2 text-left">
            {tasks.map((task, i) => (
              <li
                key={task.id}
                className="flex items-center justify-between gap-4 rounded border border-gray-200 px-3 py-2 text-[14px] dark:border-gray-700"
              >
                <span className="text-gray-800 dark:text-gray-200">
                  <Tex text={task.title} />
                </span>
                <span className="shrink-0 font-bold text-gray-900 dark:text-gray-100">
                  {scores[i].toFixed(2)} / {maxPoints(task)}
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
              Back
            </button>
            <button
              type="button"
              onClick={restart}
              className="rounded-lg bg-gray-900 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Restart
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
      <div className="mb-4 flex items-center justify-between text-[13px] text-gray-500 dark:text-gray-400">
        <span>
          Task {index + 1} of {tasks.length}
        </span>
        <span>So far: {totalScored.toFixed(2)} points</span>
      </div>

      {task.kind === 'single' ? (
        <SingleTask
          task={task}
          picked={answer.kind === 'single' ? answer.picked : null}
          evaluated={evaluated}
          onChange={(picked) => setAnswer({ kind: 'single', picked })}
        />
      ) : (
        <MultiTask
          task={task}
          choices={answer.kind === 'multi' ? answer.choices : []}
          evaluated={evaluated}
          onChange={(choices: (Choice | null)[]) => setAnswer({ kind: 'multi', choices })}
        />
      )}

      <div className="mt-8 flex justify-between gap-3">
        <button
          type="button"
          disabled={index === 0}
          onClick={back}
          className="rounded-lg border-2 border-gray-300 px-6 py-2.5 font-semibold text-gray-700 transition-colors hover:border-gray-500 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:text-gray-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-gray-100"
        >
          Back
        </button>

        <div className="flex gap-3">
          {/* Confirm reveals the solution. Next also works without it - the task then
              stays unconfirmed and scores 0 until you come back and confirm it. */}
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
            {evaluated ? 'Confirmed' : 'Confirm'}
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
            {isLast ? 'Show result' : 'Next'}
          </button>
        </div>
      </div>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10">{children}</div>
}
