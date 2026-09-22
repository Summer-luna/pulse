import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1790000000000 implements MigrationInterface {
  name = 'InitSchema1790000000000';

  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);
    await runner.query(`CREATE TYPE project_status AS ENUM ('BACKLOG','PLANNED','IN_PROGRESS','COMPLETED','CANCELED')`);
    await runner.query(`CREATE TYPE issue_status AS ENUM ('BACKLOG','TODO','IN_PROGRESS','IN_REVIEW','DONE','CANCELED')`);
    await runner.query(`CREATE TYPE issue_priority AS ENUM ('NO_PRIORITY','URGENT','HIGH','MEDIUM','LOW')`);
    await runner.query(`CREATE TYPE release_status AS ENUM ('PLANNED','IN_PROGRESS','COMPLETED','CANCELED')`);

    await runner.query(`
      CREATE TABLE users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(80) NOT NULL,
        email varchar(200) NOT NULL UNIQUE,
        color varchar(16) NOT NULL DEFAULT '#5e6ad2',
        created_at timestamptz NOT NULL DEFAULT now()
      )`);

    await runner.query(`
      CREATE TABLE projects (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(80) NOT NULL,
        key varchar(5) NOT NULL UNIQUE,
        description text NOT NULL DEFAULT '',
        status project_status NOT NULL DEFAULT 'BACKLOG',
        lead_id uuid REFERENCES users(id) ON DELETE SET NULL,
        target_date date,
        issue_counter int NOT NULL DEFAULT 0,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )`);

    await runner.query(`
      CREATE TABLE releases (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        name varchar(80) NOT NULL,
        version varchar(40),
        description text NOT NULL DEFAULT '',
        status release_status NOT NULL DEFAULT 'PLANNED',
        target_date date,
        released_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )`);
    await runner.query(`CREATE INDEX releases_project_id_idx ON releases (project_id)`);

    await runner.query(`
      CREATE TABLE issues (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        number int NOT NULL,
        title varchar(200) NOT NULL,
        description text NOT NULL DEFAULT '',
        status issue_status NOT NULL DEFAULT 'BACKLOG',
        priority issue_priority NOT NULL DEFAULT 'NO_PRIORITY',
        assignee_id uuid REFERENCES users(id) ON DELETE SET NULL,
        parent_id uuid REFERENCES issues(id) ON DELETE SET NULL,
        release_id uuid REFERENCES releases(id) ON DELETE SET NULL,
        due_date date,
        completed_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT issues_project_number_key UNIQUE (project_id, number),
        CONSTRAINT issues_not_own_parent CHECK (parent_id IS NULL OR parent_id <> id)
      )`);
    await runner.query(`CREATE INDEX issues_project_id_idx ON issues (project_id)`);
    await runner.query(`CREATE INDEX issues_parent_id_idx ON issues (parent_id)`);
    await runner.query(`CREATE INDEX issues_release_id_idx ON issues (release_id)`);
    await runner.query(`CREATE INDEX issues_assignee_id_idx ON issues (assignee_id)`);
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query(`DROP TABLE issues`);
    await runner.query(`DROP TABLE releases`);
    await runner.query(`DROP TABLE projects`);
    await runner.query(`DROP TABLE users`);
    await runner.query(`DROP TYPE release_status`);
    await runner.query(`DROP TYPE issue_priority`);
    await runner.query(`DROP TYPE issue_status`);
    await runner.query(`DROP TYPE project_status`);
  }
}
