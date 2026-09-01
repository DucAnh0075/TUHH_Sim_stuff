import { Fragment, useMemo } from 'react'
import katex from 'katex'

const SEGMENT = /(\$[^$]+\$)/g

/**
 * Renders the mini-markup used in the question data: everything between `$...$`
 * is typeset with KaTeX, the rest stays plain text.
 */
export function Tex({ text }: { text: string }) {
  const parts = useMemo(() => text.split(SEGMENT).filter((p) => p !== ''), [text])

  return (
    <>
      {parts.map((part, i) => {
        if (part.length > 2 && part.startsWith('$') && part.endsWith('$')) {
          const html = katex.renderToString(part.slice(1, -1), {
            throwOnError: false,
            displayMode: false,
          })
          return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />
        }
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}
