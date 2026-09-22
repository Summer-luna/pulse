import { ISSUE_ESTIMATE_VALUES, estimateLabel } from '@/domain/issue-estimate'
import { EstimateIcon } from '@/ui/EstimateIcon'
import { Picker } from '@/ui/Picker'

interface Props {
  value: number | null
  onChange: (estimate: number | null) => void
  iconOnly?: boolean
  align?: 'left' | 'right'
}

const OPTIONS = ISSUE_ESTIMATE_VALUES.map((points) => ({
  value: String(points),
  label: estimateLabel(points),
  icon: <EstimateIcon value={points} />,
}))

export function EstimatePicker({ value, onChange, iconOnly, align }: Props) {
  return (
    <Picker
      value={value === null ? null : String(value)}
      options={OPTIONS}
      onChange={(next) => onChange(next === null ? null : Number(next))}
      placeholder="Estimate"
      noneLabel="No estimate"
      noneIcon={<EstimateIcon value={null} />}
      iconOnly={iconOnly}
      align={align}
    />
  )
}
