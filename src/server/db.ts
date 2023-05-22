import { drizzle } from 'drizzle-orm/mysql2';

import mysql from 'mysql2/promise';
import * as schema from '@/db/schema';

// Create the connection
const connection = await mysql.createConnection({
	database: process.env.DB_NAME,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS
});

export const db = drizzle(connection, {
	schema
});
