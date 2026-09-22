import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordHash1790000001000 implements MigrationInterface {
  name = 'AddPasswordHash1790000001000';

  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`ALTER TABLE users ADD COLUMN password_hash varchar(200) NOT NULL DEFAULT ''`);
    await runner.query(`ALTER TABLE users ALTER COLUMN password_hash DROP DEFAULT`);
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query(`ALTER TABLE users DROP COLUMN password_hash`);
  }
}
