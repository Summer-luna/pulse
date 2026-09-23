import { graphql } from '@/graphql/generated'
import type {
  CreateIssueInput,
  IssueDetailQuery,
  IssueFieldsFragment,
  IssuesFilterInput,
  UpdateIssueInput,
} from '@/graphql/generated/graphql'
import { graphqlClient } from './graphql-client'

const IssuesQuery = graphql(`
  query Issues($filter: IssuesFilterInput) {
    issues(filter: $filter) {
      ...IssueFields
    }
  }
`)

const issueDetailDocument = graphql(`
  query IssueDetail($identifier: String!) {
    issueByIdentifier(identifier: $identifier) {
      ...IssueFields
      description
      project {
        id
        key
        name
      }
      parent {
        id
        identifier
        title
      }
      subIssues {
        ...IssueFields
      }
      creator {
        ...UserFields
      }
      comments {
        ...CommentFields
      }
    }
  }
`)

const CreateIssueMutation = graphql(`
  mutation CreateIssue($input: CreateIssueInput!) {
    createIssue(input: $input) {
      ...IssueFields
    }
  }
`)

const UpdateIssueMutation = graphql(`
  mutation UpdateIssue($id: ID!, $input: UpdateIssueInput!) {
    updateIssue(id: $id, input: $input) {
      ...IssueFields
    }
  }
`)

const DeleteIssueMutation = graphql(`
  mutation DeleteIssue($id: ID!) {
    deleteIssue(id: $id) {
      id
    }
  }
`)

class IssueRepository {
  async list(filter?: IssuesFilterInput): Promise<IssueFieldsFragment[]> {
    const data = await graphqlClient.request(IssuesQuery, { filter })
    return data.issues
  }

  async getByIdentifier(identifier: string): Promise<IssueDetailQuery['issueByIdentifier']> {
    const data = await graphqlClient.request(issueDetailDocument, { identifier })
    return data.issueByIdentifier
  }

  async create(input: CreateIssueInput): Promise<IssueFieldsFragment> {
    const data = await graphqlClient.request(CreateIssueMutation, { input })
    return data.createIssue
  }

  async update(id: string, input: UpdateIssueInput): Promise<IssueFieldsFragment> {
    const data = await graphqlClient.request(UpdateIssueMutation, { id, input })
    return data.updateIssue
  }

  async remove(id: string): Promise<void> {
    await graphqlClient.request(DeleteIssueMutation, { id })
  }
}

export const issueRepository = new IssueRepository()
