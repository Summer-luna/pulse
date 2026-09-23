import { ISSUE_PRIORITY_RANK } from '@/domain/issue-priority'
import { ISSUE_STATUSES } from '@/domain/issue-status'
import type { Issue, IssueDetail } from '@/domain/types'
import type { CreateIssueInput, IssuePriority, IssueStatus, IssuesFilterInput, UpdateIssueInput } from '@/graphql/generated/graphql'
import { issueRepository } from '@/repositories/issue-repository'

export interface IssueDraft {
  projectId: string
  title: string
  description: string
  status: IssueStatus
  priority: IssuePriority
  estimate: number | null
  assigneeId: string | null
  releaseId: string | null
  parentId: string | null
  dueDate: string | null
  labelIds: string[]
}

export interface IssueFilterState {
  search: string
  hideSubIssues: boolean
}

export interface StatusSection {
  status: IssueStatus
  issues: Issue[]
}

export interface NestedIssueRow {
  issue: Issue
  depth: number
}

class IssueService {
  list(filter?: IssuesFilterInput): Promise<Issue[]> {
    return issueRepository.list(filter)
  }

  getDetail(identifier: string): Promise<IssueDetail> {
    return issueRepository.getByIdentifier(identifier)
  }

  create(draft: IssueDraft): Promise<Issue> {
    return issueRepository.create(this.toCreateInput(draft))
  }

  createSubIssue(parent: Pick<Issue, 'id' | 'projectId' | 'releaseId'>, title: string): Promise<Issue> {
    return this.create(this.emptyDraft(parent.projectId, { title, parentId: parent.id, releaseId: parent.releaseId }))
  }

  update(id: string, input: UpdateIssueInput): Promise<Issue> {
    return issueRepository.update(id, input)
  }

  async remove(id: string): Promise<void> {
    await issueRepository.remove(id)
  }

  emptyDraft(projectId: string, overrides: Partial<IssueDraft> = {}): IssueDraft {
    return {
      projectId,
      title: '',
      description: '',
      status: 'BACKLOG',
      priority: 'NO_PRIORITY',
      estimate: null,
      assigneeId: null,
      releaseId: null,
      parentId: null,
      dueDate: null,
      labelIds: [],
      ...overrides,
    }
  }

  toCreateInput(draft: IssueDraft): CreateIssueInput {
    const title = draft.title.trim()
    if (!title) {
      throw new Error('Issue title is required')
    }
    if (!draft.projectId) {
      throw new Error('Choose a project for the issue')
    }
    return {
      projectId: draft.projectId,
      title,
      description: draft.description.trim(),
      status: draft.status,
      priority: draft.priority,
      estimate: draft.estimate,
      assigneeId: draft.assigneeId,
      releaseId: draft.releaseId,
      parentId: draft.parentId,
      dueDate: draft.dueDate || null,
      labelIds: draft.labelIds,
    }
  }

  applyLocalPatch(issue: Issue, input: UpdateIssueInput): Issue {
    return {
      ...issue,
      ...(input.status ? { status: input.status } : {}),
      ...(input.priority ? { priority: input.priority } : {}),
      ...(input.title ? { title: input.title } : {}),
    }
  }

  sort(issues: Issue[]): Issue[] {
    return [...issues].sort(
      (a, b) =>
        ISSUE_PRIORITY_RANK[a.priority] - ISSUE_PRIORITY_RANK[b.priority] ||
        b.createdAt.localeCompare(a.createdAt) ||
        b.number - a.number,
    )
  }

  filter(issues: Issue[], { search, hideSubIssues }: IssueFilterState): Issue[] {
    const needle = search.trim().toLowerCase()
    return issues.filter((issue) => {
      if (hideSubIssues && issue.parentId) {
        return false
      }
      return !needle || issue.title.toLowerCase().includes(needle) || issue.identifier.toLowerCase().includes(needle)
    })
  }

  groupByStatus(issues: Issue[], options: { includeEmpty: boolean }): StatusSection[] {
    const sorted = this.sort(issues)
    return ISSUE_STATUSES.map((status) => ({ status, issues: sorted.filter((issue) => issue.status === status) })).filter(
      (section) => options.includeEmpty || section.issues.length > 0,
    )
  }

  /** Orders issues so each parent is immediately followed by its children (present in the same list), indented. */
  nest(issues: Issue[]): NestedIssueRow[] {
    const idsInList = new Set(issues.map((issue) => issue.id))
    const childrenByParent = new Map<string, Issue[]>()
    for (const issue of issues) {
      if (issue.parentId && idsInList.has(issue.parentId)) {
        childrenByParent.set(issue.parentId, [...(childrenByParent.get(issue.parentId) ?? []), issue])
      }
    }
    const childIds = new Set(issues.filter((issue) => issue.parentId && idsInList.has(issue.parentId)).map((issue) => issue.id))

    const rows: NestedIssueRow[] = []
    const addWithChildren = (issue: Issue, depth: number) => {
      rows.push({ issue, depth })
      for (const child of childrenByParent.get(issue.id) ?? []) {
        addWithChildren(child, depth + 1)
      }
    }
    for (const issue of issues) {
      if (!childIds.has(issue.id)) {
        addWithChildren(issue, 0)
      }
    }
    return rows
  }

  descendantIds(rootId: string, issues: Issue[]): Set<string> {
    const childrenByParent = new Map<string, string[]>()
    for (const issue of issues) {
      if (issue.parentId) {
        childrenByParent.set(issue.parentId, [...(childrenByParent.get(issue.parentId) ?? []), issue.id])
      }
    }
    const found = new Set<string>()
    const queue = [rootId]
    while (queue.length > 0) {
      for (const childId of childrenByParent.get(queue.shift()!) ?? []) {
        if (!found.has(childId)) {
          found.add(childId)
          queue.push(childId)
        }
      }
    }
    return found
  }

  parentCandidates(issue: Pick<Issue, 'id' | 'projectId'>, projectIssues: Issue[]): Issue[] {
    const excluded = this.descendantIds(issue.id, projectIssues)
    excluded.add(issue.id)
    return this.sort(projectIssues.filter((candidate) => candidate.projectId === issue.projectId && !excluded.has(candidate.id)))
  }
}

export const issueService = new IssueService()
