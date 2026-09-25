import { registerEnumType } from '@nestjs/graphql';

export enum ProjectVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

registerEnumType(ProjectVisibility, { name: 'ProjectVisibility' });
