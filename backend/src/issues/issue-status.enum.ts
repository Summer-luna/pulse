import { registerEnumType } from '@nestjs/graphql';

export enum IssueStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
  CANCELED = 'CANCELED',
}

registerEnumType(IssueStatus, { name: 'IssueStatus' });
