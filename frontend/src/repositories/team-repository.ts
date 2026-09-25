import { graphql } from '@/graphql/generated'
import type { CreateTeamInput, TeamFieldsFragment, UpdateTeamInput } from '@/graphql/generated/graphql'
import { graphqlClient } from './graphql-client'

const TeamsQuery = graphql(`
  query Teams {
    teams {
      ...TeamFields
    }
  }
`)

const CreateTeamMutation = graphql(`
  mutation CreateTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      ...TeamFields
    }
  }
`)

const UpdateTeamMutation = graphql(`
  mutation UpdateTeam($id: ID!, $input: UpdateTeamInput!) {
    updateTeam(id: $id, input: $input) {
      ...TeamFields
    }
  }
`)

const DeleteTeamMutation = graphql(`
  mutation DeleteTeam($id: ID!) {
    deleteTeam(id: $id) {
      id
    }
  }
`)

const JoinTeamMutation = graphql(`
  mutation JoinTeam($id: ID!) {
    joinTeam(id: $id) {
      ...TeamFields
    }
  }
`)

const LeaveTeamMutation = graphql(`
  mutation LeaveTeam($id: ID!) {
    leaveTeam(id: $id) {
      ...TeamFields
    }
  }
`)

class TeamRepository {
  async list(): Promise<TeamFieldsFragment[]> {
    const data = await graphqlClient.request(TeamsQuery)
    return data.teams
  }

  async create(input: CreateTeamInput): Promise<TeamFieldsFragment> {
    const data = await graphqlClient.request(CreateTeamMutation, { input })
    return data.createTeam
  }

  async update(id: string, input: UpdateTeamInput): Promise<TeamFieldsFragment> {
    const data = await graphqlClient.request(UpdateTeamMutation, { id, input })
    return data.updateTeam
  }

  async remove(id: string): Promise<void> {
    await graphqlClient.request(DeleteTeamMutation, { id })
  }

  async join(id: string): Promise<TeamFieldsFragment> {
    const data = await graphqlClient.request(JoinTeamMutation, { id })
    return data.joinTeam
  }

  async leave(id: string): Promise<TeamFieldsFragment> {
    const data = await graphqlClient.request(LeaveTeamMutation, { id })
    return data.leaveTeam
  }
}

export const teamRepository = new TeamRepository()
