import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
	schema: './src/drizzle/schema.ts',
	out: './src/drizzle',
	driver: 'mysql2',
	dbCredentials: {
		connectionString: process.env.PROD_DATABASE_URL as string
	},
	tablesFilter: ['millpave_*']
} satisfies Config;
