import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddComments1790000006000 implements MigrationInterface {
  name = 'AddComments1790000006000';

  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`ALTER TABLE issues ADD COLUMN creator_id uuid REFERENCES users(id) ON DELETE SET NULL`);

    await runner.query(`
      CREATE TABLE comments (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        issue_id uuid NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
        author_id uuid REFERENCES users(id) ON DELETE SET NULL,
        body text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )`);
    await runner.query(`CREATE INDEX comments_issue_id_idx ON comments (issue_id)`);
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query(`DROP TABLE comments`);
    await runner.query(`ALTER TABLE issues DROP COLUMN creator_id`);
  }
}
