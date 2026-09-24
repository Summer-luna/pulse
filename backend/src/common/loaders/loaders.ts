import type DataLoader from 'dataloader';
import type { Request } from 'express';
import type { Comment } from '../../comments/comment.entity.js';
import type { Customer } from '../../customers/customer.entity.js';
import type { Issue } from '../../issues/issue.entity.js';
import type { Label } from '../../labels/label.entity.js';
import type { Project } from '../../projects/project.entity.js';
import type { Release } from '../../releases/release.entity.js';
import type { User } from '../../users/user.entity.js';

export interface ProgressStats {
  total: number;
  completed: number;
}

export interface Loaders {
  userById: DataLoader<string, User | null>;
  projectById: DataLoader<string, Project | null>;
  customerById: DataLoader<string, Customer | null>;
  releaseById: DataLoader<string, Release | null>;
  issueById: DataLoader<string, Issue | null>;
  subIssuesByParentId: DataLoader<string, Issue[]>;
  membersByProjectId: DataLoader<string, User[]>;
  labelsByIssueId: DataLoader<string, Label[]>;
  commentsByIssueId: DataLoader<string, Comment[]>;
  progressByProjectId: DataLoader<string, ProgressStats>;
  progressByReleaseId: DataLoader<string, ProgressStats>;
  progressByParentId: DataLoader<string, ProgressStats>;
}

export type AuthenticatedRequest = Request & { user?: User };

export interface GraphQLContext {
  req: AuthenticatedRequest;
  loaders: Loaders;
}
