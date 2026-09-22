import { graphql } from '@/graphql/generated'
import type { CreateProjectInput, ProjectFieldsFragment, UpdateProjectInput } from '@/graphql/generated/graphql'
import { graphqlClient } from './graphql-client'

const ProjectsQuery = graphql(`
  query Projects {
    projects {
      ...ProjectFields
    }
  }
`)

const ProjectQuery = graphql(`
  query Project($id: ID!) {
    project(id: $id) {
      ...ProjectFields
    }
  }
`)

const CreateProjectMutation = graphql(`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      ...ProjectFields
    }
  }
`)

const UpdateProjectMutation = graphql(`
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      ...ProjectFields
    }
  }
`)

const DeleteProjectMutation = graphql(`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
    }
  }
`)

class ProjectRepository {
  async list(): Promise<ProjectFieldsFragment[]> {
    const data = await graphqlClient.request(ProjectsQuery)
    return data.projects
  }

  async get(id: string): Promise<ProjectFieldsFragment> {
    const data = await graphqlClient.request(ProjectQuery, { id })
    return data.project
  }

  async create(input: CreateProjectInput): Promise<ProjectFieldsFragment> {
    const data = await graphqlClient.request(CreateProjectMutation, { input })
    return data.createProject
  }

  async update(id: string, input: UpdateProjectInput): Promise<ProjectFieldsFragment> {
    const data = await graphqlClient.request(UpdateProjectMutation, { id, input })
    return data.updateProject
  }

  async remove(id: string): Promise<void> {
    await graphqlClient.request(DeleteProjectMutation, { id })
  }
}

export const projectRepository = new ProjectRepository()
