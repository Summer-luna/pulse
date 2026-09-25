import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DATA_TABLES, ISSUES_SELF_REF_COLUMN } from './data-transfer.constants.js';

export type TableDump = Record<string, Record<string, unknown>[]>;

@Injectable()
export class DataTransferRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async dumpTables(): Promise<TableDump> {
    const dump: TableDump = {};
    for (const table of DATA_TABLES) {
      dump[table] = await this.dataSource.query(`SELECT * FROM "${table}"`);
    }
    return dump;
  }

  async restoreTables(dump: TableDump): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const quotedTables = DATA_TABLES.map((table) => `"${table}"`).join(', ');
      await manager.query(`TRUNCATE TABLE ${quotedTables} RESTART IDENTITY CASCADE`);

      const deferredParents: { id: unknown; parentId: unknown }[] = [];

      for (const table of DATA_TABLES) {
        for (const row of dump[table] ?? []) {
          const data: Record<string, unknown> = { ...row };
          if (table === 'issues') {
            const parentId = data[ISSUES_SELF_REF_COLUMN];
            if (parentId) {
              deferredParents.push({ id: row.id, parentId });
            }
            data[ISSUES_SELF_REF_COLUMN] = null;
          }

          const columns = Object.keys(data);
          if (columns.length === 0) {
            continue;
          }
          const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
          const quotedColumns = columns.map((column) => `"${column}"`).join(', ');
          await manager.query(
            `INSERT INTO "${table}" (${quotedColumns}) VALUES (${placeholders})`,
            columns.map((column) => data[column]),
          );
        }
      }

      for (const { id, parentId } of deferredParents) {
        await manager.query(`UPDATE "issues" SET "${ISSUES_SELF_REF_COLUMN}" = $1 WHERE id = $2`, [parentId, id]);
      }
    });
  }
}
