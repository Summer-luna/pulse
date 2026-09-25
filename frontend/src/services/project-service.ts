import type { Project } from '@/domain/types'
import type { CreateProjectInput, ProjectPriority, ProjectStatus, UpdateProjectInput } from '@/graphql/generated/graphql'
import { projectRepository } from '@/repositories/project-repository'

export interface ProjectDraft {
  name: string
  key: string
  description: string
  status: ProjectStatus
  priority: ProjectPriority
  leadId: string | null
  teamId: string | null
  memberIds: string[]
  startDate: string | null
  targetDate: string | null
}

const KEY_PATTERN = /^[A-Za-z]{2,5}$/

class ProjectService {
  list(): Promise<Project[]> {
    return projectRepository.list()
  }

  get(id: string): Promise<Project> {
    return projectRepository.get(id)
  }

  create(draft: ProjectDraft): Promise<Project> {
    return projectRepository.create(this.toCreateInput(draft))
  }

  update(id: string, input: UpdateProjectInput): Promise<Project> {
    return projectRepository.update(id, input)
  }

  remove(id: string): Promise<void> {
    return projectRepository.remove(id)
  }

  emptyDraft(): ProjectDraft {
    return {
      name: '',
      key: '',
      description: '',
      status: 'PLANNED',
      priority: 'NO_PRIORITY',
      leadId: null,
      teamId: null,
      memberIds: [],
      startDate: null,
      targetDate: null,
    }
  }

  suggestKey(name: string): string {
    const words = name.match(/[A-Za-z]+/g) ?? []
    const initials = words.length > 1 ? words.map((word) => word[0]).join('') : (words[0] ?? '')
    return initials.slice(0, 5).toUpperCase()
  }

  toCreateInput(draft: ProjectDraft): CreateProjectInput {
    const name = draft.name.trim()
    const key = draft.key.trim()
    if (!name) {
      throw new Error('Project name is required')
    }
    if (!KEY_PATTERN.test(key)) {
      throw new Error('Project key must be 2-5 letters')
    }
    return {
      name,
      key: key.toUpperCase(),
      description: draft.description.trim(),
      status: draft.status,
      priority: draft.priority,
      leadId: draft.leadId,
      teamId: draft.teamId,
      memberIds: draft.memberIds,
      startDate: draft.startDate || null,
      targetDate: draft.targetDate || null,
    }
  }
}

export const projectService = new ProjectService()
