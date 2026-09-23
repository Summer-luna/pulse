import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from '../projects/projects.module.js';
import { Release } from '../releases/release.entity.js';
import { ReleasePipeline } from './release-pipeline.entity.js';
import { ReleasePipelinesRepository } from './release-pipelines.repository.js';
import { ReleasePipelinesResolver } from './release-pipelines.resolver.js';
import { ReleasePipelinesService } from './release-pipelines.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([ReleasePipeline, Release]), ProjectsModule],
  providers: [ReleasePipelinesRepository, ReleasePipelinesResolver, ReleasePipelinesService],
  exports: [ReleasePipelinesService],
})
export class ReleasePipelinesModule {}
