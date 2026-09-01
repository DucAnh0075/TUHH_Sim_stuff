import { EXAMS, MC_PROBLEMS } from '../data'

export type EmbeddedView = 'mc' | 'exams'

type Props = {
  onSelect: (view: EmbeddedView) => void
}

/** Embedded module landing: Multiple Choice pool, or the Klausuren sub-page. */
export function EmbeddedSelect({ onSelect }: Props) {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-[32px] font-bold text-gray-900 dark:text-gray-100">Embedded Systems</h1>

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
              {EXAMS.length} Altklausuren
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}
