import { PROJECT_STATUS_COLOR, PROJECT_STATUS_LABEL, PROJECT_STATUSES } from '@/domain/project-status'
import type { ProjectStatus } from '@/graphql/generated/graphql'
import { Picker } from '@/ui/Picker'

interface Props {
  value: ProjectStatus
  onChange: (status: ProjectStatus) => void
}

const OPTIONS = PROJECT_STATUSES.map((status) => ({
  value: status,
  label: PROJECT_STATUS_LABEL[status],
  icon: <span className="size-2 rounded-full" style={{ background: PROJECT_STATUS_COLOR[status] }} />,
}))

export function ProjectStatusPicker({ value, onChange }: Props) {
  return <Picker value={value} options={OPTIONS} onChange={(next) => next && onChange(next)} placeholder="Status" />
}
