import { Tex } from './Tex'

type Props = {
  prompt: string
  /** Further paragraphs below the question, e.g. problem definitions. */
  extra?: string[]
}

/** The light blue task box. */
export function PromptBox({ prompt, extra }: Props) {
  return (
    <div className="rounded-lg border border-[#7fb8d4] bg-[#b9dced] px-4 py-3">
      <p className="text-[15px] leading-snug font-bold text-gray-900">
        <Tex text={prompt} />
      </p>
      {extra?.map((paragraph, i) => (
        // `whitespace-pre-line`: keeps the line breaks inside the problem definitions.
        <p key={i} className="mt-3 text-[15px] leading-snug font-bold whitespace-pre-line text-gray-900">
          <Tex text={paragraph} />
        </p>
      ))}
    </div>
  )
}
