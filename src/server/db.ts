// import { drizzle } from 'drizzle-orm/mysql2';

// import mysql from 'mysql2/promise';
import * as schema from '@/db/schema';

// // Create the connection
// const connection = await mysql.createConnection({
// 	database: process.env.LOCAL_DB_NAME,
// 	host: process.env.LOCAL_DB_HOST,
// 	user: process.env.LOCAL_DB_USER,
// 	password: process.env.LOCAL_DB_PASS
// });

// export const db = drizzle(connection, {
// 	schema
// });

import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';

// create the connection
const connection = connect({
	host: process.env['PROD_DATABASE_HOST'],
	username: process.env['PROD_DATABASE_USERNAME'],
	password: process.env['PROD_DATABASE_PASSWORD']
});

export const db = drizzle(connection, { schema });
