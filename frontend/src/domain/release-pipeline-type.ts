import type { ReleasePipelineType } from '@/graphql/generated/graphql'

export const RELEASE_PIPELINE_TYPES: readonly ReleasePipelineType[] = ['SCHEDULED', 'CONTINUOUS']

export const RELEASE_PIPELINE_TYPE_LABEL: Record<ReleasePipelineType, string> = {
  SCHEDULED: 'Scheduled',
  CONTINUOUS: 'Continuous',
}
