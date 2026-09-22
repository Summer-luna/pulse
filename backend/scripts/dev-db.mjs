import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import EmbeddedPostgres from 'embedded-postgres';

const databaseDir = join(fileURLToPath(new URL('..', import.meta.url)), '.pgdata');
const port = Number(process.env.DEV_DB_PORT ?? 54329);

const pg = new EmbeddedPostgres({
  databaseDir,
  user: 'postgres',
  password: 'postgres',
  port,
  persistent: true,
});

if (!existsSync(join(databaseDir, 'PG_VERSION'))) {
  await pg.initialise();
}
await pg.start();
try {
  await pg.createDatabase('linear');
} catch {
  // 数据库已存在
}

console.log(`PostgreSQL ready: postgres://postgres:postgres@localhost:${port}/linear`);

const shutdown = async () => {
  await pg.stop();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
