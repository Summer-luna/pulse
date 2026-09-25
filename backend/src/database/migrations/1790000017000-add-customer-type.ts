import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomerType1790000017000 implements MigrationInterface {
  name = 'AddCustomerType1790000017000';

  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`CREATE TYPE customer_type AS ENUM ('EXTERNAL', 'INTERNAL')`);
    await runner.query(`ALTER TABLE customers ADD COLUMN type customer_type NOT NULL DEFAULT 'EXTERNAL'`);
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query(`ALTER TABLE customers DROP COLUMN type`);
    await runner.query(`DROP TYPE customer_type`);
  }
}
