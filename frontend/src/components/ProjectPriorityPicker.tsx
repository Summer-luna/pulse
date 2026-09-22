import { PROJECT_PRIORITIES, PROJECT_PRIORITY_LABEL } from '@/domain/project-priority'
import type { ProjectPriority } from '@/graphql/generated/graphql'
import { Picker } from '@/ui/Picker'
import { PriorityIcon } from '@/ui/PriorityIcon'

interface Props {
  value: ProjectPriority
  onChange: (priority: ProjectPriority) => void
  iconOnly?: boolean
  align?: 'left' | 'right'
}

const OPTIONS = PROJECT_PRIORITIES.map((priority) => ({
  value: priority,
  label: PROJECT_PRIORITY_LABEL[priority],
  icon: <PriorityIcon priority={priority} />,
}))

export function ProjectPriorityPicker({ value, onChange, iconOnly, align }: Props) {
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
