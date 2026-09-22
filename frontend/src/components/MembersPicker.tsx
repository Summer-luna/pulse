import { Users } from 'lucide-react'
import { useUsersController } from '@/controllers/use-users-controller'
import { Avatar } from '@/ui/Avatar'
import { MultiPicker } from '@/ui/MultiPicker'

interface Props {
  values: string[]
  onChange: (userIds: string[]) => void
  align?: 'left' | 'right'
}

export function MembersPicker({ values, onChange, align }: Props) {
  const { users } = useUsersController()
  const options = users.map((user) => ({
    value: user.id,
    label: user.name,
    icon: <Avatar name={user.name} color={user.color} size={16} />,
  }))

  return (
    <MultiPicker
      values={values}
      options={options}
      onChange={onChange}
      placeholder="Members"
      triggerIcon={<Users size={14} className="text-faint" />}
      align={align}
      searchable
    />
  )
}
