import { registerEnumType } from '@nestjs/graphql';

export enum RequestStatus {
  OPEN = 'OPEN',
  CONVERTED = 'CONVERTED',
  DECLINED = 'DECLINED',
}

registerEnumType(RequestStatus, { name: 'RequestStatus' });
