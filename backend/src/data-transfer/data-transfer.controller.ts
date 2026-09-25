import { BadRequestException, Controller, Get, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { UserRole } from '../users/user-role.enum.js';
import { DataTransferService } from './data-transfer.service.js';

const MAX_IMPORT_BYTES = 512 * 1024 * 1024;

@Controller('admin/data')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class DataTransferController {
  constructor(private readonly service: DataTransferService) {}

  @Get('export')
  async export(@Res() res: Response): Promise<void> {
    const buffer = await this.service.exportArchive();
    const filename = `pulse-backup-${new Date().toISOString().slice(0, 10)}.zip`;
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': String(buffer.length),
    });
    res.send(buffer);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_IMPORT_BYTES } }))
  async import(@UploadedFile() file: Express.Multer.File | undefined): Promise<{ ok: true }> {
    if (!file) {
      throw new BadRequestException('Upload a .zip backup file');
    }
    await this.service.importArchive(file.buffer);
    return { ok: true };
  }
}
