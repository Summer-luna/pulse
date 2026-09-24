import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomers1790000011000 implements MigrationInterface {
  name = 'AddCustomers1790000011000';

  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`CREATE TYPE customer_status AS ENUM ('ACTIVE', 'PROSPECT', 'CHURNED')`);

    await runner.query(`
      CREATE TABLE customers (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(120) NOT NULL,
        status customer_status NOT NULL DEFAULT 'ACTIVE',
        owner_id uuid REFERENCES users(id) ON DELETE SET NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )`);

    await runner.query(`ALTER TABLE requests ADD COLUMN customer_id uuid REFERENCES customers(id) ON DELETE SET NULL`);
    await runner.query(`CREATE INDEX requests_customer_id_idx ON requests (customer_id)`);
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query(`ALTER TABLE requests DROP COLUMN customer_id`);
    await runner.query(`DROP TABLE customers`);
    await runner.query(`DROP TYPE customer_status`);
  }
}
