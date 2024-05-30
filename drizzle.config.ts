<<<<<<< HEAD
import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
	schema: './src/drizzle/schema.ts',
	out: './src/drizzle',
	driver: 'mysql2',
	dbCredentials: {
		connectionString: process.env.PROD_DATABASE_URL as string
	},
=======
import { type Config } from 'drizzle-kit';
import { env } from '~/env';

export default {
	schema: './src/server/db/schema.ts',
	driver: 'pg',
	dbCredentials: { connectionString: env.POSTGRES_URL },
>>>>>>> app-dir
	tablesFilter: ['millpave_*']
} satisfies Config;
