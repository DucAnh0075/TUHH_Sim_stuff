import { useMemo } from 'react'
import katex from 'katex'

/**
 * A centred KaTeX *display* block (matrices, an LP, a simplex tableau) - `Tex` only
 * handles inline math mixed into prose. `text` is the raw LaTeX, without `$...$`.
 */
export function TexBlock({ text }: { text: string }) {
  const html = useMemo(() => katex.renderToString(text, { throwOnError: false, displayMode: true }), [text])

  return (
    <div
      className="my-3 overflow-x-auto text-gray-900 dark:text-gray-100"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
