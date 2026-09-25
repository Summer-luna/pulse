import { Module } from '@nestjs/common';
import { DataTransferController } from './data-transfer.controller.js';
import { DataTransferRepository } from './data-transfer.repository.js';
import { DataTransferService } from './data-transfer.service.js';

@Module({
  controllers: [DataTransferController],
  providers: [DataTransferRepository, DataTransferService],
})
export class DataTransferModule {}
