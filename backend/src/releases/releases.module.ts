import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from '../projects/projects.module.js';
import { Release } from './release.entity.js';
import { ReleasesRepository } from './releases.repository.js';
import { ReleasesResolver } from './releases.resolver.js';
import { ReleasesService } from './releases.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Release]), ProjectsModule],
  providers: [ReleasesRepository, ReleasesService, ReleasesResolver],
  exports: [ReleasesService],
})
export class ReleasesModule {}
