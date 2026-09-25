import type { IssuesFilterInput } from '@/graphql/generated/graphql'

export const queryKeys = {
  users: ['users'] as const,
  labels: ['labels'] as const,
  projects: ['projects'] as const,
  project: (id: string) => ['project', id] as const,
  issues: (filter: IssuesFilterInput) => ['issues', filter] as const,
  issuesRoot: ['issues'] as const,
  issue: (identifier: string) => ['issue', identifier] as const,
  releases: (projectId: string | undefined) => ['releases', projectId ?? 'all'] as const,
  release: (id: string) => ['release', id] as const,
  releasePipelines: (projectId: string | undefined) => ['releasePipelines', projectId ?? 'all'] as const,
  releasePipeline: (id: string) => ['releasePipeline', id] as const,
  requests: (projectId: string | undefined, customerId?: string) =>
    ['requests', projectId ?? 'all', customerId ?? 'all'] as const,
  customers: ['customers'] as const,
  customer: (id: string) => ['customer', id] as const,
  teams: ['teams'] as const,
}
