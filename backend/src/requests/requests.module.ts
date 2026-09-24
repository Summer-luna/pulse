import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssuesModule } from '../issues/issues.module.js';
import { ProjectsModule } from '../projects/projects.module.js';
import { CustomerRequest } from './customer-request.entity.js';
import { RequestsRepository } from './requests.repository.js';
import { RequestsResolver } from './requests.resolver.js';
import { RequestsService } from './requests.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerRequest]), ProjectsModule, IssuesModule],
  providers: [RequestsRepository, RequestsResolver, RequestsService],
  exports: [RequestsService],
})
export class RequestsModule {}
