import type { IssueStatus } from '@/graphql/generated/graphql'

export const ISSUE_STATUSES: readonly IssueStatus[] = [
  'BACKLOG',
  'TODO',
  'IN_PROGRESS',
  'BLOCKED',
  'IN_REVIEW',
  'DONE',
  'CANCELED',
]

export const ISSUE_STATUS_LABEL: Record<IssueStatus, string> = {
  BACKLOG: 'Backlog',
  TODO: 'Todo',
  IN_PROGRESS: 'In Progress',
  BLOCKED: 'Blocked',
  IN_REVIEW: 'In Review',
  DONE: 'Done',
  CANCELED: 'Canceled',
}

export const ISSUE_STATUS_COLOR: Record<IssueStatus, string> = {
  BACKLOG: '#8a8f98',
  TODO: '#c3c6cc',
  IN_PROGRESS: '#f2c94c',
  BLOCKED: '#eb5757',
  IN_REVIEW: '#4cb782',
  DONE: '#5e6ad2',
  CANCELED: '#8a8f98',
}
