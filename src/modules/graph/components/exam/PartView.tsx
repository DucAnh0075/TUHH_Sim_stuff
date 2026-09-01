import type { Part, PartAnswer } from '../../types'
import { partMax, scorePart } from '../../types'
import { GraphFigure } from '../GraphFigure'
import { Tex } from '../Tex'
import { TexBlock } from '../TexBlock'
import { FieldsPart } from './parts/FieldsPart'
import { InfoPart } from './parts/InfoPart'
import { MultiPart } from './parts/MultiPart'
import { OpenPart } from './parts/OpenPart'
import { OrderPart } from './parts/OrderPart'
import { SinglePart } from './parts/SinglePart'

type Props = {
  part: Part
  answer: PartAnswer
  evaluated: boolean
  onChange: (answer: PartAnswer) => void
  /** Set by ExamTaskView for a run of parts sharing a `group` - the group wrapper already
   * provides the border, so each member renders without its own. */
  bare?: boolean
}

/** One part of an exam exercise: shared chrome (label, intro, figure, note, score) plus
 * the kind-specific interactive control. The analogue of TaskView's `Body`, one level down. */
export function PartView({ part, answer, evaluated, onChange, bare }: Props) {
  const max = partMax(part)
  const scored = evaluated ? scorePart(part, answer) : null

  return (
    <div
      id={part.id}
      className={bare ? '' : 'rounded-lg border-2 border-gray-200 px-4 py-3 dark:border-gray-700'}
    >
      {(part.label || max > 0) && (
        <div className="mb-2 flex items-baseline justify-between gap-3">
          {part.label && (
            <p className="text-[14px] font-bold text-gray-900 dark:text-gray-100">
              <Tex text={part.label} />
              {part.derived && (
                <span
                  title="Antwort abgeleitet, kein offizieller Schlüssel"
                  className="ml-1.5 rounded bg-amber-200 px-1.5 py-0.5 text-[11px] font-bold text-amber-900"
                >
                  abgeleitet
                </span>
              )}
            </p>
          )}
          {max > 0 && (
            <span className="shrink-0 text-[13px] font-bold whitespace-nowrap text-gray-700 dark:text-gray-300">
              {scored === null ? '–' : scored.toFixed(2)} / {max} P
            </span>
          )}
        </div>
      )}

      {part.intro && (
        <p className="mb-2 text-[14px] leading-snug text-gray-800 dark:text-gray-200">
          <Tex text={part.intro} />
        </p>
      )}

      {part.display?.map((block, i) => <TexBlock key={i} text={block} />)}

      {part.figure && (
        <div className="my-3 flex justify-center">
          <GraphFigure id={part.figure} />
        </div>
      )}

      <Body part={part} answer={answer} evaluated={evaluated} onChange={onChange} />

      {part.note && (
        <p className="mt-2 text-[13px] leading-snug text-gray-600 italic dark:text-gray-400">{part.note}</p>
      )}
    </div>
  )
}

function Body({ part, answer, evaluated, onChange }: Omit<Props, 'bare'>) {
  switch (part.kind) {
    case 'fields':
      return (
        <FieldsPart
          part={part}
          values={answer.kind === 'fields' ? answer.values : []}
          evaluated={evaluated}
          onChange={(values) => onChange({ kind: 'fields', values })}
        />
      )
    case 'single':
      return (
        <SinglePart
          part={part}
          picked={answer.kind === 'single' ? answer.picked : null}
          evaluated={evaluated}
          onChange={(picked) => onChange({ kind: 'single', picked })}
        />
      )
    case 'multi':
      return (
        <MultiPart
          part={part}
          choices={answer.kind === 'multi' ? answer.choices : []}
          evaluated={evaluated}
          onChange={(choices) => onChange({ kind: 'multi', choices })}
        />
      )
    case 'order':
      return (
        <OrderPart
          part={part}
          slots={answer.kind === 'order' ? answer.slots : []}
          evaluated={evaluated}
          onChange={(slots) => onChange({ kind: 'order', slots })}
        />
      )
    case 'open':
      return (
        <OpenPart
          part={part}
          selfPoints={answer.kind === 'open' ? answer.selfPoints : null}
          evaluated={evaluated}
          onChange={(selfPoints) => onChange({ kind: 'open', selfPoints })}
        />
      )
    case 'info':
      return <InfoPart part={part} />
  }
}
