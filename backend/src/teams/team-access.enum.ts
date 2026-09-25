import { registerEnumType } from '@nestjs/graphql';

export enum TeamAccess {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

registerEnumType(TeamAccess, { name: 'TeamAccess' });
