import { registerEnumType } from '@nestjs/graphql';

export enum CustomerTier {
  TIER_1 = 'TIER_1',
  TIER_2 = 'TIER_2',
  TIER_3 = 'TIER_3',
}

registerEnumType(CustomerTier, { name: 'CustomerTier' });
