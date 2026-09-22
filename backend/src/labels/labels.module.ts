import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Label } from './label.entity.js';
import { LabelsRepository } from './labels.repository.js';
import { LabelsResolver } from './labels.resolver.js';
import { LabelsService } from './labels.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Label])],
  providers: [LabelsRepository, LabelsService, LabelsResolver],
  exports: [LabelsService],
})
export class LabelsModule {}
