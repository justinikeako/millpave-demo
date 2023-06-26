import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default {
	schema: './src/drizzle/schema.ts',
	out: './src/drizzle',
	dbCredentials: {
		connectionString: process.env.PROD_DATABASE_URL as string
	}
} satisfies Config;
