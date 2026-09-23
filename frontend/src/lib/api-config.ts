export const graphqlEndpoint =
  import.meta.env.VITE_GRAPHQL_URL ?? `${globalThis.location?.origin ?? 'http://localhost:5173'}/graphql`

export const uploadsEndpoint = graphqlEndpoint.replace(/\/graphql\/?$/, '/uploads')
