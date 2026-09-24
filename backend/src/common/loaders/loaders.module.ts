import { Module } from '@nestjs/common';
import { CommentsModule } from '../../comments/comments.module.js';
import { CustomersModule } from '../../customers/customers.module.js';
import { IssuesModule } from '../../issues/issues.module.js';
import { LabelsModule } from '../../labels/labels.module.js';
import { ProjectsModule } from '../../projects/projects.module.js';
import { ReleasesModule } from '../../releases/releases.module.js';
import { RequestsModule } from '../../requests/requests.module.js';
import { UsersModule } from '../../users/users.module.js';
import { LoadersService } from './loaders.service.js';

@Module({
  imports: [UsersModule, ProjectsModule, ReleasesModule, IssuesModule, LabelsModule, CommentsModule, CustomersModule, RequestsModule],
  providers: [LoadersService],
  exports: [LoadersService],
})
export class LoadersModule {}
