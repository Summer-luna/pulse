import { registerEnumType } from '@nestjs/graphql';

export enum IssuePriority {
  NO_PRIORITY = 'NO_PRIORITY',
  URGENT = 'URGENT',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

registerEnumType(IssuePriority, { name: 'IssuePriority' });
