import { monoLabelClass } from '../lib/styles'

type SectionLabelProps = {
  children: string
}

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <div className="inline-flex items-center gap-3 border-b-2 border-stroke pb-2 w-full">
      <span
        aria-hidden="true"
        className="h-3 w-3 shrink-0 bg-accent-purple"
      />
      <p className={monoLabelClass}>{children}</p>
    </div>
  )
}
