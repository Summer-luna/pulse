import type { IssueStatus } from './issue-status.enum.js';

export interface IssueQuery {
  projectId?: string;
  releaseId?: string;
  assigneeId?: string;
  parentId?: string;
  statuses?: IssueStatus[];
  topLevelOnly?: boolean;
  search?: string;
}
