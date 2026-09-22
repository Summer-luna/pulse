/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        ...UserFields\n      }\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      token\n      user {\n        ...UserFields\n      }\n    }\n  }\n": typeof types.RegisterDocument,
    "\n  query Me {\n    me {\n      ...UserFields\n    }\n  }\n": typeof types.MeDocument,
    "\n  fragment UserFields on User {\n    id\n    name\n    email\n    color\n  }\n": typeof types.UserFieldsFragmentDoc,
    "\n  fragment ProjectFields on Project {\n    id\n    name\n    key\n    description\n    status\n    priority\n    leadId\n    startDate\n    targetDate\n    createdAt\n    lead {\n      ...UserFields\n    }\n    members {\n      ...UserFields\n    }\n    progress {\n      total\n      completed\n    }\n  }\n": typeof types.ProjectFieldsFragmentDoc,
    "\n  fragment ReleaseFields on Release {\n    id\n    projectId\n    name\n    version\n    description\n    status\n    targetDate\n    releasedAt\n    createdAt\n    project {\n      id\n      key\n      name\n    }\n    progress {\n      total\n      completed\n    }\n  }\n": typeof types.ReleaseFieldsFragmentDoc,
    "\n  fragment LabelFields on Label {\n    id\n    name\n    color\n  }\n": typeof types.LabelFieldsFragmentDoc,
    "\n  fragment IssueFields on Issue {\n    id\n    identifier\n    number\n    title\n    status\n    priority\n    estimate\n    projectId\n    parentId\n    releaseId\n    assigneeId\n    dueDate\n    completedAt\n    createdAt\n    updatedAt\n    assignee {\n      ...UserFields\n    }\n    release {\n      id\n      name\n      version\n    }\n    labels {\n      ...LabelFields\n    }\n    subIssueProgress {\n      total\n      completed\n    }\n  }\n": typeof types.IssueFieldsFragmentDoc,
    "\n  query Issues($filter: IssuesFilterInput) {\n    issues(filter: $filter) {\n      ...IssueFields\n    }\n  }\n": typeof types.IssuesDocument,
    "\n  query IssueDetail($identifier: String!) {\n    issueByIdentifier(identifier: $identifier) {\n      ...IssueFields\n      description\n      project {\n        id\n        key\n        name\n      }\n      parent {\n        id\n        identifier\n        title\n      }\n      subIssues {\n        ...IssueFields\n      }\n    }\n  }\n": typeof types.IssueDetailDocument,
    "\n  mutation CreateIssue($input: CreateIssueInput!) {\n    createIssue(input: $input) {\n      ...IssueFields\n    }\n  }\n": typeof types.CreateIssueDocument,
    "\n  mutation UpdateIssue($id: ID!, $input: UpdateIssueInput!) {\n    updateIssue(id: $id, input: $input) {\n      ...IssueFields\n    }\n  }\n": typeof types.UpdateIssueDocument,
    "\n  mutation DeleteIssue($id: ID!) {\n    deleteIssue(id: $id) {\n      id\n    }\n  }\n": typeof types.DeleteIssueDocument,
    "\n  query Labels {\n    labels {\n      ...LabelFields\n    }\n  }\n": typeof types.LabelsDocument,
    "\n  query Projects {\n    projects {\n      ...ProjectFields\n    }\n  }\n": typeof types.ProjectsDocument,
    "\n  query Project($id: ID!) {\n    project(id: $id) {\n      ...ProjectFields\n    }\n  }\n": typeof types.ProjectDocument,
    "\n  mutation CreateProject($input: CreateProjectInput!) {\n    createProject(input: $input) {\n      ...ProjectFields\n    }\n  }\n": typeof types.CreateProjectDocument,
    "\n  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {\n    updateProject(id: $id, input: $input) {\n      ...ProjectFields\n    }\n  }\n": typeof types.UpdateProjectDocument,
    "\n  mutation DeleteProject($id: ID!) {\n    deleteProject(id: $id) {\n      id\n    }\n  }\n": typeof types.DeleteProjectDocument,
    "\n  query Releases($projectId: ID) {\n    releases(projectId: $projectId) {\n      ...ReleaseFields\n    }\n  }\n": typeof types.ReleasesDocument,
    "\n  query Release($id: ID!) {\n    release(id: $id) {\n      ...ReleaseFields\n    }\n  }\n": typeof types.ReleaseDocument,
    "\n  mutation CreateRelease($input: CreateReleaseInput!) {\n    createRelease(input: $input) {\n      ...ReleaseFields\n    }\n  }\n": typeof types.CreateReleaseDocument,
    "\n  mutation UpdateRelease($id: ID!, $input: UpdateReleaseInput!) {\n    updateRelease(id: $id, input: $input) {\n      ...ReleaseFields\n    }\n  }\n": typeof types.UpdateReleaseDocument,
    "\n  mutation DeleteRelease($id: ID!) {\n    deleteRelease(id: $id) {\n      id\n    }\n  }\n": typeof types.DeleteReleaseDocument,
    "\n  query Users {\n    users {\n      ...UserFields\n    }\n  }\n": typeof types.UsersDocument,
};
const documents: Documents = {
    "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        ...UserFields\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      token\n      user {\n        ...UserFields\n      }\n    }\n  }\n": types.RegisterDocument,
    "\n  query Me {\n    me {\n      ...UserFields\n    }\n  }\n": types.MeDocument,
    "\n  fragment UserFields on User {\n    id\n    name\n    email\n    color\n  }\n": types.UserFieldsFragmentDoc,
    "\n  fragment ProjectFields on Project {\n    id\n    name\n    key\n    description\n    status\n    priority\n    leadId\n    startDate\n    targetDate\n    createdAt\n    lead {\n      ...UserFields\n    }\n    members {\n      ...UserFields\n    }\n    progress {\n      total\n      completed\n    }\n  }\n": types.ProjectFieldsFragmentDoc,
    "\n  fragment ReleaseFields on Release {\n    id\n    projectId\n    name\n    version\n    description\n    status\n    targetDate\n    releasedAt\n    createdAt\n    project {\n      id\n      key\n      name\n    }\n    progress {\n      total\n      completed\n    }\n  }\n": types.ReleaseFieldsFragmentDoc,
    "\n  fragment LabelFields on Label {\n    id\n    name\n    color\n  }\n": types.LabelFieldsFragmentDoc,
    "\n  fragment IssueFields on Issue {\n    id\n    identifier\n    number\n    title\n    status\n    priority\n    estimate\n    projectId\n    parentId\n    releaseId\n    assigneeId\n    dueDate\n    completedAt\n    createdAt\n    updatedAt\n    assignee {\n      ...UserFields\n    }\n    release {\n      id\n      name\n      version\n    }\n    labels {\n      ...LabelFields\n    }\n    subIssueProgress {\n      total\n      completed\n    }\n  }\n": types.IssueFieldsFragmentDoc,
    "\n  query Issues($filter: IssuesFilterInput) {\n    issues(filter: $filter) {\n      ...IssueFields\n    }\n  }\n": types.IssuesDocument,
    "\n  query IssueDetail($identifier: String!) {\n    issueByIdentifier(identifier: $identifier) {\n      ...IssueFields\n      description\n      project {\n        id\n        key\n        name\n      }\n      parent {\n        id\n        identifier\n        title\n      }\n      subIssues {\n        ...IssueFields\n      }\n    }\n  }\n": types.IssueDetailDocument,
    "\n  mutation CreateIssue($input: CreateIssueInput!) {\n    createIssue(input: $input) {\n      ...IssueFields\n    }\n  }\n": types.CreateIssueDocument,
    "\n  mutation UpdateIssue($id: ID!, $input: UpdateIssueInput!) {\n    updateIssue(id: $id, input: $input) {\n      ...IssueFields\n    }\n  }\n": types.UpdateIssueDocument,
    "\n  mutation DeleteIssue($id: ID!) {\n    deleteIssue(id: $id) {\n      id\n    }\n  }\n": types.DeleteIssueDocument,
    "\n  query Labels {\n    labels {\n      ...LabelFields\n    }\n  }\n": types.LabelsDocument,
    "\n  query Projects {\n    projects {\n      ...ProjectFields\n    }\n  }\n": types.ProjectsDocument,
    "\n  query Project($id: ID!) {\n    project(id: $id) {\n      ...ProjectFields\n    }\n  }\n": types.ProjectDocument,
    "\n  mutation CreateProject($input: CreateProjectInput!) {\n    createProject(input: $input) {\n      ...ProjectFields\n    }\n  }\n": types.CreateProjectDocument,
    "\n  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {\n    updateProject(id: $id, input: $input) {\n      ...ProjectFields\n    }\n  }\n": types.UpdateProjectDocument,
    "\n  mutation DeleteProject($id: ID!) {\n    deleteProject(id: $id) {\n      id\n    }\n  }\n": types.DeleteProjectDocument,
    "\n  query Releases($projectId: ID) {\n    releases(projectId: $projectId) {\n      ...ReleaseFields\n    }\n  }\n": types.ReleasesDocument,
    "\n  query Release($id: ID!) {\n    release(id: $id) {\n      ...ReleaseFields\n    }\n  }\n": types.ReleaseDocument,
    "\n  mutation CreateRelease($input: CreateReleaseInput!) {\n    createRelease(input: $input) {\n      ...ReleaseFields\n    }\n  }\n": types.CreateReleaseDocument,
    "\n  mutation UpdateRelease($id: ID!, $input: UpdateReleaseInput!) {\n    updateRelease(id: $id, input: $input) {\n      ...ReleaseFields\n    }\n  }\n": types.UpdateReleaseDocument,
    "\n  mutation DeleteRelease($id: ID!) {\n    deleteRelease(id: $id) {\n      id\n    }\n  }\n": types.DeleteReleaseDocument,
    "\n  query Users {\n    users {\n      ...UserFields\n    }\n  }\n": types.UsersDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        ...UserFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        ...UserFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      token\n      user {\n        ...UserFields\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation Register($input: RegisterInput!) {\n    register(input: $input) {\n      token\n      user {\n        ...UserFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      ...UserFields\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      ...UserFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment UserFields on User {\n    id\n    name\n    email\n    color\n  }\n"): (typeof documents)["\n  fragment UserFields on User {\n    id\n    name\n    email\n    color\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ProjectFields on Project {\n    id\n    name\n    key\n    description\n    status\n    priority\n    leadId\n    startDate\n    targetDate\n    createdAt\n    lead {\n      ...UserFields\n    }\n    members {\n      ...UserFields\n    }\n    progress {\n      total\n      completed\n    }\n  }\n"): (typeof documents)["\n  fragment ProjectFields on Project {\n    id\n    name\n    key\n    description\n    status\n    priority\n    leadId\n    startDate\n    targetDate\n    createdAt\n    lead {\n      ...UserFields\n    }\n    members {\n      ...UserFields\n    }\n    progress {\n      total\n      completed\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ReleaseFields on Release {\n    id\n    projectId\n    name\n    version\n    description\n    status\n    targetDate\n    releasedAt\n    createdAt\n    project {\n      id\n      key\n      name\n    }\n    progress {\n      total\n      completed\n    }\n  }\n"): (typeof documents)["\n  fragment ReleaseFields on Release {\n    id\n    projectId\n    name\n    version\n    description\n    status\n    targetDate\n    releasedAt\n    createdAt\n    project {\n      id\n      key\n      name\n    }\n    progress {\n      total\n      completed\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment LabelFields on Label {\n    id\n    name\n    color\n  }\n"): (typeof documents)["\n  fragment LabelFields on Label {\n    id\n    name\n    color\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment IssueFields on Issue {\n    id\n    identifier\n    number\n    title\n    status\n    priority\n    estimate\n    projectId\n    parentId\n    releaseId\n    assigneeId\n    dueDate\n    completedAt\n    createdAt\n    updatedAt\n    assignee {\n      ...UserFields\n    }\n    release {\n      id\n      name\n      version\n    }\n    labels {\n      ...LabelFields\n    }\n    subIssueProgress {\n      total\n      completed\n    }\n  }\n"): (typeof documents)["\n  fragment IssueFields on Issue {\n    id\n    identifier\n    number\n    title\n    status\n    priority\n    estimate\n    projectId\n    parentId\n    releaseId\n    assigneeId\n    dueDate\n    completedAt\n    createdAt\n    updatedAt\n    assignee {\n      ...UserFields\n    }\n    release {\n      id\n      name\n      version\n    }\n    labels {\n      ...LabelFields\n    }\n    subIssueProgress {\n      total\n      completed\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Issues($filter: IssuesFilterInput) {\n    issues(filter: $filter) {\n      ...IssueFields\n    }\n  }\n"): (typeof documents)["\n  query Issues($filter: IssuesFilterInput) {\n    issues(filter: $filter) {\n      ...IssueFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query IssueDetail($identifier: String!) {\n    issueByIdentifier(identifier: $identifier) {\n      ...IssueFields\n      description\n      project {\n        id\n        key\n        name\n      }\n      parent {\n        id\n        identifier\n        title\n      }\n      subIssues {\n        ...IssueFields\n      }\n    }\n  }\n"): (typeof documents)["\n  query IssueDetail($identifier: String!) {\n    issueByIdentifier(identifier: $identifier) {\n      ...IssueFields\n      description\n      project {\n        id\n        key\n        name\n      }\n      parent {\n        id\n        identifier\n        title\n      }\n      subIssues {\n        ...IssueFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateIssue($input: CreateIssueInput!) {\n    createIssue(input: $input) {\n      ...IssueFields\n    }\n  }\n"): (typeof documents)["\n  mutation CreateIssue($input: CreateIssueInput!) {\n    createIssue(input: $input) {\n      ...IssueFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateIssue($id: ID!, $input: UpdateIssueInput!) {\n    updateIssue(id: $id, input: $input) {\n      ...IssueFields\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateIssue($id: ID!, $input: UpdateIssueInput!) {\n    updateIssue(id: $id, input: $input) {\n      ...IssueFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteIssue($id: ID!) {\n    deleteIssue(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteIssue($id: ID!) {\n    deleteIssue(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Labels {\n    labels {\n      ...LabelFields\n    }\n  }\n"): (typeof documents)["\n  query Labels {\n    labels {\n      ...LabelFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Projects {\n    projects {\n      ...ProjectFields\n    }\n  }\n"): (typeof documents)["\n  query Projects {\n    projects {\n      ...ProjectFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Project($id: ID!) {\n    project(id: $id) {\n      ...ProjectFields\n    }\n  }\n"): (typeof documents)["\n  query Project($id: ID!) {\n    project(id: $id) {\n      ...ProjectFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateProject($input: CreateProjectInput!) {\n    createProject(input: $input) {\n      ...ProjectFields\n    }\n  }\n"): (typeof documents)["\n  mutation CreateProject($input: CreateProjectInput!) {\n    createProject(input: $input) {\n      ...ProjectFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {\n    updateProject(id: $id, input: $input) {\n      ...ProjectFields\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {\n    updateProject(id: $id, input: $input) {\n      ...ProjectFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteProject($id: ID!) {\n    deleteProject(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteProject($id: ID!) {\n    deleteProject(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Releases($projectId: ID) {\n    releases(projectId: $projectId) {\n      ...ReleaseFields\n    }\n  }\n"): (typeof documents)["\n  query Releases($projectId: ID) {\n    releases(projectId: $projectId) {\n      ...ReleaseFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Release($id: ID!) {\n    release(id: $id) {\n      ...ReleaseFields\n    }\n  }\n"): (typeof documents)["\n  query Release($id: ID!) {\n    release(id: $id) {\n      ...ReleaseFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateRelease($input: CreateReleaseInput!) {\n    createRelease(input: $input) {\n      ...ReleaseFields\n    }\n  }\n"): (typeof documents)["\n  mutation CreateRelease($input: CreateReleaseInput!) {\n    createRelease(input: $input) {\n      ...ReleaseFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateRelease($id: ID!, $input: UpdateReleaseInput!) {\n    updateRelease(id: $id, input: $input) {\n      ...ReleaseFields\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateRelease($id: ID!, $input: UpdateReleaseInput!) {\n    updateRelease(id: $id, input: $input) {\n      ...ReleaseFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteRelease($id: ID!) {\n    deleteRelease(id: $id) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteRelease($id: ID!) {\n    deleteRelease(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Users {\n    users {\n      ...UserFields\n    }\n  }\n"): (typeof documents)["\n  query Users {\n    users {\n      ...UserFields\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;