import { useState } from 'react'
import { MC_PROBLEMS } from '../data'
import { GraphExamApp } from './exam/GraphExamApp'
import { GraphSelect, type GraphView } from './GraphSelect'
import { QuizApp } from './QuizApp'

/** Root of the Graph module: the landing page, then either the MC pool or the exam trainer. */
export function GraphApp() {
  const [view, setView] = useState<GraphView | null>(null)

  if (view === null) return <GraphSelect onSelect={setView} />

  if (view === 'mc') {
    return (
      <QuizApp
        tasks={MC_PROBLEMS}
        title="Multiple Choice Problems"
        shuffle
        onLeave={() => setView(null)}
      />
    )
  }

  return <GraphExamApp onLeave={() => setView(null)} />
}
