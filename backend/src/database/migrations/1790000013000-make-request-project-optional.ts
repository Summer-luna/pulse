import type { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeRequestProjectOptional1790000013000 implements MigrationInterface {
  name = 'MakeRequestProjectOptional1790000013000';

  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`ALTER TABLE requests ALTER COLUMN project_id DROP NOT NULL`);
    await runner.query(`ALTER TABLE requests DROP CONSTRAINT requests_project_id_fkey`);
    await runner.query(
      `ALTER TABLE requests ADD CONSTRAINT requests_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL`,
    );
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query(`DELETE FROM requests WHERE project_id IS NULL`);
    await runner.query(`ALTER TABLE requests DROP CONSTRAINT requests_project_id_fkey`);
    await runner.query(
      `ALTER TABLE requests ADD CONSTRAINT requests_project_id_fkey FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE`,
    );
    await runner.query(`ALTER TABLE requests ALTER COLUMN project_id SET NOT NULL`);
  }
}
