import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabelsModule } from '../labels/labels.module.js';
import { ProjectsModule } from '../projects/projects.module.js';
import { ReleasesModule } from '../releases/releases.module.js';
import { UsersModule } from '../users/users.module.js';
import { Issue } from './issue.entity.js';
import { IssuesRepository } from './issues.repository.js';
import { IssuesResolver } from './issues.resolver.js';
import { IssuesService } from './issues.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Issue]), ProjectsModule, ReleasesModule, UsersModule, LabelsModule],
  providers: [IssuesRepository, IssuesService, IssuesResolver],
  exports: [IssuesService],
})
export class IssuesModule {}
