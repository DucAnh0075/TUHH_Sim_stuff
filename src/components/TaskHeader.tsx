import { Tex } from './Tex'
import { VipsBadge } from './VipsNotice'

type Props = {
  /** e.g. "Trees", may contain `$...$` */
  title: string
  scored: number | null
  max: number
  /** Shows the "VIPS" chip next to the title. */
  vips?: boolean
}

/** Exam-style headline: title left, "X / Y points" right. */
export function TaskHeader({ title, scored, max, vips }: Props) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h2 className="flex flex-wrap items-baseline gap-2 text-[26px] font-bold text-gray-900">
        <Tex text={title} />
        {vips && <VipsBadge />}
      </h2>
      <span className="shrink-0 text-[26px] font-bold text-gray-900">
        {scored === null ? '–' : formatPoints(scored)} / {max} points
      </span>
    </div>
  )
}

/** The exam prints one decimal for task totals: "1.0 / 5 points". */
function formatPoints(value: number): string {
  return Number.isInteger(value) ? `${value}.0` : String(value)
}
