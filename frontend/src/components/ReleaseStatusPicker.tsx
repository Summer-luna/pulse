import { RELEASE_STATUS_COLOR, RELEASE_STATUS_LABEL, RELEASE_STATUSES } from '@/domain/release-status'
import type { ReleaseStatus } from '@/graphql/generated/graphql'
import { Picker } from '@/ui/Picker'

interface Props {
  value: ReleaseStatus
  onChange: (status: ReleaseStatus) => void
}

const OPTIONS = RELEASE_STATUSES.map((status) => ({
  value: status,
  label: RELEASE_STATUS_LABEL[status],
  icon: <span className="size-2 rounded-full" style={{ background: RELEASE_STATUS_COLOR[status] }} />,
}))

export function ReleaseStatusPicker({ value, onChange }: Props) {
  return <Picker value={value} options={OPTIONS} onChange={(next) => next && onChange(next)} placeholder="Status" />
}
