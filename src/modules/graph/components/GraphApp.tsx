import { useState } from 'react'
import { GraphSelect, type Selection } from './GraphSelect'
import { QuizApp } from './QuizApp'

/** Root of the Graph module: pick a task set, then run the quiz. */
export function GraphApp() {
  const [selection, setSelection] = useState<Selection | null>(null)

  if (!selection) return <GraphSelect onSelect={setSelection} />

  return (
    <QuizApp
      key={selection.title}
      tasks={selection.tasks}
      title={selection.title}
      shuffle={selection.shuffle}
      onLeave={() => setSelection(null)}
    />
  )
}
