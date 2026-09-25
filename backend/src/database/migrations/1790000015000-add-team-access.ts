import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTeamAccess1790000015000 implements MigrationInterface {
  name = 'AddTeamAccess1790000015000';

  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`CREATE TYPE team_access AS ENUM ('PUBLIC', 'PRIVATE')`);
    await runner.query(`ALTER TABLE teams ADD COLUMN access team_access NOT NULL DEFAULT 'PUBLIC'`);
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query(`ALTER TABLE teams DROP COLUMN access`);
    await runner.query(`DROP TYPE team_access`);
  }
}
