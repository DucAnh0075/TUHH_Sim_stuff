import type { Field, FieldsTask as FieldsTaskType } from '../../types'
import { fieldPoints } from '../../types'
import { Tex } from '../Tex'

type Props = {
  task: FieldsTaskType
  values: string[]
  evaluated: boolean
  onChange: (values: string[]) => void
}

/**
 * Every task whose answer is typed into input fields: VHDL truth table,
 * A/D converters, Pareto and the cache joins. The layout differs, the scoring
 * does not (1 point per field unless the field says otherwise).
 */
export function FieldsTask({ task, values, evaluated, onChange }: Props) {
  const set = (i: number, value: string) => {
    if (evaluated) return
    const updated = [...values]
    updated[i] = value
    onChange(updated)
  }

  const props = { task, values, evaluated, set }

  switch (task.layout) {
    case 'vhdl':
      return <VhdlLayout {...props} />
    case 'adc':
      return <AdcLayout {...props} />
    case 'pareto':
      return <ParetoLayout {...props} />
    case 'cache':
      return <CacheLayout {...props} />
    case 'single':
      return <SingleLayout {...props} />
  }
}

type LayoutProps = {
  task: FieldsTaskType
  values: string[]
  evaluated: boolean
  set: (i: number, value: string) => void
}

/** Shared input: green while unanswered, green/red after Confirm - as in the report. */
function Input({
  task,
  values,
  evaluated,
  set,
  index,
  width = 'w-28',
}: LayoutProps & { index: number; width?: string }) {
  const correct = evaluated && fieldPoints(task, index, values[index]) > 0
  // Only the empty (unevaluated) input flips to a dark field; the evaluated states
  // are light accent cells that keep dark text in both modes.
  const tone = !evaluated
    ? 'border-gray-400 bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'
    : correct
      ? 'border-[#9cc23e] bg-[#b6d957]'
      : 'border-[#e07272] bg-[#ef8a8a]'

  return (
    <input
      type="text"
      value={values[index]}
      disabled={evaluated}
      onChange={(event) => set(index, event.target.value)}
      className={`${width} rounded border-2 px-1.5 py-0.5 font-mono text-[13px] text-gray-900 focus:border-gray-800 focus:outline-none disabled:cursor-default dark:focus:border-gray-400 ${tone}`}
    />
  )
}

function Solution({ task, index }: { task: FieldsTaskType; index: number }) {
  const field = task.fields[index]
  return (
    <span className="text-[13px] whitespace-nowrap text-gray-900">
      <strong>Lösung:</strong> {field.expected}
    </span>
  )
}

function points(task: FieldsTaskType, index: number, values: string[]): string {
  return `${fieldPoints(task, index, values[index])} Punkt(e)`
}

// ------------------------------------------------------------------------- VHDL

