import { describe, expect, it } from 'vitest'
import type { Issue } from '@/domain/types'
import { issueService } from './issue-service'

function issue(overrides: Partial<Issue> & { id: string }): Issue {
  return {
    identifier: `WEB-${overrides.number ?? 1}`,
    number: 1,
    title: 'Issue',
    status: 'TODO',
    priority: 'NO_PRIORITY',
    projectId: 'p1',
    parentId: null,
    releaseId: null,
    assigneeId: null,
    dueDate: null,
    completedAt: null,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    assignee: null,
    release: null,
    subIssueProgress: null,
    ...overrides,
  } as Issue
}

describe('issueService', () => {
  it('sorts by priority first, then newest', () => {
    const sorted = issueService.sort([
      issue({ id: 'low', priority: 'LOW' }),
      issue({ id: 'none-old', createdAt: '2026-01-01T00:00:00Z' }),
      issue({ id: 'urgent', priority: 'URGENT' }),
      issue({ id: 'none-new', createdAt: '2026-02-01T00:00:00Z' }),
    ])
    expect(sorted.map((i) => i.id)).toEqual(['urgent', 'low', 'none-new', 'none-old'])
  })

  it('groups by workflow order and can drop empty sections', () => {
    const issues = [issue({ id: 'a', status: 'DONE' }), issue({ id: 'b', status: 'IN_PROGRESS' })]
    expect(issueService.groupByStatus(issues, { includeEmpty: false }).map((s) => s.status)).toEqual(['IN_PROGRESS', 'DONE'])
    expect(issueService.groupByStatus(issues, { includeEmpty: true })).toHaveLength(6)
  })

  it('filters by identifier or title and can hide sub-issues', () => {
    const issues = [
      issue({ id: 'a', number: 1, title: 'Login page' }),
      issue({ id: 'b', number: 2, title: 'Signup', parentId: 'a' }),
    ]
    expect(issueService.filter(issues, { search: 'web-2', hideSubIssues: false }).map((i) => i.id)).toEqual(['b'])
    expect(issueService.filter(issues, { search: 'LOGIN', hideSubIssues: false }).map((i) => i.id)).toEqual(['a'])
    expect(issueService.filter(issues, { search: '', hideSubIssues: true }).map((i) => i.id)).toEqual(['a'])
  })

  it('collects descendants at any depth', () => {
    const issues = [
      issue({ id: 'root' }),
      issue({ id: 'child', parentId: 'root' }),
      issue({ id: 'grandchild', parentId: 'child' }),
      issue({ id: 'other' }),
    ]
    expect([...issueService.descendantIds('root', issues)].sort()).toEqual(['child', 'grandchild'])
  })

  it('never offers an issue, its descendants or other projects as a parent', () => {
    const issues = [
      issue({ id: 'root' }),
      issue({ id: 'child', parentId: 'root' }),
      issue({ id: 'sibling' }),
      issue({ id: 'foreign', projectId: 'p2' }),
    ]
    const candidates = issueService.parentCandidates({ id: 'root', projectId: 'p1' }, issues)
    expect(candidates.map((i) => i.id)).toEqual(['sibling'])
  })

  describe('toCreateInput', () => {
    it('trims the title and normalizes empty dates', () => {
      const input = issueService.toCreateInput(issueService.emptyDraft('p1', { title: '  Hello ', dueDate: '' }))
      expect(input.title).toBe('Hello')
      expect(input.dueDate).toBeNull()
    })

    it('rejects blank titles', () => {
      expect(() => issueService.toCreateInput(issueService.emptyDraft('p1', { title: '   ' }))).toThrow('title')
    })
  })
})
