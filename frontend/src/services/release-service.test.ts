import { describe, expect, it } from 'vitest'
import type { Release } from '@/domain/types'
import { projectService } from './project-service'
import { releaseService } from './release-service'

function release(overrides: Partial<Release>): Release {
  return {
    id: 'r1',
    projectId: 'p1',
    pipelineId: 'pl1',
    name: 'Launch',
    version: null,
    description: '',
    status: 'PLANNED',
    targetDate: null,
    releasedAt: null,
    createdAt: '2026-01-01T00:00:00Z',
    project: { id: 'p1', key: 'WEB', name: 'Web' },
    progress: { total: 0, completed: 0 },
    ...overrides,
  } as Release
}

const NOW = new Date(2026, 5, 15, 12)

describe('releaseService', () => {
  it('describes upcoming, due and overdue releases', () => {
    expect(releaseService.scheduleLabel(release({ targetDate: '2026-06-20' }), NOW)).toBe('Due in 5 days')
    expect(releaseService.scheduleLabel(release({ targetDate: '2026-06-16' }), NOW)).toBe('Due in 1 day')
    expect(releaseService.scheduleLabel(release({ targetDate: '2026-06-15' }), NOW)).toBe('Due today')
    expect(releaseService.scheduleLabel(release({ targetDate: '2026-06-12' }), NOW)).toBe('Overdue by 3 days')
    expect(releaseService.scheduleLabel(release({}), NOW)).toBe('No target date')
  })

  it('only flags open releases as overdue', () => {
    expect(releaseService.isOverdue(release({ targetDate: '2026-06-01' }), NOW)).toBe(true)
    expect(releaseService.isOverdue(release({ targetDate: '2026-06-01', status: 'COMPLETED' }), NOW)).toBe(false)
    expect(releaseService.isOverdue(release({ targetDate: '2026-06-20' }), NOW)).toBe(false)
  })

  it('formats name with version', () => {
    expect(releaseService.displayName({ name: 'Launch', version: 'v1.0' })).toBe('Launch (v1.0)')
    expect(releaseService.displayName({ name: 'Launch', version: null })).toBe('Launch')
  })
})

describe('projectService', () => {
  it('suggests a key from initials or the first word', () => {
    expect(projectService.suggestKey('Web App')).toBe('WA')
    expect(projectService.suggestKey('Mobile')).toBe('MOBIL')
    expect(projectService.suggestKey('123')).toBe('')
  })

  it('validates the key', () => {
    const draft = { ...projectService.emptyDraft(), name: 'Web', key: 'w1' }
    expect(() => projectService.toCreateInput(draft)).toThrow('2-5 letters')
    expect(projectService.toCreateInput({ ...draft, key: 'web' }).key).toBe('WEB')
  })
})
