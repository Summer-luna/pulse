import { registerEnumType } from '@nestjs/graphql';

export enum ReleasePipelineType {
  SCHEDULED = 'SCHEDULED',
  CONTINUOUS = 'CONTINUOUS',
}

registerEnumType(ReleasePipelineType, { name: 'ReleasePipelineType' });
