import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { BadRequestException, Injectable } from '@nestjs/common';
import AdmZip from 'adm-zip';
import { UPLOADS_DIR } from '../uploads/uploads.constants.js';
import { DataTransferRepository, type TableDump } from './data-transfer.repository.js';

const DATA_ENTRY = 'data.json';
const UPLOADS_PREFIX = 'uploads/';

interface ArchivePayload {
  exportedAt: string;
  tables: TableDump;
}

@Injectable()
export class DataTransferService {
  constructor(private readonly repository: DataTransferRepository) {}

  async exportArchive(): Promise<Buffer> {
    const tables = await this.repository.dumpTables();
    const payload: ArchivePayload = { exportedAt: new Date().toISOString(), tables };

    const zip = new AdmZip();
    zip.addFile(DATA_ENTRY, Buffer.from(JSON.stringify(payload), 'utf8'));

    await mkdir(UPLOADS_DIR, { recursive: true });
    for (const filename of await readdir(UPLOADS_DIR)) {
      zip.addFile(`${UPLOADS_PREFIX}${filename}`, await readFile(join(UPLOADS_DIR, filename)));
    }

    return zip.toBuffer();
  }

  async importArchive(buffer: Buffer): Promise<void> {
    let zip: AdmZip;
    try {
      zip = new AdmZip(buffer);
    } catch {
      throw new BadRequestException('Not a valid backup archive');
    }

    const dataEntry = zip.getEntry(DATA_ENTRY);
    if (!dataEntry) {
      throw new BadRequestException('Archive is missing data.json');
    }

    let payload: ArchivePayload;
    try {
      payload = JSON.parse(dataEntry.getData().toString('utf8')) as ArchivePayload;
    } catch {
      throw new BadRequestException('Archive data.json is not valid JSON');
    }
    if (!payload.tables || typeof payload.tables !== 'object') {
      throw new BadRequestException('Archive data.json has an unexpected shape');
    }

    await this.repository.restoreTables(payload.tables);

    await mkdir(UPLOADS_DIR, { recursive: true });
    await Promise.all(
      (await readdir(UPLOADS_DIR)).map((filename) => rm(join(UPLOADS_DIR, filename)).catch(() => undefined)),
    );

    for (const entry of zip.getEntries()) {
      if (entry.isDirectory || !entry.entryName.startsWith(UPLOADS_PREFIX)) {
        continue;
      }
      const filename = entry.entryName.slice(UPLOADS_PREFIX.length);
      // Uploaded filenames are always flat, randomly generated names (see UploadsController) —
      // reject anything else to avoid writing outside UPLOADS_DIR from a crafted archive.
      if (!filename || filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
        continue;
      }
      await writeFile(join(UPLOADS_DIR, filename), entry.getData());
    }
  }
}
