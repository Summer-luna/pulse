import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectFields1790000002000 implements MigrationInterface {
  name = 'AddProjectFields1790000002000';

  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`CREATE TYPE project_priority AS ENUM ('NO_PRIORITY','URGENT','HIGH','MEDIUM','LOW')`);
    await runner.query(`ALTER TABLE projects ADD COLUMN priority project_priority NOT NULL DEFAULT 'NO_PRIORITY'`);
    await runner.query(`ALTER TABLE projects ADD COLUMN start_date date`);

    await runner.query(`
      CREATE TABLE project_members (
        project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        PRIMARY KEY (project_id, user_id)
      )`);
    await runner.query(`CREATE INDEX project_members_user_id_idx ON project_members (user_id)`);
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query(`DROP TABLE project_members`);
    await runner.query(`ALTER TABLE projects DROP COLUMN start_date`);
    await runner.query(`ALTER TABLE projects DROP COLUMN priority`);
    await runner.query(`DROP TYPE project_priority`);
  }
}
