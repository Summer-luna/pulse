import { Triangle, TriangleDashed } from 'lucide-react'

interface Props {
  value: number | null
}

const ICON_SIZE = 13

export function EstimateIcon({ value }: Props) {
  if (value === null) {
    return <TriangleDashed size={ICON_SIZE} strokeWidth={1.75} className="shrink-0 text-faint" aria-hidden />
  }
  return <Triangle size={ICON_SIZE} strokeWidth={1.75} className="shrink-0 text-dim" aria-hidden />
}
