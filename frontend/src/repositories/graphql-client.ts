import { GraphQLClient } from 'graphql-request'
import { getToken } from '@/lib/auth-token'

const endpoint = import.meta.env.VITE_GRAPHQL_URL ?? `${globalThis.location?.origin ?? 'http://localhost:5173'}/graphql`

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: () => {
    const token = getToken()
    return token ? { Authorization: `Bearer ${token}` } : ({} as Record<string, string>)
  },
})
