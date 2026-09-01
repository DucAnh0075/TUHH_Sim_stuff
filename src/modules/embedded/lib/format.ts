/** The report prints one decimal for task totals: "8.0 / 10 Punkte". */
export function formatPoints(value: number): string {
  return Number.isInteger(value) ? `${value}.0` : String(Math.round(value * 100) / 100)
}
