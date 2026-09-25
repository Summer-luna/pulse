import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsModule } from '../teams/teams.module.js';
import { UsersModule } from '../users/users.module.js';
import { Project } from './project.entity.js';
import { ProjectsRepository } from './projects.repository.js';
import { ProjectsResolver } from './projects.resolver.js';
import { ProjectsService } from './projects.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), UsersModule, TeamsModule],
  providers: [ProjectsRepository, ProjectsService, ProjectsResolver],
  exports: [ProjectsService],
})
export class ProjectsModule {}
