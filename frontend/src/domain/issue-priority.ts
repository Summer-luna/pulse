import type { IssuePriority } from '@/graphql/generated/graphql'

export const ISSUE_PRIORITIES: readonly IssuePriority[] = ['NO_PRIORITY', 'URGENT', 'HIGH', 'MEDIUM', 'LOW']

export const ISSUE_PRIORITY_LABEL: Record<IssuePriority, string> = {
  NO_PRIORITY: 'No priority',
  URGENT: 'Urgent',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
}

export const ISSUE_PRIORITY_RANK: Record<IssuePriority, number> = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
  NO_PRIORITY: 4,
}
