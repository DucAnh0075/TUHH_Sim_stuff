import { VipsBadge } from './VipsNotice'

type Props = {
  /** Question heading. */
  title: string
  scored: number | null
  max: number
  /** Shows the VIPS chip next to the title. */
  vips?: boolean
  /** 'points' (default) or 'Punkte' for the exam trainer. */
  unit?: string
  /** Appends "(vorläufig)" - shown while an exercise has unresolved self-graded parts. */
  provisional?: boolean
}

/** Exam-style headline: title (with optional VIPS chip) left, "1.00 / 2 points" right. */
export function TaskHeader({ title, scored, max, vips, unit = 'points', provisional }: Props) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h2 className="text-[26px] font-bold text-gray-900 dark:text-gray-100">
        {title}
        {vips && (
          <>
            {' '}
            <VipsBadge />
          </>
        )}
      </h2>
      <span className="shrink-0 text-[26px] font-bold text-gray-900 dark:text-gray-100">
        {scored === null ? '–' : scored.toFixed(2)} / {max} {unit}
        {provisional && <span className="ml-1 text-[15px] font-semibold text-amber-600"> (vorläufig)</span>}
      </span>
    </div>
  )
}
