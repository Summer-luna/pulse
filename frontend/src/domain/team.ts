import type { TeamAccess } from '@/graphql/generated/graphql'

export const TEAM_ACCESSES: readonly TeamAccess[] = ['PUBLIC', 'PRIVATE']

export const TEAM_ACCESS_LABEL: Record<TeamAccess, string> = {
  PUBLIC: 'Public to workspace',
  PRIVATE: 'Private to team members',
}
