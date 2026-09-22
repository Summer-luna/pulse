import { graphql } from '@/graphql/generated'
import type { LoginInput, RegisterInput } from '@/graphql/generated/graphql'
import { graphqlClient } from './graphql-client'

const LoginMutation = graphql(`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        ...UserFields
      }
    }
  }
`)

const RegisterMutation = graphql(`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        ...UserFields
      }
    }
  }
`)

const MeQuery = graphql(`
  query Me {
    me {
      ...UserFields
    }
  }
`)

class AuthRepository {
  async login(input: LoginInput) {
    const data = await graphqlClient.request(LoginMutation, { input })
    return data.login
  }

  async register(input: RegisterInput) {
    const data = await graphqlClient.request(RegisterMutation, { input })
    return data.register
  }

  async me() {
    const data = await graphqlClient.request(MeQuery)
    return data.me
  }
}

export const authRepository = new AuthRepository()
