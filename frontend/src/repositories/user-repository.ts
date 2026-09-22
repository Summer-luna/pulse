import { graphql } from '@/graphql/generated'
import type { UserFieldsFragment } from '@/graphql/generated/graphql'
import { graphqlClient } from './graphql-client'

const UsersQuery = graphql(`
  query Users {
    users {
      ...UserFields
    }
  }
`)

class UserRepository {
  async list(): Promise<UserFieldsFragment[]> {
    const data = await graphqlClient.request(UsersQuery)
    return data.users
  }
}

export const userRepository = new UserRepository()
