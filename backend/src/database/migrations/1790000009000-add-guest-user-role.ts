import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGuestUserRole1790000009000 implements MigrationInterface {
  name = 'AddGuestUserRole1790000009000';

  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`ALTER TYPE user_role ADD VALUE 'GUEST'`);
  }

  async down(): Promise<void> {
    // Postgres can't drop an enum value; a rollback would need to recreate the type.
  }
}
