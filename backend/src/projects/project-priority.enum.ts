import { registerEnumType } from '@nestjs/graphql';

export enum ProjectPriority {
  NO_PRIORITY = 'NO_PRIORITY',
  URGENT = 'URGENT',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

registerEnumType(ProjectPriority, { name: 'ProjectPriority' });
