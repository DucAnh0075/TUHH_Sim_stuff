import { GraphFigure } from './GraphFigure'
import { Tex } from './Tex'

type Props = {
  points: number
  /** Points the user assigned themselves, `null` = not graded yet. */
  value: number | null
  onChange: (value: number | null) => void
  solution?: string
  solutionFigure?: string
  /** No solution at all is printed in the report - shown as a small amber chip. */
  noKey?: boolean
}

/**
 * The amber self-check box shared by every self-graded open part: compare against the
 * official solution (when there is one) and enter your own points by hand.
 */
export function SelfCheck({ points, value, onChange, solution, solutionFigure, noKey }: Props) {
  return (
    <div className="mt-5 flex flex-col gap-3 rounded-lg border-2 border-amber-300 bg-amber-50 px-4 py-3">
      <p className="text-[14px] leading-snug text-amber-900">
        <strong>Selbstkontrolle.</strong> Vergleiche deine Lösung mit der offiziellen und trage deine
        Punktzahl ein — sie fließt ins Gesamtergebnis ein.
        {noKey && (
          <>
            {' '}
            <span className="ml-1 rounded bg-amber-200 px-1.5 py-0.5 text-[11px] font-bold text-amber-900">
              keine Lösung im Bericht
            </span>
          </>
        )}
      </p>

      {(solution || solutionFigure) && (
        <div>
          <p className="mb-1 text-[14px] font-bold text-gray-900 dark:text-gray-100">Lösung</p>
          {solution && (
            <p className="text-[14px] leading-snug whitespace-pre-line text-gray-900 dark:text-gray-100">
              <Tex text={solution} />
            </p>
          )}
          {solutionFigure && <GraphFigure id={solutionFigure} className="mt-2" />}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 text-[14px]">
        <span className="font-bold text-gray-900 dark:text-gray-100">Meine Punkte:</span>
        <input
          type="number"
          min={0}
          max={points}
          step={0.5}
          value={value ?? ''}
          onChange={(event) => {
            const raw = event.target.value
            if (raw === '') return onChange(null)
            const parsed = Math.max(0, Math.min(points, Number.parseFloat(raw)))
            onChange(Number.isFinite(parsed) ? parsed : null)
          }}
          className="w-24 rounded border-2 border-gray-400 bg-white px-2 py-1 font-mono text-[14px] text-gray-900 focus:border-gray-800 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-400"
        />
        <span className="text-gray-700 dark:text-gray-300">/ {points} Punkte</span>
      </div>
    </div>
  )
}
