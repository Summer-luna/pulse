import type { ReleasePipeline } from '@/domain/types'
import { Picker } from '@/ui/Picker'
import { ProjectBadge } from './ProjectBadge'

interface Props {
  value: string
  pipelines: ReleasePipeline[]
  onChange: (pipelineId: string) => void
}

export function PipelinePicker({ value, pipelines, onChange }: Props) {
  const options = pipelines.map((pipeline) => ({
    value: pipeline.id,
    label: pipeline.name,
    hint: pipeline.project.key,
    icon: <ProjectBadge projectKey={pipeline.project.key} size={16} />,
  }))

  return <Picker value={value} options={options} onChange={(next) => next && onChange(next)} placeholder="Pipeline" />
}
