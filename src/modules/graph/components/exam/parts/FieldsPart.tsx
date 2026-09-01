import type { FieldsPart as FieldsPartType } from '../../../types'
import { fieldPoints } from '../../../types'
import { Tex } from '../../Tex'

type Props = {
  part: FieldsPartType
  values: string[]
  evaluated: boolean
  onChange: (values: string[]) => void
}

/** Numeric/text input fields: residual-network edges, `val(f)`, `d^k_{i,j}`, Kruskal, ... */
export function FieldsPart({ part, values, evaluated, onChange }: Props) {
  const set = (i: number, value: string) => {
    if (evaluated) return
    const updated = values.slice()
    updated[i] = value
    onChange(updated)
  }

  const wrap = part.layout === 'inline' ? 'flex flex-wrap items-end gap-4' : 'flex flex-col gap-2'

  return (
    <div className={wrap}>
      {part.fields.map((field, i) => {
        const value = values[i] ?? ''
        const correct = evaluated && fieldPoints(part, i, value) > 0
        const tone = !evaluated
          ? 'border-gray-400 bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'
          : correct
            ? 'border-[#9cc23e] bg-[#b6d957]'
            : 'border-[#e07272] bg-[#ef8a8a]'

        return (
          <div key={field.id} className="flex flex-wrap items-center gap-2 text-[14px]">
            {field.label && (
              <span className="font-semibold whitespace-nowrap text-gray-900 dark:text-gray-100">
                <Tex text={field.label} />
              </span>
            )}
            <input
              type="text"
              value={value}
              disabled={evaluated}
              placeholder={field.placeholder}
              onChange={(event) => set(i, event.target.value)}
              className={`w-28 rounded border-2 px-1.5 py-1 font-mono text-[14px] text-gray-900 focus:border-gray-800 focus:outline-none disabled:cursor-default dark:focus:border-gray-400 ${tone}`}
            />
            {field.unit && <span className="text-gray-600 dark:text-gray-400">{field.unit}</span>}
            {evaluated && (
              <span className="text-[13px] whitespace-nowrap text-gray-700 dark:text-gray-300">
                {!correct && (
                  <>
                    Lösung: <Tex text={field.expected} />
                    {' · '}
                  </>
                )}
                {fieldPoints(part, i, value)} / {field.points ?? part.pointsPerField} P
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
