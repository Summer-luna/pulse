import { registerEnumType } from '@nestjs/graphql';

export enum CustomerType {
  EXTERNAL = 'EXTERNAL',
  INTERNAL = 'INTERNAL',
}

registerEnumType(CustomerType, { name: 'CustomerType' });
