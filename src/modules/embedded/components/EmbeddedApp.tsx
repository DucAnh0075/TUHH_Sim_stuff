import { useState } from 'react'
import { useMouseNav } from '../../../lib/mouseNav'
import { ExamApp } from './ExamApp'
import { EmbeddedSelect, type EmbeddedView } from './EmbeddedSelect'
import { QuizApp } from './QuizApp'

type Props = {
  onLeave: () => void
}

/** Root of the Embedded module: the landing page, then either the MC pool or the exam trainer. */
export function EmbeddedApp({ onLeave }: Props) {
  const [view, setView] = useState<EmbeddedView | null>(null)
  const [lastView, setLastView] = useState<EmbeddedView | null>(null)

  const selectView = (v: EmbeddedView) => {
    setView(v)
    setLastView(v)
  }

  useMouseNav(
    view !== null ? () => setView(null) : onLeave,
    view === null && lastView !== null ? () => setView(lastView) : null,
  )

  if (view === null) return <EmbeddedSelect onSelect={selectView} />

  if (view === 'mc') {
    return <QuizApp onLeave={() => setView(null)} />
  }

  return <ExamApp onLeave={() => setView(null)} />
}
