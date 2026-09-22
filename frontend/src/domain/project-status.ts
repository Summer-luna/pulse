import type { ProjectStatus } from '@/graphql/generated/graphql'

export const PROJECT_STATUSES: readonly ProjectStatus[] = ['BACKLOG', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED']

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  BACKLOG: 'Backlog',
  PLANNED: 'Planned',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELED: 'Canceled',
}

export const PROJECT_STATUS_COLOR: Record<ProjectStatus, string> = {
  BACKLOG: '#8a8f98',
  PLANNED: '#c3c6cc',
  IN_PROGRESS: '#f2c94c',
  COMPLETED: '#5e6ad2',
  CANCELED: '#8a8f98',
}
