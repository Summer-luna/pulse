import { ISSUE_PRIORITIES, ISSUE_PRIORITY_LABEL } from '@/domain/issue-priority'
import type { IssuePriority } from '@/graphql/generated/graphql'
import { Picker } from '@/ui/Picker'
import { PriorityIcon } from '@/ui/PriorityIcon'

interface Props {
  value: IssuePriority
  onChange: (priority: IssuePriority) => void
  iconOnly?: boolean
  align?: 'left' | 'right'
}

const OPTIONS = ISSUE_PRIORITIES.map((priority) => ({
  value: priority,
  label: ISSUE_PRIORITY_LABEL[priority],
  icon: <PriorityIcon priority={priority} />,
}))

export function IssuePriorityPicker({ value, onChange, iconOnly, align }: Props) {
  return (
    <Picker
      value={value}
      options={OPTIONS}
      onChange={(next) => next && onChange(next)}
      placeholder="Priority"
      iconOnly={iconOnly}
      align={align}
    />
  )
}
