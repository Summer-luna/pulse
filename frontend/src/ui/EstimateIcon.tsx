import { Triangle, TriangleDashed } from 'lucide-react'

interface Props {
  value: number | null
}

const SIZE_BY_VALUE: Record<number, number> = { 0: 9, 1: 10, 2: 11, 3: 12, 5: 13, 8: 15 }

export function EstimateIcon({ value }: Props) {
  if (value === null) {
    return <TriangleDashed size={13} strokeWidth={1.75} className="shrink-0 text-faint" aria-hidden />
  }
  return <Triangle size={SIZE_BY_VALUE[value] ?? 13} strokeWidth={1.75} className="shrink-0 text-dim" aria-hidden />
}
