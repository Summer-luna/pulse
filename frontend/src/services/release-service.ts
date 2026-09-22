import type { Issue, Release } from '@/domain/types'
import type { CreateReleaseInput, ReleaseStatus, UpdateReleaseInput } from '@/graphql/generated/graphql'
import { issueRepository } from '@/repositories/issue-repository'
import { releaseRepository } from '@/repositories/release-repository'

export interface ReleaseDraft {
  projectId: string
  name: string
  version: string
  description: string
  status: ReleaseStatus
  targetDate: string | null
}

export interface ProjectReleases {
  projectId: string
  projectName: string
  releases: Release[]
}

const DAY_MS = 86_400_000

function startOfDay(value: Date): number {
  return Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
}

function parseDate(value: string): number {
  const [year, month, day] = value.split('-').map(Number)
  return Date.UTC(year, month - 1, day)
}

class ReleaseService {
  list(projectId?: string): Promise<Release[]> {
    return releaseRepository.list(projectId)
  }

  get(id: string): Promise<Release> {
    return releaseRepository.get(id)
  }

  create(draft: ReleaseDraft): Promise<Release> {
    return releaseRepository.create(this.toCreateInput(draft))
  }

  update(id: string, input: UpdateReleaseInput): Promise<Release> {
    return releaseRepository.update(id, input)
  }

  remove(id: string): Promise<void> {
    return releaseRepository.remove(id)
  }

  async addIssue(releaseId: string, issueId: string): Promise<void> {
    await issueRepository.update(issueId, { releaseId })
  }

  async removeIssue(issueId: string): Promise<void> {
    await issueRepository.update(issueId, { releaseId: null })
  }

  emptyDraft(projectId: string): ReleaseDraft {
    return { projectId, name: '', version: '', description: '', status: 'PLANNED', targetDate: null }
  }

  toCreateInput(draft: ReleaseDraft): CreateReleaseInput {
    const name = draft.name.trim()
    if (!name) {
      throw new Error('Release name is required')
    }
    if (!draft.projectId) {
      throw new Error('Choose a project for the release')
    }
    return {
      projectId: draft.projectId,
      name,
      version: draft.version.trim() || null,
      description: draft.description.trim(),
      status: draft.status,
      targetDate: draft.targetDate || null,
    }
  }

  displayName(release: Pick<Release, 'name' | 'version'>): string {
    return release.version ? `${release.name} (${release.version})` : release.name
  }

  isOverdue(release: Release, now: Date = new Date()): boolean {
    const open = release.status === 'PLANNED' || release.status === 'IN_PROGRESS'
    return open && release.targetDate !== null && parseDate(release.targetDate) < startOfDay(now)
  }

  scheduleLabel(release: Release, now: Date = new Date()): string {
    if (release.status === 'COMPLETED' && release.releasedAt) {
      return `Released ${new Date(release.releasedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`
    }
    if (release.status === 'CANCELED') {
      return 'Canceled'
    }
    if (!release.targetDate) {
      return 'No target date'
    }
    const days = Math.round((parseDate(release.targetDate) - startOfDay(now)) / DAY_MS)
    if (days === 0) {
      return 'Due today'
    }
    if (days < 0) {
      return `Overdue by ${-days} ${-days === 1 ? 'day' : 'days'}`
    }
    return `Due in ${days} ${days === 1 ? 'day' : 'days'}`
  }

  groupByProject(releases: Release[]): ProjectReleases[] {
    const groups = new Map<string, ProjectReleases>()
    for (const release of releases) {
      const group = groups.get(release.projectId) ?? {
        projectId: release.projectId,
        projectName: release.project.name,
        releases: [],
      }
      group.releases.push(release)
      groups.set(release.projectId, group)
    }
    return [...groups.values()].sort((a, b) => a.projectName.localeCompare(b.projectName))
  }

  assignableIssues(release: Pick<Release, 'id' | 'projectId'>, projectIssues: Issue[]): Issue[] {
    return projectIssues.filter(
      (issue) => issue.projectId === release.projectId && issue.releaseId !== release.id && issue.status !== 'CANCELED',
    )
  }
}

export const releaseService = new ReleaseService()
