import { graphql } from '@/graphql/generated'
import type { LabelFieldsFragment } from '@/graphql/generated/graphql'
import { graphqlClient } from './graphql-client'

const LabelsQuery = graphql(`
  query Labels {
    labels {
      ...LabelFields
    }
  }
`)

class LabelRepository {
  async list(): Promise<LabelFieldsFragment[]> {
    const data = await graphqlClient.request(LabelsQuery)
    return data.labels
  }
}

export const labelRepository = new LabelRepository()
