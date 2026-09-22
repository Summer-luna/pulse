import { registerEnumType } from '@nestjs/graphql';

export enum ProjectStatus {
  BACKLOG = 'BACKLOG',
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

registerEnumType(ProjectStatus, { name: 'ProjectStatus' });
