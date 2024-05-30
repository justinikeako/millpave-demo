import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';

import { env } from '~/env';
import * as schema from './schema';

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
	conn: typeof sql;
};

const conn = globalForDb.conn ?? sql;
if (env.NODE_ENV !== 'production') globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
