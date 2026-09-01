import { useState } from 'react'
import { ExamApp } from './ExamApp'
import { EmbeddedSelect, type EmbeddedView } from './EmbeddedSelect'
import { QuizApp } from './QuizApp'

/** Root of the Embedded module: the landing page, then either the MC pool or the exam trainer. */
export function EmbeddedApp() {
  const [view, setView] = useState<EmbeddedView | null>(null)

  if (view === null) return <EmbeddedSelect onSelect={setView} />

  if (view === 'mc') {
    return <QuizApp onLeave={() => setView(null)} />
  }

  return <ExamApp onLeave={() => setView(null)} />
}
