import { useState } from 'react'
import type { GridTask as GridTaskType } from '../../types'
import { Figure } from '../Figure'
import { Tex } from '../Tex'

type Props = {
  task: GridTaskType
  cells: number[][]
  selfPoints: number | null
  evaluated: boolean
  onChange: (cells: number[][], selfPoints: number | null) => void
}

/**
 * The two grid exercises: the Gantt charts of the three scheduling tasks and the
 * StateCharts state table. Their official solutions exist only as a picture in the
 * report, so after Confirm the solution figure is shown and the points are assigned
 * by the user - see the self-check box below the grid.
 */
export function GridTask({ task, cells, selfPoints, evaluated, onChange }: Props) {
  const [brush, setBrush] = useState(task.states.length > 2 ? 1 : 1)
  const [painting, setPainting] = useState(false)

  const paint = (row: number, col: number, value?: number) => {
    if (evaluated) return
    const next = value ?? (task.variant === 'statechart' ? (cells[row][col] ? 0 : 1) : brush)
    if (cells[row][col] === next) return
    const updated = cells.map((r, i) => (i === row ? r.map((c, j) => (j === col ? next : c)) : r))
    onChange(updated, selfPoints)
  }

  const reset = () => {
    if (evaluated) return
    onChange(
      task.rows.map(() => task.cols.map(() => 0)),
      selfPoints,
    )
  }

  return (
    <div className="flex flex-col gap-4" onMouseUp={() => setPainting(false)} onMouseLeave={() => setPainting(false)}>
      {task.table && <TaskTable table={task.table} />}

      {task.variant === 'gantt' ? (
        <GanttGrid
          task={task}
          cells={cells}
          evaluated={evaluated}
          painting={painting}
          setPainting={setPainting}
          paint={paint}
        />
      ) : (
        <StateChartGrid task={task} cells={cells} evaluated={evaluated} paint={paint} />
      )}

      {task.variant === 'gantt' && !evaluated && (
        <div className="flex flex-wrap items-center gap-2 text-[13px]">
          {task.states.map((state, i) => (
            <button
              key={state.label}
              type="button"
              onClick={() => setBrush(i)}
              className={`cursor-pointer rounded border-2 px-3 py-1 font-semibold transition-colors ${
                brush === i ? 'border-gray-800 bg-gray-800 text-white' : 'border-gray-300 text-gray-700 hover:border-gray-500'
              }`}
            >
              {state.label}
            </button>
          ))}
          <span className="ml-1 text-gray-600">
            Current selection: <strong>{task.states[brush].label}</strong>
          </span>
          <button
            type="button"
            onClick={reset}
            className="ml-auto cursor-pointer text-gray-500 underline underline-offset-2 hover:text-gray-800"
          >
            Zurücksetzen
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 text-[13px] text-gray-700">
        <span className="font-bold">Legend:</span>
        {task.states.map((state) => (
          <span key={state.label} className="flex items-center gap-1.5">
            <span
              className="inline-block h-3.5 w-3.5 border border-gray-400"
              style={{ background: state.color }}
            />
            {state.label}
          </span>
        ))}
      </div>

      {evaluated && (
        <SelfCheck
          task={task}
          selfPoints={selfPoints}
          onScore={(value) => onChange(cells, value)}
        />
      )}
    </div>
  )
}

// ------------------------------------------------------------------- task table

function TaskTable({ table }: { table: NonNullable<GridTaskType['table']> }) {
  return (
    <table className="border-collapse text-[13px]">
      <thead>
        <tr>
          {table.headers.map((header) => (
            <th key={header} className="border border-gray-400 px-3 py-1 font-bold text-gray-900">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} className="border border-gray-400 px-3 py-1 text-center whitespace-nowrap text-gray-900">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ------------------------------------------------------------------ gantt chart

type GanttProps = {
  task: GridTaskType
  cells: number[][]
  evaluated: boolean
  painting: boolean
  setPainting: (value: boolean) => void
  paint: (row: number, col: number) => void
}

function GanttGrid({ task, cells, evaluated, painting, setPainting, paint }: GanttProps) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-block border border-gray-500 select-none">
        {task.rows.map((row, r) => (
          <div key={row} className="flex">
            <div className="flex w-9 shrink-0 items-center justify-center border-r border-b border-gray-400 bg-white px-1 text-[12px] font-semibold text-gray-900">
              {row}
            </div>
            {task.cols.map((_, c) => (
              <div
                key={c}
                onMouseDown={() => {
                  setPainting(true)
                  paint(r, c)
                }}
                onMouseEnter={() => painting && paint(r, c)}
                style={{ background: task.states[cells[r][c]].color }}
                className={`h-6 w-[22px] shrink-0 border-r border-b border-gray-300 ${
                  evaluated ? '' : 'cursor-pointer'
                }`}
              />
            ))}
          </div>
        ))}
        <div className="flex">
          <div className="w-9 shrink-0" />
          {task.cols.map((label) => (
            <div key={label} className="w-[22px] shrink-0 text-center text-[10px] text-gray-600">
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------- statechart grid

type StateChartProps = {
  task: GridTaskType
  cells: number[][]
  evaluated: boolean
  paint: (row: number, col: number) => void
}

function StateChartGrid({ task, cells, evaluated, paint }: StateChartProps) {
  return (
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-0 text-[13px]">
        <thead>
          <tr>
            <th className="border border-white bg-[#b9dced] px-2 py-1" />
            {task.cols.map((col) => (
              <th key={col} className="border border-white bg-[#b9dced] px-2 py-1 font-bold text-gray-900">
                {col}
              </th>
            ))}
            <th className="border border-white bg-[#b9dced] px-2 py-1 font-bold text-gray-900">
              Evaluation
            </th>
          </tr>
        </thead>
        <tbody>
          {task.rows.map((row, r) => (
            <tr key={`${row}-${r}`}>
              <th className="border border-white bg-[#7fd4f7] px-2 py-1 font-normal text-gray-900">
                {row}
              </th>
              {task.cols.map((col, c) => (
                <td key={col} className="border border-white bg-[#b6d957] p-0 text-center">
                  <button
                    type="button"
                    disabled={evaluated}
                    onClick={() => paint(r, c)}
                    className={`flex h-6 w-full min-w-[26px] items-center justify-center text-[12px] font-bold ${
                      evaluated ? 'cursor-default' : 'cursor-pointer'
                    } ${cells[r][c] ? 'text-white' : 'text-transparent'}`}
                  >
                    <span
                      className={`flex h-3.5 w-3.5 items-center justify-center border border-gray-500 ${
                        cells[r][c] ? 'bg-[#5f9c1e] text-white' : 'bg-[#cfe6f5]'
                      }`}
                    >
                      {cells[r][c] ? '✓' : ''}
                    </span>
                  </button>
                </td>
              ))}
              <td className="border border-white bg-[#b6d957] px-2 py-1 text-center text-gray-900">1 P</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ------------------------------------------------------------------- self check

type SelfCheckProps = {
  task: GridTaskType
  selfPoints: number | null
  onScore: (value: number | null) => void
}

function SelfCheck({ task, selfPoints, onScore }: SelfCheckProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border-2 border-amber-300 bg-amber-50 px-4 py-3">
      <p className="text-[14px] leading-snug text-amber-900">
        <strong>Selbstkontrolle.</strong> Für diese Aufgabe gibt es im Bericht nur die abgebildete Lösung,
        keinen maschinenlesbaren Schlüssel. Vergleiche dein Raster mit der Lösung und trage deine Punktzahl
        ein — sie fließt in das Gesamtergebnis ein.
      </p>

      {task.solutionFigure && (
        <div>
          <p className="mb-1 text-[14px] font-bold text-gray-900">Solution</p>
          <Figure id={task.solutionFigure} className="border border-gray-300" />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 text-[14px]">
        <span className="font-bold text-gray-900">Meine Punkte:</span>
        <input
          type="number"
          min={0}
          max={task.points}
          step={0.5}
          value={selfPoints ?? ''}
          onChange={(event) => {
            const raw = event.target.value
            if (raw === '') return onScore(null)
            const value = Math.max(0, Math.min(task.points, Number.parseFloat(raw)))
            onScore(Number.isFinite(value) ? value : null)
          }}
          className="w-24 rounded border-2 border-gray-400 bg-white px-2 py-1 font-mono text-[14px] text-gray-900 focus:border-gray-800 focus:outline-none"
        />
        <span className="text-gray-700">/ {task.points} Punkte</span>
        <button
          type="button"
          onClick={() => onScore(task.points)}
          className="cursor-pointer rounded border-2 border-[#9cc23e] bg-[#b6d957] px-3 py-1 font-semibold text-gray-900"
        >
          Alles richtig
        </button>
        <button
          type="button"
          onClick={() => onScore(0)}
          className="cursor-pointer rounded border-2 border-gray-300 px-3 py-1 font-semibold text-gray-700 hover:border-gray-500"
        >
          0 Punkte
        </button>
      </div>
    </div>
  )
}

/** Exported for the prompt of scheduling tasks, which mixes KaTeX into the notes. */
export function GridNote({ text }: { text: string }) {
  return (
    <p className="text-[14px] leading-snug text-gray-700">
      <Tex text={text} />
    </p>
  )
}
