import { graphql } from '@/graphql/generated'
import type { CreateRequestInput, RequestFieldsFragment, UpdateRequestInput } from '@/graphql/generated/graphql'
import { graphqlClient } from './graphql-client'

const RequestsQuery = graphql(`
  query Requests($projectId: ID) {
    requests(projectId: $projectId) {
      ...RequestFields
    }
  }
`)

const CreateRequestMutation = graphql(`
  mutation CreateRequest($input: CreateRequestInput!) {
    createRequest(input: $input) {
      ...RequestFields
    }
  }
`)

const UpdateRequestMutation = graphql(`
  mutation UpdateRequest($id: ID!, $input: UpdateRequestInput!) {
    updateRequest(id: $id, input: $input) {
      ...RequestFields
    }
  }
`)

const DeleteRequestMutation = graphql(`
  mutation DeleteRequest($id: ID!) {
    deleteRequest(id: $id) {
      id
    }
  }
`)

const ConvertRequestToIssueMutation = graphql(`
  mutation ConvertRequestToIssue($id: ID!, $issueId: ID!) {
    convertRequestToIssue(id: $id, issueId: $issueId) {
      ...RequestFields
    }
  }
`)

class RequestRepository {
  async list(projectId?: string): Promise<RequestFieldsFragment[]> {
    const data = await graphqlClient.request(RequestsQuery, { projectId })
    return data.requests
  }

  async create(input: CreateRequestInput): Promise<RequestFieldsFragment> {
    const data = await graphqlClient.request(CreateRequestMutation, { input })
    return data.createRequest
  }

  async update(id: string, input: UpdateRequestInput): Promise<RequestFieldsFragment> {
    const data = await graphqlClient.request(UpdateRequestMutation, { id, input })
    return data.updateRequest
  }

  async remove(id: string): Promise<void> {
    await graphqlClient.request(DeleteRequestMutation, { id })
  }

  async convertToIssue(id: string, issueId: string): Promise<RequestFieldsFragment> {
    const data = await graphqlClient.request(ConvertRequestToIssueMutation, { id, issueId })
    return data.convertRequestToIssue
  }
}

export const requestRepository = new RequestRepository()
