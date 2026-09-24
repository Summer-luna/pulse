import { useCustomersController } from '@/controllers/use-customers-controller'
import { Picker } from '@/ui/Picker'

interface Props {
  value: string | null
  onChange: (customerId: string | null) => void
  align?: 'left' | 'right'
}

export function CustomerPicker({ value, onChange, align }: Props) {
  const { customers } = useCustomersController()
  const options = customers.map((customer) => ({ value: customer.id, label: customer.name }))

  return (
    <Picker
      value={value}
      options={options}
      onChange={onChange}
      placeholder="Customer"
      noneLabel="No customer"
      align={align}
      searchable
    />
  )
}
