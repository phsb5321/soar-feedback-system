import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/soar_feedback';

export async function getDb() {
  const client = new Client({ connectionString });
  await client.connect();
  return drizzle(client, { schema });
}
