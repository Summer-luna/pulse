import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomerFields1790000012000 implements MigrationInterface {
  name = 'AddCustomerFields1790000012000';

  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`ALTER TYPE customer_status ADD VALUE 'LOST'`);
    await runner.query(`CREATE TYPE customer_tier AS ENUM ('TIER_1', 'TIER_2', 'TIER_3')`);

    await runner.query(`ALTER TABLE customers ADD COLUMN tier customer_tier`);
    await runner.query(`ALTER TABLE customers ADD COLUMN annual_revenue integer`);
    await runner.query(`ALTER TABLE customers ADD COLUMN size varchar(40)`);
    await runner.query(`ALTER TABLE customers ADD COLUMN domains text[] NOT NULL DEFAULT '{}'`);
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query(`ALTER TABLE customers DROP COLUMN domains`);
    await runner.query(`ALTER TABLE customers DROP COLUMN size`);
    await runner.query(`ALTER TABLE customers DROP COLUMN annual_revenue`);
    await runner.query(`ALTER TABLE customers DROP COLUMN tier`);
    await runner.query(`DROP TYPE customer_tier`);
    // Postgres can't drop an enum value; a rollback would need to recreate customer_status.
  }
}
