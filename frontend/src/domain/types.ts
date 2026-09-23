import type {
  IssueDetailQuery,
  IssueFieldsFragment,
  LabelFieldsFragment,
  ProjectFieldsFragment,
  ReleaseFieldsFragment,
  ReleasePipelineFieldsFragment,
  UserFieldsFragment,
} from '@/graphql/generated/graphql'

export type Issue = IssueFieldsFragment
export type Project = ProjectFieldsFragment
export type Release = ReleaseFieldsFragment
export type ReleasePipeline = ReleasePipelineFieldsFragment
export type User = UserFieldsFragment
export type Label = LabelFieldsFragment

export type IssueDetail = IssueDetailQuery['issueByIdentifier']

export interface Progress {
  total: number
  completed: number
}
