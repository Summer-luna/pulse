import type { Project } from '@/domain/types'
import { Picker } from '@/ui/Picker'
import { ProjectBadge } from './ProjectBadge'

interface Props {
  value: string
  projects: Project[]
  onChange: (projectId: string) => void
  align?: 'left' | 'right'
}

export function ProjectPicker({ value, projects, onChange, align = 'left' }: Props) {
  const options = projects.map((project) => ({
    value: project.id,
    label: project.name,
    hint: project.key,
    icon: <ProjectBadge projectKey={project.key} size={16} />,
  }))

  return <Picker value={value} options={options} onChange={(next) => next && onChange(next)} placeholder="Project" align={align} searchable />
}
