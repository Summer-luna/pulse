import { GraphQLClient } from 'graphql-request'
import { graphqlEndpoint } from '@/lib/api-config'
import { getToken } from '@/lib/auth-token'

export const graphqlClient = new GraphQLClient(graphqlEndpoint, {
  headers: () => {
    const token = getToken()
    return token ? { Authorization: `Bearer ${token}` } : ({} as Record<string, string>)
  },
})
