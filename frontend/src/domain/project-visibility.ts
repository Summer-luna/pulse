import type { ProjectVisibility } from '@/graphql/generated/graphql'

export const PROJECT_VISIBILITIES: readonly ProjectVisibility[] = ['PUBLIC', 'PRIVATE']

export const PROJECT_VISIBILITY_LABEL: Record<ProjectVisibility, string> = {
  PUBLIC: 'Public to workspace',
  PRIVATE: 'Private to members',
}
