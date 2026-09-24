import { Injectable } from '@nestjs/common';
import { CommentsService } from '../../comments/comments.service.js';
import { CustomersService } from '../../customers/customers.service.js';
import { IssuesService } from '../../issues/issues.service.js';
import { LabelsService } from '../../labels/labels.service.js';
import { ProjectsService } from '../../projects/projects.service.js';
import { ReleasesService } from '../../releases/releases.service.js';
import { UsersService } from '../../users/users.service.js';
import { entityLoader, groupedLoader, groupedValueLoader, progressLoader } from './batch.js';
import type { Loaders } from './loaders.js';

@Injectable()
export class LoadersService {
  constructor(
    private readonly users: UsersService,
    private readonly projects: ProjectsService,
    private readonly releases: ReleasesService,
    private readonly issues: IssuesService,
    private readonly labels: LabelsService,
    private readonly comments: CommentsService,
    private readonly customers: CustomersService,
  ) {}

  create(): Loaders {
    return {
      userById: entityLoader((ids) => this.users.findByIds(ids)),
      projectById: entityLoader((ids) => this.projects.findByIds(ids)),
      customerById: entityLoader((ids) => this.customers.findByIds(ids)),
      releaseById: entityLoader((ids) => this.releases.findByIds(ids)),
      issueById: entityLoader((ids) => this.issues.findByIds(ids)),
      subIssuesByParentId: groupedLoader(
        (ids) => this.issues.findSubIssues(ids),
        (issue) => issue.parentId,
      ),
      membersByProjectId: groupedValueLoader(
        (ids) => this.projects.membersByProjectIds(ids),
        (row) => row.projectId,
        (row) => row.user,
      ),
      labelsByIssueId: groupedValueLoader(
        (ids) => this.labels.labelsByIssueIds(ids),
        (row) => row.issueId,
        (row) => row.label,
      ),
      commentsByIssueId: groupedLoader(
        (ids) => this.comments.listByIssueIds(ids),
        (comment) => comment.issueId,
      ),
      progressByProjectId: progressLoader((ids) => this.issues.progressByProjectIds(ids)),
      progressByReleaseId: progressLoader((ids) => this.issues.progressByReleaseIds(ids)),
      progressByParentId: progressLoader((ids) => this.issues.progressByParentIds(ids)),
    };
  }
}
