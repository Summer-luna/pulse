import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIssueEstimate1790000003000 implements MigrationInterface {
  name = 'AddIssueEstimate1790000003000';

  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`ALTER TABLE issues ADD COLUMN estimate smallint`);
    await runner.query(`ALTER TABLE issues ADD CONSTRAINT issues_estimate_check CHECK (estimate IN (0, 1, 2, 3, 5, 8))`);
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query(`ALTER TABLE issues DROP CONSTRAINT issues_estimate_check`);
    await runner.query(`ALTER TABLE issues DROP COLUMN estimate`);
  }
}
