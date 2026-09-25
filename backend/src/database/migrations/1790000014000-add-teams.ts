import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTeams1790000014000 implements MigrationInterface {
  name = 'AddTeams1790000014000';

  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`
      CREATE TABLE teams (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(80) NOT NULL,
        key varchar(5) NOT NULL UNIQUE,
        description text NOT NULL DEFAULT '',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )`);

    await runner.query(`
      CREATE TABLE team_members (
        team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        PRIMARY KEY (team_id, user_id)
      )`);
    await runner.query(`CREATE INDEX team_members_user_id_idx ON team_members (user_id)`);

    await runner.query(`ALTER TABLE projects ADD COLUMN team_id uuid REFERENCES teams(id) ON DELETE SET NULL`);
    await runner.query(`CREATE INDEX projects_team_id_idx ON projects (team_id)`);
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query(`ALTER TABLE projects DROP COLUMN team_id`);
    await runner.query(`DROP TABLE team_members`);
    await runner.query(`DROP TABLE teams`);
  }
}
