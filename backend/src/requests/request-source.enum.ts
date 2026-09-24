import { registerEnumType } from '@nestjs/graphql';

export enum RequestSource {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
}

registerEnumType(RequestSource, { name: 'RequestSource' });
