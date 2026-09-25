import { PROJECT_VISIBILITIES, PROJECT_VISIBILITY_LABEL } from '@/domain/project-visibility'
import type { ProjectVisibility } from '@/graphql/generated/graphql'
import { Picker } from '@/ui/Picker'

interface Props {
  value: ProjectVisibility
  onChange: (visibility: ProjectVisibility) => void
  align?: 'left' | 'right'
}

const OPTIONS = PROJECT_VISIBILITIES.map((visibility) => ({ value: visibility, label: PROJECT_VISIBILITY_LABEL[visibility] }))

export function ProjectVisibilityPicker({ value, onChange, align }: Props) {
  return (
    <Picker value={value} options={OPTIONS} onChange={(next) => next && onChange(next)} placeholder="Visibility" align={align} />
  )
}
