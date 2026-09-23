import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBlockedIssueStatus1790000007000 implements MigrationInterface {
  name = 'AddBlockedIssueStatus1790000007000';

  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`ALTER TYPE issue_status ADD VALUE 'BLOCKED'`);
  }

  async down(): Promise<void> {
    // Postgres can't drop an enum value; a rollback would need to recreate the type.
  }
}
