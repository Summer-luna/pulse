import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLabels1790000004000 implements MigrationInterface {
  name = 'AddLabels1790000004000';

  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`
      CREATE TABLE labels (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(40) NOT NULL UNIQUE,
        color varchar(16) NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )`);

    await runner.query(`
      CREATE TABLE issue_labels (
        issue_id uuid NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
        label_id uuid NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
        PRIMARY KEY (issue_id, label_id)
      )`);
    await runner.query(`CREATE INDEX issue_labels_label_id_idx ON issue_labels (label_id)`);

    await runner.query(`
      INSERT INTO labels (name, color) VALUES
        ('Feature', '#a78bfa'),
        ('Bug', '#e5484d'),
        ('Improvement', '#4ea7fc')`);
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query(`DROP TABLE issue_labels`);
    await runner.query(`DROP TABLE labels`);
  }
}
