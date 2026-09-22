import type { ReleaseStatus } from '@/graphql/generated/graphql'

export const RELEASE_STATUSES: readonly ReleaseStatus[] = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED']

export const RELEASE_STATUS_LABEL: Record<ReleaseStatus, string> = {
  PLANNED: 'Planned',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELED: 'Canceled',
}

export const RELEASE_STATUS_COLOR: Record<ReleaseStatus, string> = {
  PLANNED: '#c3c6cc',
  IN_PROGRESS: '#f2c94c',
  COMPLETED: '#5e6ad2',
  CANCELED: '#8a8f98',
}
