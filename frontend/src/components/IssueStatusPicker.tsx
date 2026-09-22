import { ISSUE_STATUS_LABEL, ISSUE_STATUSES } from '@/domain/issue-status'
import type { IssueStatus } from '@/graphql/generated/graphql'
import { Picker } from '@/ui/Picker'
import { StatusIcon } from '@/ui/StatusIcon'

interface Props {
  value: IssueStatus
  onChange: (status: IssueStatus) => void
  iconOnly?: boolean
  align?: 'left' | 'right'
}

const OPTIONS = ISSUE_STATUSES.map((status) => ({
  value: status,
  label: ISSUE_STATUS_LABEL[status],
  icon: <StatusIcon status={status} />,
}))

export function IssueStatusPicker({ value, onChange, iconOnly, align }: Props) {
  return (
    <Picker
      value={value}
      options={OPTIONS}
      onChange={(next) => next && onChange(next)}
      placeholder="Status"
      iconOnly={iconOnly}
      align={align}
    />
  )
}
