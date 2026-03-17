import { monoLabelClass } from '../lib/styles'

type SectionLabelProps = {
  children: string
}

export function SectionLabel({ children }: SectionLabelProps) {
  return <p className={monoLabelClass}>{children}</p>
}
