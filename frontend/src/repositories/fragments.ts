import { graphql } from '@/graphql/generated'

export const UserFields = graphql(`
  fragment UserFields on User {
    id
    name
    email
    color
    role
    createdAt
  }
`)

export const InvitedMemberFields = graphql(`
  fragment InvitedMemberFields on InvitedMember {
    temporaryPassword
    user {
      ...UserFields
    }
  }
`)

export const ProjectFields = graphql(`
  fragment ProjectFields on Project {
    id
    name
    key
    description
    status
    priority
    visibility
    leadId
    teamId
    startDate
    targetDate
    createdAt
    lead {
      ...UserFields
    }
    members {
      ...UserFields
    }
    team {
      id
      name
      key
    }
    progress {
      total
      completed
    }
  }
`)

export const TeamFields = graphql(`
  fragment TeamFields on Team {
    id
    name
    key
    description
    access
    isMember
    activeProjectCount
    createdAt
    members {
      ...UserFields
    }
  }
`)

export const ReleaseFields = graphql(`
  fragment ReleaseFields on Release {
    id
    projectId
    pipelineId
    name
    version
    description
    status
    targetDate
    releasedAt
    createdAt
    project {
      id
      key
      name
    }
    progress {
      total
      completed
    }
  }
`)

export const ReleasePipelineFields = graphql(`
  fragment ReleasePipelineFields on ReleasePipeline {
    id
    projectId
    name
    type
    createdAt
    project {
      id
      key
      name
    }
    releaseCount
    latestRelease {
      id
      name
      version
      status
      releasedAt
    }
  }
`)

export const CommentFields = graphql(`
  fragment CommentFields on Comment {
    id
    issueId
    body
    createdAt
    author {
      ...UserFields
    }
  }
`)

export const RequestFields = graphql(`
  fragment RequestFields on CustomerRequest {
    id
    projectId
    title
    description
    requestor
    requestorUserId
    status
    convertedIssueId
    customerId
    createdAt
    convertedIssue {
      id
      identifier
      title
    }
    customer {
      id
      name
    }
    requestorUser {
      ...UserFields
    }
  }
`)

export const CustomerFields = graphql(`
  fragment CustomerFields on Customer {
    id
    name
    status
    type
    tier
    annualRevenue
    size
    domains
    ownerId
    requestCount
    createdAt
    owner {
      ...UserFields
    }
  }
`)

export const LabelFields = graphql(`
  fragment LabelFields on Label {
    id
    name
    color
  }
`)

export const IssueFields = graphql(`
  fragment IssueFields on Issue {
    id
    identifier
    number
    title
    status
    priority
    estimate
    projectId
    parentId
    releaseId
    assigneeId
    dueDate
    completedAt
    createdAt
    updatedAt
    assignee {
      ...UserFields
    }
    release {
      id
      name
      version
    }
    labels {
      ...LabelFields
    }
    subIssueProgress {
      total
      completed
    }
  }
`)
