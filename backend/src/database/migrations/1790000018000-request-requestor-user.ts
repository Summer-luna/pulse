import type { MigrationInterface, QueryRunner } from 'typeorm';

export class RequestRequestorUser1790000018000 implements MigrationInterface {
  name = 'RequestRequestorUser1790000018000';

  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`ALTER TABLE requests ADD COLUMN requestor_user_id uuid REFERENCES users(id) ON DELETE SET NULL`);
    await runner.query(`ALTER TABLE requests ALTER COLUMN requestor DROP NOT NULL`);
    await runner.query(`ALTER TABLE requests DROP COLUMN source`);
    await runner.query(`DROP TYPE request_source`);
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query(`CREATE TYPE request_source AS ENUM ('INTERNAL', 'EXTERNAL')`);
    await runner.query(`ALTER TABLE requests ADD COLUMN source request_source NOT NULL DEFAULT 'EXTERNAL'`);
    await runner.query(`UPDATE requests SET requestor = '' WHERE requestor IS NULL`);
    await runner.query(`ALTER TABLE requests ALTER COLUMN requestor SET NOT NULL`);
    await runner.query(`ALTER TABLE requests DROP COLUMN requestor_user_id`);
  }
}
