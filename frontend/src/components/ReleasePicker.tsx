import { Package } from 'lucide-react'
import type { Release } from '@/domain/types'
import { releaseService } from '@/services/release-service'
import { Picker } from '@/ui/Picker'

interface Props {
  value: string | null
  releases: Release[]
  onChange: (releaseId: string | null) => void
  align?: 'left' | 'right'
}

export function ReleasePicker({ value, releases, onChange, align }: Props) {
  const options = releases.map((release) => ({
    value: release.id,
    label: releaseService.displayName(release),
    icon: <Package size={14} className="text-dim" />,
  }))

  return (
    <Picker
      value={value}
      options={options}
      onChange={onChange}
      placeholder="No release"
      noneLabel="No release"
      noneIcon={<Package size={14} className="text-faint" />}
      align={align}
      searchable
    />
  )
}
