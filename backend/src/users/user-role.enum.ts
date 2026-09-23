import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  GUEST = 'GUEST',
}

registerEnumType(UserRole, { name: 'UserRole' });
