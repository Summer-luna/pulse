import { graphql } from '@/graphql/generated'
import type { CreateReleaseInput, ReleaseFieldsFragment, UpdateReleaseInput } from '@/graphql/generated/graphql'
import { graphqlClient } from './graphql-client'

const ReleasesQuery = graphql(`
  query Releases($projectId: ID) {
    releases(projectId: $projectId) {
      ...ReleaseFields
    }
  }
`)

const ReleaseQuery = graphql(`
  query Release($id: ID!) {
    release(id: $id) {
      ...ReleaseFields
    }
  }
`)

const CreateReleaseMutation = graphql(`
  mutation CreateRelease($input: CreateReleaseInput!) {
    createRelease(input: $input) {
      ...ReleaseFields
    }
  }
`)

const UpdateReleaseMutation = graphql(`
  mutation UpdateRelease($id: ID!, $input: UpdateReleaseInput!) {
    updateRelease(id: $id, input: $input) {
      ...ReleaseFields
    }
  }
`)

const DeleteReleaseMutation = graphql(`
  mutation DeleteRelease($id: ID!) {
    deleteRelease(id: $id) {
      id
    }
  }
`)

class ReleaseRepository {
  async list(projectId?: string): Promise<ReleaseFieldsFragment[]> {
    const data = await graphqlClient.request(ReleasesQuery, { projectId })
    return data.releases
  }

  async get(id: string): Promise<ReleaseFieldsFragment> {
    const data = await graphqlClient.request(ReleaseQuery, { id })
    return data.release
  }

  async create(input: CreateReleaseInput): Promise<ReleaseFieldsFragment> {
    const data = await graphqlClient.request(CreateReleaseMutation, { input })
    return data.createRelease
  }

  async update(id: string, input: UpdateReleaseInput): Promise<ReleaseFieldsFragment> {
    const data = await graphqlClient.request(UpdateReleaseMutation, { id, input })
    return data.updateRelease
  }

  async remove(id: string): Promise<void> {
    await graphqlClient.request(DeleteReleaseMutation, { id })
  }
}

export const releaseRepository = new ReleaseRepository()
