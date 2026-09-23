import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReleasePipelines1790000005000 implements MigrationInterface {
  name = 'AddReleasePipelines1790000005000';

  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`CREATE TYPE release_pipeline_type AS ENUM ('SCHEDULED', 'CONTINUOUS')`);

    await runner.query(`
      CREATE TABLE release_pipelines (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        name varchar(80) NOT NULL,
        type release_pipeline_type NOT NULL DEFAULT 'CONTINUOUS',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )`);
    await runner.query(`CREATE INDEX release_pipelines_project_id_idx ON release_pipelines (project_id)`);

    await runner.query(`
      INSERT INTO release_pipelines (id, project_id, name, type)
      SELECT gen_random_uuid(), p.id, p.name || ' Releases', 'CONTINUOUS'
      FROM projects p WHERE EXISTS (SELECT 1 FROM releases r WHERE r.project_id = p.id)`);

    await runner.query(`ALTER TABLE releases ADD COLUMN pipeline_id uuid REFERENCES release_pipelines(id) ON DELETE CASCADE`);
    await runner.query(`
      UPDATE releases r SET pipeline_id = rp.id
      FROM release_pipelines rp WHERE rp.project_id = r.project_id`);
    await runner.query(`ALTER TABLE releases ALTER COLUMN pipeline_id SET NOT NULL`);
    await runner.query(`CREATE INDEX releases_pipeline_id_idx ON releases (pipeline_id)`);
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query(`ALTER TABLE releases DROP COLUMN pipeline_id`);
    await runner.query(`DROP TABLE release_pipelines`);
    await runner.query(`DROP TYPE release_pipeline_type`);
  }
}
