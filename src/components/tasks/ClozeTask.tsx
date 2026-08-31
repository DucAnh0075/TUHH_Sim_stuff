import { Fragment, useMemo } from 'react'
import type { ClozeTask as ClozeTaskType } from '../../types'
import { gapPoints } from '../../types'
import { shuffle } from '../../lib/shuffle'
import { Tex } from '../Tex'

type Props = {
  task: ClozeTaskType
  picks: (string | null)[]
  evaluated: boolean
  onChange: (picks: (string | null)[]) => void
}

/** Cloze Task: numbered sentences with one select box per gap. */
export function ClozeTask({ task, picks, evaluated, onChange }: Props) {
  // One shared word pool for every gap, as in the exam. Shuffled once per task so
  // that the position of a word carries no information.
  const pool = useMemo(() => {
    const words = new Set<string>()
    for (const item of task.items) words.add(item.answer)
    for (const word of task.distractors) words.add(word)
    return shuffle([...words])
  }, [task])

  const pick = (i: number, word: string) => {
    if (evaluated) return
    const updated = [...picks]
    updated[i] = word === '' ? null : word
    onChange(updated)
  }

  return (
    <ol className="flex flex-col gap-4 border-t border-gray-300 pt-4">
      {task.items.map((item, i) => {
        const segments = item.text.split('{}')
        const points = gapPoints(task, i, picks[i])

        return (
          <li key={i} className="flex gap-2 font-mono text-[14px] leading-7 text-gray-900">
            <span className="shrink-0">{i + 1}.</span>
            <p className="flex-1">
              {segments.map((segment, s) => (
                <Fragment key={s}>
                  <Tex text={segment} />
                  {s < segments.length - 1 &&
                    (evaluated ? (
                      <span
                        className={`mx-1 inline-block rounded border px-2 align-middle font-bold ${
                          points > 0
                            ? 'border-[#9cc23e] bg-[#b6d957] text-gray-900'
                            : 'border-[#d9c94a] bg-[#f5ec7e] text-gray-900'
                        }`}
                      >
                        {picks[i] ?? '—'} ({points.toFixed(2)} Punkte | {item.answer})
                      </span>
                    ) : (
                      <select
                        value={picks[i] ?? ''}
                        onChange={(event) => pick(i, event.target.value)}
                        className="mx-1 max-w-[15rem] rounded border-2 border-gray-400 bg-white px-1.5 py-0.5 align-middle font-mono text-[14px] text-gray-900 hover:border-gray-600 focus:border-gray-800 focus:outline-none"
                      >
                        <option value="">– select –</option>
                        {pool.map((word) => (
                          <option key={word} value={word}>
                            {word}
                          </option>
                        ))}
                      </select>
                    ))}
                </Fragment>
              ))}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
