import type { GradeRow } from '../../types'
import { conversionTable } from '../../types'

/** Standard percent-based grade table (95%..50% -> 1.0..4.0), for exams whose own report
 * doesn't print a Notenschlüssel page. */
export function grades(totalPoints: number): GradeRow[] {
  return conversionTable(totalPoints)
}

/**
 * Shown on an `open` part whose key could not be transcribed with confidence from the
 * flattened PDF text (a garbled proof-block order, an OCR-ambiguous formula, ...) rather
 * than one where the report genuinely prints no solution at all. Distinct from a plain
 * `noKey: true` without this note, which means the report itself has no solution.
 */
export const UNRELIABLE_EXTRACTION_NOTE =
  'Die genaue Lösung ist aus dem vorliegenden Text-Auszug des Berichts nicht zuverlässig ' +
  'rekonstruierbar (z.B. verschachtelte Formeln oder eine Reihenfolge, die beim Kopieren ' +
  'durcheinandergeraten ist). Bitte gegen das Original-PDF prüfen, bevor daraus eine ' +
  'feste `order`/`fields`-Lösung wird.'
