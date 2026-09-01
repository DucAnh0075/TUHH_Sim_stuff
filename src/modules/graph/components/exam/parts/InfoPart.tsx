import type { InfoPart as InfoPartType } from '../../../types'
import { Tex } from '../../Tex'

/** A mid-exercise paragraph/formula/figure that scores nothing - text is optional because
 * `display`/`figure` on the shared PartBase chrome may be all a part needs to say. */
export function InfoPart({ part }: { part: InfoPartType }) {
  if (!part.text) return null
  return (
    <p className="text-[14px] leading-snug text-gray-700 dark:text-gray-300">
      <Tex text={part.text} />
    </p>
  )
}
