import type { Choice } from '../types'

type Props = {
  label: string
  title: string
  tone: Choice
  active: boolean
  disabled: boolean
  onClick: () => void
}

const TONES: Record<Choice, string> = {
  skip: 'text-gray-700',
  true: 'text-green-700',
  false: 'text-red-700',
}

const ACTIVE_TONES: Record<Choice, string> = {
  skip: 'bg-amber-200 text-gray-900',
  true: 'bg-[#9cc23e] text-white',
  false: 'bg-[#e07272] text-white',
}

/** One of the `?`/`✓`/`✗` round buttons used by every true/false statement block. */
export function ChoiceButton({ label, title, tone, active, disabled, onClick }: Props) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-800 text-[13px] font-bold transition-transform ${
        active ? ACTIVE_TONES[tone] : `bg-white ${TONES[tone]}`
      } ${disabled ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
    >
      {label}
    </button>
  )
}
