import type { ReleasePipeline } from '@/domain/types'
import type { CreateReleasePipelineInput, ReleasePipelineType } from '@/graphql/generated/graphql'
import { releasePipelineRepository } from '@/repositories/release-pipeline-repository'

export interface ReleasePipelineDraft {
  projectId: string
  name: string
  type: ReleasePipelineType
}

class ReleasePipelineService {
  list(projectId?: string): Promise<ReleasePipeline[]> {
    return releasePipelineRepository.list(projectId)
  }

  get(id: string): Promise<ReleasePipeline> {
    return releasePipelineRepository.get(id)
  }

  create(draft: ReleasePipelineDraft): Promise<ReleasePipeline> {
    return releasePipelineRepository.create(this.toCreateInput(draft))
  }

  remove(id: string): Promise<void> {
    return releasePipelineRepository.remove(id)
  }

  emptyDraft(projectId = ''): ReleasePipelineDraft {
    return { projectId, name: '', type: 'CONTINUOUS' }
  }

  toCreateInput(draft: ReleasePipelineDraft): CreateReleasePipelineInput {
    const name = draft.name.trim()
    if (!name) {
      throw new Error('Pipeline name is required')
    }
    if (!draft.projectId) {
      throw new Error('Choose a project for the pipeline')
    }
    return { projectId: draft.projectId, name, type: draft.type }
  }

  filter(pipelines: ReleasePipeline[], search: string): ReleasePipeline[] {
    const needle = search.trim().toLowerCase()
    return needle ? pipelines.filter((pipeline) => pipeline.name.toLowerCase().includes(needle)) : pipelines
  }
}

export const releasePipelineService = new ReleasePipelineService()
