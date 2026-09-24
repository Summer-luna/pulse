import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRequests1790000010000 implements MigrationInterface {
  name = 'AddRequests1790000010000';

  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`CREATE TYPE request_source AS ENUM ('INTERNAL', 'EXTERNAL')`);
    await runner.query(`CREATE TYPE request_status AS ENUM ('OPEN', 'CONVERTED', 'DECLINED')`);

    await runner.query(`
      CREATE TABLE requests (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        title varchar(200) NOT NULL,
        description text NOT NULL DEFAULT '',
        requestor varchar(120) NOT NULL,
        source request_source NOT NULL DEFAULT 'EXTERNAL',
        status request_status NOT NULL DEFAULT 'OPEN',
        converted_issue_id uuid REFERENCES issues(id) ON DELETE SET NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )`);
    await runner.query(`CREATE INDEX requests_project_id_idx ON requests (project_id)`);
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query(`DROP TABLE requests`);
    await runner.query(`DROP TYPE request_status`);
    await runner.query(`DROP TYPE request_source`);
  }
}
