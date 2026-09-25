import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectVisibility1790000016000 implements MigrationInterface {
  name = 'AddProjectVisibility1790000016000';

  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`CREATE TYPE project_visibility AS ENUM ('PUBLIC', 'PRIVATE')`);
    await runner.query(`ALTER TABLE projects ADD COLUMN visibility project_visibility NOT NULL DEFAULT 'PUBLIC'`);
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query(`ALTER TABLE projects DROP COLUMN visibility`);
    await runner.query(`DROP TYPE project_visibility`);
  }
}
