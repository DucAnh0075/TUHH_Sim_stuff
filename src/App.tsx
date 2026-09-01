import { useState } from 'react'
import { ModuleSelect, type ModuleId } from './components/ModuleSelect'
import { ThemeToggle } from './components/ThemeToggle'
import { ExamApp } from './modules/embedded/components/ExamApp'
import { QuizApp } from './modules/graph/components/QuizApp'

function App() {
  const [module, setModule] = useState<ModuleId | null>(null)

  return (
    <>
      <ThemeToggle />
      {module && (
        <button
          type="button"
          onClick={() => setModule(null)}
          className="fixed top-3 right-14 z-50 cursor-pointer rounded-full px-3 py-1.5 text-[13px] font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        >
          ← Module
        </button>
      )}

      {module === null && <ModuleSelect onSelect={setModule} />}
      {module === 'embedded' && <ExamApp />}
      {module === 'graph' && <QuizApp />}
    </>
  )
}

export default App
