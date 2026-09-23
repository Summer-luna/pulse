import { graphql } from '@/graphql/generated'
import type { CommentFieldsFragment, CreateCommentInput } from '@/graphql/generated/graphql'
import { graphqlClient } from './graphql-client'

const CreateCommentMutation = graphql(`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      ...CommentFields
    }
  }
`)

const DeleteCommentMutation = graphql(`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id) {
      id
    }
  }
`)

class CommentRepository {
  async create(input: CreateCommentInput): Promise<CommentFieldsFragment> {
    const data = await graphqlClient.request(CreateCommentMutation, { input })
    return data.createComment
  }

  async remove(id: string): Promise<void> {
    await graphqlClient.request(DeleteCommentMutation, { id })
  }
}

export const commentRepository = new CommentRepository()
