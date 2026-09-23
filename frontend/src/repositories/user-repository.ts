import { graphql } from '@/graphql/generated'
import type { InviteMembersInput, InvitedMemberFieldsFragment, UserFieldsFragment } from '@/graphql/generated/graphql'
import { graphqlClient } from './graphql-client'

const UsersQuery = graphql(`
  query Users {
    users {
      ...UserFields
    }
  }
`)

const InviteMembersMutation = graphql(`
  mutation InviteMembers($input: InviteMembersInput!) {
    inviteMembers(input: $input) {
      ...InvitedMemberFields
    }
  }
`)

const RemoveMemberMutation = graphql(`
  mutation RemoveMember($id: ID!) {
    removeMember(id: $id) {
      id
    }
  }
`)

class UserRepository {
  async list(): Promise<UserFieldsFragment[]> {
    const data = await graphqlClient.request(UsersQuery)
    return data.users
  }

  async invite(input: InviteMembersInput): Promise<InvitedMemberFieldsFragment[]> {
    const data = await graphqlClient.request(InviteMembersMutation, { input })
    return data.inviteMembers
  }

  async remove(id: string): Promise<void> {
    await graphqlClient.request(RemoveMemberMutation, { id })
  }
}

export const userRepository = new UserRepository()
