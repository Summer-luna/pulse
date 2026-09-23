import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRole1790000008000 implements MigrationInterface {
  name = 'AddUserRole1790000008000';

  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`CREATE TYPE user_role AS ENUM ('ADMIN', 'MEMBER')`);
    await runner.query(`ALTER TABLE users ADD COLUMN role user_role NOT NULL DEFAULT 'MEMBER'`);
    await runner.query(`UPDATE users SET role = 'ADMIN' WHERE email = 'xinyue@testuni.com'`);
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query(`ALTER TABLE users DROP COLUMN role`);
    await runner.query(`DROP TYPE user_role`);
  }
}
