import { VipsBadge } from './VipsNotice'

type Props = {
  /** Question heading. */
  title: string
  scored: number | null
  max: number
  /** Shows the VIPS chip next to the title. */
  vips?: boolean
}

/** Exam-style headline: title (with optional VIPS chip) left, "1.00 / 2 points" right. */
export function TaskHeader({ title, scored, max, vips }: Props) {
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
        {scored === null ? '–' : scored.toFixed(2)} / {max} points
      </span>
    </div>
  )
}
