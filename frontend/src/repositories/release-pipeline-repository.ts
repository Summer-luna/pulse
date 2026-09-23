import { graphql } from '@/graphql/generated'
import type { CreateReleasePipelineInput, ReleasePipelineFieldsFragment, UpdateReleasePipelineInput } from '@/graphql/generated/graphql'
import { graphqlClient } from './graphql-client'

const ReleasePipelinesQuery = graphql(`
  query ReleasePipelines($projectId: ID) {
    releasePipelines(projectId: $projectId) {
      ...ReleasePipelineFields
    }
  }
`)

const ReleasePipelineQuery = graphql(`
  query ReleasePipeline($id: ID!) {
    releasePipeline(id: $id) {
      ...ReleasePipelineFields
    }
  }
`)

const CreateReleasePipelineMutation = graphql(`
  mutation CreateReleasePipeline($input: CreateReleasePipelineInput!) {
    createReleasePipeline(input: $input) {
      ...ReleasePipelineFields
    }
  }
`)

const UpdateReleasePipelineMutation = graphql(`
  mutation UpdateReleasePipeline($id: ID!, $input: UpdateReleasePipelineInput!) {
    updateReleasePipeline(id: $id, input: $input) {
      ...ReleasePipelineFields
    }
  }
`)

const DeleteReleasePipelineMutation = graphql(`
  mutation DeleteReleasePipeline($id: ID!) {
    deleteReleasePipeline(id: $id) {
      id
    }
  }
`)

class ReleasePipelineRepository {
  async list(projectId?: string): Promise<ReleasePipelineFieldsFragment[]> {
    const data = await graphqlClient.request(ReleasePipelinesQuery, { projectId })
    return data.releasePipelines
  }

  async get(id: string): Promise<ReleasePipelineFieldsFragment> {
    const data = await graphqlClient.request(ReleasePipelineQuery, { id })
    return data.releasePipeline
  }

  async create(input: CreateReleasePipelineInput): Promise<ReleasePipelineFieldsFragment> {
    const data = await graphqlClient.request(CreateReleasePipelineMutation, { input })
    return data.createReleasePipeline
  }

  async update(id: string, input: UpdateReleasePipelineInput): Promise<ReleasePipelineFieldsFragment> {
    const data = await graphqlClient.request(UpdateReleasePipelineMutation, { id, input })
    return data.updateReleasePipeline
  }

  async remove(id: string): Promise<void> {
    await graphqlClient.request(DeleteReleasePipelineMutation, { id })
  }
}

export const releasePipelineRepository = new ReleasePipelineRepository()
