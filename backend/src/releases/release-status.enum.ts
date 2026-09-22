import { registerEnumType } from '@nestjs/graphql';

export enum ReleaseStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

registerEnumType(ReleaseStatus, { name: 'ReleaseStatus' });
