import { Tag } from 'lucide-react'
import { useLabelsController } from '@/controllers/use-labels-controller'
import { MultiPicker } from '@/ui/MultiPicker'

interface Props {
  values: string[]
  onChange: (labelIds: string[]) => void
  align?: 'left' | 'right'
  searchable?: boolean
}

export function LabelPicker({ values, onChange, align, searchable = true }: Props) {
  const { labels } = useLabelsController()
  const options = labels.map((label) => ({
    value: label.id,
    label: label.name,
    icon: <span className="size-2.5 shrink-0 rounded-full" style={{ background: label.color }} />,
  }))

  return (
    <MultiPicker
      values={values}
      options={options}
      onChange={onChange}
      placeholder="Labels"
      unit="labels"
      triggerIcon={<Tag size={14} className="text-faint" />}
      align={align}
      searchable={searchable}
      searchPlaceholder="Change or add labels…"
    />
  )
}
