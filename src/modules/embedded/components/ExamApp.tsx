import { useEffect, useMemo, useRef, useState } from 'react'
import { EXAMS } from '../data'
import { buildMixedExam } from '../lib/mixed'
import { clearProgress, loadProgress, saveProgress } from '../lib/storage'
import type { Answer, Exam, ExamId } from '../types'
import { emptyAnswer, isComplete, isSelfGraded, scoreTask } from '../types'
import { ExamSelect } from './ExamSelect'
import { ResultView } from './ResultView'
import { Sidebar } from './Sidebar'
import { TaskView } from './TaskView'

type Session = {
  exam: Exam
  index: number
  answers: Answer[]
  confirmed: boolean[]
  done: boolean[]
}

function freshSession(exam: Exam): Session {
  return {
    exam,
    index: 0,
    answers: exam.tasks.map(emptyAnswer),
    confirmed: exam.tasks.map(() => false),
    done: exam.tasks.map(() => false),
  }
}

type Props = {
  onLeave: () => void
}

export function ExamApp({ onLeave }: Props) {
  const [session, setSession] = useState<Session | null>(null)
  const [showResult, setShowResult] = useState(false)
  const main = useRef<HTMLElement>(null)

  const start = (id: ExamId | 'mixed') => {
    const exam = id === 'mixed' ? buildMixedExam() : EXAMS.find((e) => e.id === id)
    if (!exam) return

    const stored = loadProgress(exam.id, exam)
    setSession(
      stored
        ? { exam, index: stored.index, answers: stored.answers, confirmed: stored.confirmed, done: stored.done }
        : freshSession(exam),
    )
    setShowResult(false)
  }

  // Persist on every change; mixed exams are skipped inside saveProgress.
  useEffect(() => {
    if (!session) return
    saveProgress(session.exam.id, {
      index: session.index,
      answers: session.answers,
      confirmed: session.confirmed,
      done: session.done,
    })
  }, [session])

  const totalScored = useMemo(() => {
    if (!session) return 0
    return session.exam.tasks.reduce(
      (sum, task, i) => sum + (session.confirmed[i] ? scoreTask(task, session.answers[i]) : 0),
      0,
    )
  }, [session])

  if (!session) return <ExamSelect onStart={start} onLeave={onLeave} />

  const { exam, index, answers, confirmed, done } = session
  const task = exam.tasks[index]
  const answer = answers[index]
  const evaluated = confirmed[index]

  const update = (patch: Partial<Session>) => setSession({ ...session, ...patch })

  const setAnswer = (next: Answer) => {
    const updated = [...answers]
    updated[index] = next
    update({ answers: updated })
  }

  const confirm = () => {
    const updatedConfirmed = [...confirmed]
    updatedConfirmed[index] = true
    // Auto-graded tasks are done the moment they are confirmed; self-graded ones
    // wait for the points the user assigns in the self-check box.
    const updatedDone = [...done]
    if (!isSelfGraded(task)) updatedDone[index] = true
    update({ confirmed: updatedConfirmed, done: updatedDone })
  }

  const toggleDone = () => {
    const updated = [...done]
    updated[index] = !updated[index]
    update({ done: updated })
  }

  const goTo = (next: number) => {
    update({ index: Math.max(0, Math.min(exam.tasks.length - 1, next)) })
    main.current?.scrollTo({ top: 0 })
  }

  const restart = () => {
    clearProgress(exam.id)
    setSession(freshSession(exam))
    setShowResult(false)
  }

  const leave = () => {
    setSession(null)
    setShowResult(false)
  }

  if (showResult) {
    return (
      <ResultView
        exam={exam}
        answers={answers}
        confirmed={confirmed}
        onBack={() => setShowResult(false)}
        onRestart={restart}
        onLeave={leave}
      />
    )
  }

  const isLast = index + 1 >= exam.tasks.length

  return (
    <div className="flex min-h-screen">
      <Sidebar
        exam={exam}
        index={index}
        answers={answers}
        confirmed={confirmed}
        done={done}
        totalScored={totalScored}
        onSelect={goTo}
        onSelectSubtask={(taskIndex, subtaskId) => {
          if (taskIndex !== index) goTo(taskIndex)
          // The element exists after the task is rendered, hence the next frame.
          requestAnimationFrame(() =>
            document.getElementById(subtaskId)?.scrollIntoView({ block: 'center' }),
          )
        }}
        onShowResult={() => setShowResult(true)}
        onLeave={leave}
      />

      <main ref={main} className="h-screen flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl px-8 py-8">
          <p className="mb-4 text-[13px] text-gray-500 dark:text-gray-400">
            Aufgabe {index + 1} von {exam.tasks.length} · {exam.term}
          </p>

          <TaskView key={task.id} task={task} answer={answer} evaluated={evaluated} onChange={setAnswer} />

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => goTo(index - 1)}
              className="cursor-pointer rounded-lg border-2 border-gray-300 px-6 py-2.5 font-semibold text-gray-700 transition-colors hover:border-gray-500 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-gray-100"
            >
              Zurück
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={toggleDone}
                className={`cursor-pointer rounded-lg border-2 px-4 py-2.5 font-semibold transition-colors ${
                  done[index]
                    ? 'border-[#9cc23e] bg-[#b6d957] text-gray-900'
                    : 'border-gray-300 text-gray-700 hover:border-gray-500 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500'
                }`}
              >
                {done[index] ? '✓ Erledigt' : 'Als erledigt markieren'}
              </button>

              <button
                type="button"
                disabled={evaluated || !isComplete(answer)}
                onClick={confirm}
                className={
                  evaluated
                    ? 'rounded-lg border-2 border-gray-300 px-6 py-2.5 font-semibold text-gray-400 dark:border-gray-700 dark:text-gray-500'
                    : 'cursor-pointer rounded-lg bg-gray-900 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-gray-700 dark:hover:bg-gray-600'
                }
              >
                {evaluated ? 'Confirmed' : 'Confirm'}
              </button>

              <button
                type="button"
                onClick={() => (isLast ? setShowResult(true) : goTo(index + 1))}
                className={
                  evaluated
                    ? 'cursor-pointer rounded-lg bg-gray-900 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600'
                    : 'cursor-pointer rounded-lg border-2 border-gray-300 px-6 py-2.5 font-semibold text-gray-700 transition-colors hover:border-gray-500 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-gray-100'
                }
              >
                {isLast ? 'Ergebnis' : 'Weiter'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
