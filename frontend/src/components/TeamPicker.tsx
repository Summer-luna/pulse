import { Users } from 'lucide-react'
import { useTeamsController } from '@/controllers/use-teams-controller'
import { Picker } from '@/ui/Picker'

interface Props {
  value: string | null
  onChange: (teamId: string | null) => void
  align?: 'left' | 'right'
}

export function TeamPicker({ value, onChange, align }: Props) {
  const { teams } = useTeamsController()
  const options = teams.map((team) => ({
    value: team.id,
    label: team.name,
    hint: team.key,
    icon: <Users size={14} className="text-faint" />,
  }))

  return (
    <Picker
      value={value}
      options={options}
      onChange={onChange}
      placeholder="No team"
      noneLabel="No team"
      align={align}
      searchable
    />
  )
}
