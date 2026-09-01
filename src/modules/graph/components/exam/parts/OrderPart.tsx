import { useMemo, useState } from 'react'
import { shuffle } from '../../../lib/shuffle'
import type { OrderPart as OrderPartType } from '../../../types'
import { Tex } from '../../Tex'

type Props = {
  part: OrderPartType
  slots: string[]
  evaluated: boolean
  onChange: (slots: string[]) => void
}

type Clone = { id: string; width: number; height: number; x: number; y: number }

/**
 * Sort-the-blocks puzzle (Landau notation, Beweispuzzle, Reduktion, Pseudocode): drag
 * blocks from the pool into place, drag to reorder, drag back onto the pool (or click ✕)
 * to remove. Custom pointer-driven dragging, not native HTML5 drag & drop - the browser's
 * built-in drag ghost is a translucent, slightly blurred snapshot with no styling control;
 * here the block itself renders at full opacity and follows the cursor exactly, while the
 * original slot is hidden (not fully removed, so the layout doesn't jump) until it drops.
 */
export function OrderPart({ part, slots, evaluated, onChange }: Props) {
  const pool = useMemo(() => shuffle(part.items), [part.items])
  const byId = useMemo(() => new Map(part.items.map((item) => [item.id, item])), [part.items])
  const [clone, setClone] = useState<Clone | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const [overPool, setOverPool] = useState(false)

  if (evaluated) {
    const length = Math.max(slots.length, part.solution.length)
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px] text-gray-900 dark:text-gray-100">
          <thead>
            <tr>
              <th className="border border-gray-400 px-2 py-1 text-left font-bold dark:border-gray-600">#</th>
              <th className="border border-gray-400 px-2 py-1 text-left font-bold dark:border-gray-600">Ihre Antwort</th>
              <th className="border border-gray-400 px-2 py-1 text-left font-bold dark:border-gray-600">Lösung</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length }, (_, i) => {
              const given = slots[i] ? byId.get(slots[i])?.text : undefined
              const expected = part.solution[i] ? byId.get(part.solution[i])?.text : undefined
              const hit = (slots[i] ?? null) === (part.solution[i] ?? null)
              return (
                <tr key={i} className={hit ? 'bg-[#b6d957]' : 'bg-[#ef8a8a]'}>
                  <td className="border border-gray-400 px-2 py-1 dark:border-gray-600">{i + 1}</td>
                  <td className="border border-gray-400 px-2 py-1 whitespace-pre-line dark:border-gray-600">
                    {given ? <Tex text={given} /> : '—'}
                  </td>
                  <td className="border border-gray-400 px-2 py-1 whitespace-pre-line dark:border-gray-600">
                    {expected ? <Tex text={expected} /> : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  const placedIds = new Set(slots)
  const available = pool.filter((item) => !placedIds.has(item.id))

  const append = (id: string) => onChange([...slots, id])
  const remove = (id: string) => onChange(slots.filter((s) => s !== id))

  /** Moves `id` so it ends up right before whatever is currently at `targetIndex`. */
  const moveTo = (id: string, targetIndex: number) => {
    const currentIndex = slots.indexOf(id)
    const adjusted = currentIndex !== -1 && currentIndex < targetIndex ? targetIndex - 1 : targetIndex
    const without = slots.filter((s) => s !== id)
    const clamped = Math.max(0, Math.min(without.length, adjusted))
    onChange([...without.slice(0, clamped), id, ...without.slice(clamped)])
  }

  const beginDrag = (event: React.PointerEvent<HTMLElement>, id: string, fromPool: boolean) => {
    if (event.button !== 0) return
    event.preventDefault()

    const rect = event.currentTarget.getBoundingClientRect()
    const offsetX = event.clientX - rect.left
    const offsetY = event.clientY - rect.top
    const startX = event.clientX
    const startY = event.clientY
    let moved = false
    let hoverIndex: number | null = null
    let hoverPool = false

    setClone({ id, width: rect.width, height: rect.height, x: rect.left, y: rect.top })

    const handleMove = (moveEvent: PointerEvent) => {
      if (!moved && (Math.abs(moveEvent.clientX - startX) > 3 || Math.abs(moveEvent.clientY - startY) > 3)) {
        moved = true
      }
      setClone({ id, width: rect.width, height: rect.height, x: moveEvent.clientX - offsetX, y: moveEvent.clientY - offsetY })

      const el = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY)
      const slotEl = el?.closest<HTMLElement>('[data-slot-index]') ?? null
      const poolEl = el?.closest<HTMLElement>('[data-pool]') ?? null
      hoverIndex = slotEl ? Number(slotEl.dataset.slotIndex) : null
      hoverPool = !!poolEl && !slotEl
      setOverIndex(hoverIndex)
      setOverPool(hoverPool)
    }

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      if (!moved) {
        if (fromPool) append(id)
      } else if (hoverIndex !== null) {
        moveTo(id, hoverIndex)
      } else if (hoverPool) {
        remove(id)
      }
      setClone(null)
      setOverIndex(null)
      setOverPool(false)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
  }

  const blockClass =
    'touch-none cursor-grab rounded border-2 px-3 py-2 text-left text-[13px] leading-snug whitespace-pre-line select-none active:cursor-grabbing'

  return (
    <div>
      {clone && (
        <div
          style={{ position: 'fixed', left: clone.x, top: clone.y, width: clone.width, zIndex: 50 }}
          className={`${blockClass} pointer-events-none border-gray-800 bg-white shadow-lg dark:bg-gray-900 dark:text-gray-100`}
        >
          <Tex text={byId.get(clone.id)?.text ?? ''} />
        </div>
      )}

      <p className="mb-3 text-[13px] leading-snug text-gray-700 italic dark:text-gray-300">
        (Bausteine per Drag &amp; Drop einordnen. Pro falsch belegter Position −{part.penalty} Punkte, die
        Teilaufgabe kann nicht unter 0 Punkte fallen.)
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-[13px] font-bold text-gray-700 dark:text-gray-300">Verfügbare Bausteine</p>
          <ul
            data-pool="true"
            className={`flex min-h-12 flex-col gap-1.5 rounded border-2 border-dashed p-1 transition-colors ${
              overPool ? 'border-gray-800 dark:border-gray-200' : 'border-transparent'
            }`}
          >
            {available.map((item) => (
              <li
                key={item.id}
                onPointerDown={(event) => beginDrag(event, item.id, true)}
                className={`${blockClass} border-gray-300 bg-white text-gray-900 transition-colors hover:border-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:border-gray-500 ${
                  clone?.id === item.id ? 'invisible' : ''
                }`}
              >
                <Tex text={item.text} />
              </li>
            ))}
            {available.length === 0 && (
              <li className="text-[13px] text-gray-400 dark:text-gray-500">Alle Bausteine platziert.</li>
            )}
          </ul>
        </div>

        <div>
          <p className="mb-2 text-[13px] font-bold text-gray-700 dark:text-gray-300">
            Deine Reihenfolge — {slots.length} von {part.solution.length} Positionen belegt
          </p>
          <ol className="flex flex-col gap-1.5">
            {slots.map((id, i) => (
              <li key={id} data-slot-index={i}>
                {overIndex === i && clone !== null && clone.id !== id && (
                  <div className="mb-1.5 h-1 rounded bg-gray-800 dark:bg-gray-200" />
                )}
                <div
                  onPointerDown={(event) => beginDrag(event, id, false)}
                  className={`${blockClass} flex items-start gap-2 border-gray-800 bg-gray-50 text-gray-900 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-100 ${
                    clone?.id === id ? 'invisible' : ''
                  }`}
                >
                  <span className="shrink-0 font-bold">{i + 1}.</span>
                  <span className="flex-1">
                    <Tex text={byId.get(id)?.text ?? ''} />
                  </span>
                  <button
                    type="button"
                    title="Entfernen"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => remove(id)}
                    className="shrink-0 cursor-pointer text-gray-500 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}

            <li
              data-slot-index={slots.length}
              className={`rounded border-2 border-dashed px-3 py-2 text-center text-[12px] text-gray-400 transition-colors dark:text-gray-500 ${
                overIndex === slots.length && clone !== null ? 'border-gray-800 dark:border-gray-200' : 'border-transparent'
              }`}
            >
              {slots.length === 0 ? 'Noch nichts platziert. Bausteine hierher ziehen.' : 'Hier ablegen, um ans Ende zu setzen.'}
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
