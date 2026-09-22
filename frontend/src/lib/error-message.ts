interface GraphQLClientErrorLike {
  response?: { errors?: { message?: string }[] }
}

export function errorMessage(error: unknown): string | null {
  if (!error) {
    return null
  }
  const graphqlMessage = (error as GraphQLClientErrorLike).response?.errors?.[0]?.message
  if (graphqlMessage) {
    return graphqlMessage
  }
  return error instanceof Error ? error.message : 'Something went wrong'
}
