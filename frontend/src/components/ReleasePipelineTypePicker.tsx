import { RELEASE_PIPELINE_TYPE_LABEL, RELEASE_PIPELINE_TYPES } from '@/domain/release-pipeline-type'
import type { ReleasePipelineType } from '@/graphql/generated/graphql'
import { Picker } from '@/ui/Picker'

interface Props {
  value: ReleasePipelineType
  onChange: (type: ReleasePipelineType) => void
}

const OPTIONS = RELEASE_PIPELINE_TYPES.map((type) => ({ value: type, label: RELEASE_PIPELINE_TYPE_LABEL[type] }))

export function ReleasePipelineTypePicker({ value, onChange }: Props) {
  return <Picker value={value} options={OPTIONS} onChange={(next) => next && onChange(next)} placeholder="Type" />
}
