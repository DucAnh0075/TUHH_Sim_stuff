import { formatPoints } from '../lib/format'

type Props = {
  /** Exercise name, e.g. 'Scheduling (Priority, PIP) 2'. */
  title: string
  scored: number | null
  max: number
}

/** Exam-style headline: title left, "8.0 / 10 Punkte" right. */
export function TaskHeader({ title, scored, max }: Props) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h2 className="text-[26px] font-bold text-gray-900">{title}</h2>
      <span className="shrink-0 text-[26px] font-bold text-gray-900">
        {scored === null ? '–' : formatPoints(scored)} / {max} Punkte
      </span>
    </div>
  )
}
