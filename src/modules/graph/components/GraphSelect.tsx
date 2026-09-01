import { availableExams, MC_PROBLEMS } from '../data'

export type GraphView = 'mc' | 'exams'

type Props = {
  onSelect: (view: GraphView) => void
}

/** Graph module landing: Multiple Choice pool, or the Klausuren sub-page. */
export function GraphSelect({ onSelect }: Props) {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-[32px] font-bold text-gray-900 dark:text-gray-100">Graphentheorie</h1>

      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => onSelect('mc')}
          className="cursor-pointer rounded-lg border-2 border-gray-300 bg-white px-5 py-4 text-left shadow-sm transition-colors hover:border-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-500"
        >
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-[19px] font-bold text-gray-900 dark:text-gray-100">Multiple Choice</span>
            <span className="shrink-0 text-[13px] font-semibold text-gray-500 dark:text-gray-400">
              {MC_PROBLEMS.length} Fragen · gemischt
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelect('exams')}
          className="cursor-pointer rounded-lg border-2 border-gray-300 bg-white px-5 py-4 text-left shadow-sm transition-colors hover:border-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-500"
        >
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-[19px] font-bold text-gray-900 dark:text-gray-100">Klausuren</span>
            <span className="shrink-0 text-[13px] font-semibold text-gray-500 dark:text-gray-400">
              {availableExams().length} Altklausuren
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}
