import { useState } from 'react'

type Props = {
  /** Figure id from figures.manifest.json, e.g. 'ss2023/statechart'. */
  id: string
  alt?: string
  className?: string
}

/**
 * A diagram cut out of the original report PDF. The PNGs are produced by
 * `npm run figures` from the PDFs in `pdfs/`; until they exist a labelled
 * placeholder is shown so the app stays usable.
 */
export function Figure({ id, alt, className }: Props) {
  const [missing, setMissing] = useState(false)

  if (missing) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-1 rounded border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center ${className ?? ''}`}
      >
        <span className="text-[13px] font-semibold text-gray-500">Abbildung fehlt</span>
        <span className="font-mono text-[12px] text-gray-400">{id}</span>
        <span className="max-w-md text-[12px] text-gray-400">
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
