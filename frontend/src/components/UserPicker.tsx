import { useUsersController } from '@/controllers/use-users-controller'
import { Avatar, UnassignedAvatar } from '@/ui/Avatar'
import { Picker } from '@/ui/Picker'

interface Props {
  value: string | null
  onChange: (userId: string | null) => void
  placeholder: string
  noneLabel: string
  iconOnly?: boolean
  align?: 'left' | 'right'
}

export function UserPicker({ value, onChange, placeholder, noneLabel, iconOnly, align }: Props) {
  const { users } = useUsersController()
  const options = users.map((user) => ({
    value: user.id,
    label: user.name,
    icon: <Avatar name={user.name} color={user.color} />,
  }))

  return (
    <Picker
      value={value}
      options={options}
      onChange={onChange}
      placeholder={placeholder}
      noneLabel={noneLabel}
      noneIcon={<UnassignedAvatar />}
      iconOnly={iconOnly}
      align={align}
      searchable
    />
  )
}
