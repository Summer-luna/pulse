import { registerEnumType } from '@nestjs/graphql';

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  PROSPECT = 'PROSPECT',
  CHURNED = 'CHURNED',
  LOST = 'LOST',
}

registerEnumType(CustomerStatus, { name: 'CustomerStatus' });
