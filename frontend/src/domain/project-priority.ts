import type { ProjectPriority } from '@/graphql/generated/graphql'

export const PROJECT_PRIORITIES: readonly ProjectPriority[] = ['NO_PRIORITY', 'URGENT', 'HIGH', 'MEDIUM', 'LOW']

export const PROJECT_PRIORITY_LABEL: Record<ProjectPriority, string> = {
  NO_PRIORITY: 'No priority',
  URGENT: 'Urgent',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
}
