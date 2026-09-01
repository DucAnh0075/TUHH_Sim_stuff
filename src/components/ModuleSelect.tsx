export type ModuleId = 'embedded' | 'graph'

type Props = {
  onSelect: (id: ModuleId) => void
}

const MODULES: { id: ModuleId; title: string; subtitle: string }[] = [
  { id: 'embedded', title: 'Embedded Systems', subtitle: 'Klausurtrainer · 5 Semester + Mixed Exam' },
  { id: 'graph', title: 'Graphentheorie', subtitle: 'Übungsquiz · gemischte Fragen' },
]

/** Landing screen: pick the module to practise. */
export function ModuleSelect({ onSelect }: Props) {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-[32px] font-bold text-gray-900 dark:text-gray-100">TUHH Exam Simulation</h1>
      <p className="mt-2 mb-8 text-[15px] text-gray-600 dark:text-gray-400">Wähle ein Modul.</p>

      <div className="flex flex-col gap-3">
        {MODULES.map((module) => (
          <button
            key={module.id}
            type="button"
            onClick={() => onSelect(module.id)}
            className="cursor-pointer rounded-lg border-2 border-gray-300 bg-white px-5 py-4 text-left shadow-sm transition-colors hover:border-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-500"
          >
            <span className="text-[19px] font-bold text-gray-900 dark:text-gray-100">{module.title}</span>
            <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">{module.subtitle}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
