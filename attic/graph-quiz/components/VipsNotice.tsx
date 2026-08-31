/**
 * Warning above VIPS tasks: those practice quizzes come without an official
 * answer key, so the answers stored here were derived by an AI.
 */
export function VipsNotice() {
  return (
    <div className="mb-3 flex items-start gap-2 rounded-lg border-2 border-amber-300 bg-amber-50 px-4 py-3">
      <span className="text-[16px] leading-none">⚠️</span>
      <p className="text-[14px] leading-snug text-amber-900">
        <strong>VIPS question.</strong> There is no official answer key for these - the solutions
        below were worked out by an AI and may be wrong. Treat them as a hint, not as the truth.
      </p>
    </div>
  )
}

/** Small "VIPS" chip shown next to the task title. */
export function VipsBadge() {
  return (
    <span className="rounded border border-amber-400 bg-amber-100 px-1.5 py-0.5 align-middle text-[12px] font-bold tracking-wide text-amber-800 uppercase">
      VIPS
    </span>
  )
}
