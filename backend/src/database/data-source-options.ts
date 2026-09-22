import type { DataSourceOptions } from 'typeorm';
import { Issue } from '../issues/issue.entity.js';
import { Label } from '../labels/label.entity.js';
import { Project } from '../projects/project.entity.js';
import { Release } from '../releases/release.entity.js';
import { User } from '../users/user.entity.js';
import { AddPasswordHash1790000001000 } from './migrations/1790000001000-add-password-hash.js';
import { AddProjectFields1790000002000 } from './migrations/1790000002000-add-project-fields.js';
import { AddIssueEstimate1790000003000 } from './migrations/1790000003000-add-issue-estimate.js';
import { AddLabels1790000004000 } from './migrations/1790000004000-add-labels.js';
import { InitSchema1790000000000 } from './migrations/1790000000000-init-schema.js';
import { SnakeNamingStrategy } from './snake-naming.strategy.js';

export function buildDataSourceOptions(url: string): DataSourceOptions {
  return {
    type: 'postgres',
    url,
    entities: [User, Project, Release, Issue, Label],
    migrations: [
      InitSchema1790000000000,
      AddPasswordHash1790000001000,
      AddProjectFields1790000002000,
      AddIssueEstimate1790000003000,
      AddLabels1790000004000,
    ],
    namingStrategy: new SnakeNamingStrategy(),
    uuidExtension: 'pgcrypto',
    installExtensions: false,
    synchronize: false,
  };
}
