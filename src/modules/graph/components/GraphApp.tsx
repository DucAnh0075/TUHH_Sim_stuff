import { useState } from 'react'
import { useMouseNav } from '../../../lib/mouseNav'
import { MC_PROBLEMS } from '../data'
import { GraphExamApp } from './exam/GraphExamApp'
import { GraphSelect, type GraphView } from './GraphSelect'
import { QuizApp } from './QuizApp'

type Props = {
  onLeave: () => void
}

/** Root of the Graph module: the landing page, then either the MC pool or the exam trainer. */
export function GraphApp({ onLeave }: Props) {
  const [view, setView] = useState<GraphView | null>(null)
  const [lastView, setLastView] = useState<GraphView | null>(null)

  const selectView = (v: GraphView) => {
    setView(v)
    setLastView(v)
  }

  useMouseNav(
    view !== null ? () => setView(null) : onLeave,
    view === null && lastView !== null ? () => setView(lastView) : null,
  )

  if (view === null) return <GraphSelect onSelect={selectView} />

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
