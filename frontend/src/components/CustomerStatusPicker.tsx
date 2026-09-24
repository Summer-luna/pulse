import { CUSTOMER_STATUS_COLOR, CUSTOMER_STATUS_LABEL, CUSTOMER_STATUSES } from '@/domain/customer'
import type { CustomerStatus } from '@/graphql/generated/graphql'
import { Picker } from '@/ui/Picker'

interface Props {
  value: CustomerStatus
  onChange: (status: CustomerStatus) => void
  counts?: Record<CustomerStatus, number>
}

export function CustomerStatusPicker({ value, onChange, counts }: Props) {
  const options = CUSTOMER_STATUSES.map((status) => ({
    value: status,
    label: CUSTOMER_STATUS_LABEL[status],
    hint: counts ? String(counts[status]) : undefined,
    icon: <span className="size-2 rounded-full" style={{ background: CUSTOMER_STATUS_COLOR[status] }} />,
  }))

  return <Picker value={value} options={options} onChange={(next) => next && onChange(next)} placeholder="Status" />
}
