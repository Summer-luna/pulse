import type { DataSourceOptions } from 'typeorm';
import { Comment } from '../comments/comment.entity.js';
import { Issue } from '../issues/issue.entity.js';
import { Label } from '../labels/label.entity.js';
import { Project } from '../projects/project.entity.js';
import { ReleasePipeline } from '../release-pipelines/release-pipeline.entity.js';
import { Release } from '../releases/release.entity.js';
import { User } from '../users/user.entity.js';
import { AddPasswordHash1790000001000 } from './migrations/1790000001000-add-password-hash.js';
import { AddProjectFields1790000002000 } from './migrations/1790000002000-add-project-fields.js';
import { AddIssueEstimate1790000003000 } from './migrations/1790000003000-add-issue-estimate.js';
import { AddLabels1790000004000 } from './migrations/1790000004000-add-labels.js';
import { AddReleasePipelines1790000005000 } from './migrations/1790000005000-add-release-pipelines.js';
import { AddComments1790000006000 } from './migrations/1790000006000-add-comments.js';
import { AddBlockedIssueStatus1790000007000 } from './migrations/1790000007000-add-blocked-issue-status.js';
import { InitSchema1790000000000 } from './migrations/1790000000000-init-schema.js';
import { SnakeNamingStrategy } from './snake-naming.strategy.js';

export function buildDataSourceOptions(url: string): DataSourceOptions {
  return {
    type: 'postgres',
    url,
    entities: [User, Project, Release, Issue, Label, ReleasePipeline, Comment],
    migrations: [
      InitSchema1790000000000,
      AddPasswordHash1790000001000,
      AddProjectFields1790000002000,
      AddIssueEstimate1790000003000,
      AddLabels1790000004000,
      AddReleasePipelines1790000005000,
      AddComments1790000006000,
      AddBlockedIssueStatus1790000007000,
    ],
    namingStrategy: new SnakeNamingStrategy(),
    uuidExtension: 'pgcrypto',
    installExtensions: false,
    synchronize: false,
  };
}