function VhdlLayout({ task, values, evaluated, set }: LayoutProps) {
  return (
    <table className="border-separate border-spacing-0 text-[13px]">
      <thead>
        <tr>
          {(task.columns ?? []).map((col) => (
            <th key={col} className="border border-white bg-[#b9dced] px-3 py-1 font-serif italic">
              {col}
            </th>
          ))}
          <th className="border border-white bg-[#b9dced] px-3 py-1 font-serif italic">Bus</th>
        </tr>
      </thead>
      <tbody>
        {task.fields.map((field, i) => (
          <tr key={field.id}>
            {(field.inputs ?? []).map((value, c) => (
              <td key={c} className="border border-white bg-[#7fd4f7] px-3 py-1 text-center text-gray-900">
                {value}
              </td>
            ))}
            <td
              className={`border border-white px-2 py-1 ${
                evaluated
                  ? fieldPoints(task, i, values[i]) > 0
                    ? 'bg-[#b6d957]'
                    : 'bg-[#ef8a8a]'
                  : 'bg-[#dff0f8]'
              }`}
            >
              <div className="flex flex-col items-start gap-0.5">
                <Input task={task} values={values} evaluated={evaluated} set={set} index={i} width="w-16" />
                {evaluated && (
                  <span className="text-[12px] text-gray-900">
                    <strong>Lösung:</strong> {field.expected} · {points(task, i, values)}
                  </span>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// -------------------------------------------------------------- A/D converter 2

function AdcLayout({ task, values, evaluated, set }: LayoutProps) {
  return (
    <div className="flex flex-col gap-3">
      {task.fields.map((field, i) => (
        <div
          key={field.id}
          className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-300 bg-[#b9dced] px-4 py-3"
        >
          <span className="text-[14px] font-bold text-gray-900">
            <Tex text={field.label ?? ''} />
          </span>
          <span className="text-[14px] font-bold text-gray-900">w(t) =</span>
          <Input task={task} values={values} evaluated={evaluated} set={set} index={i} width="w-24" />
          {evaluated && (
            <span className="text-[14px] font-bold text-gray-900">
              Solution: {field.expected}; {points(task, i, values)}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

// ------------------------------------------------------------- A/D converter 1

function SingleLayout({ task, values, evaluated, set }: LayoutProps) {
  return (
    <div className="flex flex-col gap-2">
      {task.fields.map((field, i) => (
        <div key={field.id} className="flex flex-wrap items-center gap-2">
          <span className="text-[14px] text-gray-900 dark:text-gray-100">
            <Tex text={field.label ?? ''} />
          </span>
          <Input task={task} values={values} evaluated={evaluated} set={set} index={i} width="w-40" />
          {field.unit && <span className="text-[14px] text-gray-900 dark:text-gray-100">{field.unit}</span>}
          {evaluated && (
            <span className="text-[14px] text-gray-900 dark:text-gray-100">
              <strong>Solution:</strong> {field.expected} {field.unit} · {points(task, i, values)}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

// ----------------------------------------------------------------------- Pareto

function ParetoLayout({ task, values, evaluated, set }: LayoutProps) {
  const groups: { question: string; fields: { field: Field; index: number }[] }[] = []
  task.fields.forEach((field, index) => {
    const question = field.group ?? ''
    const last = groups[groups.length - 1]
    if (last && last.question === question) last.fields.push({ field, index })
    else groups.push({ question, fields: [{ field, index }] })
  })

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group, g) => (
        <div key={g} className="rounded-lg border border-gray-300 bg-[#b9dced] px-4 py-3">
          <p className="mb-3 text-[14px] leading-snug font-bold text-gray-900">
            <Tex text={group.question} />
          </p>
          <div className="flex flex-col gap-2">
            {group.fields.map(({ field, index }) => (
              <div key={field.id} id={field.id} className="flex flex-wrap items-center gap-2">
                {field.label && (
                  <span className="text-[14px] font-bold text-gray-900">{field.label}</span>
                )}
                <Input
                  task={task}
                  values={values}
                  evaluated={evaluated}
                  set={set}
                  index={index}
                  width="w-64"
                />
                {evaluated && (
                  <span className="text-[14px] font-bold text-gray-900">
                    Solution: {field.expected}; {points(task, index, values)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ----------------------------------------------------------------------- Caches

function CacheLayout({ task, values, evaluated, set }: LayoutProps) {
  const columns = task.cacheColumns ?? []

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="mb-1 text-[14px] text-gray-900 dark:text-gray-100">Before the control flow join:</p>
        <table className="border-separate border-spacing-0 text-[13px]">
          <thead>
            <tr>
              <th className="border border-white bg-[#b9dced] px-3 py-1" />
              {columns.map((col) => (
                <th key={col} className="border border-white bg-[#b9dced] px-4 py-1 font-serif italic">
                  <Tex text={`$${col}$`} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(task.before ?? []).map((row) => (
              <tr key={row.label}>
                <th className="border border-white bg-[#7fd4f7] px-3 py-1 font-serif italic">
                  <Tex text={`$${row.label}$`} />
                </th>
                {row.cells.map((cell, c) => (
                  <td key={c} className="border border-white bg-[#7fd4f7] px-4 py-1 text-center whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <p className="mb-1 text-[14px] text-gray-900 dark:text-gray-100">After the control flow join:</p>
        <table className="w-full border-separate border-spacing-0 text-[13px]">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} className="border border-white bg-[#b9dced] px-4 py-1 font-serif italic">
                  <Tex text={`$${col}$`} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {task.fields.map((field, i) => (
                <td key={field.id} className="border border-white bg-[#dff0f8] px-2 py-1 align-top">
                  <div className="flex items-center gap-1">
                    <span className="font-bold">{'{'}</span>
                    <Input
                      task={task}
                      values={values}
                      evaluated={evaluated}
                      set={set}
                      index={i}
                      width="w-full min-w-0"
                    />
                    <span className="font-bold">{'}'}</span>
                  </div>
                  {evaluated && (
                    <p className="mt-1 text-[12px] text-gray-900">
                      <Solution task={task} index={i} /> · {points(task, i, values)}
                    </p>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
