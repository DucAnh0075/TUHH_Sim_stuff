import { useState } from 'react'

type Props = {
  /** Figure id from figures.manifest.json, e.g. 'gt-ss2023/ff-network'. */
  id: string
  alt?: string
  className?: string
}

/**
 * A diagram cut out of the original report PDF, shared with the Embedded module's
 * public/figures/ output (namespaced with a 'gt-' exam prefix so the two never collide).
 * Shows a labelled placeholder until the PNG exists.
 */
export function GraphFigure({ id, alt, className }: Props) {
  const [missing, setMissing] = useState(false)

  if (missing) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-1 rounded border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-900 ${className ?? ''}`}
      >
        <span className="text-[13px] font-semibold text-gray-500 dark:text-gray-400">Abbildung fehlt</span>
        <span className="font-mono text-[12px] text-gray-400 dark:text-gray-500">{id}</span>
        <span className="max-w-md text-[12px] text-gray-400 dark:text-gray-500">
          PDFs nach <code className="font-mono">pdfs/</code> legen und{' '}
          <code className="font-mono">npm run figures</code> ausführen.
        </span>
      </div>
    )
  }

  return (
    <img
      src={`${import.meta.env.BASE_URL}figures/${id}.png`}
      alt={alt ?? id}
      onError={() => setMissing(true)}
      className={`max-w-full ${className ?? ''}`}
    />
  )
}
